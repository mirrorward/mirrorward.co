// ==========================================================================
// MIRRORWARD INTERACTIVE ENGINE
// Matrix Canvas Rain + Interactive Portal + Legacy Tabs + Live CLI Mockup
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initMobileMenu();
  initMatrixRain();
  initPortal();
  initLegacyTabs();
  initTerminal();
  initScrollFallback();
});

/* ----------------------------------------------------
   1. Mobile Navigation Menu Toggle
   ---------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }
}

/* ----------------------------------------------------
   2. Matrix Rain Background Effect (Alice + Cyberspace)
   ---------------------------------------------------- */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Characters mix (Matrix code + Alice symbols)
  const charString = "010101ABCDEFGHIJKLMNOPQRSTUVWXYZ♣♦♥♠★☉☿♀♁♂♃♄♅♆♇🪞🐇🕰️🗝️☕🃏";
  const chars = charString.split('');
  
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  // Re-calculate columns on resize
  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });

  // Color mode (matrix green or wonderland purple/cyan)
  let rainTheme = 'cyan-purple'; // Default cyber-mystical

  // Function to draw rain
  function draw() {
    // Check if current theme is light (explicitly or via system preferences)
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light' || 
                         (document.documentElement.getAttribute('data-theme') === 'system' && 
                          window.matchMedia('(prefers-color-scheme: light)').matches);

    // Semi-transparent block to create trailing fade effect
    ctx.fillStyle = isLightTheme ? 'rgba(245, 247, 250, 0.08)' : 'rgba(10, 14, 23, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      // Pick random character
      const text = chars[Math.floor(Math.random() * chars.length)];
      
      // Determine colors based on theme and mode
      if (isLightTheme) {
        if (rainTheme === 'green') {
          ctx.fillStyle = '#059669'; // Emerald
        } else if (rainTheme === 'purple') {
          ctx.fillStyle = '#7c3aed'; // Violet
        } else {
          // Cyan-purple gradient streams (Light Mode)
          const ratio = drops[i] * fontSize / canvas.height;
          if (ratio < 0.3) {
            ctx.fillStyle = '#0284c7'; // Darker blue/cyan
          } else if (ratio < 0.7) {
            ctx.fillStyle = '#7c3aed'; // Violet
          } else {
            ctx.fillStyle = '#db2777'; // Pink/Rose
          }
        }
      } else {
        if (rainTheme === 'green') {
          ctx.fillStyle = '#00ff66'; // Matrix Green
        } else if (rainTheme === 'purple') {
          ctx.fillStyle = '#d946ef'; // Amethyst Purple
        } else {
          // Cyan-purple gradient streams (Dark Mode)
          const ratio = drops[i] * fontSize / canvas.height;
          if (ratio < 0.3) {
            ctx.fillStyle = '#38bdf8'; // Cyan top
          } else if (ratio < 0.7) {
            ctx.fillStyle = '#a855f7'; // Purple middle
          } else {
            ctx.fillStyle = '#d946ef'; // Neon pink/purple bottom
          }
        }
      }

      ctx.font = fontSize + 'px monospace';
      
      // Draw character
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);

      // Reset drop to top once it hits bottom, with random offset
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  // Animation Loop
  let interval = setInterval(draw, 33);

  // Global handle to change themes from terminal commands
  window.setMatrixTheme = function(themeName) {
    rainTheme = themeName;
    const canvasEl = document.getElementById('matrix-canvas');
    if (themeName === 'green') {
      canvasEl.style.opacity = '0.35';
    } else if (themeName === 'purple') {
      canvasEl.style.opacity = '0.25';
    } else {
      canvasEl.style.opacity = '0.15';
    }
  };
}

/* ----------------------------------------------------
   3. Looking Glass Portal Interactive Mechanism
   ---------------------------------------------------- */
