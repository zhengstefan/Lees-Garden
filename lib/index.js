/* Navbar */
$(document).ready(function () {
    $('li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
});

/* Chevron-circle-down */
function hover(element) {
    element.setAttribute('src', 'images/chevron-circle-down-hovered.png');
}

function unhover(element) {
    element.setAttribute('src', 'images/chevron-circle-down.png');
}

/* Speisekarte horizontal navbar */
$(document).ready(function () {
    // Handle click on menu category
    $('.menu-nav a').on('click', function (e) {
        e.preventDefault();
        $('.menu-nav a').removeClass('active');
        $(this).addClass('active');

        // Scroll to the corresponding section
        const target = $(this).attr('href');
        $('html, body').animate({
            scrollLeft: $(target).offset().left - $('.menu-container').offset().left + $('.menu-container').scrollLeft()
        }, 500);
    });

    // Optional: Auto-scroll to the first category on page load
    if ($('.menu-nav a').length > 0) {
        $('.menu-nav a:first').addClass('active');
        const firstTarget = $('.menu-nav a:first').attr('href');
        $('html, body').animate({
            scrollLeft: $(firstTarget).offset().left - $('.menu-container').offset().left + $('.menu-container').scrollLeft()
        }, 500);
    }
});