# Poke Lights Server
This is the server that manages the state of the POKE Lights via webhooks.

## Requirements
- Node JS
- NPM
- Redis Server

## Developing Locally
Clone the repo:

```
$ git clone git@github.com:pokelondon/halo-server.git
$ cd pokelights-server
```
### Install requirements
```
$ npm install
```
You might need to install Redis Server, recommended to use Homebrew

```
$ brew install redis-server
```
### Development
You may wish to use different ports or Redis server. If so, copy and source the example `.env` file

```
$ mv example.env && vim .env # edit it
$ source .env
```
There are 2 processes, the main Node JS process...

```
$ redis-server &
$ npm start
```
...and Grunt for the local frontend development

```
$ grunt
```
The node process will serve HTTP requests on port `8080` unless otherwise specified, and a TCP Socket server on `8124` for the processing client to connect to. You can view the payloads the Processing client will receive with Telnet.

```
$ telnet localhost 8124
```

## Deployment
Ensure your live settings are sourced to the enviromnent and the ports are open (for the socket connection as well as the webservice).
