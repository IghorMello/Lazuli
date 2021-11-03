
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
      html += "<tr><td><input class='sr-only' id='action' value='" + data[i]['_id']['$oid'] + "'><a href='#' class='fw-bold'>'" + data[i]['codigo_usuario'] + "'</a><td><span class='fw-normal'>'" + data[i]['email'] + "'</span></td><td><span class='fw-normal'>'" + data[i]['nome'] + "'</td><td><span class='fw-bold text-warning'>'" + data[i]['status'] + "'</td><td><a class='dropdown-item'  value='" + data[i]['_id']['$oid'] + "' href='#'><span onclick='editar()'class='fa fa-pencil-square-o me-2'></span>Editar</a><a class='dropdown-item text-danger rounded-bottom' value='" + data[i]['_id']['$oid'] + "' onclick='excluir()' href='#'><span class='fa fa-trash me-2'></span>Remover</a><a class='dropdown-item text-info rounded-bottom' value='" + data[i]['_id']['$oid'] + "' onclick='visualizar()' href='#'><span class='fa fa-eye me-2'></span>Visualizar</a></td></tr>"
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
  Swal.fire({
    title: 'Deseja deletar?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    showLoaderOnConfirm: true,
  })
  $.ajax({
    url: 'https://flaskapideploy.herokuapp.com/employees/' + localStorage.getItem('userId'),
    method: 'delete',
    success: function (data) {
      console.log(data)
      flash('Deletado com sucesso!', 'success')
    },
    error: function (error) {
      console.error(error);
      alert(error.responseJSON.message)
    }
  });
}

function editar() {
  var localid = $('#action').val();
  console.log(localidSwal.fire({
    title: 'Submit your Github username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    preConfirm: (login) => {

    },
  }))
}

function visualizar() {
  var localid = $('#action').val();
  console.log(localid)
  Swal.fire({
    title: 'Submit your Github username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url
      })
    }
  })
}