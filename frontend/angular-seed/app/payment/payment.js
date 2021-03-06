'use strict';

angular.module('myApp.payment', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/payment', {
    templateUrl: 'payment/payment.html',
    controller: 'PaymentCtrl',
    controllerAs: 'PaymentCtrl'
  });
}])

.controller('PaymentCtrl', ['$location', 'userService', '$scope', function($location, userService, $scope) {
  var vm = this;
  vm.user = userService.getUser();
  vm.isFormSend = false;
  vm.isCheckedBillingAddres = true;

  saveShippingAsBilling();

  vm.go = function ( path ) {
    vm.isFormSend = true;

    if (!vm.form.$valid && path == '/review') {
      return false;
    }

    userService.saveUser(vm.user);
    $location.path( path );
  };

  function saveShippingAsBilling () {
    vm.user.billing.firstName = vm.user.shipping.firstName;
    vm.user.billing.lastName = vm.user.shipping.lastName;
    vm.user.billing.email = vm.user.shipping.email;
    vm.user.billing.addressFirst = vm.user.shipping.addressFirst;
    vm.user.billing.addressSecond = vm.user.shipping.addressSecond;
    vm.user.billing.city = vm.user.shipping.city;
    vm.user.billing.state = vm.user.shipping.state;
    vm.user.billing.zipCode = vm.user.shipping.zipCode;
  };

  function notSaveShippingAsBilling () {
    vm.user.billing.firstName = '';
    vm.user.billing.lastName = '';
    vm.user.billing.email = '';
    vm.user.billing.addressFirst = '';
    vm.user.billing.addressSecond = '';
    vm.user.billing.city = '';
    vm.user.billing.state = '';
    vm.user.billing.zipCode = '';
  };

  vm.changeCheckedBillingAddress =function () {
    vm.isCheckedBillingAddres = !vm.isCheckedBillingAddres;

    if (vm.isCheckedBillingAddres) {
      saveShippingAsBilling();
    } else {
      notSaveShippingAsBilling();
    }
  };

  vm.states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
  }
}]);
