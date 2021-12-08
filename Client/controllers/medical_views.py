import os
import json
import string
import pathlib
import functools

from flask import Flask, flash, redirect, request, session, render_template, jsonify, url_for, abort, Blueprint
from datetime import timedelta
from decouple import config
from controllers.auth_views import login_required

medical_views = Blueprint('medical', __name__)

#------------------------------------------------------------------------
# Responsável médico - Editar Perfil
#------------------------------------------------------------------------

@medical_views.route('/medical/settings', methods=['GET', 'POST'])
@login_required
def medical_dashboard_profile():
  current=session['current_user']
  type_user=current['type_user']
  if type_user != 'medical':
    return redirect(url_for('auth.login'))
  else:
    current_user=current['email']
    return render_template('medical/profile.html', current=current_user, all_data=current)

#------------------------------------------------------------------------
# Responsável médico - Cadastrar funcionário
#------------------------------------------------------------------------

@medical_views.route('/medical/register-employee', methods=['GET', 'POST'])
@login_required
def medical_register_employee():
  current=session['current_user']
  type_user=current['type_user']
  if type_user != 'medical':
    return redirect(url_for('auth.login'))
  else:
    current_user=current['email']
    return render_template('medical/register-employee.html',  current=current_user, all_data=current)

#------------------------------------------------------------------------
# Responsável Médico - Consultar funcionário
#------------------------------------------------------------------------

@medical_views.route('/medical/consult-employee', methods=['GET', 'POST'])
@login_required
def medical_consult_employee():
    current=session['current_user']
    type_user=current['type_user']
    if type_user != 'medical':
      return redirect(url_for('auth.login'))
    else:
      current_user=current['email']
      return render_template('medical/consult-employee.html', current=current_user)