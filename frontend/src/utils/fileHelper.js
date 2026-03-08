export const getFileViewerUrl = (fileUrl) => {
    if (!fileUrl) return '#';
    const isAbsolute = fileUrl.startsWith('http');
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const finalUrl = isAbsolute ? fileUrl : `${baseUrl}${fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl}`;

    // For Cloudinary PDFs, force inline viewing using Google Docs Viewer
    // because Cloudinary free accounts force PDF downloads overriding browser behavior.
    if (finalUrl.toLowerCase().includes('.pdf') && finalUrl.includes('res.cloudinary.com')) {
        // Without embedded=true it provides a full-page clean viewer
        return `https://docs.google.com/viewer?url=${encodeURIComponent(finalUrl)}`;
    }

    return finalUrl;
};
