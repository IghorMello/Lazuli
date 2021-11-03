## 🚀 Como executar o projeto

### Pré-requisitos

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