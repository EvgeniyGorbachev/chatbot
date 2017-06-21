'use strict';

angular.module('campaignsApp.dashboard', [])
    .controller('DashboardListController', function() {

        let vm = this;
        vm.change = change;
        vm.sendMessage = sendMessage;
        vm.isActive = {};
        vm.message = {};

        function change(id) {
            let bool = vm.isActive[id] || false;
            $('#data').val(JSON.stringify({
                "id": id,
                "isActive": bool
            }));
            $('form').submit();
        }

        function sendMessage(event) {
            event.preventDefault();
            vm.isFormSend = true;
            console.log(11111)
            if (!vm.form.$valid) {
                return false;
            }
            console.log(2222)
            // vm.data.phrases = vm.flowStorage;
            //
            // $('#data').val(JSON.stringify(vm.data));
            // $('form').submit();
        }
    })
    .directive('ngConfirmClick', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";

                    var clickAction = attr.confirmedClick;
                    element.bind('click', function(event) {

                        if (window.confirm(msg)) {
                            if (clickAction) {
                                scope.$eval(clickAction)
                            }
                        } else {
                            event.preventDefault();
                        }
                    });
                }
            };
        }
    ]);