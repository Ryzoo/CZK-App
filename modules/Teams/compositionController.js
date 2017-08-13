app.controller('compositionController', function($scope, auth, $rootScope, request, notify, statistic) {
    $scope.users = [];
    $scope.notOnField = [];
    $rootScope.showContent = false;

    $scope.getTeam = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getUserFromTeam';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    if (msg.data) {
                        $scope.$apply(function() {
                            for (var index = 0; index < msg.data.length; index++) {
                                msg.data[index].isSelected = false;
                                if (msg.data[index].pos_x < 0 || msg.data[index].pos_y < 0) {
                                    $scope.notOnField.push(msg.data[index]);
                                } else {
                                    $scope.users.push(msg.data[index]);
                                }
                            }
                        });
                    }
                    initCanvas();
                    setTimeout(function() {
                        teamFormChartInit();
                    }, 1000);
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle lub brak wyników',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.showContent = true;
                    });
                }, 500);
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $(document).on("change", ".changeNumber", function() {
        var teamMembersId = ($(this).attr('id').split("-"))[1];
        var positionId = ($(this).attr('id').split("-"))[2];
        var changedNumber = $(this).val();
        for (var i = 0; i < $scope.notOnField.length; i++) {
            if ($scope.notOnField[i].tmmid == teamMembersId) {
                var usid = $scope.notOnField[i].usid;
                $scope.$apply(function() {
                    $scope.notOnField[i].nr_on_tshirt = changedNumber;
                    saveComposition('nr_on_tshirt', teamMembersId, changedNumber, usid);
                });
                break;
            }
        }
    })

    function saveComposition(typeOfChange, tmid, value, usid) {
        var dataToSend = { token: Cookies.get('tq'), tmmid: tmid, val: value, type: typeOfChange };
        var urlToPost = 'backend/changeCollection';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Zapis',
                        text: 'Zmiana zapisana',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                    notify.addNew(new notify.Notification("Twój numer na boisku został zmieniony na: " + value, [usid], "#!/teamComposition"));
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    function savePositionOnField(usid, pos_x, pos_y, sendAlert = true) {
        var dataToSend = { token: Cookies.get('tq'), usid: usid, pos_x: parseInt(pos_x), pos_y: parseInt(pos_y) };
        var urlToPost = 'backend/savePositionOnField';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $.gritter.add({
                        title: 'Zapis',
                        text: 'Pozycja zmieniona',
                        image: '',
                        sticky: true,
                        time: 1,
                        class_name: 'my-sticky-class'
                    });
                    if (sendAlert) {
                        notify.addNew(new notify.Notification("Twoja pozycja na boisku została zmieniona", [usid], "#!/teamComposition"));
                    }
                } else {
                    console.log(msg.error);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety coś poszło źle',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            },
            error: function(jqXHR, textStatus) {
                console.log("Blad podczas laczenia z serverem: " + textStatus);
                $.gritter.add({
                    title: 'Bład',
                    text: 'Niestety coś poszło źle',
                    image: '',
                    sticky: true,
                    time: 3,
                    class_name: 'my-sticky-class'
                });
            },
        });
    }

    $(document).on('dragstart', '.dragedUser', function(evt) {
        if ($rootScope.user.role == 'ZAWODNIK') {
            return;
        }
        var usid = $(this).attr('id').split('-')[1];

        $rootScope.movedData = usid;
    });

    $(document).on('dragover', '#canvas', function(evt) {
        evt.preventDefault()
    });

    $(document).on('drop', '#canvas', function(evt) {
        evt.preventDefault();

        if ($rootScope.user.role == 'ZAWODNIK' || !$rootScope.movedData) {
            return;
        }
        var mousePosOnCanvas = getMousePos(evt);
        var actualWidth = $('#canvas_container').width();
        var percentPosition = {
            x: (mousePosOnCanvas.x / actualWidth) * 100,
            y: (mousePosOnCanvas.y / actualWidth) * 100,
        };
        var usid = $rootScope.movedData;

        for (var i = 0; i < $scope.notOnField.length; i++) {
            if ($scope.notOnField[i].usid == usid) {
                $scope.notOnField[i].pos_x = percentPosition.x;
                $scope.notOnField[i].pos_y = percentPosition.y;
                savePositionOnField($scope.notOnField[i].tmmid, percentPosition.x, percentPosition.y);
                $scope.$apply(function() {
                    $scope.users.push($scope.notOnField[i]);
                    $scope.notOnField.splice(i, 1);
                });
                teamFormChartInit();
                break;
            }
        }
    });

    function checkDistance(Px, Py, Qx, Qy) {
        return Math.sqrt(Math.pow(Px - Qx, 2) + Math.pow(Py - Qy, 2));
    }

    var actualKey = -1;

    $(document).on('mousedown touchstart', '#canvas', function(evt) {
        evt.preventDefault();
        if ($rootScope.user.role == 'ZAWODNIK') {
            return;
        }
        var actualWidth = $('#canvas_container').width();
        var actualCircleSize = parseInt(actualWidth * 0.04);
        var mousePos = getMousePos(evt);

        for (var i = $scope.users.length - 1; i >= 0; i--) {
            if (checkDistance(($scope.users[i].pos_x / 100) * actualWidth, ($scope.users[i].pos_y / 100) * actualWidth, mousePos.x, mousePos.y) <= actualCircleSize) {
                $scope.users[i].isSelected = true;
                updateTime = 50;
                actualKey = i;
                break;
            }
        }
    });

    $(document).on('mouseup touchend', '#canvas', function(evt) {
        evt.preventDefault();
        if ($rootScope.user.role == 'ZAWODNIK') {
            resetSelect();
            return;
        }

        if (actualKey != -1) {
            var mousePosOnCanvas = getMousePos(evt);
            var actualWidth = $('#canvas_container').width();
            var percentPosition = {
                x: (mousePosOnCanvas.x / actualWidth) * 100,
                y: (mousePosOnCanvas.y / actualWidth) * 100,
            };
            $scope.users[actualKey].pos_x = percentPosition.x;
            $scope.users[actualKey].pos_y = percentPosition.y;
            savePositionOnField($scope.users[actualKey].tmmid, $scope.users[actualKey].pos_x, $scope.users[actualKey].pos_y, false);
        }

        resetSelect();
    });

    $(document).on('mouseup touchend', '#notOnFieldCard', function(evt) {
        evt.preventDefault();
        if ($rootScope.user.role == 'ZAWODNIK') {
            resetSelect();
            return;
        }

        if (actualKey != -1) {
            $scope.users[actualKey].pos_x = -1;
            $scope.users[actualKey].pos_y = -1;
            $scope.users[actualKey].isSelected = false;
            savePositionOnField($scope.users[actualKey].tmmid, $scope.users[actualKey].pos_x, $scope.users[actualKey].pos_y, false);
            $scope.notOnField.push($scope.users[actualKey]);
            $scope.users.splice(actualKey, 1);
            teamFormChartInit();
        }

        resetSelect();
    });

    $(document).on('mouseup touchend', 'window', function(evt) {
        evt.preventDefault();
        resetSelect();
    });

    $(document).on('mousemove touchmove', 'window', function(event) {
        event.preventDefault();
    });


    function resetSelect() {
        for (var i = $scope.users.length - 1; i >= 0; i--) {
            $scope.users[i].isSelected = false;
        }
        actualKey = -1;
    }

    var updateTime = 50;
    var actualPosMouse = { x: 0, y: 0 };
    var canvas = document.getElementById("canvas");
    var ctx = document.getElementById('canvas').getContext('2d');

    var backgorund = new Image();
    backgorund.src = './img/canvas/background.jpg';

    function update() {
        var actualWidth = $('#canvas_container').width();
        canvas.width = actualWidth;
        canvas.height = actualWidth * 0.78;
        var actualCircleSize = parseInt(actualWidth * 0.04);
        var actualFontSize = parseInt(actualWidth * 0.04);

        ctx.drawImage(backgorund, 0, 0, backgorund.width, backgorund.height, 10, 10, actualWidth - 20, (actualWidth * 0.78) - 10);

        for (var i = 0; i < $scope.users.length; i++) {
            var pos;
            if ($scope.users[i].isSelected) {
                pos = actualPosMouse;
            } else {
                pos = {
                    x: ($scope.users[i].pos_x / 100) * actualWidth,
                    y: ($scope.users[i].pos_y / 100) * actualWidth
                }
            }
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, actualCircleSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            if (pos.y <= (actualWidth * 0.78) * 0.15 && pos.x >= (actualWidth / 2.0) - actualWidth * 0.05 && pos.x <= (actualWidth / 2.0) + actualWidth * 0.05) {
                ctx.fillStyle = 'rgba(215, 40, 40, 0.9)';
            }
            ctx.fill();
            if ($scope.users[i].isSelected) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#3399ff';
                ctx.stroke();
            }
            ctx.fillStyle = '#3399ff';
            ctx.textAlign = "center";
            ctx.font = actualFontSize + "px Arial";
            ctx.fillText($scope.users[i].nr_on_tshirt, pos.x, (parseInt(pos.y) + parseInt(actualFontSize / 2.6)));
            ctx.fillStyle = '#ffffff';
            ctx.font = actualFontSize + "px Arial";
            ctx.fillText($scope.users[i].firstname + ' ' + $scope.users[i].lastname, pos.x, (parseInt(pos.y) - actualCircleSize - 10));
        }
    }

    function teamFormChartInit() {
        data = [];
        data.push('wynik');
        var matchPersonsId = [];
        for (var i = 0; i < $scope.users.length; i++) {
            matchPersonsId.push($scope.users[i].usid);
        }
        var fullTeamScore = statistic.getTeamForm(matchPersonsId, true);

        data.push(fullTeamScore);
        var chart = c3.generate({
            bindto: "#teamStat",
            data: {
                columns: [
                    data
                ],
                type: 'gauge',
            },
            gauge: {},
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                threshold: {
                    values: [30, 60, 90, 100]
                }
            },
            size: {
                height: 90
            }
        });
    }

    function initCanvas() {
        setInterval(update, updateTime);
    }

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    $(document).on('mousemove', '#canvas', function(evt) {
        actualPosMouse = getMousePos(evt);
    });

});