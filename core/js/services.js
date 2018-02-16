var app = angular.module("CMCApp", ["ngRoute","ngSanitize"]);
var locaNotifyFun = function(type, message) {
    $.extend($.gritter.options, { 
        position: 'bottom-right', 
    });

    $.gritter.add({
        title: type,
        text: message,
        sticky: true,
        fade: true,
        time: 6,
        class_name: 'my-sticky-class'
    });
}

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
                        if (successMessage.length >= 2) {
                            locaNotifyFun('Sukces',successMessage);
                        }
                    } else {
                        if (msg.error) {
                            locaNotifyFun('Bład',msg.error);
                        }
                        if(msg.error == 'Nie masz wystarczających uprawnień'){
                            Cookies.remove('tq');
                            document.location = "login";
                        }
                    }
                },
                error: function(jqXHR, textStatus) {
                    console.log("Blad podczas laczenia z serverem: " + textStatus);
                    locaNotifyFun('Bład','Niestety nie udało się połączyć z serverem');
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
                            locaNotifyFun('Sukces',successMessage);
                        }
                    } else {
                        if (msg.error) {
                            locaNotifyFun('Bład',msg.error);
                        }
                        if(msg.error == 'Nie masz wystarczających uprawnień'){
                            Cookies.remove('tq');
                            document.location = "login";
                        }
                    }
                },
                error: function(jqXHR, textStatus) {
                    console.log("Blad podczas laczenia z serverem: " + textStatus);
                    locaNotifyFun('Bład','Niestety nie udało się połączyć z serverem');
                }
            });
        }
    }
});

app.service('validator', function() {
    this.valid = function( elementArray ) {
        let toReturn = true;
        elementArray.forEach(function(element){
            if(!toReturn) return;
            if(!element.value){
                locaNotifyFun('Błąd walidacji',element.name + " - Musi zostać podane");
                toReturn = false;
                return;
            }
            if(element.filter.isNumeric){
                if( !$.isNumeric( element.value ) ) {
                    locaNotifyFun('Błąd walidacji',element.name + " - Musi być wartością numeryczną");
                    toReturn = false;
                    return;
                }
                if(element.filter.min){
                    if( parseFloat(element.value) < parseFloat(element.filter.min)) {
                        locaNotifyFun('Błąd walidacji',element.name + " - Musi być większe lub równe: " + element.filter.min);
                        toReturn = false;
                        return;
                    }
                }
                if(element.filter.max){
                    if( parseFloat(element.value) > parseFloat(element.filter.max)) {
                        locaNotifyFun('Błąd walidacji',element.name + " - Musi być mniejsze lub równe: " + element.filter.max);
                        toReturn = false;
                        return;
                    }
                }
            }
            else if(element.filter.isDate){
                if(!moment(element.value).isValid()){
                    locaNotifyFun('Błąd walidacji',element.name + " - Musi być poprawnym formatem daty");
                    toReturn = false;
                    return;
                }
            }else{
                if(element.filter.lengthMin){
                    if( (element.value) < (element.filter.lengthMin)) {
                        locaNotifyFun('Błąd walidacji',element.name + " - Musi mieć przynajmniej: " + element.filter.lengthMin + " znaków");
                        toReturn = false;
                        return;
                    }
                }
                if(element.filter.lengthMax){
                    if( (element.value) > (element.filter.lengthMax)) {
                        locaNotifyFun('Błąd walidacji',element.name + " - Może mieć maksymalnie: " + element.filter.lengthMax + " znaków");
                        toReturn = false;
                        return;
                    }
                }
            }
        });
        return toReturn;
    }
});