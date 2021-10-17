
//--------------------
// Consultar
//--------------------

$.ajax({
  url: 'http://localhost:8080/employees',
  method: 'get',
  success: function (data) {
    var html = '';
    var total = Object.keys(count).length;
    console.log(data)
    for (var i = 0; i <= total; i++) {
      html += "<tr><th><input value='" + data[0] + "'></th></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});