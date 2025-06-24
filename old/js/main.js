/*============= sticky side bar ============= */
jQuery(document).ready(function () {
    jQuery('.content, .sidebar').theiaStickySidebar({
        // Settings
        additionalMarginTop: 30
    });
});

/*============= NAVBAR ============= */
    // Add navbar background color when scrolled
    $(window).scroll(function () {
        if ($(window).scrollTop() > 56) {
            $(".navbar").addClass("nav-scroll");
        } else {
            $(".navbar").removeClass("nav-scroll");
        }
    });

    // close navbar-collapse when a  clicked
    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });