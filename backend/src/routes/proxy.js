const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/file', (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const parsedUrl = new URL(fileUrl);
        if (parsedUrl.protocol !== 'https:') {
            return res.status(400).send('Only HTTPS URLs are supported');
        }

        https.get(fileUrl, (response) => {
            if (response.statusCode >= 400) {
                console.error(`Proxy could not fetch file. Status: ${response.statusCode}`);
                return res.status(response.statusCode).send('Failed to fetch file from source');
            }

            // Critical: Set Content-Disposition to inline to force browser viewing
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');

            // Stream the file back to the client
            response.pipe(res);
        }).on('error', (err) => {
            console.error('Proxy Fetch Error:', err);
            res.status(500).send('Error proxying the file');
        });
    } catch (err) {
        console.error('Invalid Proxy URL:', err);
        res.status(400).send('Invalid URL provided');
    }
});

module.exports = router;
