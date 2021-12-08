import os
import json
import string
import pathlib
import functools

from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config
from routes.routes import init_app

app = Flask(__name__)

#---------------------------------------
# Chave da aplicação Flask
#---------------------------------------

app.secret_key = config('SECRET_KEY')

#---------------------------------------
# Rotas
#---------------------------------------

init_app(app)

#------------------------------------------------------------------------
# Erro 404
#------------------------------------------------------------------------

@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/page-404.html'), 404

#------------------------------------------------------------------------
# Erro 403
#------------------------------------------------------------------------

@app.errorhandler(403)
def not_found_error(error):
    return render_template('errors/page-403.html'), 403 

#------------------------------------------------------------------------
# Erro 500
#------------------------------------------------------------------------

@app.errorhandler(500)
def not_found_error(error):
    return render_template('errors/page-500.html'), 500 

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))