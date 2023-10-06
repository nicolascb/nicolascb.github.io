---
title: Recarregar certificado TLS dinamicamente em Go
author: Nicolas Barbosa
pubDatetime: 2023-10-04T22:07:00-03:00
postSlug: golang-reload-certs-dinamically
featured: true
draft: false
tags:
  - golang
ogImage: ""
description: Dica de como recarregar certificado TLS sem precisar reiniciar a API
---

# Renovando certificado TLS dinamicamente em Go

## Introdução

As vezes não temos uma camada de infraestrutura para lidar com certificados TLS e todas as outras questões que precisam para que possamos expor uma API HTTPS.

Quando temos essa situação, cabe a aplicação ficar responsável por carregar o arquivo de certificado.

E então nos perguntamos: quando esse certificado expirar, como faço para recarregar um novo certificado sem a necessidade de reiniciar minha aplicação?

O foco desse artigo é demonstrar em código o recarregamento dinâmico do certificado na API, não irei abordar estratégias de renovação do certificado em si.

## O problema

É comum quando vamos pesquisar em como criar uma API HTTPS em Go, nos depararmos com um código semelhante a esse:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "hello")
}

func main() {
	http.HandleFunc("/hello", hello)
	log.Fatal(http.ListenAndServeTLS(":443", "server.crt", "server.key", nil))
}
```

De certa forma esse código funciona, mas essa linha vai nos dar uma dor de cabeça no futuro:

```go
http.ListenAndServeTLS(":443", "server.crt", "server.key", nil)
```

Dessa maneira estamos dizendo para carregar esses arquivos durante a inicialização do serviço e a única forma para recarregar esse certificado, será reiniciando a aplicação.

No resumo, quando o certificado expirar, teremos que reiniciar a aplicação para carregar o certificado novo.

## Carregando o certificado dinamicamente

Uma solução para esse problema envolve o carregamento dinâmico do certificado TLS e conseguimos fazer isso através do callback `GetCertificate`, definido dentro de `tls.Config` e que podemos fazer da seguinte forma:

```go
package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
)

func main() {
	m := http.NewServeMux()
	m.HandleFunc("/hello", hello)

	tlsConfig := &tls.Config{
		GetCertificate: getCert,
	}

	srv := http.Server{
		Addr:      ":9443",
		Handler:   m,
		TLSConfig: tlsConfig,
	}

	srv.ListenAndServeTLS("", "")
}

func getCert(info *tls.ClientHelloInfo) (*tls.Certificate, error) {
	cer, err := tls.LoadX509KeyPair("localhost.crt", "localhost.key")
	if err != nil {
		return nil, err
	}

	return &cer, nil
}

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "hello")
}
```

Dessa forma a nossa função `getCert` será invocada sempre que for necessário carregar o certificado, se houver mudanças nesse arquivo, a próxima requisição irá recarregá-lo.

## Recarregando o certificado apenas se o atual estiver expirado

No exemplo anterior, vimos como recarregar o certificado sem a necessidade de reiniciar a aplicação, mas estamos fazendo isso para todas as requisições, podemos evitar esse trabalho se validarmos se o certificado expirou.

Um exemplo bem simples de como podemos fazer isso:

```go
var (
	certMu     sync.Mutex
	currentCer *tls.Certificate
	certExpiry time.Time
)

func getCert(info *tls.ClientHelloInfo) (*tls.Certificate, error) {
	certMu.Lock()
	defer certMu.Unlock()

	// Verifique se o certificado atual já expirou
	if time.Now().After(certExpiry) {
		// O certificado atual expirou, então carregue um novo
		cer, err := tls.LoadX509KeyPair("localhost.crt", "localhost.key")
		if err != nil {
			return nil, err
		}

		// Atualize o certificado atual e a data de expiração
		currentCer = &cer
		certExpiry = cer.Leaf.NotAfter
	}

	return currentCer, nil
}
```

Também poderíamos implementar alguma lógica de renovação do certificado, no exemplo de cima, estamos considerando que existe uma rotina que renova o certificado e substitui os arquivos antigos.