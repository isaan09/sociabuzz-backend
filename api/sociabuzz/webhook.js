import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body;
  console.log("BODY DARI SOCIABUZZ:", JSON.stringify(body));

  const donation = {
    id: Date.now().toString(),
    nama: body.supporter || "Anonymous",
    amount: body.amount || 0,
    message: body.message || "",
    email: body.email_supporter || "",
    timestamp: new Date().toISOString(),
    processed: false
  };

  const queue = await redis.get('donation_queue') || [];
  queue.push(donation);
  await redis.set('donation_queue', queue);

  return res.status(200).json({ success: true });
}