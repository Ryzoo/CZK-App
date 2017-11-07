app.controller('conspectusCreatorController', function($scope, auth, $rootScope, notify, request, $location, $compile) {
    $scope.selectedObjImg = null;
    $scope.selectedField = null;
    $scope.selectedArrow = null;
    $scope.arrowPointCount = 0;
    $scope.shapePointCount = 0;
    $scope.shapePoint = [];
    $scope.arrowPoint = [];
    $scope.lastSelected = null;
    $scope.fieldImage = null;
    $scope.onlyPlayer = false;
    $scope.orientation = 'landscape';
    $scope.animId = -1;
    $scope.turnOnHelperNet = false;
    $scope.turnOnHekperFullScreen = false;
    $scope.fullElement = null;
    $scope.iloscklatekPomiedzyGlownymi = 40;
    $scope.jakoscAnimacji = 40;
    $scope.iloscfps = 30;

    $("#animCreator").niceScroll({
        cursorborderradius: '0px', // Scroll cursor radius
        cursorborder: 'none',
        scrollspeed: 60, // scrolling speed
        emulatetouch: true,
        hwacceleration: true,
        smoothscroll: true,
        bouncescroll: true,
        mousescrollstep: 30, // scrolling speed with mouse wheel (pixel)
        background: 'transparent', // The scrollbar rail color
        cursorwidth: '4px', // Scroll cursor width
        cursorcolor: '#a51100'
    });

    $scope.objConfig = {
        player: {
            text: "Zawodnik",
            selectedColor: {
                background: "rgb(43,87,246)",
                border: "rgb(255,255,255)"
            },
            colors: [{
                background: "rgb(43,87,246)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(239,29,32)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(0,255,42)",
                border: "rgb(255,255,255)"
            }]
        },
        arrow: {
            text: "Strzałka",
            arrowTypes: ["Podanie", "Prowadzenie piłki", "Bieg bez piłki", "Linia pomocnicza", "Odległość zawodników", "Strzał"],
            arrowType: "Podanie"
        },
        shape: {
            text: "Pole gry",
            selectedColor: {
                border: "rgb(255, 255, 255)",
                background: "rgba(255, 255, 255, 0.4)"
            },
            colors: [{
                border: "rgb(0, 126, 255)",
                background: "rgba(0, 126, 255, 0.4)"
            }, {
                border: "rgb(202, 203, 203)",
                background: "rgba(202, 203, 203, 0.4)"
            }, {
                border: "rgb(0, 126, 255)",
                background: "rgba(0, 126, 255, 0.4)"
            }, {
                border: "rgb(144, 0, 255)",
                background: "rgba(144, 0, 255, 0.4)"
            }, {
                border: "rgb(255, 48, 0)",
                background: "rgba(255, 48, 0, 0.4)"
            }, {
                border: "rgb(255, 204, 0)",
                background: "rgba(255, 204, 0, 0.4)"
            }]
        }
    };

    $scope.cwName = '';
    $scope.arrowArrayPostionAnchor = [];
    $scope.shapeArrayPostionAnchor = [];
    $scope.gif = '';
    $scope.tags = '';
    $scope.cwFieldType = '';
    $scope.cwMaxTime = 0;
    $scope.cwMinTime = 0;
    $scope.cwMaxPerson = 0;
    $scope.cwMinPerson = 0;
    $scope.cwOps = '';
    $scope.cwWsk = '';
    $scope.showAnimCreator = false;
    $scope.selectedObjConfig = [];

    $scope.initObjList = function(){
        request.backend('getConspectAnimObj', { }, function(data) {
            $scope.$apply(function(){
                if(data.length > 0){
                    for(var i=0;i<data.length;i++){
                        var content = $compile(data[i].category)($scope);
                        $('#categoryFromItemBox').append(content);
                        if( data[i].obj){
                            var content = $compile(data[i].obj)($scope);
                            $('#itemBoxFromCat').append(content);
                        }
                    }
                }
            });
        });
    }

    if ($rootScope.idFromAnimConspectToEdit && $rootScope.idFromAnimConspectToEdit != '' && $rootScope.idFromAnimConspectToEdit != null) {
        $scope.animId = $rootScope.idFromAnimConspectToEdit;
        $rootScope.idFromAnimConspectToEdit = null;
        loadAnimation(function() {
            $scope.isSelectedField = true;
            $scope.showAnimCreator = true;
        });
    }

    $scope.mouseActionType = {
        MOVE: 0,
        OBJECT_ADD: 1,
        ARROW_ADD: 2,
        FIELD_LIST: 3,
        SHAPE_ADD: 4
    }
    $scope.arrowType = {
        FULL_2: 1,
        FULL_3: 2,
        STRIPED_2: 3,
        STRIPED_3: 4,
    };
    $scope.shapeType = {
        WHITE_3: 1,
        WHITE_4: 2,
        WHITE_5: 3,

        GREY_3: 4,
        GREY_4: 5,
        GREY_5: 6,

        BLUE_3: 7,
        BLUE_4: 8,
        BLUE_5: 9,

        PURPLE_3: 10,
        PURPLE_4: 11,
        PURPLE_5: 12,

        ORANGE_3: 13,
        ORANGE_4: 14,
        ORANGE_5: 15,

        RED_3: 16,
        RED_4: 17,
        RED_5: 18,
    };
    var stageWidth = 800;
    var stageHeight = stageWidth * 0.6;
    var selectedFrame = new Konva.Stage({
        container: 'canvasPlayerContainer',
        width: stageWidth,
        height: stageHeight
    });
    var saveNow = false;
    var customObjectPerFrame = [];
    var allObjectPerFrame = [];
    $scope.animName = '';
    allObjectPerFrame.push({
        arrow: [],
        obj: [],
        shapes: [],
        text: []
    });
    $scope.selectedShape = null;
    var currentObjPerFrame = 0;
    var allAnimFrame = [];
    var anchorHistory = [];
    var actualPlayerFrame = 0;
    var pauseAnim = false;
    var fieldLayer = null;
    var mainLayer = null;
    var curveLayer = null;
    var anchorLayer = null;
    var lineLayer = null;
    var quadCurves = [];
    var isPlayerOpen = false;

    $(window).resize(function() {
        resize();
        $(".itemBoxWithItem").first().css("top", $("#itemBox").height() + "px");
        if ($(window).width() > 1250) {
            $("#leftBlockItem").width($(window).width() - 1000);
            $(".itemBoxWithItem").first().width($(window).width() - $("#leftBlockItem").width());
        } else {
            $(".itemBoxWithItem").first().width($(window).width() - 250);
        }
    });

    $(window).on("orientationchange", function(event) {
        $scope.orientation = $(window).width() > $(window).height() ? 'sd' : 'landscape';
        resize();
    });

    $scope.actualMouseAction = $scope.mouseActionType.FIELD_LIST;

    $scope.selectArrow = function(arrowTypw) {
        $scope.actualMouseAction = $scope.mouseActionType.ARROW_ADD;
        $scope.arrowPointCount = 0;
        $scope.arrowPoint = [];
    }

    $scope.selectShape = function(shapeType) {
        $scope.selectedShape = shapeType;
        $scope.shapePointCount = 0;
        $scope.shapePoint = [];
    }

    $scope.changeCategories = function(categoryType) {
        $scope.actualMouseAction = categoryType;
        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.draggable(true);
            });
        } else {
            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.draggable(false);
            });
        }
        if ($scope.actualMouseAction == $scope.mouseActionType.ARROW_ADD) {
            $scope.selectedArrow = null;
        } else if ($scope.actualMouseAction == $scope.mouseActionType.SHAPE_ADD) {
            $scope.selectedShape = null;
        }

        $('.categories').each(function() {
            $(this).css("border-color", "");
        });
        $('.categories').eq(0).css("border-color", "#dd4213");
    }

    selectedFrame.on('contentClick contentTap', function(e) {
        clickOnContent();
    })

    $(document).off('click touch', '.categories');
    $(document).on('click touch', '.categories', function() {
        if ($(window).width() > 1250) {
            $("#leftBlockItem").width($(window).width() - 1000);
            $(".itemBoxWithItem").first().width($(window).width() - $("#leftBlockItem").width());
        } else {
            $(".itemBoxWithItem").first().width($(window).width() - 250);
        }
        $('.categories').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "#dd4213");
        $scope.selectedObjConfig = $(this).data('config') ? $scope.objConfig[$(this).data('config')] : [];

    })

    $(document).off('click touch', '.confTitle');
    $(document).on('click touch', '.confTitle', function() {
        if ($(this).hasClass("hideIs")) {
            $(this).removeClass("hideIs");
            $(this).addClass("showIs");
            $(this).next('.configleftContent').first().stop().show('slide', { direction: "up" }, 300);
        } else {
            $(this).addClass("hideIs");
            $(this).removeClass("showIs");
            $(this).next('.configleftContent').first().stop().hide('slide', { direction: "up" }, 300);
        }
    })

    $(document).off('click touch', '.categoryItems');
    $(document).on('click touch', '.categoryItems', function() {
        $scope.arrowPointCount = 0;
        $scope.arrowPoint = [];
        $('.categoryItems').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "#dd4213");

        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD) {
            $scope.selectedObjImg = new Image();
            $scope.selectedObjImg.src = $(this).find('img').attr('src');
        }
        $scope.selectedObjConfig = $(this).find('img').data('config') ? $scope.objConfig[$(this).find('img').data('config')] : [];

    })

    $scope.showObjConfig = function() {
        if ($scope.lastSelected && $scope.lastSelected != null) {
            var settingsDiv = "<div class='lastSelectedConfigContent'><p class='confInfo' >Brak dostępnych opcji konfiguracyjnych</p></div>";
            $("#lastSelectedConfig").first().html("");
            $("#lastSelectedConfig").first().append(settingsDiv);

            var config = $scope.lastSelected.getAttr("config");
            if (!config) return;
            if (config.text || config.colors || config.arrowTypes)
                $('.lastSelectedConfigContent').first().html("");

            //text
            if (config.text) {
                var textEdit = "<p class='confInfo' style='padding-bottom:0'>Tekst nad obiektem</p>";
                textEdit += "<div style='margin-top:0' class='input-field col s12'>";
                textEdit += "<input style='height: 30px; margin-bottom:0;text-align:center' class='configEditText' type='text' class='validate' value='" + config.text + "'></input>";
                textEdit += "</div>";
                $('.lastSelectedConfigContent').first().append(textEdit);
                var thisOb = $scope.lastSelected;
                $(document).off('change', '.configEditText');
                $(document).on('change', '.configEditText', function() {
                    var shapes = selectedFrame.find(".movementObject");
                    var val = $(this).val();
                    var actualConf = thisOb.getAttr("config");
                    actualConf.text = val;
                    thisOb.setAttr("config", actualConf);

                    var textObj = thisOb.getAttr("textObj");
                    textObj.setAttr("text", actualConf.text);
                    thisOb.setAttr("textObj", textObj);

                    configTextUpdate(thisOb);
                    mainLayer.draw();
                });
            }

            //createColorPicker
            if (config.colors) {
                var colorPicker = "<div class='configColorPicker'>";
                colorPicker += "<p class='confInfo'>Wersja kolorystyczna:</p>"
                for (var i = 0; i < config.colors.length; i++) {
                    colorPicker += "<div class='configColor' style='background-color:" + (config.colors[i].background) + "; border-color:" + (config.colors[i].border) + "'></div>";
                }
                colorPicker += "</div>";
                $('.lastSelectedConfigContent').first().append(colorPicker);
                $(document).off('click', '.configColor');
                $(document).on('click', '.configColor', function() {
                    var configNow = $scope.lastSelected.getAttr('config');
                    configNow.selectedColor = {
                        background: ($(this).css("background-color")),
                        border: ($(this).css("border-color"))
                    };
                    $scope.lastSelected.setAttr('config', configNow);
                    var back = $(this).css("background-color").replace(/ /g, "");
                    var border = $(this).css("border-color").replace(/ /g, "");
                    // osobne zmiany dla kazdego typu obiektu TODO
                    switch ($scope.lastSelected.getAttr("name")) {
                        case "movementObject":
                            break;
                        case "shapes":
                            $scope.lastSelected.setAttr('stroke', border);
                            $scope.lastSelected.setAttr('fill', back);
                            mainLayer.draw();
                            break;
                        default:
                            break;
                    }
                    configColorUpdate($scope.lastSelected);
                });
            }

            //arrow type
            if (config.arrowTypes) {
                var arrowPicker = "<div class='configArrowTypes'>";
                arrowPicker += "<form style='display: table;margin: 10px;'>"
                arrowPicker += "<p class='confInfo'>Typ akcji:</p>"
                for (var i = 0; i < config.arrowTypes.length; i++) {
                    if (config.arrowTypes[i] == config.arrowType) add = "checked='checked'";
                    else add = '';
                    arrowPicker += "<p><input name='arrowTypeGroup' " + add + " type='radio' id='" + config.arrowTypes[i] + "' /><label for='" + config.arrowTypes[i] + "'>" + config.arrowTypes[i] + "</label></p>";
                }
                arrowPicker += "</form>";
                arrowPicker += "</div>";
                $('.lastSelectedConfigContent').first().append(arrowPicker);
                $('input[name=arrowTypeGroup]').on('change', function() {
                    config.arrowType = $(this).attr("id");
                    $scope.lastSelected.setAttr("config", config);
                    configTextUpdate($scope.lastSelected); // to samo
                    mainLayer.draw();
                });
            }

        }
    }

    function configTextUpdate(obj) {
        var id = obj.getAttr("id");
        var config = obj.getAttr("config");
        for (var i = 0; i < allObjectPerFrame.length; i++) {
            for (var j = 0; j < allObjectPerFrame[i].obj.length; j++) {
                if (allObjectPerFrame[i].obj[j].getAttr("id") == id) {
                    allObjectPerFrame[i].obj[j].setAttr("config", config);
                    break;
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].arrow.length; j++) {
                if (allObjectPerFrame[i].arrow[j].getAttr("id") == id) {
                    allObjectPerFrame[i].arrow[j].setAttr("config", config);
                    break;
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].shapes.length; j++) {
                if (allObjectPerFrame[i].shapes[j].getAttr("id") == id) {
                    allObjectPerFrame[i].shapes[j].setAttr("config", config);
                    break;
                }
            }
        }
    }

    function configColorUpdate(obj) {
        var id = obj.getAttr("id");
        var config = obj.getAttr("config");

        for (var i = 0; i < allObjectPerFrame.length; i++) {
            for (var j = 0; j < allObjectPerFrame[i].obj.length; j++) {
                if (allObjectPerFrame[i].obj[j].getAttr("id") == id) {
                    allObjectPerFrame[i].obj[j].setAttr("config", config);
                    var src = allObjectPerFrame[i].obj[j].getAttr("image").src;
                    var srcExt = src.substring(src.length - 4, src.length);
                    var back = allObjectPerFrame[i].obj[j].getAttr("config").selectedColor.background;
                    var border = allObjectPerFrame[i].obj[j].getAttr("config").selectedColor.border;
                    src = src.split("-rgb")[0];
                    src = "" + src + "-" + back + border + srcExt;
                    src = src.replace(/ /g, "");
                    src = src.replace(/\%20/g, "");
                    var img = new Image();
                    img.onload = function() {
                        mainLayer.draw();
                    }
                    img.src = src;
                    allObjectPerFrame[i].obj[j].setAttr("image", img);
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].arrow.length; j++) {
                if (allObjectPerFrame[i].arrow[j].getAttr("id") == id) {
                    allObjectPerFrame[i].arrow[j].setAttr("config", config);
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].shapes.length; j++) {
                if (allObjectPerFrame[i].shapes[j].getAttr("id") == id) {
                    allObjectPerFrame[i].shapes[j].setAttr("config", config);
                }
            }
        }
    }

    $(document).off('click touch', '.soccerField');
    $(document).on('click touch', '.soccerField', function() {
        $('.soccerField').each(function() {
            $(this).css("transform", "");
        });
        $(this).css("transform", "scale(1, 1.2)");
        selectField($(this).find('img').attr('src'));
    })

    function selectField(src) {
        $scope.$apply(function() {
            $scope.selectedField = new Image();
            $scope.fieldImage = $scope.selectedField;
            $scope.selectedField.onload = function() {
                $scope.fieldImage = $scope.selectedField;
                drawNewStage();
            }
            $scope.actualMouseAction = $scope.mouseActionType.MOVE;
            $scope.selectedField.src = src;
        });
    }

    $(document).off('click touch', '#canActionPlay');
    $(document).on('click touch', '#canActionPlay', function() {
        showPlayer();
    });

    $(document).off('change', '#rotationConfig');
    $(document).on('change', '#rotationConfig', function() {
        rotateCurrent($(this).val());
        showInConfigObjData();
    });

    $(document).off('change', '#scaleConfig');
    $(document).on('change', '#scaleConfig', function() {
        scaleCurrent($(this).val());
        showInConfigObjData();
    });

    $(document).off('click touch', '#canActionDel');
    $(document).on('click touch', '#canActionDel', function() {
        deleteCurrent();
    });

    function deleteCurrent() {
        if ($scope.lastSelected && $scope.lastSelected != null) {
            var actual = -1;
            for (var i = 0; i < allObjectPerFrame[currentObjPerFrame].obj.length; i++) {
                var obb = allObjectPerFrame[currentObjPerFrame].obj[i].getAttr('id');
                if (obb === $scope.lastSelected.getAttr('id')) {
                    actual = i;
                    break;
                }
            }
            if (actual < 0) {
                for (var i = 0; i < allObjectPerFrame[currentObjPerFrame].arrow.length; i++) {
                    var obb = allObjectPerFrame[currentObjPerFrame].arrow[i].getAttr('id');
                    if (obb === $scope.lastSelected.getAttr('id')) {
                        actual = i;
                        break;
                    }
                }
                if (actual >= 0) allObjectPerFrame[currentObjPerFrame].arrow.splice(actual, 1);
                else {
                    for (var i = 0; i < allObjectPerFrame[currentObjPerFrame].shapes.length; i++) {
                        var obb = allObjectPerFrame[currentObjPerFrame].shapes[i].getAttr('id');
                        if (obb === $scope.lastSelected.getAttr('id')) {
                            actual = i;
                            break;
                        }
                    }
                    if (actual >= 0) allObjectPerFrame[currentObjPerFrame].shapes.splice(actual, 1);
                }
            } else {
                allObjectPerFrame[currentObjPerFrame].obj.splice(actual, 1);
            }
            deleteAnchor(currentObjPerFrame, $scope.lastSelected.getAttr('id'));
            deleteAnchor(currentObjPerFrame + 1, $scope.lastSelected.getAttr('id'));
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            var txt = $scope.lastSelected.getAttr("textObj");
            if (txt) txt.destroy();
            $scope.lastSelected.destroy();
            $scope.$apply(function() {
                $scope.lastSelected = null;
            });
            selectedFrame.draw();
        }
    }

    function rotateCurrent(rot) {
        if ($scope.lastSelected) {
            $scope.lastSelected.setAttr("rotation", rot);
            selectedFrame.draw();
        }
    }

    function scaleCurrent(scale) {
        if ($scope.lastSelected) {
            var newScale = {
                x: scale,
                y: scale
            };
            $scope.lastSelected.scale(newScale);
            selectedFrame.draw();
        }
    }

    $(document).off('click touch', '.timeElement');
    $(document).on("click touch", ".timeElement", function(e) {
        var count = $(this).index('.timeElement');
        changeFrame(count);
        drawNewStage();
    });

    $(document).off('click touch', '#addFrame');
    $(document).on("click touch", "#addFrame", function(e) {
        var count = $(".timeElement").length + 1;
        $(".timeElement").last().after("<div class='timeElement' > " + count + " </div>");
        $(".timeElement").each(function() {
            $(this).css('border-color', "");
        });
        $(".timeElement").last().css('border-color', "#dd4213");
        addFrame();
        drawNewStage();
    });

    function newId() {
        var x = (Math.floor((Math.random() * 1000000) + 1));
        var y = (Math.floor((Math.random() * 1000000) + 1));
        var z = (Math.floor((Math.random() * 1000000) + 1));
        var s = Math.random()
        var id = (x + y + z) * s;
        return Math.round(id);
    }

    function selectObjStyle(thisObj) {
        if (anchorLayer) anchorLayer.destroy();
        var shapes = selectedFrame.find(".movementObject");
        shapes.each(function(shape) {
            shape.stroke('transparent');
        });
        var shapes = selectedFrame.find(".arrow");
        shapes.each(function(shape) {
            shape.stroke('white');
        });
        var shapes = selectedFrame.find(".shapes");
        shapes.each(function(shape) {
            var fillColor = shape.getAttr('fill');
            fillColor.replace('0.4', '1');
            shape.stroke(fillColor);
        });
        if (thisObj) {
            if (thisObj.getAttr('name') != "arrow")
                thisObj.stroke('#dd4213');
            thisObj.strokeWidth(1);
            $scope.$apply(function() {
                $scope.lastSelected = thisObj;
            });
            showInConfigObjData(thisObj);
        }
        $scope.showObjConfig();
        selectedFrame.draw();
    }

    function createAnchorToArrow(x, y, arrowObj, arrowArrayIndex) {
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 5,
            stroke: '#ddd',
            fill: '#dda613',
            strokeWidth: 1,
            visible: true,
            draggable: true
        });

        // add hover styling
        anchor.on('mouseover touchstart', function() {
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(3);
            anchorLayer.draw();
        });
        anchor.on('mouseout touchend', function() {
            document.body.style.cursor = 'default';
            this.setStrokeWidth(1);
            anchorLayer.draw();

        });
        anchor.on('dragend', function() {
            $scope.arrowArrayPostionAnchor[arrowArrayIndex] = {
                x: anchor.getAttr("x"),
                y: anchor.getAttr("y")
            }
            updateArrow(arrowObj);

        });
        anchorLayer.add(anchor);

        return anchor;
    }

    function updateArrow(arrowObj) {
        arrowObj.setAttr('points', $scope.arrowArrayPostionAnchor);
        var txtObj = arrowObj.getAttr("textObj");
        txtObj.setAttr('x', $scope.arrowArrayPostionAnchor[0].x);
        txtObj.setAttr('y', $scope.arrowArrayPostionAnchor[0].y);
        if ($scope.arrowArrayPostionAnchor[0].y < $scope.arrowArrayPostionAnchor[1].y) txtObj.setAttr('offsetY', 50);
        else txtObj.setAttr('offsetY', 10);
        arrowObj.setAttr('textObj', txtObj);
        mainLayer.draw();
    }

    function createAnchorToShape(x, y, shapeObj, shapeArrayIndex) {
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 5,
            stroke: '#ddd',
            fill: '#dda613',
            strokeWidth: 1,
            visible: true,
            draggable: true
        });
        // add hover styling
        anchor.on('mouseover touchstart', function() {
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(3);
            anchorLayer.draw();
        });
        anchor.on('mouseout touchend', function() {
            document.body.style.cursor = 'default';
            this.setStrokeWidth(1);
            anchorLayer.draw();
        });
        anchor.on('dragend', function() {
            $scope.shapeArrayPostionAnchor[shapeArrayIndex] = {
                x: anchor.getAttr("x"),
                y: anchor.getAttr("y")
            }
            updateShape(shapeObj);
        });
        anchorLayer.add(anchor);
        return anchor;
    }


    function updateShape(shapeObj) {
        shapeObj.setAttr('arrowPoint', $scope.shapeArrayPostionAnchor);

        var txtObj = shapeObj.getAttr("textObj");
        txtObj.setAttr('x', $scope.shapeArrayPostionAnchor[0].x);
        txtObj.setAttr('y', $scope.shapeArrayPostionAnchor[0].y);
        if ($scope.shapeArrayPostionAnchor[0].y < $scope.shapeArrayPostionAnchor[1].y) txtObj.setAttr('offsetY', 50);
        else txtObj.setAttr('offsetY', 10);
        shapeObj.setAttr('textObj', txtObj);
        mainLayer.draw();
        mainLayer.draw();
    }

    function createTextB(x, y, text) {
        return new Konva.Text({
            x: x,
            y: y,
            offsetX: 100,
            text: text,
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: '#fff',
            padding: 20,
            width: 200,
            listening: false,
            align: 'center'
        });
    }

    function drawArrowStyle(context, obj) {
        context.beginPath();
        context.lineJoin = "round";
        context.lineCap = 'round';
        var pkt = obj.getAttr("points");
        context.lineWidth = obj.getAttr("strokeWidth");
        context.strokeStyle = obj.getAttr("stroke");
        context.moveTo(pkt[0].x, pkt[0].y);
        var poz = 90;
        var odchylenie = 10;
        var pkt1, pkt2, pkt3;

        for (var z = 0; z < pkt.length; z += 2) {
            var ile = pkt.length - z;
            if (ile >= 3) {
                pkt1 = pkt[z];
                pkt2 = pkt[z + 1];
                pkt3 = pkt[z + 2];
            } else if (ile == 2) {
                pkt1 = pkt[z];
                pkt3 = pkt[z + 1];
                pkt2 = {
                    x: (pkt1.x + pkt3.x) / 2,
                    y: (pkt1.y + pkt3.y) / 2,
                }
            } else {
                break;
            }

            var odleglosc = Math.sqrt(Math.pow(pkt2.x - pkt1.x, 2) + Math.pow(pkt2.y - pkt1.y, 2)) +
                Math.sqrt(Math.pow(pkt3.x - pkt2.x, 2) + Math.pow(pkt3.y - pkt2.y, 2));
            var iloscCzesci = odleglosc / odchylenie;
            var ubytek = (1.0 / iloscCzesci);
            var last;
            var wykonanie = 0;
            for (var i = ubytek; i <= 1 - ubytek; i += ubytek) {

                last = getPosOnCurves(pkt1, pkt2, pkt3, i);
                switch (String(obj.getAttr("config").arrowType)) {
                    case "Odległość zawodników":
                    case "Podanie":
                        var pkts = getPosOnCurves(pkt1, pkt2, pkt3, i);
                        var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, i + ubytek);
                        context.quadraticCurveTo(pkts.x, pkts.y, pktsEnd.x, pktsEnd.y);
                        break;
                    case "Strzał":
                        var pkts = getPosOnCurves(pkt1, pkt2, pkt3, i);
                        var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, i + ubytek);
                        var angle = Math.atan((pktsEnd.y - pkts.y) / (pktsEnd.x - pkts.x));
                        var newpx = parseFloat(odchylenie / 2 * (Math.cos(angle + 1.57)));
                        var newpy = parseFloat(odchylenie / 2 * (Math.sin(angle + 1.57)));
                        pkts.x += newpx;
                        pkts.y += newpy;
                        context.lineTo(pkts.x, pkts.y);
                        break;
                    case "Linia pomocnicza":
                    case "Bieg bez piłki":
                        if (wykonanie % 2 == 0) {
                            context.beginPath();
                            var pkts = getPosOnCurves(pkt1, pkt2, pkt3, i);
                            var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, i + ubytek);
                            context.quadraticCurveTo(pkts.x, pkts.y, pktsEnd.x, pktsEnd.y);
                            context.stroke();
                            context.fillStrokeShape(obj);
                            context.closePath();
                        }
                        break;
                    case "Prowadzenie piłki":
                        var pkts = getPosOnCurves(pkt1, pkt2, pkt3, i);
                        var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, i + ubytek);
                        var angle = Math.atan((pktsEnd.y - pkts.y) / (pktsEnd.x - pkts.x));
                        var newpx = parseFloat(odchylenie * (Math.cos(angle + poz)));
                        var newpy = parseFloat(odchylenie * (Math.sin(angle + poz)));
                        pkts.x += newpx;
                        pkts.y += newpy;
                        poz *= -1;
                        context.lineTo(pkts.x, pkts.y);
                        break;

                }
                wykonanie++;
            }


            if ((String(obj.getAttr("config").arrowType)) != "Linia pomocnicza")
                if ((ile - 2) <= 1) {
                    context.stroke();
                    context.fillStrokeShape(obj);
                    context.closePath();
                    context.beginPath();
                    context.moveTo(last.x, last.y);
                    var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, 1);
                    var angle = parseFloat(Math.atan((pktsEnd.y - last.y) / (pktsEnd.x - last.x)));
                    var newpx = parseFloat((3) * Math.cos(angle + parseFloat(1.57)));
                    var newpy = parseFloat((3) * Math.sin(angle + parseFloat(1.57)));
                    var newPos = {
                        x: parseFloat(last.x + newpx),
                        y: parseFloat(last.y + newpy),
                    };
                    context.lineTo(newPos.x, newPos.y);
                    context.lineTo(pktsEnd.x, pktsEnd.y);
                    var newpx = parseFloat((3) * Math.cos(angle - parseFloat(1.57)));
                    var newpy = parseFloat((3) * Math.sin(angle - parseFloat(1.57)));
                    var newPos = {
                        x: parseFloat(last.x + newpx),
                        y: parseFloat(last.y + newpy),
                    };
                    context.lineTo(newPos.x, newPos.y);
                    context.lineTo(last.x, last.y);
                    context.fillStyle = '#ffffff';
                    context.fill();

                }
        }
        context.stroke();
        context.fillStrokeShape(obj);

        if ((String(obj.getAttr("config").arrowType)) == "Odległość zawodników") {
            if (pkt.length >= 3) {
                pkt1 = pkt[0];
                pkt2 = pkt[1];
                pkt3 = pkt[2];
            } else if (pkt.length == 2) {
                pkt1 = pkt[0];
                pkt3 = pkt[1];
                pkt2 = {
                    x: (pkt1.x + pkt3.x) / 2,
                    y: (pkt1.y + pkt3.y) / 2,
                }
            }
            var odleglosc = Math.sqrt(Math.pow(pkt2.x - pkt1.x, 2) + Math.pow(pkt2.y - pkt1.y, 2)) +
                Math.sqrt(Math.pow(pkt3.x - pkt2.x, 2) + Math.pow(pkt3.y - pkt2.y, 2));
            var iloscCzesci = odleglosc / odchylenie;
            var ubytek = (1.0 / iloscCzesci);
            context.beginPath();
            var pktsStart = getPosOnCurves(pkt1, pkt2, pkt3, 0);
            context.moveTo(pktsStart.x, pktsStart.y);
            var last = getPosOnCurves(pkt1, pkt2, pkt3, ubytek);

            var angle = parseFloat(Math.atan((pktsStart.y - last.y) / (pktsStart.x - last.x)));
            var newpx = parseFloat((3) * Math.cos(angle + parseFloat(1.57)));
            var newpy = parseFloat((3) * Math.sin(angle + parseFloat(1.57)));
            var newPos = {
                x: parseFloat(last.x + newpx),
                y: parseFloat(last.y + newpy),
            };
            context.lineTo(newPos.x, newPos.y);
            var newpx = parseFloat((3) * Math.cos(angle - parseFloat(1.57)));
            var newpy = parseFloat((3) * Math.sin(angle - parseFloat(1.57)));
            var newPos = {
                x: parseFloat(last.x + newpx),
                y: parseFloat(last.y + newpy),
            };
            context.lineTo(newPos.x, newPos.y);
            context.lineTo(pktsStart.x, pktsStart.y);
            context.fillStyle = '#ffffff';
            context.fill();
        } else if ((String(obj.getAttr("config").arrowType)) == "Strzał") {
            context.stroke();
            context.fillStrokeShape(obj);
            context.beginPath();
            context.moveTo(pkt[0].x, pkt[0].y);
            for (var z = 0; z < pkt.length; z += 2) {
                var ile = pkt.length - z;
                if (ile >= 3) {
                    pkt1 = pkt[z];
                    pkt2 = pkt[z + 1];
                    pkt3 = pkt[z + 2];
                } else if (ile == 2) {
                    pkt1 = pkt[z];
                    pkt3 = pkt[z + 1];
                    pkt2 = {
                        x: (pkt1.x + pkt3.x) / 2,
                        y: (pkt1.y + pkt3.y) / 2,
                    }
                } else {
                    break;
                }
                var odleglosc = Math.sqrt(Math.pow(pkt2.x - pkt1.x, 2) + Math.pow(pkt2.y - pkt1.y, 2)) +
                    Math.sqrt(Math.pow(pkt3.x - pkt2.x, 2) + Math.pow(pkt3.y - pkt2.y, 2));
                var iloscCzesci = odleglosc / odchylenie;
                var ubytek = (1.0 / iloscCzesci);
                var last;
                var wykonanie = 0;
                for (var i = ubytek; i <= 1 - ubytek; i += ubytek) {
                    last = getPosOnCurves(pkt1, pkt2, pkt3, i);
                    var pkts = getPosOnCurves(pkt1, pkt2, pkt3, i);
                    var pktsEnd = getPosOnCurves(pkt1, pkt2, pkt3, i + ubytek);
                    var angle = Math.atan((pktsEnd.y - pkts.y) / (pktsEnd.x - pkts.x));
                    var newpx = parseFloat(odchylenie / 2 * (Math.cos(angle - 1.57)));
                    var newpy = parseFloat(odchylenie / 2 * (Math.sin(angle - 1.57)));
                    pkts.x += newpx;
                    pkts.y += newpy;
                    context.lineTo(pkts.x, pkts.y);
                    wykonanie++;
                }
            }
        }

        context.stroke();
        context.fillStrokeShape(obj);
    }

    function clickOnContent() {
        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD && $scope.selectedObjImg) {
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            var mousePos = selectedFrame.getPointerPosition();
            var scale = selectedFrame.getAttr('scaleX');
            var id = newId();

            var obj = new Konva.Image({
                x: mousePos.x / scale,
                y: mousePos.y / scale,
                offsetX: ($scope.selectedObjImg.width / 2.0),
                offsetY: ($scope.selectedObjImg.height / 2.0),
                image: $scope.selectedObjImg,
                config: $.extend(true, {}, $scope.selectedObjConfig),
                name: "movementObject",
                id: id,
                textObj: null
            });

            $scope.$apply(function() {
                $scope.lastSelected = obj;
            });

            var complexText = createTextB(mousePos.x / scale, mousePos.y / scale, $scope.selectedObjConfig && $scope.selectedObjConfig.text ? $scope.selectedObjConfig.text : "");
            mainLayer.add(complexText);
            obj.setAttr('textObj', complexText);

            obj.on('mousedown touchstart', function() {
                selectObjStyle(this);
                obj.setAttr('draggable', true);
            });
            obj.on('dragmove', function() {
                var txtObj = obj.getAttr("textObj");
                txtObj.setAttr('x', obj.getAttr("x"));
                txtObj.setAttr('y', obj.getAttr("y"));
                obj.setAttr('textObj', txtObj);
                mainLayer.draw();
            });

            obj.on('dragend', function() {
                drawBeforePositionPoint();
                updateNextFrameBeforePosition();
                rotateObject();
            });

            obj.strokeWidth(1);
            selectObjStyle(obj);

            // add the shape to the mainLayer
            mainLayer.add(obj);
            allObjectPerFrame[currentObjPerFrame].obj.push(obj);
            selectedFrame.find(".movementObject").each(function(shape) {
                shape.on('mouseenter', function() {
                    if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
                        selectedFrame.container().style.cursor = 'move';
                    }
                });
                shape.on('mouseleave', function() {
                    selectedFrame.container().style.cursor = 'default';
                });
            });
            selectedFrame.draw();

        } else if ($scope.actualMouseAction == $scope.mouseActionType.ARROW_ADD) {
            $scope.arrowPointCount++;
            var scale = selectedFrame.getAttr('scaleX');
            var mousePos = selectedFrame.getPointerPosition();
            $scope.arrowPoint.push({
                x: mousePos.x / scale,
                y: mousePos.y / scale
            });
            var countLimit = 10;

            var pointsArray = [];
            for (var index = 0; index < $scope.arrowPoint.length; index++) {
                pointsArray.push($scope.arrowPoint[index].x);
                pointsArray.push($scope.arrowPoint[index].y);
            }

            if ($scope.arrowPointCount == 2) {
                var id = newId();

                var arrow = new Konva.Shape({
                    points: $scope.arrowPoint,
                    stroke: 'white',
                    strokeWidth: 1,
                    id: id,
                    textObj: null,
                    name: 'arrow',
                    config: $.extend(true, {}, $scope.selectedObjConfig),
                    sceneFunc: function(context) {
                        drawArrowStyle(context, this);
                    }
                });

                selectObjStyle(arrow);
                anchorLayer = new Konva.Layer();
                selectedFrame.add(anchorLayer);

                var complexText = createTextB($scope.arrowPoint[0].x, $scope.arrowPoint[0].y, ($scope.selectedObjConfig && $scope.selectedObjConfig.text) ? $scope.selectedObjConfig.text : "");
                mainLayer.add(complexText);
                if (pointsArray[1] < pointsArray[3]) complexText.setAttr('offsetY', 50);
                else complexText.setAttr('offsetY', 10);
                arrow.setAttr('textObj', complexText);

                $scope.arrowArrayPostionAnchor = $scope.arrowPoint;
                for (var index = 0; index < $scope.arrowPoint.length; index++) {
                    createAnchorToArrow($scope.arrowPoint[index].x, $scope.arrowPoint[index].y, arrow, index);
                }
                selectedFrame.draw();

                arrow.on('mousedown touchstart', function() {
                    selectObjStyle(this);
                    anchorLayer = new Konva.Layer();
                    selectedFrame.add(anchorLayer);
                    $scope.arrowArrayPostionAnchor = this.getAttr('points');
                    for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                        createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, this, index);
                    }
                    selectedFrame.draw();
                });

                mainLayer.add(arrow);
                allObjectPerFrame[currentObjPerFrame].arrow.push(arrow);
                mainLayer.draw();
            } else if ($scope.arrowPointCount > 2) {
                $scope.lastSelected.setAttr("points", $scope.arrowPoint);
                if (anchorLayer != null) {
                    anchorLayer.destroy();
                    anchorLayer = null;
                }
                anchorLayer = new Konva.Layer();
                selectedFrame.add(anchorLayer);
                $scope.arrowArrayPostionAnchor = $scope.lastSelected.getAttr('points');
                for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                    createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, $scope.lastSelected, index);
                }
                selectedFrame.draw();
            }
        } else if ($scope.actualMouseAction == $scope.mouseActionType.SHAPE_ADD && $scope.selectedShape) {

            $scope.shapePointCount++;
            var scale = selectedFrame.getAttr('scaleX');
            var mousePos = selectedFrame.getPointerPosition();
            $scope.shapePoint.push({
                x: mousePos.x / scale,
                y: mousePos.y / scale
            });
            var countLimit = 0;
            var fillColor = '#ffffff';
            var strokeColor = '#ffffff';
            switch ($scope.selectedShape) {
                case $scope.shapeType.WHITE_3:
                    countLimit = 3;
                    fillColor = 'rgba(255,255,255,0.4)';
                    strokeColor = 'rgba(255,255,255,1)';
                    break;
                case $scope.shapeType.WHITE_4:
                    countLimit = 4;
                    fillColor = 'rgba(255,255,255,0.4)';
                    strokeColor = 'rgba(255,255,255,1)';
                    break;
                case $scope.shapeType.WHITE_5:
                    countLimit = 5;
                    fillColor = 'rgba(255,255,255,0.4)';
                    strokeColor = 'rgba(255,255,255,1)';
                    break;
                case $scope.shapeType.GREY_3:
                    countLimit = 3;
                    fillColor = 'rgba(217,217,217,0.4)';
                    strokeColor = 'rgba(217,217,217,1)';
                    break;
                case $scope.shapeType.GREY_4:
                    countLimit = 4;
                    fillColor = 'rgba(217,217,217,0.4)';
                    strokeColor = 'rgba(217,217,217,1)';
                    break;
                case $scope.shapeType.GREY_5:
                    countLimit = 5;
                    fillColor = 'rgba(217,217,217,0.4)';
                    strokeColor = 'rgba(217,217,217,1)';
                    break;
                case $scope.shapeType.BLUE_3:
                    countLimit = 3;
                    fillColor = 'rgba(0, 126, 255,0.4)';
                    strokeColor = 'rgba(0, 126, 255,1)';
                    break;
                case $scope.shapeType.BLUE_4:
                    countLimit = 4;
                    fillColor = 'rgba(0, 126, 255,0.4)';
                    strokeColor = 'rgba(0, 126, 255,1)';
                    break;
                case $scope.shapeType.BLUE_5:
                    countLimit = 5;
                    fillColor = 'rgba(0, 126, 255,0.4)';
                    strokeColor = 'rgba(0, 126, 255,1)';
                    break;
                case $scope.shapeType.PURPLE_3:
                    countLimit = 3;
                    fillColor = 'rgba(144, 0, 255,0.4)';
                    strokeColor = 'rgba(144, 0, 255,1)';
                    break;
                case $scope.shapeType.PURPLE_4:
                    countLimit = 4;
                    fillColor = 'rgba(144, 0, 255,0.4)';
                    strokeColor = 'rgba(144, 0, 255,1)';
                    break;
                case $scope.shapeType.PURPLE_5:
                    countLimit = 5;
                    fillColor = 'rgba(144, 0, 255,0.4)';
                    strokeColor = 'rgba(144, 0, 255,1)';
                    break;
                case $scope.shapeType.ORANGE_3:
                    countLimit = 3;
                    fillColor = 'rgba(255, 204, 0,0.4)';
                    strokeColor = 'rgba(255, 204, 0,1)';
                    break;
                case $scope.shapeType.ORANGE_4:
                    countLimit = 4;
                    fillColor = 'rgba(255, 204, 0,0.4)';
                    strokeColor = 'rgba(255, 204, 0,1)';
                    break;
                case $scope.shapeType.ORANGE_5:
                    countLimit = 5;
                    fillColor = 'rgba(255, 204, 0,0.4)';
                    strokeColor = 'rgba(255, 204, 0,1)';
                    break;
                case $scope.shapeType.RED_3:
                    countLimit = 3;
                    fillColor = 'rgba(247, 49, 3,0.4)';
                    strokeColor = 'rgba(247, 49, 3,1)';
                    break;
                case $scope.shapeType.RED_4:
                    countLimit = 4;
                    fillColor = 'rgba(247, 49, 3,0.4)';
                    strokeColor = 'rgba(247, 49, 3,1)';
                    break;
                case $scope.shapeType.RED_5:
                    countLimit = 5;
                    fillColor = 'rgba(247, 49, 3,0.4)';
                    strokeColor = 'rgba(247, 49, 3,1)';
                    break;
            }

            if ($scope.shapePointCount >= countLimit) {
                var shapPointArr = $scope.shapePoint;
                var id = newId();
                var triangle = new Konva.Shape({
                    arrowPoint: shapPointArr,
                    sceneFunc: function(context) {
                        context.beginPath();
                        context.moveTo(shapPointArr[0].x, shapPointArr[0].y);
                        for (var i = 1; i < shapPointArr.length; i++) {
                            context.lineTo(shapPointArr[i].x, shapPointArr[i].y);
                        }
                        context.closePath();
                        context.fillStrokeShape(this);
                    },
                    name: "shapes",
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: 2,
                    id: id,
                    textObj: null,
                    config: $.extend(true, {}, $scope.selectedObjConfig)
                });
                selectObjStyle(triangle);

                var complexText = createTextB(shapPointArr[0].x, shapPointArr[0].y, ($scope.selectedObjConfig && $scope.selectedObjConfig.text) ? $scope.selectedObjConfig.text : "");
                mainLayer.add(complexText);
                if (shapPointArr[0].y < shapPointArr[1].y) complexText.setAttr('offsetY', 50);
                else complexText.setAttr('offsetY', 10);
                triangle.setAttr('textObj', complexText);

                // add the shape to the layer
                mainLayer.add(triangle);
                allObjectPerFrame[currentObjPerFrame].shapes.push(triangle);

                if (anchorLayer != null) {
                    anchorLayer.destroy();
                    anchorLayer = null;
                }
                anchorLayer = new Konva.Layer();
                selectedFrame.add(anchorLayer);

                $scope.shapeArrayPostionAnchor = $scope.shapePoint;
                for (var index = 0; index < $scope.shapePoint.length; index++) {
                    createAnchorToShape($scope.shapePoint[index].x, $scope.shapePoint[index].y, triangle, index);
                }

                triangle.on('mousedown touchstart', function() {
                    selectObjStyle(this);
                    if (anchorLayer != null) {
                        anchorLayer.destroy();
                        anchorLayer = null;
                    }
                    anchorLayer = new Konva.Layer();
                    selectedFrame.add(anchorLayer);
                    $scope.shapeArrayPostionAnchor = this.getAttr('arrowPoint');
                    for (var index = 0; index < $scope.shapeArrayPostionAnchor.length; index++) {
                        createAnchorToShape($scope.shapeArrayPostionAnchor[index].x, $scope.shapeArrayPostionAnchor[index].y, this, index);
                    }
                    selectedFrame.draw();
                });

                $scope.shapePointCount = 0;
                $scope.shapePoint = [];
                anchorLayer.draw();
                mainLayer.draw();
                mainLayer.draw();
            }
        } else if ($scope.actualMouseAction == $scope.mouseActionType.TEXT_ADD) {
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            var mousePos = selectedFrame.getPointerPosition();
            var scale = selectedFrame.getAttr('scaleX');
            var id = newId();
            var obj = new Konva.Text({
                x: mousePos.x / scale,
                y: mousePos.y / scale,
                offsetX: 140,
                offsetY: 20,
                text: 'Kliknij dwa razy, aby edytować',
                fontSize: 20,
                fill: 'white',
                align: 'center',
                name: "movementObject",
                id: id
            });
            obj.on('mousedown touchstart', function() {
                selectObjStyle(this);
            });

            selectObjStyle(obj);

            // add the shape to the mainLayer
            mainLayer.add(obj);
            allObjectPerFrame[currentObjPerFrame].text.push(obj);
            selectedFrame.draw();

            obj.on('dblclick', function(){
                // create textarea over canvas with absolute position
                // first we need to find its positon
                var textPosition = obj.getAbsolutePosition();
                var stageBox = selectedFrame.getContainer().getBoundingClientRect();
                var areaPosition = {
                    x: textPosition.x + stageBox.left,
                    y: textPosition.y + stageBox.top
                };
                // create textarea and style it
                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textarea.value = obj.text();
                textarea.style.position = 'absolute';
                textarea.style.top = areaPosition.y + 5 + 'px';
                textarea.style.left = areaPosition.x - 100 + 'px';
                textarea.style.zIndex = '300';
                textarea.style.width = "200px";
                textarea.style.color = "white";
                textarea.style.backogrund = "rgba(0, 0, 0, 0.34)";
                textarea.focus();
                textarea.addEventListener('keydown', function(e) {
                    // hide on enter
                    if (e.keyCode === 13) {
                        obj.text(textarea.value);
                        selectedFrame.draw();
                        document.body.removeChild(textarea);
                    }
                });
            })
            $scope.changeCategories($scope.mouseActionType.MOVE);
        }
    }


    function createArrowObjFromOther(other, isNoObj = false) {
        var arrow;
        if (!isNoObj) {
            var complexText = new Konva.Text({
                x: other.getAttr("points")[0].x,
                y: other.getAttr("points")[0].y,
                offsetX: 100,
                text: (other.getAttr("config") && other.getAttr("config").text) ? other.getAttr("config").text : "",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                width: 200,
                align: 'center'
            });
            if (other.getAttr("points")[1] < other.getAttr("points")[3]) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            arrow = new Konva.Shape({
                points: other.getAttr("points"),
                stroke: other.getAttr("stroke"),
                strokeWidth: other.getAttr("strokeWidth"),
                sceneFunc: function(context) {
                    drawArrowStyle(context, this);
                },
                id: other.getAttr("id"),
                textObj: complexText,
                name: 'arrow',
                config: other.getAttr("config")
            });
        } else {
            var complexText = new Konva.Text({
                x: other.attrs.points[0].x,
                y: other.attrs.points[0].y,
                offsetX: 100,
                offsetY: other.attrs.offsetY,
                text: (other.attrs.config && other.attrs.config.text) ? other.attrs.config.text : "",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                align: 'center'
            });
            if (other.attrs.points[1] < other.attrs.points[3]) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            arrow = new Konva.Shape({
                points: other.attrs.points,
                stroke: other.attrs.stroke,
                strokeWidth: other.attrs.strokeWidth,
                sceneFunc: function(context) {
                    drawArrowStyle(context, this);
                },
                id: other.attrs.id,
                textObj: complexText,
                name: 'arrow',
                config: other.attrs.config
            });
        }
        if (mainLayer) mainLayer.add(complexText);
        arrow.off('mousedown touchstart');
        arrow.on('mousedown touchstart', function() {
            selectObjStyle(this);
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            $scope.arrowArrayPostionAnchor = arrow.getAttr('points');
            for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, arrow, index);
            }
            selectedFrame.draw();
        });
        return arrow;
    }

    function createObjFromOther(other, isNoObj = false) {
        var obj;

        if (!isNoObj) {
            var complexText = new Konva.Text({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
                offsetX: 100,
                text: other.getAttr("config") && other.getAttr("config").text ? other.getAttr("config").text : " ",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                width: 200,
                listening: false,
                align: 'center'
            });
            obj = new Konva.Image({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
                offsetX: other.getAttr("offsetX"),
                offsetY: other.getAttr("offsetY"),
                rotation: other.getAttr("rotation"),
                image: other.getAttr("image"),
                name: other.getAttr("name"),
                scale: other.getAttr("scale"),
                id: other.getAttr("id"),
                config: other.getAttr("config"),
                textObj: complexText
            });
        } else {
            var newImg = new Image();
            newImg.src = other.attrs.image;
            var complexText = new Konva.Text({
                x: other.attrs.x,
                y: other.attrs.y,
                offsetX: 100,
                offsetX: other.attrs.offsetX,
                offsetY: other.attrs.offsetY,
                text: (other.attrs.config && other.attrs.config.text) ? other.attrs.config.text : "",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                listening: false,
                align: 'center'
            });
            obj = new Konva.Image({
                x: other.attrs.x,
                y: other.attrs.y,
                offsetX: other.attrs.offsetX,
                offsetY: other.attrs.offsetY,
                rotation: other.attrs.rotation,
                image: newImg,
                scale: {
                    x: other.attrs.scaleX,
                    y: other.attrs.scaleY
                },
                name: other.attrs.name,
                id: other.attrs.id,
                config: other.attrs.config,
                textObj: complexText
            });
        }
        if (mainLayer) mainLayer.add(complexText);
        obj.stroke('transparent');
        obj.strokeWidth(1);
        obj.off('mousedown touchstart');
        obj.on('mousedown touchstart', function() {
            selectObjStyle(this);
        });
        obj.off('mousemove');
        obj.on('dragmove', function() {
            var txtObj = obj.getAttr("textObj");
            txtObj.setAttr('x', obj.getAttr("x"));
            txtObj.setAttr('y', obj.getAttr("y"));
            obj.setAttr('textObj', txtObj);
            mainLayer.draw();
        });

        obj.off('dragend');
        obj.on('dragend', function() {
            drawBeforePositionPoint();
            updateNextFrameBeforePosition();
            rotateObject();
        });
        return obj;
    }

    function createShapeObjFromOther(other, isNoObj = false) {
        var shape;
        if (!isNoObj) {
            var complexText = new Konva.Text({
                x: other.getAttr("arrowPoint")[0].x,
                y: other.getAttr("arrowPoint")[0].y,
                offsetX: 100,
                text: (other.getAttr("config") && other.getAttr("config").text) ? other.getAttr("config").text : "",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                width: 200,
                listening: false,
                align: 'center'
            });
            if (other.getAttr("arrowPoint")[0].y < other.getAttr("arrowPoint")[1].y) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            shape = new Konva.Shape({
                arrowPoint: other.getAttr("arrowPoint"),
                sceneFunc: function(context) {
                    context.beginPath();
                    context.moveTo(other.getAttr("arrowPoint")[0].x, other.getAttr("arrowPoint")[0].y);
                    for (var i = 1; i < other.getAttr("arrowPoint").length; i++) {
                        context.lineTo(other.getAttr("arrowPoint")[i].x, other.getAttr("arrowPoint")[i].y);
                    }
                    context.closePath();
                    context.fillStrokeShape(this);
                },
                name: other.getAttr("name"),
                fill: other.getAttr("fill"),
                stroke: other.getAttr("stroke"),
                scale: other.getAttr("scale"),
                strokeWidth: other.getAttr("strokeWidth"),
                id: other.getAttr("id"),
                config: other.getAttr("config"),
                textObj: complexText
            });
        } else {
            var complexText = new Konva.Text({
                x: other.attrs.arrowPoint[0].x,
                y: other.attrs.arrowPoint[0].y,
                offsetX: 100,
                offsetY: other.attrs.offsetY,
                text: (other.attrs.config && other.attrs.config.text) ? other.attrs.config.text : "",
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#fff',
                padding: 20,
                listening: false,
                align: 'center'
            });
            if (other.attrs.arrowPoint[0].y < other.attrs.arrowPoint[1].y) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            shape = new Konva.Shape({
                arrowPoint: other.attrs.arrowPoint,
                sceneFunc: function(context) {
                    context.beginPath();
                    context.moveTo(other.attrs.arrowPoint[0].x, other.attrs.arrowPoint[0].y);
                    for (var i = 1; i < other.attrs.arrowPoint.length; i++) {
                        context.lineTo(other.attrs.arrowPoint[i].x, other.attrs.arrowPoint[i].y);
                    }
                    context.closePath();
                    context.fillStrokeShape(this);
                },
                name: other.attrs.name,
                fill: other.attrs.fill,
                stroke: other.attrs.stroke,
                scale: {
                    x: other.attrs.scaleX,
                    y: other.attrs.scaleY
                },
                strokeWidth: other.attrs.strokeWidth,
                id: other.attrs.id,
                config: other.attrs.config,
                textObj: complexText
            });
        }
        if (mainLayer) mainLayer.add(complexText);
        shape.off('mousedown touchstart');
        shape.on('mousedown touchstart', function() {
            selectObjStyle(this);
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            $scope.shapeArrayPostionAnchor = this.getAttr('arrowPoint');
            for (var index = 0; index < $scope.shapeArrayPostionAnchor.length; index++) {
                createAnchorToShape($scope.shapeArrayPostionAnchor[index].x, $scope.shapeArrayPostionAnchor[index].y, this, index);
            }
            selectedFrame.draw();
        });
        return shape;
    }

    function createTextFromOther(other, isNoObj = false) {
        var obj;
        if (!isNoObj) {
            obj = new Konva.Text({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
                offsetX: other.getAttr("offsetX"),
                offsetY: other.getAttr("offsetY"),
                rotation: other.getAttr("rotation"),
                fontSize: other.getAttr("fontSize"),
                text: other.getAttr("text"),
                name: other.getAttr("name"),
                scale: other.getAttr("scale"),
                fill: other.getAttr("fill"),
                align: other.getAttr("align"),
                id: other.getAttr("id"),
                config: other.getAttr("config")
            });
        } else {
            obj = new Konva.Text({
                x: other.attrs.x,
                y: other.attrs.y,
                offsetX: other.attrs.offsetX,
                offsetY: other.attrs.offsetY,
                rotation: other.attrs.rotation,
                fontSize: other.attrs.fontSize,
                text: other.attrs.text,
                fill: other.attrs.fill,
                align: other.attrs.align,
                scale: {
                    x: other.attrs.scaleX,
                    y: other.attrs.scaleY
                },
                name: other.attrs.name,
                id: other.attrs.id,
                config: other.attrs.config
            });
        }
        obj.off('mousedown touchstart');
        obj.on('mousedown touchstart', function() {
            selectObjStyle(this);
        });
        selectObjStyle(obj);
        obj.off('dblclick');
        obj.on('dblclick', () => {
            // create textarea over canvas with absolute position
            // first we need to find its positon
            var textPosition = obj.getAbsolutePosition();
            var stageBox = selectedFrame.getContainer().getBoundingClientRect();
            var areaPosition = {
                x: textPosition.x + stageBox.left,
                y: textPosition.y + stageBox.top
            };
            // create textarea and style it
            var textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = obj.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 5 + 'px';
            textarea.style.left = areaPosition.x - 100 + 'px';
            textarea.style.zIndex = '300';
            textarea.style.width = "200px";
            textarea.style.color = "white";
            textarea.style.backogrund = "rgba(0, 0, 0, 0.34)";
            textarea.focus();
            textarea.addEventListener('keydown', function(e) {
                // hide on enter
                if (e.keyCode === 13) {
                    obj.text(textarea.value);
                    selectedFrame.draw();
                    document.body.removeChild(textarea);
                }
            });
        })
        return obj;
    }

    function addFrame() {
        selectObjStyle(null);
        allObjectPerFrame.push({ arrow: [], obj: [], shapes: [], text: [] });
        var beforeFrameNumber = currentObjPerFrame;
        currentObjPerFrame = allObjectPerFrame.length - 1;

        for (var i = 0; i < allObjectPerFrame[beforeFrameNumber].arrow.length; i++) {
            var arrowBef = allObjectPerFrame[beforeFrameNumber].arrow[i];
            var obj = createArrowObjFromOther(arrowBef);
            allObjectPerFrame[currentObjPerFrame].arrow.push(obj);
        }
        for (var i = 0; i < allObjectPerFrame[beforeFrameNumber].obj.length; i++) {
            var objBef = allObjectPerFrame[beforeFrameNumber].obj[i];
            var obj = createObjFromOther(objBef);
            allObjectPerFrame[currentObjPerFrame].obj.push(obj);
        }
        for (var i = 0; i < allObjectPerFrame[beforeFrameNumber].shapes.length; i++) {
            var objBef = allObjectPerFrame[beforeFrameNumber].shapes[i];
            var obj = createShapeObjFromOther(objBef);
            allObjectPerFrame[currentObjPerFrame].shapes.push(obj);
        }
        for (var i = 0; i < allObjectPerFrame[beforeFrameNumber].text.length; i++) {
            var objBef = allObjectPerFrame[beforeFrameNumber].text[i];
            var obj = createTextFromOther(objBef);
            allObjectPerFrame[currentObjPerFrame].text.push(obj);
        }

        $scope.changeCategories($scope.mouseActionType.MOVE);
    }


    function changeFrame(count, frameContener = allObjectPerFrame) {
        currentObjPerFrame = count;
        updateNextFrameBeforePosition(frameContener);
        $(".timeElement").each(function() {
            $(this).css('border-color', "");
        });
        $(".timeElement").eq(count).css('border-color', "#dd4213");
    }

    function updateNextFrameBeforePosition(frameContener = allObjectPerFrame) {
        if (frameContener != allObjectPerFrame) return;
        for (var i = 0; i < frameContener[currentObjPerFrame].obj.length; i++) {
            var objBef = frameContener[currentObjPerFrame].obj[i];
            var objId = objBef.getAttr("id");
            if (isAnchorHistoryFor(currentObjPerFrame + 1, objId)) {
                getAnchorHistoryFor(currentObjPerFrame + 1, objId).start = {
                    x: objBef.getAttr("x"),
                    y: objBef.getAttr("y"),
                };
            }
        }
    }

    function isAnchorHistoryFor(frame, id) {
        for (var i = 0; i < anchorHistory.length; i++) {
            if (anchorHistory[i].frame == frame) {
                for (var x = 0; x < anchorHistory[i].history.length; x++) {
                    if (anchorHistory[i].history[x].id == id) {
                        return true;
                    }
                }
                return false;
            }
        }
        return false;
    }

    function getAnchorHistoryFor(frame, id) {
        for (var i = 0; i < anchorHistory.length; i++) {
            if (anchorHistory[i].frame == frame) {
                for (var x = 0; x < anchorHistory[i].history.length; x++) {
                    if (anchorHistory[i].history[x].id == id) {
                        return anchorHistory[i].history[x].anchor;
                    }
                }
            }
        }
    }

    function saveToAnchorHistory(frame, id, anchor) {
        for (var i = 0; i < anchorHistory.length; i++) {
            if (anchorHistory[i].frame == frame) {
                for (var x = 0; x < anchorHistory[i].history.length; x++) {
                    if (anchorHistory[i].history[x].id == id) {
                        anchorHistory[i].history[x].anchor = anchor;
                        return true;
                    }
                }
                anchorHistory[i].history.push({
                    id: id,
                    anchor: anchor
                });

                return true;
            }
        }
        anchorHistory.push({
            frame: frame,
            history: [{
                id: id,
                anchor: anchor
            }]
        });
    }

    function deleteAnchor(frame, id) {
        for (var i = 0; i < anchorHistory.length; i++) {
            if (anchorHistory[i].frame == frame) {
                for (var x = 0; x < anchorHistory[i].history.length; x++) {
                    if (anchorHistory[i].history[x].id == id) {
                        anchorHistory[i].history[x].id = null;
                        anchorHistory[i].history[x].anchor = null;
                        anchorHistory[i].history.splice(x, 1);
                        return;
                    }
                }
            }
        }
    }

    function drawNewStage(container = 'canvasContainer', frameContainer = allObjectPerFrame) {
        if ($scope.onlyPlayer) container = 'canvasPlayerContainer';
        if (mainLayer != null) {
            selectedFrame.off('contentClick contentTap');
            selectedFrame.destroy();
            delete selectedFrame;
            selectedFrame = null;
        }
        selectedFrame = new Konva.Stage({
            container: container,
            width: stageWidth,
            height: stageHeight
        });

        if (curveLayer != null) {
            curveLayer.destroy();
            curveLayer = null;
        }
        curveLayer = new Konva.Layer();
        if (lineLayer != null) {
            lineLayer.destroy();
            lineLayer = null;
        }
        lineLayer = new Konva.Layer();
        if (anchorLayer != null) {
            anchorLayer.destroy();
            anchorLayer = null;
        }
        anchorLayer = new Konva.Layer();

        if (mainLayer != null) {
            mainLayer.destroy();
            mainLayer = null;
        }
        mainLayer = new Konva.Layer();

        if (fieldLayer != null) {
            fieldLayer.destroy();
            fieldLayer = null;
        }
        fieldLayer = new Konva.Layer();
        var conImg = new Konva.Image({
            x: 0,
            y: 0,
            image: $scope.fieldImage,
            width: selectedFrame.getWidth(),
            height: selectedFrame.getHeight(),
            id: "field"
        });
        mainLayer.add(conImg);

        for (var i = 0; i < frameContainer[currentObjPerFrame].shapes.length; i++) {
            var obb = frameContainer[currentObjPerFrame].shapes[i];
            var obj = createShapeObjFromOther(obb);
            frameContainer[currentObjPerFrame].shapes[i] = obj;
            mainLayer.add(obj);
        }

        for (var i = 0; i < frameContainer[currentObjPerFrame].obj.length; i++) {
            var obb = frameContainer[currentObjPerFrame].obj[i];
            var obj = createObjFromOther(obb);
            frameContainer[currentObjPerFrame].obj[i] = obj;
            mainLayer.add(frameContainer[currentObjPerFrame].obj[i]);
        }

        for (var i = 0; i < frameContainer[currentObjPerFrame].arrow.length; i++) {
            var obb = frameContainer[currentObjPerFrame].arrow[i];
            var obj = createArrowObjFromOther(obb);
            frameContainer[currentObjPerFrame].arrow[i] = obj;
            mainLayer.add(obj);
        }

        for (var i = 0; i < frameContainer[currentObjPerFrame].text.length; i++) {
            var obb = frameContainer[currentObjPerFrame].text[i];
            var obj = createTextFromOther(obb);
            frameContainer[currentObjPerFrame].text[i] = obj;
            mainLayer.add(obj);
        }

        selectedFrame.add(mainLayer);

        $scope.selectedObjImg = null;
        $scope.selectedArrow = null;
        $scope.arrowPointCount = 0;
        $scope.arrowPoint = [];
        $scope.shapePointCount = 0;
        $scope.shapePoint = [];
        $scope.lastSelected = null;
        $scope.actualMouseAction = $scope.mouseActionType.MOVE;
        $(".categories").each(function() {
            $(this).css('border-color', "");
        });
        $(".categories").eq(0).css('border-color', "#dd4213");

        if (container == 'canvasContainer') {

            selectedFrame.add(lineLayer);
            selectedFrame.add(curveLayer);
            selectedFrame.add(anchorLayer);
            selectedFrame.on('contentClick contentTap', function(e) {
                clickOnContent();
            });

            selectedFrame.find(".movementObject").each(function(shape) {
                shape.on('mouseenter', function() {
                    if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
                        selectedFrame.container().style.cursor = 'move';
                    }
                });
                shape.on('mouseleave', function() {
                    selectedFrame.container().style.cursor = 'default';
                });
            });

            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.draggable(true);
            });
        }
        checkHelperNet();
        resize();
    }

    function checkHelperNet() {
        if ($scope.turnOnHelperNet) {
            var helperLayer = new Konva.Layer();
            var canvasWidth = selectedFrame.getAttr('width');
            var canvasHeight = selectedFrame.getAttr('height');
            var pos = canvasWidth / 16;

            while (pos < canvasWidth) {
                var whiteLine = new Konva.Line({
                    points: [pos, 0, pos, canvasHeight],
                    stroke: 'white',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                helperLayer.add(whiteLine);
                pos += canvasWidth / 16;
            }
            pos = canvasHeight / 10;
            while (pos < canvasHeight) {
                var whiteLine = new Konva.Line({
                    points: [0, pos, canvasWidth, pos],
                    stroke: 'white',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                helperLayer.add(whiteLine);
                pos += canvasHeight / 10;
            }
            selectedFrame.add(helperLayer);
        }
    }

    function goToFull() {
        $scope.fullElement = document.getElementById("animCreator");
        if ($scope.fullElement.requestFullScreen) {
            $scope.fullElement.requestFullscreen();
        } else if ($scope.fullElement.webkitRequestFullScreen) {
            $scope.fullElement.webkitRequestFullScreen();
        } else if ($scope.fullElement.mozRequestFullScreen) {
            $scope.fullElement.mozRequestFullScreen();
        }
    }

    $scope.endFromFull = function(endFromCreator = true) {
        if (endFromCreator) $scope.showAnimCreator = false;
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }

    function resize() {
        var container = isPlayerOpen || $scope.onlyPlayer ? 'canvasPlayerContainer' : 'canvasContainer';
        if ($scope.onlyPlayer) container = 'canvasPlayerContainer';
        container = document.querySelector('#' + container);
        if (!container) return;

        var containerWidth = container.offsetWidth;

        $scope.orientation = $(window).width() > $(window).height() ? 'sd' : 'landscape';
        if ($scope.orientation == 'sd' && isPlayerOpen) {
            var containerHeight = container.offsetHeight;
            containerWidth = containerHeight * 100 / 60;
        }
        var scale = containerWidth / stageWidth;

        selectedFrame.width(stageWidth * scale);
        selectedFrame.height(stageHeight * scale);
        selectedFrame.scale({ x: scale, y: scale });
        selectedFrame.draw();
    }

    function drawBeforePositionPoint() {
        if (currentObjPerFrame <= 0 || $scope.lastSelected == null ||
            $scope.lastSelected.getAttr('name') !== 'movementObject') return;

        var id = $scope.lastSelected.getAttr('id');
        var lastObj = null;

        for (var i = 0; i < allObjectPerFrame[currentObjPerFrame - 1].obj.length; i++) {
            var obb = allObjectPerFrame[currentObjPerFrame - 1].obj[i].getAttr("id");
            if (obb == id) {
                lastObj = allObjectPerFrame[currentObjPerFrame - 1].obj[i];
                break;
            }
        }
        lineLayer.destroy();
        anchorLayer.destroy();
        curveLayer.destroy();
        lineLayer = new Konva.Layer();
        anchorLayer = new Konva.Layer();
        curveLayer = new Konva.Layer();
        selectedFrame.add(lineLayer);
        selectedFrame.add(curveLayer);
        selectedFrame.add(anchorLayer);

        anchorLayer.off('beforeDraw');
        anchorLayer.on('beforeDraw', function() {
            drawCurves();
            updateDottedLines();
        });

        if (lastObj !== null) {
            var quadLine = new Konva.Line({
                dash: [10, 10, 0, 10],
                strokeWidth: 3,
                stroke: 'black',
                lineCap: 'round',
                id: 'quadLine',
                opacity: 0.3,
                points: [0, 0]
            });
            lineLayer.add(quadLine);

            if (isAnchorHistoryFor(currentObjPerFrame, id)) {
                var history = getAnchorHistoryFor(currentObjPerFrame, id);
                var newo = {
                    x: $scope.lastSelected.getAttr("x"),
                    y: $scope.lastSelected.getAttr("y")
                };
                quadCurves = {
                    start: createAnchorPoint(history.start.x, history.start.y, 'start'),
                    control: createAnchorPoint(history.control.x, history.control.y, 'ster'),
                    end: createAnchorPoint(newo.x, newo.y, 'end')
                };
            } else {
                var last = {
                    x: lastObj.getAttr("x"),
                    y: lastObj.getAttr("y")
                };
                var newo = {
                    x: $scope.lastSelected.getAttr("x"),
                    y: $scope.lastSelected.getAttr("y")
                };
                quadCurves = {
                    start: createAnchorPoint(last.x, last.y, 'start'),
                    control: createAnchorPoint(Math.min(last.x, newo.x) + Math.abs(last.x - newo.x) / 2.0, Math.min(last.y, newo.y) + Math.abs(last.y - newo.y) / 2.0, 'ster'),
                    end: createAnchorPoint(newo.x, newo.y, 'end')
                };
            }

            saveAnchorPoint(currentObjPerFrame, id, quadCurves);

            if (quadCurves.start.getAttr("x") == quadCurves.end.getAttr("x") &&
                quadCurves.start.getAttr("y") == quadCurves.end.getAttr("y")) return;

            drawCurves();
            updateDottedLines();
            rotateObject();
            selectedFrame.draw();
        } else {
            quadCurves = null;
        }
    }

    function createAnchorPoint(x, y, type) {
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: (type == 'end' || type == 'start') ? 5 : 8,
            stroke: (type == 'ster') ? '#ddd' : '#dd4213',
            fill: (type == 'ster') ? '#dda613' : '#dd4213',
            strokeWidth: 1,
            visible: (type == 'ster' || type == 'start'),
            draggable: (type == 'ster')
        });
        // add hover styling
        anchor.on('mouseover touchstart', function() {
            if (type == 'ster') {
                document.body.style.cursor = 'pointer';
                this.setStrokeWidth(3);
                anchorLayer.draw();
            }
        });
        anchor.on('mouseout touchend', function() {
            if (type == 'ster') {
                document.body.style.cursor = 'default';
                this.setStrokeWidth(1);
                anchorLayer.draw();
            }
        });
        anchor.on('dragend', function() {
            if (type == 'ster') {
                saveAnchorPoint();
                drawCurves();
                updateDottedLines();
                rotateObject();
            }
        });
        anchorLayer.add(anchor);
        return anchor;
    }

    function drawCurves() {
        if (quadCurves) {
            var context = curveLayer.getContext();
            context.clear();
            context.beginPath();
            var scale = selectedFrame.getAttr('scaleX');
            context.moveTo(quadCurves.start.getAttr("x") * scale, quadCurves.start.getAttr("y") * scale);
            context.quadraticCurveTo(quadCurves.control.getAttr("x") * scale, quadCurves.control.getAttr("y") * scale, quadCurves.end.getAttr("x") * scale, quadCurves.end.getAttr("y") * scale);
            context.setAttr('strokeStyle', 'black');
            context.setAttr('lineWidth', 2);
            context.stroke();
            context.setAttr('strokeStyle', 'white');

        }
    }

    function updateDottedLines() {
        if (quadCurves) {
            var q = quadCurves;
            var quadLine = lineLayer.get('#quadLine')[0];
            quadLine.setPoints([q.start.attrs.x, q.start.attrs.y, q.control.attrs.x, q.control.attrs.y, q.end.attrs.x, q.end.attrs.y]);
            lineLayer.draw();
        }
    }

    function saveAnchorPoint() {
        if ($scope.lastSelected == null) return;
        if (quadCurves.start.getAttr("x") == quadCurves.end.getAttr("x") &&
            quadCurves.start.getAttr("y") == quadCurves.end.getAttr("y")) return;

        var anchorToSave = {
            start: {
                x: quadCurves.start.getAttr("x"),
                y: quadCurves.start.getAttr("y"),
            },
            control: {
                x: quadCurves.control.getAttr("x"),
                y: quadCurves.control.getAttr("y"),
            },
            end: {
                x: $scope.lastSelected.getAttr("x"),
                y: $scope.lastSelected.getAttr("y"),
            }
        };

        saveToAnchorHistory(currentObjPerFrame, $scope.lastSelected.getAttr("id"), anchorToSave);
        rotateObject();

        selectedFrame.draw();
    }

    function removeAnchor() {
        deleteAnchor(currentObjPerFrame, $scope.lastSelected.getAttr("id"));
    }

    function getPosOnCurves(p1, p2, p3, percent) {
        t = percent;
        x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * p2.x + t * t * p3.x;
        y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * p2.y + t * t * p3.y;
        return {
            x: x,
            y: y
        }
    }

    function rotateObject(id = null, obj = $scope.lastSelected) {
        if (id == null) {
            if ($scope.lastSelected && $scope.lastSelected != null) {
                id = $scope.lastSelected.getAttr("id");
            } else {
                return;
            }
        }
        if (isAnchorHistoryFor(currentObjPerFrame, id)) {
            var actual = getAnchorHistoryFor(currentObjPerFrame, id);
            var p1 = getPosOnCurves(actual.start, actual.control, actual.end, 0.9);
            var p2 = getPosOnCurves(actual.start, actual.control, actual.end, 1);
            var rotOffset = 0;
            if (p1.x > p2.x) rotOffset = 180;
            var a = (p2.y - p1.y) / (p2.x - p1.x);
            var degree = ((Math.atan(a) * 180) / Math.PI);
            obj.rotation(degree + rotOffset);
        } else if (isAnchorHistoryFor(currentObjPerFrame + 1, id)) {
            var actual = getAnchorHistoryFor(currentObjPerFrame + 1, id);
            var p1 = getPosOnCurves(actual.start, actual.control, actual.end, 0);
            var p2 = getPosOnCurves(actual.start, actual.control, actual.end, 0.1);
            var rotOffset = 0;
            if (p1.x > p2.x) rotOffset = 180;
            var a = (p2.y - p1.y) / (p2.x - p1.x);
            var degree = ((Math.atan(a) * 180) / Math.PI);
            obj.rotation(degree + rotOffset);
        }
        selectedFrame.draw();
        showInConfigObjData(obj);
    }

    function showInConfigObjData(obj = $scope.lastSelected) {
        if (obj == null) return;
        var rot = obj.getAttr("rotation");
        var scl = obj.getAttr("scale").x;
        $("#rotationConfig").parent().find("span").first().html(rot + "'");
        $("#scaleConfig").parent().find("span").first().html(scl);
        $("#rotationConfig").val(rot);
        $("#scaleConfig").val(scl);
    }

    function createFrameToAnim() {
        selectObjStyle(null);
        var animationFrames = [];

        for (var i = 0; i < allObjectPerFrame.length; i++) {
            var objs = allObjectPerFrame[i].obj;
            var arrows = allObjectPerFrame[i].arrow;
            var shapes = allObjectPerFrame[i].shapes;
            var text = allObjectPerFrame[i].text;

            if (allObjectPerFrame[i + 1]) {
                for (var x = 0; x < $scope.iloscklatekPomiedzyGlownymi; x++) {
                    arrowsArray = []
                    for (var z = 0; z < arrows.length; z++) {
                        var complexText = new Konva.Text({
                            x: arrows[z].getAttr("points")[0].x,
                            y: arrows[z].getAttr("points")[0].y,
                            offsetX: 100,
                            text: (arrows[z].getAttr("config") && arrows[z].getAttr("config").text) ? arrows[z].getAttr("config").text : "",
                            fontSize: 18,
                            fontFamily: 'Calibri',
                            fill: '#fff',
                            padding: 20,
                            width: 200,
                            align: 'center'
                        });
                        if (arrows[z].getAttr("points")[0].y < arrows[z].getAttr("points")[1].y) complexText.setAttr('offsetY', 50);
                        else complexText.setAttr('offsetY', 10);
                        var arrow = new Konva.Shape({
                            points: arrows[z].getAttr("points"),
                            stroke: arrows[z].getAttr("stroke"),
                            strokeWidth: arrows[z].getAttr("strokeWidth"),
                            sceneFunc: function(context) {
                                drawArrowStyle(context, this);
                            },
                            id: arrows[z].getAttr("id"),
                            textObj: complexText,
                            name: 'arrow',
                            config: arrows[z].getAttr("config")
                        });
                        arrowsArray.push(arrow);
                    }

                    shapesArray = []
                    for (var z = 0; z < shapes.length; z++) {
                        var complexText = new Konva.Text({
                            x: shapes[z].getAttr("x"),
                            y: shapes[z].getAttr("y"),
                            offsetX: 100,
                            text: (shapes[z].getAttr("config") && shapes[z].getAttr("config").text) ? shapes[z].getAttr("config").text : "",
                            fontSize: 18,
                            fontFamily: 'Calibri',
                            fill: '#fff',
                            padding: 20,
                            width: 200,
                            align: 'center'
                        });
                        var shape = new Konva.Shape({
                            arrowPoint: shapes[z].getAttr("arrowPoint"),
                            sceneFunc: shapes[z].getAttr("sceneFunc"),
                            name: shapes[z].getAttr("name"),
                            fill: shapes[z].getAttr("fill"),
                            stroke: shapes[z].getAttr("stroke"),
                            scale: shapes[z].getAttr("scale"),
                            strokeWidth: shapes[z].getAttr("strokeWidth"),
                            id: shapes[z].getAttr("id"),
                            config: shapes[z].getAttr("config"),
                            textObj: complexText
                        });
                        shapesArray.push(shape);
                    }

                    textArray = []
                    for (var z = 0; z < text.length; z++) {
                        var complexText = new Konva.Text({
                            x: text[z].getAttr("x"),
                            y: text[z].getAttr("y"),
                            offsetX: 100,
                            text: (text[z].getAttr("config") && text[z].getAttr("config").text) ? text[z].getAttr("config").text : "",
                            fontSize: 18,
                            fontFamily: 'Calibri',
                            fill: '#fff',
                            padding: 20,
                            width: 200,
                            align: 'center'
                        });
                        var obj = new Konva.Text({
                            x: text[z].getAttr("x"),
                            y: text[z].getAttr("y"),
                            offsetX: text[z].getAttr("offsetX"),
                            offsetY: text[z].getAttr("offsetY"),
                            rotation: text[z].getAttr("rotation"),
                            fontSize: text[z].getAttr("fontSize"),
                            text: text[z].getAttr("text"),
                            name: text[z].getAttr("name"),
                            fill: text[z].getAttr("fill"),
                            align: text[z].getAttr("align"),
                            scale: text[z].getAttr("scale"),
                            id: text[z].getAttr("id"),
                            config: text[z].getAttr("config"),
                            textObj: complexText
                        });
                        textArray.push(obj);
                    }

                    objectArrays = []
                    objs = allObjectPerFrame[i + 1].obj;
                    for (var z = 0; z < objs.length; z++) {
                        if (isAnchorHistoryFor(i + 1, objs[z].getAttr("id"))) {
                            var history = getAnchorHistoryFor(i + 1, objs[z].getAttr("id"));
                            var p1, p2, a, degree;

                            // check if user rotate it
                            p1 = getPosOnCurves(history.start, history.control, history.end, 0.9);
                            p2 = getPosOnCurves(history.start, history.control, history.end, 1);
                            var rotOffset = 0;
                            if (p1.x > p2.x) rotOffset = 180;
                            a = (p2.y - p1.y) / (p2.x - p1.x);
                            degree = parseFloat(((Math.atan(a) * 180) / Math.PI) + rotOffset, 2).toFixed(2);
                            var lastDegreee = parseDeg(parseInt(degree));
                            var isReRotation = parseDeg(parseInt(objs[z].getAttr("rotation"))) != lastDegreee;
                            p1 = getPosOnCurves(history.start, history.control, history.end, (x / $scope.iloscklatekPomiedzyGlownymi));
                            p2 = getPosOnCurves(history.start, history.control, history.end, ((x + 1) / $scope.iloscklatekPomiedzyGlownymi));
                            var rotOffset = 0;
                            if (p1.x > p2.x) rotOffset = 180;
                            a = (p2.y - p1.y) / (p2.x - p1.x);
                            degree = parseDeg(parseFloat(((Math.atan(a) * 180) / Math.PI) + rotOffset, 2).toFixed(2));

                            if (isReRotation) {
                                degree = parseFloat(degree) + Math.abs(lastDegreee - parseDeg(parseInt(objs[z].getAttr("rotation"))));
                            }

                            var complexText = new Konva.Text({
                                x: p1.x,
                                y: p1.y,
                                offsetX: 100,
                                text: (objs[z].getAttr("config") && objs[z].getAttr("config").text) ? objs[z].getAttr("config").text : "",
                                fontSize: 18,
                                fontFamily: 'Calibri',
                                fill: '#fff',
                                padding: 20,
                                width: 200,
                                align: 'center'
                            });
                            var obj = new Konva.Image({
                                x: p1.x,
                                y: p1.y,
                                offsetX: objs[z].getAttr("offsetX"),
                                offsetY: objs[z].getAttr("offsetY"),
                                rotation: degree,
                                image: objs[z].getAttr("image"),
                                scale: objs[z].getAttr("scale"),
                                name: objs[z].getAttr("name"),
                                id: objs[z].getAttr("id"),
                                config: objs[z].getAttr("config"),
                                textObj: complexText
                            });
                        } else {
                            var complexText = new Konva.Text({
                                x: objs[z].getAttr("x"),
                                y: objs[z].getAttr("y"),
                                offsetX: 100,
                                text: (objs[z].getAttr("config") && objs[z].getAttr("config").text) ? objs[z].getAttr("config").text : "",
                                fontSize: 18,
                                fontFamily: 'Calibri',
                                fill: '#fff',
                                padding: 20,
                                width: 200,
                                align: 'center'
                            });
                            var obj = new Konva.Image({
                                x: objs[z].getAttr("x"),
                                y: objs[z].getAttr("y"),
                                offsetX: objs[z].getAttr("offsetX"),
                                offsetY: objs[z].getAttr("offsetY"),
                                rotation: objs[z].getAttr("rotation"),
                                image: objs[z].getAttr("image"),
                                scale: objs[z].getAttr("scale"),
                                name: objs[z].getAttr("name"),
                                id: objs[z].getAttr("id"),
                                config: objs[z].getAttr("config"),
                                textObj: complexText
                            });
                        }

                        objectArrays.push(obj);
                    }

                    animationFrames.push({
                        arrow: arrowsArray,
                        obj: objectArrays,
                        shapes: shapesArray,
                        text: textArray
                    });

                }
            } else {
                arrowsArray = []
                for (var z = 0; z < arrows.length; z++) {
                    var complexText = new Konva.Text({
                        x: arrows[z].getAttr("points")[0].x,
                        y: arrows[z].getAttr("points")[0].y,
                        offsetX: 100,
                        text: (arrows[z].getAttr("config") && arrows[z].getAttr("config").text) ? arrows[z].getAttr("config").text : "",
                        fontSize: 18,
                        fontFamily: 'Calibri',
                        fill: '#fff',
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    if (arrows[z].getAttr("points")[0].y < arrows[z].getAttr("points")[1].y) complexText.setAttr('offsetY', 50);
                    else complexText.setAttr('offsetY', 10);
                    var arrow = new Konva.Shape({
                        points: arrows[z].getAttr("points"),
                        stroke: arrows[z].getAttr("stroke"),
                        strokeWidth: arrows[z].getAttr("strokeWidth"),
                        sceneFunc: function(context) {
                            drawArrowStyle(context, this);
                        },
                        id: arrows[z].getAttr("id"),
                        textObj: complexText,
                        name: 'arrow',
                        config: arrows[z].getAttr("config")
                    });
                    arrowsArray.push(arrow);
                }

                shapesArray = []
                for (var z = 0; z < shapes.length; z++) {
                    var complexText = new Konva.Text({
                        x: shapes[z].getAttr("x"),
                        y: shapes[z].getAttr("y"),
                        offsetX: 100,
                        text: (shapes[z].getAttr("config") && shapes[z].getAttr("config").text) ? shapes[z].getAttr("config").text : "",
                        fontSize: 18,
                        fontFamily: 'Calibri',
                        fill: '#fff',
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    var shape = new Konva.Shape({
                        arrowPoint: shapes[z].getAttr("arrowPoint"),
                        sceneFunc: shapes[z].getAttr("sceneFunc"),
                        name: shapes[z].getAttr("name"),
                        fill: shapes[z].getAttr("fill"),
                        scale: shapes[z].getAttr("scale"),
                        stroke: shapes[z].getAttr("stroke"),
                        strokeWidth: shapes[z].getAttr("strokeWidth"),
                        id: shapes[z].getAttr("id"),
                        config: shapes[z].getAttr("config"),
                        textObj: complexText
                    });
                    shapesArray.push(shape);
                }

                textArray = []
                for (var z = 0; z < text.length; z++) {
                    var complexText = new Konva.Text({
                        x: text[z].getAttr("x"),
                        y: text[z].getAttr("y"),
                        offsetX: 100,
                        text: (text[z].getAttr("config") && text[z].getAttr("config").text) ? text[z].getAttr("config").text : "",
                        fontSize: 18,
                        fontFamily: 'Calibri',
                        fill: '#fff',
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    var obj = new Konva.Text({
                        x: text[z].getAttr("x"),
                        y: text[z].getAttr("y"),
                        offsetX: text[z].getAttr("offsetX"),
                        offsetY: text[z].getAttr("offsetY"),
                        rotation: text[z].getAttr("rotation"),
                        fontSize: text[z].getAttr("fontSize"),
                        text: text[z].getAttr("text"),
                        name: text[z].getAttr("name"),
                        fill: text[z].getAttr("fill"),
                        align: text[z].getAttr("align"),
                        scale: text[z].getAttr("scale"),
                        id: text[z].getAttr("id"),
                        config: text[z].getAttr("config"),
                        textObj: complexText
                    });
                    textArray.push(obj);
                }

                objectArrays = []
                for (var z = 0; z < objs.length; z++) {
                    var complexText = new Konva.Text({
                        x: objs[z].getAttr("x"),
                        y: objs[z].getAttr("y"),
                        offsetX: 100,
                        text: (objs[z].getAttr("config") && objs[z].getAttr("config").text) ? objs[z].getAttr("config").text : "",
                        fontSize: 18,
                        fontFamily: 'Calibri',
                        fill: '#fff',
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    var obj = new Konva.Image({
                        x: objs[z].getAttr("x"),
                        y: objs[z].getAttr("y"),
                        offsetX: objs[z].getAttr("offsetX"),
                        offsetY: objs[z].getAttr("offsetY"),
                        rotation: objs[z].getAttr("rotation"),
                        image: objs[z].getAttr("image"),
                        scale: objs[z].getAttr("scale"),
                        name: objs[z].getAttr("name"),
                        id: objs[z].getAttr("id"),
                        config: objs[z].getAttr("config"),
                        textObj: complexText
                    });
                    objectArrays.push(obj);
                }

                animationFrames.push({
                    arrow: arrowsArray,
                    obj: objectArrays,
                    shapes: shapesArray,
                    text: textArray
                });
            }

        }
        return animationFrames;
    }

    function parseDeg(deg) {
        deg = parseFloat(deg);
        if (deg >= 0) return deg;
        return 360 + deg;
    }

    function playAnimate() {
        if (actualPlayerFrame >= allAnimFrame.length) {
            actualPlayerFrame = 0;
        }

        var mainPlay = setInterval(function() {
            if (pauseAnim) {
                window.clearInterval(mainPlay);
                return;
            }
            actualPlayerFrame++;
            if (actualPlayerFrame >= allAnimFrame.length) {
                window.clearInterval(mainPlay);
                turnOnAllSter();
            } else {
                var percent = setPlayerToFrame(actualPlayerFrame);
                currentObjPerFrame = actualPlayerFrame;
                drawNewStage("canvasPlayerContainer", allAnimFrame);
                $("#playerData p").first().text("Podgląd animacji - klatka: " + (actualPlayerFrame + 1) + " / " + allAnimFrame.length);
            }
        }, 1000 / $scope.iloscfps);
    }

    $(document).off('click touch', '#exitPlayer');
    $(document).on('click touch', '#exitPlayer', function() {
        exitPlayer();
    });

    $(document).off('click touch', '#playAnim');
    $(document).on('click touch', '#playAnim', function() {
        if (!canClickSter('playAnim')) return;
        playAnimate();
        pauseAnim = false;
        turnOnAllSter();
        playerTurnOffSter('backwardAnim');
        playerTurnOffSter('forwardAnim');
        playerTurnOffSter('playAnim');
    });

    $(document).off('click touch', '#pauseAnim');
    $(document).on('click touch', '#pauseAnim', function() {
        if (!canClickSter('pauseAnim')) return;
        pauseAnim = true;
        turnOnAllSter();
        playerTurnOffSter('pauseAnim');
    });

    $(document).off('click touch', '#stopAnim');
    $(document).on('click touch', '#stopAnim', function() {
        pauseAnim = true;
        actualPlayerFrame = 0;
        changeFrame(0, allAnimFrame);
        setPlayerToFrame(0);
        drawNewStage("canvasPlayerContainer", allAnimFrame);
        turnOnAllSter();
    });

    $(document).off('click touch', '#backwardAnim');
    $(document).on('click touch', '#backwardAnim', function() {
        if (!canClickSter('backwardAnim')) return;
        playerBeforeFrame();
        $("#playerData p").first().text("Podgląd animacji - klatka: " + (actualPlayerFrame + 1) + " / " + allAnimFrame.length);
    });

    $(document).off('click touch', '#forwardAnim');
    $(document).on('click touch', '#forwardAnim', function() {
        if (!canClickSter('forwardAnim')) return;
        playerNextFrame();
        $("#playerData p").first().text("Podgląd animacji - klatka: " + (actualPlayerFrame + 1) + " / " + allAnimFrame.length);
    });

    function playerBeforeFrame() {
        if (actualPlayerFrame == 0) return;
        actualPlayerFrame--;
        changeFrame(actualPlayerFrame, allAnimFrame);
        setPlayerToFrame(actualPlayerFrame);
        drawNewStage("canvasPlayerContainer", allAnimFrame);
    }

    function playerNextFrame() {
        if (actualPlayerFrame >= allAnimFrame.length - 1) return;
        actualPlayerFrame++;
        changeFrame(actualPlayerFrame, allAnimFrame);
        setPlayerToFrame(actualPlayerFrame);
        drawNewStage("canvasPlayerContainer", allAnimFrame);
    }

    function setPlayerToFrame(frame) {
        var percent = Math.round((frame / (allAnimFrame.length - 1)) * 100);
        $('#animTime').css("width", percent + "%");
        return percent;
    }

    function showPlayer() {
        pauseAnim = false;
        isPlayerOpen = true;
        delete allAnimFrame;
        allAnimFrame = null;
        allAnimFrame = createFrameToAnim();
        $('#canvasPlayer').show();
        if (actualPlayerFrame >= allAnimFrame.length) actualPlayerFrame = 0;
        changeFrame(actualPlayerFrame, allAnimFrame);
        setPlayerToFrame(actualPlayerFrame);
        drawNewStage("canvasPlayerContainer", allAnimFrame);
        playAnimate();
    }

    function exitPlayer() {
        pauseAnim = true;
        isPlayerOpen = false;
        $('#canvasPlayer').hide();
        turnOnAllSter();
        changeFrame(0);
        drawNewStage();
    }

    function canClickSter(name) {
        return $('#' + name).hasClass('animCotrollerButton');
    }

    function turnOnAllSter() {
        playerTurnOnSter('playAnim');
        playerTurnOnSter('backwardAnim');
        playerTurnOnSter('pauseAnim');
        playerTurnOnSter('forwardAnim');
        playerTurnOnSter('stopAnim');
    }

    function playerTurnOnSter(name) {
        $('#' + name).removeClass('disableSter');
        $('#' + name).addClass('animCotrollerButton');
    }

    function playerTurnOffSter(name) {
        $('#' + name).removeClass('animCotrollerButton');
        $('#' + name).addClass('disableSter');
    }

    function loadAnimation(callback) {
        request.backend('loadConspectAnim', { id: $scope.animId }, function(data) {
            data.anchorHistory = JSON.parse(data.anchorHistory);
            data.animFrame = JSON.parse(data.animFrame);
            delete anchorHistory;
            anchorHistory = data.anchorHistory;

            delete allObjectPerFrame;
            allObjectPerFrame = null;
            allObjectPerFrame = [];

            $scope.cwName = data.name;
            $scope.cwFieldType = data.cwFieldType;
            $scope.cwMaxTime = data.cwMaxTime;
            $scope.cwMinTime = data.cwMinTime;
            $scope.cwMaxPerson = data.cwMaxPerson;
            $scope.cwMinPerson = data.cwMinPerson;
            $scope.cwOps = data.cwOps;
            $scope.cwWsk = data.cwWsk;
            $scope.iloscklatekPomiedzyGlownymi = data.frameBeetween;
            $scope.jakoscAnimacji = data.qualityAnim;
            $scope.iloscfps = data.fps;

            for (var x = 0; x < data.animFrame.length; x++) {
                allObjectPerFrame.push({ arrow: [], obj: [], shapes: [], text: [] });

                if (data.animFrame[x].arrow)
                    for (var i = 0; i < data.animFrame[x].arrow.length; i++) {
                        var arrowBef = data.animFrame[x].arrow[i];
                        var obj = createArrowObjFromOther(arrowBef, true);
                        allObjectPerFrame[x].arrow.push(obj);
                    }
                if (data.animFrame[x].obj)
                    for (var i = 0; i < data.animFrame[x].obj.length; i++) {
                        var objBef = data.animFrame[x].obj[i];
                        var obj = createObjFromOther(objBef, true);
                        allObjectPerFrame[x].obj.push(obj);
                    }
                if (data.animFrame[x].shapes)
                    for (var i = 0; i < data.animFrame[x].shapes.length; i++) {
                        var objBef = data.animFrame[x].shapes[i];
                        var obj = createShapeObjFromOther(objBef, true);
                        allObjectPerFrame[x].shapes.push(obj);
                    }
                if (data.animFrame[x].text)
                    for (var i = 0; i < data.animFrame[x].text.length; i++) {
                        var objBef = data.animFrame[x].text[i];
                        var obj = createTextFromOther(objBef, true);
                        allObjectPerFrame[x].text.push(obj);
                    }

                if (x != 0) {
                    var count = $(".timeElement").length + 1;
                    $(".timeElement").last().after("<div class='timeElement' > " + count + " </div>");
                }
            }

            $scope.tags = data.tags.split(' ');
            var tagTo = {
                data: []
            };

            for (var ind = 0; ind < $scope.tags.length; ind++) {
                tagTo.data.push({
                    tag: $scope.tags[ind]
                });
            }

            $('.chips-placeholder').material_chip(tagTo);

            if (data.fieldImage && data.fieldImage.length > 2) {
                selectField(data.fieldImage);
                $scope.$apply(function() {
                    callback();
                    $scope.changeCategories($scope.mouseActionType.MOVE);
                    changeFrame(0);
                    setTimeout(function() {
                        resize();
                    }, 500);
                });
            }

        });

    }

    $(document).off('change', '#turnOnHelperNet');
    $(document).on('change', '#turnOnHelperNet', function() {
        drawNewStage();
    });

    $(document).off('change', '#turnOnHekperFullScreen');
    $(document).on('change', '#turnOnHekperFullScreen', function() {
        if ($scope.turnOnHekperFullScreen) {
            goToFull();
        } else {
            $scope.endFromFull(false);
        }
    });


    function renderAnim() {
        $scope.turnOnHelperNet = false;
        isPlayerOpen = true;
        delete allAnimFrame;
        allAnimFrame = null;
        allAnimFrame = createFrameToAnim();
        $('#canvasPlayer').show();
        actualPlayerFrame = 0;
        changeFrame(actualPlayerFrame, allAnimFrame);
        setPlayerToFrame(actualPlayerFrame);
        var encoder = new GIFEncoder();
        encoder.setRepeat(0);
        encoder.setQuality($scope.jakoscAnimacji);
        encoder.setDelay(1000 / $scope.iloscfps);
        encoder.start();

        var mainPlay = setInterval(function() {
            if (actualPlayerFrame >= allAnimFrame.length) {
                window.clearInterval(mainPlay);
                turnOnAllSter();
                encoder.finish();
                var binary_gif = encoder.stream().getData();
                $scope.gif = encode64(binary_gif);
                var tags = $('.chips-placeholder').material_chip('data');
                var allTagString = '';
                for (var x = 0; x < tags.length; x++) {
                    allTagString += " ";
                    allTagString += tags[x].tag;
                }

                var allObj = [];
                for (var index = 0; index < allObjectPerFrame.length; index++) {
                    allObj.push({
                        obj: [],
                        arrow: [],
                        shapes: [],
                        text: []
                    });
                    for (var x = 0; x < allObjectPerFrame[index].obj.length; x++) {
                        allObj[index].obj.push(allObjectPerFrame[index].obj[x].toObject());
                        allObj[index].obj[x].attrs.image = allObjectPerFrame[index].obj[x].getImage().src;
                    }
                    for (var x = 0; x < allObjectPerFrame[index].arrow.length; x++) {
                        allObj[index].arrow.push(allObjectPerFrame[index].arrow[x].toObject());
                    }
                    for (var x = 0; x < allObjectPerFrame[index].shapes.length; x++) {
                        allObj[index].shapes.push(allObjectPerFrame[index].shapes[x].toObject());
                    }
                    for (var x = 0; x < allObjectPerFrame[index].text.length; x++) {
                        allObj[index].text.push(allObjectPerFrame[index].text[x].toObject());
                    }
                }

                currentObjPerFrame = 0;
                drawNewStage("canvasPlayerContainer", allAnimFrame);

                var toSend = {
                    id: $scope.animId,
                    name: $scope.animName,
                    tags: allTagString,
                    mainImg: allAnimFrame.length <= 0 ? '' : $scope.gif,
                    mainImgShow: allAnimFrame.length <= 0 ? '' : selectedFrame.toCanvas().toDataURL("image/jpg").split(',')[1],
                    animFrame: JSON.stringify(allObj),
                    anchorHistory: JSON.stringify(anchorHistory),
                    fieldImage: $scope.isSelectedField ? $scope.fieldImage.src : '',
                    cwFieldType: $scope.cwFieldType,
                    cwMaxTime: $scope.cwMaxTime,
                    cwMinTime: $scope.cwMinTime,
                    cwMaxPerson: $scope.cwMaxPerson,
                    cwMinPerson: $scope.cwMinPerson,
                    cwOps: $scope.cwOps,
                    cwWsk: $scope.cwWsk,
                    usid: $rootScope.user.id,
                    frameBeetween: $scope.iloscklatekPomiedzyGlownymi,
                    qualityAnim: $scope.jakoscAnimacji,
                    fps: $scope.iloscfps
                };


                request.backend('saveConspectAnim', toSend, function(data) {
                    exitPlayer();
                    if ($scope.animId != -1) notify.localNotify("Sukces", "Animacja pomyślnie edytowana");
                    else notify.localNotify("Sukces", "Animacja zapisana pomyślnie");
                    $scope.animId = data;
                    $location.url("/conspectusAnimList");
                });

            } else {
                var percent = setPlayerToFrame(actualPlayerFrame);
                currentObjPerFrame = actualPlayerFrame;
                drawNewStage("canvasPlayerContainer", allAnimFrame);
                encoder.addFrame(selectedFrame.toCanvas().getContext('2d'));
                $("#playerData p").first().text("Renderowanie animacji - klatka: " + (actualPlayerFrame + 1) + " / " + allAnimFrame.length);
                actualPlayerFrame++;
            }
        }, 1000 / $scope.iloscfps);
    }

    function saveAnimation() {
        renderAnim();
    }

    $scope.saveAnim = function() {
        $scope.animName = $('#cwName').val();
        $scope.tags = $('.chips-placeholder').material_chip('data');

        $scope.cwFieldType = $('#cwFieldType').val();
        $scope.cwMaxTime = parseInt($('#maxTime').val());
        $scope.cwMinTime = parseInt($('#minTime').val());
        $scope.cwMaxPerson = parseInt($('#maxPerson').val());
        $scope.cwMinPerson = parseInt($('#minPerson').val());
        $scope.cwOps = $('#opCw').val();
        $scope.cwWsk = $('#wskCw').val();

        if (!$scope.animName || $scope.animName == '' || $scope.animName == ' ' || $scope.animName == null) {
            notify.localNotify("Walidacja", "Wpisz nazwę danego ćwiczenia");
            return;
        }

        if (!$scope.cwFieldType || $scope.cwFieldType.length <= 0) {
            notify.localNotify("Walidacja", "Wpisz poprawnie pole gry");
            return;
        }

        if (!$scope.cwMinTime || $scope.cwMinTime.length <= 0 || $scope.cwMinTime <= 0 || !$.isNumeric($scope.cwMinTime)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie minimalny czas trwania ( więcej niż 0 )");
            return;
        }

        if (!$scope.cwMaxTime || $scope.cwMaxTime.length <= 0 || $scope.cwMaxTime <= $scope.cwMinTime || $scope.cwMaxTime > 1000 || !$.isNumeric($scope.cwMaxTime)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie maksymalny czas trwania ( wiecej niż " + $scope.cwMinTime + " mniej niż 1000 )");
            return;
        }

        if (!$scope.cwMinPerson || $scope.cwMinPerson.length <= 0 || $scope.cwMinPerson <= 0 || !$.isNumeric($scope.cwMinPerson)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie minimalną ilość zawodników ( więcej niż 0 )");
            return;
        }

        if (!$scope.cwMaxPerson || $scope.cwMaxPerson.length <= 0 || $scope.cwMaxPerson <= $scope.cwMinPerson || $scope.cwMaxPerson > 100 || !$.isNumeric($scope.cwMaxPerson)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie maksymalną ilość zawodników ( wiecej niż " + $scope.cwMinPerson + " mniej niż 100 )");
            return;
        }

        if (!$scope.tags || $scope.tags.length < 2) {
            notify.localNotify("Walidacja", "Wpisz przynajmniej dwie frazy z którymi będzie kojarzone dane ćwiczenie");
            return;
        }

        saveAnimation();
    }

    $scope.loadAndPlay = function(id) {
        $scope.onlyPlayer = true;
        currentObjPerFrame = 0;
        $scope.animId = id;
        $rootScope.idFromAnimConspectToEdit = null;
        loadAnimation(function() {
            showPlayer();
        });
    }

});
