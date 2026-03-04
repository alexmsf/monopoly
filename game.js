// ============================================================
//  MONOPOLY — Our Edition  |  game.js
// ============================================================

var M = '₩';
function fmt(n) { return M + n.toLocaleString(); }

// ── SPRITE DATA ──────────────────────────────────────────────
// Action cards: final-action-cardss.svg  1220×1099  5 cols × 7 rows  card=244×157
var ACTION_SPRITE = {
  file: 'final-action-cards.svg',
  sheetW: 1220, sheetH: 1099,
  cardW: 244, cardH: 157, cols: 5,
  pos: function(idx) {
    var c = idx % 5, r = Math.floor(idx / 5);
    return { x: -(c * 244), y: -(r * 157) };
  }
};

// Property cards: final-property-cardss.svg  1099×976  7 cols × 4 rows  card=157×244
var PROP_SPRITE = {
  file: 'final-property-cards.svg',
  sheetW: 1099, sheetH: 976,
  cardW: 157, cardH: 244, cols: 7,
  // squareId -> sprite index
  map: {1:0,3:1,6:2,8:3,9:4,5:5,15:6,11:7,13:8,14:9,16:10,18:11,19:12,25:13,21:14,23:15,24:16,26:17,27:18,29:19,35:20,31:21,32:22,34:23,37:24,39:25,12:26,28:27},
  pos: function(idx) {
    var c = idx % 7, r = Math.floor(idx / 7);
    return { x: -(c * 157), y: -(r * 244) };
  }
};

// Chance cards: sprite indices 0-15
// Community (ET SI?) cards: mapped individually, null = text fallback
var CHANCE_SPRITE_IDX   = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var COMMUNITY_SPRITE_IDX = [19,null,null,null,null,24,25,26,null,28,30,31,32,null,23,null];

// ── BOARD SQUARES ────────────────────────────────────────────
var SQUARES = [
  {id:0,  name:'GO',                       type:'go',       price:0,   group:null},
  {id:1,  name:'Chez Alex',                type:'property', price:60,  color:'#7B3F1A', group:'brown'},
  {id:2,  name:'ET SI?',                   type:'community',price:0,   group:null},
  {id:3,  name:'Chez Romain',              type:'property', price:60,  color:'#7B3F1A', group:'brown'},
  {id:4,  name:'Income Tax',               type:'tax',      price:150, group:null},
  {id:5,  name:"Gare d'Antibes",           type:'station',  price:200, color:'#555',    group:'station'},
  {id:6,  name:'Bord de Mer a Antibes',    type:'property', price:100, color:'#6bbfd4', group:'light-blue'},
  {id:7,  name:'Chance',                   type:'chance',   price:0,   group:null},
  {id:8,  name:'Petit Coin Cache Falafel', type:'property', price:100, color:'#6bbfd4', group:'light-blue'},
  {id:9,  name:'Cafe Kanter',              type:'property', price:120, color:'#6bbfd4', group:'light-blue'},
  {id:10, name:'Just Visiting / Jail',     type:'jail',     price:0,   group:null},
  {id:11, name:'Hop Store',                type:'property', price:140, color:'#e05a8a', group:'pink'},
  {id:12, name:'Electric Company',         type:'utility',  price:150, group:'utility'},
  {id:13, name:'La Fourmilliere',          type:'property', price:140, color:'#e05a8a', group:'pink'},
  {id:14, name:'Cha Bote',                 type:'property', price:160, color:'#e05a8a', group:'pink'},
  {id:15, name:'Aeroport de Nice',         type:'station',  price:200, color:'#555',    group:'station'},
  {id:16, name:'Cineplanet Antibes',       type:'property', price:180, color:'#e07820', group:'orange'},
  {id:17, name:'ET SI?',                   type:'community',price:0,   group:null},
  {id:18, name:'Trattoria Quattro',        type:'property', price:180, color:'#e07820', group:'orange'},
  {id:19, name:'Appolonia',               type:'property', price:200, color:'#e07820', group:'orange'},
  {id:20, name:'Free Parking',             type:'parking',  price:0,   group:null},
  {id:21, name:'Mini Golf de Porto',       type:'property', price:220, color:'#cc2020', group:'red'},
  {id:22, name:'Chance',                   type:'chance',   price:0,   group:null},
  {id:23, name:"Han's Table",              type:'property', price:220, color:'#cc2020', group:'red'},
  {id:24, name:'The Dog',                  type:'property', price:240, color:'#cc2020', group:'red'},
  {id:25, name:'Metro do Porto',           type:'station',  price:200, color:'#555',    group:'station'},
  {id:26, name:'Castro',                   type:'property', price:260, color:'#d4aa00', group:'yellow'},
  {id:27, name:'Plage du Fort Carre',      type:'property', price:260, color:'#d4aa00', group:'yellow'},
  {id:28, name:'Water Works',              type:'utility',  price:150, group:'utility'},
  {id:29, name:'Bloc Party',               type:'property', price:280, color:'#d4aa00', group:'yellow'},
  {id:30, name:'Go to Jail',               type:'gotojail', price:0,   group:null},
  {id:31, name:'Olympic Stadium Badalona', type:'property', price:300, color:'#2a8040', group:'green'},
  {id:32, name:'Sagrada Familia',          type:'property', price:300, color:'#2a8040', group:'green'},
  {id:33, name:'ET SI?',                   type:'community',price:0,   group:null},
  {id:34, name:'100 Montaditos',           type:'property', price:320, color:'#2a8040', group:'green'},
  {id:35, name:'Aeroport de Barcelone',    type:'station',  price:200, color:'#555',    group:'station'},
  {id:36, name:'Chance',                   type:'chance',   price:0,   group:null},
  {id:37, name:'Pasta de la Mama',         type:'property', price:350, color:'#1a3a8a', group:'dark-blue'},
  {id:38, name:'Luxury Tax',               type:'tax',      price:100, group:null},
  {id:39, name:'La Ferme de Mamie',        type:'property', price:400, color:'#1a3a8a', group:'dark-blue'}
];

// Token positions
(function() {
  var cs = 0.1375, inner = (1 - 2*cs) / 9;
  SQUARES[0].pos  = [1-cs/2, 1-cs/2];
  SQUARES[10].pos = [cs/2,   1-cs/2];
  SQUARES[20].pos = [cs/2,   cs/2];
  SQUARES[30].pos = [1-cs/2, cs/2];
  for (var i = 1; i <= 9; i++) {
    SQUARES[i].pos    = [1-cs-(i-.5)*inner,  1-cs/2];
    SQUARES[10+i].pos = [cs/2,               1-cs-(i-.5)*inner];
    SQUARES[20+i].pos = [cs+(i-.5)*inner,    cs/2];
    SQUARES[30+i].pos = [1-cs/2,             cs+(i-.5)*inner];
  }
})();

