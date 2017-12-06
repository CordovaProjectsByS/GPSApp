let app = angular.module('app', ['ui.router']);

app.config(function ($stateProvider, $urlServiceProvider) {
    
    $urlServiceProvider.rules.otherwise({ state: 'photoList' });

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
            photo: function ($transition$, photos) {
                let id = parseInt($transition$.params().photoId);
                console.log("typ id: " + (typeof id));
                console.log("id: " + id);
                console.log(photos);
                console.log("foto z grupy:" + photos[1].name);
                let photo = photos.find(item => item.id === id );
                console.log("pobrane foto: " + photo.name);
                return photo;
            }
        }
    });

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
            return service.list().then(list => function (list) {
                let photoL = list.find(item => item.id === id);
                console.log('photoL' + photoL);
                return photoL;
            });
        }
        
    };

    return service;
});

