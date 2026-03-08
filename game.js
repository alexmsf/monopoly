var M = '₩';
function fmt(n) { return M + n.toLocaleString(); }

// ── SPRITE DATA ──────────────────────────────────────────────
var ACTION_SPRITE = {
  file: 'final-action-cards.svg',
  sheetW: 1220, sheetH: 1099,
  cardW: 244, cardH: 157, cols: 5,
  pos: function(idx) {
    var c = idx % 5, r = Math.floor(idx / 5);
    return { x: -(c * 244), y: -(r * 157) };
  }
};

var PROP_SPRITE = {
  file: 'final-property-cards.svg',
  sheetW: 1099, sheetH: 976,
  cardW: 157, cardH: 244, cols: 7,
  map: {1:0,3:1,6:2,8:3,9:4,5:5,15:6,11:7,13:8,14:9,16:10,18:11,19:12,25:13,21:14,23:15,24:16,26:17,27:18,29:19,35:20,31:21,32:22,34:23,37:24,39:25,12:26,28:27},
  pos: function(idx) {
    var c = idx % 7, r = Math.floor(idx / 7);
    return { x: -(c * 157), y: -(r * 244) };
  }
};

var CHANCE_SPRITE_IDX    = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var COMMUNITY_SPRITE_IDX = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];

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
  {id:19, name:'Appolonia',                type:'property', price:200, color:'#e07820', group:'orange'},
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
var GROUP_COLORS = {
  'brown':'#7B3F1A','light-blue':'#6bbfd4','pink':'#e05a8a','orange':'#e07820',
  'red':'#cc2020','yellow':'#d4aa00','green':'#2a8040','dark-blue':'#1a3a8a',
  'station':'#555','utility':'#888'
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
  {title:'ET SI? — Premier rendez-vous.',    si:19, text:'Pasta de la Mama, un soir de semaine, et tout a change.\n\nCOLLECT '+M+'200. BEST INVESTMENT EVER.',             action:function(p){collect(p,200);showFX('collect');}},
  {title:'ET SI? — Rester au lit.',          si:20, text:'Et si on restait au lit? Bonne idee.\n\nSKIP YOUR NEXT TURN.',                                                   action:function(p){p.skipTurns=(p.skipTurns||0)+1;showFX('skip');}},
  {title:'ET SI? — Porto.',                  si:21, text:'Et si on allait a Porto?\nVOL TROUVE, VALISE FAITE.\n\nCOLLECT '+M+'100.',                                       action:function(p){collect(p,100);showFX('collect');}},
  {title:'ET SI? — Brunch.',                 si:22, text:'Et si on faisait un brunch?\nCHA BOTE, DIMANCHE, SOLEIL.\n\nCOLLECT '+M+'50.',                                   action:function(p){collect(p,50);showFX('collect');}},
  {title:'ET SI? — Heritage de mamie.',      si:23, text:"ELLE T'A LAISSE UN BOCAL D'HUILE D'OLIVE ET UNE GLACE.\n\n"+M+'80 ARE YOURS TO COLLECT.',                       action:function(p){collect(p,80);showFX('collect');}},
  {title:'ET SI? — Quiz ce soir.',           si:24, text:'LA FOURMILLIERE, VOUS GAGNEZ (EVIDEMMENT).\n\nCOLLECT '+M+'25 FROM EACH PLAYER.',                               action:function(p){collectFromAll(p,25);showFX('collect');}},
  {title:'ET SI? — Chocolat viennois.',      si:25, text:'Cafe Kanter, apres le taf, vous etes seuls au monde.\n\nCOLLECT '+M+'20.',                                       action:function(p){collect(p,20);showFX('collect');}},
  {title:'ET SI? — Un film.',                si:26, text:'Soiree canape. Trop bien.\n\nAdvance to Chez toi — no rent charged this turn.',                                   action:function(p){p.freeRentThisTurn=true;log(p.name+' — free rent this turn!','important');}},
  {title:'ET SI? — Petit falafel.',          si:27, text:"NOTRE COIN CACHE. COMME D'HAB.\n\nGET "+M+'30.',                                                                  action:function(p){collect(p,30);showFX('collect');}},
  {title:'ET SI? — Reparations imprevues.',  si:28, text:"SOMETHING BROKE. (we won't point fingers)\n\nPAY "+M+'100 TO THE BANK.',                                         action:function(p){charge(p,100);showFX('pay');}},
  {title:'ET SI? — Bloc Party.',             si:29, text:'Samedi matin. CLIMBING, LUNCH, THE WHOLE RITUAL.\n\nGET '+M+'40.',                                               action:function(p){collect(p,40);showFX('collect');}},
  {title:"ET SI? — Nuit a l'aeroport.",      si:30, text:'Il veille sur toi pendant que tu dors.\n\nPRICELESS. REMEMBER THIS THO.',                                        action:function(p){log(p.name+' — precious moment 💙','good');}},
  {title:'ET SI? — Serenade involontaire.',  si:31, text:"T'as chante en cuisine sans t'en rendre compte.\n0 mais tout le monde sourit.",                                   action:function(p){log(p.name+' — everyone smiles 🎵','good');}},
  {title:'ET SI? — Voir la mer.',            si:32, text:"Il est peut-etre 3h du matin, mais tu n'es pas pret a rentrer.\n\nCOLLECT "+M+'60.',                             action:function(p){collect(p,60);showFX('collect');}},
  {title:'ET SI? — Sortie culturelle.',      si:33, text:'Sagrada Familia, il etait temps.\n\nADVANCE TO SAGRADA FAMILIA.',                                                 action:function(p){advanceTo(p,32);}},
  {title:'ET SI? — Frais medicaux.',         si:34, text:'Trop de viennoiseries.\n\nPAY '+M+'100. A REFAIRE TOUT DE MEME.',                                                action:function(p){charge(p,100);showFX('pay');}}
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

// ── AUDIO ENGINE ─────────────────────────────────────────────
var _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}
function makeOsc(ctx, type, freq, gainVal, start, stop) {
  var o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.0001, stop);
  o.connect(g); g.connect(ctx.destination);
  o.start(start); o.stop(stop);
  return {o:o, g:g};
}
function makeNoise(ctx, gainVal, start, stop, hipass) {
  var buf = ctx.createBuffer(1, ctx.sampleRate * (stop-start), ctx.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < d.length; i++) d[i] = Math.random()*2-1;
  var src = ctx.createBufferSource();
  src.buffer = buf;
  var flt = ctx.createBiquadFilter();
  flt.type = hipass ? 'highpass' : 'bandpass';
  flt.frequency.value = hipass ? 800 : 300;
  flt.Q.value = 1;
  var g = ctx.createGain();
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.0001, stop);
  src.connect(flt); flt.connect(g); g.connect(ctx.destination);
  src.start(start); src.stop(stop);
}

// ── MUSIC PLAYER (disabled) ──────────────────────────────────
function initMusicPlayer() {}
function startMusic() {}
function stopMusic() {}
function setMusicVolume() {}
function updateMusicUI() {}
function toggleMusic() {}
function toggleSpotifyFixed() {}

