$(function() {
    // Fade in the whole page without altering display type (keeps flex/grid intact)
    $('body').css('opacity', 0).animate({ opacity: 1 }, 1000);

    const currentYear = new Date().getFullYear();
    $('.copyright_text').text('© ' + currentYear + ' Project Aether. All rights reserved.');
});

