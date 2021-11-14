//--------------------
// Remover
//--------------------

var postData = '616ce9d761cfe9d71f8ad20b'

function deleteFunc() {
  $.ajax({
    url: "https://flaskapideploy.herokuapp.com/employees/" + postData,
    method: 'delete',
    success: function (data) {
      alert('Funcionário deletado com sucesso!')
      Swal.fire({
        icon: 'success',
        text: "Funcionário deletado com sucesso!",
        showConfirmButton: false,
        timer: 1500
      })
    },
    error: function (error) {
      console.error(error);
      Swal.fire({
        icon: 'warning',
        text: ""+error,
        showConfirmButton: false,
        timer: 1500
    })

    }
  });
}