function playSound(type) {
  try {
    var ctx = getAudioCtx(), now = ctx.currentTime;
    if (type === 'dice-rattle') {
      for (var i = 0; i < 6; i++) makeNoise(ctx, 0.12 - i*0.01, now + i*0.055, now + i*0.055 + 0.045, true);
    } else if (type === 'dice-land') {
      makeNoise(ctx, 0.18, now, now + 0.07, false);
      makeOsc(ctx, 'sine', 90, 0.12, now, now + 0.12);
    } else if (type === 'dice') {
      for (var j = 0; j < 5; j++) makeNoise(ctx, 0.1 - j*0.01, now + j*0.05, now + j*0.05 + 0.04, true);
      makeNoise(ctx, 0.18, now + 0.28, now + 0.34, false);
      makeOsc(ctx, 'sine', 90, 0.1, now + 0.28, now + 0.38);
    } else if (type === 'step') {
      makeNoise(ctx, 0.04, now, now + 0.03, true);
      makeOsc(ctx, 'sine', 320, 0.025, now, now + 0.04);
    } else if (type === 'land-property') {
      makeOsc(ctx, 'sine', 523, 0.07, now, now + 0.22);
      makeOsc(ctx, 'sine', 659, 0.05, now + 0.06, now + 0.28);
    } else if (type === 'land-special') {
      [523, 659, 784, 1047].forEach(function(f, k) { makeOsc(ctx, 'sine', f, 0.07, now + k*0.07, now + k*0.07 + 0.18); });
    } else if (type === 'land-tax') {
      [330, 262, 196].forEach(function(f, k) { makeOsc(ctx, 'sawtooth', f, 0.06, now + k*0.09, now + k*0.09 + 0.2); });
    } else if (type === 'collect') {
      [659, 784, 1047].forEach(function(f, k) { makeOsc(ctx, 'sine', f, 0.07, now + k*0.06, now + k*0.06 + 0.18); });
      makeNoise(ctx, 0.04, now, now + 0.08, true);
    } else if (type === 'pay') {
      [330, 277, 220].forEach(function(f, k) { makeOsc(ctx, 'triangle', f, 0.07, now + k*0.08, now + k*0.08 + 0.2); });
    } else if (type === 'buy') {
      [523, 659, 784, 1047].forEach(function(f, k) { makeOsc(ctx, 'sine', f, 0.08, now + k*0.08, now + k*0.08 + 0.25); });
    } else if (type === 'build') {
      makeNoise(ctx, 0.15, now, now + 0.06, false);
      makeOsc(ctx, 'sine', 880, 0.08, now + 0.05, now + 0.22);
      makeOsc(ctx, 'sine', 1108, 0.05, now + 0.12, now + 0.28);
    } else if (type === 'sell-house') {
      makeOsc(ctx, 'sine', 660, 0.06, now, now + 0.15);
      makeOsc(ctx, 'sine', 494, 0.05, now + 0.08, now + 0.22);
    } else if (type === 'jail') {
      makeOsc(ctx, 'square', 220, 0.09, now, now + 0.18);
      makeOsc(ctx, 'square', 180, 0.07, now + 0.1, now + 0.3);
      makeOsc(ctx, 'square', 140, 0.06, now + 0.2, now + 0.5);
      makeNoise(ctx, 0.1, now, now + 0.15, false);
    } else if (type === 'card') {
      makeNoise(ctx, 0.07, now, now + 0.12, true);
      makeOsc(ctx, 'sine', 660, 0.06, now + 0.08, now + 0.28);
    } else if (type === 'go') {
      [523, 659, 784, 659, 1047].forEach(function(f, k) { makeOsc(ctx, 'sine', f, 0.08, now + k*0.09, now + k*0.09 + 0.22); });
    } else if (type === 'bankrupt') {
      [311, 277, 233, 196].forEach(function(f, k) { makeOsc(ctx, 'sawtooth', f, 0.06, now + k*0.12, now + k*0.12 + 0.28); });
    } else if (type === 'confetti') {
      [784, 1047, 1319, 1568].forEach(function(f, k) { makeOsc(ctx, 'sine', f, 0.09, now + k*0.07, now + k*0.07 + 0.25); });
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

// ── MONEY FLOAT ──────────────────────────────────────────────
function showMoneyFloat(playerIndex, amount, isGain) {
  var panel = document.getElementById('players-panel');
  var cards = panel.querySelectorAll('.player-card');
  var card = cards[playerIndex];
  if (!card) return;
  var rect = card.getBoundingClientRect();
  var el = document.createElement('div');
  el.className = 'money-float ' + (isGain ? 'gain' : 'loss');
  el.textContent = (isGain ? '+' : '-') + fmt(Math.abs(amount));
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 1100);
}

// ── TURN TOAST ───────────────────────────────────────────────
function showTurnToast(player) {
  var toast = document.getElementById('turn-toast');
  toast.textContent = player.token + ' ' + player.name + "'s turn!";
  toast.classList.remove('hidden');
  setTimeout(function() { toast.classList.add('hidden'); }, 2200);
}

// ── RENT DUE POPUP ───────────────────────────────────────────
function showRentPopup(payer, owner, rent, sqName, callback) {
  var overlay = document.getElementById('rent-popup-overlay');
  if (!overlay) { callback(); return; }
  document.getElementById('rent-popup-sq').textContent = sqName;
  document.getElementById('rent-popup-owner').textContent = owner.token + ' ' + owner.name;
  document.getElementById('rent-popup-amount').textContent = fmt(rent);
  overlay.classList.remove('hidden');
  // auto-dismiss after 2.5s or on click
  var done = false;
  function dismiss() {
    if (done) return; done = true;
    overlay.classList.add('hidden');
    callback();
  }
  overlay.onclick = dismiss;
  setTimeout(dismiss, 2500);
}

// ── CONFETTI ─────────────────────────────────────────────────
function launchConfetti() {
  playSound('confetti');
  var colors = ['#c5703a','#3a62a0','#3a7c55','#d4aa00','#e05a8a','#cc2020','#7b4fbf'];
  for (var i = 0; i < 80; i++) {
    (function() {
      var el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = (20 + Math.random() * 60) + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width  = (6 + Math.random() * 8) + 'px';
      el.style.height = (6 + Math.random() * 8) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      el.style.animationDuration = (0.9 + Math.random() * 1.4) + 's';
      el.style.animationDelay = (Math.random() * 0.5) + 's';
      document.body.appendChild(el);
      setTimeout(function() { el.remove(); }, 2500);
    })();
  }
}

// ── TOKENS & COLORS ──────────────────────────────────────────
var TOKEN_EMOJIS = ['🧸','🎮','🦖','🔥','🦄','🛸'];
var TOKEN_COLORS = ['#c23b2e','#3a62a0','#3a7c55','#c5703a','#7b4fbf','#1a9090'];

// ── GAME STATE ───────────────────────────────────────────────
var G = {
  players:[], current:0, phase:'rolling',
  properties:{}, chanceDeck:[], communityDeck:[],
  freeParkingPot:0, doublesCount:0, lastDice:[0,0],
  round:0, turnTimer:null, turnTimeLeft:0, turnTimerEnabled:false, turnTimerSeconds:60,
  stats:{ rentPaid:[], biggestTx:[], doublesRolled:[] }
};

// ── MULTIPLAYER (PeerJS) ─────────────────────────────────────
var MP = { mode:'local', peer:null, myPeerId:null, connections:[], myPlayerIndex:-1, roomCode:null };
var remoteSetupPlayers = [];
var myReady = false;
var broadcastTimer = null;

function genRoomCode() {
  var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
  for (var i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}
function mpEnabled() { return MP.mode !== 'local'; }
function isMyTurn()  { return !mpEnabled() || G.current === MP.myPlayerIndex; }
function mpSendAll(msg) { MP.connections.forEach(function(c){ try{ if(c.open) c.send(msg); }catch(e){} }); }

function mpOnData(data) {
  if (data.type === 'state') {
    applyRemoteState(data.state);
  } else if (data.type === 'action' && MP.mode === 'host') {
    handleRemoteAction(data);
  } else if (data.type === 'player_joined') {
    log(data.name + ' joined!', 'good');
    updateMpBar();
    var p = setupPlayers[0];
    var reply = { type:'setup_player', name: p ? p.name : 'Host', tokenIdx: p ? p.tokenIdx : 0, ready: myReady, peerId: MP.myPeerId || 'host' };
    mpSendAll(reply);
    if (MP.connections.length > 0) try { MP.connections[0].send(reply); } catch(e) {}
  } else if (data.type === 'setup_player') {
    if (!data.peerId || data.peerId === (MP.myPeerId || 'unknown')) return;
    var idx = remoteSetupPlayers.findIndex(function(rp) { return rp.peerId === data.peerId; });
    var entry = { name: data.name, tokenIdx: data.tokenIdx, ready: data.ready || false, peerId: data.peerId };
    if (idx >= 0) remoteSetupPlayers[idx] = entry;
    else remoteSetupPlayers.push(entry);
    renderSetup();
  }
}

function broadcastMyName() {
  clearTimeout(broadcastTimer);
  broadcastTimer = setTimeout(function() {
    if (!MP.myPeerId) return;
    var p = setupPlayers[0];
    var msg = { type: 'setup_player', name: p ? p.name : 'Guest', tokenIdx: p ? p.tokenIdx : 0, ready: myReady, peerId: MP.myPeerId };
    mpSendAll(msg);
    if (MP.mode === 'client' && MP.connections.length > 0) try { MP.connections[0].send(msg); } catch(e) {}
  }, 400);
}

function toggleReady() { myReady = !myReady; broadcastMyName(); renderSetup(); }

function applyRemoteState(s) {
  G.players = s.players; G.current = s.current; G.phase = s.phase; G.properties = s.properties;
  G.freeParkingPot = s.freeParkingPot; G.doublesCount = s.doublesCount; G.lastDice = s.lastDice;
  G.round = s.round || 0;
  G.chanceDeck   = s.co.map(function(i){ return CHANCE_CARDS[i]; });
  G.communityDeck = s.mo.map(function(i){ return COMMUNITY_CARDS[i]; });
  if (s.lastDice[0]) {
    document.getElementById('die1').textContent = s.lastDice[0];
    document.getElementById('die2').textContent = s.lastDice[1];
    document.getElementById('dice-total').textContent = 'Total: ' + (s.lastDice[0] + s.lastDice[1]);
  }
  renderAll(); updateMpBar(); syncActionButtons();
}

function serializeState() {
  return {
    players: G.players, current: G.current, phase: G.phase, properties: G.properties,
    freeParkingPot: G.freeParkingPot, doublesCount: G.doublesCount, lastDice: G.lastDice,
    round: G.round,
    co: G.chanceDeck.map(function(c){ return CHANCE_CARDS.indexOf(c); }),
    mo: G.communityDeck.map(function(c){ return COMMUNITY_CARDS.indexOf(c); })
  };
}

function hostBcast() { if (MP.mode === 'host') mpSendAll({type:'state', state:serializeState()}); }

function handleRemoteAction(data) {
  if (data.playerIndex !== G.current) return;
  switch (data.action) {
    case 'roll':    rollDice(true); break;
    case 'buy':     buyProperty(true); break;
    case 'endTurn': endTurn(true); break;
    case 'payJail': payJail(true); break;
    case 'build':   buildHouse(data.sid, data.dir, true); break;
    case 'trade':   executeTrade(data.td, true); break;
  }
}

function cliSend(action, extra) {
  if (!MP.connections.length) return;
  var msg = Object.assign({type:'action', action:action, playerIndex:MP.myPlayerIndex}, extra || {});
  try { MP.connections[0].send(msg); } catch(e) {}
}

function syncActionButtons() {
  var my = isMyTurn(), rolling = G.phase === 'rolling';
  dis('btn-roll', !my || !rolling); dis('btn-buy', !my); dis('btn-pass', !my); dis('btn-pay-jail', !my);
  var yt = document.getElementById('mp-your-turn');
  if (mpEnabled()) yt.classList.toggle('hidden', !my || !rolling);
}

function dis(id, v) { var e = document.getElementById(id); if (e) e.disabled = v; }

function updateMpBar() {
  if (!mpEnabled()) return;
  var open = MP.connections.filter(function(c){ return c.open; }).length;
  document.getElementById('mp-dot').className = 'mp-dot' + (open > 0 ? '' : ' off');
  document.getElementById('mp-peers-info').textContent = (open + 1) + ' player' + (open > 0 ? 's' : '') + ' connected';
  syncActionButtons();
}

// ── SETUP ────────────────────────────────────────────────────
var setupPlayers = [], mpTab = 'local';

function initSetup() {
  setupPlayers = [{name:'Player 1', tokenIdx:0}, {name:'Player 2', tokenIdx:1}];
  renderSetup();
  initPeer();
}

function initPeer() {
  MP.roomCode = genRoomCode();
  try {
    MP.peer = new Peer('mnply-' + MP.roomCode.toLowerCase());
    MP.peer.on('open', function(id) {
      MP.myPeerId = id;
      document.getElementById('host-code').textContent = MP.roomCode;
      document.getElementById('host-status').textContent = 'Share this code — waiting for players...';
    });
    MP.peer.on('connection', function(conn) {
      var remotePeerId = conn.peer;
      conn.on('open', function() {
        remoteSetupPlayers = remoteSetupPlayers.filter(function(p){ return p.peerId !== remotePeerId; });
        MP.connections.push(conn);
        log('A player joined!', 'good');
        if (G.players.length > 0) hostBcast();
        updateMpBar();
        var p = setupPlayers[0];
        conn.send({ type:'setup_player', name: p ? p.name : 'Host', tokenIdx: p ? p.tokenIdx : 0, ready: myReady, peerId: MP.myPeerId });
      });
      conn.on('data', function(data) { data.peerId = remotePeerId; mpOnData(data); });
      conn.on('close', function() {
        MP.connections = MP.connections.filter(function(c){ return c !== conn; });
        remoteSetupPlayers = remoteSetupPlayers.filter(function(p){ return p.peerId !== remotePeerId; });
        log('A player disconnected.', 'bad');
        updateMpBar(); renderSetup();
      });
    });
    MP.peer.on('error', function(err) {
      if (err.type === 'unavailable-id') { MP.peer.destroy(); setTimeout(initPeer, 400); }
      else document.getElementById('host-status').textContent = 'Error: ' + err.message;
    });
  } catch(e) { console.warn('PeerJS:', e); }
}

function selectMpTab(tab) {
  mpTab = tab;
  ['local','host','join'].forEach(function(t) {
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
    document.getElementById('panel-' + t).classList.toggle('active', t === tab);
  });
  if (tab === 'host' || tab === 'join') {
    if (setupPlayers.length > 1) setupPlayers = [setupPlayers[0]];
  } else {
    if (setupPlayers.length < 2) setupPlayers.push({name:'Player 2', tokenIdx:1});
  }
  renderSetup();
}

function joinRoom() {
  var code = document.getElementById('join-code-input').value.trim().toUpperCase();
  if (!code || code.length < 3) { setJS('Enter a valid room code.', true); return; }
  if (!MP.peer) { setJS('Not ready yet.', true); return; }
  setJS('Connecting to ' + code + '...');
  var conn = MP.peer.connect('mnply-' + code.toLowerCase(), {reliable: true});
  var hostPeerId = 'mnply-' + code.toLowerCase();
  conn.on('open', function() {
    MP.mode = 'client'; MP.connections = [conn]; MP.myPlayerIndex = 1;
    setJS('Connected! Waiting for host...', false, true);
    function sendJoin() {
      if (!MP.myPeerId) { setTimeout(sendJoin, 100); return; }
      var p = setupPlayers[0];
      conn.send({ type:'setup_player', name: p ? p.name : 'Guest', tokenIdx: p ? p.tokenIdx : 0, ready: myReady, peerId: MP.myPeerId });
    }
    sendJoin();
  });
  conn.on('data', function(data) {
    if (data.type === 'setup_player' || data.type === 'player_joined') data.peerId = conn.peer;
    mpOnData(data);
    if (data.type === 'state' && document.getElementById('setup-screen').classList.contains('active')) launchGame();
  });
  conn.on('error', function() { setJS('Could not connect. Check the code.', true); });
  conn.on('close', function() {
    remoteSetupPlayers = remoteSetupPlayers.filter(function(p){ return p.peerId !== hostPeerId; });
    log('Disconnected.', 'bad'); updateMpBar(); renderSetup();
  });
  setTimeout(function() { if (!conn.open) setJS('Could not reach that room.', true); }, 7000);
}

function setJS(m, e, ok) {
  var el = document.getElementById('join-status');
  el.textContent = m;
  el.className = 'mp-status' + (e ? ' err' : (ok ? ' ok' : ''));
}

function renderSetup() {
  var el = document.getElementById('player-list');
  el.innerHTML = '';
  var isOnline = mpTab === 'host' || mpTab === 'join';

  setupPlayers.forEach(function(p, i) {
    var row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML =
      '<input type="text" value="' + p.name + '" placeholder="Your name" oninput="setupPlayers[' + i + '].name=this.value; broadcastMyName()"/>' +
      '<span class="token-pick" onclick="cycleToken(' + i + ')">' + TOKEN_EMOJIS[p.tokenIdx] + '</span>' +
      (!isOnline && setupPlayers.length > 2 ? '<button class="remove-player" onclick="removePlayer(' + i + ')">×</button>' : '');
    el.appendChild(row);
  });

  if (isOnline && remoteSetupPlayers.length > 0) {
    remoteSetupPlayers.forEach(function(rp) {
      if (!rp.ready) return;
      var row = document.createElement('div');
      row.className = 'player-row remote-player-row';
      row.innerHTML =
        '<input type="text" value="' + rp.name + '" readonly style="opacity:.6;cursor:default"/>' +
        '<span style="font-size:19px;padding:5px 8px">' + TOKEN_EMOJIS[rp.tokenIdx] + '</span>' +
        '<span class="ready-badge">✓ Ready</span>';
      el.appendChild(row);
    });
  }

  var existing = document.getElementById('btn-ready');
  if (isOnline) {
    if (!existing) {
      var btn = document.createElement('button');
      btn.id = 'btn-ready';
      btn.className = 'btn-add';
      btn.style.cssText = 'border-style:solid;color:var(--green);border-color:var(--green);margin-bottom:9px';
      btn.textContent = myReady ? '✓ Ready!' : 'Mark as Ready';
      btn.onclick = function() { toggleReady(); };
      var addBtn = document.querySelector('.btn-add:not(#btn-ready)');
      if (addBtn) el.parentNode.insertBefore(btn, addBtn);
    } else {
      existing.textContent = myReady ? '✓ Ready!' : 'Mark as Ready';
      existing.style.background = myReady ? 'var(--green-bg)' : '';
    }
    var addPlayerBtn = document.querySelector('.btn-add:not(#btn-ready)');
    if (addPlayerBtn) addPlayerBtn.style.display = 'none';
  } else {
    if (existing) existing.remove();
    var addPlayerBtn2 = document.querySelector('.btn-add');
    if (addPlayerBtn2) addPlayerBtn2.style.display = '';
  }
}

function addPlayer() {
  if (setupPlayers.length >= 6) return;
  setupPlayers.push({name:'Player ' + (setupPlayers.length + 1), tokenIdx: setupPlayers.length});
  renderSetup();
}
function removePlayer(i) { setupPlayers.splice(i, 1); renderSetup(); }
function cycleToken(i) { setupPlayers[i].tokenIdx = (setupPlayers[i].tokenIdx + 1) % TOKEN_EMOJIS.length; renderSetup(); }

function startGame() {
  document.getElementById('btn-start').disabled = true;
  // Read timer settings from setup screen
  var timerToggle = document.getElementById('setup-timer-toggle');
  var timerSecs = document.getElementById('setup-timer-secs');
  G.turnTimerEnabled = timerToggle && timerToggle.checked;
  G.turnTimerSeconds = timerSecs ? parseInt(timerSecs.value, 10) || 60 : 60;

  if (mpTab === 'host') { MP.mode = 'host'; MP.myPlayerIndex = 0; }
  else if (mpTab === 'join') { MP.mode = 'client'; MP.myPlayerIndex = 1; }

  var allSetup = setupPlayers.slice();
  remoteSetupPlayers.forEach(function(rp) { if (rp.ready) allSetup.push({ name: rp.name, tokenIdx: rp.tokenIdx }); });

  G.players = allSetup.map(function(p, i) {
    return {
      name: p.name.trim() || 'Player ' + (i+1),
      token: TOKEN_EMOJIS[p.tokenIdx],
      color: TOKEN_COLORS[p.tokenIdx],
      money:1500, pos:0, inJail:false, jailTurns:0,
      bankrupt:false, skipTurns:0, freeRentThisTurn:false, properties:[],
      txHistory: []
    };
  });

  // Init stats tracking
  G.stats = {
    rentPaid: G.players.map(function(){ return 0; }),
    biggestTx: G.players.map(function(){ return 0; }),
    doublesRolled: G.players.map(function(){ return 0; })
  };

  if (MP.mode === 'client') {
    var myName = setupPlayers[0] ? setupPlayers[0].name.trim() : '';
    G.players.forEach(function(p, i) { if (p.name === myName) MP.myPlayerIndex = i; });
  }

  G.chanceDeck    = shuffle(CHANCE_CARDS.slice());
  G.communityDeck = shuffle(COMMUNITY_CARDS.slice());
  G.properties = {}; G.current = 0; G.phase = 'rolling'; G.doublesCount = 0;
  G.freeParkingPot = 0; G.lastDice = [0,0]; G.round = 1;

  launchGame();
  log('Game started! ' + G.players.map(function(p){ return p.token + ' ' + p.name; }).join(', '), 'important');
  log(curPlayer().name + "'s turn. Roll the dice!");
  showTurnToast(curPlayer());
  startTurnTimer();
  if (MP.mode === 'host') hostBcast();
  if (mpEnabled()) updateMpBar();
}

function launchGame() {
  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  if (mpEnabled()) {
    document.getElementById('mp-bar').classList.remove('hidden');
    document.getElementById('mp-room-code').textContent = MP.roomCode || '--';
    document.body.classList.add('has-bar');
  }
  renderAll(); sizeBoard();
  // Show music controls
  initMusicPlayer();
}

// ── TURN TIMER ───────────────────────────────────────────────
var _timerInterval = null;
function startTurnTimer() {
  clearInterval(_timerInterval);
  if (!G.turnTimerEnabled) { hideTurnTimer(); return; }
  G.turnTimeLeft = G.turnTimerSeconds;
  updateTimerDisplay();
  _timerInterval = setInterval(function() {
    G.turnTimeLeft--;
    updateTimerDisplay();
    if (G.turnTimeLeft <= 0) {
      clearInterval(_timerInterval);
      if (G.phase === 'rolling' && isMyTurn()) {
        log('⏱ Time\'s up! Auto-rolling for ' + curPlayer().name + '.', 'important');
        rollDice();
      }
    }
  }, 1000);
}
function stopTurnTimer() { clearInterval(_timerInterval); hideTurnTimer(); }
function hideTurnTimer() {
  var el = document.getElementById('turn-timer');
  if (el) el.classList.add('hidden');
}
function updateTimerDisplay() {
  var el = document.getElementById('turn-timer');
  if (!el) return;
  el.classList.remove('hidden');
  el.textContent = '⏱ ' + G.turnTimeLeft + 's';
  el.classList.toggle('timer-warning', G.turnTimeLeft <= 10);
}

// ── HELPERS ──────────────────────────────────────────────────
function curPlayer() { return G.players[G.current]; }
function shuffle(a) { for (var i = a.length-1; i > 0; i--) { var j = Math.floor(Math.random()*(i+1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function dr() { return Math.floor(Math.random() * 6) + 1; }
function log(msg, cls) {
  var el = document.getElementById('log-entries');
  var d = document.createElement('div');
  d.className = 'log-entry ' + (cls || '');
  d.textContent = msg;
  el.prepend(d);
  while (el.children.length > 100) el.removeChild(el.lastChild);
}

// ── FINANCE ──────────────────────────────────────────────────
function collect(player, amount) {
  player.money += amount;
  var idx = G.players.indexOf(player);
  if (idx >= 0) {
    showMoneyFloat(idx, amount, true);
    player.txHistory = player.txHistory || [];
    player.txHistory.unshift({label: '+' + fmt(amount), time: G.round});
    if (player.txHistory.length > 20) player.txHistory.pop();
    if (G.stats) G.stats.biggestTx[idx] = Math.max(G.stats.biggestTx[idx] || 0, amount);
  }
  playSound('collect');
  log(player.name + ' collects ' + fmt(amount), 'good');
  renderPlayers();
}
function charge(player, amount, recipient) {
  player.money -= amount;
  var idx = G.players.indexOf(player);
  if (idx >= 0) {
    showMoneyFloat(idx, amount, false);
    player.txHistory = player.txHistory || [];
    player.txHistory.unshift({label: '-' + fmt(amount), time: G.round});
    if (player.txHistory.length > 20) player.txHistory.pop();
    if (G.stats) G.stats.biggestTx[idx] = Math.max(G.stats.biggestTx[idx] || 0, amount);
  }
  playSound('pay');
  if (recipient) {
    recipient.money += amount;
    var ridx = G.players.indexOf(recipient);
    if (ridx >= 0) showMoneyFloat(ridx, amount, true);
    log(player.name + ' pays ' + fmt(amount) + ' to ' + recipient.name + '.', 'bad');
  } else {
    log(player.name + ' pays ' + fmt(amount) + ' to bank.', 'bad');
  }
  if (player.money < 0) checkBankruptcy(player);
  renderPlayers();
}
function collectFromAll(player, amount) {
  G.players.forEach(function(o){ if (o !== player && !o.bankrupt) { o.money -= amount; player.money += amount; if (o.money < 0) checkBankruptcy(o); } });
  log(player.name + ' collects ' + fmt(amount) + ' from each!', 'good'); renderPlayers();
}
function checkBankruptcy(player) {
  if (player.money >= 0) return;
  player.bankrupt = true;
  player.properties.forEach(function(id){ delete G.properties[id]; }); player.properties = [];
  playSound('bankrupt');
  log(player.name + ' is BANKRUPT!', 'bad'); renderAll();
  var alive = G.players.filter(function(p){ return !p.bankrupt; });
  if (alive.length === 1) showWinner(alive[0]);
}

// ── MOVEMENT ─────────────────────────────────────────────────
function advanceTo(player, targetId) {
  if (targetId < player.pos) collect(player, 200);
  player.pos = targetId; renderTokens();
}
function moveRelative(player, steps) {
  var np = (player.pos + steps + 40) % 40;
  if (steps > 0 && np < player.pos) collect(player, 200);
  player.pos = np; renderTokens(); landOn(player);
}
function advanceToNearest(player, type) {
  var ids = SQUARES.filter(function(s){ return s.type === type; }).map(function(s){ return s.id; });
  var best = ids[0], bd = 40;
  ids.forEach(function(id){ var d = (id - player.pos + 40) % 40; if (d < bd) { bd = d; best = id; } });
  if (best < player.pos) collect(player, 200);
  player.pos = best; log(player.name + ' advances to ' + SQUARES[best].name, 'important');
  renderTokens(); landOn(player);
}
function getRent(sqId, diceTotal) {
  var sq = SQUARES[sqId], prop = G.properties[sqId]; if (!prop) return 0;
  var owner = G.players[prop.owner]; if (!owner || owner.bankrupt) return 0;
  if (sq.type === 'station') { var n = COLOR_GROUPS.station.filter(function(id){ return G.properties[id] && G.properties[id].owner === prop.owner; }).length; return [25,50,100,200][n-1] || 25; }
  if (sq.type === 'utility') { var nu = COLOR_GROUPS.utility.filter(function(id){ return G.properties[id] && G.properties[id].owner === prop.owner; }).length; return nu === 2 ? 10*diceTotal : 4*diceTotal; }
  var table = RENT[sq.group]; if (!table) return 0;
  if (prop.houses > 0) return table[Math.min(prop.houses+1, table.length-1)];
  var group = COLOR_GROUPS[sq.group] || [];
  var ownsAll = group.every(function(id){ return G.properties[id] && G.properties[id].owner === prop.owner; });
  return ownsAll ? table[1] : table[0];
}

// ── STEP-BY-STEP TOKEN MOVEMENT ──────────────────────────────
function movePlayerStepByStep(player, steps, callback) {
  if (steps === 0) { if (callback) callback(); return; }
  var dir = steps > 0 ? 1 : -1;
  var remaining = Math.abs(steps);
  function step() {
    player.pos = (player.pos + dir + 40) % 40;
    playSound('step');
    renderTokens();
    remaining--;
    if (remaining > 0) { setTimeout(step, 120); }
    else { if (callback) callback(); }
  }
  setTimeout(step, 80);
}

// ── DICE & TURNS ─────────────────────────────────────────────
function rollDice(fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') { cliSend('roll'); return; }
  var p = curPlayer();
  if (p.bankrupt || G.phase !== 'rolling') return;
  stopTurnTimer();
  if (p.skipTurns > 0) { p.skipTurns--; log(p.name + ' skips their turn.'); nextTurn(); return; }

  var d1 = dr(), d2 = dr(), total = d1+d2, doubles = d1 === d2;
  G.lastDice = [d1, d2];
  if (doubles && G.stats) {
    G.stats.doublesRolled[G.current] = (G.stats.doublesRolled[G.current] || 0) + 1;
  }
  animDice(d1, d2, total, doubles);

  if (p.inJail) {
    if (doubles) { p.inJail = false; p.jailTurns = 0; G.doublesCount = 0; log(p.name + ' rolled doubles — out of jail!', 'good'); doMove(p, total); }
    else {
      p.jailTurns++;
      if (p.jailTurns >= 3) { charge(p, 50); p.inJail = false; p.jailTurns = 0; log(p.name + ' pays ' + M + '50 to leave jail.'); doMove(p, total); }
      else { log(p.name + ' stays in jail (' + p.jailTurns + '/3). Pay ' + M + '50 or roll doubles.'); G.phase = 'moved'; showEndTurnBtn(); }
    }
    hostBcast(); return;
  }
  if (doubles) {
    G.doublesCount++;
    updateDoublesIndicator();
    if (G.doublesCount >= 3) { log(p.name + ' rolled 3 doubles — GO TO JAIL!', 'bad'); playSound('jail'); sendToJail(p); G.doublesCount = 0; updateDoublesIndicator(); G.phase = 'moved'; showEndTurnBtn(); hostBcast(); return; }
  } else {
    G.doublesCount = 0; updateDoublesIndicator();
  }
  doMove(p, total);
  hostBcast();
}

function updateDoublesIndicator() {
  var el = document.getElementById('doubles-indicator');
  if (!el) return;
  if (G.doublesCount === 0) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  el.textContent = '🎲'.repeat(G.doublesCount) + ' doubles' + (G.doublesCount === 2 ? ' — careful!' : '');
}

function doMove(player, steps) {
  G.phase = 'moved';
  var oldPos = player.pos;
  movePlayerStepByStep(player, steps, function() {
    if (oldPos + steps >= 40) { collect(player, 200); log(player.name + ' passes GO — collect ' + M + '200!', 'good'); }
    landOn(player);
  });
}

function animDice(d1, d2, total, doubles) {
  var e1 = document.getElementById('die1'), e2 = document.getElementById('die2');
  e1.classList.add('rolling'); e2.classList.add('rolling');
  playSound('dice-rattle');
  setTimeout(function() { playSound('dice-rattle'); }, 160);
  setTimeout(function() { playSound('dice-rattle'); }, 300);
  setTimeout(function(){
    e1.classList.remove('rolling'); e2.classList.remove('rolling');
    e1.textContent = d1; e2.textContent = d2;
    document.getElementById('dice-total').textContent = 'Total: ' + total + (doubles ? ' — DOUBLES!' : '');
    playSound('dice-land');
  }, 460);
}

function landOn(player) {
  var sq = SQUARES[player.pos];
  log(player.name + ' lands on ' + sq.name);
  var freeRent = player.freeRentThisTurn; player.freeRentThisTurn = false;
  switch (sq.type) {
    case 'go':       playSound('go'); collect(player, 200); break;
    case 'tax':      playSound('land-tax'); charge(player, sq.price); G.freeParkingPot += sq.price; updateBank(); break;
    case 'gotojail': playSound('jail'); sendToJail(player); break;
    case 'jail':     break;
    case 'parking':
      if (G.freeParkingPot > 0) {
        var pot = G.freeParkingPot; G.freeParkingPot = 0;
        launchConfetti();
        collect(player, pot);
        log(player.name + ' collects Free Parking pot: ' + fmt(pot) + '!', 'good');
        updateBank();
      } else { playSound('land-special'); }
      break;
    case 'chance':    playSound('card'); drawCard('chance', player);    return;
    case 'community': playSound('card'); drawCard('community', player); return;
    case 'property': case 'station': case 'utility': playSound('land-property'); handleProperty(player, sq, freeRent); return;
  }
  showPostMove(player); hostBcast();
}

function handleProperty(player, sq, freeRent) {
  var prop = G.properties[sq.id];
  if (!prop) { showBuyBtn(player, sq); showEndTurnBtn(); hostBcast(); return; }
  var owner = G.players[prop.owner];
  if (owner === player || owner.bankrupt || freeRent) { if (freeRent) log(player.name + ' — free rent card!'); showEndTurnBtn(); hostBcast(); return; }
  var rent = getRent(sq.id, G.lastDice[0] + G.lastDice[1]);
  if (rent > 0) {
    // Track rent stats
    var pi = G.players.indexOf(player);
    if (pi >= 0 && G.stats) G.stats.rentPaid[pi] = (G.stats.rentPaid[pi] || 0) + rent;
    showRentPopup(player, owner, rent, sq.name, function() {
      charge(player, rent, owner);
      showEndTurnBtn(); hostBcast();
    });
    return;
  }
  showEndTurnBtn(); hostBcast();
}

function showPostMove(player) {
  var sq = SQUARES[player.pos];
  if (!G.properties[sq.id] && (sq.type === 'property' || sq.type === 'station' || sq.type === 'utility')) showBuyBtn(player, sq);
  showEndTurnBtn();
}
function showBuyBtn(player, sq) { var btn = document.getElementById('btn-buy'); btn.classList.remove('hidden'); btn.dataset.squareId = sq.id; btn.textContent = '🏠 Buy ' + sq.name + ' (' + fmt(sq.price) + ')'; }
function showEndTurnBtn() { document.getElementById('btn-pass').classList.remove('hidden'); dis('btn-roll', true); if (curPlayer().inJail) document.getElementById('btn-pay-jail').classList.remove('hidden'); syncActionButtons(); }

function payJail(fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') { cliSend('payJail'); return; }
  var p = curPlayer(); if (!p.inJail) return;
  charge(p, 50); p.inJail = false; p.jailTurns = 0;
  log(p.name + ' pays ' + M + '50 and leaves jail.', 'important');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  G.phase = 'rolling'; dis('btn-roll', false); syncActionButtons(); hostBcast();
}

function buyProperty(fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') { cliSend('buy'); return; }
  var p = curPlayer(), id = parseInt(document.getElementById('btn-buy').dataset.squareId, 10), sq = SQUARES[id];
  if (p.money < sq.price) { log(p.name + " can't afford " + sq.name + '!', 'bad'); return; }
  charge(p, sq.price); G.properties[id] = {owner: G.current, houses: 0}; p.properties.push(id);
  log(p.name + ' buys ' + sq.name + ' for ' + fmt(sq.price) + '!', 'good');
  playSound('buy');
  document.getElementById('btn-buy').classList.add('hidden'); renderPlayers(); hostBcast();
}

function endTurn(fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') { cliSend('endTurn'); return; }
  ['btn-buy','btn-pass','btn-pay-jail'].forEach(function(id){ document.getElementById(id).classList.add('hidden'); });
  dis('btn-roll', false); document.getElementById('dice-total').textContent = '';
  var p = curPlayer();
  if (G.lastDice[0] === G.lastDice[1] && G.doublesCount > 0 && !p.inJail) { G.phase = 'rolling'; log(p.name + ' rolled doubles — roll again!', 'important'); renderTurnInfo(); syncActionButtons(); startTurnTimer(); hostBcast(); return; }
  nextTurn();
}

function nextTurn() {
  G.lastDice = [0,0];
  document.getElementById('die1').textContent = '·'; document.getElementById('die2').textContent = '·';
  ['btn-buy','btn-pass','btn-pay-jail'].forEach(function(id){ document.getElementById(id).classList.add('hidden'); });
  dis('btn-roll', false);
  document.getElementById('doubles-indicator').classList.add('hidden');
  var next = (G.current+1) % G.players.length, loops = 0;
  while (G.players[next].bankrupt && loops < G.players.length) { next = (next+1) % G.players.length; loops++; }
  if (next <= G.current || (next === 0 && G.current > 0)) G.round++;
  G.current = next; G.phase = 'rolling'; G.doublesCount = 0;
  renderAll();
  log('— ' + curPlayer().name + "'s turn — (Round " + G.round + ')', 'important');
  showTurnToast(curPlayer());
  startTurnTimer();
  hostBcast();
}

function sendToJail(player) { player.pos = 10; player.inJail = true; player.jailTurns = 0; renderTokens(); log(player.name + ' is sent to JAIL!', 'bad'); }

// ── CARDS ────────────────────────────────────────────────────
var pendingCardAction = null;

function drawCard(type, player) {
  var deck = type === 'chance' ? G.chanceDeck : G.communityDeck;
  var card = deck.shift(); deck.push(card);

  var label = document.getElementById('card-type-label');
  label.textContent = type === 'chance' ? 'Chance' : 'Et Si?';
  label.className = 'card-type-label ' + (type === 'chance' ? 'chance' : 'community');
  document.getElementById('card-title-display').textContent = '';

  var spriteEl = document.getElementById('card-sprite-display');
  var textEl   = document.getElementById('card-popup-text');
  var si = type === 'chance' ? CHANCE_SPRITE_IDX[CHANCE_CARDS.indexOf(card)] : COMMUNITY_SPRITE_IDX[COMMUNITY_CARDS.indexOf(card)];

  if (si !== null && si !== undefined) {
    var pos = ACTION_SPRITE.pos(si);
    var maxW = Math.min(460, window.innerWidth * 0.8 - 64);
    var scale = Math.min(2, maxW / ACTION_SPRITE.cardW);
    spriteEl.style.cssText =
      'display:block;width:' + Math.round(ACTION_SPRITE.cardW * scale) + 'px;height:' + Math.round(ACTION_SPRITE.cardH * scale) + 'px;' +
      'background-image:url("' + ACTION_SPRITE.file + '");' +
      'background-size:' + Math.round(ACTION_SPRITE.sheetW * scale) + 'px ' + Math.round(ACTION_SPRITE.sheetH * scale) + 'px;' +
      'background-position:' + Math.round(pos.x * scale) + 'px ' + Math.round(pos.y * scale) + 'px;' +
      'background-repeat:no-repeat;margin:0 auto;border-radius:6px;';
    textEl.style.display = 'none';
  } else {
    spriteEl.style.display = 'none';
    textEl.style.display = 'block';
    textEl.textContent = card.text;
  }

  var popup = document.getElementById('card-popup');
  popup.classList.remove('hidden');
  // Real 3D card flip: reset then trigger
  var inner = document.getElementById('card-popup-inner');
  inner.style.transform = 'rotateY(90deg) scale(0.85)';
  inner.style.opacity = '0';
  inner.style.transition = 'none';
  void inner.offsetWidth;
  inner.style.transition = 'transform 0.42s cubic-bezier(.34,1.2,.64,1), opacity 0.22s ease';
  inner.style.transform = 'rotateY(0deg) scale(1)';
  inner.style.opacity = '1';

  var p = player;
  pendingCardAction = function(){ card.action(p); showPostMove(p); };
  hostBcast();
}

function dismissCard() {
  document.getElementById('card-popup').classList.add('hidden');
  if (pendingCardAction) { pendingCardAction(); pendingCardAction = null; }
  renderAll(); hostBcast();
}

// ── PROPERTY CARD POPUP ──────────────────────────────────────
function showPropertyCard(sqId) {
  var si = PROP_SPRITE.map[sqId];
  if (si === undefined) return;
  var pos = PROP_SPRITE.pos(si);
  var scale = 2.5;
  var W = Math.round(PROP_SPRITE.cardW * scale);
  var H = Math.round(PROP_SPRITE.cardH * scale);

  var overlay = document.getElementById('prop-card-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'prop-card-modal';
    overlay.onclick = function() { overlay.classList.add('hidden'); };
    document.body.appendChild(overlay);
  }
  var inner = document.getElementById('prop-card-inner') || (function(){ var d = document.createElement('div'); d.id = 'prop-card-inner'; overlay.appendChild(d); return d; })();
  var sprite = document.getElementById('prop-card-svg-sprite') || (function(){ var d = document.createElement('div'); d.id = 'prop-card-svg-sprite'; inner.appendChild(d); return d; })();
  var hint = inner.querySelector('.prop-card-hint');
  if (!hint) { hint = document.createElement('div'); hint.className = 'prop-card-hint'; hint.textContent = 'Click anywhere to close'; inner.appendChild(hint); }

  sprite.style.cssText = 'width:'+W+'px;height:'+H+'px;' +
    'background-image:url("'+PROP_SPRITE.file+'");' +
    'background-size:'+(PROP_SPRITE.sheetW*scale)+'px '+(PROP_SPRITE.sheetH*scale)+'px;' +
    'background-position:'+(pos.x*scale)+'px '+(pos.y*scale)+'px;' +
    'background-repeat:no-repeat;border-radius:8px;box-shadow:0 12px 48px rgba(0,0,0,.4);';

  overlay.classList.remove('hidden');
}

// ── RULES ────────────────────────────────────────────────────
function openRules() { showModal(RULES_HTML); }

// ── MODAL: PROPERTIES ────────────────────────────────────────
function openProperties() {
  var skip = {go:1,tax:1,jail:1,gotojail:1,parking:1,chance:1,community:1};
  var groups = {};
  SQUARES.forEach(function(sq){ if (!sq.group || skip[sq.type]) return; if (!groups[sq.group]) groups[sq.group] = []; groups[sq.group].push(sq); });
  var html = '<h2>Properties</h2><p style="font-size:11px;color:var(--text3);margin-bottom:12px;border:none;padding:0">Click any property to see its deed card.</p>';
  Object.keys(groups).forEach(function(g) {
    html += '<div class="prop-group"><div class="prop-group-title">' + g.toUpperCase() + '</div>';
    groups[g].forEach(function(sq) {
      var prop = G.properties[sq.id], owner = prop ? G.players[prop.owner] : null, h = prop ? prop.houses : 0;
      var hs = h === 0 ? '' : (h === 5 ? 'Hotel' : '×' + h);
      var gc = GROUP_COLORS[g] || '#aaa';
      html += '<div class="prop-item" style="border-left-color:' + gc + '" onclick="showPropertyCard(' + sq.id + ')">' +
        '<span>' + sq.name + '</span>' +
        '<span>' + (owner ? '<span class="prop-owner">' + owner.token + ' ' + owner.name + '</span>' : '') +
        (hs ? '<span class="prop-houses"> ' + hs + '</span>' : '') + '</span></div>';
    });
    html += '</div>';
  });

  // Offer to sell section
  var p = curPlayer();
  if (p.properties.length > 0) {
    html += '<div class="prop-group"><div class="prop-group-title">YOUR PROPERTIES — OFFER TO SELL</div>';
    p.properties.forEach(function(id) {
      var sq = SQUARES[id];
      html += '<div class="prop-item" style="border-left-color:' + (GROUP_COLORS[sq.group]||'#aaa') + '">' +
        '<span>' + sq.name + '</span>' +
        '<button class="btn-sm" style="font-size:11px;padding:4px 9px" onclick="closeModalForce();openOfferSell(' + id + ')">Offer</button></div>';
    });
    html += '</div>';
  }

  showModal(html);
}

function openOfferSell(propId) {
  var sq = SQUARES[propId];
  var others = G.players.filter(function(o){ return !o.bankrupt && o !== curPlayer(); });
  if (!others.length) { showModal('<h2>No one to offer to!</h2>'); return; }
  var html = '<h2>Offer ' + sq.name + ' for sale</h2>' +
    '<div class="trade-section"><label>Offer to</label><select id="offer-target">' +
    others.map(function(o){ return '<option value="' + G.players.indexOf(o) + '">' + o.token + ' ' + o.name + '</option>'; }).join('') + '</select></div>' +
    '<div class="trade-section"><label>Asking price (' + M + ')</label><input type="number" id="offer-price" value="' + sq.price + '" min="0"/></div>' +
    '<div class="modal-actions"><button class="btn-action" onclick="confirmOfferSell(' + propId + ')">Send Offer</button>' +
    '<button class="btn-action secondary" onclick="closeModalForce()">Cancel</button></div>';
  showModal(html);
}

function confirmOfferSell(propId) {
  var ti = parseInt(document.getElementById('offer-target').value, 10);
  var price = parseInt(document.getElementById('offer-price').value, 10) || 0;
  var p = curPlayer(), partner = G.players[ti], sq = SQUARES[propId];
  if (price > partner.money) { log(partner.name + " can't afford " + fmt(price) + '!', 'bad'); closeModalForce(); return; }
  // Execute the deal
  partner.money -= price; p.money += price;
  G.properties[propId].owner = ti;
  p.properties = p.properties.filter(function(x){ return x !== propId; });
  partner.properties.push(propId);
  log(p.name + ' sold ' + sq.name + ' to ' + partner.name + ' for ' + fmt(price) + '!', 'important');
  closeModalForce(); renderAll(); hostBcast();
}

// ── MODAL: TRADE ─────────────────────────────────────────────
function openTrade() {
  var p = curPlayer(), others = G.players.filter(function(o){ return !o.bankrupt && o !== p; });
  if (!others.length) { showModal('<h2>No other active players to trade with!</h2>'); return; }
  var html = '<h2>Trade</h2>' +
    '<div class="trade-section"><label>Trade with</label><select id="trade-partner">' +
    others.map(function(o){ return '<option value="' + G.players.indexOf(o) + '">' + o.token + ' ' + o.name + '</option>'; }).join('') + '</select></div>' +
    '<div class="trade-section"><label>You offer (' + M + ')</label><input type="number" id="trade-offer-money" value="0" min="0" max="' + p.money + '"/></div>' +
    '<div class="trade-section"><label>Your properties to give</label><div class="trade-checkboxes">' +
    (p.properties.length ? p.properties.map(function(id){ return '<label><input type="checkbox" class="trade-give-prop" value="' + id + '"> ' + SQUARES[id].name + '</label>'; }).join('') : '<span style="color:var(--text3)">None</span>') +
    '</div></div>' +
    '<div class="trade-section"><label>You receive (' + M + ')</label><input type="number" id="trade-recv-money" value="0" min="0"/></div>' +
    '<div class="trade-section"><label>Their properties to receive</label><div class="trade-checkboxes" id="trade-recv-props"></div></div>' +
    '<div class="modal-actions"><button class="btn-action" onclick="executeTrade()">Confirm Trade</button><button class="btn-action secondary" onclick="closeModalForce()">Cancel</button></div>';
  showModal(html);
  function upd() { var pi = parseInt(document.getElementById('trade-partner').value, 10), partner = G.players[pi]; document.getElementById('trade-recv-props').innerHTML = partner.properties.length ? partner.properties.map(function(id){ return '<label><input type="checkbox" class="trade-recv-prop" value="' + id + '"> ' + SQUARES[id].name + '</label>'; }).join('') : '<span style="color:var(--text3)">None</span>'; }
  upd(); document.getElementById('trade-partner').addEventListener('change', upd);
}

function executeTrade(td, fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') {
    var td2 = {
      pi: parseInt(document.getElementById('trade-partner').value, 10),
      om: parseInt(document.getElementById('trade-offer-money').value, 10) || 0,
      rm: parseInt(document.getElementById('trade-recv-money').value, 10) || 0,
      gp: [].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){ return parseInt(e.value, 10); }),
      rp: [].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){ return parseInt(e.value, 10); })
    };
    cliSend('trade', {td: td2}); closeModalForce(); return;
  }
  var t = td || {
    pi: parseInt(document.getElementById('trade-partner').value, 10),
    om: parseInt(document.getElementById('trade-offer-money').value, 10) || 0,
    rm: parseInt(document.getElementById('trade-recv-money').value, 10) || 0,
    gp: [].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){ return parseInt(e.value, 10); }),
    rp: [].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){ return parseInt(e.value, 10); })
  };
  var p = curPlayer(), partner = G.players[t.pi];
  if (t.om > p.money) { alert(p.name + " doesn't have " + fmt(t.om) + '!'); return; }
  if (t.rm > partner.money) { alert(partner.name + " doesn't have " + fmt(t.rm) + '!'); return; }
  p.money -= t.om; partner.money += t.om; partner.money -= t.rm; p.money += t.rm;
  t.gp.forEach(function(id){ G.properties[id].owner = t.pi; p.properties = p.properties.filter(function(x){ return x !== id; }); partner.properties.push(id); });
  t.rp.forEach(function(id){ G.properties[id].owner = G.current; partner.properties = partner.properties.filter(function(x){ return x !== id; }); p.properties.push(id); });
  log('Trade: ' + p.name + ' ↔ ' + partner.name, 'important'); closeModalForce(); renderAll(); hostBcast();
}

