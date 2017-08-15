var app = angular.module("CZKApp", ["ngRoute"]);

app.service('request', function($http, $rootScope) {
    this.sync = function(sendType, urlToPost, dataToSend, fsuccess, ffailed, asyncIs = false) {
        return $.ajax({
            async: asyncIs,
            type: sendType,
            url: urlToPost,
            data: dataToSend,
            success: fsuccess,
            error: ffailed,
        });
    }
    this.backend = function(routeName, data = {}, successFunction = null, successMessage = "", isForm = false) {
        var urlToPost = 'backend/' + routeName;
        if (isForm) {
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: data,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        if (successFunction) {
                            successFunction(msg.data ? msg.data : []);
                        }
                        if (successMessage.length > 2) {
                            $.gritter.add({
                                title: 'Sukces',
                                text: successMessage,
                                image: '',
                                sticky: true,
                                time: 3,
                                class_name: 'my-sticky-class'
                            });
                        }
                    } else {
                        console.log(msg);
                        if (msg.error) {
                            $.gritter.add({
                                title: 'Bład',
                                text: msg.error,
                                image: '',
                                sticky: true,
                                time: 3,
                                class_name: 'my-sticky-class'
                            });
                        }
                    }
                },
                error: function(jqXHR, textStatus) {
                    console.log("Blad podczas laczenia z serverem: " + textStatus);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się połączyć z serverem',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            var dataToSend = Object.assign({ token: Cookies.get('tq') }, data);
            $.ajax({
                url: urlToPost,
                type: "POST",
                data: dataToSend,
                async: true,
                success: function(msg) {
                    if (msg.success) {
                        if (successFunction) {
                            successFunction(msg.data ? msg.data : []);
                        }
                        if (successMessage.length > 2) {
                            $.gritter.add({
                                title: 'Sukces',
                                text: successMessage,
                                image: '',
                                sticky: true,
                                time: 3,
                                class_name: 'my-sticky-class'
                            });
                        }
                    } else {
                        console.log(msg);
                        if (msg.error) {
                            $.gritter.add({
                                title: 'Bład',
                                text: msg.error,
                                image: '',
                                sticky: true,
                                time: 3,
                                class_name: 'my-sticky-class'
                            });
                        }
                    }
                },
                error: function(jqXHR, textStatus) {
                    console.log("Blad podczas laczenia z serverem: " + textStatus);
                    $.gritter.add({
                        title: 'Bład',
                        text: 'Niestety nie udało się połączyć z serverem',
                        image: '',
                        sticky: true,
                        time: 3,
                        class_name: 'my-sticky-class'
                    });
                }
            });
        }
    }
});