const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin1234';

  const supabaseUrl = process.env.SUPABASE_URL || 'https://kvnezyatdmdsmdfkdhyw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseKey) {
    return res.status(500).json({ 
      error: 'Missing SUPABASE_SERVICE_KEY',
      availableVars: Object.keys(process.env).filter(k => k.includes('SUPA') || k.includes('supa'))
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { adminSecret } = req.body;
  if (adminSecret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug, created_at')
    .order('name');

  if (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }

  res.json({ doctors: data || [] });
};
