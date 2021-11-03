$(function () {

  //----------------------------
  // Login do responsável médico
  //----------------------------

  var
    $loginForm = $("#login-form"),
    $loginSuccess = $("#login-success");

  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email_admin_login").val(),
      crm: $loginForm.find("#crm_login").val(),
    };

    console.log(data);

    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/admin",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (resp) {
        console.log(resp);
        Swal.fire({
          icon: 'success',
          text: "Responsável médico realizou login com sucesso!",
          showConfirmButton: false,
          timer: 1500
        })
        window.location.assign('/resp/dashboard')
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
})