app.controller('meetPlayerCompositionController', function($scope, auth, $rootScope, notify, request, validator) {
    $scope.isSelectedField = false;
    $scope.allPlayers = [];
    $scope.selectedUser = null;
    $scope.selectedOnField = null;
    $scope.mouseActionType = {
        FIELD_LIST: 0,
    };
    $scope.onFieldUser=[];
    $scope.searchPerson = '';
    $scope.actualMouseAction = $scope.mouseActionType.FIELD_LIST;
    $scope.orientation = 'landscape';
    $scope.selectedField = '';
    $scope.fieldImage = '';
    let stageWidth = 800;
    let stageHeight = stageWidth * 0.6;

    let mainCanvas = new Konva.Stage({
        container: 'canvasContainer',
        width: stageWidth,
        height: stageHeight
    });

    $(window).resize(function() {
        resize();
    });
    $(window).on("orientationchange", function(event) {
        $scope.orientation = $(window).width() > $(window).height() ? 'sd' : 'landscape';
        resize();
    });
    function resize() {
        let container = document.querySelector('#canvasContainer');
        if (!container) return;
        let containerWidth = container.offsetWidth;
        $scope.$apply(function(){
            $scope.orientation = $(window).width() > $(window).height() ? 'sd' : 'landscape';
        });
        let scale = containerWidth / stageWidth;
        mainCanvas.width(stageWidth * scale);
        mainCanvas.height(stageHeight * scale);
        mainCanvas.scale({ x: scale, y: scale });
        mainCanvas.draw();
    }

    let mainLayer = new Konva.Layer();

    $(document).off('click touch', '.soccerField');
    $(document).on('click touch', '.soccerField', function() {
        $('.soccerField').each(function() {
            $(this).css("transform", "");
        });

        $scope.selectField($(this).find('img').attr('src'));
    });

    $(document).off('click touch', '.oneMeetUser');
    $(document).on('click touch', '.oneMeetUser', function() {
        $('.oneMeetUser').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "#783030");
        let user = $scope.allPlayers[$(this).data('meetid')];
        $scope.$apply(function(){
            $scope.selectedOnField = null;
            for(let i=0;i<$scope.onFieldUser.length;i++){
                $scope.onFieldUser[i].setAttr('strokeWidth',0);
            }
            let newUserToField = user;
            $scope.selectedUser = newUserToField;
            if(!newUserToField.image){
                newUserToField.image = new Image();
                newUserToField.image.src = '/'+newUserToField.img;
            }
        });
        drawStage();
    });

    $scope.selectField = function(src) {
        drawStage();
        $scope.selectedField = new Image();
        $scope.isSelectedField = true;
        $scope.selectedField.onload = function() {
            $scope.fieldImage = $scope.selectedField;
            drawStage();
        };
        $scope.selectedField.src = src;
    };

    $scope.initBackPrompt = function(){
        $scope.$on("$locationChangeStart", function(event) {
            if (!confirm('Niezapisane zmiany nie zostaną zapisane! Na pewno chcesz wyjść ?')) {
                event.preventDefault();
            }else{
                $(window).off('beforeunload');
            }
        });
        $(window).off('beforeunload');
        $(window).on('beforeunload',function(){
            return confirm('Niezapisane zmiany nie zostaną zapisane! Na pewno chcesz wyjść ?');
        });
    };

    $scope.getPlayers = function(){
        request.backend('getMeetPlayers', {tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function(){
                $scope.allPlayers = data.users;
            });
        });
    };
    $scope.getPlayers();

    function clickOnContent(){
        if($scope.selectedUser){
            let mousePos = mainCanvas.getPointerPosition();
            let scale = mainCanvas.getAttr('scaleX');

            let hRatio = 45.0  / $scope.selectedUser.image.width;
            let vRatio =  45.0 / $scope.selectedUser.image.height;
            let ratio  = Math.min ( hRatio, vRatio );

            let obj = new Konva.Rect({
                x: mousePos.x / scale,
                y: mousePos.y / scale,
                cornerRadius: 50,
                width: 45,
                height: 45,
                offsetX: (45 / 2.0),
                offsetY: (45 / 2.0),
                fillPatternRepeat: 'no-repeat',
                fillPatternScale: {x: ratio, y:ratio},
                fillPatternImage: $scope.selectedUser.image,
                name: "movementObject",
                id: $scope.selectedUser.usid,
                textObj: $scope.selectedUser.userName,
                stat: $.extend($scope.selectedUser,{}),
                draggable: true,
                stroke: "red",
                strokeWidth: 10
            });

            obj.on('mouseenter', function () {
                mainCanvas.container().style.cursor = 'move';
            });

            obj.on('mouseleave', function () {
                mainCanvas.container().style.cursor = 'default';
            });

            obj.on('click tap mousedown dragstart', function() {
                let self = this;
                $scope.$apply(function(){
                    $scope.selectedOnField = self.getAttr('stat');
                    $scope.selectedUser = null;
                    for(let i=0;i<$scope.onFieldUser.length;i++){
                        $scope.onFieldUser[i].setAttr('strokeWidth',0);
                        if($scope.onFieldUser[i].getAttr('id') == self.getAttr('id')){
                            $scope.onFieldUser[i].setAttr('strokeWidth',10);
                        }
                    }
                    mainCanvas.draw();
                    $('.oneMeetUser').each(function() {
                        $(this).css("border-color", "");
                    });
                });
            });

            $scope.$apply(function(){
                $scope.onFieldUser.push(obj);
                $scope.allPlayers.splice($(this).data('meetid'),1);
                $scope.selectedUser = null;
                $scope.selectedOnField = obj.getAttr('stat');
                $('.oneMeetUser').each(function() {
                    $(this).css("border-color", "");
                });
                for(let i=0;i<$scope.onFieldUser.length;i++){
                    $scope.onFieldUser[i].setAttr('strokeWidth',0);
                    if($scope.onFieldUser[i].getAttr('id') == obj.getAttr('id')){
                        $scope.onFieldUser[i].setAttr('strokeWidth',10);
                    }
                }
            });

            drawStage();
        }
    }

    $scope.removeFromField = function(){
        if(!$scope.selectedOnField) return;
        $scope.allPlayers.push($.extend($scope.selectedOnField,{}));

        for(let i=0;i<$scope.onFieldUser.length;i++){
            if($scope.onFieldUser[i].getAttr('stat').usid == $scope.selectedOnField.usid) {
                $scope.onFieldUser.splice(i,1);
                break;
            }
        }

        drawStage();
        $scope.selectedOnField = null;
    };

    function drawStage(){
        mainCanvas = null;
        mainCanvas = new Konva.Stage({
            container: 'canvasContainer',
            width: stageWidth,
            height: stageHeight,
        });
        mainCanvas.on('contentClick contentTap', function(e) {
            clickOnContent();
        });
        mainCanvas.on('mousemove', function(e) {
            if($scope.selectedUser){
                mainCanvas.container().style.cursor = 'pointer';
            }else if(!$scope.selectedOnField){
                mainCanvas.container().style.cursor = 'default';
            }
        });
        mainLayer = null;
        mainLayer = new Konva.Layer();
        let conImg = new Konva.Image({
            x: 0,
            y: 0,
            image: $scope.fieldImage,
            width: mainCanvas.getWidth(),
            height: mainCanvas.getHeight(),
            id: "field"
        });
        mainLayer.add(conImg);

        $scope.onFieldUser.forEach(function(element){
            mainLayer.add(element);
        });

        mainCanvas.add(mainLayer);
        setTimeout(resize,300);
    }

});