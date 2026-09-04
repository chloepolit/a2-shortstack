// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const task = document.querySelector('#task'),
        deadline     = document.querySelector('#deadline'),
        creationDate = document.querySelector('#creation-date'),
        category     = document.querySelector( '#category' )

  const json = {
    task: task.value,
    deadline: deadline.value,
    creationDate: creationDate.value,
    category: category.value
  }

  const body = JSON.stringify( json )

  const response = await fetch( '/my-handling-form-page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })

  const data = await response.json()

  console.log('updated dataset:', data)
  
  event.target.reset()
}

window.onload = function() {
  const form = document.querySelector('form')
  form.onsubmit = submit
}
