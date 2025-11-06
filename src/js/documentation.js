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
            const nameA = formatDisplayTitle(a.file_name);
            const nameB = formatDisplayTitle(b.file_name);
            return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        } else if (sorting === 'date') {
            return order === 'asc' ? new Date(a.file_date) - new Date(b.file_date) : new Date(b.file_date) - new Date(a.file_date);
        }
    });
    sortedDocs.forEach(doc => {
        const docItem = $('<a class="documentation_item"></a>');
        docItem.attr('href', 'doc_view.html?file=' + encodeURIComponent(doc.file_name));
        const displayTitle = formatDisplayTitle(doc.file_name);
        docItem.attr('data-title', displayTitle);

        $('<h1 class="documentation_title"></h1>').text(displayTitle).appendTo(docItem);
        $('<p class="documentation_summary"></p>').text(doc.summary || 'No summary available.').appendTo(docItem);

        const meta = $('<div class="documentation_meta"></div>');
        $('<span class="documentation_author"></span>')
            .text(`Author: ${formatDisplayTitle(doc.author) || 'Unknown Author'}`)
            .appendTo(meta);
        $('<span class="documentation_date"></span>')
            .text(formatDocumentDate(doc.file_date))
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

// Generate a display-friendly title from a file name
function formatDisplayTitle(fileName) {
    if (!fileName || typeof fileName !== 'string') return 'Untitled';
    // Remove .md extension (case-insensitive)
    let name = fileName.replace(/\.md$/i, '');
    // Replace underscores with spaces, collapse multiple spaces
    name = name.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    // Capitalize each word
    return name.split(' ').map(part => part ? (part[0].toUpperCase() + part.slice(1).toLowerCase()) : part).join(' ');
}

