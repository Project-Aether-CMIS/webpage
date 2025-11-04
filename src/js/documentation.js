$(function () {
    $('.sorting, .order').on('change', updateDocumentationDisplay);
    updateDocumentationDisplay();
});

async function updateDocumentationDisplay() {
    const sorting = $('.sorting').val();
    const order = $('.order').val();
    const documentationDisplay = $('.documentation_display');

    documentationDisplay.empty();
    const docs = await fetch('https://aether-backend.sfever.workers.dev/list')
        .then(response => response.json())
        .catch(error => {
        console.error('Error fetching documentation:', error);
        return [];
    });
    if(docs.length === 0) {
        documentationDisplay.html('<p class="no-documentation">No documentation available.</p>');
        return;
    }
    const sortedDocs = docs.sort((a, b) => {
        if (sorting === 'title') {
            return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sorting === 'date') {
            return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        }
    });
    sortedDocs.forEach(doc => {
        const docItem = $('<div class="documentation_item"></div>');
        docItem.attr('data-title', doc.title);

        $('<h1 class="documentation_title"></h1>').text(doc.title).appendTo(docItem);
        $('<p class="documentation_summary"></p>').text(doc.summary || 'No summary available.').appendTo(docItem);

        const meta = $('<div class="documentation_meta"></div>');
        $('<span class="documentation_author"></span>')
            .text(`Author: ${doc.author || 'Unknown Author'}`)
            .appendTo(meta);
        $('<span class="documentation_date"></span>')
            .text(formatDocumentDate(doc.date))
            .appendTo(meta);
        meta.appendTo(docItem);

        documentationDisplay.append(docItem);
    });
}

function formatDocumentDate(value) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) {
        return 'Date unavailable';
    }
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

