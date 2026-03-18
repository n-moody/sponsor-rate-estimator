const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
    const data = JSON.parse(event.body);
    const { downloads, niche, episode_length, email, show_name } = data;

    const html = `
      <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body{font-family: Arial, sans-serif; padding:28px; color:#0f172a}
          .header{display:flex; justify-content:space-between; align-items:center}
          h1{font-size:20px;margin:0}
          .meta{margin-top:8px;color:#475569}
          .section{margin-top:18px}
          table{width:100%;border-collapse:collapse;margin-top:8px}
          th,td{padding:8px;border-bottom:1px solid #eef2f7}
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${show_name || 'Podcast Name'} — Sponsorship Media Kit</h1>
            <div class="meta">Downloads: ${downloads} • Niche: ${niche} • Episode Length: ${episode_length} min</div>
          </div>
        </div>

        <div class="section">
          <h3>Suggested Rates</h3>
          <table>
            <tr><th>Ad</th><th>Length</th><th>Suggested rate</th></tr>
            <tr><td>Pre-roll</td><td>15s</td><td>$${Math.max(30, Math.round(downloads/1000*5))}–$${Math.max(60, Math.round(downloads/1000*10))}</td></tr>
            <tr><td>Mid-roll</td><td>60s</td><td>$${Math.max(100, Math.round(downloads/1000*20))}–$${Math.max(300, Math.round(downloads/1000*40))}</td></tr>
          </table>
        </div>

        <div class="section">
          <h3>Deliverables</h3>
          <ul>
            <li>Host‑read ad</li>
            <li>Show notes link</li>
            <li>Social posts (1–2)</li>
          </ul>
        </div>
      </body>
      </html>
    `;

    const apiKey = process.env.DOC_RAPTOR_KEY;
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