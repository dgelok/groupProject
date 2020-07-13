import {APIurls, firebaseAPIkey} from "./apikeys.js"

firebase.initializeApp({
    apiKey: firebaseAPIkey,
    authDomain: "stock-market-playground.firebaseapp.com",
    projectId: "stock-market-playground"
});
