const app = angular.module('chatty')

import {Presence} from 'phoenix'

app.service('RoomManager', [
  'UsersCryptoManager',
  '$q',
  'FileManager',
  (UsersCryptoManager, $q, FileManager) => {

    let _currentUserId = window.parseInt(window.Chatty.userId, 10)
    let _listenersOnMessages = []
    let _channel = null
    let _currentRoom = null
    let _initializedRooms = {}
    let _listeners = {}
    let api = {}
    let _activeUsers = {}
    let _activeUsersNormalized = []

    let _isListeningToMessages = (userId) => {
      return _listenersOnMessages.includes(userId)
    }

    let _setIsListerningToMessages = (userId) => {
      _listenersOnMessages.push(userId)
    }

    let _broadcastKey = (userId = null) => {
      let key = !userId ? "user:public_key" : `user:public_key:${userId}`

      UsersCryptoManager.exportPublicKey(api.getCurrentUserId()).then((raw) => {
        _channel.push(key, {
          public_key: raw,
          timestamp: moment().toString()
        });
      })
    }

    let _toNormalizedActiveUsers = (state) => {
      let normalized = [];

      for (let key in state) {
        let user = state[key];

        normalized.push(angular.extend({
          name: key
        }, user.metas[0]));
      }

      return normalized;
    }

    // No arrow syntax for this function
    // because we need to object arguments.
    let _run = function() {
      let event = arguments[0]
      let args = Array.prototype.slice.call(arguments, 1)
      let callbacks = _listeners[event] || []

      for (let callback of Array.from(callbacks)) {
        if (callback) {
          callback.apply(this, args)
        }
      }
    }

    let _setup = () => {
      _channel.on('presence_state', payload => {
        _activeUsers = Presence.syncState(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers);
        _run('presence', api.getActiveUsers())
      })

      _channel.on(`message:new:${api.getCurrentUserId()}`, payload => {
        UsersCryptoManager.decrypt(api.getCurrentUserId(), payload['message']).then((raw) => {
          payload['message'] = raw
          _run('message', payload)
        })
      })

      _channel.on(`file:new:${api.getCurrentUserId()}`, payload => {
        UsersCryptoManager.decrypt(api.getCurrentUserId(), payload['file'], { raw: true }).then((raw) => {
          FileManager.compose(payload, raw, (fileObj) => {
            payload["message"] = FileManager.linkify(fileObj, payload)
            _run('file', payload)
          })
        })
      })

      _channel.on('presence_diff', payload => {
        _activeUsers = Presence.syncDiff(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers)
        _run('presence', api.getActiveUsers())
      })

      _channel.on('user:public_key', payload => {
        if (payload["user_id"] == api.getCurrentUserId()) return;
        UsersCryptoManager.importPublicKey(payload["user_id"], payload["public_key"])

        // setTimeout so that we push this to the end of the call stack
        setTimeout(()=> { _broadcastKey(payload['user_id']) }, 1000)
      })

      _channel.on(`user:public_key:${api.getCurrentUserId()}`, payload => {
        // No need to import the key if this message is coming from the current user
        if (payload["user_id"] == api.getCurrentUserId()) return;

        UsersCryptoManager.importPublicKey(payload["user_id"], payload["public_key"])
      })

      _channel.on(`room:attr`, payload => {
        if (payload.encrypted != _currentRoom.encrypted) {
          _currentRoom.encrypted = payload.encrypted

          if (_currentRoom.encrypted) {
            api.setupEncryption()
          }
          _run('encryptionChanged', _currentRoom.encrypted)
        }

        if (payload.color != _currentRoom.color) {
          _currentRoom.color = payload.color
          _run('themeColor', _currentRoom.color)
        }
      })

    }

    api.getActiveUsers = () => {
      return _activeUsersNormalized;
    }

    api.getCurrentUserId = () => {
      return _currentUserId;
    }

    api.getUser = (userId) => {
      let user = api.getActiveUsers().filter((user) => {
        return user.user_id == userId
      })[0]

      return user || {}
    }

    api.getCurrentUser = () => {
      let user = api.getActiveUsers().filter((user) => {
        return user.user_id == api.getCurrentUserId()
      })[0]

      user = user || {}

      user.avatar_url = window.Chatty.avatarUrl
      user.user_id = api.getCurrentUserId()

      return user
    }

    api.on = (event, callback) => {
      if (!_listeners[event]) {
        _listeners[event] = [];
      }

      _listeners[event].push(callback);
    }

    api.init = (channel, room) => {
      let deferred = $q.defer()

      _channel = channel
      _currentRoom = room

      if (!_initializedRooms[room.roomId]) {
        _setup()
      }

      if (!api.isEncrypted()) {
        deferred.resolve()
        return deferred.promise
      }

      api.setupEncryption().then(() => {
        deferred.resolve()
      }).catch(() => {
        deferred.reject()
      })

      _initializedRooms[room.roomId] = true
      return deferred.promise
    }

    api.setupEncryption = () => {
      return UsersCryptoManager.issue().then((objKey) => {
        UsersCryptoManager.setKeys(api.getCurrentUserId(), objKey)
        _broadcastKey()
      })
    }

    api.sendFile = (fileBlob, file, progressFn) => {
      FileManager.chunk(fileBlob, (idx, total, chunk) => {
        for (let user of api.getActiveUsers()) {
          UsersCryptoManager.encrypt(user.user_id, chunk, { raw: true }).then((encrypted) => {
            _channel.push(`file:new:${user.user_id}`, {
              file: encrypted,
              timestamp: moment().toString(),
              index: idx,
              total: total,
              type: file.type,
              name: file.name
            })
            progressFn(idx, total)
          }).catch((e)=> { console.log(e) })
        }
      })
    }

    api.send = (message, options = {}) => {
      for (let user of api.getActiveUsers()) {
        UsersCryptoManager.encrypt(user.user_id, message, options).then((encrypted) => {
          _channel.push(`message:new:${user.user_id}`, {
            message: encrypted,
            timestamp: moment().toString()
          })
        }).catch((e)=> { console.log(e) })
      }
    }

    api.isEncrypted = () => {
      return UsersCryptoManager.isEncrypted()
    }

    api.onEncryptedChange = ($scope, room) => {
      if (room.encrypted) {
        if (!api.isEncrypted() && room.encrypted) {
          api.setupEncryption().then(() => {
            $scope.room.encrypted = room.encrypted
          })
          return
        }

        $scope.room.encrypted = room.encrypted
      }
    }

    return api;
  }
])
