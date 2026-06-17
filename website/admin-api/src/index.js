require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://rc.riyada-ventures.com',
    /\.vercel\.app$/,
  ],
}));
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/',     require('./routes/public'));
app.use('/admin/dashboard', require('./routes/dashboard'));
app.use('/admin/bookings',  require('./routes/bookings'));
app.use('/admin/messages',  require('./routes/messages'));
app.use('/admin/services',  require('./routes/services'));
app.use('/admin/packages',  require('./routes/packages'));
app.use('/admin/team',      require('./routes/team'));
app.use('/admin/users',     require('./routes/users'));
app.use('/admin/settings',  require('./routes/settings'));
app.use('/admin/chatbot',   require('./routes/chatbot-admin'));
app.use('/chat',            require('./routes/chat'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/debug-chat', async (_req, res) => {
  const gemini = process.env.GEMINI_API_KEY;
  const deepseek = process.env.DEEPSEEK_API_KEY;
  if (!gemini && !deepseek) return res.json({ error: 'No AI key set. Add GEMINI_API_KEY or DEEPSEEK_API_KEY' });
  const url = gemini
    ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    : 'https://api.deepseek.com/v1/chat/completions';
  const key = gemini || deepseek;
  const model = gemini ? 'gemini-2.0-flash' : 'deepseek-chat';
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Say hi in one word' }], max_tokens: 20 }),
    });
    const data = await r.json();
    res.json({ provider: gemini ? 'gemini' : 'deepseek', status: r.status, data });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// Email test endpoint
app.get('/test-email', async (_req, res) => {
  const { bookingEmail } = require('./email');
  try {
    await bookingEmail({
      id: 'test-id', ref: 'RYD-TEST1', parentName: 'Test Parent', childName: 'Test Child',
      childAge: '5', service: 'Speech Therapy', date: '2026-06-17', time: '10:00 AM',
      phone: '+966 50 000 0000', email: '', notes: '',
    });
    res.json({ ok: true, config: {
      hasApiKey: !!process.env.BREVO_API_KEY,
      adminEmail: process.env.ADMIN_EMAIL || '(not set)',
      senderEmail: process.env.BREVO_SENDER_EMAIL || '(not set)',
    }});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Riyada Admin API listening on http://localhost:${PORT}`));
