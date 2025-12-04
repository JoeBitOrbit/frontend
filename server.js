import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist with proper caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: false
}));

// Handle SPA routing - serve index.html for all requests except static files
app.use((req, res, next) => {
  // Skip if file exists (images, css, js, etc)
  if (req.path.match(/\.[a-z0-9]+$/i)) {
    return next();
  }
  // Serve index.html for all other routes (SPA routing)
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});
