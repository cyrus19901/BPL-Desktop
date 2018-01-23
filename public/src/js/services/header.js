'use strict';

var config = require('../config.json');
var Header = function ($rootScope) {
    $rootScope.currency = {
      symbol: config.symbol
    };

    this.updateBlockStatus = function (res) {
        if (res.success) {
            $rootScope.blockStatus = {
                height:    res.height,
                fee:       res.fee,
                milestone: res.milestone,
                reward:    res.reward,
                supply:    res.supply,
                nethash:   res.nethash
            };
        }
    };

    this.updatePriceTicker = function (res) {
        if (res.success) {
            $rootScope.currency.tickers = res.tickers;
        }

        // When ticker for user-stored currency is not available - switch to WBX temporarly
        if ($rootScope.currency.symbol !== config.symbol && (!$rootScope.currency.tickers || !$rootScope.currency.tickers.$config.symbol || !$rootScope.currency.tickers.$config.symbol[$rootScope.currency.symbol])) {
            console.log ('Currency ' + $rootScope.currency.symbol + ' not available, fallback to ' + config.symbol);
            $rootScope.currency.symbol = config.symbol;
        }
    };

    this.updateDelegateProposals = function (res) {
        if (res.success) {
            $rootScope.delegateProposals = res.proposals;
        } else {
            $rootScope.delegateProposals = [];
        }
    };
};

angular.module('explorer.system').factory('header',
  function ($rootScope, $socket) {
      return function ($scope) {
          var header = new Header($rootScope),
              ns = $socket('/header');

          ns.on('data', function (res) {
              if (res.status) { header.updateBlockStatus(res.status); }
              if (res.ticker) { header.updatePriceTicker(res.ticker); }
          });

          ns.on('delegateProposals', function (res) {
              if (res) { header.updateDelegateProposals(res); }
          });


          $scope.$on('$destroy', function (event) {
              ns.removeAllListeners();
          });

          return header;
      };
  });
