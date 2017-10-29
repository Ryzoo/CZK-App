app.controller('loginController', function($scope, auth, request) {
    $scope.isActiveApplayer = false;

    $scope.initLogin = function() {
        if (auth.checkIsLogged()) {
            document.location = "panel";
        }
        var dataToSend = {};
        var urlToPost = "backend/isApplayerActive";
        var toReturn;
        request.sync('POST', urlToPost, dataToSend, function(reqData) {
            if (reqData.success) {
                $scope.isActiveApplayer = reqData.data;
            }
        }, function(jqXHR, textStatus) {
            console.log("Bład podczas komunikacji z serverem: " + textStatus);
            toReturn = false;
        });
    };

    $scope.login = function(email, password) {
        if (email == null || password == null) $(".error").html("<p> Podaj poprawnie dane </p>");
        else {
            var req = auth.logIn(email, password);
            if (req.success) {
                document.location = "panel";
            } else {
                $(".error").html("<p>" + req.error + "</p>");
            }
        }
    };

    $scope.registerNewAccount = function(){
        var firstname = $('#registerFristname').val();
        var lastname = $('#registerLastname').val();
        var email = $('#registerEmail').val();
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

        var dataToSend = { firstname: firstname, lastname: lastname,email:email };
        var urlToPost = "backend/registerNewApplayer";
        var toReturn;
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