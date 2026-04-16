const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin1234';
  const supabaseUrl = process.env.SUPABASE_URL || 'https://kvnezyatdmdsmdfkdhyw.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;

  // Debug — return all env var names so we can see what's available
  if (!supabaseKey) {
    return res.status(500).json({ 
      error: 'SUPABASE_SERVICE_KEY is missing',
      envVarsAvailable: Object.keys(process.env).join(', ')
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { adminSecret } = req.body;
  if (adminSecret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, specialty, slug, created_at')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });

  res.json({ doctors: data || [] });
};
