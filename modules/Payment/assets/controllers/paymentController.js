app.controller('paymentController', function($scope, auth, $rootScope, notify,request) {
    $scope.showContent = false;
    $scope.loadHistory = false;
    $scope.selectedUserHistory = [];
    $scope.selectedPayment = [];
    $scope.showPay = false;
    $scope.ip = 0;
    $scope.signature = 0;

    $scope.initPayment = function(){
        getUserFromTeam();
    }

    $scope.initPaymentClient = function(){
        request.backend('getClientIp', {tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
            $scope.$apply(function() {
                $scope.ip = data;
            });
        });
        $scope.host = window.location.hostname;
        request.backend('getUserPaymentHistory', {tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
            $scope.$apply(function() {
                $scope.selectedUserHistory = data[0] ? data[0] : [];
                $scope.showContent = true;
            });
        });
    }

    $scope.showPayment = function(index){
        $scope.selectedPayment = $scope.selectedUserHistory.data[index];
        if( $scope.selectedPayment ){
            $scope.showPay = true;
            $scope.getSignatureVerify();
        } 
    }

    $scope.payWithPayu = function(){
        request.backend('payWithPayu', {pmid: $scope.selectedPayment.id}, function(data) {
            request.backend('getUserPaymentHistory', {tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
                $scope.$apply(function() {
                    $scope.selectedUserHistory = data[0] ? data[0] : [];
                    $scope.showContent = true;
                });
            });
        });
    }

    $scope.getSignatureVerify =function(){
        var sigData = new Object();
        sigData["customerIp"] = $scope.ip;
        sigData["merchantPosId"] =  '302273';
        sigData["extOrderId"] =  $scope.selectedPayment.id;
        sigData["description"] =  $scope.selectedPayment.name;
        sigData["totalAmount"] = $scope.selectedPayment.amount*100;
        sigData["currencyCode"] = "PLN";
        sigData["products.name"] = $scope.selectedPayment.name;
        sigData["products.unitPrice"] = $scope.selectedPayment.amount*100;
        sigData["products.quantity"] = "1";
        sigData["products.virtual"] = "true";
        sigData["buyer.email"] = $rootScope.user.email;
        sigData["buyer.firstName"] = $rootScope.user.firstname;
        sigData["buyer.lastName"] = $rootScope.user.lastname;
        sigData["buyer.language"] = "pl";
        sigData["notifyUrl"] = window.location.hostname+'/backend/paymentNotification';
        sigData["continueUrl"] = window.location.hostname;
        request.backend('getPaySignature', {sigData: sigData, posId: '302273', merchantKey: '2325ca703e6467f115fee9ee85d0b829'}, function(data) {
            $scope.$apply(function() {
               $scope.signature = data;
            });
        });
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
            notify.addNew(new notify.Notification("Nowe płatność. Tytuł: " + paymentName + " Kwota: " + paymentAmount + " zł", selectedUserId, "#!/clientPayment"));
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