# Testando

import os
import json
import string
import pathlib
import functools
from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config

app = Flask(__name__)

#------------------------------------------------------------------------#
# Impedir acesso sem login
#------------------------------------------------------------------------#

def login_required(view):
    @functools.wraps(view)
    def wrauth_plataformaed_view(**kwargs):
        if not 'user_id' in session.keys():
            flash(f'Necessário realizar login para prosseguir!', 'info')
            return redirect('/')
        return view(**kwargs)
        flash('Erro ao realizar login', 'warning')
    return wrauth_plataformaed_view

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
def resp_register():
  return render_template('routes/register-medical.html')

# Página de dashboard do responsável médico

@app.route('/resp/dashboard', methods=['GET', 'POST'])
@login_required
def resp_dashboard():
  return render_template('routes/dashboard-medical.html')

# Página de cadastro do responsável médico

@app.route('/resp/register-employee', methods=['GET', 'POST'])
@login_required
def resp_register_employee():
  return render_template('routes/register-employee.html')

# Página de admin

@app.route('/admin', methods=['GET', 'POST'])
def admin():
  return render_template('admin/login.html')

# Página de dashboard do admin

@app.route('/admin/dashboard', methods=['GET', 'POST'])
@login_required
def admin_dashboard():
  return render_template('admin/dashboard.html')

# Página de consultas do admin

@app.route('/admin/consult/medical', methods=['GET', 'POST'])
@login_required
def admin_consult_medical():
  return render_template('admin/consult-medical.html')

# Página de consultas do admin

@app.route('/admin/consult/employee', methods=['GET', 'POST'])
@login_required
def admin_consult_employee():
  return render_template('admin/consult-employee.html')

# Erro 404

@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/page-404.html'), 404

# Erro 403

@app.errorhandler(403)
def not_found_error(error):
    return render_template('errors/page-403.html'), 403 

# Erro 500

@app.errorhandler(500)
def not_found_error(error):
    return render_template('errors/page-500.html'), 500 

# Logout

@app.route('/sign_out')
def sign_out():
    # session.pop('username')
    return redirect(url_for('index'))

if __name__ == '__main__':
  app.run(debug=True)