app.controller('mySkillTreeController', function($scope, auth, $rootScope, notify, request) {
    $scope.showContent = false;
    $scope.mySkills = [];

    var resizeTimeout = null;

    var treeConfig = {
        chart: {
            container: "#skillTree",
            levelSeparation: 45,
            rootOrientation: "NORTH",
            nodeAlign: "CENTER",
            connectors: {
                type: "curve",
                style: {
                    "stroke-width": 3,
                    "stroke": "#adadad"
                }
            }
        },
        nodeStructure: {
            text: { name: "LISTA UMIEJĘTNOŚCI" },
            HTMLclass: "skillTreeRootElement",
            children: [],
            connectors: {
                type: "step",
                style: {
                    "stroke": "#ffffff",
                    "stroke-opacity": 0
                }
            }
        }
    };

    $scope.loadSkill = function() {
        request.backend('getMySkillsInTree', {}, function(data) {
            $scope.$apply(function() {
                $scope.mySkills = data;
                for (let i = 0; i < data.struct.length; i++) {
                    treeConfig.nodeStructure.children.push(createElementRoot(data.struct[i]));
                }
                $scope.showContent = true;
                setTimeout(() => {
                    new Treant(treeConfig, function() {
                        replaceImgBySvg();
                        $('.tooltipped').tooltip({
                            delay: 20
                        });
                    });
                    $('.modal').modal();
                }, 500);
            });
        });
    }

    $(window).resize(function(){
        $('#skillTree').html('');
        clearTimeout(resizeTimeout);
        $scope.$apply(function(){
            $scope.showContent = false;
        });
        resizeTimeout = setTimeout(() => {
            $scope.$apply(function(){
                $scope.showContent = true;
            });
            setTimeout(() => {
                new Treant(treeConfig, function() {
                    replaceImgBySvg();
                    $('.tooltipped').tooltip({
                        delay: 20
                    });
                });
                $('.modal').modal();
            }, 500);
        }, 1000);
    });

    function createElementRoot(data) {
        var rootElement = {
            text: { name: data.name },
            HTMLclass: "skillRootElement",
            children: [],
            connectors: {
                style: {
                    "stroke": data.color
                }
            }
        };
        if (data.skills)
            createSkillElements(rootElement.children, data.skills, data.color);
        return rootElement;
    }

    function createSkillElements(pushElement, skills, parentColor) {
        for (let i = 0; i < skills.length; i++) {
            var skill = {
                innerHTML: getIconHtml(skills[i]),
                HTMLclass: "skillParent",
                children: [],
                connectors: {
                    style: {
                        "stroke": skills[i].isComplete ? parentColor : "#b3b3b3"
                    }
                }
            };
            if (skills[i].skills)
                createSkillElements(skill.children, skills[i].skills, parentColor);
            pushElement.push(skill);
        }
    }

    $(document).off('click',".skillIn");
    $(document).on('click',".skillIn",function(){
        var skill = getSkillById($(this).data('skill-id'));
        if( !skill ){return;}
        loadSkillToModal(skill);
    });

    $(document).off('click',".popReqListElement");
    $(document).on('click',".popReqListElement",function(){
        var skill = getSkillById($(this).data('skill-id'));
        if( !skill ){return;}
        loadSkillToModal(skill);
    });


    function loadSkillToModal(skill){
        var mo = $('#skillModal');
        clearPop();
        mo.modal('open');
        var level = parseInt(skill.level) > 0 ? " - poziom: "+skill.level : "" ;
        mo.find('.popMainSkill').first().prepend(getIconHtml(skill));
        mo.find('.popMainSkill .popSkillMainStatus').first().html(getStatusHtml(skill));
        mo.find('.popMainSkill .popSkillMainCat').first().text(skill.category.name);
        mo.find('.popMainSkill .popSkillMainName').first().text(skill.name+level);
        mo.find('.popMainSkill .popSkillMainDesc').first().text(skill.description);

        if(skill.reqs.length == 0){
            mo.find('.popReqList').first().append("<li class='noReg'>Brak wymagań</li>");
        }

        for (let i = 0; i < skill.reqs.length; i++) {
            var level = parseInt(skill.reqs[i].level) > 0 ? " - poziom: "+skill.reqs[i].level : "" ;
            mo.find('.popReqList').first().append(`
            <li class='popReqListElement' data-skill-id='`+skill.reqs[i].id+`'>
                <div class='popReqListElementLeft'>
                `+getIconHtml(skill.reqs[i])+`
                </div>
                <div class='popReqListElementRight'>
                    <h4 class='popSkillMainCat'>`+skill.reqs[i].category.name+`</h4>
                    <h6 class='popSkillMainName'>`+skill.reqs[i].name+level+`</h6>
                    <small class='popSkillMainStatus'>`+getStatusHtml(skill.reqs[i])+`</small>
                </div>
            </li>
            `);
        }
        replaceImgBySvg();
    }

    function clearPop(){
        var mo = $('#skillModal');
        mo.find('.popMainSkill').first().html(`
            <div class='popMainSkill'>
                <small class='popSkillMainStatus'></small>
                <h4 class='popSkillMainCat'></h4>
                <h6 class='popSkillMainName'></h6>
                <p class='popSkillMainDesc'></p>
            </div>
        `);

        mo.find('.popReqSkill').first().html(`
            <h4 class='popReq'>Wymagania:</h4>
            <ul class='popReqList'></ul>
        `);
    }

    function getIconHtml(skill){
        var level = parseInt(skill.level);
        var parentColor = skill.category.color;
        var classIn = skill.isComplete ? "completedSkill" : skill.isEnabled ? "enabledSkill" : "notEnabledSkill";
        var fillColor = skill.isComplete ? "white" : skill.isEnabled ? 'black' : "#adadad";
        var borderColor = skill.isComplete ? parentColor : skill.isEnabled ? parentColor : "#adadad";
        var background = skill.isComplete ? parentColor : skill.isEnabled ? "white" : "#e7e7e7";
        var levelColor = skill.isEnabled ? parentColor  : "#adadad";
        var spanWithLevel = `<span class='levelSpan' style='background-color:`+levelColor+`'>`+level+`</span>`;
        var classType = skill.isComplete ? "completePathSvg" : skill.isEnabled ? "enabledPathSvg" : "notEnabledPathSvg";

        return `<div data-skill-id='`+skill.id+`' class='skillIn tooltipped ` + classIn + `' style='background-color:`+background+`;border-color:`+borderColor+`' data-position='bottom data-delay='20' data-tooltip='` + skill.name + `'>
            <img class='svg `+classType+`' style='fill:`+fillColor+` !important; stroke:`+fillColor+` !important' src='` + skill.icon_path + `' alt='` + skill.name + `'/>
            `+(level > 0 ? spanWithLevel : '')+`</div>`;
    }

    function getStatusHtml(skill){
        var status = '';
        if(skill.isComplete) status = '<span style="color:#8AC163" >Zaliczone</span>';
        else if(skill.isEnabled) status = '<span style="color:#D5B75D" >Do zaliczenia</span>';
        else status = '<span style="color:#D1D1D1" >Niedostępne</span>';
        return status;
    }


    function getSkillById($id,$load=true){
        for (let i = 0; i <  $scope.mySkills.all.length; i++) {
            if($scope.mySkills.all[i].id == $id){
                var element = $.extend(true, {}, $scope.mySkills.all[i]);
                if($load){
                    var req = loadSkillFromReq($scope.mySkills.all[i]);
                    element.reqs = req;
                }
                return element;
            }
        }
        return null;
    }

    function loadSkillFromReq(skill){
        var allReq = [];
        if(skill.req)
        for (let i = 0; i < skill.req.length; i++) {
            var all = getSkillById(skill.req[i],false);
            allReq.push( all );
        }
        return allReq;
    }

    function replaceImgBySvg() {
        $('img.svg').each(function() {
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');
            var imgStyle = $img.attr('style');

            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');
                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }

                if (typeof imgStyle !== 'undefined') {
                    $svg = $svg.attr('style', imgStyle );
                }
                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
                if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                }
                // Replace image with new SVG
                $img.replaceWith($svg);
            }, 'xml');
        });
    }



});