function initPortal() {
  const portal = document.getElementById('portal-mirror-interactive');
  if (!portal) return;

  portal.addEventListener('click', () => {
    portal.classList.toggle('shattered');
    
    // Trigger visual glitch
    if (portal.classList.contains('shattered')) {
      document.body.classList.add('portal-activated');
      window.setMatrixTheme('green');
      
      // Post event to terminal if active
      printTerminalDirectLine("\n[SYSTEM] Portal activated. Redirection active. Code rain set to Green Pill mode.");
      printTerminalDirectLine("[SYSTEM] Type 'wonderland' or 'matrix' to explore.");
      
      // Auto scroll down to manifest
      setTimeout(() => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } else {
      document.body.classList.remove('portal-activated');
      window.setMatrixTheme('cyan-purple');
      printTerminalDirectLine("\n[SYSTEM] Portal closed. Resetting optics to standard Looking Glass view.");
    }
  });
}

/* ----------------------------------------------------
   4. Tab Switcher Logic (Legacy Doors)
   ---------------------------------------------------- */
function initLegacyTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Deactivate all buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      
      // Deactivate all panels
      tabPanels.forEach(p => p.classList.remove('active'));

      // Activate current
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panelId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ----------------------------------------------------
   5. Interactive Virtual CLI (Terminal)
   ---------------------------------------------------- */
let printTerminalDirectLine = () => {}; // Forward declaration for external triggers

function initTerminal() {
  const terminal = document.getElementById('main-terminal');
  const output = document.getElementById('terminal-output-log');
  const input = document.getElementById('terminal-input-field');
  const latency = document.getElementById('terminal-latency');
  const promptIndicator = document.getElementById('term-prompt-indicator');
  if (!terminal || !output || !input) return;

  // Track terminal state
  let terminalState = 'normal'; // 'normal', 'auth_user', 'auth_password', 'chat_lobby'
  let currentUser = '';
  let activeBurrow = 'wonderland';

  // Make latency bounce randomly to feel real
  setInterval(() => {
    const lat = Math.floor(Math.random() * 15) + 18;
    if (latency) latency.textContent = `PING: ${lat}ms`;
  }, 3000);

  // Focus input when clicking anywhere on the terminal window
  terminal.addEventListener('click', () => {
    input.focus();
  });

  // Expose line printing to global scope for portal linkages
  printTerminalDirectLine = function(text, cssClass = 'text-glow-green') {
    const line = document.createElement('div');
    line.className = `terminal-line ${cssClass}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  // Commands register
  const commands = {
    help: () => {
      return `Available commands:
  <span class="text-white">help</span>         - Display this directory of commands.
  <span class="text-white">status</span>       - Check state of local Burrow server.
  <span class="text-white">tunnels</span>      - List federated secure Tunnel connections.
  <span class="text-white">warren</span>       - Search the swarm DHT catalogue (rabbit:// links).
  <span class="text-white">connect</span>      - Connect to Burrow (WS/QUIC via rabbit.direct gateway).
  <span class="text-white">matrix</span>       - Toggle Matrix green rain background.
  <span class="text-white">mirrors</span>      - Toggle Cyber-Mystical cyan-purple rain.
  <span class="text-white">wonderland</span>   - Query Lewis Carroll protocol notes.
  <span class="text-white">sysop</span>        - Access Operator configurations.
  <span class="text-white">clear</span>        - Clear console window buffer.`;
    },
    status: () => {
      return `[Burrow Status]
  Server Name:    <span class="text-white">flagship-burrow</span>
  Network Domain: <span class="text-white">wonderland.co</span>
  Version:        <span class="text-white">0.61.0-alpha (Wave 14)</span>
  Identity Key:   <span class="text-white">Ed25519: 7d6c...f4a1 (Argon2id KDF verification)</span>
  Uptime:         <span class="text-white">164h 23m 12s</span>
  
  Listeners (Active):
    - QUIC transport on port <span class="text-glow-green">4653</span> (Rate Limit: 200 req/s)
    - WebSockets fallback on port <span class="text-glow-green">4654</span>
    - Embedded PWA web server on port <span class="text-glow-green">8080</span>
    - Legacy Telnet BBS server on port <span class="text-glow-green">2323</span>
    - Legacy Hotline host on ports <span class="text-glow-green">5500/5501</span>
    - Legacy Finger server on port <span class="text-glow-green">7979</span>
    - Legacy Icecast Audio source on ports <span class="text-glow-green">8000/8001</span>`;
    },
    tunnels: () => {
      return `[Tunnel Mesh Network]
  Active peer connections: 3
    <span class="text-white">mad-hatter.tunnel.net</span> -> Connected (QUIC, Latency: 12ms, Delta sync: OK)
    <span class="text-white">chesire-cat.tunnel.net</span> -> Connected (QUIC, Latency: 44ms, Delta sync: Idle)
    <span class="text-white">zion-gate.tunnel.net</span>   -> Connected (QUIC, Latency: 85ms, Delta sync: Swarming)
  
  Federation protocol: RHP-S2S (RFC-0046 Tunnels)
  Gossip state: Anti-entropy cycle synced 1.2s ago.`;
    },
    warren: () => {
      return `[The Warren Swarm Index]
  Search results for files (3 matches):
    - <span class="text-white">rabbit://7d8a9e...3f2a/alice_in_wonderland_1865.pdf</span> (Size: 1.4 MB)
      Bao Hash: <span class="text-glow">a2b1c4e8...</span> | Seeds: 14 | Leechers: 1
    - <span class="text-white">rabbit://4f2c8a...a89e/matrix_code_emulator_v2.iso</span> (Size: 640 MB)
      Bao Hash: <span class="text-glow">f9a8d7c6...</span> | Seeds: 9 | Leechers: 0
    - <span class="text-white">rabbit://9e8f7d...5c2b/pirate_radio_synthwave_vol4.ogg</span> (Size: 85.3 MB)
      Bao Hash: <span class="text-glow">7c8d9e0f...</span> | Seeds: 22 | Leechers: 3`;
    },
    wonderland: () => {
      const quotes = [
        `"But I don’t want to go among mad people," Alice remarked.\n"Oh, you can’t help that," said the Cat: "we’re all mad here. I’m mad. You’re mad."\n"How do you know I’m mad?" said Alice.\n"You must be," said the Cat, "or you wouldn’t have come here."`,
        `"Begin at the beginning," the King said gravely, "and go on till you come to the end: then stop."`,
        `"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English).`,
        `"If you don't know where you want to go, then it doesn't much matter which way you walk."`
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    },
    sysop: () => {
      return `[SysOp Control Configuration]
  ATTENTION: System Operator access requires a clientUnixSocket control line.
  To perform administrative operations, execute from the local server core:
    <span class="text-white">$ burrow ctl account-create [username] [password] [role]</span>
    <span class="text-white">$ burrow ctl config-set motd "Welcome to Wonderland"</span>
  
  Remote admin panel is gated under HTTPS port 8080/admin/ console.`;
    },
    matrix: () => {
      if (window.setMatrixTheme) {
        window.setMatrixTheme('green');
        return "Green Pill loaded. Matrix stream theme activated.";
      }
      return "Matrix rain engine unavailable.";
    },
    mirrors: () => {
      if (window.setMatrixTheme) {
        window.setMatrixTheme('cyan-purple');
        return "Mirror optics initialized. Cyber-mystical gradients active.";
      }
      return "Mirror engine unavailable.";
    }
  };

  // Chat lobby responses
  const chatResponses = [
    { name: "Neo", text: "I'm trying to free your mind, Neo. But I can only show you the door. You're the one that has to walk through it.", color: 'text-green' },
    { name: "Cheshire", text: "We're all mad here. Did you notice my smile stays when I fade?", color: '' },
    { name: "MadHatter", text: "It's always tea-time, and we've no time to wash the things between whiles!", color: 'text-purple' },
    { name: "RedQueen", text: "If you want to keep in the same place, you must run twice as fast as that!", color: 'text-purple' },
    { name: "Morpheus", text: "You have the look of a man who accepts what he sees because he is expecting to wake up.", color: 'text-green' }
  ];

  // Process Command Input
  function handleCommand(cmdLine) {
    const rawCmd = cmdLine.trim();
    if (!rawCmd) return;

    // Add command to log
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">${promptIndicator.textContent}</span> <span class="text-white">${rawCmd}</span>`;
    output.appendChild(userLine);

    const parts = rawCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputText = '';

    // Handle login state machine
    if (terminalState === 'auth_user') {
      currentUser = rawCmd;
      terminalState = 'auth_password';
      outputText = `Password for persona '${currentUser}':\n<span class="text-muted">(input hidden - try 'wonderland')</span>`;
      input.type = 'password';
      promptIndicator.textContent = `[${currentUser}@wonderland AUTH]:`;
    } 
    else if (terminalState === 'auth_password') {
      const password = rawCmd;
      input.type = 'text';
      if (password.toLowerCase() === 'wonderland') {
        terminalState = 'chat_lobby';
        promptIndicator.textContent = `[${currentUser}@wonderland lobby]:`;
        outputText = `\nAuthentication successful! Key pair enrolled.\nLogged in as <span class="text-glow-green">${currentUser}</span>.\n\nType message to chat, or '<span class="text-white">exit</span>' to close session.`;
        // Scroll slightly
        setTimeout(() => {
          printTerminalDirectLine("[SysOp]: Welcome to the warren, " + currentUser + "!", 'text-purple');
        }, 1000);
      } else {
        terminalState = 'normal';
        promptIndicator.textContent = `guest@wonderland:~$`;
        outputText = `❌ Authentication failed: password mismatch.\nConnection closed. Resetting connection.`;
      }
    } 
    else if (terminalState === 'chat_lobby') {
      if (command === 'exit' || command === '/exit') {
        terminalState = 'normal';
        promptIndicator.textContent = `guest@wonderland:~$`;
        outputText = `Connection closed. Logged out of burrow.`;
      } else {
        // Chatting
        outputText = null; // We'll print asynchronously
        
        // Mock a response delay
        const delay = Math.floor(Math.random() * 800) + 400;
        setTimeout(() => {
          const resp = chatResponses[Math.floor(Math.random() * chatResponses.length)];
          const chatLine = document.createElement('div');
          chatLine.className = 'terminal-line';
          chatLine.innerHTML = `<span class="hl-name ${resp.color}">${resp.name}:</span> ${resp.text}`;
          output.appendChild(chatLine);
          output.scrollTop = output.scrollHeight;
        }, delay);
      }
    } 
    else {
      // Normal commands
      if (command === 'clear') {
        output.innerHTML = '';
        input.value = '';
        return;
      }
      else if (command === 'connect') {
        terminalState = 'auth_user';
        outputText = `Connecting via rabbit.direct gateway... \nTarget: ws://127.0.0.1:4654 ... CONNECTED\nArgon2id login parameters loaded.\nEnter username (try 'alice'):`;
        promptIndicator.textContent = `[username]:`;
      }
      else if (commands[command]) {
        outputText = commands[command]();
      } 
      else {
        outputText = `Command not found: <span class="text-white">${command}</span>. Type '<span class="text-glow-green">help</span>' for a list of endpoints.`;
      }
    }

    if (outputText !== null && outputText !== undefined) {
      const respLine = document.createElement('div');
      respLine.className = 'terminal-line';
      respLine.innerHTML = outputText;
      output.appendChild(respLine);
    }

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
    input.value = '';
  }

  // Bind key events
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleCommand(input.value);
    }
  });
}

