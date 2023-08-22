---
title: Testando handlers HTTP em Go
author: Nicolas Barbosa
pubDatetime: 2021-01-16T22:07:00-03:00
postSlug: golang-http-handlers-testing
featured: true
draft: false
tags:
  - golang
  - testing
ogImage: ""
description: Criamos nossa primeira API em Go e agora? Como podemos testar?
---

# Testando handlers HTTP em Go

## Introdução

Lembro que precisei fazer algumas pesquisas para construir testes para a minha primeira API escrita em Go, nesse post vou escrever um breve exemplo de como podemos utilizar o pacote `httptest` para testar nossos handlers http.  

## Como testar handlers http em Go?

Para que possamos testar qualquer handler HTTP, precisaremos de uma estrutura capaz de construir e armazenar a resposta do handler, como qual foi o status http respondido, valores no header, body e etc. 

O pacote `httptest` vai facilitar nosso trabalho com a função [`httptest.NewRecorder`](https://golang.org/pkg/net/http/httptest/#NewRecorder).


```go
// NewRecorder returns an initialized ResponseRecorder.
func NewRecorder() *ResponseRecorder {
	return &ResponseRecorder{
		HeaderMap: make(http.Header),
		Body:      new(bytes.Buffer),
		Code:      200,
	}
}
```

Com isso teremos a estrutura [`httptest.ResponseRecorder`](https://golang.org/pkg/net/http/httptest/#ResponseRecorder) uma implementação de [`http.ResponseWriter`](https://golang.org/pkg/net/http/#ResponseWriter):

```go
// ResponseRecorder is an implementation of http.ResponseWriter that
// records its mutations for later inspection in tests.
type ResponseRecorder struct {

	// Code is the HTTP response code set by WriteHeader.
	//
	// Note that if a Handler never calls WriteHeader or Write,
	// this might end up being 0, rather than the implicit
	// http.StatusOK. To get the implicit value, use the Result
	// method.
	Code int

	// HeaderMap contains the headers explicitly set by the Handler.
	// It is an internal detail.
	//
	// Deprecated: HeaderMap exists for historical compatibility
	// and should not be used. To access the headers returned by a handler,
	// use the Response.Header map as returned by the Result method.
	HeaderMap http.Header

	// Body is the buffer to which the Handler's Write calls are sent.
	// If nil, the Writes are silently discarded.
	Body *bytes.Buffer

	// Flushed is whether the Handler called Flush.
	Flushed bool

	result      *http.Response // cache of Result's return value
	snapHeader  http.Header    // snapshot of HeaderMap at first Write
	wroteHeader bool
}
```

## API de exemplo

Na nossa API de exemplo, temos o handler *`/check-is-prime`* que é responsável por responder se um número é primo ou não.

É esse endpoint que vamos testar.


```go
const (
    apiAddress = ":8081"
)

func main() {
	mux := setupMux()
	http.ListenAndServe(apiAddress, mux)
}

func setupMux() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/check-is-prime", isPrimeHandler)
	return mux
}

// isPrimeHandler imprime na tela se o parâmetro `number` é um número primo ou não
func isPrimeHandler(w http.ResponseWriter, r *http.Request) {
	number := r.URL.Query().Get("number")
	n, err := strconv.Atoi(number)
	if err != nil {
		// Só podemos aceitar inteiros, vamos invalidar a requisição
		http.Error(w, "o parâmetro `number` não é um número válido", http.StatusBadRequest)
		return
	}

	fmt.Fprint(w, strconv.FormatBool(isPrime(int64(n))))
}

func isPrime(n int64) bool {
	return big.NewInt(n).ProbablyPrime(0)
}

```


## Primeiro teste 

A lógica de nossos testes será bem simples, para cada teste, precisaremos montar a requisição http e informar valores esperados para essa requisição, no nosso caso vamos comparar o status de resposta e também o conteúdo do body.


```go
func Test_IsPrimeHandler(t *testing.T) {

    // É importante isolar a criação do mux para que possamos utilizar
    // nos testes
	handler := setupMux()

	type args struct {
		req *http.Request
	}

	tests := []struct {
		name     string
		args     func(t *testing.T) args
		wantCode int
		wantBody string
	}{
		{
			name: "Deve retornar http.StatusBadRequest se número for inválido",
			args: func(*testing.T) args {
				req, err := http.NewRequest("GET", "/check-is-prime", nil)
				if err != nil {
					t.Fatalf("falha em gerar requisição de teste: %s", err.Error())
				}

				q := req.URL.Query()
				q.Add("number", "isso_nao_eh_um_numero")
				req.URL.RawQuery = q.Encode()

				return args{
					req: req,
				}
			},
			wantCode: http.StatusBadRequest,
			wantBody: "o parâmetro `number` não é um número válido\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tArgs := tt.args(t)
			resp := httptest.NewRecorder()
			handler.ServeHTTP(resp, tArgs.req)

			if resp.Result().StatusCode != tt.wantCode {
				t.Fatalf("código de resposta http diferente do esperado, recebido: %d, esperava-se: %d", resp.Result().StatusCode, tt.wantCode)
			}

			if resp.Body.String() != tt.wantBody {
				t.Fatalf("body http diferente do esperado, recebido: %s, esperava-se: %s", resp.Body.String(), tt.wantBody)
			}

		})
	}
}


```

## Adicionando mais testes

Agora que já temos a estrutura de tabela para nossos testes, podemos inserir outros casos:


```go
func Test_IsPrimeHandler(t *testing.T) {

    // É importante isolar a criação do mux para que possamos utilizar
    // nos testes
	handler := setupMux()

	type args struct {
		req *http.Request
	}

	tests := []struct {
		name     string
		args     func(t *testing.T) args
		wantCode int
		wantBody string
	}{
		{
			name: "Deve retornar http.StatusBadRequest se número for inválido",
			args: func(*testing.T) args {
				req, err := http.NewRequest("GET", "/check-is-prime", nil)
				if err != nil {
					t.Fatalf("falha em gerar requisição de teste: %s", err.Error())
				}

				q := req.URL.Query()
				q.Add("number", "isso_nao_eh_um_numero")
				req.URL.RawQuery = q.Encode()

				return args{
					req: req,
				}
			},
			wantCode: http.StatusBadRequest,
			wantBody: "o parâmetro `number` não é um número válido\n",
		},
		{
			name: "Deve retornar http.StatusOk e verdadeiro, se número for primo",
			args: func(*testing.T) args {
				req, err := http.NewRequest("GET", "/check-is-prime", nil)
				if err != nil {
					t.Fatalf("falha em gerar requisição de teste: %s", err.Error())
				}

				q := req.URL.Query()
				q.Add("number", "7")
				req.URL.RawQuery = q.Encode()

				return args{
					req: req,
				}
			},
			wantCode: http.StatusOK,
			wantBody: "true",
		},
		{
			name: "Deve retornar http.StatusOk e falso, se número não for primo",
			args: func(*testing.T) args {
				req, err := http.NewRequest("GET", "/check-is-prime", nil)
				if err != nil {
					t.Fatalf("falha em gerar requisição de teste: %s", err.Error())
				}

				q := req.URL.Query()
				q.Add("number", "1")
				req.URL.RawQuery = q.Encode()

				return args{
					req: req,
				}
			},
			wantCode: http.StatusOK,
			wantBody: "false",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tArgs := tt.args(t)
			resp := httptest.NewRecorder()
			handler.ServeHTTP(resp, tArgs.req)

			if resp.Result().StatusCode != tt.wantCode {
				t.Fatalf("código de resposta http diferente do esperado, recebido: %d, esperava-se: %d", resp.Result().StatusCode, tt.wantCode)
			}

			if resp.Body.String() != tt.wantBody {
				t.Fatalf("body http diferente do esperado, recebido: %s, esperava-se: %s", resp.Body.String(), tt.wantBody)
			}

		})
	}
}
```

## Conclusão

A biblioteca padrão do Go é realmente muito poderosa e vimos como o pacote `httptest` pode ser uma ferramenta muito bacana para criar nossos testes http.

Ter uma implementação de testes da interface `http.ResponseWriter` facilitou muito nosso trabalho e poder rodar vários testes em uma função também deixou o fonte mais limpo e legível.

```go
=== RUN   Test_IsPrimeHandler
=== RUN   Test_IsPrimeHandler/Deve_retornar_http.StatusBadRequest_se_número_for_inválido
=== RUN   Test_IsPrimeHandler/Deve_retornar_http.StatusOk_e_verdadeiro,_se_número_for_primo
=== RUN   Test_IsPrimeHandler/Deve_retornar_http.StatusOk_e_falso,_se_número_não_for_primo
--- PASS: Test_IsPrimeHandler (0.00s)
    --- PASS: Test_IsPrimeHandler/Deve_retornar_http.StatusBadRequest_se_número_for_inválido (0.00s)
    --- PASS: Test_IsPrimeHandler/Deve_retornar_http.StatusOk_e_verdadeiro,_se_número_for_primo (0.00s)
    --- PASS: Test_IsPrimeHandler/Deve_retornar_http.StatusOk_e_falso,_se_número_não_for_primo (0.00s)
PASS
coverage: 83.3% of statements
ok      github.com/nicolascb/blog-posts/1-http-api-test 0.003s  coverage: 83.3% of statements
```

