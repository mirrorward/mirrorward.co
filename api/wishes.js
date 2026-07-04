// In-memory cache for serverless invocation lifetime
let wishesData = [
  {
    id: 1,
    title: "Classic Mac OS System 7.5.3 CD-ROM (ISO)",
    seeker: "alice@wonderland",
    bounty: 2400, 
    votes: 32,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    title: "Amiga 500 Demo Scene Collection (LHA)",
    seeker: "mad-hatter@tea-party",
    bounty: 800, 
    votes: 18,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    title: "Phackers & Phreakers Magazine #1-12 (PDF)",
    seeker: "neo@zion",
    bounty: 1200, 
    votes: 45,
    timestamp: "1 day ago"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve all wishes
  if (req.method === 'GET') {
    return res.status(200).json(wishesData);
  }

  // POST: Add a new wish
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { title, bounty } = body;
    if (!title || typeof title !== 'string' || !bounty || isNaN(bounty) || bounty <= 0) {
      return res.status(400).json({ error: 'Invalid title or bounty' });
    }

    const newWish = {
      id: Date.now(),
      title: title.trim(),
      seeker: 'guest@mirrorward',
      bounty: parseInt(bounty),
      votes: 1,
      timestamp: 'Just now'
    };

    wishesData.unshift(newWish);
    console.log(`[Wishing Well API] Cast new wish: '${newWish.title}' with ${newWish.bounty}MB bounty.`);
    return res.status(201).json(newWish);
  }

  // PUT: Upvote a wish
  if (req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const id = parseInt(body?.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing wish ID' });
    }

    const wish = wishesData.find(w => w.id === id);
    if (!wish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    wish.votes++;
    wish.bounty += 100; // Boost bounty by 100MB on upvote

    console.log(`[Wishing Well API] Upvoted wish ID ${id}. New votes: ${wish.votes}, bounty: ${wish.bounty}MB`);
    return res.status(200).json(wish);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
