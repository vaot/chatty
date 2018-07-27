let app = angular.module('chatty')

import { Base64 } from 'js-base64'

app.service("UsersCryptoManager", [
  '$q',
  ($q) => {

    let _webCrytoOptions = {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" }
    }

    let _webCrytoActions = ["encrypt", "decrypt"]
    let _users = {}
    let api = {}
    let _currentRoom = null

    window.UsersCryptoManager = api

    let _toArrayBufferView = (str) => {
      let bytes = new Uint8Array(str.length);

      for (let i = 0; i < str.length; i++)  {
        bytes[i] = str.charCodeAt(i);
      }

      return bytes;
    }

    let _toString = (buffer) => {
      let str = "";

      for (var i = 0; i < buffer.byteLength; i++) {
        str += String.fromCharCode(buffer[i]);
      }

      return str;
    }

    api._setPrivateKey = (userId, keyObject) => {
      if (!_users[userId]) _users[userId] = {};

      _users[userId]["privateKey"] = keyObject;
    }

    api._setPublicKey = (userId, keyObject) => {
      if (!_users[userId]) _users[userId] = {};

      _users[userId]["publicKey"] = keyObject;
    }

    api.init = (room) => {
      _currentRoom = room
    }

    api.setKeys = (userId, keyObject) => {
      api._setPrivateKey(userId, keyObject.privateKey)
      api._setPublicKey(userId, keyObject.publicKey)
    }

    api.importPublicKey = (userId, publicKeyRaw) => {
      let parsedKey = JSON.parse(Base64.decode(publicKeyRaw))

      return crypto.subtle.importKey("jwk", parsedKey, _webCrytoOptions, true, ["encrypt"])
        .then((publicKey) => {
          api._setPublicKey(userId, publicKey)
        })
    }

    api.getUsersKeys = () => {
      return _users
    }

    api.exportPublicKey = (userId) => {
      return crypto.subtle.exportKey("jwk", _users[userId].publicKey).then((raw) => {
        return Base64.encode(JSON.stringify(raw))
      })
    }

    api.isEncrypted = () => {
      return _currentRoom.encrypted
    }

    api.encrypt = (userId, message) => {

      if (!api.isEncrypted()) {
        let deferred = $q.defer()
        deferred.resolve(message)
        return deferred.promise
      }

      message = Base64.encode(message)
      let vector = crypto.getRandomValues(new Uint8Array(16))
      return crypto.subtle.encrypt({ name: "RSA-OAEP", iv: vector }, _users[userId].publicKey, _toArrayBufferView(message))
        .then((encrypted) => {
          return _toString(new Uint8Array(encrypted))
        })
    }

    api.decrypt = (userId, message) => {
      if (!api.isEncrypted()) {
        let deferred = $q.defer()
        deferred.resolve(message)
        return deferred.promise
      }

      let vector = crypto.getRandomValues(new Uint8Array(16))
      return crypto.subtle.decrypt({ name: "RSA-OAEP", iv: vector }, _users[userId].privateKey, _toArrayBufferView(message))
        .then((result) => {
          return Base64.decode(_toString(new Uint8Array(result)))
        })
    }

    api.issue = () => {
      return crypto.subtle.generateKey(_webCrytoOptions, true, _webCrytoActions)
    }

    return api
  }
])
