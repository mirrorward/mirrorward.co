// ==========================================================================
// LOOKING GLASS INDEX CONTROLLER (glass.burrow.land Mock)
// Handles mock data, sparkline generation, search/filtering, and descriptor inspection
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initLookingGlass();
});

/* Mock Server Descriptors Data */
const BURROWS_DATA = [
  {
    name: "alice@wonderland",
    sysop: "Alice in Wonderland",
    status: "online",
    uptime: "99.8%",
    sparkline: [99.8, 100, 99.7, 99.9, 100, 99.8, 99.9],
    description: "The flagship central sanctuary Burrow. Reconnecting the physical to the rabbit hole.",
    listeners: ["quic", "ws", "telnet", "hotline", "finger", "radio", "nntp"],
    identity: "Ed25519: 7d6cf4a1c5e8b9d2a0e4f3c7b2a95c8e1d0f6a2b5c7d8e9f0a1b2c3d4e5f6a7b",
    plan: "Project: engineering the looking-glass routing fabric.\nPlan:\n- Wire E2EE tunnels for cross-burrow flood-fill.\n- Follow the white rabbit.\n\"Curiouser and curiouser!\"",
    quicUri: "quic://wonderland.co:4653",
    wsUri: "ws://wonderland.co:4654"
  },
  {
    name: "mad-hatter@tea-party",
    sysop: "Mad Hatter",
    status: "online",
    uptime: "94.2%",
    sparkline: [90.5, 92.1, 95.0, 93.8, 96.2, 92.0, 94.2],
    description: "Dedicated discussions, retro radio broadcasts, and tea-time logistics.",
    listeners: ["quic", "ws", "radio", "telnet"],
    identity: "Ed25519: 2b8a7c9d6e4f3a0c1b9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b",
    plan: "Project: Synching tea pot heat sensors over the Warren Swarm DHT.\nPlan:\n- Calibrate temperature metrics.\n- Re-toss FidoNet mail bundles.\n- Keep it always 6:00 PM.",
    quicUri: "quic://tea-party.net:4653",
    wsUri: "ws://tea-party.net:4654"
  },
  {
    name: "chesire@woods",
    sysop: "Cheshire Cat",
    status: "online",
    uptime: "91.5%",
    sparkline: [100, 95.4, 0, 98.2, 100, 99.1, 91.5], // includes offline day (0%)
    description: "Cryptic bulletin boards, ephemeral chat corridors, and ghost services.",
    listeners: ["quic", "ws", "nntp", "finger"],
    identity: "Ed25519: 9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f",
    plan: "Project: Disappearing routing endpoints (Ephemeral Tunnels).\nPlan:\n- Go invisible when rate limits are exceeded.\n- Leave only a smiling trace on the Finger daemon.\n\"We're all mad here.\"",
    quicUri: "quic://chesire-woods.org:4653",
    wsUri: "ws://chesire-woods.org:4654"
  },
  {
    name: "neo@zion",
    sysop: "Thomas Anderson",
    status: "online",
    uptime: "99.9%",
    sparkline: [99.9, 100, 99.8, 100, 100, 99.9, 100],
    description: "Decentralized file swarms (The Warren), cryptographic key exchanges, and proxy relays.",
    listeners: ["quic", "ws", "tunnels", "finger"],
    identity: "Ed25519: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    plan: "Project: Bypassing the Agent-scanning firewalls on port 80.\nPlan:\n- Feed the Warren torrent queue with raw source ISO codes.\n- Run load testing harness (warren-stampede).\n- Wake up, Neo.",
    quicUri: "quic://zion-gate.net:4653",
    wsUri: "ws://zion-gate.net:4654"
  },
  {
    name: "red-queen@court",
    sysop: "Iracebeth",
    status: "online",
    uptime: "99.1%",
    sparkline: [98.5, 99.0, 99.5, 99.2, 98.8, 99.4, 99.1],
    description: "Highly moderated, invite-only Burrow. Enforced role ACLs and strict bandwidth caps.",
    listeners: ["quic", "telnet", "finger"],
    identity: "Ed25519: f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3c2b1a0d9e8f7a6b5c4d3e2f1a0b9",
    plan: "Project: Sandboxing guest personas inside Telnet door games.\nPlan:\n- Instantly ban nodes querying unlicensed directories.\n- Crop header icons that aren't painted Red.\n\"Off with their heads!\"",
    quicUri: "quic://queen-court.co:4653",
    wsUri: "ws://queen-court.co:4654"
  },
  {
    name: "white-rabbit@late-run",
    sysop: "Nivens McTwisp",
    status: "online",
    uptime: "93.4%",
    sparkline: [95.0, 89.2, 91.4, 94.0, 96.1, 95.8, 93.4],
    description: "Time synchronization relays, network gossip beacons, and high-frequency ping nodes.",
    listeners: ["quic", "ws", "tunnels"],
    identity: "Ed25519: 0f9e8d7c6b5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c",
    plan: "Project: Compressing anti-entropy gossip packets over UDP.\nPlan:\n- Sync clocks with the Mad Hatter.\n- Run late queue audits.\n\"Oh dear! Oh dear! I shall be too late!\"",
    quicUri: "quic://late-run.net:4653",
    wsUri: "ws://late-run.net:4654"
  },
  {
    name: "keymaker@source",
    sysop: "The Keymaker",
    status: "online",
    uptime: "100%",
    sparkline: [100, 100, 100, 100, 100, 100, 100],
    description: "E2EE double-ratchet key distribution, X3DH handshakes, and sealed sender groups.",
    listeners: ["quic", "tunnels"],
    identity: "Ed25519: 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    plan: "Project: Generating temporary tunnel keypairs.\nPlan:\n- Open short-lived S2S tunnels.\n- Provide the door, select the key.\n\"One door leads to the source. The others to oblivion.\"",
    quicUri: "quic://keymaker.source:4653",
    wsUri: "ws://keymaker.source:4654"
  },
  {
    name: "dormouse@teapot",
    sysop: "Dormouse",
    status: "offline",
    uptime: "12.4%",
    sparkline: [22.0, 14.5, 8.0, 0, 0, 0, 12.4],
    description: "Low-power swarm storage cache. Sleep-state listener.",
    listeners: ["quic", "ws"],
    identity: "Ed25519: e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2",
    plan: "Project: Sleeping.\nPlan:\n- Wake up briefly to serve cached Warren manifests.\n- Sleep again.\n\"Twinkle, twinkle, little bat...\"",
    quicUri: "quic://dormouse-sleep.net:4653",
    wsUri: "ws://dormouse-sleep.net:4654"
  }
];

