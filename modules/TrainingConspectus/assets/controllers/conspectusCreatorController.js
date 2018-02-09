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
    $scope.turnOnRotation = false;
    $scope.turnOnHekperFullScreen = false;
    $scope.fullElement = null;
    $scope.iloscklatekPomiedzyGlownymi = 40;
    $scope.jakoscAnimacji = 40;
    $scope.iloscfps = 30;
    $scope.selectedItemList = [];
    $scope.startPointSelectShape = null;
    $scope.endPointSelectShape = null;
    $scope.canAddItem = false;
    var multiDragPositionStart = { x: 0, y: 0 };

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
            confName: "player",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            },
            colors: [{
                background: "rgb(0,126,255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(144, 0, 255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(174, 174, 174)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 48, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 204, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            }]
        },
        arrow: {
            confName: "arrow",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            arrowTypes: ["Podanie", "Prowadzenie piłki", "Bieg bez piłki", "Linia pomocnicza", "Odległość zawodników", "Strzał"],
            arrowType: "Podanie"
        },
        shape: {
            confName: "shape",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
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
        },
        ball: {
            confName: "ball",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(0, 0, 0)"
            },
            colors: [{
                background: "rgb(254,100,62)",
                border: "rgb(0, 0, 0)"
            }, {
                background: "rgb(255, 255, 255)",
                border: "rgb(0, 0, 0)"
            }]
        },
        cones: {
            confName: "cones",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(255,255,255)"
            },
            colors: [{
                background: "rgb(255, 255, 255)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(255, 204, 0)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(255, 48, 0)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(174, 174, 174)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(144, 0, 255)",
                border: "rgb(255,255,255)"
            }, {
                background: "rgb(0, 126, 255)",
                border: "rgb(255,255,255)"
            }]
        },
        rings: {
            confName: "rings",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            },
            colors: [{
                background: "rgb(0,126,255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(144, 0, 255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(174, 174, 174)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 48, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 204, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            }]
        },
        flags: {
            confName: "flags",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            },
            colors: [{
                background: "rgb(0,126,255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(144, 0, 255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(174, 174, 174)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 48, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 204, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            }]
        },
        poles: {
            confName: "poles",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17",
            selectedColor: {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            },
            colors: [{
                background: "rgb(0,126,255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(144, 0, 255)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(174, 174, 174)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 48, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 204, 0)",
                border: "rgb(255, 255, 255)"
            }, {
                background: "rgb(255, 255, 255)",
                border: "rgb(255, 255, 255)"
            }]
        },
        onlyText: {
            confName: "onlyText",
            text: " ",
            selectedColorText: "rgb(255,255,255)",
            selectedTextSize: "17"
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

    $scope.initObjList = function() {
        request.backend('getConspectAnimObj', {}, function(data) {
            $scope.$apply(function() {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var content = $compile(data[i].category)($scope);
                        $('#categoryFromItemBox').append(content);
                        if (data[i].obj) {
                            var content = $compile(data[i].obj)($scope);
                            $('#itemBoxFromCat').append(content);
                        }
                    }
                    $(document).ready(function() {
                        $('.tooltipped').tooltip({
                            delay: 50
                        });
                        $('.collapsible').collapsible();
                    });
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
    var selectShapeLayer = null;
    var anchorLayer = null;
    var lineLayer = null;
    var quadCurves = [];
    var somethingIsDraw = false;
    var isPlayerOpen = false;
    $scope.shiftPressed = false;

    $(window).resize(function() {
        resize();
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
        $('.categories').eq(0).css("border-color", "rgb(191, 72, 36)");
    }

    selectedFrame.on('contentClick contentTap', function(e) {
        clickOnContent();
    })

    selectedFrame.on('mousedown touchstart', function(e) {
        onMuseDown();
    });

    selectedFrame.on('mousemove touchmove', function(e) {
        onMuseMove();
    });

    selectedFrame.on('mouseup touchend', function(e) {
        onMuseUp();
    });

    $(document).ready(function() {
        $("#animCreator").off('keydown');
        $("#animCreator").off('keyup');
        $("#animCreator").on('keydown', function(e) {
            if (e.keyCode == 16) {
                $scope.shiftPressed = true;
            }
        });
        $("#animCreator").on('keyup', function(e) {
            $scope.shiftPressed = false;
            if (e.keyCode == 46) {
                $rootScope.showModalWindow("Nieodwracalnie usunie zaznaczone obiekty oraz wszystkie ich wystąpienia w następnych klatkach animacji", function() {
                    deleteCurrent();
                });
            }
        });
    });

    function onMuseUp() {
        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE && $scope.startPointSelectShape != null && $scope.endPointSelectShape != null && !somethingIsDraw) {
            selectFromMultiSelectShape();
        }
    }

    function onMuseMove() {
        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE && $scope.startPointSelectShape != null) {
            var scale = selectedFrame.getAttr('scaleX');
            var mousePos = selectedFrame.getPointerPosition();
            $scope.endPointSelectShape = {
                x: mousePos.x / scale,
                y: mousePos.y / scale
            }
            if (!somethingIsDraw) redrawMultiSelectShape();
        }
    }

    function onMuseDown() {
        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
            var scale = selectedFrame.getAttr('scaleX');
            var mousePos = selectedFrame.getPointerPosition();
            $scope.startPointSelectShape = {
                x: mousePos.x / scale,
                y: mousePos.y / scale
            }
        }
    }

    $(document).off('click touch', '.categories');
    $(document).on('click touch', '.categories', function() {
        if ($(window).width() > 1000) {
            $(".itemBoxWithItem").first().width(750);
        } else {
            // $(".itemBoxWithItem").first().width($(window).width() - 200);
        }
        $('.categories').each(function() {
            $(this).css("border-color", "");
        });

        $('.categoryItems').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "rgb(191, 72, 36)");
        $scope.selectedObjConfig = $(this).data('config') ? $scope.objConfig[$(this).data('config')] : [];
        $scope.canAddItem = false;
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
        $(this).css("border-color", "rgb(191, 72, 36)");

        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD) {
            $scope.selectedObjImg = new Image();
            $scope.selectedObjImg.src = $(this).find('img').attr('src');
        }
        $scope.canAddItem = true;
        $scope.selectedObjConfig = $(this).find('img').data('config') ? $scope.objConfig[$(this).find('img').data('config')] : [];

    })

    $scope.showObjConfig = function() {

        var settingsDiv = "<div class='lastSelectedConfigContent'><p class='confInfo' >Brak dostępnych opcji konfiguracyjnych</p></div>";
        $("#lastSelectedConfig").first().html("");
        $("#lastSelectedConfig").first().append(settingsDiv);
        if (!$scope.lastSelected && $scope.selectedItemList.length <= 0) return;
        if (!$scope.lastSelected) return;
        var config = $scope.lastSelected.getAttr("config");
        if (!config) return;
        if (config.text || config.colors || config.arrowTypes)
            $('.lastSelectedConfigContent').first().html("");
        //text
        if (config.text) {
            var textEdit = "<div class='configColorPickerForText'>";

            textEdit += "<p class='confInfo' style='width: 100%'>Kolor czcionki:</p>"
            textEdit += "<div class='configColorText' style='background-color:rgb(255,255,255); border-color:rgb(0,0,0)'></div>";
            textEdit += "<div class='configColorText' style='background-color:rgb(0,0,0); border-color:rgb(0,0,0)'></div>";
            textEdit += "<div class='configColorText' style='background-color:rgb(255,82,82); border-color:rgb(0,0,0)'></div>";
            textEdit += "<div class='configColorText' style='background-color:rgb(253,216,53); border-color:rgb(0,0,0)'></div>";
            textEdit += "</div>";

            textEdit += "<div class='textSizeChanger'>"
            textEdit += "<p class='confInfo' style='padding-bottom:0'>Rozmiar czcionki:</p>"
            textEdit += "<input style='height: 30px; margin-bottom:10px;text-align:center; color: #adadad' class='configTextSize' type='number' class='validate' value='" + config.selectedTextSize + "'></input>";
            textEdit += "</div>";

            textEdit += "<p class='confInfo' style='padding-bottom:0'>Tekst przy obiekcie</p>";
            textEdit += "<div style='margin-top:0' class='input-field col s12'>";
            textEdit += "<input style='height: 30px; margin-bottom:0;text-align:center' class='configEditText' placeholder='Treść' type='text' class='validate' value='" + config.text + "'></input>";
            textEdit += "</div>";
            $('.lastSelectedConfigContent').first().append(textEdit);
            var thisObj = $scope.lastSelected;
            thisObj = $scope.selectedItemList.length > 0 ? $scope.selectedItemList : thisObj;

            $(document).off('click', '.configColorText');
            $(document).on('click', '.configColorText', function() {
                if ($.isArray(thisObj)) {
                    for (let i = 0; i < thisObj.length; i++) {
                        var configNow = thisObj[i].getAttr('config');
                        configNow.selectedColorText = ($(this).css("background-color"));
                        thisObj[i].setAttr('config', configNow);
                        var text = thisObj[i].getAttr('textObj');
                        text.setAttr("fill", ($(this).css("background-color")));
                        configTextUpdate(thisObj[i]);
                    }
                } else {
                    var configNow = thisObj.getAttr('config');
                    configNow.selectedColorText = ($(this).css("background-color"));
                    thisObj.setAttr('config', configNow);
                    var text = thisObj.getAttr('textObj');
                    text.setAttr("fill", ($(this).css("background-color")));
                    configTextUpdate(thisObj);
                }
                mainLayer.draw();
            });

            $(document).off('change', '.configTextSize');
            $(document).on('change', '.configTextSize', function() {
                if ($.isArray(thisObj)) {
                    for (let i = 0; i < thisObj.length; i++) {
                        var configNow = thisObj[i].getAttr('config');
                        configNow.selectedTextSize = $(this).val();
                        thisObj[i].setAttr('config', configNow);
                        var text = thisObj[i].getAttr('textObj');
                        text.setAttr("fontSize", $(this).val());
                        text.setAttr("offsetY", 30 - $(this).val());
                        configTextUpdate(thisObj[i]);
                    }
                } else {
                    var configNow = thisObj.getAttr('config');
                    configNow.selectedTextSize = $(this).val();
                    thisObj.setAttr('config', configNow);
                    var text = thisObj.getAttr('textObj');
                    text.setAttr("fontSize", $(this).val());
                    text.setAttr("offsetY", 30 - $(this).val());
                    configTextUpdate(thisObj);
                }
                mainLayer.draw();
            });

            $(document).off('change', '.configEditText');
            $(document).on('change', '.configEditText', function() {
                if ($.isArray(thisObj)) {
                    for (let i = 0; i < thisObj.length; i++) {
                        var val = $(this).val();
                        var actualConf = thisObj[i].getAttr("config");
                        actualConf.text = val;
                        thisObj[i].setAttr("config", actualConf);

                        var textObj = thisObj[i].getAttr("textObj");
                        textObj.setAttr("text", actualConf.text);
                        thisObj[i].setAttr("textObj", textObj);

                        configTextUpdate(thisObj[i]);
                    }
                } else {
                    var val = $(this).val();
                    var actualConf = thisObj.getAttr("config");
                    actualConf.text = val;
                    thisObj.setAttr("config", actualConf);

                    var textObj = thisObj.getAttr("textObj");
                    textObj.setAttr("text", actualConf.text);
                    thisObj.setAttr("textObj", textObj);

                    configTextUpdate(thisObj);
                }
                mainLayer.draw();
            });
        }

        //createColorPicker
        if (config.colors) {
            var colorPicker = "<div class='configColorPicker'>";
            colorPicker += "<p class='confInfo'>Wersja kolorystyczna obiektu:</p>"
            for (var i = 0; i < config.colors.length; i++) {
                colorPicker += "<div class='configColor' style='background-color:" + (config.colors[i].background) + "; border-color:" + (config.colors[i].border) + "'></div>";
            }
            colorPicker += "</div>";
            $('.lastSelectedConfigContent').first().append(colorPicker);

            var thisObj = $scope.lastSelected;
            thisObj = $scope.selectedItemList.length > 0 ? $scope.selectedItemList : thisObj;

            $(document).off('click', '.configColor');
            $(document).on('click', '.configColor', function() {
                if ($.isArray(thisObj)) {
                    for (let i = 0; i < thisObj.length; i++) {
                        var configNow = thisObj[i].getAttr('config');
                        configNow.selectedColor = {
                            background: ($(this).css("background-color")),
                            border: ($(this).css("border-color"))
                        };
                        thisObj[i].setAttr('config', configNow);
                        var back = $(this).css("background-color").replace(/ /g, "");
                        var border = $(this).css("border-color").replace(/ /g, "");
                        // osobne zmiany dla kazdego typu obiektu TODO
                        switch (thisObj[i].getAttr("name")) {
                            case "movementObject":
                                break;
                            case "shapes":
                                thisObj[i].setAttr('stroke', border);
                                thisObj[i].setAttr('fill', back);
                                break;
                            default:
                                break;
                        }
                        configColorUpdate(thisObj[i]);
                    }
                } else {
                    var configNow = thisObj.getAttr('config');
                    configNow.selectedColor = {
                        background: ($(this).css("background-color")),
                        border: ($(this).css("border-color"))
                    };
                    thisObj.setAttr('config', configNow);
                    var back = $(this).css("background-color").replace(/ /g, "");
                    var border = $(this).css("border-color").replace(/ /g, "");
                    // osobne zmiany dla kazdego typu obiektu TODO
                    switch (thisObj.getAttr("name")) {
                        case "movementObject":
                            break;
                        case "shapes":
                            thisObj.setAttr('stroke', border);
                            thisObj.setAttr('fill', back);
                            break;
                        default:
                            break;
                    }
                    configColorUpdate(thisObj);
                }
                mainLayer.draw();
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

            var thisObj = $scope.lastSelected;
            thisObj = $scope.selectedItemList.length > 0 ? $scope.selectedItemList : thisObj;

            $('.lastSelectedConfigContent').first().append(arrowPicker);
            $('input[name=arrowTypeGroup]').on('change', function() {
                if ($.isArray(thisObj)) {
                    for (let i = 0; i < thisObj.length; i++) {
                        config.arrowType = $(this).attr("id");
                        thisObj[i].setAttr("config", config);
                        configTextUpdate(thisObj[i]);
                    }
                } else {
                    config.arrowType = $(this).attr("id");
                    thisObj.setAttr("config", config);
                    configTextUpdate(thisObj);
                }
                mainLayer.draw();
            });
        }
    }

    function configTextUpdate(obj) {
        var id = obj.getAttr("id");
        var config = obj.getAttr("config");
        var txt = obj.getAttr("textObj");
        for (var i = 0; i < allObjectPerFrame.length; i++) {
            for (var j = 0; j < allObjectPerFrame[i].obj.length; j++) {
                if (allObjectPerFrame[i].obj[j].getAttr("id") == id) {
                    allObjectPerFrame[i].obj[j].setAttr("config", config);
                    if (txt) {
                        var thisTxt = allObjectPerFrame[i].obj[j].getAttr("textObj");
                        thisTxt.setAttr('fill', txt.getAttr('fill'));
                        thisTxt.setAttr('text', txt.getAttr('text'));
                        thisTxt.setAttr('fontSize', txt.getAttr('fontSize'));
                    }
                    break;
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].arrow.length; j++) {
                if (allObjectPerFrame[i].arrow[j].getAttr("id") == id) {
                    allObjectPerFrame[i].arrow[j].setAttr("config", config);
                    if (txt) {
                        var thisTxt = allObjectPerFrame[i].arrow[j].getAttr("textObj");
                        thisTxt.setAttr('fill', txt.getAttr('fill'));
                        thisTxt.setAttr('text', txt.getAttr('text'));
                        thisTxt.setAttr('fontSize', txt.getAttr('fontSize'));
                    }
                    break;
                }
            }
            for (var j = 0; j < allObjectPerFrame[i].shapes.length; j++) {
                if (allObjectPerFrame[i].shapes[j].getAttr("id") == id) {
                    allObjectPerFrame[i].shapes[j].setAttr("config", config);
                    if (txt) {
                        var thisTxt = allObjectPerFrame[i].shapes[j].getAttr("textObj");
                        thisTxt.setAttr('fill', txt.getAttr('fill'));
                        thisTxt.setAttr('text', txt.getAttr('text'));
                        thisTxt.setAttr('fontSize', txt.getAttr('fontSize'));
                    }
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
        $rootScope.showModalWindow("Nieodwracalnie usunie zaznaczone obiekty oraz wszystkie ich wystąpienia w następnych klatkach animacji", function() {
            deleteCurrent();
        });
    });

    function deleteCurrent() {
        if ($scope.lastSelected && $scope.selectedItemList.length <= 0) {
            deleteItem($scope.lastSelected);
        } else if ($scope.selectedItemList.length > 0) {
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                deleteItem($scope.selectedItemList[i]);
            }
        }
    }

    function deleteItem(item) {
        if (!item) return;

        $scope.$apply(function() {
            selectObjStyle(null);
            $scope.changeCategories($scope.mouseActionType.MOVE);
        });

        var id = item.getAttr('id');
        for (let c = currentObjPerFrame; c < allObjectPerFrame.length; c++) {
            var actual = -1;
            var actualItem = null;
            for (var i = 0; i < allObjectPerFrame[c].obj.length; i++) {
                var obb = allObjectPerFrame[c].obj[i].getAttr('id');
                if (obb == id) {
                    actual = i;
                    actualItem = allObjectPerFrame[c].obj[i];
                    break;
                }
            }
            if (actual < 0) {
                for (var i = 0; i < allObjectPerFrame[c].arrow.length; i++) {
                    var obb = allObjectPerFrame[c].arrow[i].getAttr('id');
                    if (obb == id) {
                        actual = i;
                        actualItem = allObjectPerFrame[c].arrow[i];
                        break;
                    }
                }
                if (actual >= 0) allObjectPerFrame[c].arrow.splice(actual, 1);
                else {
                    for (var i = 0; i < allObjectPerFrame[c].shapes.length; i++) {
                        var obb = allObjectPerFrame[c].shapes[i].getAttr('id');
                        if (obb == id) {
                            actual = i;
                            actualItem = allObjectPerFrame[c].shapes[i];
                            break;
                        }
                    }
                    if (actual >= 0) allObjectPerFrame[c].shapes.splice(actual, 1);
                    else {
                        for (var i = 0; i < allObjectPerFrame[c].text.length; i++) {
                            var obb = allObjectPerFrame[c].text[i].getAttr('id');
                            if (obb == id) {
                                actual = i;
                                actualItem = allObjectPerFrame[c].text[i];
                                break;
                            }
                        }
                        if (actual >= 0) allObjectPerFrame[c].text.splice(actual, 1)
                    }
                }
            } else {
                allObjectPerFrame[c].obj.splice(actual, 1);
            }
            deleteAnchor(c, id);
            deleteAnchor(c + 1, id);
            if (anchorLayer != null) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            if (actualItem) {
                var txt = actualItem.getAttr("textObj");
                if (txt) txt.destroy();
                actualItem.destroy();
                $scope.$apply(function() {
                    actualItem = null;
                });
            }
        }
        selectedFrame.draw();
    }

    function rotateCurrent(rot) {
        if ($scope.lastSelected && $scope.selectedItemList.length <= 0) {
            var thisId = $scope.lastSelected.getAttr("id");
            for (let y = ($scope.turnOnRotation ? currentObjPerFrame : 0); y < ($scope.turnOnRotation ? currentObjPerFrame + 1 : allObjectPerFrame.length); y++) {
                for (let u = 0; u < allObjectPerFrame[y].obj.length; u++) {
                    if (allObjectPerFrame[y].obj[u].getAttr("id") == thisId) {
                        allObjectPerFrame[y].obj[u].setAttr("rotation", rot);
                        break;
                    }
                }
            }
        } else if ($scope.selectedItemList.length > 0) {
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                var thisId = $scope.selectedItemList[i].getAttr("id");
                for (let y = ($scope.turnOnRotation ? currentObjPerFrame : 0); y < ($scope.turnOnRotation ? currentObjPerFrame + 1 : allObjectPerFrame.length); y++) {
                    for (let u = 0; u < allObjectPerFrame[y].obj.length; u++) {
                        if (allObjectPerFrame[y].obj[u].getAttr("id") == thisId) {
                            allObjectPerFrame[y].obj[u].setAttr("rotation", rot);
                            break;
                        }
                    }
                }
            }
        }
        selectedFrame.draw();
    }

    function scaleCurrent(scale) {
        var newScale = {
            x: scale,
            y: scale
        };
        if ($scope.lastSelected && $scope.selectedItemList.length <= 0) {
            var thisId = $scope.lastSelected.getAttr("id");
            for (let y = ($scope.turnOnRotation ? currentObjPerFrame : 0); y < ($scope.turnOnRotation ? currentObjPerFrame + 1 : allObjectPerFrame.length); y++) {
                for (let u = 0; u < allObjectPerFrame[y].obj.length; u++) {
                    if (allObjectPerFrame[y].obj[u].getAttr("id") == thisId) {
                        allObjectPerFrame[y].obj[u].scale(newScale);
                        var txt = allObjectPerFrame[y].obj[u].getAttr("textObj");
                        txt.setAttr('y', allObjectPerFrame[y].obj[u].getAttr('y') + (allObjectPerFrame[y].obj[u].height() / 2) * newScale.x);
                        break;
                    }
                }
            }
        } else if ($scope.selectedItemList.length > 0) {
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                var thisId = $scope.selectedItemList[i].getAttr("id");

                for (let y = ($scope.turnOnRotation ? currentObjPerFrame : 0); y < ($scope.turnOnRotation ? currentObjPerFrame + 1 : allObjectPerFrame.length); y++) {
                    for (let u = 0; u < allObjectPerFrame[y].obj.length; u++) {
                        if (allObjectPerFrame[y].obj[u].getAttr("id") == thisId) {
                            allObjectPerFrame[y].obj[u].scale(newScale);
                            var txt = allObjectPerFrame[y].obj[u].getAttr("textObj");
                            txt.setAttr('y', allObjectPerFrame[y].obj[u].getAttr('y') + (allObjectPerFrame[y].obj[u].height() / 2) * newScale.x);
                            break;
                        }
                    }
                }
            }
        }
        selectedFrame.draw();
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
            x: x + arrowObj.getAttr("x"),
            y: y + arrowObj.getAttr("y"),
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
                x: anchor.getAttr("x") - arrowObj.getAttr("x"),
                y: anchor.getAttr("y") - arrowObj.getAttr("y")
            }
            updateArrow(arrowObj);
        });

        anchor.on('dragstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });
        anchorLayer.add(anchor);

        return anchor;
    }

    function updateArrow(arrowObj) {
        arrowObj.setAttr('points', $scope.arrowArrayPostionAnchor);
        var id = arrowObj.getAttr('id');
        for (let i = 0; i < allObjectPerFrame.length; i++) {
            for (let y = 0; y < allObjectPerFrame[i].arrow.length; y++) {
                if (id == allObjectPerFrame[i].arrow[y].getAttr("id")) {
                    allObjectPerFrame[i].arrow[y].setAttr("x", arrowObj.getAttr('x'));
                    allObjectPerFrame[i].arrow[y].setAttr("y", arrowObj.getAttr('y'));
                }
            }
        }
        var txtObj = arrowObj.getAttr("textObj");
        txtObj.setAttr('x', $scope.arrowArrayPostionAnchor[0].x + arrowObj.getAttr('x'));
        txtObj.setAttr('y', $scope.arrowArrayPostionAnchor[0].y + arrowObj.getAttr('y'));
        if ($scope.arrowArrayPostionAnchor[0].y < $scope.arrowArrayPostionAnchor[1].y) txtObj.setAttr('offsetY', 50);
        else txtObj.setAttr('offsetY', 10);
        arrowObj.setAttr('textObj', txtObj);
        mainLayer.draw();
    }

    function createAnchorToShape(x, y, shapeObj, shapeArrayIndex) {
        var anchor = new Konva.Circle({
            x: x + shapeObj.getAttr("x"),
            y: y + shapeObj.getAttr("y"),
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
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            $scope.shapeArrayPostionAnchor[shapeArrayIndex] = {
                x: anchor.getAttr("x") - shapeObj.getAttr("x"),
                y: anchor.getAttr("y") - shapeObj.getAttr("y")
            }
            updateShape(shapeObj);
        });

        anchor.on('dragstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });
        anchorLayer.add(anchor);
        return anchor;
    }


    function updateShape(shapeObj) {
        shapeObj.setAttr('arrowPoint', $scope.shapeArrayPostionAnchor);
        var id = shapeObj.getAttr('id');
        for (let i = 0; i < allObjectPerFrame.length; i++) {
            for (let y = 0; y < allObjectPerFrame[i].shapes.length; y++) {
                if (id == allObjectPerFrame[i].shapes[y].getAttr("id")) {
                    allObjectPerFrame[i].shapes[y].setAttr("x", shapeObj.getAttr('x'));
                    allObjectPerFrame[i].shapes[y].setAttr("y", shapeObj.getAttr('y'));
                }
            }
        }
        var txtObj = shapeObj.getAttr("textObj");
        txtObj.setAttr('x', $scope.shapeArrayPostionAnchor[0].x + shapeObj.getAttr('x'));
        txtObj.setAttr('y', $scope.shapeArrayPostionAnchor[0].y + shapeObj.getAttr('y'));
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
            offsetY: 30 - $scope.selectedObjConfig.selectedTextSize,
            text: text,
            fontSize: $scope.selectedObjConfig.selectedTextSize,
            fontFamily: 'Calibri',
            fill: $scope.selectedObjConfig.selectedColorText,
            padding: 20,
            width: 200,
            listening: false,
            align: 'center'
        });
    }

    function drawArrowStyle(context, obj, isHitRegion = false) {
        context.beginPath();
        context.lineJoin = "round";
        context.lineCap = 'round';
        var pkt = obj.getAttr("points");
        context.lineWidth = isHitRegion ? 10 : obj.getAttr("strokeWidth");
        if (isHitRegion) obj.setAttr("strokeWidth", 10);
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
        if (isHitRegion) obj.setAttr("strokeWidth", 1);
    }

    function addToMultiSelect(obj) {
        var id = obj.getAttr('id');
        var isIn = false;
        var pos = 0;

        if ($scope.lastSelected) {
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                if ($scope.lastSelected.getAttr('id') == $scope.selectedItemList[i].getAttr('id')) {
                    isIn = true;
                    pos = i;
                    break;
                }
            }
            if (!isIn) {
                $scope.selectedItemList.push($scope.lastSelected);
            }
            $scope.lastSelected = null;
        }

        var isIn = false;
        var pos = 0;

        for (let i = 0; i < $scope.selectedItemList.length; i++) {
            if (id == $scope.selectedItemList[i].getAttr('id')) {
                isIn = true;
                pos = i;
                break;
            }
        }
        if (!isIn) {
            $scope.selectedItemList.push(obj);
        } else {
            $scope.selectedItemList.splice(pos, 1);
        }


        $scope.lastSelected = null;
        $scope.startPointSelectShape = null;
        $scope.endPointSelectShape = null;

        var isSameConfig = true;
        var confName = '';

        var shapes = selectedFrame.find(".movementObject");
        shapes.each(function(shape) {
            shape.stroke('transparent');
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                if ($scope.selectedItemList[i].getAttr("id") == shape.getAttr("id")) {
                    shape.strokeWidth(1);
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            }
        });


        var shapes = selectedFrame.find(".arrow");
        shapes.each(function(shape) {
            shape.stroke('white');
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                if ($scope.selectedItemList[i].getAttr("id") == shape.getAttr("id")) {
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            }
        });
        var shapes = selectedFrame.find(".shapes");
        shapes.each(function(shape) {
            var fillColor = shape.getAttr('fill');
            fillColor.replace('0.4', '1');
            shape.stroke(fillColor);
            for (let i = 0; i < $scope.selectedItemList.length; i++) {
                if ($scope.selectedItemList[i].getAttr("id") == shape.getAttr("id")) {
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            }
        });

        if (isSameConfig && $scope.selectedItemList.length > 0) {
            $scope.lastSelected = $scope.selectedItemList[0];
        }

        if (selectShapeLayer != null) {
            selectShapeLayer.destroy();
            selectShapeLayer = null;
        }
        $scope.showObjConfig();
        selectedFrame.draw();


    }

    function dragAllSelectedItem(idMain, offset) {

        var isIn = false;
        for (let x = 0; x < $scope.selectedItemList.length; x++) {
            var id = $scope.selectedItemList[x].getAttr('id');
            if (id == idMain) {
                isIn = true;
                break;
            }
        }
        if (!isIn) return;

        for (let x = 0; x < $scope.selectedItemList.length; x++) {
            var id = $scope.selectedItemList[x].getAttr('id');

            for (let z = 0; z < allObjectPerFrame[currentObjPerFrame].obj.length; z++) {
                if (allObjectPerFrame[currentObjPerFrame].obj[z].getAttr('id') == id) {
                    if (idMain == allObjectPerFrame[currentObjPerFrame].obj[z].getAttr('id')) break;
                    allObjectPerFrame[currentObjPerFrame].obj[z].setAttr("x", allObjectPerFrame[currentObjPerFrame].obj[z].getAttr("x") - offset.x);
                    allObjectPerFrame[currentObjPerFrame].obj[z].setAttr("y", allObjectPerFrame[currentObjPerFrame].obj[z].getAttr("y") - offset.y);
                    var txt = allObjectPerFrame[currentObjPerFrame].obj[z].getAttr("textObj");
                    txt.setAttr('x', allObjectPerFrame[currentObjPerFrame].obj[z].getAttr('x'));
                    txt.setAttr('y', allObjectPerFrame[currentObjPerFrame].obj[z].getAttr('y') + (allObjectPerFrame[currentObjPerFrame].obj[z].height() / 2) * allObjectPerFrame[currentObjPerFrame].obj[z].scale().x);
                }
            }

            for (let i = 0; i < allObjectPerFrame.length; i++) {
                var isFinded = false;

                if (!isFinded)
                    for (let z = 0; z < allObjectPerFrame[i].arrow.length; z++) {
                        if (allObjectPerFrame[i].arrow[z].getAttr('id') == id) {
                            isFinded = true;
                            if (idMain == allObjectPerFrame[i].arrow[z].getAttr('id') && i == currentObjPerFrame) break;
                            allObjectPerFrame[i].arrow[z].setAttr("x", allObjectPerFrame[i].arrow[z].getAttr("x") - offset.x);
                            allObjectPerFrame[i].arrow[z].setAttr("y", allObjectPerFrame[i].arrow[z].getAttr("y") - offset.y);
                            var txt = allObjectPerFrame[i].arrow[z].getAttr("textObj");
                            txt.setAttr('x', allObjectPerFrame[i].arrow[z].getAttr('points')[0].x + allObjectPerFrame[i].arrow[z].getAttr("x"));
                            txt.setAttr('y', allObjectPerFrame[i].arrow[z].getAttr('points')[0].y + allObjectPerFrame[i].arrow[z].getAttr("y"));
                        }
                    }
                if (!isFinded)
                    for (let z = 0; z < allObjectPerFrame[i].shapes.length; z++) {
                        if (allObjectPerFrame[i].shapes[z].getAttr('id') == id) {
                            if (idMain == allObjectPerFrame[i].shapes[z].getAttr('id') && i == currentObjPerFrame) break;
                            allObjectPerFrame[i].shapes[z].setAttr("x", allObjectPerFrame[i].shapes[z].getAttr("x") - offset.x);
                            allObjectPerFrame[i].shapes[z].setAttr("y", allObjectPerFrame[i].shapes[z].getAttr("y") - offset.y);
                            var txt = allObjectPerFrame[i].shapes[z].getAttr("textObj");
                            txt.setAttr('x', allObjectPerFrame[i].shapes[z].getAttr('arrowPoint')[0].x + allObjectPerFrame[i].shapes[z].getAttr("x"));
                            txt.setAttr('y', allObjectPerFrame[i].shapes[z].getAttr('arrowPoint')[0].y + allObjectPerFrame[i].shapes[z].getAttr("y"));
                        }
                    }
            }
        }

        drawBeforePositionPoint();
        updateNextFrameBeforePosition();

        if ($scope.turnOnRotation) rotateObject();
        if (anchorLayer != null) {
            anchorLayer.destroy();
            anchorLayer = null;
        }
    }

    function clickOnContent() {
        $scope.startPointSelectShape = null;
        $scope.endPointSelectShape = null;
        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD && $scope.selectedObjImg && $scope.canAddItem) {
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


            obj.hitFunc(function(context) {
                context.beginPath();
                var width = this.getWidth() * this.scaleX();
                var height = this.getHeight() * this.scaleX();
                var procW = 15;
                var procH = 15;
                context.rect(-procW, -procH, width + (procW * 2), height + (procH * 2));
                context.closePath();
                context.fillStrokeShape(this);
            });

            $scope.$apply(function() {
                $scope.lastSelected = obj;
            });

            var complexText = createTextB(mousePos.x / scale, (mousePos.y / scale) + (obj.height() / 2), $scope.selectedObjConfig && $scope.selectedObjConfig.text ? $scope.selectedObjConfig.text : "");
            mainLayer.add(complexText);
            obj.setAttr('textObj', complexText);

            obj.on('mousedown touchstart', function() {
                somethingIsDraw = true;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;
                obj.setAttr('draggable', true);
                if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                    $scope.selectedItemList = [];
                    selectObjStyle(this);
                    drawBeforePositionPoint();
                    updateNextFrameBeforePosition();
                    if ($scope.turnOnRotation) rotateObject();
                }
            });

            obj.on('click tap', function() {
                if ($scope.shiftPressed) {
                    addToMultiSelect(this);
                } else {
                    $scope.selectedItemList = [];
                    selectObjStyle(this);
                }
            });

            obj.on('dragmove', function() {
                var offset = {
                    x: multiDragPositionStart.x - this.attrs.x,
                    y: multiDragPositionStart.y - this.attrs.y
                }
                if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
                multiDragPositionStart = {
                    x: this.getAttr("x"),
                    y: this.getAttr("y")
                }
                var txtObj = obj.getAttr("textObj");
                txtObj.setAttr('x', obj.getAttr("x"));
                txtObj.setAttr('y', obj.getAttr("y") + (obj.height() / 2) * obj.scale().x);
                obj.setAttr('textObj', txtObj);
                mainLayer.draw();
            });

            obj.on('dragstart', function() {
                multiDragPositionStart = {
                    x: this.getAttr("x"),
                    y: this.getAttr("y")
                }
                somethingIsDraw = true;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;
            });

            obj.on('touchstart', function() {
                somethingIsDraw = true;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;
            });

            obj.on('mouseup', function() {
                somethingIsDraw = false;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;
            });

            obj.on('touchend', function() {
                somethingIsDraw = false;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;
            });

            obj.on('dragend', function(e) {
                somethingIsDraw = false;
                $scope.startPointSelectShape = null;
                $scope.endPointSelectShape = null;

                if ($scope.selectedItemList.length <= 1) {
                    drawBeforePositionPoint();
                    updateNextFrameBeforePosition();
                    if ($scope.turnOnRotation) rotateObject();
                }
            });

            obj.strokeWidth(1);
            selectObjStyle(obj);

            // add the shape to the mainLayer
            mainLayer.add(obj);
            allObjectPerFrame[currentObjPerFrame].obj.push(obj);

            for (let z = currentObjPerFrame + 1; z < allObjectPerFrame.length; z++) {
                allObjectPerFrame[z].obj.push(createObjFromOther(obj));
            }

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
                    draggable: true,
                    config: $.extend(true, {}, $scope.selectedObjConfig),
                    sceneFunc: function(context) {
                        drawArrowStyle(context, this);
                    }
                });
                selectObjStyle(arrow);

                arrow.hitFunc(function(context) {
                    drawArrowStyle(context, this, true);
                });

                if (anchorLayer) {
                    anchorLayer.destroy();
                    anchorLayer = null;
                }
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
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                    if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                        $scope.selectedItemList = [];
                        selectObjStyle(this);
                    }
                    if (anchorLayer) {
                        anchorLayer.destroy();
                        anchorLayer = null;
                    }
                    anchorLayer = new Konva.Layer();
                    selectedFrame.add(anchorLayer);
                    $scope.arrowArrayPostionAnchor = this.getAttr('points');
                    for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                        createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, this, index);
                    }
                    selectedFrame.draw();
                });

                arrow.on('dragmove', function() {
                    somethingIsDraw = true;
                    var offset = {
                        x: multiDragPositionStart.x - this.attrs.x,
                        y: multiDragPositionStart.y - this.attrs.y
                    }

                    if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
                    multiDragPositionStart = {
                        x: this.getAttr("x"),
                        y: this.getAttr("y")
                    }
                    var textObj = this.getAttr("textObj");
                    var pt = this.getAttr("points");
                    textObj.setAttr('x', this.getAttr("x") + pt[0].x);
                    textObj.setAttr('y', this.getAttr("y") + pt[0].y);
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                    if (anchorLayer) {
                        anchorLayer.destroy();
                        anchorLayer = null;
                    }
                    anchorLayer = new Konva.Layer();
                    selectedFrame.add(anchorLayer);
                    $scope.arrowArrayPostionAnchor = this.getAttr('points');
                    for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                        createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, this, index);
                    }
                    selectedFrame.draw();
                });

                arrow.on('click tap', function() {
                    if ($scope.shiftPressed) {
                        addToMultiSelect(this);
                    } else {
                        $scope.selectedItemList = [];
                        selectObjStyle(this);
                    }
                });

                arrow.on('dragstart', function() {
                    multiDragPositionStart = {
                        x: this.getAttr("x"),
                        y: this.getAttr("y")
                    }
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                arrow.on('touchstart', function() {
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                arrow.on('dragend', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                arrow.on('mouseup', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                    var id = this.getAttr('id');
                    for (let i = 0; i < allObjectPerFrame.length; i++) {
                        for (let y = 0; y < allObjectPerFrame[i].arrow.length; y++) {
                            if (id == allObjectPerFrame[i].arrow[y].getAttr("id")) {
                                allObjectPerFrame[i].arrow[y].setAttr("x", this.getAttr('x'));
                                allObjectPerFrame[i].arrow[y].setAttr("y", this.getAttr('y'));
                            }
                        }
                    }
                });

                arrow.on('touchend', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                mainLayer.add(arrow);
                allObjectPerFrame[currentObjPerFrame].arrow.push(arrow);
                for (let z = currentObjPerFrame + 1; z < allObjectPerFrame.length; z++) {
                    allObjectPerFrame[z].arrow.push(createObjFromOther(arrow));
                }

                selectedFrame.find(".arrow").each(function(shape) {
                    shape.on('mouseenter', function() {
                        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
                            selectedFrame.container().style.cursor = 'move';
                        }
                    });
                    shape.on('mouseleave', function() {
                        selectedFrame.container().style.cursor = 'default';
                    });
                });

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
                    draggable: true,
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
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                    if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                        $scope.selectedItemList = [];
                        selectObjStyle(this);
                    }
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

                triangle.on('dragmove', function() {
                    somethingIsDraw = true;
                    var offset = {
                        x: multiDragPositionStart.x - this.attrs.x,
                        y: multiDragPositionStart.y - this.attrs.y
                    }
                    if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
                    multiDragPositionStart = {
                        x: this.getAttr("x"),
                        y: this.getAttr("y")
                    }
                    var textObj = this.getAttr("textObj")
                    var pt = this.getAttr("arrowPoint");
                    textObj.setAttr('x', this.getAttr("x") + pt[0].x);
                    textObj.setAttr('y', this.getAttr("y") + pt[0].y);
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
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

                triangle.on('click tap', function() {
                    if ($scope.shiftPressed) {
                        addToMultiSelect(this);
                    } else {
                        $scope.selectedItemList = [];
                        selectObjStyle(this);
                    }
                });

                triangle.on('dragstart', function() {
                    multiDragPositionStart = {
                        x: this.getAttr("x"),
                        y: this.getAttr("y")
                    }
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                triangle.on('touchstart', function() {
                    somethingIsDraw = true;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                triangle.on('dragend', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                    var id = this.getAttr('id');
                    for (let i = 0; i < allObjectPerFrame.length; i++) {
                        for (let y = 0; y < allObjectPerFrame[i].shapes.length; y++) {
                            if (id == allObjectPerFrame[i].shapes[y].getAttr("id")) {
                                allObjectPerFrame[i].shapes[y].setAttr("x", this.getAttr('x'));
                                allObjectPerFrame[i].shapes[y].setAttr("y", this.getAttr('y'));
                            }
                        }
                    }
                });

                triangle.on('mouseup', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                triangle.on('touchend', function() {
                    somethingIsDraw = false;
                    $scope.startPointSelectShape = null;
                    $scope.endPointSelectShape = null;
                });

                allObjectPerFrame[currentObjPerFrame].shapes.push(triangle);

                for (let z = currentObjPerFrame + 1; z < allObjectPerFrame.length; z++) {
                    allObjectPerFrame[z].triangle.push(createObjFromOther(triangle));
                }


                selectedFrame.find(".shapes").each(function(shape) {
                    shape.on('mouseenter', function() {
                        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
                            selectedFrame.container().style.cursor = 'move';
                        }
                    });
                    shape.on('mouseleave', function() {
                        selectedFrame.container().style.cursor = 'default';
                    });
                });

                $scope.$apply(function() {
                    $scope.changeCategories($scope.mouseActionType.MOVE);
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


            selectObjStyle(obj);

            // add the shape to the mainLayer
            mainLayer.add(obj);

            selectedFrame.draw();

            obj.on('dblclick', function() {
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
                textarea.className = "textToEditInCv";
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
                $(document).off('keydown', '.textToEditInCv');
                $(document).on('keydown', '.textToEditInCv', function(e) {
                    if (e.keyCode === 13) {
                        obj.text(textarea.value);
                        selectedFrame.draw();
                        document.body.removeChild(textarea);
                    }
                });
            })
            allObjectPerFrame[currentObjPerFrame].text.push(obj);
            for (let z = currentObjPerFrame + 1; z < allObjectPerFrame.length; z++) {
                allObjectPerFrame[z].text.push(createObjFromOther(text));
            }
            $scope.$apply(function() {
                $scope.changeCategories($scope.mouseActionType.MOVE);
            });
        }
    }


    function createArrowObjFromOther(other, isNoObj = false) {
        var arrow;
        if (!isNoObj) {
            var lastText = other.getAttr("textObj");
            var complexText = new Konva.Text({
                x: lastText.getAttr('x'),
                y: lastText.getAttr('y'),
                offsetX: lastText.getAttr('offsetX'),
                offsetY: lastText.getAttr('offsetY'),
                text: lastText.getAttr('text'),
                fontSize: lastText.getAttr('fontSize'),
                fontFamily: 'Calibri',
                fill: lastText.getAttr('fill'),
                padding: 20,
                width: 200,
                align: 'center'
            });
            if (other.getAttr("points")[1] < other.getAttr("points")[3]) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            arrow = new Konva.Shape({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
                points: other.getAttr("points"),
                stroke: other.getAttr("stroke"),
                strokeWidth: other.getAttr("strokeWidth"),
                sceneFunc: function(context) {
                    drawArrowStyle(context, this);
                },
                id: other.getAttr("id"),
                textObj: complexText,
                draggable: true,
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
                x: other.attrs.x,
                y: other.attrs.y,
                points: other.attrs.points,
                stroke: other.attrs.stroke,
                strokeWidth: other.attrs.strokeWidth,
                sceneFunc: function(context) {
                    drawArrowStyle(context, this);
                },
                id: other.attrs.id,
                draggable: true,
                textObj: complexText,
                name: 'arrow',
                config: other.attrs.config
            });
        }
        if (mainLayer) mainLayer.add(complexText);
        arrow.off('mousedown touchstart');
        arrow.on('mousedown touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                $scope.selectedItemList = [];
                selectObjStyle(this);
            }
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
        arrow.off('click tap');
        arrow.on('click tap', function() {
            if ($scope.shiftPressed) {
                addToMultiSelect(this);
            } else {
                $scope.selectedItemList = [];
                selectObjStyle(this);
            }
        });
        arrow.off('dragmove');
        arrow.on('dragmove', function() {
            somethingIsDraw = true;
            var offset = {
                x: multiDragPositionStart.x - this.attrs.x,
                y: multiDragPositionStart.y - this.attrs.y
            }
            if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            var textObj = this.getAttr("textObj")
            var pt = this.getAttr("points");
            textObj.setAttr('x', this.getAttr("x") + pt[0].x);
            textObj.setAttr('y', this.getAttr("y") + pt[0].y);
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if (anchorLayer) {
                anchorLayer.destroy();
                anchorLayer = null;
            }
            anchorLayer = new Konva.Layer();
            selectedFrame.add(anchorLayer);
            $scope.arrowArrayPostionAnchor = this.getAttr('points');
            for (var index = 0; index < $scope.arrowArrayPostionAnchor.length; index++) {
                createAnchorToArrow($scope.arrowArrayPostionAnchor[index].x, $scope.arrowArrayPostionAnchor[index].y, this, index);
            }

            selectedFrame.draw();
        });

        arrow.off('dragstart');
        arrow.off('touchstart');
        arrow.off('mouseup');
        arrow.off('touchend');
        arrow.off('dragend');
        arrow.on('dragstart', function() {
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        arrow.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        arrow.on('dragend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            var id = this.getAttr('id');
            for (let i = 0; i < allObjectPerFrame.length; i++) {
                for (let y = 0; y < allObjectPerFrame[i].arrow.length; y++) {
                    if (id == allObjectPerFrame[i].arrow[y].getAttr("id")) {
                        allObjectPerFrame[i].arrow[y].setAttr("x", this.getAttr('x'));
                        allObjectPerFrame[i].arrow[y].setAttr("y", this.getAttr('y'));
                    }
                }
            }
        });

        arrow.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        arrow.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        arrow.hitFunc(function(context) {
            drawArrowStyle(context, this, true);
        });

        return arrow;
    }

    function createObjFromOther(other, isNoObj = false) {
        var obj;

        if (!isNoObj) {
            var lastText = other.getAttr("textObj");
            var complexText = new Konva.Text({
                x: lastText.getAttr('x'),
                y: lastText.getAttr('y'),
                offsetX: lastText.getAttr('offsetX'),
                offsetY: lastText.getAttr('offsetY'),
                text: lastText.getAttr('text'),
                fontSize: lastText.getAttr('fontSize'),
                fontFamily: 'Calibri',
                fill: lastText.getAttr('fill'),
                padding: 20,
                width: 200,
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
                y: other.attrs.y + other.attrs.height / 4,
                offsetX: 100,
                offsetX: other.attrs.offsetX,
                offsetY: other.attrs.offsetY,
                text: (other.attrs.config && other.attrs.config.text) ? other.attrs.config.text : "",
                fontSize: (other.attrs.config && other.attrs.config.selectedTextSize) ? other.attrs.config.selectedTextSize : 17,
                fontFamily: 'Calibri',
                fill: (other.attrs.config && other.attrs.config.selectedColorText) ? other.attrs.config.selectedColorText : "rgb(255,255,255)",
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
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                $scope.selectedItemList = [];
                selectObjStyle(this);
                drawBeforePositionPoint();
                updateNextFrameBeforePosition();
                if ($scope.turnOnRotation) rotateObject();
            }
        });
        obj.hitFunc(function(context) {
            context.beginPath();
            var width = this.getWidth() * this.scaleX();
            var height = this.getHeight() * this.scaleX();
            var procW = 15;
            var procH = 15;
            context.rect(-procW, -procH, width + (procW * 2), height + (procH * 2));
            context.closePath();
            context.fillStrokeShape(this);
        });
        obj.off('click tap');
        obj.on('click tap', function() {
            if ($scope.shiftPressed) {
                addToMultiSelect(this);
            } else {
                $scope.selectedItemList = [];
                selectObjStyle(this);
            }
        });
        obj.off('dragmove');
        obj.on('dragmove', function() {
            var offset = {
                x: multiDragPositionStart.x - this.attrs.x,
                y: multiDragPositionStart.y - this.attrs.y
            }
            if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            var txtObj = obj.getAttr("textObj");
            txtObj.setAttr('x', obj.getAttr("x"));
            txtObj.setAttr('y', obj.getAttr("y") + obj.height() / 2);
            obj.setAttr('textObj', txtObj);
            mainLayer.draw();
        });
        obj.off('dragstart');
        obj.off('touchstart');
        obj.off('mouseup');
        obj.off('touchend');
        obj.off('dragend');
        obj.on('dragstart', function() {
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        obj.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        obj.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        obj.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        obj.on('dragend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if ($scope.selectedItemList.length <= 1) {
                drawBeforePositionPoint();
                updateNextFrameBeforePosition();
                if ($scope.turnOnRotation) rotateObject();
            }
        });
        return obj;
    }

    function createShapeObjFromOther(other, isNoObj = false) {
        var shape;
        if (!isNoObj) {
            var lastText = other.getAttr("textObj");
            var complexText = new Konva.Text({
                x: lastText.getAttr('x'),
                y: lastText.getAttr('y'),
                offsetX: lastText.getAttr('offsetX'),
                offsetY: lastText.getAttr('offsetY'),
                text: lastText.getAttr('text'),
                fontSize: lastText.getAttr('fontSize'),
                fontFamily: 'Calibri',
                fill: lastText.getAttr('fill'),
                padding: 20,
                width: 200,
                align: 'center'
            });
            if (other.getAttr("arrowPoint")[0].y < other.getAttr("arrowPoint")[1].y) complexText.setAttr('offsetY', 50);
            else complexText.setAttr('offsetY', 10);
            shape = new Konva.Shape({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
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
                draggable: true,
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
                x: other.attrs.x,
                y: other.attrs.y,
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
                draggable: true,
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
        shape.off('click tap');
        shape.on('click tap', function() {
            if ($scope.shiftPressed) {
                addToMultiSelect(this);
            } else {
                $scope.selectedItemList = [];
                selectObjStyle(this);
            }
        });
        shape.off('mousedown touchstart');
        shape.on('mousedown touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if ($scope.shiftPressed) {} else if ($scope.selectedItemList.length <= 0) {
                $scope.selectedItemList = [];
                selectObjStyle(this);
            }
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

        shape.off('dragmove');
        shape.on('dragmove', function() {
            var offset = {
                x: multiDragPositionStart.x - this.attrs.x,
                y: multiDragPositionStart.y - this.attrs.y
            }
            if ($scope.selectedItemList.length > 0) dragAllSelectedItem(this.getAttr('id'), offset);
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            var textObj = this.getAttr("textObj")
            var pt = this.getAttr("arrowPoint");
            textObj.setAttr('x', this.getAttr("x") + pt[0].x);
            textObj.setAttr('y', this.getAttr("y") + pt[0].y);
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
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
        shape.off('dragstart');
        shape.off('touchstart');
        shape.off('mouseup');
        shape.off('touchend');
        shape.off('dragend');
        shape.on('dragstart', function() {
            multiDragPositionStart = {
                x: this.getAttr("x"),
                y: this.getAttr("y")
            }
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        shape.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        shape.on('dragend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            var id = this.getAttr('id');
            for (let i = 0; i < allObjectPerFrame.length; i++) {
                for (let y = 0; y < allObjectPerFrame[i].shapes.length; y++) {
                    if (id == allObjectPerFrame[i].shapes[y].getAttr("id")) {
                        allObjectPerFrame[i].shapes[y].setAttr("x", this.getAttr('x'));
                        allObjectPerFrame[i].shapes[y].setAttr("y", this.getAttr('y'));
                    }
                }
            }
        });

        shape.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        shape.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
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
        $scope.selectedItemList = [];
        selectObjStyle(null);
        allObjectPerFrame.push({ arrow: [], obj: [], shapes: [], text: [] });
        var beforeFrameNumber = allObjectPerFrame.length - 2;
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

    $scope.deleteFrame = function() {
        if (allObjectPerFrame.length <= 1) {
            notify.localNotify("Uwaga", "Nie można usunąć jedynej klatki animacji");
            return;
        }
        $rootScope.showModalWindow("Nieodwracalnie usunie klatkę animacji wraz z zawartością", function() {
            var frame = allObjectPerFrame.length - 1;
            allObjectPerFrame.splice(frame, 1);
            $(".timeElement").last().remove();
            for (let i = 0; i < anchorHistory.length; i++) {
                if (anchorHistory[i].frame == frame) {
                    anchorHistory.splice(i, 1);
                    break;
                }
            }
            changeFrame(frame - 1);
            drawNewStage();
        });
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
        $scope.selectedItemList = [];
        if ($scope.onlyPlayer) container = 'canvasPlayerContainer';
        if (mainLayer != null) {
            selectedFrame.off('contentClick contentTap');
            selectedFrame.destroy();
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

            selectedFrame.on('mousedown touchstart', function(e) {
                onMuseDown();
            });

            selectedFrame.on('mousemove touchmove', function(e) {
                onMuseMove();
            });

            selectedFrame.on('mouseup touchend', function(e) {
                onMuseUp();
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

            selectedFrame.find(".arrow").each(function(shape) {
                shape.on('mouseenter', function() {
                    if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
                        selectedFrame.container().style.cursor = 'move';
                    }
                });
                shape.on('mouseleave', function() {
                    selectedFrame.container().style.cursor = 'default';
                });
            });

            selectedFrame.find(".shapes").each(function(shape) {
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

    function redrawMultiSelectShape() {
        $scope.$apply(function() {
            if (selectShapeLayer != null) {
                selectShapeLayer.destroy();
                selectShapeLayer = null;
            }
            selectShapeLayer = new Konva.Layer();

            var start = $scope.startPointSelectShape;
            var end = $scope.endPointSelectShape;

            var poly = new Konva.Line({
                points: [start.x, start.y, end.x, start.y, end.x, end.y, start.x, end.y],
                fill: 'rgba(63, 127, 191, 0.25)',
                stroke: 'rgb(63, 127, 191)',
                strokeWidth: 2,
                closed: true
            });

            selectShapeLayer.add(poly);
            selectedFrame.add(selectShapeLayer);
        });
    }

    function selectFromMultiSelectShape() {
        if (!$scope.startPointSelectShape || !$scope.endPointSelectShape) return;

        if (anchorLayer) {
            anchorLayer.destroy();
            anchorLayer = null;
        }
        anchorLayer = new Konva.Layer();

        $scope.$apply(function() {
            var maxX = Math.max($scope.startPointSelectShape.x, $scope.endPointSelectShape.x);
            var minX = Math.min($scope.startPointSelectShape.x, $scope.endPointSelectShape.x);
            var maxY = Math.max($scope.startPointSelectShape.y, $scope.endPointSelectShape.y);
            var minY = Math.min($scope.startPointSelectShape.y, $scope.endPointSelectShape.y);
            $scope.lastSelected = null;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            $scope.selectedItemList = [];

            var isSameConfig = true;
            var confName = '';

            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.stroke('transparent');
                var x = shape.getAttr("x");
                var y = shape.getAttr("y");
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    $scope.selectedItemList.push(shape);
                    shape.strokeWidth(1);
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            });


            var shapes = selectedFrame.find(".arrow");
            shapes.each(function(shape) {
                shape.stroke('white');
                var x = shape.getAttr("x");
                var y = shape.getAttr("y");
                var shapePoint = shape.getAttr("points");

                var isAllInSelectShape = true;

                for (let a = 0; a < shapePoint.length; a++) {
                    if (!((shapePoint[a].x + x) >= minX && (shapePoint[a].x + x) <= maxX && (shapePoint[a].y + y) >= minY && (shapePoint[a].y + y) <= maxY)) {
                        isAllInSelectShape = false;
                        break;
                    }
                }

                if (isAllInSelectShape) {
                    $scope.selectedItemList.push(shape);
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            });
            var shapes = selectedFrame.find(".shapes");
            shapes.each(function(shape) {
                var fillColor = shape.getAttr('fill');
                fillColor.replace('0.4', '1');
                shape.stroke(fillColor);
                var x = shape.getAttr("x");
                var y = shape.getAttr("y");
                var shapePoint = shape.getAttr("arrowPoint");
                var isAllInSelectShape = true;

                for (let a = 0; a < shapePoint.length; a++) {
                    if (!((shapePoint[a].x + x) >= minX && (shapePoint[a].x + x) <= maxX && (shapePoint[a].y + y) >= minY && (shapePoint[a].y + y) <= maxY)) {
                        isAllInSelectShape = false;
                        break;
                    }
                }

                if (isAllInSelectShape) {
                    $scope.selectedItemList.push(shape);
                    shape.stroke('red');
                    var config = shape.getAttr("config");
                    if (!config) isSameConfig = false;
                    else {
                        if (confName == '') {
                            confName = config.confName;
                        } else if (confName != config.confName) {
                            isSameConfig = false;
                        }
                    }
                }
            });


            if (isSameConfig && $scope.selectedItemList.length > 0) {
                $scope.lastSelected = $scope.selectedItemList[0];
                showInConfigObjData($scope.selectedItemList[0]);
            }

            if (selectShapeLayer != null) {
                selectShapeLayer.destroy();
                selectShapeLayer = null;
            }
            $scope.showObjConfig();
            selectedFrame.draw();
        });
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

    function drawBeforePositionPointAllVersion(itemToDrawBef) {
        if (currentObjPerFrame <= 0 || itemToDrawBef == null ||
            itemToDrawBef.getAttr('name') !== 'movementObject') return;

        var id = itemToDrawBef.getAttr('id');
        var lastObj = null;

        for (var i = 0; i < allObjectPerFrame[currentObjPerFrame - 1].obj.length; i++) {
            var obb = allObjectPerFrame[currentObjPerFrame - 1].obj[i].getAttr("id");
            if (obb == id) {
                lastObj = allObjectPerFrame[currentObjPerFrame - 1].obj[i];
                break;
            }
        }
        if (lineLayer) lineLayer.destroy();
        if (anchorLayer) anchorLayer.destroy();
        if (anchorLayer) curveLayer.destroy();
        anchorLayer = new Konva.Layer();
        curveLayer = new Konva.Layer();
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
            anchorLayer.add(quadLine);

            if (isAnchorHistoryFor(currentObjPerFrame, id)) {
                var history = getAnchorHistoryFor(currentObjPerFrame, id);
                var newo = {
                    x: itemToDrawBef.getAttr("x"),
                    y: itemToDrawBef.getAttr("y")
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
                    x: itemToDrawBef.getAttr("x"),
                    y: itemToDrawBef.getAttr("y")
                };
                quadCurves = {
                    start: createAnchorPoint(last.x, last.y, 'start'),
                    control: createAnchorPoint(Math.min(last.x, newo.x) + Math.abs(last.x - newo.x) / 2.0, Math.min(last.y, newo.y) + Math.abs(last.y - newo.y) / 2.0, 'ster'),
                    end: createAnchorPoint(newo.x, newo.y, 'end')
                };
            }

            saveAnchorPoint(currentObjPerFrame, itemToDrawBef, quadCurves);

            if (quadCurves.start.getAttr("x") == quadCurves.end.getAttr("x") &&
                quadCurves.start.getAttr("y") == quadCurves.end.getAttr("y")) return;


            if ($scope.turnOnRotation) rotateObject();
            selectedFrame.draw();
        } else {
            quadCurves = null;
        }
    }

    function drawBeforePositionPoint() {
        if ($scope.selectedItemList.length > 0) {
            for (let d = 0; d < $scope.selectedItemList.length; d++) {
                drawBeforePositionPointAllVersion($scope.selectedItemList[d]);
            }
        } else {
            drawBeforePositionPointAllVersion($scope.lastSelected);
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
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
            if (type == 'ster') {
                saveAnchorPoint();
                drawCurves();
                updateDottedLines();
                if ($scope.turnOnRotation) rotateObject();
            }
        });

        anchor.on('dragstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchstart', function() {
            somethingIsDraw = true;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('mouseup', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });

        anchor.on('touchend', function() {
            somethingIsDraw = false;
            $scope.startPointSelectShape = null;
            $scope.endPointSelectShape = null;
        });
        anchorLayer.add(anchor);
        return anchor;
    }

    function drawCurves() {
        if (quadCurves && $scope.selectedItemList.length <= 1) {
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
            if (!(anchorLayer && anchorLayer.get('#quadLine').length > 0)) return;
            var quadLine = anchorLayer.get('#quadLine')[0];
            quadLine.setPoints([q.start.attrs.x, q.start.attrs.y, q.control.attrs.x, q.control.attrs.y, q.end.attrs.x, q.end.attrs.y]);
        }
    }

    function saveAnchorPoint(currentFrame = null, element = null, quadCurv = null) {
        if (!$scope.lastSelected && !element) return;
        var quadCurvess = quadCurv ? quadCurv : quadCurves;

        var el = element ? element : $scope.lastSelected;
        if (!el) return;

        if (quadCurvess.start.getAttr("x") == quadCurvess.end.getAttr("x") &&
            quadCurvess.start.getAttr("y") == quadCurvess.end.getAttr("y")) return;

        var anchorToSave = {
            start: {
                x: quadCurvess.start.getAttr("x"),
                y: quadCurvess.start.getAttr("y"),
            },
            control: {
                x: quadCurvess.control.getAttr("x"),
                y: quadCurvess.control.getAttr("y"),
            },
            end: {
                x: el.getAttr("x"),
                y: el.getAttr("y"),
            }
        };
        saveToAnchorHistory(currentFrame ? currentFrame : currentObjPerFrame, el.getAttr("id"), anchorToSave);
        if ($scope.turnOnRotation) rotateObject();

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
        if ($scope.selectedItemList.length > 0) {
            for (let x = 0; x < $scope.selectedItemList.length; x++) {
                var id = $scope.selectedItemList[x].getAttr("id");
                if (isAnchorHistoryFor(currentObjPerFrame, id)) {
                    var actual = getAnchorHistoryFor(currentObjPerFrame, id);
                    var p1 = getPosOnCurves(actual.start, actual.control, actual.end, 0.9);
                    var p2 = getPosOnCurves(actual.start, actual.control, actual.end, 1);
                    var rotOffset = 0;
                    if (p1.x > p2.x) rotOffset = 180;
                    var a = (p2.y - p1.y) / (p2.x - p1.x);
                    var degree = ((Math.atan(a) * 180) / Math.PI);
                    $scope.selectedItemList[x].rotation(degree + rotOffset);
                } else if (isAnchorHistoryFor(currentObjPerFrame + 1, id)) {
                    var actual = getAnchorHistoryFor(currentObjPerFrame + 1, id);
                    var p1 = getPosOnCurves(actual.start, actual.control, actual.end, 0);
                    var p2 = getPosOnCurves(actual.start, actual.control, actual.end, 0.1);
                    var rotOffset = 0;
                    if (p1.x > p2.x) rotOffset = 180;
                    var a = (p2.y - p1.y) / (p2.x - p1.x);
                    var degree = ((Math.atan(a) * 180) / Math.PI);
                    $scope.selectedItemList[x].rotation(degree + rotOffset);
                }
                selectedFrame.draw();
                showInConfigObjData($scope.selectedItemList[x]);
            }
        } else {
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
                        var lastText = arrows[z].getAttr("textObj");
                        var complexText = new Konva.Text({
                            x: lastText.getAttr('x'),
                            y: lastText.getAttr('y'),
                            offsetX: lastText.getAttr('offsetX'),
                            offsetY: lastText.getAttr('offsetY'),
                            text: lastText.getAttr('text'),
                            fontSize: lastText.getAttr('fontSize'),
                            fontFamily: 'Calibri',
                            fill: lastText.getAttr('fill'),
                            padding: 20,
                            width: 200,
                            align: 'center'
                        });
                        if (arrows[z].getAttr("points")[0].y < arrows[z].getAttr("points")[1].y) complexText.setAttr('offsetY', 50);
                        else complexText.setAttr('offsetY', 10);
                        var arrow = new Konva.Shape({
                            x: arrows[z].getAttr("x"),
                            y: arrows[z].getAttr("y"),
                            offsetX: arrows[z].getAttr('offsetX'),
                            offsetY: arrows[z].getAttr('offsetY'),
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
                        var lastText = shapes[z].getAttr("textObj");
                        var complexText = new Konva.Text({
                            x: lastText.getAttr('x'),
                            y: lastText.getAttr('y'),
                            offsetX: lastText.getAttr('offsetX'),
                            offsetY: lastText.getAttr('offsetY'),
                            text: lastText.getAttr('text'),
                            fontSize: lastText.getAttr('fontSize'),
                            fontFamily: 'Calibri',
                            fill: lastText.getAttr('fill'),
                            padding: 20,
                            width: 200,
                            align: 'center'
                        });
                        var shape = new Konva.Shape({
                            x: shapes[z].getAttr("x"),
                            y: shapes[z].getAttr("y"),
                            offsetX: shapes[z].getAttr('offsetX'),
                            offsetY: shapes[z].getAttr('offsetY'),
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
                            config: text[z].getAttr("config")
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

                            var lastText = objs[z].getAttr("textObj");
                            var complexText = new Konva.Text({
                                x: p1.x,
                                y: p1.y + objs[z].height() / 2,
                                offsetX: lastText.getAttr('offsetX'),
                                offsetY: lastText.getAttr('offsetY'),
                                text: lastText.getAttr('text'),
                                fontSize: lastText.getAttr('fontSize'),
                                fontFamily: 'Calibri',
                                fill: lastText.getAttr('fill'),
                                padding: 20,
                                width: 200,
                                align: 'center'
                            });
                            var obj = new Konva.Image({
                                x: p1.x,
                                y: p1.y,
                                offsetX: objs[z].getAttr("offsetX"),
                                offsetY: objs[z].getAttr("offsetY"),
                                rotation: ($scope.turnOnRotation) ? degree : objs[z].getAttr("rotation"),
                                image: objs[z].getAttr("image"),
                                scale: objs[z].getAttr("scale"),
                                name: objs[z].getAttr("name"),
                                id: objs[z].getAttr("id"),
                                config: objs[z].getAttr("config"),
                                textObj: complexText
                            });
                        } else {
                            var lastText = objs[z].getAttr("textObj");
                            var complexText = new Konva.Text({
                                x: lastText.getAttr('x'),
                                y: lastText.getAttr('y'),
                                offsetX: lastText.getAttr('offsetX'),
                                offsetY: lastText.getAttr('offsetY'),
                                text: lastText.getAttr('text'),
                                fontSize: lastText.getAttr('fontSize'),
                                fontFamily: 'Calibri',
                                fill: lastText.getAttr('fill'),
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
                    var lastText = arrows[z].getAttr("textObj");
                    var complexText = new Konva.Text({
                        x: lastText.getAttr('x'),
                        y: lastText.getAttr('y'),
                        offsetX: lastText.getAttr('offsetX'),
                        offsetY: lastText.getAttr('offsetY'),
                        text: lastText.getAttr('text'),
                        fontSize: lastText.getAttr('fontSize'),
                        fontFamily: 'Calibri',
                        fill: lastText.getAttr('fill'),
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    if (arrows[z].getAttr("points")[0].y < arrows[z].getAttr("points")[1].y) complexText.setAttr('offsetY', 50);
                    else complexText.setAttr('offsetY', 10);
                    var arrow = new Konva.Shape({
                        x: arrows[z].getAttr("x"),
                        y: arrows[z].getAttr("y"),
                        offsetX: arrows[z].getAttr('offsetX'),
                        offsetY: arrows[z].getAttr('offsetY'),
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
                    var lastText = shapes[z].getAttr("textObj");
                    var complexText = new Konva.Text({

                        x: lastText.getAttr('x'),
                        y: lastText.getAttr('y'),
                        offsetX: lastText.getAttr('offsetX'),
                        offsetY: lastText.getAttr('offsetY'),
                        text: lastText.getAttr('text'),
                        fontSize: lastText.getAttr('fontSize'),
                        fontFamily: 'Calibri',
                        fill: lastText.getAttr('fill'),
                        padding: 20,
                        width: 200,
                        align: 'center'
                    });
                    var shape = new Konva.Shape({
                        x: shapes[z].getAttr("x"),
                        y: shapes[z].getAttr("y"),
                        offsetX: shapes[z].getAttr('offsetX'),
                        offsetY: shapes[z].getAttr('offsetY'),
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
                        config: text[z].getAttr("config")
                    });
                    textArray.push(obj);
                }

                objectArrays = []
                for (var z = 0; z < objs.length; z++) {
                    var lastText = objs[z].getAttr("textObj");
                    var complexText = new Konva.Text({
                        x: lastText.getAttr('x'),
                        y: lastText.getAttr('y'),
                        offsetX: lastText.getAttr('offsetX'),
                        offsetY: lastText.getAttr('offsetY'),
                        text: lastText.getAttr('text'),
                        fontSize: lastText.getAttr('fontSize'),
                        fontFamily: 'Calibri',
                        fill: lastText.getAttr('fill'),
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
        changeFrame(allObjectPerFrame.length - 1);
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
            anchorHistory = null;
            anchorHistory = data.anchorHistory;

            allObjectPerFrame = null;
            allObjectPerFrame = [];

            $scope.cwName = data.name;
            $scope.cwFieldType = data.cwFieldType;
            $scope.cwMaxTime = parseInt(data.cwMaxTime);
            $scope.cwMinTime = parseInt(data.cwMinTime);
            $scope.cwMaxPerson = parseInt(data.cwMaxPerson);
            $scope.cwMinPerson = parseInt(data.cwMinPerson);
            $scope.cwOps = data.cwOps;
            $scope.cwWsk = data.cwWsk;
            $scope.iloscklatekPomiedzyGlownymi = parseInt(data.frameBeetween);
            $scope.jakoscAnimacji = parseInt(data.qualityAnim);
            $scope.iloscfps = parseInt(data.fps);

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

        if (!$scope.cwMaxTime || $scope.cwMaxTime.length <= 0 || $scope.cwMaxTime < $scope.cwMinTime || $scope.cwMaxTime > 1000 || !$.isNumeric($scope.cwMaxTime)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie maksymalny czas trwania ( wiecej niż " + $scope.cwMinTime + " mniej niż 1000 )");
            return;
        }

        if (!$scope.cwMinPerson || $scope.cwMinPerson.length <= 0 || $scope.cwMinPerson <= 0 || !$.isNumeric($scope.cwMinPerson)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie minimalną ilość zawodników ( więcej niż 0 )");
            return;
        }

        if (!$scope.cwMaxPerson || $scope.cwMaxPerson.length <= 0 || $scope.cwMaxPerson < $scope.cwMinPerson || $scope.cwMaxPerson > 100 || !$.isNumeric($scope.cwMaxPerson)) {
            notify.localNotify("Walidacja", "Wpisz poprawnie maksymalną ilość zawodników ( wiecej niż " + $scope.cwMinPerson + " mniej niż 100 )");
            return;
        }

        if (!$scope.tags || $scope.tags.length < 2) {
            notify.localNotify("Walidacja", "Wpisz przynajmniej dwie frazy, z którymi będzie kojarzone dane ćwiczenie");
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