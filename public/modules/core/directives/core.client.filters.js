'use strict';

angular.module('core').filter('yesNo', function (){
  return function (input) {
    return input ? 'Yes' : 'No';
  };
});