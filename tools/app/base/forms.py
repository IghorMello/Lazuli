# -*- encoding: utf-8 -*-

from flask_wtf import FlaskForm
from wtforms import TextField, PasswordField
from wtforms.validators import InputRequired, Email, DataRequired

## Login e cadastro

class LoginForm(FlaskForm):
    username = TextField('Nome', id='username_login', validators=[DataRequired()])
    password = PasswordField('CRM', id='pwd_login', validators=[DataRequired()])

class CreateAccountForm(FlaskForm):
    username = TextField('Usuário', id='username_create', validators=[DataRequired()])
    email= TextField('Email organizacional', id='email_create', validators=[DataRequired(), Email()])
    password = PasswordField('CRM', id='pwd_create', validators=[DataRequired()])