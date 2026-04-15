import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin1234';
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { adminSecret } = req.body;
  if (adminSecret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug, created_at')
    .order('name');

  if (error) return res.status(500).json({ error: 'Server error' });
  res.json({ doctors: data || [] });
}
