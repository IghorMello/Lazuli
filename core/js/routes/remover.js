//--------------------
// Remover
//--------------------

var postData = '616ce9d761cfe9d71f8ad20b'

function deleteFunc() {
  $.ajax({
    url: "http://localhost:8080/employees/" + postData,
    method: 'delete',
    success: function (data) {
      alert('Funcionário deletado com sucesso!')
    },
    error: function (error) {
      console.error(error);
      alert(error.responseJSON.message)
    }
  });
}