// ── RENT DATA ────────────────────────────────────────────────
var RENT = {
  'brown':     [2,4,10,30,90,160,250],
  'light-blue':[6,12,30,90,270,400,550],
  'pink':      [10,20,50,150,450,625,750],
  'orange':    [14,28,70,200,550,750,950],
  'red':       [18,36,90,250,700,875,1050],
  'yellow':    [22,44,110,330,800,975,1150],
  'green':     [26,52,130,390,900,1100,1275],
  'dark-blue': [35,70,175,500,1100,1300,1500]
};
var HOUSE_COST = {'brown':50,'light-blue':50,'pink':100,'orange':100,'red':150,'yellow':150,'green':200,'dark-blue':200};
var COLOR_GROUPS = {
  'brown':[1,3],'light-blue':[6,8,9],'pink':[11,13,14],'orange':[16,18,19],
  'red':[21,23,24],'yellow':[26,27,29],'green':[31,32,34],'dark-blue':[37,39],
  'station':[5,15,25,35],'utility':[12,28]
};

// ── CARDS ────────────────────────────────────────────────────
var CHANCE_CARDS = [
  {title:'EXCEPTIONAL.',              si:0,  text:'Romain vient de faire un autre S+ LoL!\nRentrez chez lui!\n\nIF YOU PASS GO, COLLECT '+M+'200.',    action:function(p){advanceTo(p,0);}},
  {title:'SPONTANEOUS TRIP ALERT.',   si:1,  text:'Billets achetés, départ dans 3 jours.\n\nPAYEZ '+M+'50 DE FRAIS DE BAGAGE EN RETARD.',              action:function(p){charge(p,50);}},
  {title:'G2 GAGNE.',                 si:2,  text:'The crowd goes wild. Advance to nearest station.\n\nIF YOU PASS GO, COLLECT '+M+'200.',               action:function(p){advanceToNearest(p,'station');}},
  {title:'SIESTE STRATEGIQUE.',       si:3,  text:"Tu t'es endormi dans le metro do Porto.\n\nSKIP YOUR NEXT TURN.",                                     action:function(p){p.skipTurns=(p.skipTurns||0)+1;showFX('skip');}},
  {title:'BILLET DE BANQUE.',         si:4,  text:'Tu retrouves un billet dans ta vieille veste.\n\nCOLLECT '+M+'20.',                                   action:function(p){collect(p,20);showFX('collect');}},
  {title:'VIENNOISERIE DE TROP.',     si:5,  text:"C'etait tellement bon mais...\n\nPAY "+M+'20 TO THE BANK.',                                           action:function(p){charge(p,20);showFX('pay');}},
  {title:"TU T'ES PERDU A BARCELONE.",si:6,  text:"C'est romantique, en fait.\n\nGO BACK 3 SPACES.",                                                    action:function(p){moveRelative(p,-3);}},
  {title:'DATE NIGHT REUSSI.',        si:7,  text:'Film, pop-corn, bonne humeur.\n\nADVANCE TO CINEPLANET ANTIBES.',                                     action:function(p){advanceTo(p,16);}},
  {title:'OLIVIERS CUEILLIS.',        si:8,  text:"T'as aide a la ferme de mamie comme un pro.\n\nTOUCHE "+M+'50.',                                      action:function(p){collect(p,50);showFX('collect');}},
  {title:'PETIT VOYAGE SPONTANE.',    si:9,  text:'On part quand? Maintenant.\n\nAdvance to AEROPORT DE NICE.',                                          action:function(p){advanceTo(p,15);}},
  {title:'AFTERWORK IMPROVISE.',      si:10, text:'Hop Store, une biere, la belle vie.\n\nCOLLECT '+M+'20 FROM EVERY PLAYER.',                           action:function(p){collectFromAll(p,20);showFX('collect');}},
  {title:'G2 PERD.',                  si:11, text:"C'est dur. Restez dignes.\n\nPAY "+M+'20 EN FRAIS DE CONSOLATION (SNACKS).',                          action:function(p){charge(p,20);showFX('pay');}},
  {title:'JOUR DE PLUIE A ANTIBES.',  si:12, text:'Chocolat viennois au Cafe Kanter.\n\nCOLLECT '+M+'20, SOME DAYS ARE JUST GOOD.',                      action:function(p){collect(p,20);showFX('collect');}},
  {title:'CACHORINHOS AU DOG.',       si:13, text:'Best meal ever, EVERYONE agrees.\n\nMove to THE DOG. IF YOU PASS GO, COLLECT '+M+'200.',               action:function(p){advanceTo(p,24);}},
  {title:'MINI GOLF SHOCK.',          si:14, text:"T'as perdu au mini golf. Personne n'en parle mais...\n\nPAY "+M+'20.',                                 action:function(p){charge(p,20);showFX('pay');}},
  {title:'COUP DE CHANCE.',           si:15, text:"La vie est belle, Antibes est belle, vous etes beaux.\n\nCOLLECT "+M+'150.',                           action:function(p){collect(p,150);showFX('collect');}}
];

var COMMUNITY_CARDS = [
  {title:'ET SI? — Premier rendez-vous.',    si:19,   text:'Pasta de la Mama, un soir de semaine, et tout a change.\n\nCOLLECT '+M+'200. BEST INVESTMENT EVER.',             action:function(p){collect(p,200);showFX('collect');}},
  {title:'ET SI? — Rester au lit.',          si:null, text:'Et si on restait au lit? Bonne idee.\n\nSKIP YOUR NEXT TURN.',                                                   action:function(p){p.skipTurns=(p.skipTurns||0)+1;showFX('skip');}},
  {title:'ET SI? — Porto.',                  si:null, text:'Et si on allait a Porto?\nVOL TROUVE, VALISE FAITE.\n\nCOLLECT '+M+'100.',                                       action:function(p){collect(p,100);showFX('collect');}},
  {title:'ET SI? — Brunch.',                 si:null, text:'Et si on faisait un brunch?\nCHA BOTE, DIMANCHE, SOLEIL.\n\nCOLLECT '+M+'50.',                                   action:function(p){collect(p,50);showFX('collect');}},
  {title:'ET SI? — Heritage de mamie.',      si:null, text:"ELLE T'A LAISSE UN BOCAL D'HUILE D'OLIVE ET UNE GLACE.\n\n"+M+'80 ARE YOURS TO COLLECT.',                       action:function(p){collect(p,80);showFX('collect');}},
  {title:'ET SI? — Quiz ce soir.',           si:24,   text:'LA FOURMILLIERE, VOUS GAGNEZ (EVIDEMMENT).\n\nCOLLECT '+M+'25 FROM EACH PLAYER.',                               action:function(p){collectFromAll(p,25);showFX('collect');}},
  {title:'ET SI? — Chocolat viennois.',      si:25,   text:'Cafe Kanter, apres le taf, vous etes seuls au monde.\n\nCOLLECT '+M+'20.',                                       action:function(p){collect(p,20);showFX('collect');}},
  {title:'ET SI? — Un film.',                si:26,   text:'Soiree canape. Trop bien.\n\nAdvance to Chez toi — no rent charged this turn.',                                   action:function(p){p.freeRentThisTurn=true;log(p.name+' — free rent this turn!','important');}},
  {title:'ET SI? — Petit falafel.',          si:null, text:'NOTRE COIN CACHE. COMME D\'HAB.\n\nGET '+M+'30.',                                                                 action:function(p){collect(p,30);showFX('collect');}},
  {title:'ET SI? — Reparations imprevues.',  si:28,   text:'SOMETHING BROKE. (we won\'t point fingers)\n\nPAY '+M+'100 TO THE BANK.',                                        action:function(p){charge(p,100);showFX('pay');}},
  {title:'ET SI? — Bloc Party.',             si:null, text:'Samedi matin. CLIMBING, LUNCH, THE WHOLE RITUAL.\n\nGET '+M+'40.',                                               action:function(p){collect(p,40);showFX('collect');}},
  {title:"ET SI? — Nuit a l'aeroport.",      si:30,   text:'Il veille sur toi pendant que tu dors.\n\nPRICELESS. REMEMBER THIS THO.',                                        action:function(p){log(p.name+' — precious moment 💙','good');}},
  {title:'ET SI? — Serenade involontaire.',  si:31,   text:"T'as chante en cuisine sans t'en rendre compte.\n0 mais tout le monde sourit.",                                   action:function(p){log(p.name+' — everyone smiles 🎵','good');}},
  {title:'ET SI? — Voir la mer.',            si:32,   text:"Il est peut-etre 3h du matin, mais tu n'es pas pret a rentrer.\n\nCOLLECT "+M+'60.',                             action:function(p){collect(p,60);showFX('collect');}},
  {title:'ET SI? — Sortie culturelle.',      si:23,   text:'Sagrada Familia, il etait temps.\n\nADVANCE TO SAGRADA FAMILIA.',                                                 action:function(p){advanceTo(p,32);}},
  {title:'ET SI? — Frais medicaux.',         si:null, text:'Trop de viennoiseries.\n\nPAY '+M+'100. A REFAIRE TOUT DE MEME.',                                                action:function(p){charge(p,100);showFX('pay');}}
];

