'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const baseURL = "https://api-sandbox.safetrek.io/v1";
const axios = require('axios');

const WELCOME_ACTION = 'input.welcome';
const CALL_ACTION = 'input.call';
const HELP_TYPE_ARGUMENT = 'help_type';
const REQUEST_ACTION = 'input.request';

exports.SafeTrek = functions.https.onRequest((request, response) => {

  const app = new DialogflowApp({request, response});

  function callSafetrek (app) {

    if (app.isPermissionGranted()) {
            const address = app.getDeviceLocation();
            if (address) {
              const helpType = app.getArgument('help_type');
              let accessToken = app.getUser().access_token;
              //app.tell('You requested for ' + helpType.replace(/\"/g, "") + " help");
              //requestToken(app, accessToken, address);
              app.tell("Help will be on your way");
              makeCall(accessToken, address, helpType).then((output) => {
                console.log("SafeTrek Response: " + JSON.stringify(output));
                app.tell("Help will be sent");
              }).catch((error) => {
                console.log("SafeTrek Error: " + JSON.stringify(error));
                app.tell("Error calling for help");
              });

            }
            else {
              app.tell("Sorry, it doesn't seem like I can find your address.");
            }
        } else {
            app.tell('Sorry, I need your permission to locate you and send help.');
        }
  }


  function makeCall (accessToken, address, helpType) {
    var coordinates = address.coordinates;
    helpType = String(helpType);
    var fire = false;
    var police = false;
    var medical = false;

     if (helpType === "fire") {
       fire = true;
     } else if (helpType === "law_enforcement") {
       police = true;
     } else if (helpType === "medical") {
       medical = true;
     } else if (helpType === "all") {
       fire = true;
       police = true;
       medical = true;
     }

      const header = {
        	"headers": {
        		"Authorization": "Bearer " + accessToken,
        		"Content-Type": "application/json",
        	}
        };

      const obj = {
          "services": {
            "police": fire,
            "fire": police,
            "medical": medical
          },
          "location.coordinates": {
            "lat": coordinates.latitude,
            "lng":coordinates.longitude,
            "accuracy": 5
          }

         //  "location.address": {
         //   "line1": address.postalAddress.addressLines[0],
         //   "city": address.city,
         //   "state": address.postalAddress.administrativeArea,
         //   "zip": address.zipCode
         // }
        };

        return axios.post('https://api-sandbox.safetrek.io/v1/alarms', obj, header)

        .then((response) => {
          return Promise.resolve(response)
        })
        .catch(error => {
          return Promise.reject(error)})


  }

  function requestPermission (app) {
    app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
  }


  let actionMap = new Map();
    actionMap.set(REQUEST_ACTION, requestPermission);
    actionMap.set(CALL_ACTION, callSafetrek);

    app.handleRequest(actionMap);
});
