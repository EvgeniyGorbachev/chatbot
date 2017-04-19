'use strict';

angular.module('campaignsApp', [])
  .controller('CampaignListController', function($compile, $scope) {
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
      "steps": ''
    };

    vm.baseElement = angular.element(document.querySelector('#base'));
    vm.mainElement = angular.element(document.querySelector('#main'));

    $('#datepicker').datepicker({});
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
      vm.data.steps = vm.flowStorage;

      $('#data').val(JSON.stringify(vm.data));
      $('form').submit();
    }

    function deleteFromStorage (step) {
      if (vm.flowStorage[step]) {
        delete vm.flowStorage[step];
      }
    }
  })