// ── RULES ────────────────────────────────────────────────────
var RULES_HTML = '<h2>📖 How to Play</h2>' +
  '<p><strong>Goal:</strong> Be the last player with money — bankrupt all opponents.</p>' +
  '<p><strong>Your turn:</strong> Roll the dice and move clockwise around the board.</p>' +
  '<p><strong>Buying property:</strong> Land on an unowned square to buy it. If you pass, it stays unowned.</p>' +
  '<p><strong>Paying rent:</strong> Land on someone else\'s property and pay rent. Owning the full colour set doubles base rent.</p>' +
  '<p><strong>Building:</strong> Own every property in a colour set, then use Build to add houses (up to 4) then a hotel.</p>' +
  '<p><strong>Stations:</strong> 1='+M+'25, 2='+M+'50, 3='+M+'100, 4='+M+'200.</p>' +
  '<p><strong>Utilities:</strong> 4× dice total (one owned), 10× (both owned).</p>' +
  '<p><strong>GO:</strong> Collect '+M+'200 every time you pass or land on GO.</p>' +
  '<p><strong>Income Tax:</strong> Pay '+M+'150 → Free Parking pot.</p>' +
  '<p><strong>Luxury Tax:</strong> Pay '+M+'100 → Free Parking pot.</p>' +
  '<p><strong>Free Parking:</strong> Collect the accumulated tax pot.</p>' +
  '<p><strong>Jail:</strong> Land on Go to Jail, or roll doubles 3× in a row. Roll doubles to escape free, or pay '+M+'50 on any turn.</p>' +
  '<p><strong>Doubles:</strong> Roll again! Three in a row → jail.</p>' +
  '<p><strong>Chance / Et Si?:</strong> Draw a card and follow its instructions.</p>' +
  '<p><strong>Trading:</strong> Use the Trade button to exchange properties and money.</p>' +
  '<p><strong>Bankruptcy:</strong> Can\'t pay a debt → out. Properties return to bank.</p>' +
  '<p><strong>Properties:</strong> Click any property in the list to see its deed card.</p>';

// ── SOUNDS ───────────────────────────────────────────────────
function playSound(type) {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    var now = ctx.currentTime;
    if (type === 'dice') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(180, now);
      o.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      o.start(now); o.stop(now + 0.15);
    } else if (type === 'buy') {
      o.type = 'sine';
      o.frequency.setValueAtTime(523, now);
      o.frequency.setValueAtTime(659, now + 0.1);
      o.frequency.setValueAtTime(784, now + 0.2);
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      o.start(now); o.stop(now + 0.35);
    } else if (type === 'jail') {
      o.type = 'square';
      o.frequency.setValueAtTime(220, now);
      o.frequency.setValueAtTime(180, now + 0.1);
      o.frequency.setValueAtTime(140, now + 0.2);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      o.start(now); o.stop(now + 0.4);
    } else if (type === 'card') {
      o.type = 'sine';
      o.frequency.setValueAtTime(440, now);
      o.frequency.setValueAtTime(550, now + 0.06);
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      o.start(now); o.stop(now + 0.2);
    } else if (type === 'collect') {
      o.type = 'sine';
      o.frequency.setValueAtTime(660, now);
      o.frequency.setValueAtTime(880, now + 0.08);
      g.gain.setValueAtTime(0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o.start(now); o.stop(now + 0.25);
    }
  } catch(e) {}
}

// ── FX OVERLAY ───────────────────────────────────────────────
function showFX(type) {
  var el   = document.getElementById('card-effect-overlay');
  var icon = document.getElementById('card-effect-icon');
  var map  = {collect:'💰', pay:'😬', skip:'💤', move:'🚀'};
  icon.textContent = map[type] || '✨';
  el.classList.remove('hidden');
  el.classList.add('effect-pop');
  if (type === 'collect') playSound('collect');
  setTimeout(function() { el.classList.remove('effect-pop'); el.classList.add('hidden'); }, 900);
}

// ── TURN TOAST ───────────────────────────────────────────────
function showTurnToast(player) {
  var toast = document.getElementById('turn-toast');
  toast.textContent = player.token + ' ' + player.name + "'s turn!";
  toast.classList.remove('hidden');
  setTimeout(function() { toast.classList.add('hidden'); }, 2200);
}

// ── TOKENS & COLORS ──────────────────────────────────────────
var TOKEN_EMOJIS = ['🧸','🎮','🦖','🔥','🦄','🛸'];
var TOKEN_COLORS = ['#c23b2e','#3a62a0','#3a7c55','#c5703a','#7b4fbf','#1a9090'];

// ── GAME STATE ────────────────────────────────────────────────
var G = {
  players:[], current:0, phase:'rolling',
  properties:{}, chanceDeck:[], communityDeck:[],
  freeParkingPot:0, doublesCount:0, lastDice:[0,0]
};

// ── MULTIPLAYER (PeerJS) ──────────────────────────────────────
var MP = { mode:'local', peer:null, myPeerId:null, connections:[], myPlayerIndex:-1, roomCode:null };

