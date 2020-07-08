/**
 * Rolling Shutter Service for Schellenberg Bidirectional Shutters.
 * To be used for 21xxx products (new gen).
 *
 * Manages Rolling Shutter using Schellenberg API
 *
 * @file   RollingShutterService.js
 * @author airthusiast
 * @since  1.0.0
 */

const RollingShutterService = require('../services/RollingShutterService');

class BidirectionalRollingShutterService extends RollingShutterService {

    constructor(config) {
        super(config);
    }

    /**
     * Gets the current roller shutter position
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {number} current shutter position
     */
    getPosition(deviceID) {
        var deviceValue = this.api.getDeviceValue(deviceID);
        if(typeof deviceValue.current === 'undefined') {
            return -1;
        } else {
            return (100 - deviceValue.current);
        }
    }

    /**
     * Moves the roller shutter to the given position
     *
     * @param {number} deviceID the device's ID to operate
     * @param {number} newPosition move the shutter to this position
     * @returns {boolean} true on success, false otherwise
     */
    setPosition(deviceID, newPosition) {

        if(!this.isPositionValid(newPosition)) {
            console.log('Position ' + newPosition + ' is not valid!');
            return false;
        }
        
        // Invert position
        newPosition = 100 - newPosition;
 
        // Update target position
        return this.api.setDeviceValue(deviceID, newPosition);
    }
}

module.exports = BidirectionalRollingShutterService;
