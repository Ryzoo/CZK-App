app.controller('paymentController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.loadHistory = false;
    $scope.selectedUserHistory = [];
    $scope.selectedPayment = [];
    $scope.showPay = false;
    $scope.ip = 0;
    $scope.signature = 0;
    $scope.isPayuEnabled = false;
    $scope.merchantPosId = '';
    $scope.merchantKey = '';
    $scope.paymentSummary = [];
    $scope.allCyclPayments = [];

    $scope.initPaymentSettings = function() {
        getSettings();
    }

    $scope.initPayment = function() {
        getUserFromTeam();
        getSettings();
    }

    $scope.initPaymentCyclic = function() {

        request.backend('getAllCyclePayment', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.allCyclPayments = data;
                $scope.showContent = true;
            });
        });

    }

    $scope.deleteCyclePay = function(id) {

        $rootScope.showModalWindow("Usunięcie płatności", function() {
            request.backend('deleteCyclePayment', { id: id }, function(data) {
                $scope.initPaymentCyclic();
            }, "Płatność została usunięta");
        });



    }

    $scope.addCyclePay = function() {
        var title = $("#cyclikPayTitle").val();
        var startDate = $("#dataInput").val();
        var amount = parseFloat($("#payValue").val().replace(",", "."));

        if (!startDate || startDate.length <= 0) {
            notify.localNotify("Walidacja", "Wproawdź ilość dni wyprzedzenia");
            return;
        }

        if (title.length <= 3) {
            notify.localNotify("Walidacja", "Wpisz dłuższy tytuł płatności");
            return;
        }

        if (amount.length == 0 || amount == 0 || amount <= 0.00) {
            notify.localNotify("Walidacja", "Wprowadź poprawnie kwotę płatności");
            return;
        }

        if ($scope.payDay >= 0 && $scope.payDay <= 23) {
            var interval = $scope.payDay;
            var intervalName = "dzień";
        } else if ($scope.payWeek >= 0 && $scope.payWeek <= 6) {
            var interval = $scope.payWeek;
            var intervalName = "tydzień";
        } else if ($scope.payMonth >= 1 && $scope.payMonth <= 31) {
            var interval = $scope.payMonth;
            var intervalName = "miesiąc";
        } else {
            notify.localNotify("Walidacja", "Podaj poprawny odstęp czasowy");
            return;
        }

        request.backend('addCyclePayment', { tmid: $rootScope.user.tmid, title: title, howLongBefore: startDate, interval: interval, intervalName: intervalName, amount: amount }, function(data) {
            $scope.initPaymentCyclic();
        }, "Płatność została dodana");
    }

    $scope.getPaymentSummary = function() {
        if ($rootScope.user.tmid == '' || $rootScope.user.role == 'ZAWODNIK') return;

        request.backend('getPaymentSummary', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.paymentSummary = data;
            });
        });
    }

    $scope.initPaymentClient = function() {
        request.backend('getClientIp', { tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
            $scope.$apply(function() {
                $scope.ip = data;
            });
        });
        $scope.host = window.location.protocol + "//" + window.location.hostname;
        request.backend('getUserPaymentHistory', { tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
            $scope.$apply(function() {
                $scope.selectedUserHistory = data[0] ? data[0] : [];
                $scope.showContent = true;
            });
        });
        getSettings();
    }

    function getSettings() {
        request.backend('getPaymentOptions', {}, function(data) {
            $scope.$apply(function() {
                $scope.merchantPosId = data.merchantPosId;
                $scope.merchantKey = data.merchantKey;
                $scope.isPayuEnabled = data.availablePaymentPayu == "false" ? false : true;
                if ($scope.isPayuEnabled) $('#turnOffOnPayu').prop('checked', true);
                else $('#turnOffOnPayu').prop('checked', false);
                $scope.showContent = true;
                setTimeout(function() {
                    Materialize.updateTextFields();
                    $('select').material_select();
                    $('ul.tabs').tabs();
                    $('.collapsible').collapsible();
                }, 500);
            });
        });
    }

    $(document).off('change', '#turnOffOnPayu');
    $(document).on("change", "#turnOffOnPayu", function() {
        request.backend('turnOffOnPayuPay', { payStatus: $("#turnOffOnPayu").is(':checked') }, function(data) {
            $scope.$apply(function() {
                $scope.isPayuEnabled = $("#turnOffOnPayu").is(':checked');
            });
        }, "Płatności Payu ustawione pomyślnie");
    })

    $scope.showPayment = function(index) {
        $scope.selectedPayment = $scope.selectedUserHistory.data[index];
        if ($scope.selectedPayment) {
            $scope.showPay = true;
            $scope.getSignatureVerify();
        }
    }

    $scope.payWithPayu = function() {
        request.backend('payWithPayu', { pmid: $scope.selectedPayment.id }, function(data) {
            request.backend('getUserPaymentHistory', { tmid: $rootScope.user.tmid, usids: [$rootScope.user.id] }, function(data) {
                $scope.$apply(function() {
                    $scope.selectedUserHistory = data[0] ? data[0] : [];
                    $scope.showContent = true;
                });
            });
        });
    }

    $scope.getSignatureVerify = function() {
        var sigData = new Object();
        sigData["customerIp"] = $scope.ip;
        sigData["merchantPosId"] = $scope.merchantPosId;
        sigData["extOrderId"] = $scope.selectedPayment.id;
        sigData["description"] = $scope.selectedPayment.name;
        sigData["totalAmount"] = $scope.selectedPayment.amount * 100;
        sigData["currencyCode"] = "PLN";
        sigData["products.name"] = $scope.selectedPayment.name;
        sigData["products.unitPrice"] = $scope.selectedPayment.amount * 100;
        sigData["products.quantity"] = "1";
        sigData["products.virtual"] = "true";
        sigData["buyer.email"] = $rootScope.user.email;
        sigData["buyer.firstName"] = $rootScope.user.firstname;
        sigData["buyer.lastName"] = $rootScope.user.lastname;
        sigData["buyer.language"] = "pl";
        sigData["notifyUrl"] = $scope.host + '/backend/paymentNotification';
        sigData["continueUrl"] = $scope.host;
        request.backend('getPaySignature', { sigData: sigData, posId: $scope.merchantPosId, merchantKey: $scope.merchantKey }, function(data) {
            $scope.$apply(function() {
                $scope.signature = data;
            });
        });
    }

    $scope.sendPayment = function() {
        var paymentName = $("#payName").val();
        if (paymentName.length < 3) {
            notify.localNotify("Walidacja", "Zbyt krótki tytuł płatności");
            return;
        }
        var paymentAmount = parseFloat($("#payAmount").val().replace(",", ".")).toFixed(2);
        if (!$.isNumeric(paymentAmount) || paymentAmount <= 0) {
            notify.localNotify("Walidacja", "Błędna kwota");
            return;
        }
        var selectedUserAmount = $('.userSelectInput:checked').length;
        if (selectedUserAmount <= 0) {
            notify.localNotify("Walidacja", "Zaznacz przynajmniej jedną osobę");
            return;
        }
        var selectedUserId = [];
        $('.userSelectInput:checked').each(function() {
            selectedUserId.push($(this).attr("id").split("-")[1]);
        });
        request.backend('addPaymentToUser', { tmid: $rootScope.user.tmid, userIds: selectedUserId, amount: paymentAmount, name: paymentName }, function(data) {
            notify.addNew(new notify.Notification("Nowe płatność. Tytuł: " + paymentName + " Kwota: " + paymentAmount + " zł", selectedUserId, "#!/clientPayment"));
        }, "Pomyślnie dodano płatnośc do kont użytkowników oraz wysłano powiadomienie");
    }

    $scope.getUsersHistory = function(historyload = false) {
        var selectedUserAmount = $('.userSelectInput:checked').length;
        if (selectedUserAmount <= 0) {
            notify.localNotify("Walidacja", "Zaznacz przynajmniej jedną osobę");
            return;
        }
        var selectedUserId = [];
        $('.userSelectInput:checked').each(function() {
            selectedUserId.push($(this).attr("id").split("-")[1]);
        });

        request.backend('getUserPaymentHistory', { tmid: $rootScope.user.tmid, usids: selectedUserId }, function(data) {
            $scope.$apply(function() {
                $scope.selectedUserHistory = data;
                $scope.loadHistory = false;
                $('ul.tabs').tabs();
                $('.collapsible').collapsible();
            });
        });
    }

    $scope.deletePayment = function(id) {

        $rootScope.showModalWindow("Usunięcie płatności", function() {
            request.backend('deletePayment', { pmid: id }, function(data) {
                $scope.getUsersHistory(true);
            }, "Pomyślnie usunięto płatność");
        });


    }

    $scope.endPayment = function(id) {
        request.backend('endPayment', { pmid: id }, function(data) {
            $scope.getUsersHistory(true);
        }, "Zakończono płatność");
    }

    function getUserFromTeam() {
        request.backend('getUserFromTeam', { tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function() {
                $scope.allUsers = data;
                $scope.showContent = true;
            });
        });
    }

    $(document).off('change', '#selectAllUser');
    $(document).on("change", "#selectAllUser", function() {
        var select = false;
        if ($('#selectAllUser').is(':checked')) {
            select = true;
        } else {
            select = false;
        }
        $(".userSelectInput").each(function() {
            $(this).prop('checked', select);
        });
    });

    $(document).off('change', '.userSelectInput');
    $(document).on("change", ".userSelectInput, #selectAllUser", function() {
        if ($scope.payHistory == 1) {
            $scope.getUsersHistory();
        }
    });

    $(document).off('change', '.collapsible');
    $(document).on("click", ".collapsible", function() {
        $('.collapsible').collapsible();
    });

    $(document).off('change', '.payOption');
    $(document).on("change", ".payOption", function() {
        request.backend('editOptions', { posId: $("#posId").val(), merKey: $("#merKey").val() }, function(data) {
            getSettings();
        }, "Pomyslnie zmieniono dane payu");
    });

});