function genRoomCode() {
  var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s='';
  for(var i=0;i<4;i++) s+=c[Math.floor(Math.random()*c.length)];
  return s;
}
function mpEnabled() { return MP.mode!=='local'; }
function isMyTurn()  { return !mpEnabled()||G.current===MP.myPlayerIndex; }
function mpSendAll(msg) { MP.connections.forEach(function(c){try{if(c.open)c.send(msg);}catch(e){}});}
function mpOnData(data) {
  if(data.type==='state') applyRemoteState(data.state);
  else if(data.type==='action'&&MP.mode==='host') handleRemoteAction(data);
  else if(data.type==='player_joined') log(data.name+' joined!','good');
}
function applyRemoteState(s) {
  G.players=s.players;G.current=s.current;G.phase=s.phase;G.properties=s.properties;
  G.freeParkingPot=s.freeParkingPot;G.doublesCount=s.doublesCount;G.lastDice=s.lastDice;
  G.chanceDeck=s.co.map(function(i){return CHANCE_CARDS[i];});
  G.communityDeck=s.mo.map(function(i){return COMMUNITY_CARDS[i];});
  if(s.lastDice[0]){document.getElementById('die1').textContent=s.lastDice[0];document.getElementById('die2').textContent=s.lastDice[1];document.getElementById('dice-total').textContent='Total: '+(s.lastDice[0]+s.lastDice[1]);}
  renderAll();updateMpBar();syncActionButtons();
}
function serializeState() {
  return {players:G.players,current:G.current,phase:G.phase,properties:G.properties,
    freeParkingPot:G.freeParkingPot,doublesCount:G.doublesCount,lastDice:G.lastDice,
    co:G.chanceDeck.map(function(c){return CHANCE_CARDS.indexOf(c);}),
    mo:G.communityDeck.map(function(c){return COMMUNITY_CARDS.indexOf(c);})};
}
function hostBcast() { if(MP.mode==='host') mpSendAll({type:'state',state:serializeState()}); }
function handleRemoteAction(data) {
  if(data.playerIndex!==G.current) return;
  switch(data.action){
    case 'roll':    rollDice(true); break;
    case 'buy':     buyProperty(true); break;
    case 'endTurn': endTurn(true); break;
    case 'payJail': payJail(true); break;
    case 'build':   buildHouse(data.sid,data.dir,true); break;
    case 'trade':   executeTrade(data.td,true); break;
  }
}
function cliSend(action,extra) {
  if(!MP.connections.length) return;
  var msg=Object.assign({type:'action',action:action,playerIndex:MP.myPlayerIndex},extra||{});
  try{MP.connections[0].send(msg);}catch(e){}
}
function syncActionButtons() {
  var my=isMyTurn(),rolling=G.phase==='rolling';
  dis('btn-roll',!my||!rolling);dis('btn-buy',!my);dis('btn-pass',!my);dis('btn-pay-jail',!my);
  var yt=document.getElementById('mp-your-turn');
  if(mpEnabled()) yt.classList.toggle('hidden',!my||!rolling);
}
function dis(id,v){var e=document.getElementById(id);if(e)e.disabled=v;}
function updateMpBar() {
  if(!mpEnabled()) return;
  var open=MP.connections.filter(function(c){return c.open;}).length;
  document.getElementById('mp-dot').className='mp-dot'+(open>0?'':' off');
  document.getElementById('mp-peers-info').textContent=(open+1)+' player'+(open>0?'s':'')+' connected';
  syncActionButtons();
}

// ── SETUP ─────────────────────────────────────────────────────
var setupPlayers=[], mpTab='local';
function initSetup() {
  setupPlayers=[{name:'Player 1',tokenIdx:0},{name:'Player 2',tokenIdx:1}];
  renderSetup(); initPeer();
}
function initPeer() {
  MP.roomCode=genRoomCode();
  try {
    MP.peer=new Peer('mnply-'+MP.roomCode.toLowerCase());
    MP.peer.on('open',function(id){
      MP.myPeerId=id;
      document.getElementById('host-code').textContent=MP.roomCode;
      document.getElementById('host-status').textContent='Share this code — waiting for players...';
    });
    MP.peer.on('connection',function(conn){
      conn.on('open',function(){MP.connections.push(conn);log('A player joined!','good');if(G.players.length>0)hostBcast();updateMpBar();});
      conn.on('data',mpOnData);
      conn.on('close',function(){MP.connections=MP.connections.filter(function(c){return c!==conn;});log('A player disconnected.','bad');updateMpBar();});
    });
    MP.peer.on('error',function(err){
      if(err.type==='unavailable-id'){MP.peer.destroy();setTimeout(initPeer,400);}
      else document.getElementById('host-status').textContent='Error: '+err.message;
    });
  }catch(e){console.warn('PeerJS:',e);}
}
function selectMpTab(tab) {
  mpTab=tab;
  ['local','host','join'].forEach(function(t){
    document.getElementById('tab-'+t).classList.toggle('active',t===tab);
    document.getElementById('panel-'+t).classList.toggle('active',t===tab);
  });
}
function joinRoom() {
  var code=document.getElementById('join-code-input').value.trim().toUpperCase();
  if(!code||code.length<3){setJS('Enter a valid room code.',true);return;}
  if(!MP.peer){setJS('Not ready yet.',true);return;}
  setJS('Connecting to '+code+'...');
  var conn=MP.peer.connect('mnply-'+code.toLowerCase(),{reliable:true});
  conn.on('open',function(){MP.mode='client';MP.connections=[conn];MP.myPlayerIndex=1;setJS('Connected! Waiting for host...',false,true);conn.send({type:'player_joined',name:setupPlayers[0]?setupPlayers[0].name:'Guest'});});
  conn.on('data',function(data){mpOnData(data);if(data.type==='state'&&document.getElementById('setup-screen').classList.contains('active'))launchGame();});
  conn.on('error',function(){setJS('Could not connect. Check the code.',true);});
  conn.on('close',function(){log('Disconnected.','bad');updateMpBar();});
  setTimeout(function(){if(!conn.open)setJS('Could not reach that room.',true);},7000);
}
function setJS(m,e,ok){var el=document.getElementById('join-status');el.textContent=m;el.className='mp-status'+(e?' err':(ok?' ok':''));}
function renderSetup() {
  var el=document.getElementById('player-list');el.innerHTML='';
  setupPlayers.forEach(function(p,i){
    var row=document.createElement('div');row.className='player-row';
    row.innerHTML='<input type="text" value="'+p.name+'" placeholder="Player name" oninput="setupPlayers['+i+'].name=this.value"/>'+
      '<span class="token-pick" onclick="cycleToken('+i+')">'+TOKEN_EMOJIS[p.tokenIdx]+'</span>'+
      (setupPlayers.length>2?'<button class="remove-player" onclick="removePlayer('+i+')">×</button>':'');
    el.appendChild(row);
  });
}
function addPlayer(){if(setupPlayers.length>=6)return;setupPlayers.push({name:'Player '+(setupPlayers.length+1),tokenIdx:setupPlayers.length});renderSetup();}
function removePlayer(i){setupPlayers.splice(i,1);renderSetup();}
function cycleToken(i){setupPlayers[i].tokenIdx=(setupPlayers[i].tokenIdx+1)%TOKEN_EMOJIS.length;renderSetup();}

