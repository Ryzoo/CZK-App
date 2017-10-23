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
              "Im więcej zaliczonych etapów i odcinków 20-metrowych – tym lepiej."
              "Do e-platformy Club Management Center wynik wprowadzamy w następujący sposób:"
              "liczba przed kropką oznacza etap, a po kropce – odcinek."
              "Takim sposobem, gdy zawodnik ukończył test na 10 etapie i 2 odcinku, zapisujemy wynik jako 10.02."
              "Analogicznie jeśli ukończył test na 9 etapie i 10 odcinku, zapisujemy wynik jako 9.1."
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
              "Im krótszy czas wykonania – tym lepiej."
              "Niepoprawne wykonanie testu oznacza dyskwalifikację."
              "Należy wtedy powtórzyć cały test od nowa."
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
            name: "Bieg bez piłki",
            ageCategory: "od 8 do 13 roku życia wzwyż",
            equipment: "8 tyczek (lub innych znaczników)",
            execution: [
              "1. Zawodnik staje na linii startu.",
              "2. Ma przebiec po wyznaczonej trasie (obiegając każdą z tyczek) w jak najszybszym czasie.",
              "3. Rozpoczęcie biegu następuje po komendzie trenera – wtedy również zaczynamy liczenie czasu.",
              "4. Zatrzymujemy czas w momencie przebiegnięcia zawodnika przez linię mety."
            ],
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
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
            scoring: "Im krótszy czas wykonania – tym lepiej. Niepoprawne wykonanie testu oznacza dyskwalifikację. Należy wtedy powtórzyć cały test od nowa."
        }
    ]
});
