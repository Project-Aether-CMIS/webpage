document.addEventListener("DOMContentLoaded", function() {
    const form = $('.password_form');
    const input = $('.password_input');
    $('.content_after').hide();
    $('.login').show();
    if (!form.length || !input.length) return;

    if (!input.parent().hasClass('password_field')) {
        input.wrap('<div class="password_field"></div>');
    }

    const wrapper = input.parent().css('position', 'relative');

    const requiredTip = $('<div class="password_error password_error--required">Password is required.</div>').hide();
    const wrongTip = $('<div class="password_error password_error--wrong">Password is incorrect.</div>').hide();

    wrapper.append(requiredTip, wrongTip);

    const showRequired = () => {
        wrongTip.stop(true, true).fadeOut(0);
        requiredTip.stop(true, true).fadeIn(150);
    };

    const showWrong = () => {
        requiredTip.stop(true, true).fadeOut(0);
        wrongTip.stop(true, true).fadeIn(150);
    };

    const hideAllTips = () => {
        requiredTip.stop(true, true).fadeOut(150);
        wrongTip.stop(true, true).fadeOut(150);
    };

    form.on('submit', async function (event) {
        const value = input.val().trim();
        event.preventDefault();
        if (!value) {
            event.preventDefault();
            showRequired();
            return;
        }

        try {
            const response = await fetch('https://aether-backend.sfever.workers.dev/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: value
            });

            if (response.ok) {
                hideAllTips();
                $('.content_after').fadeIn({
                    duration: 200,
                    start: function () {
                        $(this).css('display', 'flex');
                    }
                });
                $('.login').fadeOut(200);
                return;
            }

            event.preventDefault();
            showWrong();
        } catch (error) {
            console.error('Authentication request failed:', error);
            
            showWrong();
        }
    });

    input.on('input', function () {
        if ($(this).val().trim()) {
            hideAllTips();
        }
    });
});