function startGame() {
  document.getElementById('btn-start').disabled=true;
  if(mpTab==='host'){MP.mode='host';MP.myPlayerIndex=0;}
  else if(mpTab==='join'){MP.mode='client';MP.myPlayerIndex=1;}
  G.players=setupPlayers.map(function(p,i){
    return {name:p.name.trim()||'Player '+(i+1),token:TOKEN_EMOJIS[p.tokenIdx],color:TOKEN_COLORS[p.tokenIdx],
      money:1500,pos:0,inJail:false,jailTurns:0,bankrupt:false,skipTurns:0,freeRentThisTurn:false,properties:[]};
  });
  G.chanceDeck=shuffle(CHANCE_CARDS.slice());
  G.communityDeck=shuffle(COMMUNITY_CARDS.slice());
  G.properties={};G.current=0;G.phase='rolling';G.doublesCount=0;G.freeParkingPot=0;G.lastDice=[0,0];
  launchGame();
  log('Game started! '+G.players.map(function(p){return p.token+' '+p.name;}).join(', '),'important');
  log(curPlayer().name+"'s turn. Roll the dice!");
  showTurnToast(curPlayer());
  if(MP.mode==='host') hostBcast();
  if(mpEnabled()) updateMpBar();
}

function launchGame() {
  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  if(mpEnabled()){document.getElementById('mp-bar').classList.remove('hidden');document.getElementById('mp-room-code').textContent=MP.roomCode||'--';document.body.classList.add('has-bar');}
  renderAll();sizeBoard();
}

// ── HELPERS ───────────────────────────────────────────────────
function curPlayer(){return G.players[G.current];}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function dr(){return Math.floor(Math.random()*6)+1;}
function log(msg,cls){var el=document.getElementById('log-entries');var d=document.createElement('div');d.className='log-entry '+(cls||'');d.textContent=msg;el.prepend(d);while(el.children.length>100)el.removeChild(el.lastChild);}

// ── FINANCE ───────────────────────────────────────────────────
function collect(player,amount){player.money+=amount;log(player.name+' collects '+fmt(amount),'good');renderPlayers();}
function charge(player,amount,recipient){
  player.money-=amount;
  if(recipient){recipient.money+=amount;log(player.name+' pays '+fmt(amount)+' to '+recipient.name+'.','bad');}
  else log(player.name+' pays '+fmt(amount)+' to bank.','bad');
  if(player.money<0)checkBankruptcy(player);
  renderPlayers();
}
function collectFromAll(player,amount){
  G.players.forEach(function(o){if(o!==player&&!o.bankrupt){o.money-=amount;player.money+=amount;if(o.money<0)checkBankruptcy(o);}});
  log(player.name+' collects '+fmt(amount)+' from each!','good');renderPlayers();
}
function checkBankruptcy(player){
  if(player.money>=0)return;
  player.bankrupt=true;
  player.properties.forEach(function(id){delete G.properties[id];});player.properties=[];
  log(player.name+' is BANKRUPT!','bad');renderAll();
  var alive=G.players.filter(function(p){return !p.bankrupt;});
  if(alive.length===1)showWinner(alive[0]);
}

// ── MOVEMENT ──────────────────────────────────────────────────
function advanceTo(player,targetId){
  if(targetId<player.pos)collect(player,200);
  player.pos=targetId;renderTokens();
}
function moveRelative(player,steps){
  var np=(player.pos+steps+40)%40;
  if(steps>0&&np<player.pos)collect(player,200);
  player.pos=np;renderTokens();landOn(player);
}
function advanceToNearest(player,type){
  var ids=SQUARES.filter(function(s){return s.type===type;}).map(function(s){return s.id;});
  var best=ids[0],bd=40;
  ids.forEach(function(id){var d=(id-player.pos+40)%40;if(d<bd){bd=d;best=id;}});
  if(best<player.pos)collect(player,200);
  player.pos=best;log(player.name+' advances to '+SQUARES[best].name,'important');
  renderTokens();landOn(player);
}
function getRent(sqId,diceTotal){
  var sq=SQUARES[sqId],prop=G.properties[sqId];if(!prop)return 0;
  var owner=G.players[prop.owner];if(!owner||owner.bankrupt)return 0;
  if(sq.type==='station'){var n=COLOR_GROUPS.station.filter(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;}).length;return[25,50,100,200][n-1]||25;}
  if(sq.type==='utility'){var nu=COLOR_GROUPS.utility.filter(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;}).length;return nu===2?10*diceTotal:4*diceTotal;}
  var table=RENT[sq.group];if(!table)return 0;
  if(prop.houses>0)return table[Math.min(prop.houses+1,table.length-1)];
  var group=COLOR_GROUPS[sq.group]||[];
  var ownsAll=group.every(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;});
  return ownsAll?table[1]:table[0];
}

// ── STEP-BY-STEP TOKEN MOVEMENT ───────────────────────────────
function movePlayerStepByStep(player, steps, callback) {
  if (steps === 0) { if (callback) callback(); return; }
  var dir = steps > 0 ? 1 : -1;
  var remaining = Math.abs(steps);

  function step() {
    player.pos = (player.pos + dir + 40) % 40;
    renderTokens();
    remaining--;
    if (remaining > 0) {
      setTimeout(step, 120);
    } else {
      if (callback) callback();
    }
  }
  setTimeout(step, 80);
}

// ── DICE & TURNS ──────────────────────────────────────────────
function rollDice(fromHost) {
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){cliSend('roll');return;}
  var p=curPlayer();
  if(p.bankrupt||G.phase!=='rolling')return;
  if(p.skipTurns>0){p.skipTurns--;log(p.name+' skips their turn.');nextTurn();return;}

  var d1=dr(),d2=dr(),total=d1+d2,doubles=d1===d2;
  G.lastDice=[d1,d2];
  playSound('dice');
  animDice(d1,d2,total,doubles);

  if(p.inJail){
    if(doubles){p.inJail=false;p.jailTurns=0;G.doublesCount=0;log(p.name+' rolled doubles — out of jail!','good');doMove(p,total);}
    else{p.jailTurns++;if(p.jailTurns>=3){charge(p,50);p.inJail=false;p.jailTurns=0;log(p.name+' pays '+M+'50 to leave jail.');doMove(p,total);}
    else{log(p.name+' stays in jail ('+p.jailTurns+'/3). Pay '+M+'50 or roll doubles.');G.phase='moved';showEndTurnBtn();}}
    hostBcast();return;
  }
  if(doubles){G.doublesCount++;if(G.doublesCount>=3){log(p.name+' rolled 3 doubles — GO TO JAIL!','bad');playSound('jail');sendToJail(p);G.doublesCount=0;G.phase='moved';showEndTurnBtn();hostBcast();return;}}
  else G.doublesCount=0;
  doMove(p,total);
  hostBcast();
}

