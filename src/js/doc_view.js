$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');
    if (!fileName) {
        alert('No file specified.');
        window.location.replace('documentation.html');
        return;
    }
    renderContent(fileName);
});

async function renderContent(fileName) {
    const response = await fetch('https://aether-backend.sfever.workers.dev/files/' + encodeURIComponent(fileName));
    const data = await response.json();
    const htmlContent = data.html;
    const metadata = data.metadata;
    let contentContainer = $('.content');
    contentContainer.html(htmlContent);
    let titleElement = $('.title');
    titleElement.text(formatDisplayTitle(fileName));
    let authorElement = $('.author');
    authorElement.text(formatDisplayTitle(metadata.author) || 'Unknown Author');
    let dateElement = $('.date');
    dateElement.text(formatDocumentDate(metadata.file_date) || 'Unknown Date');
}

function formatDisplayTitle(fileName) {
    if (!fileName || typeof fileName !== 'string') return 'Untitled';
    // Remove .md extension (case-insensitive)
    let name = fileName.replace(/\.md$/i, '');
    // Replace underscores with spaces, collapse multiple spaces
    name = name.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    // Capitalize each word
    return name.split(' ').map(part => part ? (part[0].toUpperCase() + part.slice(1).toLowerCase()) : part).join(' ');
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