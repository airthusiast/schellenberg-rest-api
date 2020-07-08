/**
 * Entry point for the Schellenberg REST API module
 *
 * @file   main.js
 * @author airthusiast
 * @since  1.0.0
 */

const FileSystem = require('fs');
const Path = require("path");
const RestAPIController = require('./controllers/RestAPIController')
const SchellenbergAPIConnector = require('./services/SchellenbergAPIConnector')
const args = process.argv.slice(2)

// Load config from provided config file
var configFile = args[0];
if(typeof configFile === 'undefined') {
    throw Error('Missing argument: Please provide JSON config filepath!');
}
try {
    var config = JSON.parse(FileSystem.readFileSync(configFile));
} catch(err) {
    throw Error('Error loading JSON config file! ' + err);
}

// Prepare Schellenberg API config
let myConfig = {
    debugConfig: {
        debugLog: config.advanced.enableDebug
    },
    sessionConfig: {
        username: config.connexion.username,
        password: config.connexion.password,
        cSymbol: config.advanced.cSymbol,
        cSymbolAddon: config.advanced.cSymbolAddon,
        shcVersion: config.advanced.shcVersion,
        shApiVersion: config.advanced.shApiVersion,
    },
    smartSocketConfig: {
        host: config.connexion.host,
        port: config.connexion.port,
        certificate: FileSystem.readFileSync(Path.resolve(__dirname, "./certs/CA.pem"))
    },
    restAPIConfig: {
        port: 8181
    }
};

// Schellenberg - Start REST API
var restapi = new RestAPIController(myConfig);

// Show available device infos on start
var api = new SchellenbergAPIConnector(myConfig).getInstance();
api.smartSocket.on('newDI', (data) => {
    console.info('Device found:');
    console.info(' > deviceID:          ' + data.deviceID);
    console.info(' > masterDeviceID  :  ' + data.masterDeviceID);
    console.info(' > masterDeviceName:  ' + data.masterDeviceName);
    console.info(' > deviceName:        ' + data.deviceName);
    console.info(' > deviceDesignation: ' + data.deviceDesignation);
});
