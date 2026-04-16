const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin1234';

const supabase = createClient(
    'https://kvnezyatdmdsmdfkdhyw.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  );

  const { adminSecret } = req.body;
  if (adminSecret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug, created_at')
    .order('name');

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }

  res.json({ doctors: data || [] });
};
