'use strict';

angular.module('campaignsApp.userEdit', [])
    .controller('UserEditListController', function($scope) {
        console.info('UserEditListController');
        let vm = this;
        vm.step = 0;
        vm.isFormSend = false;
        vm.submit = submit;
        vm.options = {
            "Admin": 1,
            "Manager": 2
        };

        vm.steps = [];
        vm.flowStorage = {};
        vm.user = {
            "object": null
        };
        vm.data = {
            "id": '',
            "username": '',
            "password": '',
            "phone": '',
            "email": '',
            "userRole": '',
            "created_at": ''
        };

        //when edit user
        $scope.$watch('user.object', function() {
            vm.data = vm.user.object;
        });

        $(".datapicker").bind("keydown", function(event) {
            event.preventDefault();
        });


        function submit(event) {
            event.preventDefault();
            vm.isFormSend = true;

            if (!vm.form.$valid) {
                return false;
            }

            $('#data').val(JSON.stringify(vm.data));
            $('form').submit();
        }

    })
    .directive('convertNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, el, attr, ctrl) {
                ctrl.$parsers.push(function(value) {
                    if (value) return parseInt(value, 10);
                });

                ctrl.$formatters.push(function(value) {
                    if (value) return value.toString();
                });
            }
        }
    });