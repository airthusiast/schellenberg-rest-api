# Schellenberg REST API

## Description
This module exposes a simple REST API that can be used to control all your Schellenberg, ABUS, Paulmann, Steinel devices.

This Add-On uses the Schellenberg API developed by [LoPablo](https://github.com/LoPablo).

Tests have been carried out on: 
- Schellenberg SH1-Box
- Smart Friends Box

## How to use the REST API?
### Configuration and first start
- Install the Schellenberg API module
  ```bash
  npm install https://github.com/airthusiast/SchellenbergApi
  ```
- Clone this repository
  ```bash
  git clone https://github.com/airthusiast/schellenberg-rest-api.git
  ```
- Copy the provided the configuration sample (config.json.sample) and change it accordingly:
  ```yaml
  {
    "connexion": {
      "host": "192.168.1.3", #-------> IP of your Schellenberg SH1 Box / Smart Friends Box
      "port": 4300, #----------------> Port of the box, generally 4300/tcp
      "username": "myuser", #--------> Username
      "password": "mysecret" #-------> Password
    },
    "advanced": {
      "enableDebug": true, #---------> Enable or disable debug mode
      "cSymbol": "D19033", #---------> Extra param 1
      "cSymbolAddon": "i", #---------> Extra param 2
      "shcVersion": "2.19.7", #------> Extra param 3
      "shApiVersion": "2.15" #-------> Extra param 4
    }
  }
  ```
  **Extra API parameters**:
  In order to find these values, simply open the Schellenberg or Smart Friends App and go to the information page as illustrated: 

  ![alt](images/doc00.jpg)

- Now the Schellenberg REST API:
  ```bash
  node main.js myconfig.json
  ```
### Collect devices ID's
Device ID's **are important**, they will be used to interact with the device itself.

Once the REST API is successfully started, the console will output a complete list of all the devices found in the box.
The output looks like this:
```bash
#############################################
# Welcome! Rest API listening on port 8181! #
#############################################
Device found:
> deviceID:          11223
> masterDeviceID  :  0
> masterDeviceName:  undefined
> deviceName:        Serverstatus
> deviceDesignation: Serverstatus
Device found:
> deviceID:          9589
> deviceName:        SH1-Box
> deviceDesignation: pushNotification
Device found:
> deviceID:          3079 #-------------> Example: Device ID of a roller shutter
> masterDeviceID  :  5243
> masterDeviceName:  Roller Shutter 1
> deviceName:        Motor
> deviceDesignation: Rohrmotor PREMIUM
Device found:
> deviceID:          36221 #-------------> Example: Device ID of a second roller shutter
> masterDeviceID  :  2411
> masterDeviceName:  Roller Shutter 2
> deviceName:        Motor
> deviceDesignation: Rohrmotor PREMIUM
...
...
...
```
**Note:** If debug mode is enabled you will see much more output. If it's too verbose, simply disable it.
Write them down, you will need them in the next step!

### Using REST API

The module exposes a simple REST API, which can be called to control your devices.

> **Important note:** Currently there is only one type of devices supported: Schellenberg Rolling shutters (Gen 1 and gen 2).
#### Schellenberg Gen 1 and Gen 2 shutters
- Shutters starting with product ID `20xxx` belong to the first generation (v1)
- Shutters starting with product ID `21xxx` belong to the second generation (v2). On the market since beginning 2020.

The main difference between both is that the second generation allows bidirectional communication between the roller shutter and the box. It is now possible to know the precise shutter position at any time, even if not operated via the app. As soon as the roller shutter is operated, a notification is instantly sent to the box. The Schellenberg API automatically receives the update.

> **Note**: the SH1-Box does not provide this functionality (yet) -> Smart Friends Box is required.

#### Examples on how to use the REST API
- Open Shutter: 

  ```http://127.0.0.1:8181/rollingshutter/v1/open/11163```
- Close shutter:

  ```http://127.0.0.1:8181/rollingshutter/v1/close/11163```
- Stop shutter:
  
  ```http://127.0.0.1:8181/rollingshutter/v1/stop/11163```
- Go to position 50%:
  
  ```http://127.0.0.1:8181/rollingshutter/v2/setposition/22594/50```
- Get current shutter position:
  
  ```http://127.0.0.1:8181/rollingshutter/v2/getposition/22594```

As it can be seen, actions are send using the device ID. 
It is mandatory to specify the version of the roller shutter (v1 or v2). 

## Authors
- **Schellenberg REST API**
  Author: [AirThusiast](https://github.com/airthusiast)
  Repository: https://github.com/airthusiast/SchellenbergBridge
- **Schellenberg API**
  Author: [LoPablo](https://github.com/LoPablo)
  Repository: https://github.com/LoPablo/SchellenbergApi

## Acknowledgments
Special thanks to [LoPablo](https://github.com/LoPablo) for his work on creating the Schellenberg API.