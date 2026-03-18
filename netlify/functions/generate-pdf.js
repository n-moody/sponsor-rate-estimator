const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
    const data = JSON.parse(event.body);
    const { downloads, niche, episode_length, email, show_name } = data;

    // If DocRaptor key not set, return a mock PDF (use existing sample file in repo)
    const apiKey = process.env.DOC_RAPTOR_KEY;
    if (!apiKey) {
      const mockPath = path.join(__dirname, '..', 'media_kit_small.pdf');
      if (fs.existsSync(mockPath)) {
        const pdf = fs.readFileSync(mockPath);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${(show_name||'podcast')}_media_kit.pdf"`,
          },
          body: pdf.toString('base64'),
          isBase64Encoded: true
        };
      } else {
        return { statusCode: 500, body: 'Mock PDF not found on server' };
      }
    }

    // Real generation via DocRaptor
    const html = `...`;

    const resp = await fetch('https://docraptor.com/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_credentials: apiKey,
        doc: {
          test: true,
          document_type: 'pdf',
          name: `${(show_name||'podcast')}_media_kit.pdf`,
          document_content: html
        }
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: 502, body: 'DocRaptor error: ' + txt };
    }

    const pdfBuffer = await resp.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(show_name||'podcast')}_media_kit.pdf"`,
      },
      body: Buffer.from(pdfBuffer).toString('base64'),
      isBase64Encoded: true
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};