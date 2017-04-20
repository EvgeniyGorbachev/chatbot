'use strict';

angular.module('campaignsApp', [])
  .controller('CampaignListController', function() {
    let vm = this;
    vm.step = 0;
    vm.isFormSend = false;
    vm.steps = [];
    vm.flowStorage = {};
    vm.data = {
      "name": '',
      "channel": '',
      "phone": '',
      "startDate": '',
      "endDate": '',
      "phrases": ''
    };

    vm.baseElement = angular.element(document.querySelector('#base'));
    vm.mainElement = angular.element(document.querySelector('#main'));

    $(".datapicker").bind("keydown", function (event) {
      event.preventDefault();
    });

    vm.addStep = addStep;
    vm.deleteStep = deleteStep;
    vm.submit = submit;

    //init first step
    addStep();

    function addStep () {
      event.preventDefault();
      incrementStep();
      saveToStorage(vm.step);

      vm.steps.push({"id": vm.step});
    }

    function deleteStep (){
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

    function submit () {
      event.preventDefault();
      vm.isFormSend = true;

      if (!vm.form.$valid) {
        return false;
      }
      vm.data.phrases = vm.flowStorage;

      $('#data').val(JSON.stringify(vm.data));
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
});
