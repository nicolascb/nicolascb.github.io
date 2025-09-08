---
title: Completei 10 anos trabalhando com Golang
author: Nicolas Barbosa
pubDatetime: 2025-09-08T08:07:00-03:00
postSlug: 10years-of-golang
featured: true
draft: false
tags:
  - golang
ogImage: ""
description: Desafios e aprendizados ao longo de uma década com Go
---

Há 10 anos atrás tive meu primeiro contato com a linguagem `Go`, desde então, toda minha trajetória profissional se entrelaça com essa linguagem.

- [Início da jornada](#início-da-jornada)
- [Primeiro contato com a linguagem](#primeiro-contato-com-a-linguagem)
  - [Contexto da escolha da linguagem](#contexto-da-escolha-da-linguagem)
  - [O problema que queríamos resolver](#o-problema-que-queríamos-resolver)
- [Como era a linguagem em 2015](#como-era-a-linguagem-em-2015)
- [Aprendizados ao longo da jornada](#aprendizados-ao-longo-da-jornada)
- [Filosofia de simplicidade](#filosofia-de-simplicidade)
- [Contribuições open source](#contribuições-open-source)
- [Resumo do que aprendi nesses 10 anos com Go](#resumo-do-que-aprendi-nesses-10-anos-com-go)

### Início da jornada

Em 2015 eu estava trabalhando como Analista Linux na [America Net](https://www.linkedin.com/company/americanet/) (hoje Vero), desenvolvia e dava manutenção em muitos scripts em `PHP`, `Perl` e `Shell scripts`.

Eu era responsável por manter o funcionamento de diversos servidores `Linux (Slackware)` que rodavam [Asterisk](https://www.asterisk.org/) e entregavam uma solução completa de telefonia para os clientes.

Eu atuava como desenvolvedor basicamente em dois cenários: projetos internos e novas features que se conectavam ao Asterisk.

Trabalhar com `Linux` sempre foi meu desejo, eu já havia me certificado com a LPIC-1 e em breve planejava a LPIC-2 e LPIC-3, até conhecer Golang...

### Primeiro contato com a linguagem

Quando trabalhamos com VoIP, tudo fica muito sensível e perceptível a nível de usuário.
Pois imagina, se você hoje acessar um site, cadastrar algum formulário ou simplesmente fazer login em alguma plataforma, é ok se algum processo demorar alguns segundos. Porém, quando falamos de alguns segundos de atraso em chamadas telefônicas, isso é praticamente a indisponibilidade do sistema, um caos, fica impossível conversar. E vocês nem imaginam o quanto irritadas as pessoas ficam quando não conseguem completar uma ligação.

Foi nesse cenário de caos, que conheci `Golang`.

Eu tinha um desafio: melhorar a performance do canal de atendimento da matriz.

#### Contexto da escolha da linguagem

O canal de atendimento da matriz foi meu primeiro grande projeto, era escrita em uma linguagem específica do Asterisk, onde de forma imperativa vamos colocando as instruções e que são executadas de forma sequencial.

Era possível executar scripts externos através de uma interface chamada AGI, para vocês entenderem, é algo como isso:

```bash
[ivr-principal]
exten => s,1,Answer()
 same => n,Background(bemvindo)       ; toca "bemvindo.gsm" (ex: "Bem-vindo, digite 1 para vendas, 2 para suporte")
 same => n,WaitExten(5)               ; espera até 5s por um dígito

exten => 1,1,Playback(voce-escolheu-vendas)
 same => n,AGI(ivr_vendas.php)        ; executa script em PHP
 same => n,Hangup()

exten => 2,1,Playback(voce-escolheu-suporte)
 same => n,AGI(ivr_suporte.php)       ; executa script em PHP
 same => n,Hangup()
```

No nosso caso, a URA era bem complexa e com muitos recursos avançados, se conectava com diversos sistemas internos e externos, como CRM, ERP, sistemas de bilhetagem, etc. Mas era basicamente scripts que recebiam parâmetros via `STDIN` e retornavam via `STDOUT`.

Esses scripts faziam chamadas a outros serviços (muitos usando SOAP), se conectavam via telnet à equipamentos de rede e manipulavam dados em bancos `MySQL` e `SQLite`.

#### O problema que queríamos resolver

Bom, agora imagina esse canal de atendimento em dias de rompimento de fibra. Agora imagina esse rompimento de fibra em uma grande cidade, como São Paulo.

Há uma série de desafios para escalar horizontalmente um serviço VoIP, na época só conseguiamos escalar verticalmente e exigia a parada total do sistema.

Durante esse alto volume, os scripts em PHP começavam a demorar mais para responder e isso começava a consumir recursos de memória e cpu do servidor, que consequentemente, trazia uma péssima experiência para os usuários que já estavam insatisfeitos.

Isso acontecia porque a cada chamada, o `Asterisk` precisava iniciar um novo processo PHP para executar o script, esse processo fazia o que tinha que fazer: carregar o interpretador e as bibliotecas. Qualquer lógica de paralelismo/concorrência que tentávamos implementar, exigia mais processos no sistema operacional.

O problema estava mapeado: precisamos consumir menos recursos de máquina e entregar mais performance.

Antes de chegar em `Go`, eu migrei alguns scripts para `C` e que de certa forma, já seria o suficiente para resolver o problema. Porém, eu não estava satisfeito com o tempo em que eu levava para criar/desenvolver essas soluções em `C`, eu não dominava completamente a linguagem e tinha pouco tempo para me dedicar a isso. Não havia outros desenvolvedores na equipe além de mim e o coordenador.

Foi pesquisando nesse sentido que encontrei `Golang`, estava na versão `1.5`, havia pouquíssimos materiais na internet e poucos ou quase nada de registros em `pt-br`.

Eu consegui reescrever o script em `C` (que havia levado algumas semanas) em poucos dias com `Golang`.

Me chamou a atenção o build super rápido, o binário extremamente pequeno e a facilidade de criar soluções concorrentes com `goroutines`.

Combinando tudo isso, a escolha por `Go` parecia cada vez mais acertada. Tive o OK do coordenador para seguir com a ideia e daqui em diante, não parei mais de programar em Go.

Além da refatoração dos scripts, todos os novos projetos internos que eu desenvolvia, começaram a ser feitos em Go, alguns muito bacanas, como o correio de voz (necessário quando a empresa começou a operar telefonia móvel), sistemas de monitoramento de filas telefônicas, sistemas de relatórios em tempo real, etc.

Foi nessa época que eu construí o [NSSH](github.com/nicolascb/nssh), um gerenciador de conexões SSH, que ajudou muito a equipe a gerenciar o acesso aos servidores.

### Como era a linguagem em 2015

A linguagem já tinha o DNA de simplicidade e eficiência, `goroutines` e `channels` já eram o charme da linguagem.

Generics ainda era algo distante, havia muita resistência da comunidade.

A maior dor naquela época era lidar com as dependências, uma linguagem com uma `stdlib` tão rica, mas sem nenhuma solução oficial para lidar com dependências. Não existia `go modules`, usávamos ferramentas da comunidade, como: [godep](https://github.com/tools/godep) e [glide](https://github.com/Masterminds/glide), mas a sensação é que nada funcionava muito bem, vira e mexe surgia alguma dor de cabeça. O jeito mais seguro de fixar uma versão era usando o `go vendor`, oficialmente na `1.5` também.

Na prática, era uma mistura de disciplina, gambiarra e paciência.

De lá pra cá, o `Go` amadureceu muito. E assim como a linguagem, eu também fui amadurecendo.
É sobre esses aprendizados que quero compartilhar agora.

### Aprendizados ao longo da jornada

A minha linha do tempo de aprendizado em Go, se mistura com meu nível de conhecimento em desenvolvimento de software e será muito difícil escrever tudo o que aprendi nesses 10 anos, mas vou tentar destacar os pontos mais importantes.

No começo, eu focava em entender a sintaxe da linguagem, mas me dediquei muito em entender a tal "filosofia", entender o porquê de algumas decisões terem sido tomadas.

Como por exemplo, porque não temos `try/catch`? Porque não temos `class`? Porque não temos `generics`?

A documentação em [Effective Go](https://go.dev/doc/effective_go) e o [Go Proverbs](https://go-proverbs.github.io/) me ajudou a entender melhor a linguagem.

Minha religião era usar a `stdlib` ao máximo, evitar o uso de bibliotecas de terceiros, a não ser que fosse algo realmente necessário.

Embora repetitivo, eu via vantagem em tratar o erro explicitamente, me ajudou a entender melhor o fluxo do programa.

Não ter generics me ajudou a entender melhor os tipos e a criar soluções mais simples.

Entender porque precisamos fazer `body.Close()` me ajudou a entender melhor o funcionamento do `garbage collector` (isso aqui vale um post no futuro).

Esses pequenos cuidados, como separar constantes por contexto, fazem parte da filosofia de simplicidade do Go e ajudam a manter o código limpo e compreensível.

A facilidade de organizar testes unitários em tabelas vai até certo ponto, se houver muitos casos, talvez seja melhor criar funções auxiliares para organizar melhor o código ou até mesmo separar em outras tabelas.

Ferramentas nativas para linter, formatação, documentação, testes e profiling, tornam o desenvolvimento mais produtivo.

### Filosofia de simplicidade

Ao longo do tempo, percebi que buscar soluções simples não se limita apenas à lógica do programa, mas também se reflete em pequenos detalhes que tornam o código mais organizado e fácil de entender. Um exemplo disso é a forma como declaramos constantes.

Organizar constantes relacionadas em blocos separados pode trazer mais clareza, principalmente quando lidamos com diferentes tipos de valores:

```go
const (
    StatusPending = iota + 1
    StatusInProgress
    StatusCompleted
)

const (
    UsersTable  = "users"
    OrdersTable = "orders"
)
```

Já misturar constantes de naturezas diferentes em um único bloco pode dificultar a leitura e a manutenção:

```go
const (
    StatusPending = iota + 1
    StatusInProgress
    StatusCompleted
    UsersTable  = "users"
    OrdersTable = "orders"
)
```

Outro exemplo é a criação de abstrações desnecessárias. Às vezes, na tentativa de seguir princípios de design, acabamos criando interfaces ou estruturas que não agregam valor real ao código. É importante avaliar se a abstração realmente simplifica o entendimento e a manutenção do código, ou se apenas adiciona complexidade desnecessária, como por exemplo tratar qualquer rota HTTP com uma interface genérica:

```go
type Controller interface {
    Handle(Request) Response
}

type HelloController struct{}

func (h HelloController) Handle(r Request) Response {
    return Response{Body: "Hello, world!"}
}
```

Quando o mesmo efeito pode ser alcançado de forma mais direta e simples:

```go
http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, world!")
})
```

### Contribuições open source

Esse é um tema que eu gostaria de ter contribuído mais, mas a verdade é que nunca consegui me dedicar o suficiente para contribuir com projetos open source em `Go`.

Há alguns projetos no meu github, como [NSSH](https://github.com/nicolascb/nssh) e [vault-aws-provider](https://github.com/nicolascb/vault-aws-provider).

Também consegui contribuir com alguns projetos:

- [aws/aws-xray-sdk-go](https://github.com/aws/aws-xray-sdk-go/pulls?q=is%3Apr+author%3Anicolascb+is%3Aclosed)
- [opensearch-project/opensearch-go](https://github.com/opensearch-project/opensearch-go/pull/215)
- [FerretDB/FerretDB](https://github.com/FerretDB/FerretDB/pull/1067)
- [alexliesenfeld/health](https://github.com/alexliesenfeld/health/pull/76)
- [c9s/goprocinfo](https://github.com/c9s/goprocinfo/pulls?q=is%3Apr+is%3Aclosed+author%3Anicolascb)
- [projectdiscovery/naabu](https://github.com/projectdiscovery/naabu/pull/8)

### Resumo do que aprendi nesses 10 anos com Go

Olhando pra trás, vejo que não foram só 10 anos com `Go`, foram 10 anos aprendendo a pensar de forma mais simples e eficiente.

- Interfaces são poderosas, mas podem ser perigosas se usadas em excesso
- A importância da simplicidade e clareza no código
- Lidar com erros de forma explicita pode ser feio, mas é eficaz
- O poder de conseguir criar sistemas concorrentes de forma simples
- Os benefícios de uma `stdlib` rica e a filosofia de evitar dependências externas
- É possível viver sem generics
- `Golang` é um ecosistema, não apenas uma linguagem
- Não ter frameworks é libertador, mas exige mais disciplina
- Uma linguagem com a premissa de retrocompatibilidade é algo valioso
- Desenvolvedores que dominam linguagens fortementes orientadas a objetos, podem ter dificuldades iniciais para se adaptar ao `Go`
- Desenvolvedores que dominam linguagens interpretadas, podem ter dificuldades em entender o custo de cada operação

Hoje, como Staff Engineer na [Fretebras](https://fretebras.com.br/), continuo usando `Go` diariamente, embora numa posição mais estratégica, ainda me envolvo diretamente com código, seja com a viabilidade técnica de soluções ou no code review. Linguagens são só ferramentas, mas espero continuar usando `Go` por muitos anos ainda.
