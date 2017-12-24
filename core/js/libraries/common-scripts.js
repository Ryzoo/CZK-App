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
    scrollspeed: 10, // scrolling speed
    emulatetouch: true,
    hwacceleration: true,
    smoothscroll: true,
    bouncescroll: true,
    mousescrollstep: 10, // scrolling speed with mouse wheel (pixel)
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
                    'margin-left': '-768px'
                });

                $(".adw").each(function() {
                    $(this).removeClass("adwWith");
                    $(this).addClass("adwWithout");
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

                $(".adw").each(function() {
                    $(this).removeClass("adwWithout");
                    $(this).addClass("adwWith");
                });
            }
        }

        function responseResize() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $(".sidebar-toggle-box").first().css("margin-left", "15px");
                $(".adw").each(function() {
                    $(this).removeClass("adwWith");
                    $(this).addClass("adwWithout");
                });
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
                $(".adw").each(function() {
                    $(this).removeClass("adwWithout");
                    $(this).addClass("adwWith");
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
                'margin-left': '-768px'
            });

            $(".adw").each(function() {
                $(this).removeClass("adwWith");
                $(this).addClass("adwWithout");
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
                'margin-left': '-768px'
            });

            $(".adw").each(function() {
                $(this).removeClass("adwWith");
                $(this).addClass("adwWithout");
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
                'margin-left': '-768px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
            $(".sidebar-toggle-box").first().css("margin-left", "15px");


            $(".adw").each(function() {
                $(this).removeClass("adwWith");
                $(this).addClass("adwWithout");
            });


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

            $(".adw").each(function() {
                $(this).removeClass("adwWithout");
                $(this).addClass("adwWith");
            });
        }
    }

}();