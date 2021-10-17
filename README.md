## :pushpin: Índice

- [Sobre](#sobre-o-projeto)
- [Como Executar](#executar)
- [Licença](#licenca)

<br>

<a id="sobre-o-projeto"></a>

## 💻 Sobre o projeto

:rocket: Baseado no projeto open source da [app-generator](https://github.com/app-generator), disponível [aqui](https://github.com/app-generator/flask-dashboard-atlantis-dark). 

<br>

<a id="executar"></a>

## 🚀 Como executar o projeto

### Pré-requisitos

#### 🧭 Rodando a aplicação (dashboard) 

```bash

# Clone este repositório
$ git clone -b dashboard_doctor https://github.com/IghorMello/Lazuli.git

# Caso não esteja em ambiente virtual, certifique-se de criá-lo dentro da pasta (em Linux/macOS) e ativá-lo
$ python3 -m venv venv
$ . venv/bin/activate

# Para criar o ambiente virtual em Windows e ativá-lo, utilize o comando abaixo
$ py -3 -m venv venv
$ venv\Scripts\activate

# Acesse a pasta principal 
$ cd lazuli

# Instale as depedências
$ pip install -r requirements.txt

# Acesse a pasta do dashboard 
$ cd tools

# Após isso inicie os arquivos dentro de sua respectiva pastas
$ python3 app.py

# Se não ocorrer erro, acesse o navegador e digite:
$ http://localhost:5000/

```

<br>

#### 🧭 Rodando a aplicação (api) 

```bash

# Clone este repositório
$ git clone -b dashboard_doctor https://github.com/IghorMello/Lazuli.git

# Acesse a pasta principal 
$ cd lazuli

# Caso não esteja em ambiente virtual, certifique-se de criá-lo dentro da pasta (em Linux/macOS) e ativá-lo
$ python3 -m venv venv
$ . venv/bin/activate

# Para criar o ambiente virtual em Windows e ativá-lo, utilize o comando abaixo
$ py -3 -m venv venv
$ venv\Scripts\activate

# Na pasta, instale as depedências
$ pip install -r requirements.txt

# Acesse a pasta da API 
$ cd api

# Após isso inicie os arquivos dentro de sua respectiva pastas
$ python3 app.py

# Se não ocorrer erro, acesse o navegador e digite:
$ http://localhost:5000/

```

<br>

<a id="licenca"></a>

## :memo: Licença

Este projeto está sob a licença MIT e é baseado no [projeto open-source](https://github.com/app-generator/flask-dashboard-atlantis-dark). .