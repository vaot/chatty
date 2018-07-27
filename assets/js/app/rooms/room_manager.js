const app = angular.module('chatty')

import {Presence} from 'phoenix'

app.service('RoomManager', [
  'UsersCryptoManager',
  '$q',
  (UsersCryptoManager, $q) => {

    let _currentUserId = window.parseInt(window.Chatty.userId, 10)
    let _listenersOnMessages = []
    let _channel = null
    let _listeners = {}
    let api = {}
    let _activeUsers = {}
    let _activeUsersNormalized = []

    window.RoomManager = api;

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

    let _run = (event, args) => {
      let callbacks = _listeners[event] || [];

      for (let callback of Array.from(callbacks)) {
        if (callback) {
          callback(args);
        }
      }
    }

    let _setup = () => {
      _channel.on('presence_state', payload => {
        _activeUsers = Presence.syncState(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers);
        _run('presence', api.getActiveUsers());
      })

      _channel.on(`message:new:${api.getCurrentUserId()}`, payload => {
        UsersCryptoManager.decrypt(api.getCurrentUserId(), payload['message']).then((raw) => {
          payload['message'] = raw
          _run('message', payload);
        })
      })

      _channel.on('presence_diff', payload => {
        _activeUsers = Presence.syncDiff(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers)
        _run('presence', api.getActiveUsers());
      })

      _channel.on('user:public_key', payload => {
        if (payload["user_id"] == api.getCurrentUserId()) return;
        UsersCryptoManager.importPublicKey(payload["user_id"], payload["public_key"])

        // setTimeout so that we push this to the end of the call stack
        setTimeout(()=> { _broadcastKey(payload['user_id']) })
      })

      _channel.on(`user:public_key:${api.getCurrentUserId()}`, payload => {
        if (payload["user_id"] == api.getCurrentUserId()) return;
        UsersCryptoManager.importPublicKey(payload["user_id"], payload["public_key"])
      })
    }

    api.getActiveUsers = () => {
      return _activeUsersNormalized;
    }

    api.getCurrentUserId = () => {
      return _currentUserId;
    }

    api.on = (event, callback) => {
      if (!_listeners[event]) {
        _listeners[event] = [];
      }

      _listeners[event].push(callback);
    }

    api.init = (channel) => {
      let deferred = $q.defer()

      _channel = channel
      _setup()

      if (!api.isEncrypted()) {
        deferred.resolve()
        return deferred.promise
      }

      api.setupEncryption().then(() => {
        deferred.resolve()
      }).catch(() => {
        deferred.reject()
      })

      return deferred.promise
    }

    api.setupEncryption = () => {
      return UsersCryptoManager.issue().then((objKey) => {
        UsersCryptoManager.setKeys(api.getCurrentUserId(), objKey)
        _broadcastKey()
      })
    }

    api.send = (message) => {
      for (let user of api.getActiveUsers()) {
        UsersCryptoManager.encrypt(user.user_id, message).then((encrypted) => {
          _channel.push(`message:new:${user.user_id}`, {
            message: encrypted,
            timestamp: moment().toString()
          })
        })
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

    api.sendFriend = (user) => {
      _channel.push('friend:new', { user_id: user.user_id, timestamp: moment().toString() });
    }

    return api;
  }
])
