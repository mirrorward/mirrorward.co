// ==========================================================================
// LOOKING GLASS INDEX CONTROLLER (glass.burrow.land Mock)
// Handles mock data, sparkline generation, search/filtering, and descriptor inspection
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initLookingGlass();
});

/* Mock Server Descriptors Data */
let BURROWS_DATA = [
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

  // Try to load real data from backend API
  fetch('/api/burrows')
    .then(res => {
      if (!res.ok) throw new Error('API server returned error');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        BURROWS_DATA = data;
        renderDirectory();
        
        if (window.printTerminalDirectLine) {
          window.printTerminalDirectLine(`\n[Gossip Registry] Synchronized ${data.length} live Burrow descriptors from Looking Glass API.`);
        }
      }
    })
    .catch(err => {
      console.warn('Fallback to static burrows data:', err);
    });

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

  // --------------------------------------------------------
  // Swarm Monitor Tab & Simulator
  // --------------------------------------------------------
  const pageTabDirectory = document.getElementById('page-tab-directory');
  const pageTabSwarm = document.getElementById('page-tab-swarm');
  const pageTabWishingWell = document.getElementById('page-tab-wishing-well');
  const statsSection = document.getElementById('stats');
  const controlsDiv = document.querySelector('.directory-controls');
  const burrowsListDiv = document.getElementById('burrows-directory-list');
  const swarmPanel = document.getElementById('swarm-monitor-panel');
  const wishingWellPanel = document.getElementById('wishing-well-panel');

  if (pageTabDirectory && pageTabSwarm && pageTabWishingWell) {
    pageTabDirectory.addEventListener('click', () => {
      pageTabDirectory.classList.add('active');
      pageTabSwarm.classList.remove('active');
      pageTabWishingWell.classList.remove('active');
      
      if (statsSection) statsSection.style.display = 'block';
      if (controlsDiv) controlsDiv.style.display = 'flex';
      if (burrowsListDiv) burrowsListDiv.style.display = 'grid';
      if (swarmPanel) swarmPanel.style.display = 'none';
      if (wishingWellPanel) wishingWellPanel.style.display = 'none';
    });

    pageTabSwarm.addEventListener('click', () => {
      pageTabSwarm.classList.add('active');
      pageTabDirectory.classList.remove('active');
      pageTabWishingWell.classList.remove('active');
      
      if (statsSection) statsSection.style.display = 'none';
      if (controlsDiv) controlsDiv.style.display = 'none';
      if (burrowsListDiv) burrowsListDiv.style.display = 'none';
      if (swarmPanel) swarmPanel.style.display = 'block';
      if (wishingWellPanel) wishingWellPanel.style.display = 'none';
      
      initSwarmGrid(activeBlockCount);
    });

    pageTabWishingWell.addEventListener('click', () => {
      pageTabWishingWell.classList.add('active');
      pageTabDirectory.classList.remove('active');
      pageTabSwarm.classList.remove('active');
      
      if (statsSection) statsSection.style.display = 'none';
      if (controlsDiv) controlsDiv.style.display = 'none';
      if (burrowsListDiv) burrowsListDiv.style.display = 'none';
      if (swarmPanel) swarmPanel.style.display = 'none';
      if (wishingWellPanel) wishingWellPanel.style.display = 'block';
      
      fetchWishes();
    });
  }

  // Swarm Simulator logic
  const swarmGrid = document.getElementById('swarm-chunk-grid');
  const startBtn = document.getElementById('swarm-start-btn');
  const inputLink = document.getElementById('swarm-input-link');
  const seedBtns = document.querySelectorAll('.swarm-seed-btn');
  const statusVal = document.getElementById('swarm-status-val');
  const rateVal = document.getElementById('swarm-rate-val');
  const progressVal = document.getElementById('swarm-progress-val');
  const etaVal = document.getElementById('swarm-eta-val');
  const peersVal = document.getElementById('swarm-peers-val');
  const progressBar = document.getElementById('swarm-progress-bar');
  const peersList = document.getElementById('swarm-peers-list');
  const verifiableBanner = document.getElementById('swarm-verifiable-banner');

  let activeDownloadInterval = null;
  let activeBlockCount = 80;
  let activeFileSizeStr = '1.4 MB';
  let activeFileName = 'alice_in_wonderland_1865.pdf';

  seedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hash = btn.getAttribute('data-hash');
      const filename = btn.getAttribute('data-file');
      activeBlockCount = parseInt(btn.getAttribute('data-blocks'));
      activeFileSizeStr = btn.getAttribute('data-size');
      activeFileName = filename;

      inputLink.value = `rabbit://${hash}/${filename}`;
      
      seedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      initSwarmGrid(activeBlockCount);
      resetSwarmStats();
    });
  });

  function initSwarmGrid(blocksCount) {
    if (!swarmGrid) return;
    swarmGrid.innerHTML = '';
    
    const cols = Math.ceil(Math.sqrt(blocksCount * 1.5));
    swarmGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < blocksCount; i++) {
      const block = document.createElement('div');
      block.className = 'swarm-block';
      block.style.width = '100%';
      block.style.height = '14px';
      block.style.background = 'rgba(255, 255, 255, 0.04)';
      block.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      block.style.borderRadius = '2px';
      block.style.transition = 'background 0.3s, box-shadow 0.3s';
      swarmGrid.appendChild(block);
    }
  }

  function resetSwarmStats() {
    if (activeDownloadInterval) {
      clearInterval(activeDownloadInterval);
      activeDownloadInterval = null;
    }
    statusVal.textContent = 'IDLE';
    rateVal.textContent = '0.0 KB/s';
    progressVal.textContent = `0.0 KB / ${activeFileSizeStr}`;
    etaVal.textContent = '--:--';
    peersVal.textContent = '0';
    progressBar.style.width = '0%';
    verifiableBanner.style.display = 'none';
    peersList.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">No active connections</div>`;
    startBtn.textContent = 'Start Swarm Fetch';
    startBtn.className = 'btn btn-primary';
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (activeDownloadInterval) {
        resetSwarmStats();
        initSwarmGrid(activeBlockCount);
        return;
      }

      startBtn.textContent = 'Abort Download';
      startBtn.className = 'btn btn-secondary';
      
      statusVal.textContent = 'CONNECTING TO DHT...';
      peersVal.textContent = '...';
      
      const mockPeers = [
        { name: 'alice@wonderland', rate: 0, status: 'Handshaking' },
        { name: 'neo@zion', rate: 0, status: 'Handshaking' },
        { name: 'mad-hatter@tea-party', rate: 0, status: 'Handshaking' },
        { name: 'chesire@woods', rate: 0, status: 'Handshaking' }
      ];

      renderPeers(mockPeers);

      setTimeout(() => {
        if (!startBtn.textContent.includes('Abort')) return; 
        
        statusVal.textContent = 'DOWNLOADING';
        verifiableBanner.style.display = 'block';
        
        mockPeers[0].status = 'Connected';
        mockPeers[1].status = 'Connected';
        mockPeers[2].status = 'Connected';
        
        const blocks = Array.from(swarmGrid.children);
        let completedBlocks = 0;
        const totalSizeKB = parseFloat(activeFileSizeStr) * (activeFileSizeStr.includes('MB') ? 1024 : 1);
        const kbPerBlock = totalSizeKB / activeBlockCount;

        activeDownloadInterval = setInterval(() => {
          if (completedBlocks >= activeBlockCount) {
            clearInterval(activeDownloadInterval);
            activeDownloadInterval = null;
            statusVal.textContent = 'VERIFIED';
            rateVal.textContent = '0.0 KB/s';
            progressVal.textContent = `${activeFileSizeStr} / ${activeFileSizeStr} (100%)`;
            etaVal.textContent = '00:00';
            progressBar.style.width = '100%';
            
            blocks.forEach(b => {
              b.style.background = 'var(--accent-green)';
              b.style.boxShadow = '0 0 8px var(--accent-green-glow)';
              b.style.borderColor = 'var(--accent-green)';
            });

            mockPeers.forEach(p => {
              p.rate = 0;
              p.status = 'Seeding';
            });
            renderPeers(mockPeers);
            
            if (window.printTerminalDirectLine) {
              window.printTerminalDirectLine(`\n[Swarm Warren] Verified download complete for '${activeFileName}'. Integrity signature matches Blake3 root hash.`);
            }

            startBtn.textContent = 'Reset Monitor';
            startBtn.className = 'btn btn-primary';
            return;
          }

          const emptyIndices = [];
          blocks.forEach((b, index) => {
            if (b.style.background.includes('rgba') || b.style.background === '') {
              emptyIndices.push(index);
            }
          });

          if (emptyIndices.length > 0) {
            const blocksToDownload = Math.min(emptyIndices.length, Math.floor(Math.random() * 3) + 1);
            emptyIndices.sort(() => 0.5 - Math.random());
            
            for (let k = 0; k < blocksToDownload; k++) {
              const targetIdx = emptyIndices[k];
              const block = blocks[targetIdx];
              
              block.style.background = 'var(--accent-cyan)';
              block.style.boxShadow = '0 0 6px var(--accent-cyan-glow)';
              block.style.borderColor = 'var(--accent-cyan)';
              
              setTimeout(() => {
                if (!activeDownloadInterval) return; 
                
                block.style.background = 'var(--accent-green)';
                block.style.boxShadow = '0 0 8px var(--accent-green-glow)';
                block.style.borderColor = 'var(--accent-green)';
                completedBlocks++;
                
                const pct = Math.floor((completedBlocks / activeBlockCount) * 100);
                progressBar.style.width = `${pct}%`;
                
                const curDownloaded = Math.min(totalSizeKB, completedBlocks * kbPerBlock);
                const isMB = curDownloaded > 1024;
                const progressText = isMB 
                  ? `${(curDownloaded / 1024).toFixed(1)} MB / ${activeFileSizeStr}`
                  : `${curDownloaded.toFixed(0)} KB / ${activeFileSizeStr}`;
                progressVal.textContent = progressText;

                let totalRate = 0;
                mockPeers.forEach((p, pIdx) => {
                  if (p.status === 'Connected') {
                    p.rate = Math.floor(Math.random() * 800) + 200; 
                    totalRate += p.rate;
                  }
                });
                
                rateVal.textContent = totalRate > 1024 
                  ? `${(totalRate / 1024).toFixed(1)} MB/s`
                  : `${totalRate} KB/s`;

                renderPeers(mockPeers);

                const remainingKB = totalSizeKB - curDownloaded;
                const etaSecs = totalRate > 0 ? Math.ceil(remainingKB / totalRate) : 0;
                const mm = String(Math.floor(etaSecs / 60)).padStart(2, '0');
                const ss = String(etaSecs % 60).padStart(2, '0');
                etaVal.textContent = `${mm}:${ss}`;
                
              }, 400 + Math.random() * 600);
            }
          }

          const activePeersCount = mockPeers.filter(p => p.status === 'Connected').length;
          peersVal.textContent = activePeersCount;

        }, 150);

      }, 1000);
    });
  }

  function renderPeers(peers) {
    if (!peersList) return;
    peersList.innerHTML = '';
    peers.forEach(p => {
      const rateStr = p.rate > 0 
        ? `<span style="color: var(--accent-cyan); font-weight: bold;">${p.rate} KB/s</span>`
        : `<span style="color: var(--text-muted);">${p.status}</span>`;
      
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.fontSize = '0.85rem';
      item.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
      item.style.paddingBottom = '0.4rem';
      item.innerHTML = `
        <span class="code-font" style="color: var(--text-white);">${p.name}</span>
        <span class="code-font">${rateStr}</span>
      `;
      peersList.appendChild(item);
    });
  }

  // --------------------------------------------------------
  // Wishing Well Logic & State
  // --------------------------------------------------------
  const wishesListContainer = document.getElementById('wishes-list-container');
  const wishForm = document.getElementById('well-wish-form');
  const totalBountyEl = document.getElementById('well-total-bounty');

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

  function fetchWishes() {
    fetch('/api/wishes')
      .then(res => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          wishesData = data;
          renderWishes();
        }
      })
      .catch(err => {
        console.warn('Fallback to static wishes data:', err);
        renderWishes();
      });
  }

  function calculateTotalBounty() {
    if (!totalBountyEl) return;
    let totalMB = 0;
    wishesData.forEach(w => totalMB += w.bounty);
    
    if (totalMB >= 1024) {
      totalBountyEl.textContent = `${(totalMB / 1024).toFixed(1)} GB`;
    } else {
      totalBountyEl.textContent = `${totalMB} MB`;
    }
  }

  function renderWishes() {
    if (!wishesListContainer) return;
    wishesListContainer.innerHTML = '';
    
    calculateTotalBounty();

    wishesData.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-row glassmorphic hover-glow-purple';
      card.setAttribute('data-id', wish.id);
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.padding = '1.25rem 2rem';
      card.style.borderRadius = '8px';
      card.style.border = '1px solid rgba(255, 255, 255, 0.05)';
      card.style.background = 'rgba(7, 10, 18, 0.4)';
      card.style.transition = 'all 0.3s ease';

      const bountyStr = wish.bounty >= 1024 
        ? `${(wish.bounty / 1024).toFixed(1)} GB`
        : `${wish.bounty} MB`;

      card.innerHTML = `
        <div class="wish-info-col" style="display: flex; flex-direction: column; gap: 0.25rem;">
          <span class="wish-title code-font" style="font-weight: bold; color: var(--text-white); font-size: 1.05rem;">${wish.title}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Seeker: <span class="code-font" style="color: var(--accent-purple);">${wish.seeker}</span> &bull; Cast ${wish.timestamp}</span>
        </div>
        <div class="wish-actions-col" style="display: flex; gap: 1.5rem; align-items: center;">
          <div style="text-align: right;">
            <span style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">BOUNTY</span>
            <span class="code-font wish-bounty-val" style="color: var(--accent-cyan); font-weight: bold; font-size: 1.1rem; text-shadow: 0 0 10px var(--accent-cyan-glow);">${bountyStr}</span>
          </div>
          <button class="btn btn-secondary wish-vote-btn" style="padding: 0.4rem 1.2rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;" data-id="${wish.id}">
            <span>▲ Upvote</span>
            <span class="code-font wish-vote-count" style="font-weight: bold; background: rgba(255,255,255,0.08); padding: 0.15rem 0.4rem; border-radius: 3px;">${wish.votes}</span>
          </button>
        </div>
      `;

      card.querySelector('.wish-vote-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        
        wish.votes++;
        wish.bounty += 100; 
        
        calculateTotalBounty();
        
        const voteCountSpan = card.querySelector('.wish-vote-count');
        const bountyValSpan = card.querySelector('.wish-bounty-val');
        if (voteCountSpan) voteCountSpan.textContent = wish.votes;
        if (bountyValSpan) {
          bountyValSpan.textContent = wish.bounty >= 1024 
            ? `${(wish.bounty / 1024).toFixed(1)} GB`
            : `${wish.bounty} MB`;
        }

        card.style.borderColor = 'var(--accent-purple)';
        card.style.boxShadow = '0 0 15px rgba(184, 41, 203, 0.25)';
        setTimeout(() => {
          card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          card.style.boxShadow = 'none';
        }, 800);

        fetch('/api/wishes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: wish.id })
        })
        .then(res => {
          if (!res.ok) throw new Error('API server returned error');
          return res.json();
        })
        .then(updatedWish => {
          wish.votes = updatedWish.votes;
          wish.bounty = updatedWish.bounty;
          calculateTotalBounty();
          if (voteCountSpan) voteCountSpan.textContent = wish.votes;
        })
        .catch(err => {
          console.warn('API upvote sync failed, fell back to local:', err);
        });

        if (window.printTerminalDirectLine) {
          window.printTerminalDirectLine(`\n[Wishing Well] Seeker bounty boosted on '${wish.title}'. New bounty: ${wish.bounty >= 1024 ? (wish.bounty/1024).toFixed(1)+' GB' : wish.bounty+' MB'}.`);
        }
      });

      wishesListContainer.appendChild(card);
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const titleInput = document.getElementById('wish-title');
      const bountyInput = document.getElementById('wish-bounty');
      
      if (!titleInput || !bountyInput) return;

      const title = titleInput.value.trim();
      const bounty = parseInt(bountyInput.value);

      if (title && bounty > 0) {
        fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, bounty })
        })
        .then(res => {
          if (!res.ok) throw new Error('API server returned error');
          return res.json();
        })
        .then(newWish => {
          wishesData.unshift(newWish);
          renderWishes();
          
          if (window.printTerminalDirectLine) {
            window.printTerminalDirectLine(`\n[Wishing Well] Cast new file wish: '${title}' with a bounty of ${bounty}MB.`);
          }
        })
        .catch(err => {
          console.warn('API post wish failed, falling back to local:', err);
          const newWish = {
            id: Date.now(),
            title: title,
            seeker: "guest@mirrorward",
            bounty: bounty,
            votes: 1,
            timestamp: "Just now"
          };
          wishesData.unshift(newWish);
          renderWishes();
        });

        titleInput.value = '';
        bountyInput.value = '';
      }
    });
  }
}
