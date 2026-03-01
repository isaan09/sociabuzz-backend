import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body;

  const donation = {
    id: Date.now().toString(),
    nama: body.donor_name || body.nama || "Anonymous",
    amount: body.amount || 0,
    message: body.message || "",
    email: body.email || "",
    timestamp: new Date().toISOString(),
    processed: false
  };

  const queue = await kv.get('donation_queue') || [];
  queue.push(donation);
  await kv.set('donation_queue', queue);

  return res.status(200).json({ success: true });
}