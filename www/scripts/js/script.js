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

    $stateProvider.state('nearPhotoList', {
        url: '/nearPhotos',
        templateUrl: './scripts/partials/photos.html',
        controller: "NearPhotoListController"
    });

});

app.controller('MainPageController', function ($scope, $rootScope, PhotoService) {

    $scope.picturesAmount = $rootScope.pictures.length;

    $scope.addPicture = function () {

        var picture = {
            'id': PhotoService.nextId(),
            'desc': $scope.desPic,
            'content': document.getElementById("uploadedFile").files[0],
            'showingTimeInNearLocation' : new Date().getTime(),
            'latitude': "",
            'longtitude': ""
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        function onSuccess(position) {

            picture.latitude = position.coords.latitude;
            picture.longtitude = position.coords.longitude;
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
    $scope.pageTitle = "Photos";

    $scope.delete = function (id) {
        $scope.photos = $scope.photos.filter(picture => picture.id != id);
        $rootScope.pictures = $scope.photos;
    };
});


app.controller('NearPhotoListController', function ($scope, $rootScope, DistanceService) {
    $scope.photos = DistanceService.getClosePhotosSet($rootScope.localization);
    $scope.pageTitle = "Close Photos";

    $scope.delete = function (id) {
        $scope.photos = $scope.photos.filter(picture => picture.id != id);
        $rootScope.pictures = $scope.photos;
    };
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

app.service('DistanceService', function ($rootScope) {
    let service = {

        checkPhotosNearYourLocalization: function (localization) {
            
            console.log("nowy obieg");

            let isNear = false;
            let isOk = false;
            for (let photo of $rootScope.pictures) {
                console.log(localization);
                isNear = this.isPhotoNearYourLocalization(photo, localization);
                if (isNear) {
                    let timeNow = new Date().getTime();
                    let timeBetween = timeNow - photo.showingTimeInNearLocation;
                    if (timeBetween > 30 * 1000) {
                        console.log("Mam takie zdjęcie która zgadza się z czasem.");
                        isOk = true;
                        break;
                    }
                }
            }

            return isOk;
            
        },

        getClosePhotosSet: function (localization) {
            let newPictures = [];
            let isNear = false;
            for (var photo of $rootScope.pictures) {
                isNear = this.isPhotoNearYourLocalization(photo, localization);
                if (isNear) {
                    let timeNow = new Date().getTime();
                    let timeBetween = timeNow - photo.showingTimeInNearLocation;
                    if (timeBetween > 30 * 1000) {
                        photo.showingTimeInNearLocation = timeNow;
                        newPictures.push(photo);
                    }
                }
            }

            return newPictures;
        },

        isPhotoNearYourLocalization: function (photo, localization) {
            let isNear = false;

            let latitudeKmPhoto = 110.57 * photo.latitude;
            let longtituedKmPhoto = 111.32 * photo.longtitude;
            let latitudeKm = 110.57 * localization.latitude;
            let longtituedKm = 111.32 * localization.longtitude;

            console.log('latitudeKmPhoto: ' + latitudeKmPhoto);
            console.log('longtituedKmPhoto: ' + longtituedKmPhoto);
            console.log('latitudeKm: ' + latitudeKm);
            console.log('longtituedKm: ' + longtituedKm);

            let distance = Math.sqrt(Math.pow(latitudeKm - latitudeKmPhoto, 2) + Math.pow(longtituedKm - longtituedKmPhoto, 2));
            distance = distance * 1000;

            console.log("dystans: " + distance);

            if (distance < 100) {
                console.log("Dystans uzyskany.");
                isNear = true;
            }

            return isNear;
        }
    }

    return service;
});

app.service('TimeService', function ($rootScope) {
    var service = {
        changeTimeForClosePhotos: function () {
            let nowTime = new Date().getTime();
            let timeBetween;
            for (var photo of $rootScope.pictures) {
                timeBeetween = nowTime - photo.showingTimeInNearLocation;
                if (timeBeetween > 30 * 1000) {
                    photo.showingTimeInNearLocation = nowTime;
                }
            }
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

app.run(function($rootScope, DistanceService, TimeService) {
    $rootScope.pictures = [];

    console.log("isPhotoNearLocalization na false ");
    $rootScope.isPhotoNearLocalization = false;

    $rootScope.closeNotification = function() {
        TimeService.changeTimeForClosePhotos();
        $rootScope.isPhotoNearLocalization = false;
    };

    var watchId = navigator.geolocation.watchPosition(watchSuccess, null, {timeout: 5000});

    function watchSuccess(position) {

        let localization = {
            'latitude': position.coords.latitude,
            'longtitude': position.coords.longitude
        };


        let isNear = DistanceService.checkPhotosNearYourLocalization(localization);

        $rootScope.$apply(function () {
            $rootScope.isPhotoNearLocalization = isNear;
            if (isNear == true) {
                $rootScope.localization = localization;
            }
        });
    };

}); 

