// ============================================================
//  MONOPOLY — Our Edition  |  game.js
//  Pass & Play + PeerJS P2P Online Multiplayer
// ============================================================

// ─── BOARD SQUARES ──────────────────────────────────────────
const SQUARES = [
  {id:0,  name:"GO",                      type:"go",       price:0,   color:null,      group:null},
  {id:1,  name:"Chez Alex",               type:"property", price:60,  color:"#7B3F1A", group:"brown"},
  {id:2,  name:"ET SI?",                  type:"community",price:0,   color:null,      group:null},
  {id:3,  name:"Chez Romain",             type:"property", price:60,  color:"#7B3F1A", group:"brown"},
  {id:4,  name:"Income Tax",              type:"tax",      price:150, color:null,      group:null},
  {id:5,  name:"Gare d'Antibes",          type:"station",  price:200, color:"#555",    group:"station"},
  {id:6,  name:"Bord de Mer à Antibes",   type:"property", price:100, color:"#6bbfd4", group:"light-blue"},
  {id:7,  name:"Chance",                  type:"chance",   price:0,   color:null,      group:null},
  {id:8,  name:"Petit Coin Caché Falafel",type:"property", price:100, color:"#6bbfd4", group:"light-blue"},
  {id:9,  name:"Café Kanter",             type:"property", price:120, color:"#6bbfd4", group:"light-blue"},
  {id:10, name:"Just Visiting / Jail",    type:"jail",     price:0,   color:null,      group:null},
  {id:11, name:"Hop Store",               type:"property", price:140, color:"#e05a8a", group:"pink"},
  {id:12, name:"Electric Company",        type:"utility",  price:150, color:null,      group:"utility"},
  {id:13, name:"La Fourmillière",         type:"property", price:140, color:"#e05a8a", group:"pink"},
  {id:14, name:"Cha Boté",                type:"property", price:160, color:"#e05a8a", group:"pink"},
  {id:15, name:"Aéroport de Nice",        type:"station",  price:200, color:"#555",    group:"station"},
  {id:16, name:"Cinéplanet Antibes",      type:"property", price:180, color:"#e07820", group:"orange"},
  {id:17, name:"ET SI?",                  type:"community",price:0,   color:null,      group:null},
  {id:18, name:"Trattoria Quattro",       type:"property", price:180, color:"#e07820", group:"orange"},
  {id:19, name:"Appolonia",               type:"property", price:200, color:"#e07820", group:"orange"},
  {id:20, name:"Free Parking",            type:"parking",  price:0,   color:null,      group:null},
  {id:21, name:"Mini Golf de Porto",      type:"property", price:220, color:"#cc2020", group:"red"},
  {id:22, name:"Chance",                  type:"chance",   price:0,   color:null,      group:null},
  {id:23, name:"Han's Table",             type:"property", price:220, color:"#cc2020", group:"red"},
  {id:24, name:"The Dog",                 type:"property", price:240, color:"#cc2020", group:"red"},
  {id:25, name:"Métro do Porto",          type:"station",  price:200, color:"#555",    group:"station"},
  {id:26, name:"Castro",                  type:"property", price:260, color:"#d4aa00", group:"yellow"},
  {id:27, name:"Plage du Fort Carré",     type:"property", price:260, color:"#d4aa00", group:"yellow"},
  {id:28, name:"Water Works",             type:"utility",  price:150, color:null,      group:"utility"},
  {id:29, name:"Bloc Party",              type:"property", price:280, color:"#d4aa00", group:"yellow"},
  {id:30, name:"Go to Jail",              type:"gotojail", price:0,   color:null,      group:null},
  {id:31, name:"Olympic Stadium Badalona",type:"property", price:300, color:"#2a8040", group:"green"},
  {id:32, name:"Sagrada Familia",         type:"property", price:300, color:"#2a8040", group:"green"},
  {id:33, name:"ET SI?",                  type:"community",price:0,   color:null,      group:null},
  {id:34, name:"100 Montaditos",          type:"property", price:320, color:"#2a8040", group:"green"},
  {id:35, name:"Aéroport de Barcelone",   type:"station",  price:200, color:"#555",    group:"station"},
  {id:36, name:"Chance",                  type:"chance",   price:0,   color:null,      group:null},
  {id:37, name:"Pasta de la Mama",        type:"property", price:350, color:"#1a3a8a", group:"dark-blue"},
  {id:38, name:"Luxury Tax",              type:"tax",      price:100, color:null,      group:null},
  {id:39, name:"La Ferme de Mamie",       type:"property", price:400, color:"#1a3a8a", group:"dark-blue"},
];

// ─── TOKEN POSITIONS ────────────────────────────────────────
(function() {
  const cs = 0.1375, inner = (1 - 2*cs) / 9;
  SQUARES[0].pos  = [1-cs/2, 1-cs/2];
  SQUARES[10].pos = [cs/2,   1-cs/2];
  SQUARES[20].pos = [cs/2,   cs/2];
  SQUARES[30].pos = [1-cs/2, cs/2];
  for(let i=1;i<=9;i++){
    SQUARES[i].pos     = [1-cs-(i-.5)*inner,  1-cs/2];
    SQUARES[10+i].pos  = [cs/2,                1-cs-(i-.5)*inner];
    SQUARES[20+i].pos  = [cs+(i-.5)*inner,     cs/2];
    SQUARES[30+i].pos  = [1-cs/2,              cs+(i-.5)*inner];
  }
})();

// ─── RENT / BUILD DATA ──────────────────────────────────────
const RENT = {
  "brown":     [2,4,10,30,90,160,250],
  "light-blue":[6,12,30,90,270,400,550],
  "pink":      [10,20,50,150,450,625,750],
  "orange":    [14,28,70,200,550,750,950],
  "red":       [18,36,90,250,700,875,1050],
  "yellow":    [22,44,110,330,800,975,1150],
  "green":     [26,52,130,390,900,1100,1275],
  "dark-blue": [35,70,175,500,1100,1300,1500],
};
const HOUSE_COST = {
  "brown":50,"light-blue":50,"pink":100,"orange":100,
  "red":150,"yellow":150,"green":200,"dark-blue":200
};
const COLOR_GROUPS = {
  "brown":[1,3],"light-blue":[6,8,9],"pink":[11,13,14],
  "orange":[16,18,19],"red":[21,23,24],"yellow":[26,27,29],
  "green":[31,32,34],"dark-blue":[37,39],
  "station":[5,15,25,35],"utility":[12,28]
};

