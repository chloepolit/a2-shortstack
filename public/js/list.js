const loadList = async function() {
  const response = await fetch('/data')
  const appdata   = await response.json()

  const tbody = document.querySelector('#list-body')
  tbody.innerHTML = ''

  appdata.forEach(function(item) {
    const row = document.createElement('tr')

    row.innerHTML = `
      <td>${item.task}</td>
      <td>${item.category}</td>
      <td>${item.creationDate}</td>
      <td>${item.deadline}</td>
      <td>${item.priority}</td>
      <td><button class="button" data-id="${item.id}">Delete</button></td>
    `
    tbody.appendChild(row)
  })

  document.querySelectorAll('.button').forEach(function(button) {
    button.onclick = async function() {
      const id = Number( button.dataset.id )

      await fetch('/data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id})
      })

      loadList()
    }
  })
}

window.onload = loadList