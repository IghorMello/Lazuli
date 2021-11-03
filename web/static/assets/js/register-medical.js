$(function () {

  //----------------------------------
  // Cadastrar novo responsável médico
  //----------------------------------

  var
    $addUserForm = $("#add-user-form"),
    $addUserSuccess = $("#add-user-success");

  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome_register_admin").val(),
      email: $addUserForm.find("#email_register_admin").val(),
      crm: $addUserForm.find("#crm_register_admin").val(),
    };

    console.log(data);

    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/register-medical",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      data: JSON.stringify(data),
      success: function (admin) {
        console.log(admin);
        Swal.fire({
          icon: 'success',
          text: "Responsável médico foi cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 800
        })
        window.location.assign('/admin')
      },
      error: function (error) {
        console.error(error);
        alert(error.responseJSON.message)
      }
    });
    e.preventDefault();
  });
})