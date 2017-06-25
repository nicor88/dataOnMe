# dataOnMe
DataOnMe is a platform to track data about you and your charges.
For now is possible to collect only data about your refuellings,
and to have statistics about your vehicle consumption and monthly charges
The plaform is based on Node.js and MongoDB.

## Requirements
* Node.js
* Docker

## Development
* Install dependencies: `npm install`
* Start Docker 
* Run `docker-compose up`
* Build the frontend app: `npm run build` or `npm build-min`
* Run server: `npn run server` or `npm run server-dev`

## Initialize data
To have basic data run
```node initMetadata.js ```

<pre>Credentials:
User: user
Password: password
</pre>
