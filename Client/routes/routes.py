from controllers.send_email_views import send_email_views
from controllers.employee_views import employee_views
from controllers.medical_views import medical_views
from controllers.admin_views import admin_views
from controllers.base_views import base_views
from controllers.auth_views import auth_views

def init_app(app):
  app.register_blueprint(send_email_views)
  app.register_blueprint(employee_views)
  app.register_blueprint(medical_views)
  app.register_blueprint(admin_views)
  app.register_blueprint(base_views)
  app.register_blueprint(auth_views)
