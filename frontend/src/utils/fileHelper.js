export const getFileViewerUrl = (fileUrl) => {
    if (!fileUrl) return '#';
    const isAbsolute = fileUrl.startsWith('http');
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const finalUrl = isAbsolute ? fileUrl : `${baseUrl}${fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl}`;

    // Cloudinary natively serves PDFs inline when uploaded with resource_type: 'image'
    // We recently fixing the backend to upload PDFs as 'image', so we can link directly.
    return finalUrl;
};
