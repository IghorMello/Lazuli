
//-----------------------------
// Consultar responsável médico
//-----------------------------

$.ajax({
  url: 'https://flaskapideploy.herokuapp.com/medical/' + localStorage.getItem('userId'),
  method: 'get',
  success: function (data) {
    console.log(data)
    $.post("http://localhost:8080/getmethod", {
      javascript_data: data
    });
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});