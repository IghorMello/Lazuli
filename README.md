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

# Habilite o MongoDB (em Linux/macOS)
$ sudo systemctl start mongod

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

# Acesse a pasta da api 
$ cd api

# Após isso inicie os arquivos dentro de sua respectiva pastas
$ python3 app.py

# Para testar a API, há duas formas:
# A primeira, com a api rodando, acesse a pasta web
$ cd lazuli/web

# Abra o arquivo index.html em um navegador e teste as funcionalidades
# Ou teste no Insomnia (ou Postman), importando o arquivo api-backend.json e com a api rodando em paralelo

```

<br>

<a id="licenca"></a>

## :memo: Licença

Este projeto está sob a licença MIT e é baseado no [projeto open-source](https://github.com/app-generator/flask-dashboard-atlantis-dark). .