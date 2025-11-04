function getStoredAuthorPreference() {
    try {
        return localStorage.getItem('aetherDefaultAuthor') || '';
    } catch (error) {
        console.warn('Unable to access localStorage:', error);
        return '';
    }
}

function inferWindowsUsername() {
    try {
        const decodedPath = decodeURIComponent(window.location.pathname || '');
        const match = decodedPath.match(/\/Users\/([^/]+)/i);
        if (match && match[1]) {
            return match[1];
        }

        const decodedHref = decodeURIComponent(window.location.href || '');
        const hrefMatch = decodedHref.match(/Users\/([^/]+)/i);
        if (hrefMatch && hrefMatch[1]) {
            return hrefMatch[1];
        }
    } catch (error) {
        console.warn('Unable to infer Windows username:', error);
    }
    return '';
}

function getDefaultAuthorName() {
    return getStoredAuthorPreference() || inferWindowsUsername() || '';
}

function persistDefaultAuthor(author) {
    try {
        localStorage.setItem('aetherDefaultAuthor', author);
    } catch (error) {
        console.warn('Unable to persist default author:', error);
    }
}

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
                updateFileList();
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
    const fileform = $('.upload_form');
    const fileinput = $('.file_input');
    const file_name_display = $('.uploaded_file_name');
    const authorInput = $('.author_input');
    const allowedTypes = ['text/markdown', 'text/plain', '.md'];

    if (authorInput.length) {
        const defaultAuthor = getDefaultAuthorName();
        if (defaultAuthor && !authorInput.val()) {
            authorInput.val(defaultAuthor);
        }
    }

    fileinput.on('change', function () {
        if (this.files.length > 1) {
            alert('Please select only one file.');
            this.value = ''; // Clear the input
            file_name_display.text('No file chosen');
            return;
        }
        else if (this.files.length === 0) {
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

    fileform.on('submit', async function (event) {
        event.preventDefault();
        if (!fileinput.val()) {
            alert('Please select a file to upload.');
            return;
        }

        let authorName = '';
        if (authorInput.length) {
            authorName = authorInput.val().trim();
        }

        if (!authorName) {
            authorName = getDefaultAuthorName() || 'Unknown Author';
            if (authorInput.length) {
                authorInput.val(authorName);
            }
        }

        if (authorName && authorName !== 'Unknown Author') {
            persistDefaultAuthor(authorName);
        }

        const formData = new FormData(this);
        if (authorInput.length) {
            formData.set('author', authorName);
        }

        try {
            const response = await fetch('https://aether-backend.sfever.workers.dev/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                alert('File uploaded successfully.');
                fileinput.val('');
                file_name_display.text('No file chosen');
            }
            else{
                alert('File upload failed. Please try again.');
            }
        } catch (error) {
            console.error('File upload request failed:', error);
            alert('File upload failed due to an error. Please try again.');
        }
        finally{
            updateFileList();
            return;
        }
    });
}

async function updateFileList() {
    const file_list_container = $('.file_list');
    let fileList = [];
    try {
        const response = await fetch('https://aether-backend.sfever.workers.dev/list', {
            method: 'GET'
        });
        fileList = await response.json();
    } catch (error) {
        console.error('Failed to fetch file list:', error);
        file_list_container.html('<p class="no-files">Error loading file list.</p>');
        return;

    }
    if (!fileList.length) {
        file_list_container.html('<p class="no-files">No files uploaded yet.</p>');
        return;
    }
    file_list_container.html('');
    fileList.forEach(file => {
        const fileItem = $('<div class="file_item"></div>');

        $('<h2 class="file_name"></h2>').text(file.name).appendTo(fileItem);
        $('<p class="file_author"></p>').text(`Uploaded by ${file.author || 'Unknown Author'}`).appendTo(fileItem);

        const actions = $('<div class="file_actions"></div>');
        $('<button class="download_button">Download</button>')
            .attr('type', 'button')
            .on('click', () => downloadFile(file.name))
            .appendTo(actions);
        $('<button class="delete_button">Delete</button>')
            .attr('type', 'button')
            .on('click', () => deleteFile(file.name))
            .appendTo(actions);

        actions.appendTo(fileItem);
        file_list_container.append(fileItem);
    });
}

function downloadFile(fileName) {
    fetch(`https://aether-backend.sfever.workers.dev/download/${encodeURIComponent(fileName)}`, {
        method: 'GET'
    });
}

function deleteFile(fileName) {
    fetch(`https://aether-backend.sfever.workers.dev/files/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
    });
}

document.addEventListener("DOMContentLoaded", () => {
    passwordHandler();
    fileUploadHandler();
});