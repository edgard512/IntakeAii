import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { slug, pin } = req.body;
  if (!slug || !pin) return res.status(400).json({ error: 'Missing credentials' });

  // Verify doctor
  const { data: doctor, error: docErr } = await supabase
    .from('doctors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (docErr || !doctor) return res.status(401).json({ error: 'Invalid PIN' });
  const valid = await bcrypt.compare(pin, doctor.pin_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid PIN' });

  // Get today's patients
  const today = new Date().toISOString().split('T')[0];
  const { data: patients, error: patErr } = await supabase
    .from('patients')
    .select('*')
    .eq('doctor_id', doctor.id)
    .gte('submitted_at', today + 'T00:00:00')
    .order('submitted_at', { ascending: false });

  if (patErr) return res.status(500).json({ error: 'Server error' });
  res.json({ patients: patients || [] });
}
