;(function () {
  'use strict'
  const {app} = require('electron')

  angular.module('bplclient.services')
    .service('timeService', ['$q', '$http', '$interval', TimeService])

  /**
   * TimeService
   * @constructor
   */
  function TimeService ($q, $http) {
    var timeServerUrl = 'http://tycho.usno.navy.mil/cgi-bin/time.pl'
    var serverLatency = 0
    // var args = {
    //   headers: { "Content-Type": "application/json" },
    //   data:{},
    //   rejectUnauthorized: false
    // };
    var config = {
      rejectUnauthorized: false,
      insecure: true,
      timeout: 2000
    }
    var localToServerTimeDiff = 0

    /**
     * Function gets a server timestamp as to not rely on the users local clock.
     * Fallback to users local clock on failure.
     * Always returns success.
     */
    function getTimestamp () {
      var deferred = $q.defer()

      var startTime = new Date().getTime()
      $http.get(timeServerUrl, args).then(
        (success) => {
          console.log(success)
          var timestamp = success.headers().date
          var processedTimestamp = new Date(timestamp).getTime()
          var endTime = new Date().getTime()

          serverLatency = endTime - startTime

          var computedTimestamp = processedTimestamp + serverLatency

          var currentLocalTime = new Date().getTime()
          localToServerTimeDiff = computedTimestamp - currentLocalTime

          deferred.resolve(computedTimestamp)

        },
        (_error) => {
          console.log("here")
          // use the system time instead on error
          var timestamp = new Date().getTime()

          var computedTimestamp = timestamp + localToServerTimeDiff

          deferred.resolve(computedTimestamp)
        }
      )
      return deferred.promise
    }

    return {
      getTimestamp: getTimestamp
    }
  }
})()
