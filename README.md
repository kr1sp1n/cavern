# cavern

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A RESTful wrapper around Hashicorp's vault

## Why?
When you use Hashicorp's vault you never know the complete list of already saved
secrets. With cavern you have a lightweight proxy to your vault server that only saves
the paths to a secret but not the secret itself.


## Config

You can set configs via environment variables.

* `PORT` - the port of the server
* `VAULT_ADDR` - the url to your vault server
* `VAULT_TOKEN` - the vault token to access your vault server to do the github login


## API

See [API] specs.



[API]: https://github.com/kr1sp1n/cavern/blob/master/API.md
