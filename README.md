# cavern

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

A RESTful wrapper around Hashicorp's vault

## Why?
When you use Hashicorp's vault you never know the complete list of already saved
secrets. With cavern you have a lightweight proxy to your vault server that only saves
the paths to a secret but not the secret itself.

## API

### `GET /`
Get all the mounted backends of a connected vault server.

### `GET /:backend`
Get a specific mounted backend by its name.

### `POST /:backend`
Create a new secret by passing something like:
```json
{
  "description": "My super secret",
  "value": {
    "username": "admin",
    "password": "123"
  }
}
```
The `value` object will be written to the vault server.

Returns something like:
```json
{
  "id": "63090fa0-7cf8-11e5-9601-736433b13893",
  "description": "My super secret"
}
```

### `GET /:backend/:key`
Get a secret out of the vault server by its generated id `:key`.
