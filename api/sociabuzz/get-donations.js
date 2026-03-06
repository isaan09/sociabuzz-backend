import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const queue = await redis.get('donation_queue') || [];
  console.log("QUEUE ISI:", JSON.stringify(queue));
  
  const unprocessed = queue.filter(d => !d.processed);
  console.log("UNPROCESSED:", unprocessed.length);

  await redis.set('donation_queue', []);

  return res.status(200).json({ success: true, donations: unprocessed });
}