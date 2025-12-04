export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const email = body.email;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));

  const emailData = {
    service_id: 'service_1zmrk3q',
    template_id: 'template_a9zcjmr',
    user_id: 'b0JEissnJxbRPfhUD',
    template_params: {
      otp_code: otp,
      email: email
    }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const text = await response.text();

    if (response.ok || response.status === 200) {
      return res.status(200).json({ success: true, otp: otp });
    }

    return res.status(500).json({ success: false, error: 'Failed to send', details: text });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
}