function doMove(player, steps) {
  G.phase='moved';
  var oldPos = player.pos;
  var newPos = (oldPos + steps) % 40;

  movePlayerStepByStep(player, steps, function() {
    if (oldPos + steps >= 40) {
      collect(player, 200);
      log(player.name + ' passes GO — collect ' + M + '200!', 'good');
    }
    landOn(player);
  });
}

function animDice(d1,d2,total,doubles){
  var e1=document.getElementById('die1'),e2=document.getElementById('die2');
  e1.classList.add('rolling');e2.classList.add('rolling');
  setTimeout(function(){e1.classList.remove('rolling');e2.classList.remove('rolling');e1.textContent=d1;e2.textContent=d2;document.getElementById('dice-total').textContent='Total: '+total+(doubles?' — DOUBLES!':'');},460);
}

function landOn(player){
  var sq=SQUARES[player.pos];
  log(player.name+' lands on '+sq.name);
  var freeRent=player.freeRentThisTurn;player.freeRentThisTurn=false;
  switch(sq.type){
    case 'go':      collect(player,200);break;
    case 'tax':     charge(player,sq.price);G.freeParkingPot+=sq.price;updateBank();break;
    case 'gotojail':playSound('jail');sendToJail(player);break;
    case 'jail':    break;
    case 'parking':
      if(G.freeParkingPot>0){var pot=G.freeParkingPot;G.freeParkingPot=0;collect(player,pot);log(player.name+' collects Free Parking pot: '+fmt(pot)+'!','good');updateBank();}break;
    case 'chance':   playSound('card');drawCard('chance',player);   return;
    case 'community':playSound('card');drawCard('community',player);return;
    case 'property': case 'station': case 'utility': handleProperty(player,sq,freeRent);return;
  }
  showPostMove(player);hostBcast();
}

function handleProperty(player,sq,freeRent){
  var prop=G.properties[sq.id];
  if(!prop){showBuyBtn(player,sq);showEndTurnBtn();hostBcast();return;}
  var owner=G.players[prop.owner];
  if(owner===player||owner.bankrupt||freeRent){if(freeRent)log(player.name+' — free rent card!');showEndTurnBtn();hostBcast();return;}
  var rent=getRent(sq.id,G.lastDice[0]+G.lastDice[1]);
  if(rent>0)charge(player,rent,owner);
  showEndTurnBtn();hostBcast();
}

function showPostMove(player){
  var sq=SQUARES[player.pos];
  if(!G.properties[sq.id]&&(sq.type==='property'||sq.type==='station'||sq.type==='utility'))showBuyBtn(player,sq);
  showEndTurnBtn();
}
function showBuyBtn(player,sq){var btn=document.getElementById('btn-buy');btn.classList.remove('hidden');btn.dataset.squareId=sq.id;btn.textContent='🏠 Buy '+sq.name+' ('+fmt(sq.price)+')';}
function showEndTurnBtn(){document.getElementById('btn-pass').classList.remove('hidden');dis('btn-roll',true);if(curPlayer().inJail)document.getElementById('btn-pay-jail').classList.remove('hidden');syncActionButtons();}

function payJail(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){cliSend('payJail');return;}
  var p=curPlayer();if(!p.inJail)return;
  charge(p,50);p.inJail=false;p.jailTurns=0;
  log(p.name+' pays '+M+'50 and leaves jail.','important');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  G.phase='rolling';dis('btn-roll',false);syncActionButtons();hostBcast();
}

function buyProperty(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){cliSend('buy');return;}
  var p=curPlayer(),id=parseInt(document.getElementById('btn-buy').dataset.squareId,10),sq=SQUARES[id];
  if(p.money<sq.price){log(p.name+" can't afford "+sq.name+'!','bad');return;}
  charge(p,sq.price);G.properties[id]={owner:G.current,houses:0};p.properties.push(id);
  log(p.name+' buys '+sq.name+' for '+fmt(sq.price)+'!','good');
  playSound('buy');
  document.getElementById('btn-buy').classList.add('hidden');renderPlayers();hostBcast();
}

function endTurn(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){cliSend('endTurn');return;}
  ['btn-buy','btn-pass','btn-pay-jail'].forEach(function(id){document.getElementById(id).classList.add('hidden');});
  dis('btn-roll',false);document.getElementById('dice-total').textContent='';
  var p=curPlayer();
  if(G.lastDice[0]===G.lastDice[1]&&G.doublesCount>0&&!p.inJail){G.phase='rolling';log(p.name+' rolled doubles — roll again!','important');renderTurnInfo();syncActionButtons();hostBcast();return;}
  nextTurn();
}

function nextTurn(){
  G.lastDice=[0,0];
  document.getElementById('die1').textContent='·';document.getElementById('die2').textContent='·';
  ['btn-buy','btn-pass','btn-pay-jail'].forEach(function(id){document.getElementById(id).classList.add('hidden');});
  dis('btn-roll',false);
  var next=(G.current+1)%G.players.length,loops=0;
  while(G.players[next].bankrupt&&loops<G.players.length){next=(next+1)%G.players.length;loops++;}
  G.current=next;G.phase='rolling';G.doublesCount=0;
  renderAll();
  log('— '+curPlayer().name+"'s turn —",'important');
  showTurnToast(curPlayer());
  hostBcast();
}

function sendToJail(player){player.pos=10;player.inJail=true;player.jailTurns=0;renderTokens();log(player.name+' is sent to JAIL!','bad');}

// ── CARDS ─────────────────────────────────────────────────────
var pendingCardAction=null;

function drawCard(type,player){
  var deck=type==='chance'?G.chanceDeck:G.communityDeck;
  var card=deck.shift();deck.push(card);

  var label=document.getElementById('card-type-label');
  label.textContent=type==='chance'?'Chance':'Et Si?';
  label.className='card-type-label '+(type==='chance'?'chance':'community');
  document.getElementById('card-title-display').textContent='';

  var spriteEl=document.getElementById('card-sprite-display');
  var textEl  =document.getElementById('card-popup-text');

  var si = type==='chance' ? CHANCE_SPRITE_IDX[CHANCE_CARDS.indexOf(card)] : COMMUNITY_SPRITE_IDX[COMMUNITY_CARDS.indexOf(card)];

  if(si !== null && si !== undefined) {
    var pos = ACTION_SPRITE.pos(si);
    // Fit within ~460px popup width (accounting for 64px padding)
    var maxW = Math.min(460, window.innerWidth * 0.8 - 64);
    var scale = Math.min(2, maxW / ACTION_SPRITE.cardW);
    spriteEl.style.cssText =
      'display:block;' +
      'width:'  + Math.round(ACTION_SPRITE.cardW  * scale) + 'px;' +
      'height:' + Math.round(ACTION_SPRITE.cardH  * scale) + 'px;' +
      'background-image:url("' + ACTION_SPRITE.file + '");' +
      'background-size:'  + Math.round(ACTION_SPRITE.sheetW * scale) + 'px ' + Math.round(ACTION_SPRITE.sheetH * scale) + 'px;' +
      'background-position:' + Math.round(pos.x * scale) + 'px ' + Math.round(pos.y * scale) + 'px;' +
      'background-repeat:no-repeat;' +
      'margin:0 auto;' +
      'border-radius:6px;';
    textEl.style.display = 'none';
  } else {
    spriteEl.style.display='none';
    textEl.style.display='block';
    textEl.textContent=card.text;
  }

  var popup=document.getElementById('card-popup');
  popup.classList.remove('hidden');
  var inner=document.getElementById('card-popup-inner');
  inner.classList.remove('card-flip');void inner.offsetWidth;inner.classList.add('card-flip');

  var p=player;
  pendingCardAction=function(){card.action(p);showPostMove(p);};
  hostBcast();
}

