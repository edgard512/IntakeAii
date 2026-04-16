const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin1234';
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { adminSecret, name, specialty, pin } = req.body;
  if (adminSecret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!name || !pin) return res.status(400).json({ error: 'Name and PIN required' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + crypto.randomBytes(3).toString('hex');
  const pin_hash = await bcrypt.hash(pin, 10);

  const { data, error } = await supabase
    .from('doctors')
    .insert({ name, specialty: specialty || '', slug, pin_hash })
    .select('id, name, specialty, slug')
    .single();

  if (error) return res.status(500).json({ error: 'Failed to add doctor: ' + error.message });
  res.json({ success: true, doctor: data });
};
