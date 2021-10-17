
//--------------------
// Consultar
//--------------------

$.ajax({
  url: 'http://localhost:8080/employees',
  method: 'get',
  success: function (data) {
    var html = '';
    counter = 0
    for (var i in data) {
      counter += 1
      console.log(data[i]['_id']['$oid'])
      html += "<tr><th>'" + counter + "'</th><th>'" + data[i]['nome'] + "'</th><th>'" + data[i]['email'] + "'</th><th>'" + data[i]['codigo_usuario'] + "'</th></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});