function dismissCard(){
  document.getElementById('card-popup').classList.add('hidden');
  if(pendingCardAction){pendingCardAction();pendingCardAction=null;}
  renderAll();hostBcast();
}

// ── PROPERTY CARD POPUP ───────────────────────────────────────
function showPropertyCard(sqId) {
  var si = PROP_SPRITE.map[sqId];
  if (si === undefined) return;
  var pos = PROP_SPRITE.pos(si);
  var scale = 2.5;
  var W = Math.round(PROP_SPRITE.cardW * scale);
  var H = Math.round(PROP_SPRITE.cardH * scale);

  // Create/reuse overlay
  var overlay = document.getElementById('prop-card-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'prop-card-modal';
    overlay.onclick = function() { overlay.classList.add('hidden'); };
    document.body.appendChild(overlay);
  }
  var inner = document.getElementById('prop-card-inner') || (function(){var d=document.createElement('div');d.id='prop-card-inner';overlay.appendChild(d);return d;})();
  var sprite = document.getElementById('prop-card-svg-sprite') || (function(){var d=document.createElement('div');d.id='prop-card-svg-sprite';inner.appendChild(d);return d;})();

  var hint = inner.querySelector('.prop-card-hint');
  if (!hint) { hint=document.createElement('div');hint.className='prop-card-hint';hint.textContent='Click anywhere to close';inner.appendChild(hint); }

  sprite.style.cssText = 'width:'+W+'px;height:'+H+'px;'+
    'background-image:url("'+PROP_SPRITE.file+'");'+
    'background-size:'+(PROP_SPRITE.sheetW*scale)+'px '+(PROP_SPRITE.sheetH*scale)+'px;'+
    'background-position:'+(pos.x*scale)+'px '+(pos.y*scale)+'px;'+
    'background-repeat:no-repeat;border-radius:8px;box-shadow:0 12px 48px rgba(0,0,0,.4);';

  overlay.classList.remove('hidden');
}

// ── RULES ─────────────────────────────────────────────────────
function openRules() { showModal(RULES_HTML); }

// ── MODAL: PROPERTIES ─────────────────────────────────────────
function openProperties(){
  var gc={'brown':'#7B3F1A','light-blue':'#6bbfd4','pink':'#e05a8a','orange':'#e07820','red':'#cc2020','yellow':'#d4aa00','green':'#2a8040','dark-blue':'#1a3a8a','station':'#555','utility':'#888'};
  var skip={go:1,tax:1,jail:1,gotojail:1,parking:1,chance:1,community:1};
  var groups={};
  SQUARES.forEach(function(sq){if(!sq.group||skip[sq.type])return;if(!groups[sq.group])groups[sq.group]=[];groups[sq.group].push(sq);});
  var html='<h2>Properties</h2><p style="font-size:11px;color:var(--text3);margin-bottom:12px;border:none;padding:0">Click any property to see its deed card.</p>';
  Object.keys(groups).forEach(function(g){
    html+='<div class="prop-group"><div class="prop-group-title">'+g.toUpperCase()+'</div>';
    groups[g].forEach(function(sq){
      var prop=G.properties[sq.id],owner=prop?G.players[prop.owner]:null,h=prop?prop.houses:0;
      var hs=h===0?'':(h===5?'Hotel':'×'+h);
      html+='<div class="prop-item" style="border-left-color:'+(gc[g]||'#aaa')+'" onclick="showPropertyCard('+sq.id+')">'+
        '<span>'+sq.name+'</span>'+
        '<span>'+(owner?'<span class="prop-owner">'+owner.token+' '+owner.name+'</span>':'')+
        (hs?'<span class="prop-houses"> '+hs+'</span>':'')+'</span></div>';
    });
    html+='</div>';
  });
  showModal(html);
}

// ── MODAL: TRADE ──────────────────────────────────────────────
function openTrade(){
  var p=curPlayer(),others=G.players.filter(function(o){return !o.bankrupt&&o!==p;});
  if(!others.length){showModal('<h2>No other active players to trade with!</h2>');return;}
  var html='<h2>Trade</h2>'+
    '<div class="trade-section"><label>Trade with</label><select id="trade-partner">'+
    others.map(function(o){return '<option value="'+G.players.indexOf(o)+'">'+o.token+' '+o.name+'</option>';}).join('')+'</select></div>'+
    '<div class="trade-section"><label>You offer ('+M+')</label><input type="number" id="trade-offer-money" value="0" min="0" max="'+p.money+'"/></div>'+
    '<div class="trade-section"><label>Your properties to give</label><div class="trade-checkboxes">'+
    (p.properties.length?p.properties.map(function(id){return '<label><input type="checkbox" class="trade-give-prop" value="'+id+'"> '+SQUARES[id].name+'</label>';}).join(''):'<span style="color:var(--text3)">None</span>')+
    '</div></div>'+
    '<div class="trade-section"><label>You receive ('+M+')</label><input type="number" id="trade-recv-money" value="0" min="0"/></div>'+
    '<div class="trade-section"><label>Their properties to receive</label><div class="trade-checkboxes" id="trade-recv-props"></div></div>'+
    '<div class="modal-actions"><button class="btn-action" onclick="executeTrade()">Confirm Trade</button><button class="btn-action secondary" onclick="closeModalForce()">Cancel</button></div>';
  showModal(html);
  function upd(){var pi=parseInt(document.getElementById('trade-partner').value,10),partner=G.players[pi];
    document.getElementById('trade-recv-props').innerHTML=partner.properties.length?partner.properties.map(function(id){return '<label><input type="checkbox" class="trade-recv-prop" value="'+id+'"> '+SQUARES[id].name+'</label>';}).join(''):'<span style="color:var(--text3)">None</span>';}
  upd();document.getElementById('trade-partner').addEventListener('change',upd);
}
function executeTrade(td,fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){
    var td2={pi:parseInt(document.getElementById('trade-partner').value,10),om:parseInt(document.getElementById('trade-offer-money').value,10)||0,rm:parseInt(document.getElementById('trade-recv-money').value,10)||0,
      gp:[].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){return parseInt(e.value,10);}),
      rp:[].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){return parseInt(e.value,10);})};
    cliSend('trade',{td:td2});closeModalForce();return;
  }
  var t=td||{pi:parseInt(document.getElementById('trade-partner').value,10),om:parseInt(document.getElementById('trade-offer-money').value,10)||0,rm:parseInt(document.getElementById('trade-recv-money').value,10)||0,
    gp:[].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){return parseInt(e.value,10);}),
    rp:[].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){return parseInt(e.value,10);})};
  var p=curPlayer(),partner=G.players[t.pi];
  if(t.om>p.money){alert(p.name+" doesn't have "+fmt(t.om)+'!');return;}
  if(t.rm>partner.money){alert(partner.name+" doesn't have "+fmt(t.rm)+'!');return;}
  p.money-=t.om;partner.money+=t.om;partner.money-=t.rm;p.money+=t.rm;
  t.gp.forEach(function(id){G.properties[id].owner=t.pi;p.properties=p.properties.filter(function(x){return x!==id;});partner.properties.push(id);});
  t.rp.forEach(function(id){G.properties[id].owner=G.current;partner.properties=partner.properties.filter(function(x){return x!==id;});p.properties.push(id);});
  log('Trade: '+p.name+' ↔ '+partner.name,'important');closeModalForce();renderAll();hostBcast();
}

