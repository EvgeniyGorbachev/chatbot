'use strict';

angular.module('campaignsApp.userEdit', [])
    .controller('UserEditListController', function ($scope)
    {
        console.info('UserEditListController');
        let vm        = this;
        vm.step       = 0;
        vm.isFormSend = false;

        vm.steps       = [];
        vm.flowStorage = {};
        vm.user        = {
            "object": null
        };
        vm.data        = {
            "username"  : '',
            "password"  : '',
            "phone"     : '',
            "email"     : '',
            "userRole"  : '',
            "created_at": ''
        };

        //when edit user
        $scope.$watch('user.object', function ()
        {
            console.info("user object");
            console.log(vm.user.object);
            vm.data = vm.user.object;

        });

        vm.baseElement = angular.element(document.querySelector('#base'));
        vm.mainElement = angular.element(document.querySelector('#main'));

        $(".datapicker").bind("keydown", function (event)
        {
            event.preventDefault();
        });

        vm.submit = submit;


        function submit(event)
        {
            event.preventDefault();
            vm.isFormSend = true;

            if (!vm.form.$valid) {
                return false;
            }
            vm.data.phrases = vm.flowStorage;

            $('#data').val(JSON.stringify(vm.data));
            $('form').submit();
        }

    })
