app.controller('trainingBaseController', function($scope, auth, $rootScope, notify, statistic, request) {
    $rootScope.showContent = true;

    $scope.trainingBase = [ //tablica obiektow, jeden obiekt to jeden trening

        { // rozpoczecie pierwszego obiektu, w srodku jego pola
            name: "Beep Test",
            ageCategory: "od 13 roku życia wzwyż",
            equipment: "2 linie (lub inne znaczniki), urządzenie audio do sygnalizowania (np. laptop)",
            execution: [ // wartosc tego pola jest tablica czyli []
                "1. Linie oddalone są od siebie na odległość 20m.",
                "2. Zawodnik staje na jednej z nich.",
                "3. Zadaniem zawodnika jest biec od linii do linii w wyznaczonych przedziałach czasu.",
                "4. Każdy start z linii musi być zsynchronizowany z sygnałem dźwiękowym („Beep”).",
                "5. Zawodnik biega tak długo, dopóki nie zrezygnuje (nie da rady więcej biec) lub w chwili gdy po raz drugi nie dotrze do linii na czas.",
                "6. Zapisywany jest ostatni etap oraz odcinek, w którym zawodnik dotarł do linii.",
                "7. Zaczynamy od tempa 8.5km/h. Prędkość się zwiększa.",
                "8. Jeśli zawodnik dotrze do linii za szybko, powinien poczekać na sygnał."
            ],
            scoring: "Im więcej zaliczonych etapów i odcinków 20-metrowych – tym lepiej. Do e-platformy Club Management Center wynik wprowadzamy w następujący sposób: liczba przed kropką oznacza etap, a po kropce – odcinek. Takim sposobem, gdy zawodnik ukończył test na 10 etapie i 2 odcinku, zapisujemy wynik jako 10.02. Analogicznie jeśli ukończył test na 9 etapie i 10 odcinku, zapisujemy wynik jako 9.1. W razie niepewności prosimy o kontakt z działem technicznym."
        }
        // teraz po przecinku dodajemy kolejne obiekty
        // w htmlu beda one wyswietlane kolejno wedlug szablonu
        // jak cos jest w tablicy mozemy uzyc dyrektyw ng-repeat zeby wyswietlac kolejne elementy -> patrz templatka trainingBase.html

    ]

    // $scope.trainingBase = [{
    //     name: "Beep Test",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Bieg bez piłki",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Mobilność barków",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Pompka",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Przejście nad płotkiem",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Przysiad głęboki",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Przysiad w wykroku",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Stabilność rotacyjna tułowia",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "FMS - Uniesienie wyprostowanej nogi",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Ławeczki",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Prowadzenie piłki",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "RAST",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Skok w dal z miejsca",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Szybkość (30m)",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Wyskok dosiężny",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Zwroty z piłką",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }, {
    //     name: "Żonglerka piłką",
    //     age_category: "<strong>Kategoria wiekowa:</strong>",
    //     equipment: "<strong>Wyposażenie:</strong>",
    //     execution: "<strong>Wykonanie:</strong>",
    //     scoring: "<strong>Punktacja:</strong>"
    // }]




});
