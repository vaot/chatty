// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".
import socket from "./socket"

// Templates
require('js/app/rooms/rooms_new.hamlc')
require('js/app/rooms/rooms_chat.hamlc')
require('js/app/rooms/rooms.hamlc')
require('js/app/sidebar/sidebar_index.hamlc')
require('js/app/panel/panel_index.hamlc')
require('js/app/users/user_lists_index.hamlc')

import "js/app/init.js"
import "js/app/config.js"
import "js/app/authkey_interceptor.js"
import "js/app/routes.js"

import "js/app/filters/time_elapsed.js"

import "js/app/users/users_list.js"
import "js/app/sidebar/sidebar.js"
import "js/app/panel/panel.js"
import "js/app/rooms/rooms_resource.js"
import "js/app/rooms/rooms_controller.js"
import "js/app/rooms/rooms_chat_controller.js"
import "js/app/rooms/rooms_new_controller.js"
import "js/app/rooms/room_manager.js"
