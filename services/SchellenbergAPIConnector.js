/**
 * Schellenberg API Connector
 *
 * This singleton class manages calls to the Schellenberg API.
 *
 * @file   SchellenbergAPIConnector.js
 * @author airthusiast
 * @since  1.0.0
 */

const SchellenbergApi = require('schellenbergapi');

class SchellenbergAPIConnector {

    constructor(config) {

        this.smartSocket = new SchellenbergApi(config, console.log);
    }

    /**
     * Calls Schellenberg API and retieves the device's value.
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {string} device's value
     */
    getDeviceValue(deviceID) {
        // Send command
        return this.smartSocket.handler.getDeviceValue(deviceID);
    }

    /**
     * Calls Schellenberg API and send a new command to update device's value.
     *
     * @param {number} deviceID the device's ID to operate
     * @param {string} value the new device's value
     * @returns {boolean} true if success, false otherwise
     */
    setDeviceValue(deviceID, value) {
        // Send command
        return this.smartSocket.handler.setDeviceValue(deviceID, value);
    }
}

class SchellenbergAPIConnectorSingleton {

    constructor(config) {
        if (!SchellenbergAPIConnectorSingleton.instance) {
            SchellenbergAPIConnectorSingleton.instance = new SchellenbergAPIConnector(config);
        }
    }

    getInstance() {
        return SchellenbergAPIConnectorSingleton.instance;
    }
}

module.exports = SchellenbergAPIConnectorSingleton;
