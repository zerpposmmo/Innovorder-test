const express = require('express');
const bodyParser = require('body-parser');
const packageJson = require('../package.json');
const ScheduleController = require('../src/schedule/controller');
const Schedule = require('../src/schedule/data');

class App {
    constructor() {
        const app = express();

        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());

        let middlewareHttp = function (request, response, next) {
            response.setHeader('Api-version', packageJson.version);
            response.setHeader('Accept', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', '*');

            console.log(`${request.method} ${request.originalUrl}`);
            if (request.body && Object.keys(request.body).length >0) {
                console.log(`request.body ${JSON.stringify(request.body)}`);
            }
            next();
        };
        app.use(middlewareHttp);

        new ScheduleController(app, new Schedule());

        app.get('/api/version', function (request, response) {
            response.json({
                version: packageJson.version
            });
        });

        app.use(function (error, request, response, next) {
            console.error(error.stack);
            response.status(500).json({
                key: 'server.error'
            });
        });

        app.get('*',function (request, response) {
            response.status(404).json({
                key: 'not.found'
            });
        });

        this.app=app;
    }
}

module.exports = App;
