const BREVO_KEY    = process.env.BREVO_API_KEY;
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL   || 'admin@riyada.com';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@riyada.com';
const SITE_URL     = process.env.SITE_URL      || 'https://rc.riyada-ventures.com';

async function send(subject, htmlContent) {
  if (!BREVO_KEY) return; // silently skip if not configured
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Riyada Center', email: SENDER_EMAIL },
        to: [{ email: ADMIN_EMAIL }],
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) console.error('[Email] Brevo error:', await res.text());
  } catch (e) {
    console.error('[Email] Failed to send:', e.message);
  }
}

function bookingEmail(booking) {
  const optRow = (label, val) =>
    val ? `<tr><td style="padding:6px 0;color:#6b7280;width:140px">${label}</td><td style="padding:6px 0">${val}</td></tr>` : '';

  return send(
    `📅 New Booking ${booking.ref} — ${booking.service}`,
    `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#3355EE;padding:24px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">New Booking Received</h1>
        <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:14px">Riyada Center Admin</p>
      </div>
      <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#6b7280;width:140px">Reference</td>
              <td style="padding:6px 0;font-weight:700;color:#3355EE">${booking.ref}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Parent</td>
              <td style="padding:6px 0">${booking.parentName}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Child</td>
              <td style="padding:6px 0">${booking.childName}${booking.childAge ? `, Age ${booking.childAge}` : ''}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Service</td>
              <td style="padding:6px 0">${booking.service}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Date &amp; Time</td>
              <td style="padding:6px 0">${booking.date} at ${booking.time}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone</td>
              <td style="padding:6px 0"><strong>${booking.phone}</strong></td></tr>
          ${optRow('Email', booking.email)}
          ${optRow('Notes', booking.notes)}
        </table>
        <div style="margin-top:20px">
          <a href="${SITE_URL}/admin/bookings/${booking.id}"
             style="background:#3355EE;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">
            View in Admin Panel →
          </a>
        </div>
      </div>
    </div>`
  );
}

function contactEmail(msg) {
  const optRow = (label, val) =>
    val ? `<tr><td style="padding:6px 0;color:#6b7280;width:120px">${label}</td><td style="padding:6px 0">${val}</td></tr>` : '';

  return send(
    `💬 New Message from ${msg.name}`,
    `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#059669;padding:24px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">New Contact Message</h1>
        <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:14px">Riyada Center Admin</p>
      </div>
      <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#6b7280;width:120px">From</td>
              <td style="padding:6px 0;font-weight:700">${msg.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email</td>
              <td style="padding:6px 0"><a href="mailto:${msg.email}" style="color:#3355EE">${msg.email}</a></td></tr>
          ${optRow('Phone', msg.phone)}
          ${optRow('Service', msg.service)}
          ${optRow('Child Age', msg.childAge)}
          ${optRow('Concern', msg.concern)}
        </table>
        <div style="margin-top:16px;padding:14px;background:#fff;border-radius:6px;border:1px solid #e5e7eb;font-size:14px;color:#374151;line-height:1.6">
          ${msg.message.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}
        </div>
        <div style="margin-top:20px;display:flex;gap:12px">
          <a href="mailto:${msg.email}"
             style="background:#3355EE;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">
            Reply via Email →
          </a>
          <a href="${SITE_URL}/admin/messages/${msg.id}"
             style="background:#fff;color:#374151;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;border:1px solid #e5e7eb">
            View in Admin →
          </a>
        </div>
      </div>
    </div>`
  );
}

module.exports = { bookingEmail, contactEmail };
