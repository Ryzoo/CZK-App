app.service('auth', function($http, $rootScope, request) {

    this.logIn = function(login, password) {
        var dataToSend = { email: login, pass: password };
        var urlToPost = "backend/login";
        var toReturn;
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
            console.log(reqData);
            if (reqData.success) {
                Cookies.remove('tq');
                Cookies.set('tq', reqData.token, { expires: 1 });
            }
            toReturn = reqData;
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
            toReturn = false;
        });

        return toReturn;
    }

    this.logout = function() {
        Cookies.remove('tq');
        document.location = "login";
    }

    this.checkIsLogged = function() {
        var token = Cookies.get('tq');
        if (token != null && token.length > 5) {
            var dataToSend = { token: token };
            var urlToPost = "backend/checkIsLoged";
            request.sync('POST', urlToPost, dataToSend,
                function(reqData) {
                    if (reqData.success) toReturn = true;
                    else toReturn = false;
                },
                function(jqXHR, textStatus) {
                    console.log("Bład podczas komunikacji z serverem: " + textStatus);
                    toReturn = false;
                });
        } else toReturn = false;

        return toReturn;
    }

    this.getUserData = function() {
        var tq = Cookies.get('tq');
        var toReturn = false;
        if (tq != null && tq.length > 5) {
            var dataToSend = { token: tq };
            var urlToPost = "backend/getUserData";
            request.sync('POST', urlToPost, dataToSend,
                function(reqData) {
                    toReturn = reqData;
                    $rootScope.user.email = reqData.data.email;
                    $rootScope.user.token = Cookies.get('tq');
                    $rootScope.user.role = reqData.data.name;
                    $rootScope.user.id = reqData.data.user_id;
                    $rootScope.user.firstname = reqData.data.firstname;
                    $rootScope.user.lastname = reqData.data.lastname;
                    $rootScope.user.birthdate = reqData.data.birthdate;
                    $rootScope.user.imgPath = reqData.data.user_img_path;
                    $rootScope.user.addAccountDate = reqData.data.create_account_date;
                    $rootScope.user.addAccountDate = reqData.data.create_account_date;
                    $rootScope.user.height = reqData.data.height;
                    $rootScope.user.tel = reqData.data.tel;
                    $rootScope.user.parentTel = reqData.data.parent_tel;
                    $rootScope.user.weight = reqData.data.weight;
                    $rootScope.user.mainLeg = reqData.data.main_leg;
                    $rootScope.user.mainPosition = reqData.data.main_position;
                    $rootScope.user.bodyType = reqData.data.body_type;
                    $rootScope.user.address = reqData.data.address;
                    $rootScope.user.license_type = reqData.data.license_type;
                },
                function(jqXHR, textStatus) {
                    console.log("Bład podczas komunikacji z serverem: " + textStatus);
                    toReturn = false;
                });
        }
        return toReturn;
    }

    this.checkPerm = function(permission) {
        if ($rootScope.user != null && $rootScope.user.role != null) {
            for (var i = 0; i < permission.length; i++) {
                if (permission[i] === $rootScope.user.role) return true;
            }
        } else return false;
    }

});