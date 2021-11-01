## 🚀 Como executar o projeto

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
$ cd lazuli/api

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

# Acesse o navegador e pesquise o nome do navegador com ://extension
# Exemplo.
$ edge://extensions/ 

# Habilite o "Modo do desenvolvedor"
# Clique em "Carregar sem pacote"
# Carregue a pasta extension.

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
$ cd lazuli/web

# Instale as depedências
$ pip install -r requirements.txt

# Após isso inicie os arquivos dentro de sua 
# respectiva pastas
$ python3 app.py

```