var debug = require('debug')('cavern:server')
var express = require('express')
var pkg = require(__dirname + '/package.json')
var http = require('http')
var router = require(__dirname + '/router.js')

var app = express()
var port = process.env['PORT'] || 3030

app.set('port', port)

app.use('/', router)

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  debug('Node app is running on port', app.get('port'))
})
