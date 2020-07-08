/**
 * Rolling Shutter Services
 *
 * Manages Rolling Shutter using Schellenberg API
 *
 * @file   RollingShutterService.js
 * @author airthusiast
 * @since  1.0.0
 */

const SchellenbergAPIConnector = require('./SchellenbergAPIConnector');

class RollingShutterService {

    constructor(config) {

        this.api = new SchellenbergAPIConnector(config).getInstance();
        this.valueMapping = new Map([['open', 1], ['close', 2], ['stop', 0]]);
    }

    /**
     * Opens the rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     */
    open(deviceID) {
        return this.api.setDeviceValue(deviceID, this.valueMapping.get('open'));
    }

    /**
     * Closes the rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     */
    close(deviceID) {
        return this.api.setDeviceValue(deviceID, this.valueMapping.get('close'));
    }

    /**
     * Stops the rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     */
    stop(deviceID) {
        return this.api.setDeviceValue(deviceID, this.valueMapping.get('stop'));
    }

    /**
     * Gets the current roller shutter position
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {number} current shutter position
     */
    getPosition(deviceID) {
        throw new Error('Implement this method in a subclass!');
    }

    /**
     * Moves the roller shutter to the given position
     *
     * @param {number} deviceID the device's ID to operate
     * @param {number} newPosition move the shutter to this position
     * @returns {boolean} true on success, false otherwise
     */
    setPosition(deviceID, newPosition) {
        throw new Error('Implement this method in a subclass!');
    }

    /**
     * Checks if the device is a rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {boolean} true if the device is a rolling shutter, false otherwise
     */
    isRollingShutter(deviceID) {
        // TODO: check if really a RS
        return this.smartSocket.handler.dataStorage.deviceMap.has(deviceID);
    }

    /**
     * Checks whether the position is valid. Needs to be a number between 0% and 100%.
     *
     * @param {number} the value to validate
     * @returns {boolean} true if the position is valid, false otherwise
     */ 
    isPositionValid(value) {
        return (Number.isInteger(value) && value >= 0 && value <= 100)
    }

    /**
     * Calls Schellenberg API and send a new command to update device's value.
     *
     * @param {number} deviceID the device's ID to operate
     * @param {string} value the new device's value
     * @returns {boolean} true if success, false otherwise
     */
    sendSchellenbergCommand(deviceID, value) {
        // Send command
        if(this.isRollingShutter(deviceID)) {
            return this.api.setDeviceValue(deviceID, value);
        } else {
            console.error('Received deviceID <' + deviceID + '> or value <' + value + '> not valid! Command cancelled.');
            return false;
        }
    }
}

module.exports = RollingShutterService;
