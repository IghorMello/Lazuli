$(function () {
  // Cadastrar novo responsável médico
  var $addUserForm = $("#add-user-form");
  $addUserForm.on("submit", function (e) {
    var data = {
      nome: $addUserForm.find("#nome_register_admin").val(),
      email: $addUserForm.find("#email_register_admin").val(),
      crm: $addUserForm.find("#crm_register_admin").val(),
    };
    $.ajax({
      url: "https://flaskapideploy.herokuapp.com/admin/register-medical",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      data: JSON.stringify(data),
      success: function (admin) {
        console.log(admin);
        Swal.fire({
          icon: "success",
          text: "Responsável médico foi cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 800,
        });
        window.location.assign("https://ExtensionLazulimind.herokuapp.com/admin/consult-medical")
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
});
