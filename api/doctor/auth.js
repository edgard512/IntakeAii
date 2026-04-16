const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { slug, pin } = req.body;
  if (!slug || !pin) return res.status(400).json({ error: 'Missing credentials' });

  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return res.status(401).json({ error: 'Invalid PIN' });

  const valid = await bcrypt.compare(pin, data.pin_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid PIN' });

  res.json({ success: true, doctor: { id: data.id, name: data.name, specialty: data.specialty } });
};
