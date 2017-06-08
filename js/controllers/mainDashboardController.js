app.controller('mainDashboardController', function($scope, auth, $rootScope, request) {
  var day = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var monthName;
  switch(month) {
    case 1:
      monthName = 'Stycznia';
      break;
    case 2:
      monthName = 'Lutego';
      break;
    case 3:
      monthName = 'Marca';
      break;
    case 4:
      monthName = 'Kwietnia';
      break;
    case 5:
      monthName = 'Maja';
      break;
    case 6:
      monthName = 'Czerwca';
      break;
    case 7:
      monthName = 'Lipca';
      break;
    case 8:
      monthName = 'Sierpnia';
      break;
    case 9:
      monthName = 'Wrzesnia';
      break;
    case 10:
      monthName = 'Października';
      break;
    case 11:
      monthName = 'Listopada';
      break;
    case 12:
      monthName = 'Grudnia';
      break;
    default:
      "Błędny miesiąc";
  }
  $(".today-date").html("marchewka");
});
