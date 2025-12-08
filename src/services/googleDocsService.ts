import { marked } from 'marked';

export const createDocument = async (title: string, content: string, token: string) => {
    try {
        // 1. Convert Markdown to HTML
        const htmlContent = await marked(content);

        // Wrap in basic HTML structure for better formatting interpretation
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    h1 { font-size: 24px; font-weight: bold; margin-bottom: 0.5em; }
                    h2 { font-size: 20px; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
                    h3 { font-size: 16px; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
                    p { margin-bottom: 1em; }
                    ul, ol { margin-bottom: 1em; padding-left: 2em; }
                    li { margin-bottom: 0.3em; }
                    pre { background-color: #f5f5f5; padding: 10px; border-radius: 4px; white-space: pre-wrap; }
                    code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 2px; font-family: monospace; }
                    blockquote { border-left: 4px solid #ccc; margin-left: 0; padding-left: 1em; color: #666; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        // 2. Prepare Multipart Body for Drive API
        const metadata = {
            name: title,
            mimeType: 'application/vnd.google-apps.document'
        };

        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: text/html\r\n\r\n' +
            fullHtml +
            closeDelimiter;

        // 3. Upload to Drive API
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create document: ${error.error?.message || response.statusText}`);
        }

        const fileData = await response.json();
        return {
            documentId: fileData.id,
            ...fileData
        };

    } catch (error) {
        console.error('Google Docs API Error:', error);
        throw error;
    }
};
