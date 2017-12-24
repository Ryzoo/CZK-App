app.controller('skillTreeListController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.skillTreeCategories = [];
    $scope.skillTreeSkills = [];

    var updatedId = 0;
    $scope.isUpdate = false;

    $scope.loadSkillTreeData = function(){
        request.backend('getSkillTreeData', {}, function(data) {
            $scope.$apply(function() {
                $scope.skillTreeCategories = data.categories;
                $scope.skillTreeSkills = data.skills;
                $scope.showContent = true;
                
            });
        });
    }
    
    $scope.openAddCategoryModal = function(){
       $("#addCategoryModal").modal('open');
       setTimeout(function(){
            $('#categoryColorForm').parent().parent().colorpicker({
                component: '.btn'
            });
        },200);
    }

    $scope.addCategory = function(){
        $("#addCategoryModal").modal('close');
        var name = $("#categoryNameForm").val();
        var color = $("#categoryColorForm").val();
        $("#categoryNameForm").val('');
        $("#categoryColorForm").val('');
        request.backend('addCategorySkillTree', {name: name, color: color}, function(data) {
            $scope.$apply(function() {
                $scope.skillTreeCategories.push({
                    id: data,
                    name: name,
                    color: color
                });
            });
            notify.localNotify("Sukces","Pomyślnie dodano kategorię");
        });
    }

    $scope.editCategoryModal = function(category){
        $("#addCategoryModal").modal('open');
        updatedId = category.id;
        $scope.isUpdate = true;
        $("#categoryNameForm").val(category.name);
        $("#categoryColorForm").val(category.color);

        setTimeout(function(){
            $('#categoryColorForm').parent().parent().colorpicker({
                component: '.btn',
                format: 'hex',
                color: category.color
            });
            $('#categoryColorForm').parent().parent().colorpicker('setValue',category.color);
        },200);


    }


    $scope.deleteCategory = function(){
        $("#addCategoryModal").modal('close');
        $("#categoryNameForm").val('');
        $("#categoryColorForm").val('');
        $scope.isUpdate = false;

        $rootScope.showModalWindow("Usunięcie kategorii w skilltree",function(){
            request.backend('deleteCategorySkillTree', {id: updatedId}, function(data) {
                $scope.$apply(function() {
                    for(let i=0;i<$scope.skillTreeCategories.length;i++){
                        if($scope.skillTreeCategories[i].id == updatedId){
                            $scope.skillTreeCategories.splice(i,1);
                            break;
                        }
                    }
                    updatedId = 0;
                });
                notify.localNotify("Sukces","Pomyślnie usunięto kategorię");
            });
        });
    }

    $scope.closeModals = function(){
        $("#addCategoryModal").modal('close');
        $("#addSkillModal").modal('close');
        updatedId = 0;
        $scope.isUpdate = false;
    }

    $scope.saveCategory = function(){
        $("#addCategoryModal").modal('close');
        var name = $("#categoryNameForm").val();
        var color = $("#categoryColorForm").val();
        $("#categoryNameForm").val('');
        $("#categoryColorForm").val('');
        request.backend('saveCategorySkillTree', {id:updatedId, name: name, color: color}, function(data) {
            $scope.$apply(function() {
                for(let i=0;i<$scope.skillTreeCategories.length;i++){
                    if($scope.skillTreeCategories[i].id == updatedId){
                        $scope.skillTreeCategories[i].name = name;
                        $scope.skillTreeCategories[i].color = color;
                        break;
                    }
                }
                updatedId = 0;
            });
            notify.localNotify("Sukces","Pomyślnie zapisano zmiany");
        });
        $scope.isUpdate = false;
    }

    
    $(document).off('change',"#skillTreeCatSelect");
    $(document).on('change',"#skillTreeCatSelect",function(){
        var id = $(this).val();
        $("#skillTreeSkillRootSelect").html('');
        $("#skillTreeSkillRootSelect").append('<option value="" disabled selected>Wybierz umiejętność</option>');
        for(let i=0;i<$scope.skillTreeSkills.length;i++){
            if($scope.skillTreeSkills[i].category_id == id)
                $("#skillTreeSkillRootSelect").append('<option value="'+$scope.skillTreeSkills[i].id+'"  >'+$scope.skillTreeSkills[i].name+'</option>');
        }
        $('#skillTreeSkillRootSelect').material_select();
    });

    $scope.openAddSkillModal = function(){
        $("#addSkillModal").modal('open');
        $("#skillTreeCatSelect").html('');
        $("#skillTreeCatSelect").append('<option value="" disabled selected>Wybierz kategorię umiejętności</option>');
        for(let i=0;i<$scope.skillTreeCategories.length;i++){
            $("#skillTreeCatSelect").append('<option value="'+$scope.skillTreeCategories[i].id+'"  >'+$scope.skillTreeCategories[i].name+'</option>');
        }

        $("#skillTreeReqSelect").html('');
        $("#skillTreeReqSelect").append('<option value="" disabled selected>Wybierz dodatkowe zależności</option>');
        $("#skillTreeSkillRootSelect").html('');
        $("#skillTreeSkillRootSelect").append('<option value="" disabled selected>Wybierz najpierw kategorie</option>');
        for(let i=0;i<$scope.skillTreeSkills.length;i++){
            $("#skillTreeReqSelect").append('<option value="'+$scope.skillTreeSkills[i].id+'"  >'+$scope.skillTreeSkills[i].name+'</option>');
        }
        
        $('select').material_select();
    }

    $scope.editSkill = function(){
        $("#addSkillModal").modal('close');
        $("#SkillUpdateIdForm").val(updatedId);
        if(validateSkillForm()){
            let dataToSend = new FormData($("#SkillTreeSkillForm")[0]);
            request.backend('saveSkillInTree', dataToSend, function(data) {
                $scope.$apply(function() {
                    $scope.skillTreeSkills = data;
                });
            },"Umiejętność zapisana",true);
        }
        $scope.isUpdate = false;
    }

    $scope.editSkillModal = function(element){
        
        $("#addSkillModal").modal('open');
        $scope.isUpdate = true;
        updatedId = element.id;

        request.backend('getSkillToEdit', {id: updatedId}, function(skillThis) {
            $("#skillTreeCatSelect").html('');
            $("#skillTreeCatSelect").append('<option value="" disabled >Wybierz kategorię umiejętności</option>');
            for(let i=0;i<$scope.skillTreeCategories.length;i++){
                var isThis = $scope.skillTreeCategories[i].id == skillThis.category_id;
                $("#skillTreeCatSelect").append('<option '+(isThis?"selected":"")+' value="'+$scope.skillTreeCategories[i].id+'"  >'+$scope.skillTreeCategories[i].name+'</option>');
            }
            $("#skillTreeReqSelect").html('');
            $("#skillTreeReqSelect").append('<option value="" disabled >Wybierz dodatkowe zależności</option>');
            $("#skillTreeSkillRootSelect").html('');
            $("#skillTreeSkillRootSelect").append('<option value="" disabled >Wybierz umiejętność</option>');
            for(let i=0;i<$scope.skillTreeSkills.length;i++){
                var isInSkillArray = checkSkillReqIs($scope.skillTreeSkills[i].id,skillThis.req);
                $("#skillTreeReqSelect").append('<option '+(isInSkillArray?"selected":"")+' value="'+$scope.skillTreeSkills[i].id+'"  >'+$scope.skillTreeSkills[i].name+'</option>');
                if($scope.skillTreeSkills[i].category_id == skillThis.category_id){
                    var isThisRoot = $scope.skillTreeSkills[i].id == skillThis.root_skill_id;
                    $("#skillTreeSkillRootSelect").append('<option '+(isThisRoot?"selected":"")+' value="'+$scope.skillTreeSkills[i].id+'"  >'+$scope.skillTreeSkills[i].name+'</option>');
                }
            }
            $scope.rootSkill = parseInt(skillThis.root_skill_id) > 0;
            
            $('select').material_select();
        });


        $("#skillNameForm").val(element.name);
        $("#skillAboutForm").val(element.description);
        $("#skillLevelForm").val(element.level);
    }

    function checkSkillReqIs(id,array){
        if(!array) return false;
        if(array.length <= 0 ) return false;
        for(let i=0;i<array.length;i++){
            if(array[i] == id){
                return true;
            }
        }
        return false;
    }

    $scope.deleteSkill = function(){
        $("#addSkillModal").modal('close');
        $("#skillNameForm").val('');
        $("#skillAboutForm").val('');
        $("#skillLevelForm").val('0');
        $scope.isUpdate = false;

        $rootScope.showModalWindow("Usunięcie umiejętności w skilltree",function(){
            request.backend('deleteSkillInTree', {id: updatedId}, function(data) {
                $scope.$apply(function() {
                    for(let i=0;i<$scope.skillTreeSkills.length;i++){
                        if($scope.skillTreeSkills[i].id == updatedId){
                            $scope.skillTreeSkills.splice(i,1);
                            break;
                        }
                    }
                    updatedId = 0;
                });
                notify.localNotify("Sukces","Pomyślnie usunięto umiejętność");
            });
        });
    }

    $scope.addSkill = function(){
        $("#addSkillModal").modal('close');
        
        if(validateSkillForm()){
            let dataToSend = new FormData($("#SkillTreeSkillForm")[0]);
            request.backend('addSkillTreeSkill', dataToSend, function(data) {
                $scope.$apply(function() {
                    $scope.skillTreeSkills = data;
                });
            },"Umiejętność dodana",true);
        }
    }

    function validateSkillForm(){
        var name = $("#skillNameForm").val();
        var about = $("#skillAboutForm").val();
        var level = $("#skillLevelForm").val();
        var isRootElement = $("#isRootSkill").val() == "on" ? true : false;
        var skillRoot = $("#skillTreeSkillRootSelect").val();
        var req = $("#skillTreeReqSelect").val();
        var category = $("#skillTreeCatSelect").val();
        var file = $("#skillFile").val();

        var error = false;
        error = validateMustBe(name);
        if(!error) error = validateMustBe(about);
        if(!error) error = validateMustBe(level);
        if(!error) error = validateMustBe(category);
        if(!$scope.isUpdate){if(!error) error = validateMustBe(file);}
        if(!isRootElement){
            if(!error) error = validateMustBe(skillRoot);
        }
        if(error) return false;
        return true;
    }

    function validateMustBe(element){
        if(!element || element == null ){
            notify.localNotify("Walidacja","Nie wszystkie pola zostały odpowiednio wypełnione")
            return true;
        }
        return false;
    }
});