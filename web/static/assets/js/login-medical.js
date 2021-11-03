$(function () {

  //----------------------------
  // Login do responsável médico
  //----------------------------

  var $loginForm = $("#login-form");

  $loginForm.on("submit", function (e) {
    var data = {
      email: $loginForm.find("#email_admin_login").val(),
      crm: $loginForm.find("#crm_login").val(),
    };

    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/admin",
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      success: function (admin) {
        console.log(admin)
        var postData = admin.localId
        localStorage.setItem('userId', postData);
        console.log(localStorage.getItem('userId'));
        Swal.fire({
          icon: 'success',
          text: "Responsável médico realizou login com sucesso!",
          showConfirmButton: false,
          timer: 1000
        })
        $.post("http://localhost:8080/postmethod", {
          javascript_data: postData
        });
        window.location.assign('/admin/dashboard')
      },
      error: function (error) {
        console.error(error);
        Swal.fire({
          icon: 'warning',
          text: "Por favor, insira credenciais válidas",
          showConfirmButton: false,
          timer: 1000
        })
      }
    });
    e.preventDefault();
  });
})