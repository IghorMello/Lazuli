## :pushpin: Índice

- [Sobre](#sobre-o-projeto)
- [Como Executar](#executar)
- [Licença](#licenca)

<br>

<a id="sobre-o-projeto"></a>

## 💻 Sobre o projeto

:rocket: Baseado na plataforma [habitlab](https://github.com/habitlab/habitlab-chrome). 

<br>

<a id="executar"></a>

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e o gerenciador de pacotes [Yarn](https://yarnpkg.com).
Além disto é bom ter um editor para trabalhar como o código, o [VSCode](https://code.visualstudio.com/) por exemplo

<br>

#### 🧭 Rodando a aplicação web (Extensão)

```bash

# Clone este repositório
$ git clone -b developer https://github.com/IghorMello/Lazuli.git

# Acesse a pasta do projeto 
$ cd lazuli

# Instale o gulp
$ npm install -g gulp-cli

# Instale as depedências
$ yarn

# Realize o build do código
$ gulp release --max-old-space-size=8192

# Entre na aba de extensão do navegador e habilite o modo desenvolvedor e importe a pasta dist, dentro da pasta lazuli

```

<br>

<a id="licenca"></a>

## :memo: Licença

Este projeto está sob a licença GNU e é baseado na plataforma [habitlab](https://github.com/habitlab/habitlab-chrome).