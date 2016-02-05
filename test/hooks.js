var hooks = require('hooks');
var fs = require('fs');
var vault = require('node-vault')({
  endpoint: 'http://dockerhost:8200'
});

var globals = {};

hooks.beforeAll(function (transactions, done) {
  vault.init({ secret_shares: 1, secret_threshold: 1 }, function(err, result) {
    if (err) {
      hooks.log(err);
      return done(err);
    }
    var keys = globals.keys = result.keys;
    vault.token = globals.root_token = result.root_token;
    // fs.writeFileSync('/tmp/fs.tmp', '');
    // unseal vault server
    vault.unseal({ secret_shares: 1, key: keys[0] }, done);
  });
});

hooks.beforeEach(function (transaction, done) {
  transaction.request.headers['X-Token'] = globals.root_token;
  // hooks.log(transaction.name);
  done();
});

hooks.after("Backends > Mounted Backend > Create a secret", function (transaction, done) {
  globals.secret_id = JSON.parse(transaction.real.body)['id'];
  done();
});

hooks.before("Secrets > Secret > Retrieve secret", function (transaction, done) {
  if (globals.secret_id) {
    transaction.fullPath = transaction.fullPath.replace('123ABC', globals.secret_id);
  }
  done();
});
