app.controller('calendarController', function($scope, auth, $rootScope, request, notify) {

    $scope.actualEdit = '';
    $scope.allEvents = '';
    $scope.initAllEv = function() {
        $rootScope.showContent = false;
        $scope.getAllEvents();
    }

    $scope.getAllEvents = function() {
        request.backend('getNews', { tmid: $rootScope.user.tmid  }, function(data) {
            $scope.$apply(function() {
                $scope.allEvents = data;
                $scope.showContent = true;
                initCalendar();
            });
        });
    };

    $scope.addEvent = function(valid) {
        var title1 = $("#addTitleNews").val();
        var start1 = $("#addStartNews").val();
        var end1 = $("#addEndNews").val();
        if (title1.length > 1 && start1.length > 1 && end1.length > 1) {
            request.backend('addNews', { tmid: $rootScope.user.tmid, title: title1, start: start1, end: end1  }, function(data) {
                $scope.getAllEvents();
                $('.editEvent').hide();
                $("#addTitleNews").val('');
                $("#addStartNews").val('');
                $("#addEndNews").val('');
                notify.addNew(new notify.Notification("Dodano wydarzenie: '" + title1 + "'", null, "#!/calendar", true));
            },'Dodano wydarzenie pomyślnie');
        }
    };

    $scope.editEvent = function() {
        if ($scope.actualEdit != '' && $("#editTitle").val().length > 2) {
            request.backend('editNews', { id: $scope.actualEdit.id, title: $("#editTitle").val() }, function(data) {
                $scope.getAllEvents();
            },'Wydarzenie edytowane pomyślnie');
        }
        $('.editEvent').hide();
        $scope.actualEdit = '';
    };

    $scope.deleteEvent = function() {
        if ($scope.actualEdit != '') {
            request.backend('deleteNews', {tmid: $scope.actualEdit.id_team, id: $scope.actualEdit.id }, function(data) {
                $scope.getAllEvents();
            },'Wydarzenie usunięte pomyślnie');
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
                request.backend('editNews', { id: event.id, start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'), end: moment(event.end).format('YYYY-MM-DD HH:mm:ss') }, function(data) {
                    $scope.getAllEvents();
                },'Wydarzenie edytowane pomyślnie');
            },
            eventResize: function(event, delta, revertFunc) {
                request.backend('editNews', { id: event.id, start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'), end: moment(event.end).format('YYYY-MM-DD HH:mm:ss') }, function(data) {
                    $scope.getAllEvents();
                },'Wydarzenie edytowane pomyślnie');
            },
            events: $scope.allEvents
        });
    };

});