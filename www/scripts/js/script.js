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

    $stateProvider.state('photoList.detail', {
        url: '/:photoId',
        templateUrl: './scripts/partials/photoDetail.html',
        controller: 'PhotoDetailController',
        resolve: {
            photo: function ($transition$, PhotoService) {
                let id = parseInt($transition$.params().photoId);
                
                let photo = PhotoService.get(id);
              
                return photo;
            }
        }
    });

});

app.controller('MainPageController', function ($scope, $rootScope, PhotoService) {

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
            console.log("Pobieram dane z gps");
            picture.latitude = position.coords.latitude.toFixed(2);
            picture.longtitude = position.coords.longitude.toFixed(2);
            console.log("wyświetlam:");

            console.log(picture.id);
            console.log(picture.desc);
            console.log(picture.content);
            console.log(picture.latitude);
            console.log(picture.longtitude);

            $rootScope.pictures.unshift(picture);
        };

        function onError(error) {
            $rootScope.pictures.unshift(picture);
        };
    }
});

app.controller('PhotoListController', function ($scope, $rootScope, $timeout) {
    $scope.photos = $rootScope.pictures;

    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            console.log("rozpoczynam ładwoanie zdjęć");
            for (el of $scope.photos) {
                let imgId = 'image' + el.id;
                console.log("imgId: " + imgId);
                var image = document.getElementById(imgId);

                console.log("fsdafasdfdasfasdfdasfadsfadsfadsfadsfdasfadfadfadsfadsfadsfadsfasdfasdfadsfasdfadsfdsafdasfdasfdasfdasf");

                var reader = new FileReader();
                reader.onload = function () {
                    image.src = reader.result;
                };

                console.log("kontent do załadowania: " + el.content);
                reader.readAsDataURL(el.content);
            }
        }, 0);
        
    });

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
        list: function () {
            return $http.get('./scripts/data/photos.json', { cache: true }).then(resp => resp.data);
        },
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
        link: function (scope, elem) {
            
        }
    }
});

app.run(function($rootScope) {
    $rootScope.pictures = [];
}); 