// ── MODAL: BUILD ──────────────────────────────────────────────
function openBuildMenu(){
  var p=curPlayer();
  var buildable=p.properties.filter(function(id){
    var sq=SQUARES[id];if(!sq.group||sq.type!=='property')return false;
    return (COLOR_GROUPS[sq.group]||[]).every(function(gid){return G.properties[gid]&&G.properties[gid].owner===G.current;});
  });
  if(!buildable.length){showModal('<h2>Build Houses</h2><p>Own a complete colour set to build. No complete sets yet.</p>');return;}
  var html='<h2>Build Houses / Hotels</h2>';
  buildable.forEach(function(id){
    var sq=SQUARES[id],prop=G.properties[id],cost=HOUSE_COST[sq.group]||100,h=prop.houses;
    var hl=h===0?'None':(h===5?'Hotel':h+' House'+(h>1?'s':''));
    html+='<div class="build-row"><div><strong>'+sq.name+'</strong><br><small style="color:var(--text3)">'+fmt(cost)+' each</small></div>'+
      '<div class="build-controls"><button class="build-btn" onclick="buildHouse('+id+',-1)">−</button>'+
      '<span class="house-display">'+hl+'</span>'+
      '<button class="build-btn" onclick="buildHouse('+id+',1)">+</button></div></div>';
  });
  html+='<div class="modal-actions"><button class="btn-action secondary" onclick="closeModalForce()">Close</button></div>';
  showModal(html);
}
function buildHouse(id,dir,fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){cliSend('build',{sid:id,dir:dir});return;}
  var p=curPlayer(),sq=SQUARES[id],prop=G.properties[id],cost=HOUSE_COST[sq.group]||100;
  if(dir===1){if(prop.houses>=5)return;if(p.money<cost){log('Not enough money!','bad');return;}charge(p,cost);prop.houses++;playSound('buy');log(p.name+' builds on '+sq.name,'good');}
  else{if(prop.houses<=0)return;var ref=Math.floor(cost/2);prop.houses--;collect(p,ref);}
  renderAll();openBuildMenu();hostBcast();
}

// ── MODAL UTILS ───────────────────────────────────────────────
function showModal(html){document.getElementById('modal-content').innerHTML=html;document.getElementById('modal-overlay').classList.remove('hidden');}
function closeModal(e){if(e.target===document.getElementById('modal-overlay'))closeModalForce();}
function closeModalForce(){document.getElementById('modal-overlay').classList.add('hidden');}

// ── WINNER ────────────────────────────────────────────────────
function showWinner(player){
  var d=document.createElement('div');d.id='winner-banner';
  d.innerHTML='<div id="winner-inner"><div class="w-emoji">'+player.token+'</div><h1>'+player.name+' wins!</h1><p>'+fmt(player.money)+' in the bank · '+player.properties.length+' properties</p><button class="btn-action" style="justify-content:center" onclick="location.reload()">Play Again ♥</button></div>';
  document.body.appendChild(d);
}

// ── RENDER ────────────────────────────────────────────────────
function renderAll(){renderPlayers();renderTokens();renderTurnInfo();updateBank();syncActionButtons();}

function renderPlayers(){
  var panel=document.getElementById('players-panel');panel.innerHTML='<div class="panel-title">Players</div>';
  G.players.forEach(function(p,i){
    var d=document.createElement('div');
    d.className='player-card'+(i===G.current?' active-turn':'')+(p.bankrupt?' bankrupt':'');
    d.innerHTML='<div class="player-token-name"><span style="font-size:16px">'+p.token+'</span><span>'+p.name+'</span></div>'+
      '<div class="player-money">'+fmt(p.money)+'</div>'+
      '<div class="player-props">'+p.properties.length+' propert'+(p.properties.length===1?'y':'ies')+'</div>'+
      (p.inJail?'<div class="player-jail-badge">In Jail</div>':'');
    panel.appendChild(d);
  });
}
function renderTurnInfo(){
  var p=curPlayer();
  document.getElementById('current-player-name').textContent=p.token+' '+p.name+"'s turn";
  document.getElementById('current-player-money').textContent=fmt(p.money);
  dis('btn-roll',G.phase!=='rolling');
}
function updateBank(){document.getElementById('bank-display').innerHTML='Free Parking pot: '+fmt(G.freeParkingPot);}

function renderTokens(){
  var layer=document.getElementById('tokens-layer'),cont=document.getElementById('board-container');
  var W=cont.offsetWidth,H=cont.offsetHeight;
  layer.innerHTML='';
  G.players.forEach(function(p,i){
    if(p.bankrupt)return;
    var sq=SQUARES[p.pos],pos=sq.pos;
    var same=G.players.slice(0,i).filter(function(pp){return !pp.bankrupt&&pp.pos===p.pos;}).length;
    var ox=(same%3-1)*13,oy=Math.floor(same/3)*16;
    var el=document.createElement('div');el.className='token';
    el.style.left=(pos[0]*W+ox)+'px';el.style.top=(pos[1]*H+oy)+'px';
    el.innerHTML='<div class="token-bubble" style="--tc:'+p.color+'">'+p.token+'</div>'+
      '<div class="token-name-tag" style="--tc:'+p.color+'">'+p.name.split(' ')[0]+'</div>';
    el.title=p.name;layer.appendChild(el);
  });
}

// ── BOARD SIZING ──────────────────────────────────────────────
function sizeBoard(){
  var wrap=document.getElementById('board-wrap'),cont=document.getElementById('board-container');
  var avail=Math.min(wrap.clientWidth-24,wrap.clientHeight-24);
  cont.style.width=avail+'px';cont.style.height=avail+'px';
  renderTokens();
}
window.addEventListener('resize',sizeBoard);

// ── INIT ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded',function(){initSetup();setTimeout(sizeBoard,120);});