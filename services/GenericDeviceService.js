/**
 * Generic Device Services
 *
 * Manages Generic Devices using Schellenberg API
 *
 * @file   GenericDeviceService.js
 * @author GimpArm
 * @since  1.0.0
 */

const SchellenbergAPIConnector = require('./SchellenbergAPIConnector');

class GenericDeviceService {

    constructor(config) {

        this.api = new SchellenbergAPIConnector(config).getInstance();
    }

    /**
     * Sends a value to the device
     *
     * @param {number} deviceID the device's ID to operate
     * @param {string} value to set on for the device
     * @returns {boolean} true on success, false otherwise
     */
    setValue(deviceID, value) {
        if (!this.isValidDevice(deviceID)) {
            console.error('Received deviceID <' + deviceID + '> is not valid! Command cancelled.');
            return '';
        }

        var sendVal = this.convertValue(value);
        return this.api.setDeviceValue(deviceID, sendVal);
    }

    /**
     * Gets the current roller shutter position
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {number} current value
     */
    getValue(deviceID) {
        if (!this.isValidDevice(deviceID)) {
            console.error('Received deviceID <' + deviceID + '> is not valid! Command cancelled.');
            return '';
        }

        return this.api.getDeviceValue(deviceID);
    }

    /**
     * Checks if the device is valid
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {boolean} true if the device is valid, false otherwise
     */
    isValidDevice(deviceID) {
        return this.api.smartSocket.handler.dataStorage.deviceMap.has(deviceID);
    }

    /**
     * Converts a string value to the proper JavaScript type so it will be serialized correctly
     *
     * @param {string} value to convert to the proper type
     * @returns {any} value as int, float, boolean, or string
     */
    convertValue(value){
        if (!isNaN(value)) {
            if (value.indexOf('.' != -1)) {
                return parseFloat(value);
            }
            return parseInt(value);
        } else if (value.toLowerCase() == 'true') {
            return true;
        } else if (value.toLowerCase() == 'false') {
            return false;
        }
        return value;
    }
}

module.exports = GenericDeviceService;
