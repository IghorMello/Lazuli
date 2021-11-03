
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
      html += "<tr><td><input class='sr-only' id='action' value='" + data[i]['_id']['$oid'] + "'><a href='#' class='fw-bold'>'" + data[i]['codigo_usuario'] + "'</a><td><span class='fw-normal'>'" + data[i]['email'] + "'</span></td><td><span class='fw-normal'>'" + data[i]['nome'] + "'</td><td><span class='fw-bold text-warning'>'" + data[i]['status'] + "'</td><td><a class='dropdown-item' value='" + data[i]['_id']['$oid'] + "' href='/resp/edit/" + data[i]['_id']['$oid'] + "'><span onclick='editar()' class='fa fa-pencil-square-o me-2'></span>Editar</a><a class='dropdown-item text-danger rounded-bottom' value='" + data[i]['_id']['$oid'] + "' onclick='excluir()' href='#'><span class='fa fa-trash me-2'></span>Remover</a><a class='dropdown-item text-info rounded-bottom' value='" + data[i]['_id']['$oid'] + "' onclick='visualizar()' href='/resp/consult/" + data[i]['_id']['$oid'] + "'><span class='fa fa-eye me-2'></span>Visualizar</a></td></tr>"
    }
    $('#exibir').html(html)
  },
  error: function (error) {
    console.error(error);
    alert(error.responseJSON.message)
  }
});

function excluir() {
  var localid = $('#action').val();
  console.log(localid)
  $.ajax({
    url: 'https://flaskapideploy.herokuapp.com/employees/' + localid,
    method: 'delete',
    success: function (data) {
      console.log(data)
      Swal.fire({
        icon: 'success',
        title: 'Deletado com sucesso!',
      })
    },
    error: function (error) {
      console.error(error);
      alert(error.responseJSON.message)
    }
  });
}