// ─── CARDS ──────────────────────────────────────────────────
const CHANCE_CARDS = [
  {title:"EXCEPTIONAL.",          text:"Romain vient de faire un autre S+ League of Legends!\nRentrez chez lui pour continuer le strike!\n\nIF YOU PASS GO, COLLECT ₼200.",                          action: p=>{ advanceTo(p,0); }},
  {title:"SPONTANEOUS TRIP ALERT.",text:"Vous venez d'acheter des billets d'avion pour dans 3 jours.\n\nPAYEZ ₼50 DE FRAIS DE BAGAGE EN RETARD.",                                                  action: p=>{ charge(p,50); }},
  {title:"G2 GAGNE.",             text:"The crowd goes wild. Advance to the nearest station to celebrate.\n\nIF YOU PASS GO, COLLECT ₼200.",                                                         action: p=>{ advanceToNearest(p,'station'); }},
  {title:"SIESTE STRATÉGIQUE.",   text:"Tu t'es endormi dans le métro do Porto.\n\nPASSE TON TOUR. TU DORS, C'EST TOUT.",                                                                           action: p=>{ p.skipTurns=(p.skipTurns||0)+1; }},
  {title:"BILLET DE BANQUE.",     text:"Tu retrouves un billet dans ta vieille veste.\n\nCOLLECT ₼20.",                                                                                              action: p=>{ collect(p,20); }},
  {title:"VIENNOISERIE DE TROP.", text:"C'était tellement bon mais…\nWorth it.\n\nPAY ₼20 TO THE BANK.",                                                                                            action: p=>{ charge(p,20); }},
  {title:"TU T'ES PERDU À BARCELONE.", text:"C'est romantique, en fait.\n\nGO BACK 3 SPACES.",                                                                                                      action: p=>{ moveRelative(p,-3); }},
  {title:"DATE NIGHT RÉUSSI.",    text:"Film, pop-corn, bonne humeur.\n\nADVANCE TO CINÉPLANET ANTIBES.",                                                                                           action: p=>{ advanceTo(p,16); }},
  {title:"OLIVIERS CUEILLIS.",    text:"T'as aidé à la ferme de mamie comme un pro. La famille est impressionnée.\n\nTOUCHE ₼50.",                                                                  action: p=>{ collect(p,50); }},
  {title:"PETIT VOYAGE SPONTANÉ.",text:"On part quand ? Maintenant.\n\nAdvance to Aéroport de Nice.",                                                                                               action: p=>{ advanceTo(p,15); }},
  {title:"AFTERWORK IMPROVISÉ.",  text:"Hop Store, une bière, la belle vie.\n\nCOLLECT ₼20 FROM EVERY PLAYER.",                                                                                     action: p=>{ collectFromAll(p,20); }},
  {title:"G2 PERD.",              text:"C'est dur. Restez dignes. C'était (surement?) la faute de Hans Sama.\n\nPAY ₼20 EN FRAIS DE CONSOLATION (SNACKS).",                                         action: p=>{ charge(p,20); }},
  {title:"JOUR DE PLUIE À ANTIBES.", text:"Chocolat viennois au Café Kanter, tu regardes la pluie tomber.\n\nCOLLECT ₼20, SOME DAYS ARE JUST GOOD.",                                               action: p=>{ collect(p,20); }},
  {title:"CACHORINHOS AU DOG.",   text:"Best meal ever, EVERYONE agrees.\n\nMove to The Dog. IF YOU PASS GO, COLLECT ₼200.",                                                                         action: p=>{ advanceTo(p,24); }},
  {title:"MINI GOLF SHOCK.",      text:"T'as perdu au mini golf. Personne n'en parle mais tout le monde s'en souvient.\n\nPAY ₼20.",                                                                 action: p=>{ charge(p,20); }},
  {title:"COUP DE CHANCE.",       text:"La vie est belle, Antibes est belle, vous êtes beaux.\n\nCOLLECT ₼150.",                                                                                    action: p=>{ collect(p,150); }},
];
const COMMUNITY_CARDS = [
  {title:"ET SI? — Premier rendez-vous.",   text:"Pasta de la Mama, un soir de semaine, et tout a changé.\n\nCOLLECT ₼200. BEST INVESTMENT EVER.",              action: p=>{ collect(p,200); }},
  {title:"ET SI? — Rester au lit.",         text:"Et si on restait au lit ? Bonne idée.\n\nSkip your next turn — no regrets.",                                   action: p=>{ p.skipTurns=(p.skipTurns||0)+1; }},
  {title:"ET SI? — Porto.",                 text:"Et si on allait à Porto ?\nVOL TROUVÉ, VALISE FAITE.\n\nCOLLECT ₼100.",                                       action: p=>{ collect(p,100); }},
  {title:"ET SI? — Brunch.",                text:"Et si on faisait un brunch ?\nCHA BOTÉ, DIMANCHE, SOLEIL.\n\nCOLLECT ₼50.",                                   action: p=>{ collect(p,50); }},
  {title:"ET SI? — Héritage de mamie.",     text:"ELLE T'A LAISSÉ UN BOCAL D'HUILE D'OLIVE ET UNE GLACE.\n\n₼80 ARE YOURS TO COLLECT.",                        action: p=>{ collect(p,80); }},
  {title:"ET SI? — Quiz ce soir.",          text:"LA FOURMILLIÈRE, VOUS GAGNEZ (ÉVIDEMMENT).\n\nCOLLECT ₼25 FROM EACH PLAYER.",                                action: p=>{ collectFromAll(p,25); }},
  {title:"ET SI? — Chocolat viennois.",     text:"Café Kanter, après le taf, vous êtes seuls au monde.\n\nCOLLECT ₼20.",                                        action: p=>{ collect(p,20); }},
  {title:"ET SI? — Un film.",               text:"Sorée canapé. Trop bien.\n\nNo rent charged this turn.",                                                       action: p=>{ p.freeRentThisTurn=true; log(`${p.name} — free rent this turn! 🍿`,'important'); }},
  {title:"ET SI? — Petit falafel.",         text:"NOTRE COIN CACHÉ. COMME D'HAB.\n\nGET ₼30.",                                                                  action: p=>{ collect(p,30); }},
  {title:"ET SI? — Réparations imprévues.", text:"SOMETHING BROKE. (we won't point fingers)\n\nPAY ₼100 TO THE BANK.",                                          action: p=>{ charge(p,100); }},
  {title:"ET SI? — Bloc Party.",            text:"Samedi matin. CLIMBING, LUNCH, THE WHOLE RITUAL.\n\nGET ₼40.",                                                 action: p=>{ collect(p,40); }},
  {title:"ET SI? — Nuit à l'aéroport.",    text:"Il veille sur toi pendant que tu dors.\n\nPRICELESS. REMEMBER THIS THO. ₼0.",                                  action: p=>{ log(`${p.name} — precious moment 💙`,'good'); }},
  {title:"ET SI? — Sérénade involontaire.", text:"T'as chanté en cuisine sans t'en rendre compte.\n₼0 mais tout le monde sourit. 🎵",                            action: p=>{ log(`${p.name} — everyone smiles 🎵`,'good'); }},
  {title:"ET SI? — Voir la mer.",           text:"Il est peut-être 3h du matin, mais tu n'es pas prêt à rentrer just yet.\n\nCOLLECT ₼60.",                     action: p=>{ collect(p,60); }},
  {title:"ET SI? — Sortie culturelle.",     text:"Sagrada Familia, il était temps.\n\nADVANCE TO SAGRADA FAMILIA.",                                              action: p=>{ advanceTo(p,32); }},
  {title:"ET SI? — Frais médicaux.",        text:"Trop de viennoiseries.\n\nPAY ₼100. À REFAIRE TOUT DE MÊME.",                                                 action: p=>{ charge(p,100); }},
];

