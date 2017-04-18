'use strict';

angular.module('campaignsApp', [])
  .controller('CampaignListController', function($compile, $scope) {
    let vm = this;
    vm.step = 0;

    vm.flowStorage = {};

    vm.baseElement = angular.element(document.querySelector('#base'));

    $('#datepicker').datepicker({});
    $(".datapicker").bind("keydown", function (event) {
      event.preventDefault();
    });

    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });

    vm.addStep = addStep;
    vm.deleteStep = deleteStep;
    vm.changeResponse = changeResponse;
    vm.submit = submit;

    //init first step
    addStep();

    function addStep () {
      event.preventDefault();
      incrementStep();
      saveToStorage(vm.step);

      vm.baseElement.append(getSimpleQuestionHtml(vm.step));
      vm.baseElement.append(getInitiatorHtml(vm.step));
      vm.baseElement.append(getAnswerHtml(vm.step));
      vm.baseElement.append(getStepHtml(vm.step));
      vm.baseElement.append(getDelayHtml(vm.step));
      vm.baseElement.append(getDelimiterHtml(vm.step));

      //bind ng-model to new html
      $compile(vm.baseElement)($scope);

      console.log('add: ',vm.flowStorage);
    }

    function deleteStep (){
      event.preventDefault();
      angular.element(document.querySelector('#question-' + vm.step)).remove();
      angular.element(document.querySelector('#delay-' + vm.step)).remove();
      angular.element(document.querySelector('#response-' + vm.step)).remove();
      angular.element(document.querySelector('#delimiter-' + vm.step)).remove();
      angular.element(document.querySelector('#initiator-' + vm.step)).remove();

      angular.element(document.querySelector('#step-' + vm.step)).remove();

      if (angular.element(document.querySelector('#step-yes-' + vm.step))) {
        angular.element(document.querySelector('#step-yes-' + vm.step)).remove();
      }

      if (angular.element(document.querySelector('#step-no-' + vm.step))) {
        angular.element(document.querySelector('#step-no-' + vm.step)).remove();
      }

      deleteFromStorage(vm.step);
      decrementStep();
      console.log('delete: ',vm.flowStorage);
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
                            "responses": "",
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
      $('#data').val(JSON.stringify(vm.flowStorage));
      $('form').submit();
    }

    function deleteFromStorage (step) {
      if (vm.flowStorage[step]) {
        delete vm.flowStorage[step];
      }
    }

    function changeResponse (step) {
      let curentResponseElement = angular.element(document.querySelector('#response-' + step));

      if (vm.flowStorage[step].responses == 'boolean') {
        //delete elements
        angular.element(document.querySelector('#step-' + step)).remove();

        //add elements
        curentResponseElement.after(getStepYesHtml(step));
        curentResponseElement.after(getStepNoHtml(step));

        //bind ng-model to new html
        $compile(vm.baseElement)($scope);
      } else {
        //delete elements
        angular.element(document.querySelector('#step-yes-' + step)).remove();
        angular.element(document.querySelector('#step-no-' + step)).remove();

        if (!document.querySelector('#step-' + step)) {

          //add element
          curentResponseElement.after(getStepHtml(step));

          //bind ng-model to new html
          $compile(vm.baseElement)($scope);
        }
      }
    }

    function getSimpleQuestionHtml (step) {
      let string = '<div class="form-group" id="question-' + step + '">' +
                      '<h3 class="m-t-none m-b">Step ' + step + '</h3>'+
                      '<label class="col-sm-2 control-label">Question</label>' +
                      '<div class="col-sm-10">' +
                        '<input type="text" class="form-control" ng-model="campaignCtr.flowStorage[' + step + '].text" name="question-' + step + '">' +
                      '</div>' +
                    '</div>';
      return angular.element(string);
    }

    function getDelayHtml (step) {
      let string = '<div class="form-group"  id="delay-' + step + '">' +
                      '<label class="col-sm-2 control-label">Delay</label>' +
                        '<div class="col-sm-10">' +
                          '<div class="row">' +
                            '<div class="col-md-2">' +
                              '<input class="form-control"  ng-model="campaignCtr.flowStorage[' + step + '].delay" name="delay-' + step + '" type="number" placeholder="2">' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getStepHtml (step) {
      let string = '<div class="form-group"  id="step-' + step + '">' +
                      '<label class="col-sm-2 control-label">Next step</label>' +
                        '<div class="col-sm-10">' +
                          '<div class="row">' +
                            '<div class="col-md-2">' +
                              '<input class="form-control"  ng-model="campaignCtr.flowStorage[' + step + '].nextStep.default" name="step-' + step + '" type="number">' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getStepYesHtml (step) {
      let string = '<div class="form-group"  id="step-yes-' + step + '">' +
                      '<label class="col-sm-2 control-label">Next step, if Yes</label>' +
                        '<div class="col-sm-10">' +
                          '<div class="row">' +
                            '<div class="col-md-2">' +
                              '<input class="form-control"  ng-model="campaignCtr.flowStorage[' + step + '].nextStep.ifYes" name="step-yes-' + step + '" type="number">' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getStepNoHtml (step) {
      let string = '<div class="form-group"  id="step-no-' + step + '">' +
                      '<label class="col-sm-2 control-label">Next step, if No</label>' +
                        '<div class="col-sm-10">' +
                          '<div class="row">' +
                            '<div class="col-md-2">' +
                              '<input class="form-control"  ng-model="campaignCtr.flowStorage[' + step + '].nextStep.ifNo" name="step-no-' + step + '" type="number">' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getAnswerHtml (step) {
      let string = '<div class="form-group" id="response-' + step + '">' +
                      '<label class="col-sm-2 control-label">Response</label> ' +
                      '<div class="col-sm-2"> ' +
                        '<select class="form-control m-b" ng-change="campaignCtr.changeResponse('+ step +')" ng-model="campaignCtr.flowStorage[' + step + '].responses" name="response-' + step + '"> ' +
                          '<option selected="selected" value="text">Text</option>' +
                          '<option value="name">Name</option> ' +
                          '<option value="email">Email</option> ' +
                          '<option value="address">Address</option>' +
                          '<option value="boolean">Boolean</option>' +
                        '</select>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getInitiatorHtml (step) {
      let string = '<div class="form-group" id="initiator-' + step + '">' +
                      '<label class="col-sm-2 control-label">Initiator</label> ' +
                      '<div class="col-sm-2"> ' +
                        '<select class="form-control m-b" ng-model="campaignCtr.flowStorage[' + step + '].initiator" name="initiator-' + step + '"> ' +
                          '<option selected="selected" value="bot">Bot</option>' +
                          '<option value="user">User</option> ' +
                        '</select>' +
                        '</div>' +
                      '</div>';
      return angular.element(string);
    }

    function getDelimiterHtml (step) {
      let string = '<div class="hr-line-dashed" id="delimiter-' + step + '"></div>';
      return angular.element(string);
    }
  })