// ── MODAL: BUILD ─────────────────────────────────────────────
function openBuildMenu() {
  var p = curPlayer();
  var buildable = p.properties.filter(function(id) {
    var sq = SQUARES[id]; if (!sq.group || sq.type !== 'property') return false;
    return (COLOR_GROUPS[sq.group] || []).every(function(gid){ return G.properties[gid] && G.properties[gid].owner === G.current; });
  });
  if (!buildable.length) { showModal('<h2>Build Houses</h2><p>Own a complete colour set to build. No complete sets yet.</p>'); return; }
  var html = '<h2>Build Houses / Hotels</h2>';
  buildable.forEach(function(id) {
    var sq = SQUARES[id], prop = G.properties[id], cost = HOUSE_COST[sq.group] || 100, h = prop.houses;
    var hl = h === 0 ? 'None' : (h === 5 ? 'Hotel' : h + ' House' + (h > 1 ? 's' : ''));
    html += '<div class="build-row"><div><strong>' + sq.name + '</strong><br><small style="color:var(--text3)">' + fmt(cost) + ' each</small></div>' +
      '<div class="build-controls"><button class="build-btn" onclick="buildHouse(' + id + ',-1)">−</button>' +
      '<span class="house-display">' + hl + '</span>' +
      '<button class="build-btn" onclick="buildHouse(' + id + ',1)">+</button></div></div>';
  });
  html += '<div class="modal-actions"><button class="btn-action secondary" onclick="closeModalForce()">Close</button></div>';
  showModal(html);
}

