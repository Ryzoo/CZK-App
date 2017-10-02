app.controller('conspectusCreatorController', function($scope, auth, $rootScope, notify, request, $location) {
    $scope.selectedObjImg = null;
    $scope.selectedField = null;
    $scope.selectedArrow = null;
    $scope.arrowPointCount = 0;
    $scope.arrowPoint = [];
    $scope.lastSelected = null;
    $scope.fieldImage = null;
    $scope.onlyPlayer = false;
    $scope.orientation = 'landscape';
    $scope.animId = -1;

    $scope.cwName = '';
    $scope.tags = '';
    $scope.cwFieldType = '';
    $scope.cwMaxTime = 0;
    $scope.cwMinTime = 0;
    $scope.cwMaxPerson = 0;
    $scope.cwMinPerson = 0;
    $scope.cwOps = '';
    $scope.cwWsk = '';
    $scope.showAnimCreator = false;

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
        FIELD_LIST: 3
    }
    $scope.arrowType = {
        FULL_2: 1,
        FULL_3: 2,
        STRIPED_2: 3,
        STRIPED_3: 4,
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
        obj: []
    });
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
    });

    $(window).on("orientationchange", function(event) {
        $scope.orientation = $(window).width() > $(window).height() ? 'sd' : 'landscape';
        resize();
    });

    $scope.actualMouseAction = $scope.mouseActionType.FIELD_LIST;

    $scope.selectArrow = function(arrowTypw) {
        $scope.selectedArrow = arrowTypw;
        $scope.arrowPointCount = 0;
        $scope.arrowPoint = [];
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
        $('.categories').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "#dd4213");
    })

    $(document).off('click touch', '.categoryItems');
    $(document).on('click touch', '.categoryItems', function() {
        $('.categoryItems').each(function() {
            $(this).css("border-color", "");
        });
        $(this).css("border-color", "#dd4213");

        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD) {
            $scope.selectedObjImg = new Image();
            $scope.selectedObjImg.src = $(this).find('img').attr('src');
        }
    })

    $(document).off('click touch', '.soccerField');
    $(document).on('click touch', '.soccerField', function() {
        $('.soccerField').each(function() {
            $(this).css("transform", "");
        });
        $(this).css("transform", "scale(1, 1.2)");
        selectField($(this).find('img').attr('src'));
    })

    function selectField(src) {
        $scope.selectedField = new Image();
        $scope.fieldImage = $scope.selectedField;
        $scope.selectedField.onload = function() {
            $scope.fieldImage = $scope.selectedField;
            drawNewStage();
        }
        $scope.selectedField.src = src;
    }

    $(document).off('keyup');
    $(document).on("keyup", function(e) {
        if (e.keyCode == 46) { // delete
            deleteCurrent();
        } else if (e.keyCode == 27) { // esc
            exitPlayer();
        }
    });
    $(document).off('click touch', '#canActionPlay');
    $(document).on('click touch', '#canActionPlay', function() {
        showPlayer();
    });
    $(document).off('click touch', '#canActionRotRight');
    $(document).on('click touch', '#canActionRotRight', function() {
        rotateCurrent(45);
    });
    $(document).off('click touch', '#canActionRotLeft');
    $(document).on('click touch', '#canActionRotLeft', function() {
        rotateCurrent(-45);
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
            } else {
                allObjectPerFrame[currentObjPerFrame].obj.splice(actual, 1);
            }
            deleteAnchor(currentObjPerFrame, $scope.lastSelected.getAttr('id'));
            deleteAnchor(currentObjPerFrame + 1, $scope.lastSelected.getAttr('id'));
            $scope.lastSelected.destroy();
            selectedFrame.draw();
        }
    }

    function rotateCurrent(rot) {
        if ($scope.lastSelected) {
            $scope.lastSelected.rotate(rot);
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
        if ($scope.actualMouseAction == $scope.mouseActionType.MOVE) {
            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.stroke('transparent');
            });
            var shapes = selectedFrame.find(".arrow");
            shapes.each(function(shape) {
                shape.stroke('black');
            });
            thisObj.stroke('#dd4213');
            selectedFrame.draw();
            $scope.lastSelected = thisObj;
        }
    }

    function clickOnContent() {
        if ($scope.actualMouseAction == $scope.mouseActionType.OBJECT_ADD && $scope.selectedObjImg) {
            var mousePos = selectedFrame.getPointerPosition();
            var scale = selectedFrame.getAttr('scaleX');
            var id = newId();
            var obj = new Konva.Image({
                x: mousePos.x / scale,
                y: mousePos.y / scale,
                offsetX: ($scope.selectedObjImg.width / 2.0),
                offsetY: ($scope.selectedObjImg.height / 2.0),
                image: $scope.selectedObjImg,
                name: "movementObject",
                id: id
            });

            obj.on('mousedown touchstart', function() {
                selectObjStyle(this);
            });

            obj.on('mouseup touchend', function() {
                drawBeforePositionPoint();
            });

            obj.on('dragend', function() {
                drawBeforePositionPoint();
                updateNextFrameBeforePosition();
                rotateObject();
            });
            var shapes = selectedFrame.find(".movementObject");
            shapes.each(function(shape) {
                shape.stroke('transparent');
            });
            var shapes = selectedFrame.find(".arrow");
            shapes.each(function(shape) {
                shape.stroke('black');
            });
            obj.stroke('#dd4213');
            obj.strokeWidth(1);
            $scope.lastSelected = obj;

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


        } else if ($scope.actualMouseAction == $scope.mouseActionType.ARROW_ADD && $scope.selectedArrow) {
            $scope.arrowPointCount++;
            var scale = selectedFrame.getAttr('scaleX');
            var mousePos = selectedFrame.getPointerPosition();
            $scope.arrowPoint.push({
                x: mousePos.x / scale,
                y: mousePos.y / scale
            });
            var countLimit = 0;
            switch ($scope.selectedArrow) {
                case $scope.arrowType.FULL_2:
                    countLimit = 2;
                    break;
                case $scope.arrowType.FULL_3:
                    countLimit = 3;
                    break;
                case $scope.arrowType.STRIPED_2:
                    countLimit = 2;
                    break;
                case $scope.arrowType.STRIPED_3:
                    countLimit = 3;
                    break;
            }

            if ($scope.arrowPointCount >= countLimit) {
                var pointsArray = [];
                for (var index = 0; index < $scope.arrowPoint.length; index++) {
                    pointsArray.push($scope.arrowPoint[index].x);
                    pointsArray.push($scope.arrowPoint[index].y);
                }

                var id = newId();
                if ($scope.selectedArrow == $scope.arrowType.FULL_2 || $scope.selectedArrow == $scope.arrowType.FULL_3) {
                    var arrow = new Konva.Arrow({
                        points: pointsArray,
                        pointerLength: 20,
                        pointerWidth: 20,
                        strokeWidth: 8,
                        fill: 'black',
                        name: 'arrow',
                        lineJoin: 'round',
                        lineCap: 'round',
                        tension: 0.4,
                        id: id
                    });
                } else {
                    var arrow = new Konva.Arrow({
                        points: pointsArray,
                        pointerLength: 20,
                        pointerWidth: 20,
                        fill: 'black',
                        strokeWidth: 8,
                        name: 'arrow',
                        lineJoin: 'round',
                        dash: [33, 10],
                        lineCap: 'round',
                        tension: 0.4,
                        id: id
                    });
                }

                arrow.on('mousedown touchstart', function() {
                    selectObjStyle(this);
                });

                var shapes = selectedFrame.find(".movementObject");
                shapes.each(function(shape) {
                    shape.stroke('transparent');
                });
                var shapes = selectedFrame.find(".arrow");
                shapes.each(function(shape) {
                    shape.stroke('black');
                });
                arrow.stroke('white');
                arrow.strokeWidth(1);
                $scope.lastSelected = arrow;

                // add the shape to the layer
                mainLayer.add(arrow);
                allObjectPerFrame[currentObjPerFrame].arrow.push(arrow);

                $scope.arrowPointCount = 0;
                $scope.arrowPoint = [];
                selectedFrame.draw();
            }
        }
    }

    function createArrowObjFromOther(other, isNoObj = false) {
        var arrow;
        if (!isNoObj) {
            arrow = new Konva.Arrow({
                points: other.getAttr("points"),
                pointerLength: other.getAttr("pointerLength"),
                pointerWidth: other.getAttr("pointerWidth"),
                fill: other.getAttr("fill"),
                strokeWidth: other.getAttr("strokeWidth"),
                name: other.getAttr("name"),
                lineJoin: other.getAttr("lineJoin"),
                dash: other.getAttr("dash"),
                lineCap: other.getAttr("lineCap"),
                tension: other.getAttr("tension"),
                id: other.getAttr("id")
            });
        } else {
            arrow = new Konva.Arrow({
                points: other.attrs.points,
                pointerLength: other.attrs.pointerLength,
                pointerWidth: other.attrs.pointerWidth,
                fill: other.attrs.fill,
                strokeWidth: other.attrs.strokeWidth,
                name: other.attrs.name,
                lineJoin: other.attrs.lineJoin,
                dash: other.attrs.dash,
                lineCap: other.attrs.lineCap,
                tension: other.attrs.tension,
                id: other.attrs.id
            });
        }
        arrow.stroke('black');
        arrow.strokeWidth(1);
        arrow.off('mousedown touchstart');
        arrow.on('mousedown touchstart', function() {
            selectObjStyle(this);
        });
        return arrow;
    }

    function createObjFromOther(other, isNoObj = false) {
        var obj;
        if (!isNoObj) {
            obj = new Konva.Image({
                x: other.getAttr("x"),
                y: other.getAttr("y"),
                offsetX: other.getAttr("offsetX"),
                offsetY: other.getAttr("offsetY"),
                rotation: other.getAttr("rotation"),
                image: other.getAttr("image"),
                name: other.getAttr("name"),
                id: other.getAttr("id")
            });
        } else {
            var newImg = new Image();
            newImg.src = other.attrs.image;
            obj = new Konva.Image({
                x: other.attrs.x,
                y: other.attrs.y,
                offsetX: other.attrs.offsetX,
                offsetY: other.attrs.offsetY,
                rotation: other.attrs.rotation,
                image: newImg,
                name: other.attrs.name,
                id: other.attrs.id
            });
        }
        obj.stroke('transparent');
        obj.strokeWidth(1);
        obj.off('mousedown touchstart');
        obj.on('mousedown touchstart', function() {
            selectObjStyle(this);
        });
        obj.off('mouseup touchend');
        obj.on('mouseup touchend', function() {
            drawBeforePositionPoint();
        });
        obj.off('dragend');
        obj.on('dragend', function() {
            drawBeforePositionPoint();
            updateNextFrameBeforePosition();
            rotateObject();
        });
        return obj;
    }

    function addFrame() {
        allObjectPerFrame.push({ arrow: [], obj: [] });
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


        for (var i = 0; i < frameContainer[currentObjPerFrame].obj.length; i++) {
            var obb = frameContainer[currentObjPerFrame].obj[i];
            var obj = createObjFromOther(obb);
            frameContainer[currentObjPerFrame].obj[i] = obj;
            mainLayer.add(frameContainer[currentObjPerFrame].obj[i]);
            if (container == 'canvasContainer') rotateObject(frameContainer[currentObjPerFrame].obj[i].getAttr("id"), frameContainer[currentObjPerFrame].obj[i]);
        }

        for (var i = 0; i < frameContainer[currentObjPerFrame].arrow.length; i++) {
            var obb = frameContainer[currentObjPerFrame].arrow[i];
            var obj = createArrowObjFromOther(obb);
            frameContainer[currentObjPerFrame].arrow[i] = obj;
            mainLayer.add(obj);
        }

        selectedFrame.add(mainLayer);

        $scope.selectedObjImg = null;
        $scope.selectedArrow = null;
        $scope.arrowPointCount = 0;
        $scope.arrowPoint = [];
        $scope.lastSelected = null;
        $scope.actualMouseAction = $scope.mouseActionType.MOVE;
        $(".categories").each(function() {
            $(this).css('border-color', "");
        });
        $(".categories").eq(0).css('border-color', "#dd4213");

        if (container == 'canvasContainer') {
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
        resize();
    }

    function resize() {
        var container = isPlayerOpen || $scope.onlyPlayer ? 'canvasPlayerContainer' : 'canvasContainer';
        if ($scope.onlyPlayer) container = 'canvasPlayerContainer';
        container = document.querySelector('#' + container);

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
            if (obb === id) {
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

            if (isAnchorHistoryFor(currentObjPerFrame, $scope.lastSelected.getAttr("id"))) {
                var history = getAnchorHistoryFor(currentObjPerFrame, $scope.lastSelected.getAttr("id"));
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
            saveAnchorPoint(currentObjPerFrame, $scope.lastSelected.getAttr("id"), quadCurves);

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
            radius: (type == 'end' || type == 'start') ? 5 : 15,
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
    }

    function createFrameToAnim() {
        var animationFrames = [];

        for (var i = 0; i < allObjectPerFrame.length; i++) {
            var objs = allObjectPerFrame[i].obj;
            var arrows = allObjectPerFrame[i].arrow;

            if (allObjectPerFrame[i + 1]) {
                for (var x = 0; x < 24; x++) {
                    arrowsArray = []
                    arrows = allObjectPerFrame[i + 1].arrow;
                    for (var z = 0; z < arrows.length; z++) {
                        var arrow = new Konva.Arrow({
                            points: arrows[z].getAttr("points"),
                            pointerLength: arrows[z].getAttr("pointerLength"),
                            pointerWidth: arrows[z].getAttr("pointerWidth"),
                            fill: arrows[z].getAttr("fill"),
                            strokeWidth: arrows[z].getAttr("strokeWidth"),
                            name: arrows[z].getAttr("name"),
                            lineJoin: arrows[z].getAttr("lineJoin"),
                            dash: arrows[z].getAttr("dash"),
                            lineCap: arrows[z].getAttr("lineCap"),
                            tension: arrows[z].getAttr("tension"),
                            id: arrows[z].getAttr("id")
                        });
                        arrowsArray.push(arrow);
                    }
                    objectArrays = []
                    objs = allObjectPerFrame[i + 1].obj;
                    for (var z = 0; z < objs.length; z++) {
                        if (isAnchorHistoryFor(i + 1, objs[z].getAttr("id"))) {
                            var history = getAnchorHistoryFor(i + 1, objs[z].getAttr("id"));
                            var p1, p2, a, degree;

                            p1 = getPosOnCurves(history.start, history.control, history.end, (x / 24));
                            p2 = getPosOnCurves(history.start, history.control, history.end, ((x + 1) / 24));
                            var rotOffset = 0;
                            if (p1.x > p2.x) rotOffset = 180;
                            a = (p2.y - p1.y) / (p2.x - p1.x);
                            degree = parseFloat(((Math.atan(a) * 180) / Math.PI) + rotOffset, 2).toFixed(2);

                            var obj = new Konva.Image({
                                x: p1.x,
                                y: p1.y,
                                offsetX: objs[z].getAttr("offsetX"),
                                offsetY: objs[z].getAttr("offsetY"),
                                rotation: degree,
                                image: objs[z].getAttr("image"),
                                name: objs[z].getAttr("name"),
                                id: objs[z].getAttr("id")
                            });
                        } else {
                            var obj = new Konva.Image({
                                x: objs[z].getAttr("x"),
                                y: objs[z].getAttr("y"),
                                offsetX: objs[z].getAttr("offsetX"),
                                offsetY: objs[z].getAttr("offsetY"),
                                rotation: objs[z].getAttr("rotation"),
                                image: objs[z].getAttr("image"),
                                name: objs[z].getAttr("name"),
                                id: objs[z].getAttr("id"),
                            });
                        }

                        objectArrays.push(obj);
                    }

                    animationFrames.push({
                        arrow: arrowsArray,
                        obj: objectArrays
                    });

                }
            } else {
                arrowsArray = []
                for (var z = 0; z < arrows.length; z++) {
                    var arrow = new Konva.Arrow({
                        points: arrows[z].getAttr("points"),
                        pointerLength: arrows[z].getAttr("pointerLength"),
                        pointerWidth: arrows[z].getAttr("pointerWidth"),
                        fill: arrows[z].getAttr("fill"),
                        strokeWidth: arrows[z].getAttr("strokeWidth"),
                        name: arrows[z].getAttr("name"),
                        lineJoin: arrows[z].getAttr("lineJoin"),
                        dash: arrows[z].getAttr("dash"),
                        lineCap: arrows[z].getAttr("lineCap"),
                        tension: arrows[z].getAttr("tension"),
                        id: arrows[z].getAttr("id")
                    });
                    arrowsArray.push(arrow);
                }

                objectArrays = []

                for (var z = 0; z < objs.length; z++) {
                    var obj = new Konva.Image({
                        x: objs[z].getAttr("x"),
                        y: objs[z].getAttr("y"),
                        offsetX: objs[z].getAttr("offsetX"),
                        offsetY: objs[z].getAttr("offsetY"),
                        rotation: objs[z].getAttr("rotation"),
                        image: objs[z].getAttr("image"),
                        name: objs[z].getAttr("name"),
                        id: objs[z].getAttr("id")
                    });
                    objectArrays.push(obj);
                }

                animationFrames.push({
                    arrow: arrowsArray,
                    obj: objectArrays
                });
            }

        }
        return animationFrames;
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
        }, (1000 / 25));
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

            $(".timeElement").each(function() {
                if ($(this).index() != 0)
                    $(this).remove();
            });

            $scope.cwName = data.name;
            $scope.cwFieldType = data.cwFieldType;
            $scope.cwMaxTime = data.cwMaxTime;
            $scope.cwMinTime = data.cwMinTime;
            $scope.cwMaxPerson = data.cwMaxPerson;
            $scope.cwMinPerson = data.cwMinPerson;
            $scope.cwOps = data.cwOps;
            $scope.cwWsk = data.cwWsk;

            for (var x = 0; x < data.animFrame.length; x++) {
                allObjectPerFrame.push({ arrow: [], obj: [] });

                for (var i = 0; i < data.animFrame[x].arrow.length; i++) {
                    var arrowBef = data.animFrame[x].arrow[i];
                    var obj = createArrowObjFromOther(arrowBef, true);
                    allObjectPerFrame[x].arrow.push(obj);
                }
                for (var i = 0; i < data.animFrame[x].obj.length; i++) {
                    var objBef = data.animFrame[x].obj[i];
                    var obj = createObjFromOther(objBef, true);
                    allObjectPerFrame[x].obj.push(obj);
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
                $scope.$apply(function() {
                    callback();
                    selectField(data.fieldImage);
                    $scope.changeCategories($scope.mouseActionType.MOVE);
                    changeFrame(0);
                    setTimeout(function() {
                        resize();
                    }, 500);
                });
            }

        });

    }

    function saveAnimation() {
        changeFrame(0);
        drawNewStage();

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
                arrow: []
            });
            for (var x = 0; x < allObjectPerFrame[index].obj.length; x++) {
                allObj[index].obj.push(allObjectPerFrame[index].obj[x].toObject());
                allObj[index].obj[x].attrs.image = allObjectPerFrame[index].obj[x].getImage().src;
            }
            for (var x = 0; x < allObjectPerFrame[index].arrow.length; x++) {
                allObj[index].arrow.push(allObjectPerFrame[index].arrow[x].toObject());
            }
        }

        var toSend = {
            id: $scope.animId,
            name: $scope.animName,
            tags: allTagString,
            mainImg: '',
            animFrame: JSON.stringify(allObj),
            anchorHistory: JSON.stringify(anchorHistory),
            fieldImage: $scope.isSelectedField ? $scope.fieldImage.src : '',
            cwFieldType: $scope.cwFieldType,
            cwMaxTime: $scope.cwMaxTime,
            cwMinTime: $scope.cwMinTime,
            cwMaxPerson: $scope.cwMaxPerson,
            cwMinPerson: $scope.cwMinPerson,
            cwOps: $scope.cwOps,
            cwWsk: $scope.cwWsk
        };

        if ($scope.isSelectedField) {
            var mainImg = mainLayer.toImage({
                callback: function(img) {
                    var image = img.src.split(",")[1];
                    toSend.mainImg = image;
                    request.backend('saveConspectAnim', toSend, function(data) {
                        if ($scope.animId != -1) notify.localNotify("Sukces", "Animacja pomyślnie edytowana");
                        else notify.localNotify("Sukces", "Animacja zapisana pomyślnie");
                        $scope.animId = data;
                        $location.url("/conspectusAnimList");
                    });
                }
            });
        } else {
            request.backend('saveConspectAnim', toSend, function(data) {
                if ($scope.animId != -1) notify.localNotify("Sukces", "Animacja pomyślnie edytowana");
                else notify.localNotify("Sukces", "Animacja zapisana pomyślnie");
                $scope.animId = data;
                $location.url("/conspectusAnimList");
            });
        }
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