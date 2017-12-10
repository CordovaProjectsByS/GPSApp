let app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlServiceProvider) {
    
    $urlServiceProvider.rules.otherwise({ state: 'mainPage' });

    $stateProvider.state('mainPage', {
        url: '/main',
        templateUrl: './scripts/partials/mainPage.html',
        controller: "MainPageController"
    });

    $stateProvider.state('photoList', {
        url: '/photos',
        templateUrl: './scripts/partials/photos.html',
        controller: "PhotoListController"
    });

});

app.controller('MainPageController', function ($scope, $rootScope, PhotoService) {

    $scope.picturesAmount = $rootScope.pictures.length;

    $scope.addPicture = function () {

        var picture = {
            'id': PhotoService.nextId(),
            'desc': $scope.desPic,
            'content': document.getElementById("uploadedFile").files[0],
            'latitude': "",
            'longtitude': ""
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        function onSuccess(position) {

            picture.latitude = position.coords.latitude.toFixed(2);
            picture.longtitude = position.coords.longitude.toFixed(2);
            $rootScope.pictures.unshift(picture);

        };

        function onError(error) {
            $rootScope.pictures.unshift(picture);
        };

        $scope.picturesAmount++;
    }
});

app.controller('PhotoListController', function ($scope, $rootScope, $timeout) {
    $scope.photos = $rootScope.pictures;


    $scope.delete = function (id) {
        $scope.photos = $scope.photos.filter(picture => picture.id != id);
        $rootScope.pictures = $scope.photos;
    };
});

app.controller('PhotoDetailController', function ($scope, photo) {
    $scope.photo = photo;
});

app.service('PhotoService', function ($http, $rootScope) {
    var service = {
        get: function (id) {
            return service.list().then(list => list.find(item => item.id === id));
        },
        nextId: function () {
            let max = 0;
            for (element of $rootScope.pictures) {
                if (element.id > max) {
                    max = element.id;
                }
            }

            max++;

            return max;
        }
    };

    return service;
});
 
app.directive('imgDisplay', function () {
    return {
        transclude: true,
        scope: {
            photoBlob: '=photoblob'
        },
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function () {
                attrs.$set('src', reader.result);
                console.log('zdjęcie się załadowało!!!!');
            };
            reader.readAsDataURL(scope.photoBlob);
        }
    }
});

app.filter('latitude', function() {
    return function (input) {
        if (input == 0) return;
        let output;
        if (input > 0) {
            output = input + " N";
        }
        else {
            output = (-input) + " S"
        }

        return output;
    }
});

app.filter('longtitude', function () {
    return function (input) {
        if (input == 0) return;
        let output;
        if (input > 0) {
            output = input + " E";
        }
        else {
            output = (-input) + " W"
        }

        return output;
    }
});

app.run(function($rootScope) {
    $rootScope.pictures = [];
}); 

