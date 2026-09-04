const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { id: 1, task: 'Finish HW1', creationDate: '2026-09-01T09:00', deadline: '2026-09-05T23:59', category: 'classes', priority: 'high' },
  { id: 2, task: 'Buy groceries', creationDate: '2026-09-03T09:00', deadline: '2026-09-06T18:00', category: 'personal', priority: 'low' }
]

let nextID = 3

const derivePriority = function(item){
    const millisecondsLeft = item.creationDate - item.deadline
    const daysRemaining = millisecondsLeft / (1000 * 60 * 60 * 24)

    let priority
    if( isNaN(daysRemaining) || daysRemaining <= 1) {
    priority = 'urgent'
  } else if(daysRemaining <= 3) {
    priority = 'high'
  } else if(daysRemaining <= 7) {
    priority = 'medium'
  } else {
    priority = 'low'
  }

  return {...item, priority, id: nextID++}
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
  else if(request.method === 'DELETE'){
    handleDelete(request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }
  else if(request.url === '/data'){
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(appdata))
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const incoming = JSON.parse( dataString )
    const newItem  = derivePriority(incoming)

    appdata.push( newItem )

    response.writeHead( 200, { 'Content-Type': 'application/json' })
    response.end( JSON.stringify( appdata ) )
  })
}

const handleDelete = function(request, response){
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let body
    try{
      body = JSON.parse(dataString)
    }
    catch(err){
      response.writeHead(400, {'Content-Type': 'text/plain'})
      response.end('Bad Request: Invalid JSON')
      return
    }

    const idToDelete = body.id
    const index = appdata.findIndex(item => item.id === idToDelete)

    if(index !== -1){
      appdata.splice(index, 1)
    }

    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(appdata))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