// ─── TOKENS & COLORS ────────────────────────────────────────
const TOKENS       = ['🎩','🚂','🐕','👠','🚗','⛵'];
const TOKEN_COLORS = ['#c23b2e','#3a62a0','#3a7c55','#c5703a','#7b4fbf','#1a9090'];

// ─── GAME STATE ─────────────────────────────────────────────
let G = {
  players:[], current:0, phase:'rolling',
  properties:{}, chanceDeck:[], communityDeck:[],
  freeParkingPot:0, doublesCount:0, lastDice:[0,0],
};

// ─── MULTIPLAYER (PeerJS) ────────────────────────────────────
let MP = {
  mode: 'local',   // 'local' | 'host' | 'client'
  peer: null,
  myPeerId: null,
  connections: [],  // host keeps all; client keeps one
  myPlayerIndex: -1,
  roomCode: null,
};

function mpEnabled() { return MP.mode !== 'local'; }
function isMyTurn() {
  if (!mpEnabled()) return true;
  return G.current === MP.myPlayerIndex;
}

function mpSendAll(msg) {
  MP.connections.forEach(conn => {
    try { conn.send(msg); } catch(e) {}
  });
}

function mpOnData(data) {
  if (data.type === 'state') {
    // Full state sync from host
    applyRemoteState(data.state);
  } else if (data.type === 'action') {
    // Host receives action from client, applies it
    if (MP.mode === 'host') {
      handleRemoteAction(data);
    }
  } else if (data.type === 'player_joined') {
    log(`${data.name} joined the game!`, 'good');
  } else if (data.type === 'chat') {
    log(`💬 ${data.from}: ${data.text}`);
  }
}

function applyRemoteState(state) {
  // Restore state from serialised object (no functions)
  G.players    = state.players;
  G.current    = state.current;
  G.phase      = state.phase;
  G.properties = state.properties;
  G.freeParkingPot = state.freeParkingPot;
  G.doublesCount   = state.doublesCount;
  G.lastDice       = state.lastDice;
  // Restore deck positions by index
  G.chanceDeck    = state.chanceOrder.map(i => CHANCE_CARDS[i]);
  G.communityDeck = state.communityOrder.map(i => COMMUNITY_CARDS[i]);
  renderAll();
  updateMpBar();
  // Show/hide action buttons based on whether it's our turn
  syncActionButtons();
}

function serializeState() {
  return {
    players:    G.players,
    current:    G.current,
    phase:      G.phase,
    properties: G.properties,
    freeParkingPot: G.freeParkingPot,
    doublesCount:   G.doublesCount,
    lastDice:       G.lastDice,
    chanceOrder:    G.chanceDeck.map(c => CHANCE_CARDS.indexOf(c)),
    communityOrder: G.communityDeck.map(c => COMMUNITY_CARDS.indexOf(c)),
  };
}

function hostBroadcastState() {
  if (MP.mode !== 'host') return;
  mpSendAll({ type:'state', state: serializeState() });
}

function handleRemoteAction(data) {
  // Client sends an action; host applies it and rebroadcasts state
  // We encode actions as events: rollDice, buyProperty, endTurn, etc.
  // For simplicity the host executes on behalf of client
  const playerIdx = data.playerIndex;
  if (playerIdx !== G.current) return; // ignore out-of-turn actions
  switch(data.action) {
    case 'roll':     rollDice(true); break;
    case 'buy':      buyProperty(true); break;
    case 'endTurn':  endTurn(true); break;
    case 'payJail':  payJail(true); break;
    case 'build':    buildHouse(data.squareId, data.dir, true); break;
    case 'trade':    executeTrade(data.tradeData, true); break;
  }
}

function clientSendAction(action, extra={}) {
  if (MP.connections.length === 0) return;
  MP.connections[0].send({ type:'action', action, playerIndex: MP.myPlayerIndex, ...extra });
}

function syncActionButtons() {
  // When playing online, only the current player can interact
  const myTurn = isMyTurn();
  document.getElementById('btn-roll').disabled     = !myTurn || G.phase !== 'rolling';
  document.getElementById('btn-buy').disabled      = !myTurn;
  document.getElementById('btn-pass').disabled     = !myTurn;
  document.getElementById('btn-pay-jail').disabled = !myTurn;
  const mpYourTurn = document.getElementById('mp-your-turn');
  if (mpEnabled()) {
    mpYourTurn.classList.toggle('hidden', !myTurn);
  }
}

function updateMpBar() {
  if (!mpEnabled()) return;
  const dot = document.getElementById('mp-dot');
  const peers = document.getElementById('mp-peers-info');
  const connected = MP.connections.filter(c=>c.open).length;
  dot.className = 'mp-dot' + (connected > 0 ? '' : ' off');
  peers.textContent = `${connected + 1} player${connected>0?'s':''} connected`;
  syncActionButtons();
}

// ─── SETUP UI ────────────────────────────────────────────────
let setupPlayers = [];
let mpTab = 'local';

function initSetup() {
  setupPlayers = [
    { name:'Player 1', tokenIdx:0 },
    { name:'Player 2', tokenIdx:1 },
  ];
  renderSetup();
  initPeer();
}

