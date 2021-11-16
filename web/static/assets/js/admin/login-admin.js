$(function () {
  // Login do responsável médico
  var $loginForm = $("#login-form");
  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email_admin_login").val(),
      crm: $loginForm.find("#password_admin_login").val(),
    };
    $.ajax({
      url: "http://localhost:8080/admin",
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
        $.post("/postmethod", {
          javascript_data: JSON.stringify(postData),
        });
        window.location.replace("http://localhost:8080/admin/dashboard");
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
