import os

from decouple import config
from flask_cors import CORS
from flask import Flask, flash, jsonify, request, Response, session, Blueprint, render_template
from routes.routes import init_app

app = Flask(__name__)

#---------------------------------------
# Habilitando CORS
#---------------------------------------

CORS(app)

#---------------------------------------
# Chave da aplicação Flask
#---------------------------------------

app.secret_key = config('SECRET_KEY')

#---------------------------------------
# Rotas
#---------------------------------------

init_app(app)

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))