function initPeer() {
  // Always create a peer so we have an ID ready
  try {
    MP.peer = new Peer();
    MP.peer.on('open', id => {
      MP.myPeerId = id;
      // generate 6-char room code from peer id
      MP.roomCode = id.substring(0,6).toUpperCase();
      document.getElementById('host-code').textContent = MP.roomCode;
      document.getElementById('host-status').textContent = 'Share this code — waiting for players…';
    });
    MP.peer.on('connection', conn => {
      // Someone connected to us (we're host)
      conn.on('open', () => {
        MP.connections.push(conn);
        log(`A player joined!`, 'good');
        // Send current state
        hostBroadcastState();
        updateMpBar();
      });
      conn.on('data', mpOnData);
      conn.on('close', () => {
        MP.connections = MP.connections.filter(c=>c!==conn);
        log('A player disconnected.', 'bad');
        updateMpBar();
      });
    });
    MP.peer.on('error', err => {
      document.getElementById('host-status').textContent = 'Error: ' + err.message;
    });
  } catch(e) {
    console.warn('PeerJS not available:', e);
  }
}

function selectMpTab(tab) {
  mpTab = tab;
  ['local','host','join'].forEach(t => {
    document.getElementById('tab-'+t).classList.toggle('active', t===tab);
    document.getElementById('panel-'+t).classList.toggle('active', t===tab);
  });
}

function joinRoom() {
  const code = document.getElementById('join-code-input').value.trim().toUpperCase();
  if (!code || code.length < 4) {
    setJoinStatus('Enter a valid room code.', true); return;
  }
  setJoinStatus('Connecting…');
  // Find peer whose ID starts with our code
  // We'll try to connect using the code as a prefix — host's peerId starts with code
  if (!MP.peer) { setJoinStatus('Connection not ready.', true); return; }

  // Search for host peer: try code as is (it's first 6 chars of peerId)
  // PeerJS IDs are random UUIDs; we need to find the actual full ID.
  // Strategy: host displays their peerId truncated. Client connects using full ID by
  // fetching the PeerJS API list (requires a PeerJS server that supports it).
  // SIMPLEST approach: host shares full peer ID, we use first 6 as room code display
  // but store full ID. On join, we try to connect via peerId = code directly
  // (this works if peer server allows lookup by prefix, which default doesn't).
  // 
  // Better: we use a known PeerJS ID = "monopoly-" + code (host sets this deliberately)
  // Let's switch strategy: host uses a fixed known ID based on room code.

  setJoinStatus('Looking for room ' + code + '…');
  
  const hostPeerId = 'monopoly-room-' + code.toLowerCase();
  const conn = MP.peer.connect(hostPeerId, { reliable: true });
  
  conn.on('open', () => {
    MP.mode = 'client';
    MP.connections = [conn];
    setJoinStatus('Connected! Waiting for game to start…', false, true);
    conn.send({ type:'player_joined', name: setupPlayers[0]?.name || 'Guest' });
    log('Connected to room ' + code + '!', 'good');
  });
  conn.on('data', mpOnData);
  conn.on('error', e => setJoinStatus('Could not connect. Check the code.', true));
  conn.on('close', () => { log('Disconnected from host.', 'bad'); updateMpBar(); });

  setTimeout(() => {
    if (!conn.open) setJoinStatus('Could not reach room. Check the code.', true);
  }, 6000);
}

function setJoinStatus(msg, err=false, ok=false) {
  const el = document.getElementById('join-status');
  el.textContent = msg;
  el.className = 'mp-status' + (err?' err':(ok?' ok':''));
}

