FORMAT: 1A

# Cavern API

## Authentication
You have to pass X-Token: <your-github-token> as header in every request to auth via github at your vault server.


# Group Backends
Group of all backends-related resources.


## GET /
Get all the mounted backends of a connected vault server.

+ Response 200

```json
[
  {"description":"generic secret storage","type":"generic","name":"secret"},
  {"description":"system endpoints used for control, policy and debugging","type":"system","name":"sys"}
]
```


## Mounted Backend [/{backend_name}]

+ Parameters

    + backend_name: `secret` (string) - The unique identifier of a backend.


### Retrieve a backend [GET]
Get a specific mounted backend by its name.

+ Response 200

```json
{"description":"generic secret storage","type":"generic","name":"secret","keys":[]}
```


### Create a secret [POST]
Create a new secret in a specific backend.

+ Request (application/json)

```json
{
  "description": "My awesome secret",
  "value": {
    "user": "admin",
    "password": "123"
  }
}
```

+ Response 200

    + Attributes

        + id (string)
        + description (string)


# Group Secrets

## Secret [/{backend_name}/{secret_id}]

+ Parameters

    + backend_name: `secret` (string) - The unique identifier of a backend.
    + secret_id: `123ABC` (string) - The unique identifier of a secret.

### Retrieve secret [GET]
Get a secret out of the vault server by its generated id.

+ Response 200

```json
{
  "lease_id":"secret/9548ece0-cbe2-11e5-8dfd-63c86bcd7cfe/a5c4da04-abe9-706d-4d4e-224fd95dbb51",
  "renewable":false,
  "lease_duration":2592000,
  "data":{
    "value":{
      "password":"123",
      "user":"admin"
    }
  },
  "auth":null
}
```
