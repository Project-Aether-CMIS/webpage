$(function () {
    $('.sorting, .order').on('change', updateDocumentationDisplay);
    updateDocumentationDisplay();
});

async function updateDocumentationDisplay() {
    const sorting = $('.sorting').val();
    const order = $('.order').val();
    const documentationDisplay = $('.documentation_display');

    documentationDisplay.empty();
    const docs=await fetch('https://aether-backend.sfever.workers.dev/list')
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
        const docItem = $(`
            <div class="documentation_item">
                <h1 class="documentation_title">${doc.title}</h1>
                <p class="documentation_summary">${doc.summary}</p>
                <p class="documentation_date">${new Date(doc.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        `);
        documentationDisplay.append(docItem);
    });
}

