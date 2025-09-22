///<reference path="https://code.jquery.com/jquery-3.7.1.js" />

$(function() {
    $('body').fadeIn(1000);
    const currentYear = new Date().getFullYear();
    $('.copyright_text').text('© ' + currentYear + ' Project Aether. All rights reserved.');
})

