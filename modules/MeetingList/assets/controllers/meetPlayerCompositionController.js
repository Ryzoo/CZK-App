app.controller('meetPlayerCompositionController', function($scope, auth, $rootScope, notify, request, validator) {
    $scope.isSelectedField = false;
    $scope.allPlayers = [];
    $scope.selectedUser = null;
    $scope.selectedOnField = null;
    $scope.mouseActionType = {
        FIELD_LIST: 0,
    };
    $scope.editedNow = false;
    let myLineChart = null;
    let teamFormChart = null;
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

    $(document).ready(function () {
        $('.tooltipped').tooltip();
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
        let user = [];
        for(let i=0;i<$scope.allPlayers.length;i++){
            if(parseInt($scope.allPlayers[i].usid) === parseInt($(this).data('meetid'))){
                user = $scope.allPlayers[i];
                break;
            }
        }
        $scope.$apply(function(){
            for(let i=0;i<$scope.onFieldUser.length;i++){
                $scope.onFieldUser[i].setAttr('strokeWidth',0);
            }
            let newUserToField = user;
            $scope.editedNow=true;
            $scope.selectedUser = newUserToField;
            $scope.selectedOnField = null;

            if(!newUserToField.image){
                newUserToField.image = new Image();
                newUserToField.image.onload = function(){
                    mainCanvas.draw();
                };
                newUserToField.image.src = '/'+newUserToField.img;
            }
            setTimeout(function(){
                M.updateTextFields();

            },100);
        });
    });

    $scope.selectField = function(src,callaback=function(){}) {
        drawStage();
        $scope.selectedField = new Image();
        $scope.isSelectedField = true;
        $scope.selectedField.onload = function() {
            $scope.fieldImage = $scope.selectedField;
            callaback();
            drawStage();
        };
        $scope.selectedField.src = src;
    };

    function generateChart(){
        if(myLineChart){
            myLineChart.data.datasets[0].data = generatePotentialData();
            myLineChart.update();
        }else{
            myLineChart = new Chart($('#teamAllMeetStats'), {
                type: 'line',
                data: {
                    datasets: [{
                        backgroundColor: "rgba(255, 99, 132,0.5)",
                        borderColor: "rgb(255, 99, 132)",
                        data: generatePotentialData(),
                        label: 'Sprawność drużyny',
                        fill: 'start'
                    }],
                    labels: generateLabel()
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: "#bababa",
                            fontSize: 16
                        }
                    },
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                fontColor: "#bababa",
                                fontSize: 14,
                                min: 0,
                                beginAtZero: true,
                                max: 100,
                                stepSize: 25
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "#bababa",
                                fontSize: 14,
                                stepSize: 1,
                                autoSkip: false,
                            }
                        }]
                    }
                }
            });
        }

        if(teamFormChart){
            let actualForm = getActualForm();
            teamFormChart.data.datasets[0].data = [actualForm, 100-actualForm];
            teamFormChart.update();
        }else{
            let actualForm = getActualForm();
            teamFormChart = new Chart($('#teamAllMeetStatsForm'), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [actualForm, 100-actualForm],
                        borderColor: [
                            '#ff6384',
                            '#626a6e'
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132,0.5)',
                            'rgba(98, 106, 110,0.8)'
                        ]
                    }],
                    labels: [
                        'Forma',
                        'Braki'
                    ]
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: "#bababa",
                            fontSize: 16
                        }
                    }
                }
            });
        }
    }

    function getActualForm(){
        let potentialData = [];

        let potentialScore = 0;
        for(let j=0;j<$scope.onFieldUser.length;j++){
            potentialScore += parseInt($scope.onFieldUser[j].getAttr('stat').data.form);
        }
        potentialData.push(  parseInt((potentialScore / ($rootScope.settingsMeet.maxPlayers * 100.0))*100.0)  );

        return potentialData;
    }

    function generatePotentialData(){
        let potentialData = [];
        let label = generateLabel();

        for(let i=0;i<label.length;i++){
            let potentialScore = 0;
            for(let j=0;j<$scope.onFieldUser.length;j++){
                potentialScore += parseInt($scope.onFieldUser[j].getAttr('stat').data.potential[i].summary);
            }
            potentialData.push(  parseInt((potentialScore / ($rootScope.settingsMeet.maxPlayers * 100.0))*100.0)  );
        }

        return potentialData;
    }

    function generateLabel(){
        let allLabel = [];
        if($scope.allPlayers[0]){
            $scope.allPlayers[0].data.potential.forEach(function (element) {
                allLabel.push(element.name);
            });
        }
        return allLabel;
    }

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

    $scope.getPlayers = function(callback = function(){}){
        request.backend('getMeetPlayers', {tmid: $rootScope.user.tmid}, function(data) {
            $scope.$apply(function(){
                $scope.allPlayers = data.users;
                callback();
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
                stat: $.extend($scope.selectedUser,{}),
                textObj: null,
                draggable: true,
                stroke: "red",
                strokeWidth: 10
            });

            let textObj = new Konva.Text({
                x: obj.getAttr("x"),
                y: obj.getAttr("y") + 25,
                text: $scope.selectedUser.position + " " + $scope.selectedUser.userName,
                fontSize: 14,
                fill: $rootScope.settingsMeet.color
            });

            textObj.setOffset({
                x: textObj.getWidth() / 2.0
            });

            obj.setAttr("textObj",textObj);

            obj.on('mouseenter', function () {
                mainCanvas.container().style.cursor = 'move';
            });

            obj.on('mouseleave', function () {
                mainCanvas.container().style.cursor = 'default';
            });

            obj.on('dragend dragmove', function () {
                let text = this.getAttr("textObj");
                text.setAttr("x",this.getAttr("x"));
                text.setAttr("y",this.getAttr("y")+25);
                text.setOffset({
                    x: text.getWidth() / 2.0
                });
                this.setAttr("textObj",text);
                mainCanvas.draw();
            });

            obj.on('click tap mousedown dragstart', function() {
                let self = this;
                $scope.$apply(function(){
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
                    $scope.editedNow = true;
                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.selectedOnField = self.getAttr('stat');
                        });
                        M.updateTextFields();
                    },100);
                });
            });

            $scope.$apply(function(){
                $scope.onFieldUser.push(obj);
                for(let i=0;i<$scope.allPlayers.length;i++){
                    if($scope.allPlayers[i].usid == $scope.selectedUser.usid){
                        $scope.allPlayers.splice(i,1);
                        break;
                    }
                }
                $scope.editedNow = true;
                $scope.selectedOnField = obj.getAttr('stat');
                $scope.selectedUser = null;

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
            generateChart();
            setTimeout(function(){
                M.updateTextFields();
            },100);
        }
    }

    $rootScope.saveMeetComposition = function (callback = function(){}) {
        let userInField = [];
        for(let i=0;i<$scope.onFieldUser.length;i++){
            $scope.onFieldUser[i].setAttr('strokeWidth',0);
            userInField.push({
                x: $scope.onFieldUser[i].getAttr("x").toFixed(2),
                y: $scope.onFieldUser[i].getAttr("y").toFixed(2),
                usid: $scope.onFieldUser[i].getAttr("id"),
            });
        }
        mainCanvas.draw();
        let img = mainCanvas ? mainCanvas.toCanvas().toDataURL("image/jpg") : null;
        callback( (img &&  $scope.onFieldUser.length > 0) ? {
            img : img,
            user: userInField,
            fieldImg: $scope.selectedField.src,
            maxPlayers: $rootScope.settingsMeet.maxPlayers,
            stats:{
                actualForm: getActualForm(),
                data: generatePotentialData(),
                labels: generateLabel()
            }
        }: null);
    };

    $rootScope.reinitMeetingComposition = function (callback= function(){}) {
        $scope.isSelectedField = false;
        $scope.allPlayers = [];
        $scope.selectedUser = null;
        $scope.selectedOnField = null;
        $scope.editedNow = false;
        teamFormChart = null;
        $scope.onFieldUser=[];
        $scope.searchPerson = '';
        $scope.orientation = 'landscape';
        $scope.selectedField = '';
        $scope.fieldImage = '';
        stageWidth = 800;
        stageHeight = stageWidth * 0.6;
        $scope.getPlayers(function(){
            generateChart();
            callback();
        });
    };

    $rootScope.loadMeetingComposition = function(data,callback=function(){}){
        $rootScope.reinitMeetingComposition(function(){
            if(data && data.fieldImg && data.user && data.user.length > 0){
                $scope.selectField(parseUrl(data.fieldImg),function(){
                    for(let i=0;i<data.user.length;i++){
                        let user = [];

                        for(let j=0;j<$scope.allPlayers.length;j++){
                            if(parseInt($scope.allPlayers[j].usid) == data.user[i].usid){
                                user = $scope.allPlayers[j];
                                break;
                            }
                        }
                        let newUserToField = user;
                        $scope.editedNow=true;
                        $scope.selectedUser = newUserToField;
                        $scope.selectedOnField = null;

                        if(!newUserToField.image){
                            newUserToField.image = new Image();
                            newUserToField.image.onload = function(){

                                let hRatio = 45.0  / newUserToField.image.width;
                                let vRatio =  45.0 / newUserToField.image.height;
                                let ratio  = Math.min ( hRatio, vRatio );
                                let obj = new Konva.Rect({
                                    x: parseFloat(data.user[i].x),
                                    y: parseFloat(data.user[i].y),
                                    cornerRadius: 50,
                                    width: 45,
                                    height: 45,
                                    offsetX: (45 / 2.0),
                                    offsetY: (45 / 2.0),
                                    fillPatternRepeat: 'no-repeat',
                                    fillPatternScale: {x: ratio, y:ratio},
                                    fillPatternImage: newUserToField.image,
                                    name: "movementObject",
                                    id: newUserToField.usid,
                                    stat: $.extend(newUserToField,{}),
                                    textObj: null,
                                    draggable: true,
                                    stroke: "red",
                                    strokeWidth: 10
                                });

                                let textObj = new Konva.Text({
                                    x: obj.getAttr("x"),
                                    y: obj.getAttr("y") + 25,
                                    text: newUserToField.position + " " + newUserToField.userName,
                                    fontSize: 14,
                                    fill: $rootScope.settingsMeet.color
                                });

                                textObj.setOffset({
                                    x: textObj.getWidth() / 2.0
                                });

                                obj.setAttr("textObj",textObj);

                                obj.on('mouseenter', function () {
                                    mainCanvas.container().style.cursor = 'move';
                                });

                                obj.on('mouseleave', function () {
                                    mainCanvas.container().style.cursor = 'default';
                                });

                                obj.on('dragend dragmove', function () {
                                    let text = this.getAttr("textObj");
                                    text.setAttr("x",this.getAttr("x"));
                                    text.setAttr("y",this.getAttr("y")+25);
                                    text.setOffset({
                                        x: text.getWidth() / 2.0
                                    });
                                    this.setAttr("textObj",text);
                                    mainCanvas.draw();
                                });

                                obj.on('click tap mousedown dragstart', function() {
                                    let self = this;
                                    $scope.$apply(function(){
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
                                        $scope.editedNow = true;
                                        setTimeout(function(){
                                            $scope.$apply(function(){
                                                $scope.selectedOnField = self.getAttr('stat');
                                            });
                                            M.updateTextFields();
                                        },100);
                                    });
                                });

                                $scope.$apply(function(){
                                    $scope.onFieldUser.push(obj);
                                    for(let i=0;i<$scope.allPlayers.length;i++){
                                        if($scope.allPlayers[i].usid == newUserToField.usid){
                                            $scope.allPlayers.splice(i,1);
                                            break;
                                        }
                                    }
                                    $scope.editedNow = true;
                                    $scope.selectedUser = null;
                                });

                                if(data.user.length-1 == i){
                                    setTimeout(function () {
                                        generateChart();
                                        drawStage();
                                        for(let i=0;i<$scope.onFieldUser.length;i++){
                                            $scope.onFieldUser[i].setAttr('strokeWidth',0);
                                        }
                                    },200);
                                }
                            };
                            newUserToField.image.src = '/'+newUserToField.img;
                        }
                    }
                    $('.oneMeetUser').each(function() {
                        $(this).css("border-color", "");
                    });
                    for(let i=0;i<$scope.onFieldUser.length;i++){
                        $scope.onFieldUser[i].setAttr('strokeWidth',0);
                    }
                    setTimeout(function(){
                        M.updateTextFields();
                        $scope.selectedUser = null;
                        $scope.selectedOnField = null;
                        $scope.isSelectedField = true;
                    },500);
                });
            }
            callback();
        });
    };

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
        generateChart();
        $scope.selectedOnField = null;
    };

    $scope.$watch('selectedOnField.position', function (newValue, oldValue, scope) {
        if(!$scope.selectedOnField || !$scope.selectedOnField.position || !oldValue || $scope.editedNow){$scope.editedNow=false; return;}
        request.backend('changeCollection', {tmid: $scope.selectedOnField.teamMemberId, val:newValue}, function(data) {
            drawStage();
        });
    });

    $scope.$watch('selectedUser.position', function (newValue, oldValue, scope) {
        if(!$scope.selectedUser || !$scope.selectedUser.position || !oldValue || $scope.editedNow){$scope.editedNow=false; return;}
        request.backend('changeCollection', {tmid: $scope.selectedUser.teamMemberId, val:newValue}, function(data) {
        });
    });

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
            let text = element.getAttr("textObj");
            let stat = element.getAttr('stat');
            text.setAttr("text",stat.position+" "+stat.userName);
            text.setAttr("x",element.getAttr("x"));
            text.setAttr("y",element.getAttr("y")+25);
            text.setOffset({
                x: text.getWidth() / 2.0
            });
            element.setAttr("textObj",text);
            mainLayer.add(text);
        });

        mainCanvas.add(mainLayer);
        setTimeout(resize,300);
    }


    function parseUrl(url){
        return url.replace(/https?:\/\/[^\/]+/i, "");
    }

});