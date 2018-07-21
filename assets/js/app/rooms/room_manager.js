const app = angular.module('chatty');

import {Presence} from 'phoenix';

app.service('RoomManager', [
  () => {

    let _channel = null;
    let _listeners = {};
    let api = {};
    let _activeUsers = {};
    let _activeUsersNormalized = [];
    let _activeFriends = {};
    let _activeFriendsNormalized = [];

    window.RoomManager = api;

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
      _channel.on('message:new', payload => {
        _run('message', payload);
      })

      _channel.on('presence_state', payload => {
        _activeUsers = Presence.syncState(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers);
        _run('presence', api.getActiveUsers());
      })

      _channel.on('presence_diff', payload => {
        _activeUsers = Presence.syncDiff(_activeUsers, payload);
        _activeUsersNormalized = _toNormalizedActiveUsers(_activeUsers);
        _run('presence', api.getActiveUsers());
      })

    }

    api.getUserName = () => {
      return _userName;
    }

    api.getActiveUsers = () => {
      return _activeUsersNormalized;
    }

    api.on = (event, callback) => {
      if (!_listeners[event]) {
        _listeners[event] = [];
      }

      _listeners[event].push(callback);
    }

    api.init = (channel, userName) => {
      _channel = channel;
      _setup();
    }

    api.send = (message) => {
      _channel.push('message:new', { message: message, timestamp: moment().toString() });
    }

    api.sendFriend = (user) => {
      _channel.push('friend:new', { user_id: user.user_id, timestamp: moment().toString() });
    }

    return api;
  }
])
