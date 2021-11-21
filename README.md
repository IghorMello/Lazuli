## 🚀 Como executar o projeto


:book:  Para acessar a página [clique aqui](https://extensiontimind.herokuapp.com) e para acessar o acessar a API [clique aqui](https://flaskapideploy.herokuapp.com).

<br>

### Pré-requisitos

- [Rodando API](#api)
- [Rodando Extensão](#extension)
- [Rodando Página](#page)

<br>

<a id="api"></a>

#### 🧭 Rodando a aplicação (API)

```bash

# Clone este repositório
$ git clone -b extension https://github.com/IghorMello/Lazuli.git

# Habilite o MongoDB (em Linux/macOS)
$ sudo systemctl start mongod

# Caso não esteja em ambiente virtual, certifique-se de criá-lo
# dentro da pasta (em Linux/macOS) e ativá-lo
$ python3 -m venv venv
$ . venv/bin/activate

# Para criar o ambiente virtual em Windows e ativá-lo,
# utilize o comando abaixo
$ py -3 -m venv venv
$ venv\Scripts\activate

# Acesse a pasta da API
$ cd lazuli/Client

# Instale as depedências
$ pip install -r requirements.txt

# Após isso inicie os arquivos dentro de sua
# respectiva pastas
$ python3 app.py

```

<br>

<a id="extension"></a>

#### 🎲 Rodando a aplicação (extensão)

```bash

# Clone este repositório
$ git clone -b extension https://github.com/IghorMello/Lazuli.git

# Acesse a pasta da extensão
$ cd lazuli/Chrome_Extension

# Acesse o navegador e pesquise o nome do navegador com ://extension
# Exemplo.
$ edge://extensions/

# Habilite o "Modo do desenvolvedor"
# Clique em "Carregar sem pacote"
# Carregue a pasta Chrome_Extension.

```

<br>

<a id="page"></a>

#### :memo: Rodando a aplicação (Página - Em andamento)

```bash

# Clone este repositório
$ git clone -b extension https://github.com/IghorMello/Lazuli.git

# Caso não esteja em ambiente virtual, certifique-se de criá-lo
# dentro da pasta (em Linux/macOS) e ativá-lo
$ python3 -m venv venv
$ . venv/bin/activate

# Para criar o ambiente virtual em Windows e ativá-lo,
# utilize o comando abaixo
$ py -3 -m venv venv
$ venv\Scripts\activate

# Acesse a pasta da web
$ cd lazuli/Server

# Instale as depedências
$ pip install -r requirements.txt

# Após isso inicie os arquivos dentro de sua
# respectiva pastas
$ python3 app.py

# A aplicação estará aberta no navegador em:
$ http://localhost:5000

# Para acessar o admin, digite
$ http://localhost:5000/admin

```

