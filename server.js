import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all non-file routes
app.get('*', (req, res) => {
  // Don't redirect actual files (images, css, js, etc)
  if (req.path.match(/\.[a-z0-9]+$/i)) {
    res.status(404).send('Not found');
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});
