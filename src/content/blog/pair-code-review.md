---
title: Promovendo uma cultura de pair code review
author: Nicolas Barbosa
pubDatetime: 2023-08-21T22:07:00-03:00
postSlug: pair-code-review
featured: true
draft: false
tags:
  - code-review
  - techlead
  - agile
ogImage: ""
description: Buscando estratégias para melhorar o processo de code review
---

# Promovendo uma cultura de pair code review

O processo de _pair code review_, como o próprio nome já sugere, consiste na prática de revisão de código em pares.

Diferente do _pair programming_, onde pessoas se organizam na fase de desenvolvimento da tarefa, o pair review acontece ao final desse desenvolvimento, quando a tarefa atinge a sua definição de pronto.

Um ponto importante para ser ressaltado é que esse processo não precisa ser engessado, se reunir com os pares para revisão de código, para buscar opiniões diferentes durante o fluxo de desenvolvimento ou qualquer que seja o tema, pode ser sempre um espaço de trocas positivas.

## Revisitando o processo de code review

Como desenvolvedor, trabalhei em empresas em que não havia nenhum processo de code review _(la garantia soy yo)_ e também em outras que até havia o processo definido, porém, era muito comum o gargalo de tarefas a serem revisadas no final da sprint.

Também é comum os desenvolvedores enxergarem como **apenas mais um processo**, que o importante é buscar a aprovação de suas mudanças e pronto. Porém, na minha opinião, essa é uma visão limitada do espaço em que o code review deve proporcionar. Nesse artigo, eu não vou me aprofundar em todos os aspectos positivos do code review (que são vários), mas cabe a gente perceber se estamos vivenciando isso na equipe e criar maneiras de mudar essa percepção do desenvolvedor.

Sendo assim, o primeiro passo para criar uma cultura de revisão de pares, é revisitar se o processo atual está saudável.

Na minha visão, a principal métrica para entender se o processo atual está correndo bem ou não, é buscar esse sentimento com a equipe.

Pode parecer óbvio, mas algumas perguntas podem ser feitas durante 1:1 com os desenvolvedores, como _"Você se sente confortável com os comentários da equipe sobre o seu código?"_ ou _"Que pontos positivos e negativos você consegue destacar nas revisões de código?"_.

Se o sentimento for negativo, escrever um guia de boas práticas para revisão de código pode ser o primeiro passo para virar esse ponteiro. Esse guia fica ainda mais rico se for construído de forma colaborativa com a equipe.

Agora, se a fila de pull requests (ou merge requests para os fãs do gitlab) for o gargalo da esteira de desenvolvimento, isso já é um bom motivo para repensar o processo de code review.

## Algumas dores no processo assíncrono de code review

Eu preciso ser justo e dizer que o processo de code review assíncrono tende a funcionar muito bem em equipes já maduras e entrosadas, desenvolvedores que conseguem equilibrar os momentos de comunicação async/sync conseguem também otimizar o tempo  em que reservam para desenvolvimento e revisão de código.

Inclusive acredito que o objetivo deve ser caminhar a equipe para chegar nesse estágio de equilíbrio, mas enquanto isso não acontece, é normal sentirmos algumas dores nessa caminhada.

### Síndrome do Ping Pong:
Essa síndrome não é nada rara, é comum vermos discussões que tendem ao infinito nas revisões de código. Como consequência, é uma tarefa que ainda não conseguimos liberar para QA, talvez porque alguns desenvolvedores acharam melhor se comunicar por fumaça, enquanto um responde o outro lê daqui a 3 horas, entramos aqui em um loop.

### Pouca eficiência
Menor agilidade para dar andamento em tarefas de revisão, ainda mais quando a síndrome do Ping Pong está presente.

### Aprovar é diferente de revisar
O processo de code review não deve ter como único objetivo a aprovação das mudanças, se isso acontece, provavelmente a qualidade da revisão está em baixa, colocando em dúvidas se os aprovadores realmente revisaram o código e se os desenvolvedores entendem da importância do code review.


## Criando espaços para a cultura de pair review

Introduzir a cultura de pair review em um time de tecnologia pode ser desafiador, ainda mais em times que interagem de forma mecânica ou que não se sentem bem em trabalhos em pares.

Aqui nesse ponto, já mapeamos as falhas do nosso processo de code review, já evangelizamos a equipe sobre a importância da revisão de código e estamos alinhados em nível de conduta e de boas práticas.

O processo assíncrono de pair review tem os seus pontos positivos, mas como mencionei acima, nem tudo são flores e aquelas dores podem facilmente desestimular a cultura dentro da equipe, por n motivos.

### Café com review

Pensando no equilíbrio, nos últimos 2 anos tenho implementado uma agenda sync _(sim, mais uma reunião)_ após a daily, na qual tenho batizado carinhosamente como a hora do café com review.

Qual o objetivo? Criar um espaço para acolher as discussões de revisão de código.

Também vale lembrar, que essa agenda não foi imposta de forma autoritária, foi uma proposta discutida com os desenvolvedores. Ter um processo de retrospectiva contribui para pensarmos em estratégias que podem melhorar nosso ambiente de trabalho.


Apesar de parecer mais uma reunião, o café com review não tem o caráter de compromisso, a participação é opcional para todos e tem a mesma duração do tempo da daily (15 minutos).

Sendo assim, essa sync tem a natureza de acontecer só quando necessário, inicialmente, quando existirem tarefas para revisar.

Baseado na minha experiência, o engajamento tende acontecer espontaneamente, já que é de interesse do desenvolvedor que seu código seja revisado.

É possível identificar facilmente que atacamos algumas dores ao introduzir o café com review, destaco os seguintes pontos positivos:

-   A síndrome do ping pong não acontece mais, 15 minutos é tempo suficiente para entrarmos em um acordo sobre uma determinada solicitação de mudança.
-   Conseguimos dar uma vazão maior na fila de tarefas para revisar
-   A aproximação do líder técnico ajuda os desenvolvedores nas tomadas de decisões e também na mediação de conflitos
-   A rotina ajuda a organizar o tempo dos revisores, temos poucas interrupções após a sync para revisão de código

No processo sync de revisão, o desenvolvedor principal da tarefa consegue dar mais contexto das suas decisões e os revisores conseguem entender com mais detalhes as regras de negócio da tarefa, no resumo, é mais conhecimento sendo compartilhado entre a equipe, consequentemente gerando mais qualidade nas entregas.


## Conclusão

Nesse artigo, tudo o que escrevi foi baseado em minha experiência como desenvolvedor backend e líder técnico.

Procurei trazer minha visão sobre pontos negativos do processo tradicional de code review, dores identificadas em conjunto com a equipe e que precisávamos pensar em alguma estratégia para atacá-las.

Introduzir uma agenda sync, como ideia de criar um espaço para discutir revisões de código, foi muito além de resolver as dores do momento atual.

Evoluímos nossa comunicação e interação entre os pares, tornando equipes que se apoiam e que aprendem juntos.

Com o tempo, quando não há tarefas para revisar, a sync tende a proporcionar outras interações, como pair programming ou temas técnicos que não caberiam na daily.