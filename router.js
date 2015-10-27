var debug = require('debug')('cavern:router')
var express = require('express')
var bodyParser = require('body-parser')
var _ = require('lodash')
var uuid = require('uuid')
var vault = require('node-vault')({
  endpoint: process.env['VAULT_ADDR'],
  token: process.env['VAULT_TOKEN']
})

var router = express.Router()
router.use(bodyParser.json())

// key storage
var keys = {}

var getMounts = function (req, res, next) {
  vault.mounts(function (err, result) {
    if (err) {
      debug(err)
      return next(err)
    }
    req.mounts = _.map(result, function (m, key) {
      m.name = key.slice(0, -1) // remove trailing slash
      return m
    })
    next()
  })
}

var getBackend = function (req, res, next) {
  var backend = req.params.backend
  if (!backend) {
    return next(new Error('No backend specified'))
  }
  var index = _.findKey(req.mounts, function (m) {
    return m.name === backend
  })
  if (!index) {
    return next(new Error('No backend mounted with that name'))
  }
  req.backend = req.mounts[index]
  req.backend.keys = keys[backend]
  next()
}

// Lists all the mounted secret backends
router.get('/', getMounts, function (req, res) {
  res.send(req.mounts)
})

router.get('/:backend', getMounts, getBackend, function (req, res) {
  res.send(req.backend)
})

router.post('/:backend', getMounts, getBackend, function (req, res) {
  var id = uuid.v1()
  var backend = req.params.backend
  var secret = {
    id: id,
    description: req.body.description
  }
  debug(secret)
  if (!keys[backend]) {
    keys[backend] = []
  }
  var path = [backend, secret.id].join('/')
  vault.write(path, { value: req.body.value }, function (err, result) {
    if (err) debug(err)
    keys[backend].push(secret)
    res.send(secret)
  })
})

router.get('/:backend/:key', getMounts, getBackend, function (req, res) {
  var backend = req.params.backend
  var key = req.params.key
  var path = [backend, key].join('/')
  vault.read(path, function (err, result) {
    if (err) debug(err)
    res.send(result)
  })
})

module.exports = router
