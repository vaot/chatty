let app = angular.module('chatty');

app.service("CryptoService", [
  () => {

    let _webCrytoOptions = {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" }
    }

    let _webCrytoActions = ["encrypt", "decrypt"]

    let api = {}

    api.issue = () => {
      return crypto.subtle.generateKey(_webCrytoOptions, true, _webCrytoActions)
    }

    return api
  }
]);
