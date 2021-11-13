# Event Emitter

### Docker / Mongodb

    $ docker pull mongo:4.4
    $ docker run -p 127.0.0.1:27017:27017  --name mongo  -v ~/mongodb/:/data/db  -d mongo:4.4


###  API

    $ curl -X POST http://127.0.0.1:5001/api/users -H 'Content-Type: application/json' -d '{ "name": "Anton", "department":"Software" }'

