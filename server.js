var debug = require('debug')('cavern:server')
var express = require('express')
var http = require('http')
var config = require(__dirname + '/config.js')
var router = require(__dirname + '/router.js')(config)

var app = express()
app.set('port', config.port)
app.use('/', router)

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  debug('running on port', app.get('port'))
})
