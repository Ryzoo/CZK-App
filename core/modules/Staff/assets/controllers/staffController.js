app.controller('staffController', function($scope, auth, $rootScope, notify,request) {
    $scope.lastId = 0;
    $scope.staffMembers = [];
    $scope.personelMembers = [];
    $scope.koordsInSite = [];

    $scope.getStaffMembers = function() {
        $rootScope.showContent = false;
        getAllPersonel();
        getKoords();
        request.backend('getTeamStaff', {tmid: $rootScope.user.tmid }, function(data) {
            $scope.$apply(function(){
                $scope.staffMembers = data
                $scope.showContent = true;
            });
        });
    }

    $scope.addStaff = function() {
        var addUserId = $('#addStaffMembersSelect').val();
        var addName = $('#typeStaff').val();
        request.backend('addStaff', { tmid: $rootScope.user.tmid, name: addName, usid: addUserId}, function(data) {
            $scope.getStaffMembers();
            notify.addNew(new notify.Notification("Dodano nowy personel: " + addName, null, "#!/staff", true));
        },'Personel dodany pomyślnie');
    }

    $scope.deleteStaff = function(staffId) {
        request.backend('deleteStaff', { stid: staffId }, function(data) {
            $scope.getStaffMembers();
        },'Personel usunięty pomyślnie');
    }

    function getAllPersonel() {
        request.backend('getFullPersonel', {tmid: $rootScope.user.tmid }, function(data) {
            $scope.personelMembers = data;
            $('#prBar').attr('aria-valuenow', 50);
            $('#prBar').css('width', '50%');
            $('#addStaffMembersSelect').html("");
            for (var i = 0; i < data.length; i++) {
                $('#addStaffMembersSelect').append("<option value='" + data[i].usid + "'>" + data[i].firstname + " " + data[i].lastname + " [ " + data[i].rlname + " ] </option>");
            }
            $('select').material_select();
        });
    }

    function getKoords() {
        request.backend('getKoords', {}, function(data) {
            $scope.$apply(function() {
                $scope.koordsInSite = data;
            });
        });
    }

});