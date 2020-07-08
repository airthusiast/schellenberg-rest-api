/**
 * REST API controller
 *
 * The Schellenberg REST API is managed by this class.
 *
 * @file   RestAPIController.js
 * @author airthusiast
 * @since  1.0.0
 */

const express = require('express');
const UnidirectionalRollingShutterService = require('../services/UnidirectionalRollingShutterService');
const BidirectionalRollingShutterService = require('../services/BidirectionalRollingShutterService');
const valueMapping = new Map([['up', 1], ['down', 2], ['stop', 0]]);

class RestAPIController {

    /**
     * Initliazes using the provided port
     * 
     * @param {int} inConfig the REST API config
     */
    constructor(config) {

        this.uniDirectionalRSService = new UnidirectionalRollingShutterService(config);
        this.biDirectionalRSService = new BidirectionalRollingShutterService(config);
        this.port = config.restAPIConfig.port;
        
        this.startRestAPI();
    }

    /**
     * Returns the rolling shutter service based on the Schellenberg product generation (1 or 2)
     */
    getRollingShutterService(gen) {
        if(gen == 'v1') {
            return this.uniDirectionalRSService;
        } else if(gen == 'v2') {
            return this.biDirectionalRSService;
        } else {
            throw new Error('Schellenberg Generation ' + gen + ' is not valid!');
        }
    }

    /**
     * Starts and the REST API
     */
    startRestAPI() {

        var app = express();
        app.get('/rollingshutter/:gen/open/:deviceID', (req, res) => {
            var deviceID = parseInt(req.params.deviceID);
            this.getRollingShutterService(req.params.gen).open(deviceID);
            var log = 'Rolling Shutter OPEN command received for device: ' + deviceID;
            console.debug(log);
            return res.send(log);
        });

        app.get('/rollingshutter/:gen/close/:deviceID', (req, res) => {
            var deviceID = parseInt(req.params.deviceID);
            this.getRollingShutterService(req.params.gen).close(deviceID);
            var log = 'Rolling Shutter CLOSE command received for device: ' + deviceID;
            console.debug(log);
            return res.send(log);
        });

        app.get('/rollingshutter/:gen/stop/:deviceID', (req, res) => {
            var deviceID = parseInt(req.params.deviceID);
            this.getRollingShutterService(req.params.gen).stop(deviceID);
            var log = 'Rolling Shutter STOP command received for device: ' + deviceID;
            console.debug(log);
            return res.send(log);
        });

        app.get('/rollingshutter/:gen/getposition/:deviceID', (req, res) => {
            var deviceID = parseInt(req.params.deviceID);
            var position = this.getRollingShutterService(req.params.gen).getPosition(deviceID);
            var log = 'Rolling Shutter GET POSITION command received for device: ' + deviceID + ' (current position => ' + position + ')';
            console.debug(log);
            return res.send(position.toString());
        });

        app.get('/rollingshutter/:gen/setposition/:deviceID/:position', (req, res) => {

            var deviceID = parseInt(req.params.deviceID);
            var position = parseInt(req.params.position);
            var result = this.getRollingShutterService(req.params.gen).setPosition(deviceID, position);
            var log;
            if(result) {
                var log = 'Rolling Shutter SET POSITION command received for device: ' + deviceID + ' (new position => ' + position + ')';
            } else {
                log = 'Oups. Somesthing went wrong!';
            }
            console.debug(log);
            return res.send(log);
        });

        // Start Lisetning for commands
        app.listen(this.port, () => {
            console.info('#############################################');
            console.info('# Welcome! Rest API listening on port ' + this.port + '! #');
            console.info('#############################################');
        });
    }
}

module.exports = RestAPIController;
