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
        controller: "PhotoListController",
        resolve: {
            photos: function (PhotoService) {
                return PhotoService.list();
            }
        }
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

app.controller('MainPageController', function ($scope, $rootScope) {
    $scope.addPicture = function () {
        var picture = {};
        picture.desc = $scope.desPic;
        console.log(picture.desc);
        picture.id = 0;
        picutre.url = document.getElementById("description").value;
        console.log(picture.url);
        $rootScope.pictures.unshift(picture);
    }
});

app.controller('PhotoListController', function ($scope, photos) {
    $scope.photos = photos;
    $scope.clickHandler = function() {
        alert('something');    
    }
});

app.controller('PhotoDetailController', function ($scope, photo) {
    $scope.photo = photo;
});

app.service('PhotoService', function ($http) {
    var service = {
        list: function () {
            return $http.get('./scripts/data/photos.json', { cache: true }).then(resp => resp.data);
        },
        get: function (id) {
            return service.list().then(list => list.find(item => item.id === id));
        }
        
    };

    return service;
});

app.run(function($rootScope) {
    $rootScope.pictures = {};
}); 

