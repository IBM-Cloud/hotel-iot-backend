##### Hotel app fueled by IoT

This is the backend for a Hotel mobile app fueled by IoT. The backend provides connectivity to IoT sensors, the hotel reservation database and a node application that serves a mobile app, and web app dashboard.

You can learn more about it here:

https://vimeo.com/181085292

##### Setting up ...

- Clone, or fork the repo
- From the repo directory - type npm install ( to install node dependencies )
- You'll need a mongo database. I use http://compose.io, which is lovely to work with
- create a 'config' folder
- in the config folder place the following *config.js* file for the database config


```
module.exports = {
    'url': 'mongodb://<username>:<password>@mongodb352.aws-us-east-1-portal.21.dblayer.com:10352/cielo' 
};
```

- add a Watson IoT service pack to your Bluemix app *
- in the config folder place the following *iot.js* file for the iot config

```
module.exports = {
    "org": "<unique org id>",
    // ID has to be unique, https://docs.internetofthings.ibmcloud.com/applications/mqtt.html#/mqtt-client-identifier#mqtt-client-identifier
    "id": Date.now().toString(),
    "auth-method": "apikey",
    "auth-key": "<unique key>",
    "auth-token": "<unique token>"
}
```

* You can learn more about this here: https://developer.ibm.com/recipes/tutorials/connecting-an-intel-iot-gateway-to-watson-iot/

##### Hardware

The app uses an Intel NUC:

http://www.intel.com/content/www/us/en/nuc/nuc-kit-de3815tykhe-board-de3815tybe.html

and an Arduino 101 board:

https://www.arduino.cc/en/Main/ArduinoBoard101

and Grove sensors:

https://www.seeedstudio.com/Grove-Indoor-Environment-Kit-for-Intel-Edison-p-2427.html

More to come!
