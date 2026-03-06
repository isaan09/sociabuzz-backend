import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const queue = await redis.get('donation_queue') || [];
  
  // Ambil yang belum diproses
  const unprocessed = queue.filter(d => !d.processed);
  
  // Hapus semua dari queue setelah diambil
  await redis.set('donation_queue', []);

  return res.status(200).json({ success: true, donations: unprocessed });
}