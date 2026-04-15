import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { slug } = req.query;

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug')
    .eq('slug', slug)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Doctor not found' });
  res.json(data);
}