function renderSetup() {
  const el = document.getElementById('player-list');
  el.innerHTML = '';
  setupPlayers.forEach((p,i) => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <input type="text" value="${p.name}" placeholder="Player name"
        oninput="setupPlayers[${i}].name=this.value" />
      <span class="token-pick" onclick="cycleToken(${i})">${TOKENS[p.tokenIdx]}</span>
      ${setupPlayers.length>2 ? `<button class="remove-player" onclick="removePlayer(${i})">✕</button>` : ''}
    `;
    el.appendChild(row);
  });
}

function addPlayer() {
  if (setupPlayers.length >= 6) return;
  setupPlayers.push({ name:`Player ${setupPlayers.length+1}`, tokenIdx:setupPlayers.length });
  renderSetup();
}
function removePlayer(i) { setupPlayers.splice(i,1); renderSetup(); }
function cycleToken(i) { setupPlayers[i].tokenIdx=(setupPlayers[i].tokenIdx+1)%TOKENS.length; renderSetup(); }

function startGame() {
  const btn = document.getElementById('btn-start');
  btn.disabled = true;

  // Set MP mode
  if (mpTab === 'host') {
    MP.mode = 'host';
    MP.myPlayerIndex = 0;
    // Re-create peer with fixed ID for easy joining
    // We need a fixed known ID so joiners can find us
    if (MP.peer) {
      const code = MP.roomCode || 'XXXX';
      const fixedId = 'monopoly-room-' + code.toLowerCase();
      if (MP.myPeerId !== fixedId) {
        // Destroy and recreate with fixed ID
        MP.peer.destroy();
        MP.peer = new Peer(fixedId);
        MP.peer.on('open', id => {
          MP.myPeerId = id;
          finishStartGame();
        });
        MP.peer.on('connection', conn => {
          conn.on('open', () => {
            MP.connections.push(conn);
            hostBroadcastState();
            updateMpBar();
            log(`A player joined!`, 'good');
          });
          conn.on('data', mpOnData);
          conn.on('close', () => {
            MP.connections = MP.connections.filter(c=>c!==conn);
            updateMpBar();
          });
        });
        return;
      }
    }
  } else if (mpTab === 'join') {
    MP.mode = 'client';
    // Find which player slot we are — for now always slot 1 (second player)
    MP.myPlayerIndex = 1;
  }

  finishStartGame();
}

function finishStartGame() {
  G.players = setupPlayers.map((p,i) => ({
    name: p.name.trim() || `Player ${i+1}`,
    token: TOKENS[p.tokenIdx],
    color: TOKEN_COLORS[p.tokenIdx],
    money: 1500, pos:0,
    inJail:false, jailTurns:0, jailFreeCards:0,
    bankrupt:false, skipTurns:0, freeRentThisTurn:false,
    properties:[],
  }));

  G.chanceDeck    = shuffle([...CHANCE_CARDS]);
  G.communityDeck = shuffle([...COMMUNITY_CARDS]);
  G.properties    = {};
  G.current       = 0;
  G.phase         = 'rolling';
  G.doublesCount  = 0;
  G.freeParkingPot= 0;
  G.lastDice      = [0,0];

  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');

  if (mpEnabled()) {
    document.getElementById('mp-bar').classList.remove('hidden');
    document.getElementById('mp-room-code').textContent = MP.roomCode || '—';
    document.body.classList.add('has-bar');
  }

  renderAll();
  log('🎲 Game started! ' + G.players.map(p=>p.token+' '+p.name).join(', '), 'important');
  log(`${curPlayer().name}'s turn. Roll the dice!`);

  if (MP.mode === 'host') hostBroadcastState();
  if (mpEnabled()) updateMpBar();

  sizeBoard();
}

// ─── HELPERS ────────────────────────────────────────────────
function curPlayer() { return G.players[G.current]; }
function shuffle(arr) {
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function dr() { return Math.floor(Math.random()*6)+1; }
function log(msg, cls='') {
  const el = document.getElementById('log-entries');
  const d  = document.createElement('div');
  d.className='log-entry '+cls; d.textContent=msg;
  el.prepend(d);
  while(el.children.length>100) el.removeChild(el.lastChild);
}
function fmt(n) { return '₼'+n.toLocaleString(); }

// ─── FINANCE ────────────────────────────────────────────────
function collect(player, amount) {
  player.money += amount;
  log(`${player.name} collects ${fmt(amount)}`, 'good');
  renderPlayers();
}
function charge(player, amount, recipient=null) {
  player.money -= amount;
  if (recipient) { recipient.money += amount; log(`${player.name} pays ${fmt(amount)} to ${recipient.name}.`, 'bad'); }
  else            {                            log(`${player.name} pays ${fmt(amount)} to bank.`, 'bad'); }
  if (player.money < 0) checkBankruptcy(player);
  renderPlayers();
}
function collectFromAll(player, amount) {
  G.players.forEach(other => {
    if (other!==player && !other.bankrupt) {
      other.money  -= amount;
      player.money += amount;
      if (other.money < 0) checkBankruptcy(other);
    }
  });
  log(`${player.name} collects ${fmt(amount)} from each player!`, 'good');
  renderPlayers();
}
function checkBankruptcy(player) {
  if (player.money >= 0) return;
  player.bankrupt = true;
  player.properties.forEach(id => delete G.properties[id]);
  player.properties = [];
  log(`💀 ${player.name} is BANKRUPT!`, 'bad');
  renderAll();
  const alive = G.players.filter(p=>!p.bankrupt);
  if (alive.length===1) showWinner(alive[0]);
}

// ─── MOVEMENT ────────────────────────────────────────────────
function advanceTo(player, targetId) {
  const from = player.pos;
  const wouldPassGo = targetId < from || (targetId===from && from!==0);
  if (wouldPassGo) collect(player, 200);
  player.pos = targetId;
  renderTokens();
}
function moveRelative(player, steps) {
  const np = (player.pos + steps + 40) % 40;
  if (steps>0 && np < player.pos) collect(player, 200);
  player.pos = np;
  renderTokens();
  landOn(player);
}
function advanceToNearest(player, type) {
  const ids = SQUARES.filter(s=>s.type===type).map(s=>s.id);
  let best=ids[0], bestDist=40;
  ids.forEach(id => { const d=(id-player.pos+40)%40; if(d<bestDist){bestDist=d;best=id;} });
  advanceTo(player, best);
  log(`${player.name} advances to ${SQUARES[best].name}`, 'important');
  landOn(player);
}

function getRent(sqId, diceTotal) {
  const sq   = SQUARES[sqId];
  const prop = G.properties[sqId];
  if (!prop) return 0;
  const owner = G.players[prop.owner];
  if (!owner || owner.bankrupt) return 0;
  if (sq.type==='station') {
    const n = COLOR_GROUPS.station.filter(id=>G.properties[id]?.owner===prop.owner).length;
    return [25,50,100,200][n-1]||25;
  }
  if (sq.type==='utility') {
    const n = COLOR_GROUPS.utility.filter(id=>G.properties[id]?.owner===prop.owner).length;
    return n===2 ? 10*diceTotal : 4*diceTotal;
  }
  const table = RENT[sq.group]; if(!table) return 0;
  if (prop.houses>0) return table[Math.min(prop.houses+1, table.length-1)];
  const group = COLOR_GROUPS[sq.group]||[];
  const ownsAll = group.every(id=>G.properties[id]?.owner===prop.owner);
  return ownsAll ? table[1] : table[0];
}

// ─── DICE & TURNS ────────────────────────────────────────────
function rollDice(fromHost=false) {
  if (!fromHost && mpEnabled() && MP.mode==='client') {
    clientSendAction('roll'); return;
  }
  const p = curPlayer();
  if (p.bankrupt || G.phase!=='rolling') return;

  if (p.skipTurns>0) {
    p.skipTurns--;
    log(`${p.name} skips their turn.`);
    nextTurn(); return;
  }

  const d1=dr(), d2=dr();
  const total=d1+d2, doubles=d1===d2;
  G.lastDice=[d1,d2];

  animDice(d1,d2,total,doubles);

  if (p.inJail) {
    if (doubles) {
      p.inJail=false; p.jailTurns=0;
      log(`${p.name} rolled doubles — out of jail!`, 'good');
      G.doublesCount=0;
      movePlayer(p, total);
    } else {
      p.jailTurns++;
      if (p.jailTurns>=3) {
        charge(p,50); p.inJail=false; p.jailTurns=0;
        log(`${p.name} pays ₼50 to leave jail.`);
        movePlayer(p,total);
      } else {
        log(`${p.name} stays in jail. (${p.jailTurns}/3 turns) — pay ₼50 to leave or roll doubles.`);
        G.phase='moved';
        showEndTurnButton();
      }
    }
    if(MP.mode==='host') hostBroadcastState();
    return;
  }

  if (doubles) {
    G.doublesCount++;
    if (G.doublesCount>=3) {
      log(`${p.name} rolled 3 doubles — GO TO JAIL!`, 'bad');
      sendToJail(p); G.doublesCount=0; G.phase='moved';
      showEndTurnButton();
      if(MP.mode==='host') hostBroadcastState();
      return;
    }
  } else { G.doublesCount=0; }

  movePlayer(p, total);
  if(MP.mode==='host') hostBroadcastState();
}

function animDice(d1,d2,total,doubles) {
  const e1=document.getElementById('die1'), e2=document.getElementById('die2');
  e1.classList.add('rolling'); e2.classList.add('rolling');
  setTimeout(()=>{
    e1.classList.remove('rolling'); e2.classList.remove('rolling');
    e1.textContent=d1; e2.textContent=d2;
    document.getElementById('dice-total').textContent =
      `Total: ${total}${doubles?' — DOUBLES! 🎲':''}`;
  }, 460);
}

function movePlayer(player, steps) {
  G.phase='moved';
  const old=player.pos;
  player.pos=(player.pos+steps)%40;
  const passedGo = player.pos<old || old+steps>=40;
  renderTokens();
  setTimeout(()=>{
    if (passedGo && player.pos!==10) {
      collect(player,200);
      log(`${player.name} passes GO — collect ₼200!`, 'good');
    }
    landOn(player);
  }, 550);
}

function landOn(player) {
  const sq = SQUARES[player.pos];
  log(`${player.name} lands on ${sq.name}`);
  const freeRent = player.freeRentThisTurn;
  player.freeRentThisTurn = false;

  switch(sq.type) {
    case 'go':
      collect(player,200); break;
    case 'tax':
      charge(player,sq.price); G.freeParkingPot+=sq.price; updateBank(); break;
    case 'gotojail':
      sendToJail(player); break;
    case 'jail': break;
    case 'parking':
      if(G.freeParkingPot>0){
        const pot=G.freeParkingPot; G.freeParkingPot=0;
        collect(player,pot);
        log(`${player.name} collects Free Parking pot: ${fmt(pot)}!`, 'good');
        updateBank();
      }
      break;
    case 'chance':
      drawCard('chance',player); return;
    case 'community':
      drawCard('community',player); return;
    case 'property': case 'station': case 'utility':
      handleProperty(player, sq, freeRent); return;
  }
  showPostMoveButtons(player);
  if(MP.mode==='host') hostBroadcastState();
}

function handleProperty(player, sq, freeRent) {
  const prop = G.properties[sq.id];
  if (!prop) {
    showBuyButton(player, sq);
    showEndTurnButton();
    if(MP.mode==='host') hostBroadcastState();
    return;
  }
  const owner = G.players[prop.owner];
  if (owner===player || owner.bankrupt || freeRent) {
    if (freeRent) log(`${player.name} — free rent card! 🍿`);
    showEndTurnButton();
    if(MP.mode==='host') hostBroadcastState();
    return;
  }
  const rent = getRent(sq.id, G.lastDice[0]+G.lastDice[1]);
  if (rent>0) {
    charge(player,rent,owner);
    log(`${player.name} pays rent ${fmt(rent)} to ${owner.name}`, 'bad');
  }
  showEndTurnButton();
  if(MP.mode==='host') hostBroadcastState();
}

function showPostMoveButtons(player) {
  const sq = SQUARES[player.pos];
  if (!G.properties[sq.id] && (sq.type==='property'||sq.type==='station'||sq.type==='utility')) {
    showBuyButton(player, sq);
  }
  showEndTurnButton();
}

function showBuyButton(player, sq) {
  const btn=document.getElementById('btn-buy');
  btn.classList.remove('hidden');
  btn.dataset.squareId=sq.id;
  btn.textContent=`🏠 Buy ${sq.name} (${fmt(sq.price)})`;
}
function showEndTurnButton() {
  document.getElementById('btn-pass').classList.remove('hidden');
  document.getElementById('btn-roll').disabled = true;
  // Also hide/show jail pay button
  const p = curPlayer();
  if (p.inJail && G.phase==='rolling') {
    document.getElementById('btn-pay-jail').classList.remove('hidden');
  }
  syncActionButtons();
}

function payJail(fromHost=false) {
  if(!fromHost && mpEnabled() && MP.mode==='client'){ clientSendAction('payJail'); return; }
  const p=curPlayer();
  if(!p.inJail) return;
  charge(p,50);
  p.inJail=false; p.jailTurns=0;
  log(`${p.name} pays ₼50 and leaves jail.`, 'important');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  G.phase='rolling';
  document.getElementById('btn-roll').disabled=false;
  syncActionButtons();
  if(MP.mode==='host') hostBroadcastState();
}

function buyProperty(fromHost=false) {
  if(!fromHost && mpEnabled() && MP.mode==='client'){ clientSendAction('buy'); return; }
  const p=curPlayer();
  const id=parseInt(document.getElementById('btn-buy').dataset.squareId);
  const sq=SQUARES[id];
  if(p.money<sq.price){ log(`${p.name} can't afford ${sq.name}!`,'bad'); return; }
  charge(p,sq.price);
  G.properties[id]={owner:G.current, houses:0};
  p.properties.push(id);
  log(`${p.name} buys ${sq.name} for ${fmt(sq.price)}!`, 'good');
  document.getElementById('btn-buy').classList.add('hidden');
  renderPlayers();
  if(MP.mode==='host') hostBroadcastState();
}

function endTurn(fromHost=false) {
  if(!fromHost && mpEnabled() && MP.mode==='client'){ clientSendAction('endTurn'); return; }
  document.getElementById('btn-buy').classList.add('hidden');
  document.getElementById('btn-pass').classList.add('hidden');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  document.getElementById('btn-roll').disabled=false;
  document.getElementById('dice-total').textContent='';

  if (G.lastDice[0]===G.lastDice[1] && G.doublesCount>0 && !curPlayer().inJail) {
    G.phase='rolling';
    log(`${curPlayer().name} rolled doubles — roll again!`, 'important');
    renderTurnInfo(); syncActionButtons();
    if(MP.mode==='host') hostBroadcastState();
    return;
  }
  nextTurn();
}

function nextTurn() {
  G.lastDice=[0,0];
  document.getElementById('die1').textContent='·';
  document.getElementById('die2').textContent='·';
  document.getElementById('btn-buy').classList.add('hidden');
  document.getElementById('btn-pass').classList.add('hidden');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  document.getElementById('btn-roll').disabled=false;

  let next=(G.current+1)%G.players.length, loops=0;
  while(G.players[next].bankrupt && loops<G.players.length){ next=(next+1)%G.players.length; loops++; }
  G.current=next; G.phase='rolling'; G.doublesCount=0;
  renderAll();
  log(`— ${curPlayer().name}'s turn —`, 'important');
  if(MP.mode==='host') hostBroadcastState();
}

function sendToJail(player) {
  player.pos=10; player.inJail=true; player.jailTurns=0;
  renderTokens();
  log(`${player.name} is sent to JAIL! 🚔`, 'bad');
}

// ─── CARDS ────────────────────────────────────────────────────
let pendingCardAction=null, pendingCardPlayer=null;

function drawCard(type, player) {
  const deck = type==='chance' ? G.chanceDeck : G.communityDeck;
  const card = deck.shift(); deck.push(card);

  const label = document.getElementById('card-type-label');
  label.textContent = type==='chance' ? 'Chance' : 'Et Si?';
  label.className   = 'card-type-label '+(type==='chance'?'chance':'community');
  document.getElementById('card-title-display').textContent = card.title;
  document.getElementById('card-popup-text').textContent    = card.text;
  document.getElementById('card-popup').classList.remove('hidden');
  pendingCardAction = ()=>{ card.action(player); showPostMoveButtons(player); };
  pendingCardPlayer = player;
  if(MP.mode==='host') hostBroadcastState();
}

function dismissCard() {
  document.getElementById('card-popup').classList.add('hidden');
  if(pendingCardAction){ pendingCardAction(); pendingCardAction=null; }
  renderAll();
  if(MP.mode==='host') hostBroadcastState();
}

// ─── MODAL: PROPERTIES ────────────────────────────────────────
function openProperties() {
  const gc = {
    'brown':'#7B3F1A','light-blue':'#6bbfd4','pink':'#e05a8a','orange':'#e07820',
    'red':'#cc2020','yellow':'#d4aa00','green':'#2a8040','dark-blue':'#1a3a8a',
    'station':'#555','utility':'#888'
  };
  const groups = {};
  SQUARES.forEach(sq=>{
    if(!sq.group||['go','tax','jail','gotojail','parking','chance','community'].includes(sq.type)) return;
    if(!groups[sq.group]) groups[sq.group]=[];
    groups[sq.group].push(sq);
  });
  let html='<h2>📋 Properties</h2>';
  Object.keys(groups).forEach(g=>{
    html+=`<div class="prop-group"><div class="prop-group-title">${g.toUpperCase()}</div>`;
    groups[g].forEach(sq=>{
      const prop=G.properties[sq.id];
      const owner=prop?G.players[prop.owner]:null;
      const h=prop?prop.houses:0;
      const hs=h===0?'':(h===5?'🏨':`${'🏠'.repeat(h)}`);
      html+=`<div class="prop-item" style="border-left-color:${gc[g]||'#aaa'}">
        <span>${sq.name}</span>
        <span>${owner?`<span class="prop-owner">${owner.token} ${owner.name}</span>`:''} ${hs?`<span class="prop-houses">${hs}</span>`:''}</span>
      </div>`;
    });
    html+='</div>';
  });
  showModal(html);
}

// ─── MODAL: TRADE ─────────────────────────────────────────────
function openTrade() {
  const p=curPlayer();
  const others=G.players.filter(o=>!o.bankrupt&&o!==p);
  if(!others.length){ showModal('<h2>No other players to trade with!</h2>'); return; }
  let html=`<h2>🤝 Trade</h2>
  <div class="trade-section"><label>Trade with</label>
    <select id="trade-partner">
      ${others.map(o=>`<option value="${G.players.indexOf(o)}">${o.token} ${o.name}</option>`).join('')}
    </select>
  </div>
  <div class="trade-section"><label>You offer ₼</label>
    <input type="number" id="trade-offer-money" value="0" min="0" max="${p.money}" />
  </div>
  <div class="trade-section"><label>Your properties to give</label>
    <div class="trade-checkboxes">
      ${p.properties.map(id=>`<label><input type="checkbox" class="trade-give-prop" value="${id}"> ${SQUARES[id].name}</label>`).join('')||'<span style="color:var(--text3)">None</span>'}
    </div>
  </div>
  <div class="trade-section"><label>You receive ₼</label>
    <input type="number" id="trade-recv-money" value="0" min="0" />
  </div>
  <div class="trade-section"><label>Their properties to receive</label>
    <div class="trade-checkboxes" id="trade-recv-props"></div>
  </div>
  <div class="modal-actions">
    <button class="btn-action" onclick="executeTrade()">Confirm Trade</button>
    <button class="btn-action secondary" onclick="closeModalForce()">Cancel</button>
  </div>`;
  showModal(html);
  function updatePartnerProps(){
    const pi=parseInt(document.getElementById('trade-partner').value);
    const partner=G.players[pi];
    document.getElementById('trade-recv-props').innerHTML=
      partner.properties.map(id=>`<label><input type="checkbox" class="trade-recv-prop" value="${id}"> ${SQUARES[id].name}</label>`).join('')||
      '<span style="color:var(--text3)">None</span>';
  }
  updatePartnerProps();
  document.getElementById('trade-partner').addEventListener('change',updatePartnerProps);
}

function executeTrade(tradeData=null, fromHost=false) {
  if(!fromHost && mpEnabled() && MP.mode==='client'){
    // gather data and send to host
    const p=curPlayer();
    const pi=parseInt(document.getElementById('trade-partner').value);
    const om=parseInt(document.getElementById('trade-offer-money').value)||0;
    const rm=parseInt(document.getElementById('trade-recv-money').value)||0;
    const gp=[...document.querySelectorAll('.trade-give-prop:checked')].map(e=>parseInt(e.value));
    const rp=[...document.querySelectorAll('.trade-recv-prop:checked')].map(e=>parseInt(e.value));
    clientSendAction('trade', {tradeData:{pi,om,rm,gp,rp}});
    closeModalForce(); return;
  }
  const td = tradeData || (() => {
    const p=curPlayer();
    return {
      pi: parseInt(document.getElementById('trade-partner').value),
      om: parseInt(document.getElementById('trade-offer-money').value)||0,
      rm: parseInt(document.getElementById('trade-recv-money').value)||0,
      gp: [...document.querySelectorAll('.trade-give-prop:checked')].map(e=>parseInt(e.value)),
      rp: [...document.querySelectorAll('.trade-recv-prop:checked')].map(e=>parseInt(e.value)),
    };
  })();
  const p=curPlayer(), partner=G.players[td.pi];
  if(td.om>p.money){alert(`${p.name} doesn't have ${fmt(td.om)}!`); return;}
  if(td.rm>partner.money){alert(`${partner.name} doesn't have ${fmt(td.rm)}!`); return;}
  p.money-=td.om; partner.money+=td.om;
  partner.money-=td.rm; p.money+=td.rm;
  td.gp.forEach(id=>{ G.properties[id].owner=td.pi; p.properties=p.properties.filter(x=>x!==id); partner.properties.push(id); });
  td.rp.forEach(id=>{ G.properties[id].owner=G.current; partner.properties=partner.properties.filter(x=>x!==id); p.properties.push(id); });
  log(`Trade: ${p.name} ↔ ${partner.name}`, 'important');
  closeModalForce(); renderAll();
  if(MP.mode==='host') hostBroadcastState();
}

// ─── MODAL: BUILD ─────────────────────────────────────────────
function openBuildMenu() {
  const p=curPlayer();
  const buildable=p.properties.filter(id=>{
    const sq=SQUARES[id];
    if(!sq.group||sq.type!=='property') return false;
    return (COLOR_GROUPS[sq.group]||[]).every(gid=>G.properties[gid]?.owner===G.current);
  });
  if(!buildable.length){
    showModal('<h2>🏗 Build</h2><p>Own a complete colour set to build houses. No complete sets yet.</p>'); return;
  }
  let html='<h2>🏗 Build Houses / Hotels</h2>';
  buildable.forEach(id=>{
    const sq=SQUARES[id], prop=G.properties[id];
    const cost=HOUSE_COST[sq.group]||100, h=prop.houses;
    const hl=h===0?'None':(h===5?'🏨 Hotel':`🏠 × ${h}`);
    html+=`<div class="build-row">
      <div><strong>${sq.name}</strong><br><small style="color:var(--text3)">${fmt(cost)} each</small></div>
      <div class="build-controls">
        <button class="build-btn" onclick="buildHouse(${id},-1)">−</button>
        <span class="house-display">${hl}</span>
        <button class="build-btn" onclick="buildHouse(${id},1)">+</button>
      </div>
    </div>`;
  });
  html+=`<div class="modal-actions"><button class="btn-action secondary" onclick="closeModalForce()">Close</button></div>`;
  showModal(html);
}

function buildHouse(id, dir, fromHost=false) {
  if(!fromHost && mpEnabled() && MP.mode==='client'){ clientSendAction('build',{squareId:id,dir}); return; }
  const p=curPlayer(), sq=SQUARES[id], prop=G.properties[id];
  const cost=HOUSE_COST[sq.group]||100;
  if(dir===1){
    if(prop.houses>=5) return;
    if(p.money<cost){ log('Not enough money to build!','bad'); return; }
    charge(p,cost); prop.houses++;
    log(`${p.name} builds on ${sq.name} (${prop.houses===5?'Hotel':'House '+prop.houses})`, 'good');
  } else {
    if(prop.houses<=0) return;
    const ref=Math.floor(cost/2); prop.houses--;
    collect(p,ref); log(`${p.name} sells house on ${sq.name}, refund ${fmt(ref)}`);
  }
  renderAll(); openBuildMenu();
  if(MP.mode==='host') hostBroadcastState();
}

// ─── MODAL UTILS ──────────────────────────────────────────────
function showModal(html) {
  document.getElementById('modal-content').innerHTML=html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(e){ if(e.target===document.getElementById('modal-overlay')) closeModalForce(); }
function closeModalForce(){ document.getElementById('modal-overlay').classList.add('hidden'); }

// ─── WINNER ────────────────────────────────────────────────────
function showWinner(player) {
  const d=document.createElement('div');
  d.id='winner-banner';
  d.innerHTML=`<div id="winner-inner">
    <div class="w-emoji">${player.token}</div>
    <h1>${player.name} wins!</h1>
    <p>${fmt(player.money)} in the bank &bull; ${player.properties.length} properties</p>
    <button class="btn-action" style="justify-content:center" onclick="location.reload()">Play Again ♥</button>
  </div>`;
  document.body.appendChild(d);
}

// ─── RENDER ────────────────────────────────────────────────────
function renderAll() { renderPlayers(); renderTokens(); renderTurnInfo(); updateBank(); syncActionButtons(); }

function renderPlayers() {
  const panel=document.getElementById('players-panel');
  panel.innerHTML='<div class="panel-title">Players</div>';
  G.players.forEach((p,i)=>{
    const d=document.createElement('div');
    d.className='player-card'+(i===G.current?' active-turn':'')+(p.bankrupt?' bankrupt':'');
    d.innerHTML=`
      <div class="player-token-name">
        <span style="font-size:17px">${p.token}</span>
        <span>${p.name}</span>
      </div>
      <div class="player-money">${fmt(p.money)}</div>
      <div class="player-props">${p.properties.length} propert${p.properties.length===1?'y':'ies'}</div>
      ${p.inJail?'<div class="player-jail-badge">⛓ In Jail</div>':''}
    `;
    panel.appendChild(d);
  });
}

function renderTurnInfo() {
  const p=curPlayer();
  document.getElementById('current-player-name').textContent=`${p.token} ${p.name}'s turn`;
  document.getElementById('current-player-money').textContent=fmt(p.money);
  document.getElementById('btn-roll').disabled = G.phase!=='rolling';
}

function updateBank() {
  document.getElementById('bank-display').innerHTML=
    `Free Parking: ${fmt(G.freeParkingPot)}`;
}

function renderTokens() {
  const layer=document.getElementById('tokens-layer');
  const cont=document.getElementById('board-container');
  const W=cont.offsetWidth, H=cont.offsetHeight;
  layer.innerHTML='';
  G.players.forEach((p,i)=>{
    if(p.bankrupt) return;
    const sq=SQUARES[p.pos];
    const [fx,fy]=sq.pos;
    // Stagger multiple tokens on same square
    const sameSquare=G.players.filter((pp,ii)=>ii<i&&!pp.bankrupt&&pp.pos===p.pos);
    const n=sameSquare.length;
    const offX=(n%3-1)*12, offY=Math.floor(n/3)*14;
    const el=document.createElement('div');
    el.className='token';
    el.style.left=(fx*W+offX)+'px';
    el.style.top =(fy*H+offY)+'px';
    el.innerHTML=`<div class="token-bubble" style="--tc:${p.color}">${p.token}</div>
                  <div class="token-name-tag" style="--tc:${p.color}">${p.name.split(' ')[0]}</div>`;
    el.title=p.name;
    layer.appendChild(el);
  });
}

// ─── BOARD SIZING ──────────────────────────────────────────────
function sizeBoard() {
  const wrap=document.getElementById('board-wrap');
  const cont=document.getElementById('board-container');
  const avail=Math.min(wrap.clientWidth-24, wrap.clientHeight-24);
  cont.style.width=avail+'px';
  cont.style.height=avail+'px';
  renderTokens();
}

window.addEventListener('resize', ()=>{ sizeBoard(); });

// ─── INIT ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', ()=>{
  initSetup();
  setTimeout(sizeBoard, 120);
});