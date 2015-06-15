Template.Navigation.helpers({
    activeRouteClass: function (/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();
        var active = _.any(args, function (name) {
            return Router.current() && Router.current().route.getName() === name
        });
        return active && 'active';
    },

    categories: function () {
        return Categories.find({}, {sort: {name: 1}});
    },

    bookingListPageIsActive: function() {
        var routeName = Router.current().route.getName();
        if (routeName === 'booking_list') {
            return true;
        }
        return false;
    }
});

Template.Navigation.events({
    'click .logout-forward': function () {
        console.log('Login out!');

        Meteor.logout(function (error) {
            if (error) {
                console.log('Logout-Error: ' + error);
            } else {
                console.log('Logout-Success!');
                Router.go('home');
            }
        });
    },

    'click .booking-new': function () {
        console.log('New booking!');
        Router.go('booking_new');
    },

    'click .category-new': function () {
        console.log('New category!');
        Router.go('category_new');
    },

    'click .statistic': function () {
        console.log('Statistic!');
        Router.go('statistic');
    }
});

Template.Navigation.rendered = function () {
    // Variables
    var $codeSnippets = $('.code-example-body'),
        $nav = $('.navbar'),
        $body = $('body'),
        $window = $(window),
        $popoverLink = $('[data-popover]'),
        navOffsetTop = $nav.offset().top,
        $document = $(document),
        entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        }

    function init() {
        $window.on('scroll', onScroll)
        $window.on('resize', resize)
        $popoverLink.on('click', openPopover)
        $document.on('click', closePopover)
        $('a[href^="#"]').on('click', smoothScroll)
        //buildSnippets();
    }

    function smoothScroll(e) {
        e.preventDefault();
        $(document).off("scroll");
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 40
        }, 0, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    }

    function openPopover(e) {
        e.preventDefault()
        closePopover();
        var popover = $($(this).data('popover'));
        popover.toggleClass('open')
        e.stopImmediatePropagation();
    }

    function closePopover(e) {
        if ($('.popover.open').length > 0) {
            $('.popover').removeClass('open')
        }
    }

    $("#button").click(function () {
        $('html, body').animate({
            scrollTop: $("#elementtoScrollToID").offset().top
        }, 2000);
    });

    function resize() {
        $body.removeClass('has-docked-nav')
        navOffsetTop = $nav.offset().top
        onScroll()
    }

    function onScroll() {
        if (navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
            $body.addClass('has-docked-nav')
        }
        if (navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
            $body.removeClass('has-docked-nav')
        }
    }

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function buildSnippets() {
        $codeSnippets.each(function () {
            var newContent = escapeHtml($(this).html())
            $(this).html(newContent)
        })
    }


    init();
};
