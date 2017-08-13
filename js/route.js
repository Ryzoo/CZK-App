app.config(function($routeProvider) {
    var urlToPost = "backend/getModulesFrontRoutes";
    $.ajax({
        url: urlToPost,
        type: "POST",
        data: [],
        async: true,
        success: function(msg) {
            if (msg.success) {
                for (var x = 0; x < msg.data.length; x++) {
                    if (msg.data[x].url == 'badPerm') {
                        $routeProvider.otherwise({
                            templateUrl: msg.data[x].templateSrc
                        });
                    } else {
                        $routeProvider.when((msg.data[x].url == "/" ? "/" : "/" + msg.data[x].url), {
                            templateUrl: msg.data[x].templateSrc,
                            controller: msg.data[x].controllerName
                        });
                    }

                }
            } else {
                if (msg.error)
                    $.gritter.add({
                        title: 'Bład',
                        text: msg.error,
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
            }
        },
        error: function(jqXHR, textStatus) {
            $.gritter.add({
                title: 'Bład',
                text: "Blad podczas laczenia z serverem: " + textStatus,
                image: '',
                sticky: true,
                time: 3,
                class_name: 'my-sticky-class'
            });
        }
    });

});