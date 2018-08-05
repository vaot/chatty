let app = angular.module('chatty')

app.service('FileManager', [
  () => {
    const CHUNK_SIZE = 100

    let _filesInTransit = {}
    let api = {}

    let _combine = (fileInTransit, total) => {
      let length = 0
      let bufferLengths = []

      for (var i = 0; i < total; i++) {
        bufferLengths.push(fileInTransit[i].byteLength)
      }

      let totalLength = bufferLengths.reduce((el, acc) => {
        return el+acc
      }, 0)

      let newBuffer = new Uint8Array(totalLength)

      bufferLengths.reduce((el, acc, idx) => {
        newBuffer.set(
          new Uint8Array(fileInTransit[idx])
        , el)

        return el+acc
      }, 0)

      return newBuffer
    }

    api.chunk = (fileBuffer, iterator) => {
      let parts = Math.ceil(fileBuffer.byteLength/CHUNK_SIZE)
      let start = 0
      let end   = CHUNK_SIZE

      for (var i = 0; i < parts; i++) {
        iterator(i, parts, fileBuffer.slice(start, end))
        start += CHUNK_SIZE
        end += CHUNK_SIZE
      }
    }

    api.linkify = (buffer, payload) => {
      let type = payload["type"]
      let blob = new Blob([buffer], { type: type })
      let objectUrl = URL.createObjectURL(blob)

      // TO DO: revoke this url
      return `<a href="${objectUrl}" target="_blank">${payload["name"]}</a>`
    }

    api.compose = (payload, file, callback) => {
      let fileId = payload["file_id"]
      let userId = payload["user_id"]
      let index = payload["index"]
      let total = payload["total"]

      if (!_filesInTransit[userId]) {
        _filesInTransit[userId] = {}
      }

      if (!_filesInTransit[userId][fileId]) {
        _filesInTransit[userId][fileId] = {}
      }

      _filesInTransit[userId][fileId][index] = file

      let arrived = true
      for (var i = 0; i < total; i++) {
        arrived = arrived && _filesInTransit[userId][fileId].hasOwnProperty(i)
      }

      if (arrived) {
        callback(
          _combine(_filesInTransit[userId][fileId], total)
        )
        delete _filesInTransit[userId][fileId]
      }
    }

    return api
  }
])
