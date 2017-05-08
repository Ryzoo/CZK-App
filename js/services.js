app.service('auth', function($http, $rootScope) {

    this.logIn = function(login, password) {
        // jesli dobre dane zwroci w przyszlosci token wygenerowany przy logowaniu
    }
    this.checkIsLogged = function(token) {
        // zwroci dane jesli koles o danym tokenie jest zalogowany
    }
    this.logout = function(token) {
        // wyloguje kolesia, zmieni jego token w bazie
    }
    this.checkPermission = function(permission) {
        // true lub false jesli dana osoba moze wejsc na ta strone lub nie 
    }

});