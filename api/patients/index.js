const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { slug, pin, status, ai_summary } = req.body;
  if (!slug || !pin) return res.status(400).json({ error: 'Missing credentials' });

  const { data: doctor, error: docErr } = await supabase
    .from('doctors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (docErr || !doctor) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(pin, doctor.pin_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const updates = {};
  if (status !== undefined) updates.status = status;
  if (ai_summary !== undefined) updates.ai_summary = ai_summary;

  if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });

  const { error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', req.query.id)
    .eq('doctor_id', doctor.id);

  if (error) return res.status(500).json({ error: 'Update failed' });
  res.json({ success: true });
};
