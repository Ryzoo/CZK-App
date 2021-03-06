app.controller('mainController', function($scope, auth, $rootScope, $route, notify, request, $compile, $location) {
    $rootScope.viewPerm = ["TRENER", "ZAWODNIK", "KOORD", "STAFF"];
    $scope.contentLoaded = false;
    $rootScope.newNotify = [];
    $rootScope.allNotify = [];
    $rootScope.lastNotId = 0;
    $rootScope.notifyCount = 0;
    $rootScope.mainSettings = [];
    $scope.showAllNewsNotify = false;
    $rootScope.editConspectWithId = null;
    $rootScope.consepectShowId = null;
    $rootScope.widgetResponse = null;
    $rootScope.teamNameStr = '';
    $rootScope.showAdw = true;
    $rootScope.user = {
        email: "",
        token: "",
        role: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        imgPath: "",
        id: "",
        tmid: "",
        height: "",
        tel: "",
        parentTel: "",
        weight: "",
        mainLeg: "",
        mainPosition: "",
        address: "",
        bodyType: "",
        license_type: ""
    }
    $rootScope.feedType = 'opinia';


    $scope.turnOffAdw = function() {
        $rootScope.showAdw = false;
    }

    $scope.goFeed = function(type) {
        $rootScope.feedType = type;
        $location.url("/feedback");
    };



    $scope.showNotifications = function(isMainClik = true) {
        if (isMainClik) {
            if ($scope.showAllNewsNotify == false) {
                $scope.showAllNewsNotify = true;
            } else {
                $scope.showAllNewsNotify = false;
            }
            notify.setNewOff();
        } else {
            $scope.showAllNewsNotify = false;
        }
    }

    $rootScope.closeWidget = function(response = null) {
        $rootScope.widgetResponse = response;
        $("#widgetContainer").hide("slide", {}, 200);
    }

    $rootScope.dayToDate = function(date) {
        var a = moment();
        var b = moment([date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0]]);

        var diffDays = b.diff(a, 'days');
        var color = diffDays > 30 ? '#30a42e' : diffDays < 14 ? '#a32d1f' : '#eab233';
        $('.licenseEndDay').css("color", color);
        return diffDays;
    }

    $rootScope.showWidget = function(widgetName, moduleName) {
        $.get("modules/" + moduleName + "/assets/widget/" + widgetName + ".html", function(data) {
            data = "<button class='waves-effect waves-light btn widgetClose' style='width:100%' ng-click='closeWidget();' >Zamknij okno</button>" + data;
            var content = $compile(data)($scope);
            $('.widgetContentContainer').html('');
            $('.widgetContentContainer').append(content);
            $("#widgetContainer").show("slide", {}, 200);
        });
    }

    $rootScope.showModalWindow = function(text, agreeFunction, disagreeFunction = null) {
        var data = "<h5 style='padding: 10px 20px;'>Czy jesteś pewny tego działania ?</h5>" +
            "<p style='padding: 0 20px 20px;'>" + text + "</p>" +
            "<button class='waves-effect waves-light btn widgetClose' style='width:calc(50% - 40px); float:left; margin: 0 20px 20px;' id='widgetAgree' >Tak, wykonaj</button>" +
            "<button class='waves-effect waves-light btn widgetClose' style='width:calc(50% - 40px); float:left; margin: 0 20px 20px;' id='widgetDisagree' >Anuluj</button>";

        var content = $compile(data)($scope);
        $('.widgetContentContainer').html('');
        $('.widgetContentContainer').append(content);
        $("#widgetContainer").show("slide", {}, 200);
        $(document).off("click", "#widgetAgree");
        $(document).on("click", "#widgetAgree", function() {
            $rootScope.closeWidget();
            agreeFunction();
        });
        $(document).off("click", "#widgetDisagree");
        $(document).on("click", "#widgetDisagree", function() {
            $rootScope.closeWidget();
            if (disagreeFunction) disagreeFunction();
        });
    }

    $(document).keyup(function(e) {
        if (e.keyCode === 27) $rootScope.closeWidget();
    });

    $rootScope.tutorialOn = false;
    $rootScope.getTutorial = function( tutorialName ){
        $rootScope.tutorialOn = true;
        $('.modal').modal();
        $.get("/public/tutorial/"+tutorialName+".html", function(data){
            $('#tutorialModal').find(".modal-content").first().html(data);
            $('#tutorialModal').modal('open',{
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .75, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 300, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    complete: function() { $rootScope.tutorialOn = false }
                }
            );
        }).fail(function() {
            notify.localNotify('Przepraszamy', "Nie posiadamy jeszcze poradnika do tej części.");
        });
    };

    $rootScope.closeTutorial = function(){
        $rootScope.tutorialOn = false;
        $('#tutorialModal').modal('close');
    };

    $scope.mainInit = function() {

        if (!auth.checkIsLogged()) {
            auth.logout();
            return;
        } else {
            var data = auth.getUserData();
            if (data.success) {
                request.backend('getMainPageSettings', {}, function(data) {
                    $rootScope.mainSettings = data;
                });

                request.backend('getTeams', {}, function(data) {
                    if (data.length == 0) {
                        notify.localNotify('Uwaga', "Twoje konto będzie ograniczone dopóki nie zostaniesz przypisany do sekcji");
                    } else {
                        $('#teamSelect').html('');
                        $('#teamSelect').append("<option value='' disabled> Wybierz sekcję </option>");
                        for (var i = 0; i < data.length; i++) {
                            $('#teamSelect').append("<option value='" + data[i].tmid + "'" + (i == 0 ? 'selected' : '') + ">" + data[i].name + "</option>");
                        }
                        if (data[0] != null && data[0].tmid != null) {
                            $rootScope.user.tmid = data[0].tmid;
                            $rootScope.teamNameStr = data[0].name;
                        }

                    }
                    setTimeout(function() {
                        $('#loadingContent').hide('slide', {}, 1000);
                        $('#mainContent').show('fade', {}, 1000);
                        document.location.href = "/panel#!/";
                        $route.reload();
                        notify.getNew(true);
                        setInterval(function() {
                            notify.getNew();
                        }, 5000);

                    }, 500);
                    $('select').formSelect();
                });

            } else {
                document.location = "login";
                return;
            }
        }
    };

    $(document).on('click', '#printButton', function() {
        $("body").prepend($("#main-content-in"));
        var element = $("body>div").each(function() {
            if ($(this).attr('id') != "main-content-in")
                $(this).addClass('noPrint');
        });
        $(".ng-hide").each(function() {
            $(this).addClass('noPrint');
        });
        window.print();
        $("#main-content").prepend($("#main-content-in"));
        $(".ng-hide").each(function() {
            $(this).removeClass('noPrint');
        });
    });


    function createPDF() {
        var element = document.getElementById('main-content-in');
        html2pdf(element, {
            margin: 2,
            filename: 'myfile.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { dpi: 256, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });
    } // create canvas object


    $(document).on('change', '#teamSelect', function() {
        $rootScope.user.tmid = $("option:selected", this).val();
        $rootScope.teamNameStr = $("option:selected", this).text();
        document.location.href = "/panel#!/";
        $route.reload();
    });

    $('.closeVideoPlayer i').off("click")
    $('.closeVideoPlayer i').on("click", function() {
        $('#videoPlayerContMain video')[0].pause();
        $('#videoPlayerContMain').hide();
    });

    $rootScope.toggleCardOptions = function(id) {
        $('.cardOptions').each(function() {
            var tId = $(this).attr('id');
            if (!tId || (tId && tId != id))
                $(this).stop().hide('slide', { direction: 'up' });
        });

        if ($("#" + id)) {
            $("#" + id).first().stop().toggle('slide', { direction: 'up' });
        }
    }

});