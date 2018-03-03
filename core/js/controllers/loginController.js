app.controller('loginController', function($scope, auth, request) {
    $scope.isActiveApplayer = false;
    $scope.isLicenseEnd = false;
    $scope.loginFormShow = true;
    $scope.registerFormShow = false;

    $(".loginMainContener").first().css("display","block");

    $scope.initLogin = function() {
        if (auth.checkIsLogged()) {
            document.location = "panel";
        }
        let urlToPost = "backend/isApplayerActive";
        let toReturn;
        request.sync('POST', urlToPost, {}, function(reqData) {
            $(".loginMainContener").first().css("display","block");
            if (reqData.success) {
                $scope.isActiveApplayer = reqData.data.applayer;
                $scope.isLicenseEnd = reqData.data.license;
            }
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
            toReturn = false;
        });
    };

    $scope.login = function(email, password) {
        if (email == null || password == null) $(".error").html("<p> Podaj poprawnie dane </p>");
        else {
            let req = auth.logIn(email, password);
            if (req.success) {
                document.location = "panel";
            } else {
                $(".error").html("<p>" + req.error + "</p>");
            }
        }
    };

    $scope.goToContactPage = function(){
        location.replace("https://centrumklubu.pl/kontakt/");
    };

    $scope.registerNewAccount = function(){
        if(!$scope.isActiveApplayer) return;
        let firstname = $('#registerFristname').val();
        let lastname = $('#registerLastname').val();
        let email = $('#registerEmail').val();
        if( !firstname || firstname.length < 3 || firstname.length > 30 ){
            $(".errorRegister").html("<p> Podaj poprawnie imię ( min 3 maks 30 znaków ) </p>");
            return;
        }
        if( !lastname || lastname.length < 3 || lastname.length > 30 ){
            $(".errorRegister").html("<p> Podaj poprawnie nazwisko ( min 3 maks 30 znaków ) </p>");
            return;
        }
        if( !email || email.length < 3 ){
            $(".errorRegister").html("<p> Podaj poprawnie adres email </p>");
            return;
        }

        let dataToSend = { firstname: firstname, lastname: lastname,email:email };
        let urlToPost = "backend/registerNewApplayer";
        let toReturn;
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
            if (reqData.success) {
                $(".successRegister").html("<p> Twoje konto zostało utworzone. Wysłaliśmy wiadomość na Twój adres email. Znajduję się w nim hasło, po uzyskaniu go możesz skorzystać z panelu logowania obok. </p>");
            }else{
                $(".errorRegister").html("<p> "+reqData.error+" </p>");
            }
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
            toReturn = false;
        });
    }
});