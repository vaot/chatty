let app = angular.module('chatty')

app.service('EscapeService', [
  () => {

    const SCRIPT_REGEX = /(\<script[^\>]*\>(?=.*<\/script\>)([\s\S]*?)\<\/script\>\s*)/g

    let api = {}

    api.escape = (message) => {
      message = (message || "").replace(SCRIPT_REGEX, "")
      return message
    }

    return api
  }
])
