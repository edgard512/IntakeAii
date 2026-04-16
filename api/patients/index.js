const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { doctorSlug, form } = req.body;
  if (!doctorSlug || !form) return res.status(400).json({ error: 'Missing data' });

  const { data: doctor, error: docErr } = await supabase
    .from('doctors')
    .select('id')
    .eq('slug', doctorSlug)
    .single();

  if (docErr || !doctor) return res.status(404).json({ error: 'Doctor not found' });

  const { data, error } = await supabase
    .from('patients')
    .insert({
      doctor_id: doctor.id,
      first_name: form.firstName,
      last_name: form.lastName,
      dob: form.dob,
      sex: form.sex,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      visit_reason: form.visitReason,
      symptoms: form.symptoms,
      symptom_duration: form.symptomDuration,
      pain_scale: form.painScale,
      conditions: form.conditions,
      surgeries: form.surgeries,
      family_history: form.familyHistory,
      smoking: form.smoking,
      alcohol: form.alcohol,
      medications: form.medications,
      allergies: form.allergies,
      supplements: form.supplements,
      status: 'waiting',
    })
    .select('id')
    .single();

  if (error) return res.status(500).json({ error: 'Failed to save patient: ' + error.message });
  res.json({ success: true, patientId: data.id });
};
