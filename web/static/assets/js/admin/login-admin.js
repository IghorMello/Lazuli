$(function () {
  // Login do responsável médico
  var $loginFormAdmin = $("#login-form-admin");
  $loginFormAdmin.on("submit", function (e) {
    var data = {
      email: $loginFormAdmin.find("#email_admin_login").val(),
      password: $loginFormAdmin.find("#password_admin_login").val(),
    };
    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/admin",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (admin) {
        console.log(admin);
        var postData = admin;
        Swal.fire({
          icon: "success",
          text: "Administrador realizou login com sucesso!",
          showConfirmButton: false,
          timer: 1000,
        });
        $.post("/postmethod-admin", {
          javascript_data: JSON.stringify(postData),
        });
        window.location.replace("https://extensiontimind.herokuapp.com/admin/consult-medical");
      },
      error: function (error) {
        console.error(error);
        Swal.fire({
          icon: "warning",
          text: "Por favor, insira credenciais válidas",
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
    e.preventDefault();
  });
});
