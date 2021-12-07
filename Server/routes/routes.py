from flask import Flask
from controllers.admin_controller import admin_views
from controllers.medical_controller import medical_views
from controllers.employee_controller import employee_views
from controllers.send_email_controller import send_email_views

def init_app(app):
  app.register_blueprint(admin_views)
  app.register_blueprint(medical_views)
  app.register_blueprint(employee_views)
  app.register_blueprint(send_email_views)