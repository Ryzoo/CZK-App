/*---LEFT BAR ACCORDION----*/
$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: false,
        classExpand: 'dcjq-current-parent'
    });
});

var Script = function() {


    //    sidebar dropdown menu auto scrolling

    //    sidebar toggle

    $(function() {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-210px'
                });
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
                $('#main-content').css({
                    'margin-left': '210px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
            }
        }
        function responseResize() {
            var wSize = $(window).width();
            if (wSize <= 728 && wSize >= 720) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-210px'
                });
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responseResize);
    });

    $(document).on('click','ul.sidebar-menu .dcjq-parent-li ul.sub li a', function() {
        if ($(window).width() <= 728){
            $('#container').addClass('sidebar-close');
            $('#sidebar > ul').hide();
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
        }
    })

    $(document).on('click','ul.sidebar-menu li .waves-effect', function() {
        if ($(window).width() <= 728){
            $('#container').addClass('sidebar-close');
            $('#sidebar > ul').hide();
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
        }
    })


    

    $('.fa-bars').click(function() {
        toggleSidebar();
    });

    function toggleSidebar() {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
    }

    // custom scrollbar
    $("#sidebar").niceScroll({ styler: "fb", cursorcolor: "#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled: false, cursorborder: '' });

    $("html").niceScroll({ styler: "fb", cursorcolor: "#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled: false, cursorborder: '', zindex: '1000' });

    $(".nicescroll-rails div").css("background","rgb(128, 128, 128)");

    // widget tools

    jQuery('.panel .tools .fa-chevron-down').click(function() {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    jQuery('.panel .tools .fa-times').click(function() {
        jQuery(this).parents(".panel").parent().remove();
    });

    // custom bar chart

    if ($(".custom-bar-chart")) {
        $(".bar").each(function() {
            var i = $(this).find(".value").html();
            $(this).find(".value").html("");
            $(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }


}();
