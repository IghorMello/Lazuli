import os
import json
import string
import pathlib
import functools
from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config

auth_views = Blueprint('auth', __name__)

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

#------------------------------------------------------------------------#
# Página de login do responsável médico
#------------------------------------------------------------------------#

@auth_views.route('/login', methods=['GET', 'POST'])
def login():
  return render_template('pages/login-medical.html')

#------------------------------------------------------------------------#
# Página de login do responsável médico
#------------------------------------------------------------------------#

@auth_views.route('/admin', methods=['GET', 'POST'])
def admin():
  return render_template('pages/login-admin.html')
