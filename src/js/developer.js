function passwordHandler() {
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
}

function fileUploadHandler() {
    const fileform=$('.upload_form');
    const fileinput=$('.file_input');
    const file_name_display=$('.uploaded_file_name');
    const allowedTypes = ['text/markdown', 'text/plain', '.md'];
    fileinput.on('change', function() {
        if(this.files.length>1){
            alert('Please select only one file.');
            this.value = ''; // Clear the input
            file_name_display.text('No file chosen');
            return;
        }
        else if(this.files.length===0){
            file_name_display.text('No file chosen');
            return;
        }
        else if (!allowedTypes.includes(this.files[0].type) && !this.files[0].name.endsWith('.md')) {
            alert('Invalid file type. Please select a Markdown (.md) file.');
            this.value = '';
            return;
        }
        const fileName = $(this).val().split('\\').pop();
        file_name_display.text(fileName);
    });

    fileform.on('submit', async function(event) {
        event.preventDefault();
        if (!fileinput.val()) {
            alert('Please select a file to upload.');
            return;
        }
        try{
            const response = await fetch('https://aether-backend.sfever.workers.dev/upload', {
                method: 'POST',
                body: new FormData(this)
            });
            if (response.ok) {
                alert('File uploaded successfully.');
                fileinput.val('');
                file_name_display.text('No file chosen');
                return;
            }
            alert('File upload failed. Please try again.');
        } catch (error) {
            console.error('File upload request failed:', error);
            alert('File upload failed due ',error,'. Please try again.');
            return
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    passwordHandler();
    fileUploadHandler();
});