/* ----------------------------------------------------
   6. IntersectionObserver Scroll Reveal Fallback
   ---------------------------------------------------- */
function initScrollFallback() {
  // If browser doesn't support CSS scroll-driven animations, use IntersectionObserver
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const observerOptions = {
      root: null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Approximate the scroll entry/exit reveal
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio;
          // Scale opacity and translation based on ratio
          entry.target.style.opacity = Math.min(ratio * 1.5, 1);
          const translateY = (1 - ratio) * 40;
          entry.target.style.transform = `translateY(${translateY}px)`;
          entry.target.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        } else {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(40px)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      // Set initial state
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      observer.observe(el);
    });
  }
}

/* ----------------------------------------------------
   7. Light/Dark/System Theme Switcher Controller
   ---------------------------------------------------- */
function initThemeSwitcher() {
  const btn = document.getElementById('theme-switch-btn');
  if (!btn) return;

  const iconEl = btn.querySelector('.theme-btn-icon') || btn.querySelector('.theme-icon');
  const textEl = btn.querySelector('.theme-btn-text') || btn.querySelector('.theme-text');

  const themes = ['system', 'light', 'dark'];
  
  function updateSwitcherUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mirrorward-theme', theme);
    
    if (theme === 'system') {
      if (iconEl) iconEl.textContent = '🌓';
      if (textEl) textEl.textContent = 'SYSTEM';
    } else if (theme === 'light') {
      if (iconEl) iconEl.textContent = '☀️';
      if (textEl) textEl.textContent = 'LIGHT';
    } else if (theme === 'dark') {
      if (iconEl) iconEl.textContent = '🌙';
      if (textEl) textEl.textContent = 'DARK';
    }
  }

  // Set initial switcher button UI state based on stored settings
  const activeTheme = localStorage.getItem('mirrorward-theme') || 'system';
  updateSwitcherUI(activeTheme);

  btn.addEventListener('click', () => {
    const current = localStorage.getItem('mirrorward-theme') || 'system';
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    updateSwitcherUI(nextTheme);
  });
}
