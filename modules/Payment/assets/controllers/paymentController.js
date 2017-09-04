app.controller('paymentController', function($scope, auth, $rootScope, notify,request) {
    $scope.showContent = false;
    $scope.loadHistory = false;

    $scope.initPayment = function(){
        getUserFromTeam();
    }

    $scope.sendPayment = function(){
        var paymentName = $("#payName").val();
        if(paymentName.length < 3 ){
            notify.localNotify("Walidacja","Zbyt krótki tytuł płatności");
            return;
        }
        var paymentAmount = parseFloat($("#payAmount").val().replace(",",".")).toFixed(2);
        if( !$.isNumeric( paymentAmount ) || paymentAmount <= 0 ){
            notify.localNotify("Walidacja","Błędna kwota");
            return;
        }
        var selectedUserAmount = $('.userSelectInput:checked').length;
        if( selectedUserAmount <= 0 ){
            notify.localNotify("Walidacja","Zaznacz przynajmniej jedną osobę");
            return;
        }
        var selectedUserId = [];
        $('.userSelectInput:checked').each(function(){
            selectedUserId.push( $(this).attr("id").split("-")[1] );
        });
        request.backend('addPaymentToUser', {tmid: $rootScope.user.tmid, userIds: selectedUserId, amount: paymentAmount, name: paymentName }, function(data) {
            notify.addNew(new notify.Notification("Nowe płatność.<br/> Tytuł: " + paymentName + "<br/>Kwota: " + paymentAmount + " zł", selectedUserId, "#!/clientPayment"));
        },"Pomyślnie dodano płatnośc do kont użytkowników oraz wysłano powiadomienie");
    }

    $scope.getUsersHistory = function(historyload=false){
        var selectedUserAmount = $('.userSelectInput:checked').length;
        if( selectedUserAmount <= 0 ){
            notify.localNotify("Walidacja","Zaznacz przynajmniej jedną osobę");
            return;
        }
        var selectedUserId = [];
        $('.userSelectInput:checked').each(function(){
            selectedUserId.push( $(this).attr("id").split("-")[1] );
        });

        request.backend('getUserPaymentHistory', {tmid: $rootScope.user.tmid, usids: selectedUserId }, function(data) {
            $scope.$apply(function() {
                $scope.selectedUserHistory = data;
                $scope.loadHistory = false;
                $('ul.tabs').tabs();
                $('.collapsible').collapsible();
            });
        });
    }

    $scope.deletePayment = function(id){
        request.backend('deletePayment', {pmid: id}, function(data) {
            $scope.getUsersHistory(true);
        },"Pomyślnie usunięto płatność");
    }

    $scope.endPayment = function(id){
        request.backend('endPayment', {pmid: id}, function(data) {
            $scope.getUsersHistory(true);
        },"Zakończono płatność");
    }

    function getUserFromTeam(){
        request.backend('getUserFromTeam', {tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function() {
                $scope.allUsers = data;
                $scope.showContent = true;
            });
        });
    }

    $(document).on("change","#selectAllUser",function(){
        var select = false;
        if($('#selectAllUser').is(':checked')) {
            select = true;
        } else {
            select = false;
        }
        $(".userSelectInput").each(function(){
            $(this).prop('checked',select);
        });
    });

    $(document).on("change",".userSelectInput, #selectAllUser",function(){
        if($scope.payHistory == 1){
            $scope.getUsersHistory();
        }
    });

    $(document).on("click",".collapsible",function(){
        $('.collapsible').collapsible();
    });

});