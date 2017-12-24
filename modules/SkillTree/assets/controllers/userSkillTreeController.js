app.controller('userSkillTreeController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.availableSkill = [];
    $scope.userSelected = false;
    $scope.skillLoaded = false;
    $scope.userIdNow = 0;

    $scope.loadUserFromTeam = function() {
        request.backend('getUserFromTeam', { tmid: $rootScope.user.tmid }, function(data) {
            $('#userSelect').html('');
            $('#userSelect').append("<option value='' disabled selected>Wybierz zawodnika</option>");
            for (var j = 0; j < data.length; j++) {
                $('#userSelect').append("<option value='" + data[j].usid + "'>" + data[j].firstname + ' ' + data[j].lastname + "</option>");
            }
            $('select').material_select();
            $scope.showContent = true;
        });
    }

    $(document).off("change", "#userSelect");
    $(document).on("change", "#userSelect", function() {
        let userId = $(this).val();
        $scope.userIdNow = userId;
        $scope.userSelected = true;
        $scope.skillLoaded = false;
        request.backend('getUserAvailableSkill', { usid: userId }, function(data) {
            $scope.$apply(function() {
                $scope.availableSkill = data;
                $scope.skillLoaded = true;
            });
        });
    });

    $(document).off("change", ".selectSkillStatus");
    $(document).on("change", ".selectSkillStatus", function() {
        let skillStatus = $(this).val();
        let skillId = $(this).attr('id').split("-")[1];
        if (skillStatus) {
            $scope.userSelected = true;
            $scope.skillLoaded = false;
            request.backend('completeUserSkillTreeSkill', { usid: $scope.userIdNow, sid: skillId }, function(data) {
                $scope.$apply(function() {
                    $scope.availableSkill = data;
                    $scope.skillLoaded = true;
                });
            }, "Status umiejętności zmieniony na: zdana");
        }
    });

});