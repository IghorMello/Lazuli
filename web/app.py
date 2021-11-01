# Testando

import string
from flask import Flask, render_template, Blueprint, jsonify, flash, request, redirect, url_for, session
from decouple import config

app = Flask(__name__)

# Página inicial

@app.route('/', methods=['GET', 'POST'])
def index():
  return render_template('page/index.html')

# Página de login do responsável médico

@app.route('/resp', methods=['GET', 'POST'])
def resp_login():
  return render_template('routes/login-medical.html')

# Página de cadastro do responsável médico

@app.route('/resp/register', methods=['GET', 'POST'])
def resp_login():
  return render_template('routes/register-medical.html')

# Página de dashboard do responsável médico

@app.route('/resp/dashboard', methods=['GET', 'POST'])
def resp_dashboard():
  return render_template('routes/dashboard-medical.html')

# Página de cadastro do responsável médico

@app.route('/resp/register-employee', methods=['GET', 'POST'])
def resp_register_employee():
  return render_template('routes/register-employee.html')

# Tela de erro

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Ocorreu um erro na página ' + request.url,
        'status': 404
    }

    response = jsonify(message)
    response.status_code = 404
    return response

if __name__ == '__main__':
  app.run(debug=True)