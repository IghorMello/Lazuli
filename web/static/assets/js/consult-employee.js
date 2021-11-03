
//--------------------
// Consultar
//--------------------

$.ajax({
  url: 'https://flaskapideploy.herokuapp.com/employees',
  method: 'get',
  success: function (data) {
    var html = '';
    counter = 0
    for (var i in data) {
      html += "<tr><td><input class='sr-only' id='action' value='" + data[i]['_id']['$oid'] + "'><a href='#' class='fw-bold'>'" + data[i]['codigo_usuario'] + "'</a><td><span class='fw-normal'>'" + data[i]['email'] + "'</span></td><td><span class='fw-normal'>'" + data[i]['nome'] + "'</td><td><span class='fw-bold text-warning'>'" + data[i]['status'] + "'</td><td><a class='dropdown-item'  value='" + data[i]['_id']['$oid'] + "' href='#'><span class='fa fa-pencil-square-o me-2'></span>Editar</a><a class='dropdown-item text-danger rounded-bottom' value='" + data[i]['_id']['$oid'] + "' onclick='excluir()' href='#'><span class='fa fa-trash me-2'></span>Remover</a></td></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});

function excluir() {
  var localid = $('#excluir').val();
  console.log(localid)
}

function editar() {
  var localid = $('#action').val();
  console.log(localid)
}