function buildHouse(id, dir, fromHost) {
  if (!fromHost && mpEnabled() && MP.mode === 'client') { cliSend('build', {sid: id, dir: dir}); return; }
  var p = curPlayer(), sq = SQUARES[id], prop = G.properties[id], cost = HOUSE_COST[sq.group] || 100;
  if (dir === 1) { if (prop.houses >= 5) return; if (p.money < cost) { log('Not enough money!', 'bad'); return; } charge(p, cost); prop.houses++; playSound('build'); log(p.name + ' builds on ' + sq.name, 'good'); }
  else { if (prop.houses <= 0) return; var ref = Math.floor(cost/2); prop.houses--; playSound('sell-house'); collect(p, ref); }
  renderAll(); openBuildMenu(); hostBcast();
}

// ── MODAL UTILS ──────────────────────────────────────────────
function showModal(html) { document.getElementById('modal-content').innerHTML = html; document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal(e) { if (e.target === document.getElementById('modal-overlay')) closeModalForce(); }
function closeModalForce() { document.getElementById('modal-overlay').classList.add('hidden'); }

// ── WINNER ───────────────────────────────────────────────────
function showWinner(player) {
  stopTurnTimer();
  // Build recap stats
  var mostRent = 0, mostRentName = '—';
  var biggestSingle = 0, biggestSingleName = '—';
  var mostDoubles = 0, mostDoublesName = '—';
  G.players.forEach(function(p, i) {
    var r = G.stats.rentPaid[i] || 0;
    var b = G.stats.biggestTx[i] || 0;
    var d = G.stats.doublesRolled[i] || 0;
    if (r > mostRent) { mostRent = r; mostRentName = p.token + ' ' + p.name; }
    if (b > biggestSingle) { biggestSingle = b; biggestSingleName = p.token + ' ' + p.name; }
    if (d > mostDoubles) { mostDoubles = d; mostDoublesName = p.token + ' ' + p.name; }
  });

  var d = document.createElement('div'); d.id = 'winner-banner';
  d.innerHTML = '<div id="winner-inner">' +
    '<div class="w-emoji">' + player.token + '</div>' +
    '<h1>' + player.name + ' wins!</h1>' +
    '<p>' + fmt(player.money) + ' in the bank · ' + player.properties.length + ' properties · Round ' + G.round + '</p>' +
    '<div class="winner-stats">' +
    '<div class="winner-stat"><span class="ws-label">💸 Most rent paid</span><span class="ws-val">' + mostRentName + ' — ' + fmt(mostRent) + '</span></div>' +
    '<div class="winner-stat"><span class="ws-label">🤯 Biggest transaction</span><span class="ws-val">' + biggestSingleName + ' — ' + fmt(biggestSingle) + '</span></div>' +
    '<div class="winner-stat"><span class="ws-label">🎲 Most doubles</span><span class="ws-val">' + mostDoublesName + ' — ' + mostDoubles + 'x</span></div>' +
    '</div>' +
    '<button class="btn-action" style="justify-content:center;margin-top:20px" onclick="location.reload()">Play Again ♥</button>' +
    '</div>';
  document.body.appendChild(d);
  launchConfetti();
  setTimeout(launchConfetti, 600);
}

// ── RENDER ───────────────────────────────────────────────────
function renderAll() { renderPlayers(); renderTokens(); renderBuildings(); renderTurnInfo(); updateBank(); syncActionButtons(); }


// ── HOUSE/HOTEL BOARD OVERLAYS ────────────────────────────────
function renderBuildings() {
  var layer = document.getElementById('buildings-layer');
  if (!layer) return;
  var cont = document.getElementById('board-container');
  var W = cont.offsetWidth;
  layer.innerHTML = '';

  var cs = 0.1375;
  var stripThick = Math.max(5, W * 0.022);
  var innerEdgeBottom = (1 - cs) * W;
  var innerEdgeTop    = cs * W;
  var innerEdgeLeft   = cs * W;
  var innerEdgeRight  = (1 - cs) * W;

  Object.keys(G.properties).forEach(function(sqId) {
    var prop = G.properties[sqId];
    if (!prop || prop.houses === 0) return;
    var sq = SQUARES[parseInt(sqId, 10)];
    if (!sq || !sq.pos || !sq.group || sq.type !== 'property') return;

    var cx = sq.pos[0] * W, cy = sq.pos[1] * W;
    var color = GROUP_COLORS[sq.group] || '#aaa';
    var isHotel = prop.houses >= 5;
    var count = isHotel ? 1 : prop.houses;
    var side = sq.id >= 1  && sq.id <= 9  ? 'bottom' :
               sq.id >= 11 && sq.id <= 19 ? 'left'   :
               sq.id >= 21 && sq.id <= 29 ? 'top'    : 'right';
    var sz  = isHotel ? Math.max(9, W * 0.018) : Math.max(7, W * 0.013);
    var gap = isHotel ? 0 : (W * 0.016);  // spacing between house dots

    for (var k = 0; k < count; k++) {
      var el = document.createElement('div');
      el.title = isHotel ? 'Hotel' : (count + ' house' + (count > 1 ? 's' : ''));
      var offset = (k - (count - 1) / 2) * (sz + gap * 0.5);
      var lx, ly;
      // Place just inside the inner edge strip (on top of it, toward interior)
      var inset = stripThick + sz * 0.3;
      if (side === 'bottom') {
        lx = cx + offset - sz / 2;
        ly = innerEdgeBottom - inset - sz;
      } else if (side === 'top') {
        lx = cx + offset - sz / 2;
        ly = innerEdgeTop - stripThick + inset;
      } else if (side === 'left') {
        lx = innerEdgeLeft + inset;
        ly = cy + offset - sz / 2;
      } else {
        lx = innerEdgeRight - stripThick - inset - sz;
        ly = cy + offset - sz / 2;
      }
      el.style.cssText = 'position:absolute;width:'+sz+'px;height:'+sz+'px;left:'+lx+'px;top:'+ly+'px;' +
        'background:' + (isHotel ? '#e53' : color) + ';' +
        'border:' + (isHotel ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.8)') + ';' +
        'border-radius:' + (isHotel ? '2px' : '50%') + ';' +
        'box-shadow:0 1px 3px rgba(0,0,0,0.5);pointer-events:none;z-index:5;';
      layer.appendChild(el);
    }
  });
}

function renderPlayers() {
  var panel = document.getElementById('players-panel'); panel.innerHTML = '<div class="panel-title">Players</div>';
  G.players.forEach(function(p, i) {
    var isLow = !p.bankrupt && p.money < 200;
    var d = document.createElement('div');
    d.className = 'player-card' + (i === G.current ? ' active-turn' : '') + (p.bankrupt ? ' bankrupt' : '') + (isLow ? ' low-money' : '');
    var txHtml = '';
    if (p.txHistory && p.txHistory.length) {
      txHtml = '<div class="tx-history hidden" id="tx-' + i + '">' +
        p.txHistory.slice(0, 8).map(function(t){ return '<span class="tx-item' + (t.label[0]==='+' ? ' gain' : ' loss') + '">' + t.label + '</span>'; }).join('') +
        '</div>';
    }
    d.innerHTML = '<div class="player-token-name"><span style="font-size:16px">' + p.token + '</span><span>' + p.name + '</span>' +
      (isLow ? '<span class="low-badge">⚠️</span>' : '') + '</div>' +
      '<div class="player-money">' + fmt(p.money) + '</div>' +
      '<div class="player-props" onclick="toggleTxHistory(' + i + ')" style="cursor:pointer">' + p.properties.length + ' propert' + (p.properties.length === 1 ? 'y' : 'ies') + (p.txHistory && p.txHistory.length ? ' ▾' : '') + '</div>' +
      txHtml +
      (p.inJail ? '<div class="player-jail-badge">In Jail</div>' : '');
    panel.appendChild(d);
  });
}

function toggleTxHistory(i) {
  var el = document.getElementById('tx-' + i);
  if (el) el.classList.toggle('hidden');
}

function renderTurnInfo() {
  var p = curPlayer();
  document.getElementById('current-player-name').textContent = p.token + ' ' + p.name + "'s turn";
  document.getElementById('current-player-money').textContent = fmt(p.money);
  document.getElementById('round-counter').textContent = 'Round ' + (G.round || 1);
  dis('btn-roll', G.phase !== 'rolling');
}

function updateBank() { document.getElementById('bank-display').innerHTML = 'Free Parking pot: ' + fmt(G.freeParkingPot); }

function renderTokens() {
  var layer = document.getElementById('tokens-layer'), cont = document.getElementById('board-container');
  var W = cont.offsetWidth, H = cont.offsetHeight;
  layer.innerHTML = '';
  G.players.forEach(function(p, i) {
    if (p.bankrupt) return;
    var sq = SQUARES[p.pos], pos = sq.pos;
    var same = G.players.slice(0, i).filter(function(pp){ return !pp.bankrupt && pp.pos === p.pos; }).length;
    var ox = (same % 3 - 1) * 13, oy = Math.floor(same / 3) * 16;
    var el = document.createElement('div'); el.className = 'token' + (i === G.current ? ' token-active' : '');
    el.style.left = (pos[0] * W + ox) + 'px'; el.style.top = (pos[1] * H + oy) + 'px';
    el.innerHTML = '<div class="token-bubble" style="--tc:' + p.color + '">' + p.token + '</div>' +
      '<div class="token-name-tag" style="--tc:' + p.color + '">' + p.name.split(' ')[0] + '</div>';
    el.title = p.name; layer.appendChild(el);
  });
}

// ── BOARD SIZING ─────────────────────────────────────────────
function sizeBoard() {
  var wrap = document.getElementById('board-wrap'), cont = document.getElementById('board-container');
  var avail = Math.min(wrap.clientWidth - 24, wrap.clientHeight - 24);
  cont.style.width = avail + 'px'; cont.style.height = avail + 'px';
  renderTokens();
  if (typeof G !== 'undefined' && G.properties) renderBuildings();
}
window.addEventListener('resize', sizeBoard);

// ── INIT ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', function(){ initSetup(); setTimeout(sizeBoard, 120); });