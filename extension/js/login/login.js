var $loginForm = $("#login-form"),
  $loginSuccess = $("#login-success"),
  $formLogin = $("#loginForm"),
  $boxLogin = $("#boxLogin"),
  $extensionVersion = $("#extensionVersion");

$loginForm.on("submit", function (e) {
  var data = { codigo_usuario: $loginForm.find("#code_user").val() };
  console.log(data);

  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/",
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    success: function (resp) {
      console.log(resp);
      $loginForm.hide();
      $formLogin.hide();
      $boxLogin.hide();
      $extensionVersion.show();
      Swal.fire({
        icon: "success",
        text: "Funcionário realizou login com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      localStorage.setItem("result", "success");
    },
    error: function (error) {
      console.error(error);
      Swal.fire({
        icon: "warning",
        text: "Dados inválidos",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  e.preventDefault();
});
