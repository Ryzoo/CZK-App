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

                $('#main-content').stop().animate({
                    marginLeft: 0
                },500);

                $(".sidebar-toggle-box").first().stop().animate({
                    marginLeft: 15
                },500);
                $('#sidebar').stop().animate({
                    marginLeft: -768
                },1200,function(){
                    $('#sidebar > ul').hide();
                });

                $(".adw").each(function() {
                    $(this).removeClass("adwWith");
                    $(this).addClass("adwWithout");
                });
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
                $('#main-content').stop().animate({
                    marginLeft: 210
                },500);
                $(".sidebar-toggle-box").first().stop().animate({
                    marginLeft: 230
                },500);
                $('#sidebar > ul').show();
                $('#sidebar').stop().animate({
                    marginLeft: 0
                },500);

                $(".adw").each(function() {
                    $(this).removeClass("adwWithout");
                    $(this).addClass("adwWith");
                });
            }
        }

        function responseResize() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $(".sidebar-toggle-box").first().stop().animate({
                    marginLeft: 15
                },500);
                $(".adw").each(function() {
                    $(this).removeClass("adwWith");
                    $(this).addClass("adwWithout");
                });
            } else {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
                $('#main-content').stop().animate({
                    marginLeft: 210
                },500);
                $(".sidebar-toggle-box").first().stop().animate({
                    marginLeft: 230
                },500);
                $('#sidebar').stop().animate({
                    marginLeft: 0
                },500);
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

            $('#main-content').stop().animate({
                marginLeft: 0
            },500);
            $('#sidebar').stop().animate({
                marginLeft: -768
            },1200,function(){
                $('#sidebar > ul').hide();
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
            $('#main-content').stop().animate({
                marginLeft: 0
            },500);
            $('#sidebar').stop().animate({
                marginLeft: -768
            },1200,function(){
                $('#sidebar > ul').hide();
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
            $('#main-content').stop().animate({
                marginLeft: 0
            },500);
            $('#sidebar').stop().animate({
                marginLeft: -768
            },1200,function(){
                $('#sidebar > ul').hide();
            });
            $("#container").addClass("sidebar-closed");
            $(".sidebar-toggle-box").first().stop().animate({
                marginLeft: 15
            },500);
            $(".adw").each(function() {
                $(this).removeClass("adwWith");
                $(this).addClass("adwWithout");
            });

        } else {
            $('#main-content').stop().animate({
                marginLeft: 210
            },500);
            $('#sidebar > ul').show();
            $('#sidebar').stop().animate({
                marginLeft: 0
            },500);
            $("#container").removeClass("sidebar-closed");
            if ($(window).width() >= 768) {
                $(".sidebar-toggle-box").first().stop().animate({
                    marginLeft: 230
                },500);
            }
            $(".adw").each(function() {
                $(this).removeClass("adwWithout");
                $(this).addClass("adwWith");
            });
        }
    }

}();