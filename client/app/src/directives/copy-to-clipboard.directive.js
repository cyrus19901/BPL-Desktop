;(function () {
  'use strict'

  angular.module('bplclient.directives')
    .directive('copyToClipboard', ($window) => {
      const body = angular.element($window.document.body)
      const textarea = angular.element('<textarea/>')
      textarea.css({
        position: 'fixed',
        opacity: '0'
      })

      function copy (toCopy) {
        textarea.val(toCopy)
        body.append(textarea)
        textarea[0].select()

        try {
          const successful = document.execCommand('copy')
          if (!successful) throw successful
        } catch (err) {
          console.log('failed to copy', toCopy)
        }
        textarea.remove()
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.bind('click', (e) => {
            copy(attrs.copyToClipboard)
          })
        }
      }
    })
})()
