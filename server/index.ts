import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'WedCraft API', version: '1.0.0' });
});

// Templates API
app.get('/api/templates', (_, res) => {
  res.json({
    templates: [
      { id: '1', name: 'Royal Rajasthan', category: 'hindu', isPremium: false, rating: 4.9, downloads: 12453 },
      { id: '2', name: 'Garden Whisper', category: 'minimal', isPremium: false, rating: 4.8, downloads: 8923 },
      { id: '3', name: 'Starlit Shores', category: 'destination', isPremium: true, rating: 4.95, downloads: 6712 },
    ]
  });
});

// AI Generate stub
app.post('/api/ai/generate', (req, res) => {
  const { prompt, style } = req.body;
  res.json({
    success: true,
    invitation: {
      id: Date.now().toString(),
      prompt,
      style,
      title: 'AI Generated Invitation',
      content: `A beautiful ${style} wedding invitation based on: "${prompt}"`,
      generatedAt: new Date().toISOString(),
    }
  });
});

// Designs API
app.get('/api/designs/:userId', (req, res) => {
  res.json({ designs: [] });
});

app.post('/api/designs', (req, res) => {
  const design = req.body;
  res.json({ success: true, design: { ...design, id: Date.now().toString() } });
});

// Landing page
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'landing-page.html'));
});

app.listen(PORT, () => {
  console.log(`🌸 WedCraft API running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:5000`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});

export default app;
