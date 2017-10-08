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

$("#sidebar").niceScroll({
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

var Script = function() {

    $(function() {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $(".sidebar-toggle-box").first().css("margin-left", "15px");
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
                $(".sidebar-toggle-box").first().css("margin-left", "230px");
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
            }
        }

        function responseResize() {
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
                $(".sidebar-toggle-box").first().css("margin-left", "15px");
            } else {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
                $('#main-content').css({
                    'margin-left': '210px'
                });
                $(".sidebar-toggle-box").first().css("margin-left", "230px");
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
            }
        }

        $(window).on('load', responsiveView);
        $(window).on('resize', responseResize);
    });

    $(document).on('click', 'ul.sidebar-menu .dcjq-parent-li ul.sub li a', function() {
        if ($(window).width() <= 768) {
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

    $(document).on('click', 'ul.sidebar-menu li .waves-effect', function() {
        if ($(window).width() <= 768) {
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
            $(".sidebar-toggle-box").first().css("margin-left", "15px");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
            if ($(window).width() >= 768) {
                $(".sidebar-toggle-box").first().css("margin-left", "230px");
            }
        }
    }

}();