function initLookingGlass() {
  const listContainer = document.getElementById('burrows-directory-list');
  const searchInput = document.getElementById('directory-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Modal Elements
  const modal = document.getElementById('descriptor-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const tabInfo = document.getElementById('btn-tab-info');
  const tabJson = document.getElementById('btn-tab-json');
  const panelInfo = document.getElementById('modal-panel-info');
  const panelJson = document.getElementById('modal-panel-json');
  const verifyBtn = document.getElementById('modal-verify-btn');
  const connectBtn = document.getElementById('modal-connect-btn');
  
  if (!listContainer) return;

  // Active filter state
  let currentFilter = 'all';
  let searchQuery = '';

  // Render initial list
  renderDirectory();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderDirectory();
    });
  }

  // Filter category buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-category');
      renderDirectory();
    });
  });

  // Modal setup
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close modal clicking outside content
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Modal tab toggle
  if (tabInfo && tabJson && panelInfo && panelJson) {
    tabInfo.addEventListener('click', () => {
      tabInfo.classList.add('active');
      tabJson.classList.remove('active');
      panelInfo.classList.add('active');
      panelJson.classList.remove('active');
    });

    tabJson.addEventListener('click', () => {
      tabJson.classList.add('active');
      tabInfo.classList.remove('active');
      panelJson.classList.add('active');
      panelInfo.classList.remove('active');
    });
  }

  // Render directory function
  function renderDirectory() {
    listContainer.innerHTML = '';
    
    // Filter data
    const filtered = BURROWS_DATA.filter(burrow => {
      // Search matching
      const matchesSearch = 
        burrow.name.toLowerCase().includes(searchQuery) ||
        burrow.sysop.toLowerCase().includes(searchQuery) ||
        burrow.description.toLowerCase().includes(searchQuery) ||
        burrow.identity.toLowerCase().includes(searchQuery);

      if (!matchesSearch) return false;

      // Category matching
      if (currentFilter === 'all') return true;
      if (currentFilter === 'chat') return burrow.listeners.includes('quic') || burrow.listeners.includes('ws');
      if (currentFilter === 'files') return burrow.listeners.includes('tunnels') || burrow.name === 'neo@zion';
      if (currentFilter === 'radio') return burrow.listeners.includes('radio');
      if (currentFilter === 'bbs') return burrow.listeners.includes('telnet') || burrow.listeners.includes('hotline');

      return true;
    });

    // Update active count badge
    const activeCounter = document.getElementById('stat-burrows');
    if (activeCounter) {
      activeCounter.textContent = filtered.filter(b => b.status === 'online').length;
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="glassmorphic" style="padding: 3rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono);">
          ⚠️ NO MAPPED BURROWS FOUND IN CURRENT GOSSIP CELL
        </div>
      `;
      return;
    }

    // Build list
    filtered.forEach(burrow => {
      const row = document.createElement('div');
      row.className = 'burrow-row glassmorphic hover-glow-' + (burrow.status === 'online' ? 'green' : 'purple');
      
      // Calculate sparkline path
      const sparkPath = generateSparklinePath(burrow.sparkline);
      const sparkColor = burrow.status === 'online' ? 'var(--accent-green)' : 'oklch(50% 0.1 20)';

      // Service badges
      let serviceBadges = '';
      burrow.listeners.forEach(lis => {
        const isCore = ["quic", "ws", "tunnels"].includes(lis);
        serviceBadges += `<span class="srv-badge ${isCore ? 'active-srv' : ''}">${lis.toUpperCase()}</span>`;
      });

      row.innerHTML = `
        <div class="burrow-indicator-wrapper">
          <span class="burrow-indicator ${burrow.status}"></span>
        </div>
        <div class="burrow-info-col">
          <span class="burrow-name">${burrow.name} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">by ${burrow.sysop}</span></span>
          <span class="burrow-desc">${burrow.description}</span>
        </div>
        <div class="badges-container">
          ${serviceBadges}
        </div>
        <div class="sparkline-container">
          <span class="sparkline-label">7D UPTIME: ${burrow.uptime}</span>
          <svg class="sparkline-svg" viewBox="0 0 100 20">
            <path d="${sparkPath}" stroke="${sparkColor}"></path>
          </svg>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <a href="https://rabbit.direct/${burrow.name}" target="_blank" class="btn btn-primary connect-direct-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border: none; box-shadow: 0 2px 8px rgba(0, 255, 102, 0.2);">Connect</a>
          <button class="btn btn-secondary inspect-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" data-name="${burrow.name}">Inspect</button>
        </div>
      `;

      // Make row clickable (excluding buttons clicking themselves)
      row.addEventListener('click', (e) => {
        if (!e.target.classList.contains('inspect-btn') && !e.target.classList.contains('connect-direct-btn')) {
          openDescriptorModal(burrow);
        }
      });

      // Bind button click
      row.querySelector('.inspect-btn').addEventListener('click', () => {
        openDescriptorModal(burrow);
      });

      listContainer.appendChild(row);
    });
  }

  // Generate SVG path for uptime sparkline
  function generateSparklinePath(data) {
    // 7 points, width: 100, height: 20
    const xStep = 100 / 6;
    let points = [];
    for (let i = 0; i < data.length; i++) {
      const x = i * xStep;
      // Map 0-100% uptime to height 18 (top padding) to 2 (bottom padding)
      const y = 18 - (data[i] / 100) * 16;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  }

  // Modal Open Logic
  function openDescriptorModal(burrow) {
    if (!modal) return;

    // Reset verify button state
    verifyBtn.className = 'btn btn-secondary';
    verifyBtn.textContent = 'Verify Signature';
    verifyBtn.disabled = false;

    // Set texts
    document.getElementById('modal-burrow-name').textContent = burrow.name;
    document.getElementById('info-id-key').textContent = burrow.identity;
    document.getElementById('info-quic-uri').textContent = burrow.quicUri;
    document.getElementById('info-ws-uri').textContent = burrow.wsUri;
    document.getElementById('info-plan-text').textContent = burrow.plan;

    // Listeners badges inside info
    const badgesBox = document.getElementById('info-listeners-badges');
    badgesBox.innerHTML = '';
    burrow.listeners.forEach(lis => {
      const badge = document.createElement('span');
      badge.className = 'srv-badge active-srv';
      badge.textContent = lis.toUpperCase();
      badgesBox.appendChild(badge);
    });

    // Set raw JSON
    const rawJsonPayload = {
      descriptor: {
        name: burrow.name,
        timestamp: Date.now(),
        identity_key: burrow.identity.replace("Ed25519: ", ""),
        endpoints: {
          quic: burrow.quicUri,
          websocket: burrow.wsUri
        },
        services: burrow.listeners,
        sysop: burrow.sysop,
        uptime_ratio_7d: parseFloat(burrow.uptime),
        verifiable_signature: "blake3-ed25519-sig: " + Math.random().toString(16).substring(2, 10) + "..."
      }
    };
    document.getElementById('descriptor-json-raw').textContent = JSON.stringify(rawJsonPayload, null, 2);

    // Verify Action handler
    verifyBtn.onclick = () => {
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying Blake3 Hash...';
      
      const modalContent = modal.querySelector('.modal-content');
      modalContent.classList.add('verify-flash');

      setTimeout(() => {
        verifyBtn.textContent = '✓ Signature Valid';
        verifyBtn.className = 'btn btn-secondary text-glow-green';
        modalContent.classList.remove('verify-flash');
        
        // Notify verification in dashboard console
        if (window.printTerminalDirectLine) {
          window.printTerminalDirectLine(`\n[Gossip Verify] Verified descriptor for '${burrow.name}'. Cryptographic chain: OK.`);
        }
      }, 700);
    };

    // Close on navigation
    connectBtn.onclick = () => {
      closeModal();
    };

    // Set direct link
    const modalDirectBtn = document.getElementById('modal-direct-btn');
    if (modalDirectBtn) {
      modalDirectBtn.href = `https://rabbit.direct/${burrow.name}`;
      modalDirectBtn.onclick = () => {
        closeModal();
      };
    }

    // Activate modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock background scroll
  }
}
