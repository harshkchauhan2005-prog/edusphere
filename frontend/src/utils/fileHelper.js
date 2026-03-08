export const getFileViewerUrl = (fileUrl) => {
    if (!fileUrl) return '#';
    const isAbsolute = fileUrl.startsWith('http');
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const finalUrl = isAbsolute ? fileUrl : `${baseUrl}${fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl}`;

    // Cloudinary natively serves PDFs as attachments for free tier, and 'image' uploaded PDFs break Acrobat.
    // We proxy it through our backend to force inline viewing with the correct headers.
    if (finalUrl.toLowerCase().includes('.pdf') && finalUrl.includes('res.cloudinary.com')) {
        return `${baseUrl}/api/proxy/file?url=${encodeURIComponent(finalUrl)}`;
    }

    return finalUrl;
};
