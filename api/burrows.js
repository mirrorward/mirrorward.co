const BURROWS_DATA = [
  {
    name: "alice@wonderland",
    sysop: "Alice",
    status: "online",
    description: "The primary routing cell. Exploring technologies down the rabbit hole.",
    uptime: "99.8%",
    listeners: ["quic", "ws", "telnet", "hotline", "finger", "radio"],
    quicUri: "quic://wonderland.co:4653",
    wsUri: "ws://wonderland.co:4654",
    identity: "Ed25519: 7d6cf4a1e948c267c82ab4c231fe231846c98d7e63b4d21e847c2134a6543b2e",
    sparkline: [100, 100, 98, 100, 100, 100, 100],
    plan: "Engineering the looking-glass routing fabric.\nTasks:\n- Wire E2EE tunnels for cross-burrow flood-fill.\n- Drink tea with the Mad Hatter.\n- Follow the white rabbit."
  },
  {
    name: "neo@zion",
    sysop: "Neo",
    status: "online",
    description: "The core database burrow. Replicating archives outside the Matrix.",
    uptime: "100.0%",
    listeners: ["quic", "ws", "tunnels", "finger"],
    quicUri: "quic://zion.network:4653",
    wsUri: "ws://zion.network:4654",
    identity: "Ed25519: a89e3f2b8c9d8e7f6a5b4c3d2e1f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    sparkline: [100, 100, 100, 100, 100, 100, 100],
    plan: "Maintaining connection with Morpheus and Trinity.\nCurrently monitoring Sentinel patrol logs.\n\"There is no spoon.\""
  },
  {
    name: "mad-hatter@tea-party",
    sysop: "Hatter",
    status: "online",
    description: "BBS board for cryptographic debates. Tea and cookies served.",
    uptime: "94.2%",
    listeners: ["quic", "telnet", "hotline", "radio"],
    quicUri: "quic://tea.party:4653",
    wsUri: "ws://tea.party:4654",
    identity: "Ed25519: 5c2b9e8f7d6c5b4a3c2b1a0f9e8d7c6b5a4b3c2d1e0f9a8d7c6b5a4b3c2d1e0f",
    sparkline: [90, 95, 92, 98, 93, 91, 100],
    plan: "Tuning the Icecast Radio encoder stream.\nUpgrading telnet BBS menus to ANSI CP437 standard.\n\"Why is a raven like a writing-desk?\""
  },
  {
    name: "chesire@woods",
    sysop: "Chesire",
    status: "online",
    description: "Anti-entropy gossip node. Disappears occasionally, leaving only the key.",
    uptime: "76.4%",
    listeners: ["quic", "ws", "finger"],
    quicUri: "quic://woods.cat:4653",
    wsUri: "ws://woods.cat:4654",
    identity: "Ed25519: 9e8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    sparkline: [80, 0, 75, 95, 100, 85, 100],
    plan: "Debugging the invisible Cheshire status mode.\nIf you finger me, I might not be here.\n\"We're all mad here.\""
  },
  {
    name: "morpheus@nebuchadnezzar",
    sysop: "Morpheus",
    status: "offline",
    description: "Signal transmission deck. Broadcasting warning frequencies.",
    uptime: "0.0%",
    listeners: ["quic", "ws", "tunnels", "radio"],
    quicUri: "quic://neb.ship:4653",
    wsUri: "ws://neb.ship:4654",
    identity: "Ed25519: 3d2e1f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9e3f2b8c9d8e7f6a5b4c",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
    plan: "Broadcasting warning beacons down RHP tunnels.\nOptics offline due to Sentinel presence.\n\"Fate, it seems, is not without a sense of irony.\""
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  return res.status(200).json(BURROWS_DATA);
}
