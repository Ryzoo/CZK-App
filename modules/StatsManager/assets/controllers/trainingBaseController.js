app.controller('trainingBaseController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = true;
    $scope.trainingBase = [{
        name: "Beep Test",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Bieg bez piłki",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Mobilność barków",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Pompka",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Przejście nad płotkiem",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Przysiad głęboki",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Przysiad w wykroku",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Stabilność rotacyjna tułowia",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "FMS - Uniesienie wyprostowanej nogi",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Ławeczki",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Prowadzenie piłki",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "RAST",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Skok w dal z miejsca",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Szybkość (30m)",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Wyskok dosiężny",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Zwroty z piłką",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }, {
        name: "Żonglerka piłką",
        age_category: "<strong>Kategoria wiekowa:</strong>",
        equipment: "<strong>Wyposażenie:</strong>",
        execution: "<strong>Wykonanie:</strong>",
        scoring: "<strong>Punktacja:</strong>"
    }]
});