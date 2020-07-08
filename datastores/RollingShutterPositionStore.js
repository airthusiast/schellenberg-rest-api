/**
 * Rolling Shutter Position Store
 *
 * Stores the shutter position in a map and persists it to disk.
 *
 * @file   RollingShutterPositionStore.js
 * @author airthusiast
 * @since  1.0.0
 */

const defaultPosition = 100;
const fs = require('fs');
const positionFile = './positions.json'

class RollingShutterPositionStore {

    constructor() {
        this.loadMap();
    }
	
    /**
     * Gets the shutter position from the datastore
     *
     * @param {number} deviceID the device's ID
     * @returns {number} the position to retrieve
     */
    getPosition(deviceID) {
        return  this.rollingShutterPositionMap.has(parseInt(deviceID)) ? this.rollingShutterPositionMap.get(parseInt(deviceID)) : defaultPosition;
    }

    /**
     * Saves the shutter position in the datastore
     *
     * @param {number} deviceID the device's ID
     * @returns {number} the position to save
     */
    setPosition(deviceID, position) {
        deviceID = parseInt(deviceID);
        position = parseInt(position);
        if (Number.isInteger(deviceID) && Number.isInteger(position)) {
            this.rollingShutterPositionMap.set(deviceID, position);
            this.saveMap()
        }
    }

    /**
     * Writes the in memory datastore map to disk (async)
     */
    saveMap() {
        fs.writeFile(positionFile, JSON.stringify(Array.from(this.rollingShutterPositionMap.entries())), (err) => {
            if (err) throw err;
            console.log('Rolling Shutter Positions saved to file: ' + positionFile);
        });
    }

    /**
     * Reads the datastore map from disk (async)
     */
    loadMap() {
        fs.readFile(positionFile, (err, data) => {
            try { 
                if (err) throw err;
                this.rollingShutterPositionMap = new Map(JSON.parse(data));
            } catch (e) {
                this.rollingShutterPositionMap = new Map();
            }
        });
    }
}

module.exports = RollingShutterPositionStore;
