'use strict';

angular.module('campaignsApp.campaignEdit', [])
  .controller('CampaignEditListController', function($scope) {
    let vm = this;
    vm.step = 0;
    vm.isFormSend = false;

    vm.steps = [];
    vm.flowStorage = {};
    vm.campaign = {
      "object": null
    };

    $('.chosen-select').chosen();

    $('.chosen-select').on('change', function(evt, params) {
      vm.campaign.object.users = $(this).val();
    });

    //when edit campaign
    $scope.$watch('campaign.object', function() {

      if (vm.campaign.object) {

        if (vm.campaign.object.users) {
          $('.chosen-select').chosen('destroy').val(vm.campaign.object.users).chosen();
        }

        vm.steps = [];
        vm.flowStorage = {};

        for (var property in vm.campaign.object.phrases) {
          if (vm.campaign.object.phrases.hasOwnProperty(property)) {
            incrementStep();
            vm.steps.push({"id": property});
            vm.flowStorage[property] = vm.campaign.object.phrases[property];
          }
        }
      }

      //init first step when create new campaign
      if (!vm.campaign.object) {
        addStep();
      }

    });

    vm.baseElement = angular.element(document.querySelector('#base'));
    vm.mainElement = angular.element(document.querySelector('#main'));

    $(".datapicker").bind("keydown", function (event) {
      event.preventDefault();
    });

    vm.addStep = addStep;
    vm.deleteStep = deleteStep;
    vm.submit = submit;

      function addStep(event)
      {
          if (event) {
              event.preventDefault();
          }
      incrementStep();
      saveToStorage(vm.step);

      vm.steps.push({"id": vm.step});
    }

      function deleteStep(event)
      {
      event.preventDefault();
      vm.steps.splice(-1,1)

      deleteFromStorage(vm.step);
      decrementStep();
    }

    function incrementStep () {
      return vm.step++;
    }

    function decrementStep () {
      return (vm.step != 0 )? vm.step--: 0;
    }

    function saveToStorage (step) {
      let v = step
      vm.flowStorage[v] = {
                            "id": step,
                            "text": "",
                            "response": "",
                            "delay": "",
                            "initiator": "",
                            "nextStep": {
                              "default": step + 1,
                              "ifYes": '',
                              "ifNo": '',
                            }
                          };
    }

      function submit(event) {
      event.preventDefault();
      vm.isFormSend = true;

      if (!vm.form.$valid) {
        return false;
      }
      vm.campaign.object.phrases = vm.flowStorage;

      $('#data').val(JSON.stringify(vm.campaign.object));
      $('form').submit();
    }

    function deleteFromStorage (step) {
      if (vm.flowStorage[step]) {
        delete vm.flowStorage[step];
      }
    }
  }).directive('datepickerInput', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      //set datepicker
      $(element).datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0,
        closeText: "Close",
        constrainInput: true
      });

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function (date) {
        $(element).datepicker( "destroy" );

        //set datepicker again after each time when we chose date, because second click on input, doesn`t open datepicker again
        $(element).datepicker({
          dateFormat: 'dd/mm/yy',
          setDate: date,
          minDate: 0,
          closeText: "Close",
          constrainInput: true
        });

        $(element).datepicker().on('changeDate', function(value){
          // var dateStrToSend = value.date.getFullYear() + '/' + (value.date.getMonth() + 1) +  '/' + value.date.getDate();
          scope.$apply(function () {
            ngModel.$setViewValue(value.date);
          });
          $(".datepicker").hide();
        });
      });
    }
  }
})
