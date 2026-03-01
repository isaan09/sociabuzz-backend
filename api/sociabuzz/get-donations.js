import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const queue = await redis.get('donation_queue') || [];
  const unprocessed = queue.filter(d => !d.processed);

  const updated = queue.map(d => ({ ...d, processed: true }));
  await redis.set('donation_queue', updated);

  return res.status(200).json({ success: true, donations: unprocessed });
}