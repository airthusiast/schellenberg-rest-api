/**
 * Rolling Shutter Service for Schellenberg Unidirectional Shutters.
 * To be used for 20xxx products (first gen).
 *
 * Manages Rolling Shutter using Schellenberg API
 *
 * @file   RollingShutterService.js
 * @author airthusiast
 * @since  1.0.0
 */

const RollingShutterService = require('../services/RollingShutterService');
const RollingShutterPositionStore = require('../datastores/RollingShutterPositionStore');

class UnidirectionalRollingShutterService extends RollingShutterService {

    constructor(config) {
        super(config);
        this.positionMap = new RollingShutterPositionStore();
        this.rollingShutterFullOperationDuration = 20;
    }

    /**
     * Opens the rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     */
    open(deviceID) {
        // Save position
        this.positionMap.setPosition(deviceID, 100);
        return super.open(deviceID);
    }

    /**
     * Closes the rolling shutter
     *
     * @param {number} deviceID the device's ID to operate
     */
    close(deviceID) {
        // Save position
        this.positionMap.setPosition(deviceID, 0);
        return super.close(deviceID);
    }

    /**
     * Gets the current roller shutter position
     *
     * @param {number} deviceID the device's ID to operate
     * @returns {number} current shutter position
     */
    getPosition(deviceID) {
        return this.positionMap.getPosition(deviceID);
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
            return false;
        }

        // Time to position
        var currentPosition = this.getPosition(deviceID);
        var positionDiff = newPosition - currentPosition;
        var direction = positionDiff > 0 ? 'open' : ' close';
        var timeToPosition = Math.abs(this.rollingShutterFullOperationDuration * (positionDiff / 100));

        // If no change, stop here
        if(positionDiff == 0) {
            return true;
        }

        // Save position
        this.positionMap.setPosition(deviceID, newPosition);

        // Start motion
        if(positionDiff > 0) {
            this.api.setDeviceValue(deviceID, this.valueMapping.get('open'));
        } else {
            this.api.setDeviceValue(deviceID, this.valueMapping.get('close'));
        }

        // Full open or full down => Stop here
        if (newPosition == 0 || newPosition == 100) {
            return true;
        }

        setTimeout(() => { 
             // Stop when reached position
             this.stop(deviceID);
        }, timeToPosition * 1000);

        return true;
    }
}

module.exports = UnidirectionalRollingShutterService;
