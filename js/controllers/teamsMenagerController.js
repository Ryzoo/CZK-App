app.controller('teamsMenagerController', function($scope, auth, $rootScope, notify) {
    $scope.showContent = false;
    $scope.teams = [];
    $scope.teamMasters = [];
    $scope.masters = [];

    $scope.showPlayerNow = false;
    $scope.showPreLoad = false;
    $scope.personShow = false;

    $scope.actualSelectedTeamId = -1;

    $scope.openCard = function(name) {
        $('#' + name).toggle('blind', null, 'fast');
        $scope.personShow = !$scope.personShow;
    }

    $scope.initTeams = function() {
        getAllTeams();
        getAllMaster();
    }

    function getAllMaster() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getAllMaster';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    if (msg.data) {
                        $scope.masters = msg.data;
                        for (var i = 0; i < msg.data.length; i++) {
                            $('#mastersSelect').append("<option value='" + msg.data[i].usid + "'>" + msg.data[i].firstname + " " + msg.data[i].lastname + "</option>");
                        }
                        $('select').material_select();
                    }
                    $scope.$apply(function() {
                        $scope.showContent = true;
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać wydarzeń do kalendarza',
                        image: '',
                        sticky: true,
                        time_alive: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety nie udało się pobrać wydarzeń do kalendarza',
                    image: '',
                    sticky: true,
                    time_alive: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getAllTeams() {
        var dataToSend = { token: Cookies.get('tq') };
        var urlToPost = 'backend/getAllTeams';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.$apply(function() {
                        $scope.teams = msg.data ? msg.data : [];
                    });
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas dodawania',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Błąd podczas dodawania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function getAllMastersFromTeam(id, functionSuccess) {
        $scope.actualSelectedTeamId = id;
        var dataToSend = { token: Cookies.get('tq'), tmid: id };
        var urlToPost = 'backend/getAllMastersFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    if (msg.data) {
                        $scope.$apply(function() {
                            $scope.teamMasters = msg.data;
                        });
                    }
                    functionSuccess();

                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas dodawania',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Błąd podczas dodawania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $scope.showThisTeam = function(id) {
        $scope.showPreLoad = true;
        $scope.showPlayerNow = false;
        getAllMastersFromTeam(id, function() {
            $scope.showPlayerNow = true;
            $scope.showPreLoad = false;
        });
    }
    $scope.deleteTeam = function(id) {
        var dataToSend = { token: Cookies.get('tq'), id: id };
        var urlToPost = 'backend/deleteTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Usuwanie',
                        text: 'Udało się usunąc drużynę wraz z zawartością',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    getAllTeams();
                    $scope.showPlayerNow = false;
                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas usuwania drużyny',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Błąd podczas dodawania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }
    $scope.addTeam = function() {
        var name = $('#teamName').val();
        if (name.length < 3) {
            $.gritter.add({
                title: 'Bład',
                text: 'Wpisz dłuższą nazwę drużyny',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), name: name };
        var urlToPost = 'backend/addTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Dodano nową drużynę, możesz przydzielić teraz trenerów',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    getAllTeams();
                } else {
                    if (msg.error) {
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                    }
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $(document).ready(function() {
                    var unique_id = $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać danych',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }
    $scope.deleteMaster = function(id) {
        var dataToSend = { token: Cookies.get('tq'), mid: id, tmid: $scope.actualSelectedTeamId };
        var urlToPost = 'backend/deleteMasterFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Usuwanie',
                        text: 'Udało się usunąc trenera z danej drużyny',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $scope.showThisTeam($scope.actualSelectedTeamId);
                    var actualTeamName = '';
                    for (var index = 0; index < $scope.teams.length; index++) {
                        if ($scope.teams[index].id == $scope.actualSelectedTeamId) {
                            actualTeamName = $scope.teams[index].name
                        }
                    }
                    notify.addNew(new notify.Notification("Zostałeś usunięty z drużyny: " + actualTeamName, [mid], ""));

                } else {
                    console.log(msg);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Błąd podczas usuwania trenera z drużyny',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Błąd podczas dodawania',
                    image: '',
                    sticky: true,
                    time: '5',
                    class_name: 'my-sticky-class'
                });
            },
        });
    }
    $scope.addTeamMaster = function() {
        var mid = $('#mastersSelect').val();
        if (!mid || mid < 0) {
            $.gritter.add({
                title: 'Bład',
                text: 'Wybierz trenera do dodania',
                image: '',
                sticky: true,
                time: '5',
                class_name: 'my-sticky-class'
            });
            return;
        }
        var dataToSend = { token: Cookies.get('tq'), mid: mid, tmid: $scope.actualSelectedTeamId };
        var urlToPost = 'backend/addMasterToTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Sukces',
                        text: 'Dodano trenera do drużyny',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                    $scope.showThisTeam($scope.actualSelectedTeamId);
                    var actualTeamName = '';
                    for (var index = 0; index < $scope.teams.length; index++) {
                        if ($scope.teams[index].id == $scope.actualSelectedTeamId) {
                            actualTeamName = $scope.teams[index].name
                        }
                    }
                    notify.addNew(new notify.Notification("Przypisano Cię do nowej drużyny: " + actualTeamName, [mid], ""));
                } else {
                    if (msg.error) {
                        $.gritter.add({
                            title: 'Bład',
                            text: msg.error,
                            image: '',
                            sticky: true,
                            time: '5',
                            class_name: 'my-sticky-class'
                        });
                    }
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $(document).ready(function() {
                    var unique_id = $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się pobrać danych',
                        image: '',
                        sticky: true,
                        time: '5',
                        class_name: 'my-sticky-class'
                    });
                });
            },
        });
    }

});