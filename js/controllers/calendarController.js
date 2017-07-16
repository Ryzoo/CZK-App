app.controller('calendarController', function($scope, auth, $rootScope, request, notify) {

    $scope.actualEdit = '';
    $scope.allEvents = '';
    $scope.initAllEv = function() {
        $rootScope.showContent = false;
        $('#prBar').attr('aria-valuenow', (parseInt($('#prBar').attr('aria-valuenow')) + parseInt(50)));
        $('#prBar').css('width', '50%');
        $scope.getAllEvents();
        $('#prBar').attr('aria-valuenow', (parseInt($('#prBar').attr('aria-valuenow')) + parseInt(100)));
        $('#prBar').css('width', '100%');
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.showContent = true;
            });
        }, 500);
    }
    $scope.getAllEvents = function() {
        var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid };
        var urlToPost = 'backend/getNews';
        $.ajax({
            url: urlToPost,
            type: "POST",
            data: dataToSend,
            async: true,
            success: function(msg) {
                if (msg.success) {
                    $scope.allEvents = msg.data;
                    initCalendar();
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
    };

    $scope.addEvent = function(valid) {
        var title1 = $("#addTitleNews").val();
        var start1 = $("#addStartNews").val();
        var end1 = $("#addEndNews").val();
        if (title1.length > 1 && start1.length > 1 && end1.length > 1) {
            var dataToSend = { token: Cookies.get('tq'), tmid: $rootScope.user.tmid, title: title1, start: start1, end: end1 };
            var urlToPost = 'backend/addNews';
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: dataToSend,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        $scope.getAllEvents();
                        $('.editEvent').hide();
                        $("#addTitleNews").val('');
                        $("#addStartNews").val('');
                        $("#addEndNews").val('');
                        $.gritter.add({
                            title: 'Sukces',
                            text: 'Dodano wydarzenie pomyślnie',
                            image: '',
                            sticky: true,
                            time_alive: '5',
                            class_name: 'my-sticky-class'
                        });
                        notify.addNew(new notify.Notification("Dodano wydarzenie: '" + title1 + "'", null, "#!/calendar", true));
                    } else {
                        console.log(msg);
                        $.gritter.add({
                            title: 'Bład',
                            text: 'Niestety nie udało się dodać wydarzenia',
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
                        text: 'Niestety nie udało się dodać wydarzenia',
                        image: '',
                        sticky: true,
                        time_alive: '5',
                        class_name: 'my-sticky-class'
                    });
                },
            });
        }
    };

    $scope.editEvent = function() {
        if ($scope.actualEdit != '' && $("#editTitle").val().length > 2) {
            var dataToSend = { token: Cookies.get('tq'), id: $scope.actualEdit.id, title: $("#editTitle").val() };
            var urlToPost = 'backend/editNews';
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: dataToSend,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        $scope.getAllEvents();
                        $.gritter.add({
                            title: 'Sukces',
                            text: 'Wydarzenie edytowane pomyślnie',
                            image: '',
                            sticky: true,
                            time_alive: '5',
                            class_name: 'my-sticky-class'
                        });
                    } else {
                        console.log(msg);
                        $.gritter.add({
                            title: 'Bład',
                            text: 'Niestety edycja nie powiodła się',
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
                        text: 'Niestety edycja nie powiodła się',
                        image: '',
                        sticky: true,
                        time_alive: '5',
                        class_name: 'my-sticky-class'
                    });
                },
            });
        }
        $('.editEvent').hide();
        $scope.actualEdit = '';
    };

    $scope.deleteEvent = function() {
        if ($scope.actualEdit != '') {
            var dataToSend = { token: Cookies.get('tq'), tmid: $scope.actualEdit.id_team, id: $scope.actualEdit.id };
            var urlToPost = 'backend/deleteNews';
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: dataToSend,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        $scope.getAllEvents();
                        $.gritter.add({
                            title: 'Sukces',
                            text: 'Wydarzenie usunięte pomyślnie',
                            image: '',
                            sticky: true,
                            time_alive: '5',
                            class_name: 'my-sticky-class'
                        });
                    } else {
                        console.log(msg);
                        $.gritter.add({
                            title: 'Bład',
                            text: 'Niestety nie udało się usunąć wydarzenia',
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
                        text: 'Niestety nie udało się usunąć wydarzenia',
                        image: '',
                        sticky: true,
                        time_alive: '5',
                        class_name: 'my-sticky-class'
                    });
                },
            });
        }
        $('.editEvent').hide();
        $scope.actualEdit = '';
    };

    function initCalendar() {
        /* initialize the calendar----------------------------*/
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $('#calendar').html('');
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: ($rootScope.user.role == 'TRENER' || $rootScope.user.role == 'KOORD'),
            droppable: true,
            drop: function(date, allDay) {
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;

                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
                $(this).remove();
            },
            eventClick: function(calEvent, jsEvent, view) {
                $scope.$apply(function() {
                    $scope.actualEdit = calEvent;
                });
                $('.editEvent').show();
                $(this).css('border-color', 'red');

            },
            eventDrop: function(event) {
                var dataToSend = { token: Cookies.get('tq'), id: event.id, start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'), end: moment(event.end).format('YYYY-MM-DD HH:mm:ss') };
                var urlToPost = 'backend/editNews';
                $.ajax({
                    url: urlToPost,
                    type: "POST",
                    data: dataToSend,
                    async: true,
                    success: function(msg) {
                        if (msg.success) {
                            $scope.getAllEvents();
                            $.gritter.add({
                                title: 'Sukces',
                                text: 'Wydarzenie edytowane pomyślnie',
                                image: '',
                                sticky: true,
                                time_alive: '5',
                                class_name: 'my-sticky-class'
                            });
                        } else {
                            console.log(msg);
                            $.gritter.add({
                                title: 'Bład',
                                text: 'Niestety edycja nie powiodła się',
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
                            text: 'Niestety edycja nie powiodła się',
                            image: '',
                            sticky: true,
                            time_alive: '5',
                            class_name: 'my-sticky-class'
                        });
                    },
                });
            },
            eventResize: function(event, delta, revertFunc) {
                var dataToSend = { token: Cookies.get('tq'), id: event.id, start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'), end: moment(event.end).format('YYYY-MM-DD HH:mm:ss') };
                var urlToPost = 'backend/editNews';
                $.ajax({
                    url: urlToPost,
                    type: "POST",
                    data: dataToSend,
                    async: true,
                    success: function(msg) {
                        if (msg.success) {
                            $scope.getAllEvents();
                            $.gritter.add({
                                title: 'Sukces',
                                text: 'Wydarzenie edytowane pomyślnie',
                                image: '',
                                sticky: true,
                                time_alive: '5',
                                class_name: 'my-sticky-class'
                            });
                        } else {
                            console.log(msg);
                            $.gritter.add({
                                title: 'Bład',
                                text: 'Niestety edycja nie powiodła się',
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
                            text: 'Niestety edycja nie powiodła się',
                            image: '',
                            sticky: true,
                            time_alive: '5',
                            class_name: 'my-sticky-class'
                        });
                    },
                });
            },
            events: $scope.allEvents
        });
    };



});