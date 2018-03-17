'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const http = require('http');
const tokenURL = "https://login-sandbox.safetrek.io/oauth/token";
const baseURL = "https://api-sandbox.safetrek.io/v1";

const WELCOME_ACTION = 'input.welcome';
const CALL_ACTION = 'input.call';
const HELP_TYPE_ARGUMENT = 'help_type';
const REQUEST_ACTION = 'input.request';
const CLIENT_ID = "gk1nFtbQr4pBpJD0rzAp3vaSi555sm4s";
const CLIENT_SECRET = "eWTSj_izMvD3nBJFXxkRDZF4aXDGKofYRZyzw_31oer31kuoY6";
const REDIRECT_URI = "https://oauth-redirect.googleusercontent.com/r/safetrek-68cd7";


exports.SafeTrek = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Make a silly name
  function callSafetrek (app) {
    if (app.isPermissionGranted()) {
            const address = app.getDeviceLocation().coordinates;
            console.log("latitude is: " + JSON.stringify(address.latitude) + " and longitude is: " + address.longitude);
            if (address) {
              const helpType = JSON.stringify(app.getArgument('help_type'));
              let accessToken = app.getUser().accessToken;
              //app.tell('You requested for ' + helpType.replace(/\"/g, "") + " help");
              //app.tell(JSON.stringify(accessToken));
              requestToken(app, accessToken);
            }
            else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
              app.tell('Sorry, I could not figure out where you are. Check your permissions');
            }
        } else {
            app.tell('Sorry, I need permissions to send help to your location. Try again.');
        }
  }


  function requestToken (app, accessToken) {

({"grant_type": "authorization_code",
      "code": authorizationCode,
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "redirect_uri": REDIRECT_URI });

  }

  function makeCall (app) {
  }


  function requestPermission (app) {
    app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
  }

  function welcome (app) {
    app.ask("Welcome to Safetrek. Are you in need of any help?");

  }

  let actionMap = new Map();
    actionMap.set(REQUEST_ACTION, requestPermission);
    actionMap.set(WELCOME_ACTION, welcome);
    actionMap.set(CALL_ACTION, callSafetrek);

  app.handleRequest(actionMap);
});
