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
            scoring: [
              "Im więcej zaliczonych etapów i odcinków 20-metrowych – tym lepiej.",
              "Do e-platformy Club Management Center wynik wprowadzamy w następujący sposób:",
              "liczba przed kropką oznacza etap, a po kropce – odcinek.",
              "Takim sposobem, gdy zawodnik ukończył test na 10 etapie i 2 odcinku, zapisujemy wynik jako 10.02.",
              "Analogicznie jeśli ukończył test na 9 etapie i 10 odcinku, zapisujemy wynik jako 9.1.",
              "W razie niepewności prosimy o kontakt z działem technicznym."
            ]
        },

        {
            name: "Bieg bez piłki",
            ageCategory: "od 8 do 13 roku życia wzwyż",
            equipment: "8 tyczek (lub innych znaczników)",
            execution: [
              "1. Zawodnik staje na linii startu.",
              "2. Ma przebiec po wyznaczonej trasie (obiegając każdą z tyczek) w jak najszybszym czasie.",
              "3. Rozpoczęcie biegu następuje po komendzie trenera – wtedy również zaczynamy liczenie czasu.",
              "4. Zatrzymujemy czas w momencie przebiegnięcia zawodnika przez linię mety."
            ],
            scoring: [
              "Im krótszy czas wykonania – tym lepiej.",
              "Niepoprawne wykonanie testu oznacza dyskwalifikację.",
              "Należy wtedy powtórzyć cały test od nowa."
            ]
        },

        {
            name: "FMS - Mobilność barków",
            ageCategory: "wszyscy",
            equipment: "taśma centymetrowa (lub inny przyrząd do pomiaru odległości)",
            execution: [
              "1. Należy zmierzyć zawodnikowi odległość między podstawą dłoni a końcem środkowego palca.",
		          "2. Zawodnik zaciska pięści w obu dłoniach.",
		          "3. Teraz sięga jedną ręką od góry, drugą od dołu – tak, aby ułożyć je jak najbliżej siebie za plecami.",
		          "4. Zawodnik ma wykonać to jednym, płynnym ruchem i utrzymać ręce za plecami.",
		          "5. Należy zmierzyć odległość między pięściami, a następnie wykonać całość odwrotnym ustawieniem rąk."
            ],
            scoring: [
              "3pkt: Odległość między pięściami nie przekracza odległości pomiędzy podstawą dłoni i końcem środkowego palca zawodnika.",
		          "2pkt: Odległość między pięściami nie przekracza półtorej długości dłoni zawodnika.",
		          "1pkt: Odległość między pięściami przekracza półtorej długości dłoni zawodnika."
            ]
        },

        {
            name: "FMS - Pompka",
            ageCategory: "wszyscy",
            equipment: "brak",
            execution: [
              "1. Zawodnik przyjmuje pozycję do pompki z rękoma rozstawionymi na szerokość barków.",
		          "2. Mężczyźni: kciuki mają znajdować się na wysokości czubka głowy.",
		          "Kobiety: kciuki mają znajdować się na wysokości policzków.",
		          "3. Zawodnik wykonuje pompkę.",
		          "4. Należy zwrócić uwagę, aby zawodnik uniósł całe ciało bez wyginania kręgosłupa."
            ],
            scoring: [
              "3pkt: Mężczyźni: Poprawnie wykonana pompka.",
		          "Kobiety: Poprawnie wykonana pompka.",
          		"2pkt: Mężczyźni: Poprawnie wykonana pompka, ale z kciukami na wysokości policzków.",
              "Kobiety: Poprawnie wykonana pompka, ale z kciukami na wysokości obojczyków.",
              "1pkt: Brak poprawnie wykonanej pompki."
            ]
        },

        {
            name: "FMS - Przejście pod płotkiem",
            ageCategory: "wszyscy",
            equipment: "drążek (może być tyczka lub kij), płotek (lub sznurek)",
            execution: [
              "1. Zawodnik stoi przed płotkiem (palce stóp pod płotkiem).",
              "2. Zawodnik trzyma oburącz drążek, opiera go na barkach.",
              "3. Rozpoczyna się zadanie – zawodnik ma przenieść nogę nad płotkiem, bez dotykania go.",
              "4. Należy postawić nogę po drugiej stronie płotka i dotknąć piętą podłoża.",
              "5. Zawodnik wraca do pozycji wyjściowej, a następnie powtarza całość wykonując drugą nogą."
            ],
            scoring: [
              "3pkt: Biodro, kolano i stopa nogi znajdującej się po drugiej stronie płotka są w jednej osi. Odcinek lędźwiowy kręgosłupa ma być nieruchomy, a drążek z listwą ustawione do siebie równolegle.",
              "2pkt: Brak osi wzdłuż nogi znajdującej się po drugiej stronie płotka. Odcinek lędźwiowy kręgosłupa nie jest nieruchomy, a drążek z listwą nie są ustawione równolegle.",
              "1pkt: Zawodnik dotknął płotka i tracił równowagę."
            ]
        },

        {
            name: "FMS - Przysiad głęboki",
            ageCategory: "wszyscy",
            equipment: "drążek (może być tyczka lub kij)",
            execution: [
              "1. Zawodnik stoi w rozkroku na szerokość bioder.",
	            "2. Zawodnik trzyma nad głową drążek – ręce wyprostowane w łokciach.",
              "3. Rozpoczyna się zadanie – zawodnik ma wykonać maksymalny przysiad.",
              "4. Należy zwrócić uwagę na to, aby ciało zawodnika było skierowane na wprost, a jego pięty mają przylegać do ziemi."
            ],
            scoring: [
              "3pkt: Zawodnik zszedł na tyle nisko, że jego biodra znalazły się poniżej linii kolan, kolana znajdują się osi nóg, uda ułożone są równolegle do tułowia, a drążek jest na wysokości stóp.",
              "2pkt: Zawodnik wykonał przysiad, ale z pomocą – z podstawką położoną pod piętami, kolana nie znajdują się w osi nóg.",
              "1pkt: Zawodnik nie wykonuje poprawnie przysiadu nawet z pomocą, dodatkowo zgięcie w części lędźwiowej kręgosłupa."
            ]
        },

        {
            name: "FMS - Przysiad w wykroku",
            ageCategory: "wszyscy",
            equipment: "drążek (może być tyczka lub kij), podstawa (lub listwa), taśma centymetrowa (lub inny przyrząd do pomiaru odległości)",
            execution: [
              "1. Należy zacząć od zmierzenia długości podudzia zawodnika.",
              "2. Zawodnik stoi na początku podstawy, od tego miejsca (od czubka stopy) należy odmierzyć na podstawie odległość równą długości podudzia i zaznaczyć ją na podstawie.",
              "3. Zawodnik otrzymuje drążek, ma go trzymać oburącz i przyłożyć go do pleców.",
              "4. Teraz zawodnik stawia piętę jednej z nóg w wyznaczonym punkcie i wykonuje przysiad.",
              "5. Należy dotknąć kolanem podstawy (za piętą postawioną w wyznaczonym punkcie).",
              "6. Zawodnik wraca do pozycji wyjściowej i wykonuje to samo drugą nogą."
            ],
            scoring: [
              "3pkt: Stopy i kolana podczas wykonywania ćwiczenia utrzymane były w jednej linii, dotknięto kolanem podstawy, ruch tułowia był minimalny.",
              "2pkt: Nie utrzymano jednej linii stóp i kolan, nie dotknięto kolanem podstawy, pochylono się do przodu podczas wykonywania ćwiczenia.",
              "1pkt: Zawodnik całkowicie utracił równowagę."
            ]
        },

        {
            name: "FMS - Stabilność rotacyjna tułowia",
            ageCategory: "wszyscy",
            equipment: "brak",
            execution: [
              "1. Zawodnik ustawia się w następujący sposób: klęczy w podporze na ziemi tak, aby biodra i barki były ustawione do tułowia pod kątem 90 stopni. Stopy mają być wyprostowane.",
              "2. Zawodnik ma jednocześnie unieść lewą rękę i lewą nogę, a następnie wyprostować obie kończyny w powietrzu.",
              "3. Teraz zawodnik musi ugiąć kończyny i dotknąć łokciem kolana.",
              "4. Następnie należy znowu wyprostować kończyny.",
              "5. Na koniec powrót do pozycji wyjściowej i powtórzenie testu drugą parą kończyn."
            ],
            scoring: [
              "3pkt: Poprawne wykonanie, zawodnik utrzymał tułów równolegle do podłoża, a kolano i łokieć były w jednej linii.",
              "2pkt: Poprawne wykonanie skośnej wersji testu (przeciwległe kończyny, czyli kiedy podnosimy lewą rękę, musimy podnieść prawą nogę), zawodnik utrzymał tułów równolegle do podłoża.",
              "1pkt: Brak poprawnego wykonania skośnej wersji testu."
            ]
        },

        {
            name: "FMS - Uniesienie wyprostowanej nogi",
            ageCategory: "wszyscy",
            equipment: "deska, drążek (lub tyczka)",
            execution: [
              "1. Zawodnika kładzie się na plecach.",
              "2. Pod kolanami umieszczamy deskę.",
              "3. Należy znaleźć kolec biodrowy przedni górny oraz szparę stawu kolanowego zawodnika.",
              "4. Zawodnik unosi wyprostowaną nogę. Stopa zgięta w taki sposób, aby tworzyła z nogą kąt 90 stopni (jakbyśmy chcieli pokazać palcami stopy na siebie).",
              "5. Teraz należy przyłożyć do kostki zawodnika drążek, tak aby był prostopadle do ziemi.",
              "6. Zauważamy miejsce padania drążka i powtarzamy test drugą nogą."

            ],
            scoring: [
              "3pkt: Miejsce padania drążka znajduje się między kolcem biodrowym przednim górnym zawodnika, a środkiem uda.",
              "2pkt: Miejsce padania drążka znajduje się między środkiem uda, a linią stawu kolanowego.",
              "1pkt: Miejsce padania drążka znajduje się za szparą stawu kolanowego."
            ]
        }
    ]
});
