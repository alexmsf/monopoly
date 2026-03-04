// ============================================================
//  MONOPOLY - Our Edition  |  game.js
// ============================================================

// Currency symbol - reversed Won
var M = '₩';
function fmt(n) { return M + n.toLocaleString(); }

// --- CARD SPRITE DATA ----------------------------------------
// Sheet: final-action-cards.png  1220x1099  5 cols x 7 rows
// Each card: 244x157 px
var SPRITE = {
  sheet: 'final-action-cards.png',
  cardW: 244, cardH: 157,
  cols: 5,
  // Sprite index -> {x, y} background-position in px
  pos: function(idx) {
    var col = idx % 5, row = Math.floor(idx / 5);
    return { x: -(col * 244), y: -(row * 157) };
  }
};

// Chance cards: sprite indices 0-15 in order
// ET SI? cards: mapped individually below
var CHANCE_SPRITE   = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
// ET SI? sprite indices (null = no card image, show text only)
var COMMUNITY_SPRITE = [19,null,null,null,null,24,25,26,null,28,30,31,32,null,23,null];

// --- BOARD SQUARES ------------------------------------------
var SQUARES = [
  {id:0,  name:"GO",                       type:"go",       price:0,   color:null,      group:null},
  {id:1,  name:"Chez Alex",                type:"property", price:60,  color:"#7B3F1A", group:"brown"},
  {id:2,  name:"ET SI?",                   type:"community",price:0,   color:null,      group:null},
  {id:3,  name:"Chez Romain",              type:"property", price:60,  color:"#7B3F1A", group:"brown"},
  {id:4,  name:"Income Tax",               type:"tax",      price:150, color:null,      group:null},
  {id:5,  name:"Gare d'Antibes",           type:"station",  price:200, color:"#555",    group:"station"},
  {id:6,  name:"Bord de Mer a Antibes",    type:"property", price:100, color:"#6bbfd4", group:"light-blue"},
  {id:7,  name:"Chance",                   type:"chance",   price:0,   color:null,      group:null},
  {id:8,  name:"Petit Coin Cache Falafel", type:"property", price:100, color:"#6bbfd4", group:"light-blue"},
  {id:9,  name:"Cafe Kanter",              type:"property", price:120, color:"#6bbfd4", group:"light-blue"},
  {id:10, name:"Just Visiting / Jail",     type:"jail",     price:0,   color:null,      group:null},
  {id:11, name:"Hop Store",                type:"property", price:140, color:"#e05a8a", group:"pink"},
  {id:12, name:"Electric Company",         type:"utility",  price:150, color:null,      group:"utility"},
  {id:13, name:"La Fourmilliere",          type:"property", price:140, color:"#e05a8a", group:"pink"},
  {id:14, name:"Cha Bote",                 type:"property", price:160, color:"#e05a8a", group:"pink"},
  {id:15, name:"Aeroport de Nice",         type:"station",  price:200, color:"#555",    group:"station"},
  {id:16, name:"Cineplanet Antibes",       type:"property", price:180, color:"#e07820", group:"orange"},
  {id:17, name:"ET SI?",                   type:"community",price:0,   color:null,      group:null},
  {id:18, name:"Trattoria Quattro",        type:"property", price:180, color:"#e07820", group:"orange"},
  {id:19, name:"Appolonia",                type:"property", price:200, color:"#e07820", group:"orange"},
  {id:20, name:"Free Parking",             type:"parking",  price:0,   color:null,      group:null},
  {id:21, name:"Mini Golf de Porto",       type:"property", price:220, color:"#cc2020", group:"red"},
  {id:22, name:"Chance",                   type:"chance",   price:0,   color:null,      group:null},
  {id:23, name:"Han's Table",              type:"property", price:220, color:"#cc2020", group:"red"},
  {id:24, name:"The Dog",                  type:"property", price:240, color:"#cc2020", group:"red"},
  {id:25, name:"Metro do Porto",           type:"station",  price:200, color:"#555",    group:"station"},
  {id:26, name:"Castro",                   type:"property", price:260, color:"#d4aa00", group:"yellow"},
  {id:27, name:"Plage du Fort Carre",      type:"property", price:260, color:"#d4aa00", group:"yellow"},
  {id:28, name:"Water Works",              type:"utility",  price:150, color:null,      group:"utility"},
  {id:29, name:"Bloc Party",               type:"property", price:280, color:"#d4aa00", group:"yellow"},
  {id:30, name:"Go to Jail",               type:"gotojail", price:0,   color:null,      group:null},
  {id:31, name:"Olympic Stadium Badalona", type:"property", price:300, color:"#2a8040", group:"green"},
  {id:32, name:"Sagrada Familia",          type:"property", price:300, color:"#2a8040", group:"green"},
  {id:33, name:"ET SI?",                   type:"community",price:0,   color:null,      group:null},
  {id:34, name:"100 Montaditos",           type:"property", price:320, color:"#2a8040", group:"green"},
  {id:35, name:"Aeroport de Barcelone",    type:"station",  price:200, color:"#555",    group:"station"},
  {id:36, name:"Chance",                   type:"chance",   price:0,   color:null,      group:null},
  {id:37, name:"Pasta de la Mama",         type:"property", price:350, color:"#1a3a8a", group:"dark-blue"},
  {id:38, name:"Luxury Tax",               type:"tax",      price:100, color:null,      group:null},
  {id:39, name:"La Ferme de Mamie",        type:"property", price:400, color:"#1a3a8a", group:"dark-blue"}
];

// --- TOKEN POSITIONS ----------------------------------------
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

// --- RENT & BUILD -------------------------------------------
var RENT = {
  "brown":     [2,4,10,30,90,160,250],
  "light-blue":[6,12,30,90,270,400,550],
  "pink":      [10,20,50,150,450,625,750],
  "orange":    [14,28,70,200,550,750,950],
  "red":       [18,36,90,250,700,875,1050],
  "yellow":    [22,44,110,330,800,975,1150],
  "green":     [26,52,130,390,900,1100,1275],
  "dark-blue": [35,70,175,500,1100,1300,1500]
};
var HOUSE_COST = {
  "brown":50,"light-blue":50,"pink":100,"orange":100,
  "red":150,"yellow":150,"green":200,"dark-blue":200
};
var COLOR_GROUPS = {
  "brown":[1,3],"light-blue":[6,8,9],"pink":[11,13,14],
  "orange":[16,18,19],"red":[21,23,24],"yellow":[26,27,29],
  "green":[31,32,34],"dark-blue":[37,39],
  "station":[5,15,25,35],"utility":[12,28]
};

// --- CARDS --------------------------------------------------
var CHANCE_CARDS = [
  {title:"EXCEPTIONAL.",              spriteIdx:0,  text:"Romain vient de faire un autre S+ League of Legends!\nRentrez chez lui pour continuer le strike!\n\nIF YOU PASS GO, COLLECT "+M+"200.",       action: function(p){ advanceTo(p,0); }},
  {title:"SPONTANEOUS TRIP ALERT.",   spriteIdx:1,  text:"Vous venez d'acheter des billets d'avion pour dans 3 jours.\n\nPAYEZ "+M+"50 DE FRAIS DE BAGAGE EN RETARD.",                                  action: function(p){ charge(p,50); }},
  {title:"G2 GAGNE.",                 spriteIdx:2,  text:"The crowd goes wild. Advance to the nearest station.\n\nIF YOU PASS GO, COLLECT "+M+"200.",                                                     action: function(p){ advanceToNearest(p,'station'); }},
  {title:"SIESTE STRATEGIQUE.",       spriteIdx:3,  text:"Tu t'es endormi dans le metro do Porto.\n\nSKIP YOUR NEXT TURN.",                                                                               action: function(p){ p.skipTurns=(p.skipTurns||0)+1; showCardEffect('skip'); }},
  {title:"BILLET DE BANQUE.",         spriteIdx:4,  text:"Tu retrouves un billet dans ta vieille veste.\n\nCOLLECT "+M+"20.",                                                                            action: function(p){ collect(p,20); showCardEffect('collect'); }},
  {title:"VIENNOISERIE DE TROP.",     spriteIdx:5,  text:"C'etait tellement bon mais...\nWorth it.\n\nPAY "+M+"20 TO THE BANK.",                                                                         action: function(p){ charge(p,20); showCardEffect('pay'); }},
  {title:"TU T'ES PERDU A BARCELONE.",spriteIdx:6,  text:"C'est romantique, en fait.\n\nGO BACK 3 SPACES.",                                                                                              action: function(p){ moveRelative(p,-3); }},
  {title:"DATE NIGHT REUSSI.",        spriteIdx:7,  text:"Film, pop-corn, bonne humeur.\n\nADVANCE TO CINEPLANET ANTIBES.",                                                                              action: function(p){ advanceTo(p,16); }},
  {title:"OLIVIERS CUEILLIS.",        spriteIdx:8,  text:"T'as aide a la ferme de mamie comme un pro.\n\nTOUCHE "+M+"50.",                                                                               action: function(p){ collect(p,50); showCardEffect('collect'); }},
  {title:"PETIT VOYAGE SPONTANE.",    spriteIdx:9,  text:"On part quand? Maintenant.\n\nAdvance to AEROPORT DE NICE.",                                                                                   action: function(p){ advanceTo(p,15); }},
  {title:"AFTERWORK IMPROVISE.",      spriteIdx:10, text:"Hop Store, une biere, la belle vie.\n\nCOLLECT "+M+"20 FROM EVERY PLAYER.",                                                                    action: function(p){ collectFromAll(p,20); showCardEffect('collect'); }},
  {title:"G2 PERD.",                  spriteIdx:11, text:"C'est dur. Restez dignes.\n\nPAY "+M+"20 EN FRAIS DE CONSOLATION (SNACKS).",                                                                   action: function(p){ charge(p,20); showCardEffect('pay'); }},
  {title:"JOUR DE PLUIE A ANTIBES.",  spriteIdx:12, text:"Chocolat viennois au Cafe Kanter.\n\nCOLLECT "+M+"20, SOME DAYS ARE JUST GOOD.",                                                              action: function(p){ collect(p,20); showCardEffect('collect'); }},
  {title:"CACHORINHOS AU DOG.",       spriteIdx:13, text:"Best meal ever, EVERYONE agrees.\n\nMove to THE DOG. IF YOU PASS GO, COLLECT "+M+"200.",                                                       action: function(p){ advanceTo(p,24); }},
  {title:"MINI GOLF SHOCK.",          spriteIdx:14, text:"T'as perdu au mini golf. Personne n'en parle mais tout le monde s'en souvient.\n\nPAY "+M+"20.",                                               action: function(p){ charge(p,20); showCardEffect('pay'); }},
  {title:"COUP DE CHANCE.",           spriteIdx:15, text:"La vie est belle, Antibes est belle, vous etes beaux.\n\nCOLLECT "+M+"150.",                                                                   action: function(p){ collect(p,150); showCardEffect('collect'); }}
];

var COMMUNITY_CARDS = [
  {title:"ET SI? - Premier rendez-vous.",    spriteIdx:19,   text:"Pasta de la Mama, un soir de semaine, et tout a change.\n\nCOLLECT "+M+"200. BEST INVESTMENT EVER.",              action: function(p){ collect(p,200); showCardEffect('collect'); }},
  {title:"ET SI? - Rester au lit.",          spriteIdx:null, text:"Et si on restait au lit? Bonne idee.\n\nSKIP YOUR NEXT TURN - no regrets.",                                        action: function(p){ p.skipTurns=(p.skipTurns||0)+1; showCardEffect('skip'); }},
  {title:"ET SI? - Porto.",                  spriteIdx:null, text:"Et si on allait a Porto?\nVOL TROUVE, VALISE FAITE.\n\nCOLLECT "+M+"100.",                                         action: function(p){ collect(p,100); showCardEffect('collect'); }},
  {title:"ET SI? - Brunch.",                 spriteIdx:null, text:"Et si on faisait un brunch?\nCHA BOTE, DIMANCHE, SOLEIL.\n\nCOLLECT "+M+"50.",                                     action: function(p){ collect(p,50); showCardEffect('collect'); }},
  {title:"ET SI? - Heritage de mamie.",      spriteIdx:null, text:"ELLE T'A LAISSE UN BOCAL D'HUILE D'OLIVE ET UNE GLACE.\n\n"+M+"80 ARE YOURS TO COLLECT.",                          action: function(p){ collect(p,80); showCardEffect('collect'); }},
  {title:"ET SI? - Quiz ce soir.",           spriteIdx:24,   text:"LA FOURMILLIERE, VOUS GAGNEZ (EVIDEMMENT).\n\nCOLLECT "+M+"25 FROM EACH PLAYER.",                                 action: function(p){ collectFromAll(p,25); showCardEffect('collect'); }},
  {title:"ET SI? - Chocolat viennois.",      spriteIdx:25,   text:"Cafe Kanter, apres le taf, vous etes seuls au monde.\n\nCOLLECT "+M+"20.",                                         action: function(p){ collect(p,20); showCardEffect('collect'); }},
  {title:"ET SI? - Un film.",                spriteIdx:26,   text:"Soiree canape. Trop bien.\n\nNo rent charged this turn.",                                                           action: function(p){ p.freeRentThisTurn=true; log(p.name+" - free rent this turn!","important"); }},
  {title:"ET SI? - Petit falafel.",          spriteIdx:null, text:"NOTRE COIN CACHE. COMME D'HAB.\n\nGET "+M+"30.",                                                                   action: function(p){ collect(p,30); showCardEffect('collect'); }},
  {title:"ET SI? - Reparations imprevues.",  spriteIdx:28,   text:"SOMETHING BROKE. (we won't point fingers)\n\nPAY "+M+"100 TO THE BANK.",                                           action: function(p){ charge(p,100); showCardEffect('pay'); }},
  {title:"ET SI? - Bloc Party.",             spriteIdx:null, text:"Samedi matin. CLIMBING, LUNCH, THE WHOLE RITUAL.\n\nGET "+M+"40.",                                                 action: function(p){ collect(p,40); showCardEffect('collect'); }},
  {title:"ET SI? - Nuit a l'aeroport.",      spriteIdx:30,   text:"Il veille sur toi pendant que tu dors.\n\nPRICELESS. REMEMBER THIS THO.",                                          action: function(p){ log(p.name+" - precious moment","good"); }},
  {title:"ET SI? - Serenade involontaire.",  spriteIdx:31,   text:"T'as chante en cuisine sans t'en rendre compte.\n0 mais tout le monde sourit.",                                    action: function(p){ log(p.name+" - everyone smiles","good"); }},
  {title:"ET SI? - Voir la mer.",            spriteIdx:32,   text:"Il est peut-etre 3h du matin, mais tu n'es pas pret a rentrer.\n\nCOLLECT "+M+"60.",                              action: function(p){ collect(p,60); showCardEffect('collect'); }},
  {title:"ET SI? - Sortie culturelle.",      spriteIdx:23,   text:"Sagrada Familia, il etait temps.\n\nADVANCE TO SAGRADA FAMILIA.",                                                  action: function(p){ advanceTo(p,32); }},
  {title:"ET SI? - Frais medicaux.",         spriteIdx:null, text:"Trop de viennoiseries.\n\nPAY "+M+"100. A REFAIRE TOUT DE MEME.",                                                  action: function(p){ charge(p,100); showCardEffect('pay'); }}
];

// --- CARD EFFECT OVERLAY ------------------------------------
function showCardEffect(type) {
  var overlay = document.getElementById('card-effect-overlay');
  var icon    = document.getElementById('card-effect-icon');
  var map = { collect:'💰', pay:'😬', skip:'💤', move:'🚀', jail:'⛓' };
  icon.textContent = map[type] || '✨';
  overlay.classList.remove('hidden');
  overlay.classList.add('effect-pop');
  setTimeout(function() {
    overlay.classList.remove('effect-pop');
    overlay.classList.add('hidden');
  }, 900);
}

// --- RULES --------------------------------------------------
var RULES_HTML = '<h2>How to Play</h2>' +
  '<p><strong>Goal:</strong> Be the last player with money. Bankrupt all opponents.</p>' +
  '<p><strong>On your turn:</strong> Roll the dice and move your token clockwise around the board.</p>' +
  '<p><strong>Buying property:</strong> Land on an unowned property and choose to buy it. If you don\'t buy, it stays unowned.</p>' +
  '<p><strong>Paying rent:</strong> Land on someone else\'s property and pay them rent. Rent increases if they own the full colour set, and further with each house or hotel.</p>' +
  '<p><strong>Complete colour sets:</strong> Own every property in a colour group to double the base rent and unlock building.</p>' +
  '<p><strong>Building:</strong> Once you own a full colour set, build houses (up to 4) and then a hotel using the Build button. Build evenly across the set.</p>' +
  '<p><strong>Stations:</strong> Rent doubles for each additional station owned: 1='+M+'25, 2='+M+'50, 3='+M+'100, 4='+M+'200.</p>' +
  '<p><strong>Utilities:</strong> Rent is 4x dice total if you own one, 10x if you own both.</p>' +
  '<p><strong>GO:</strong> Collect '+M+'200 every time you pass or land on GO.</p>' +
  '<p><strong>Income Tax:</strong> Pay '+M+'150 to the bank (goes into Free Parking pot).</p>' +
  '<p><strong>Luxury Tax:</strong> Pay '+M+'100 to the bank (goes into Free Parking pot).</p>' +
  '<p><strong>Free Parking:</strong> Collect all the tax money accumulated in the pot.</p>' +
  '<p><strong>Jail:</strong> Go to Jail if you land on "Go to Jail", or roll doubles 3 times in a row. In jail, roll doubles to get out free, or pay '+M+'50 on any turn.</p>' +
  '<p><strong>Doubles:</strong> Roll doubles to take an extra turn. Three doubles in a row sends you to jail.</p>' +
  '<p><strong>Chance cards:</strong> Follow the instructions. Some move you, some pay you, some cost you.</p>' +
  '<p><strong>Et Si? cards:</strong> Community chest variant — mostly good, occasionally spicy.</p>' +
  '<p><strong>Trading:</strong> Use the Trade button on your turn to exchange properties and money with any player.</p>' +
  '<p><strong>Bankruptcy:</strong> If you can\'t pay a debt, you\'re out. All your properties return to the bank.</p>';

// --- TOKENS -------------------------------------------------
var TOKEN_EMOJIS = ['🎩','🚂','🐕','👠','🚗','⛵'];
var TOKEN_COLORS = ['#c23b2e','#3a62a0','#3a7c55','#c5703a','#7b4fbf','#1a9090'];

// --- GAME STATE ---------------------------------------------
var G = {
  players:[], current:0, phase:'rolling',
  properties:{}, chanceDeck:[], communityDeck:[],
  freeParkingPot:0, doublesCount:0, lastDice:[0,0]
};

// --- MULTIPLAYER --------------------------------------------
var MP = {
  mode:'local', peer:null, myPeerId:null,
  connections:[], myPlayerIndex:-1, roomCode:null
};

function genRoomCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random()*chars.length)];
  return code;
}
function mpEnabled() { return MP.mode !== 'local'; }
function isMyTurn()  { return !mpEnabled() || G.current === MP.myPlayerIndex; }

function mpSendAll(msg) {
  MP.connections.forEach(function(conn) {
    try { if(conn.open) conn.send(msg); } catch(e){}
  });
}
function mpOnData(data) {
  if (data.type==='state')         applyRemoteState(data.state);
  else if (data.type==='action' && MP.mode==='host') handleRemoteAction(data);
  else if (data.type==='player_joined') log(data.name+' joined!','good');
}
function applyRemoteState(state) {
  G.players=state.players; G.current=state.current; G.phase=state.phase;
  G.properties=state.properties; G.freeParkingPot=state.freeParkingPot;
  G.doublesCount=state.doublesCount; G.lastDice=state.lastDice;
  G.chanceDeck   =state.chanceOrder.map(function(i){return CHANCE_CARDS[i];});
  G.communityDeck=state.communityOrder.map(function(i){return COMMUNITY_CARDS[i];});
  if(state.lastDice[0]){
    document.getElementById('die1').textContent=state.lastDice[0];
    document.getElementById('die2').textContent=state.lastDice[1];
    document.getElementById('dice-total').textContent='Total: '+(state.lastDice[0]+state.lastDice[1]);
  }
  renderAll(); updateMpBar(); syncActionButtons();
}
function serializeState() {
  return {
    players:G.players,current:G.current,phase:G.phase,properties:G.properties,
    freeParkingPot:G.freeParkingPot,doublesCount:G.doublesCount,lastDice:G.lastDice,
    chanceOrder:G.chanceDeck.map(function(c){return CHANCE_CARDS.indexOf(c);}),
    communityOrder:G.communityDeck.map(function(c){return COMMUNITY_CARDS.indexOf(c);})
  };
}
function hostBroadcastState() {
  if(MP.mode==='host') mpSendAll({type:'state',state:serializeState()});
}
function handleRemoteAction(data) {
  if(data.playerIndex!==G.current) return;
  switch(data.action){
    case 'roll':    rollDice(true); break;
    case 'buy':     buyProperty(true); break;
    case 'endTurn': endTurn(true); break;
    case 'payJail': payJail(true); break;
    case 'build':   buildHouse(data.squareId,data.dir,true); break;
    case 'trade':   executeTrade(data.tradeData,true); break;
  }
}
function clientSendAction(action,extra) {
  if(!MP.connections.length) return;
  var msg=Object.assign({type:'action',action:action,playerIndex:MP.myPlayerIndex},extra||{});
  try{MP.connections[0].send(msg);}catch(e){}
}
function syncActionButtons() {
  var my=isMyTurn(), rolling=G.phase==='rolling';
  setDis('btn-roll',    !my||!rolling);
  setDis('btn-buy',     !my);
  setDis('btn-pass',    !my);
  setDis('btn-pay-jail',!my);
  var yt=document.getElementById('mp-your-turn');
  if(mpEnabled()) yt.classList.toggle('hidden',!my||!rolling);
}
function setDis(id,v){ var e=document.getElementById(id); if(e) e.disabled=v; }
function updateMpBar() {
  if(!mpEnabled()) return;
  var open=MP.connections.filter(function(c){return c.open;}).length;
  document.getElementById('mp-dot').className='mp-dot'+(open>0?'':' off');
  document.getElementById('mp-peers-info').textContent=(open+1)+' player'+(open>0?'s':'')+' connected';
  syncActionButtons();
}

// --- SETUP --------------------------------------------------
var setupPlayers=[], mpTab='local';

function initSetup() {
  setupPlayers=[{name:'Player 1',tokenIdx:0},{name:'Player 2',tokenIdx:1}];
  renderSetup(); initPeer();
}

function initPeer() {
  MP.roomCode=genRoomCode();
  var peerId='mnply-'+MP.roomCode.toLowerCase();
  try {
    MP.peer=new Peer(peerId);
    MP.peer.on('open',function(id){
      MP.myPeerId=id;
      document.getElementById('host-code').textContent=MP.roomCode;
      document.getElementById('host-status').textContent='Share this code - waiting for players...';
    });
    MP.peer.on('connection',function(conn){
      conn.on('open',function(){
        MP.connections.push(conn);
        log('A player joined!','good');
        if(G.players.length>0) hostBroadcastState();
        updateMpBar();
      });
      conn.on('data',mpOnData);
      conn.on('close',function(){
        MP.connections=MP.connections.filter(function(c){return c!==conn;});
        log('A player disconnected.','bad'); updateMpBar();
      });
    });
    MP.peer.on('error',function(err){
      if(err.type==='unavailable-id'){MP.peer.destroy();setTimeout(initPeer,400);}
      else { document.getElementById('host-status').textContent='Error: '+err.message; }
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
  if(!code||code.length<3){setJoinStatus('Enter a valid room code.',true);return;}
  if(!MP.peer){setJoinStatus('Not ready yet - try again.',true);return;}
  setJoinStatus('Connecting to room '+code+'...');
  var conn=MP.peer.connect('mnply-'+code.toLowerCase(),{reliable:true});
  conn.on('open',function(){
    MP.mode='client'; MP.connections=[conn]; MP.myPlayerIndex=1;
    setJoinStatus('Connected! Waiting for host to start...',false,true);
    conn.send({type:'player_joined',name:setupPlayers[0]?setupPlayers[0].name:'Guest'});
  });
  conn.on('data',function(data){
    mpOnData(data);
    if(data.type==='state'&&document.getElementById('setup-screen').classList.contains('active')) launchGameScreen();
  });
  conn.on('error',function(){setJoinStatus('Could not connect. Check the code.',true);});
  conn.on('close',function(){log('Disconnected from host.','bad');updateMpBar();});
  setTimeout(function(){if(!conn.open)setJoinStatus('Could not reach that room. Is the code correct?',true);},7000);
}

function setJoinStatus(msg,err,ok) {
  var el=document.getElementById('join-status');
  el.textContent=msg;
  el.className='mp-status'+(err?' err':(ok?' ok':''));
}

function renderSetup() {
  var el=document.getElementById('player-list'); el.innerHTML='';
  setupPlayers.forEach(function(p,i){
    var row=document.createElement('div'); row.className='player-row';
    row.innerHTML='<input type="text" value="'+p.name+'" placeholder="Player name" oninput="setupPlayers['+i+'].name=this.value" />'+
      '<span class="token-pick" onclick="cycleToken('+i+')">'+ TOKEN_EMOJIS[p.tokenIdx]+'</span>'+
      (setupPlayers.length>2?'<button class="remove-player" onclick="removePlayer('+i+')">x</button>':'');
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
  finishStartGame();
}

function finishStartGame() {
  G.players=setupPlayers.map(function(p,i){
    return {name:p.name.trim()||('Player '+(i+1)),token:TOKEN_EMOJIS[p.tokenIdx],color:TOKEN_COLORS[p.tokenIdx],
      money:1500,pos:0,inJail:false,jailTurns:0,jailFreeCards:0,bankrupt:false,skipTurns:0,freeRentThisTurn:false,properties:[]};
  });
  G.chanceDeck=shuffle(CHANCE_CARDS.slice());
  G.communityDeck=shuffle(COMMUNITY_CARDS.slice());
  G.properties={}; G.current=0; G.phase='rolling'; G.doublesCount=0; G.freeParkingPot=0; G.lastDice=[0,0];
  launchGameScreen();
  log('Game started! '+G.players.map(function(p){return p.token+' '+p.name;}).join(', '),'important');
  log(curPlayer().name+"'s turn. Roll the dice!");
  if(MP.mode==='host') hostBroadcastState();
  if(mpEnabled()) updateMpBar();
}

function launchGameScreen() {
  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  if(mpEnabled()){
    document.getElementById('mp-bar').classList.remove('hidden');
    document.getElementById('mp-room-code').textContent=MP.roomCode||'--';
    document.body.classList.add('has-bar');
  }
  renderAll(); sizeBoard();
}

// --- HELPERS ------------------------------------------------
function curPlayer(){return G.players[G.current];}
function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}
function dr(){return Math.floor(Math.random()*6)+1;}

function log(msg,cls){
  var el=document.getElementById('log-entries');
  var d=document.createElement('div');
  d.className='log-entry '+(cls||''); d.textContent=msg;
  el.prepend(d);
  while(el.children.length>100) el.removeChild(el.lastChild);
}

// --- FINANCE ------------------------------------------------
function collect(player,amount){player.money+=amount;log(player.name+' collects '+fmt(amount),'good');renderPlayers();}
function charge(player,amount,recipient){
  player.money-=amount;
  if(recipient){recipient.money+=amount;log(player.name+' pays '+fmt(amount)+' to '+recipient.name+'.','bad');}
  else{log(player.name+' pays '+fmt(amount)+' to bank.','bad');}
  if(player.money<0) checkBankruptcy(player);
  renderPlayers();
}
function collectFromAll(player,amount){
  G.players.forEach(function(other){
    if(other!==player&&!other.bankrupt){other.money-=amount;player.money+=amount;if(other.money<0)checkBankruptcy(other);}
  });
  log(player.name+' collects '+fmt(amount)+' from each player!','good'); renderPlayers();
}
function checkBankruptcy(player){
  if(player.money>=0) return;
  player.bankrupt=true;
  player.properties.forEach(function(id){delete G.properties[id];}); player.properties=[];
  log(player.name+' is BANKRUPT!','bad'); renderAll();
  var alive=G.players.filter(function(p){return !p.bankrupt;});
  if(alive.length===1) showWinner(alive[0]);
}

// --- MOVEMENT -----------------------------------------------
function advanceTo(player,targetId){
  if(targetId<player.pos) collect(player,200);
  player.pos=targetId; renderTokens();
}
function moveRelative(player,steps){
  var np=(player.pos+steps+40)%40;
  if(steps>0&&np<player.pos) collect(player,200);
  player.pos=np; renderTokens(); landOn(player);
}
function advanceToNearest(player,type){
  var ids=SQUARES.filter(function(s){return s.type===type;}).map(function(s){return s.id;});
  var best=ids[0],bestDist=40;
  ids.forEach(function(id){var d=(id-player.pos+40)%40;if(d<bestDist){bestDist=d;best=id;}});
  if(best<player.pos) collect(player,200);
  player.pos=best; log(player.name+' advances to '+SQUARES[best].name,'important');
  renderTokens(); landOn(player);
}
function getRent(sqId,diceTotal){
  var sq=SQUARES[sqId],prop=G.properties[sqId];
  if(!prop) return 0;
  var owner=G.players[prop.owner];
  if(!owner||owner.bankrupt) return 0;
  if(sq.type==='station'){var n=COLOR_GROUPS.station.filter(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;}).length;return [25,50,100,200][n-1]||25;}
  if(sq.type==='utility'){var nu=COLOR_GROUPS.utility.filter(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;}).length;return nu===2?10*diceTotal:4*diceTotal;}
  var table=RENT[sq.group]; if(!table) return 0;
  if(prop.houses>0) return table[Math.min(prop.houses+1,table.length-1)];
  var group=COLOR_GROUPS[sq.group]||[];
  var ownsAll=group.every(function(id){return G.properties[id]&&G.properties[id].owner===prop.owner;});
  return ownsAll?table[1]:table[0];
}

// --- DICE & TURNS -------------------------------------------
function rollDice(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){clientSendAction('roll');return;}
  var p=curPlayer();
  if(p.bankrupt||G.phase!=='rolling') return;
  if(p.skipTurns>0){p.skipTurns--;log(p.name+' skips their turn.');nextTurn();return;}
  var d1=dr(),d2=dr(),total=d1+d2,doubles=d1===d2;
  G.lastDice=[d1,d2];
  animDice(d1,d2,total,doubles);
  if(p.inJail){
    if(doubles){p.inJail=false;p.jailTurns=0;G.doublesCount=0;log(p.name+' rolled doubles - out of jail!','good');movePlayer(p,total);}
    else{p.jailTurns++;if(p.jailTurns>=3){charge(p,50);p.inJail=false;p.jailTurns=0;log(p.name+' pays '+M+'50 to leave jail.');movePlayer(p,total);}
    else{log(p.name+' stays in jail ('+p.jailTurns+'/3). Pay '+M+'50 or roll doubles.');G.phase='moved';showEndTurnButton();}}
    if(MP.mode==='host') hostBroadcastState(); return;
  }
  if(doubles){G.doublesCount++;if(G.doublesCount>=3){log(p.name+' rolled 3 doubles - GO TO JAIL!','bad');sendToJail(p);G.doublesCount=0;G.phase='moved';showEndTurnButton();if(MP.mode==='host')hostBroadcastState();return;}}
  else{G.doublesCount=0;}
  movePlayer(p,total);
  if(MP.mode==='host') hostBroadcastState();
}

function animDice(d1,d2,total,doubles){
  var e1=document.getElementById('die1'),e2=document.getElementById('die2');
  e1.classList.add('rolling');e2.classList.add('rolling');
  setTimeout(function(){
    e1.classList.remove('rolling');e2.classList.remove('rolling');
    e1.textContent=d1;e2.textContent=d2;
    document.getElementById('dice-total').textContent='Total: '+total+(doubles?' - DOUBLES!':'');
  },460);
}

function movePlayer(player,steps){
  G.phase='moved';
  var old=player.pos;
  player.pos=(player.pos+steps)%40;
  renderTokens();
  setTimeout(function(){
    if(old+steps>=40){collect(player,200);log(player.name+' passes GO - collect '+M+'200!','good');}
    landOn(player);
  },560);
}

function landOn(player){
  var sq=SQUARES[player.pos];
  log(player.name+' lands on '+sq.name);
  var freeRent=player.freeRentThisTurn; player.freeRentThisTurn=false;
  switch(sq.type){
    case 'go':      collect(player,200); break;
    case 'tax':     charge(player,sq.price); G.freeParkingPot+=sq.price; updateBank(); break;
    case 'gotojail':sendToJail(player); break;
    case 'jail': break;
    case 'parking':
      if(G.freeParkingPot>0){var pot=G.freeParkingPot;G.freeParkingPot=0;collect(player,pot);log(player.name+' collects Free Parking pot: '+fmt(pot)+'!','good');updateBank();}
      break;
    case 'chance':   drawCard('chance',player);    return;
    case 'community':drawCard('community',player); return;
    case 'property': case 'station': case 'utility':
      handleProperty(player,sq,freeRent); return;
  }
  showPostMoveButtons(player);
  if(MP.mode==='host') hostBroadcastState();
}

function handleProperty(player,sq,freeRent){
  var prop=G.properties[sq.id];
  if(!prop){showBuyButton(player,sq);showEndTurnButton();if(MP.mode==='host')hostBroadcastState();return;}
  var owner=G.players[prop.owner];
  if(owner===player||owner.bankrupt||freeRent){if(freeRent)log(player.name+' - free rent card!');showEndTurnButton();if(MP.mode==='host')hostBroadcastState();return;}
  var rent=getRent(sq.id,G.lastDice[0]+G.lastDice[1]);
  if(rent>0) charge(player,rent,owner);
  showEndTurnButton();
  if(MP.mode==='host') hostBroadcastState();
}

function showPostMoveButtons(player){
  var sq=SQUARES[player.pos];
  if(!G.properties[sq.id]&&(sq.type==='property'||sq.type==='station'||sq.type==='utility')) showBuyButton(player,sq);
  showEndTurnButton();
}
function showBuyButton(player,sq){
  var btn=document.getElementById('btn-buy');
  btn.classList.remove('hidden'); btn.dataset.squareId=sq.id;
  btn.textContent='Buy '+sq.name+' ('+fmt(sq.price)+')';
}
function showEndTurnButton(){
  document.getElementById('btn-pass').classList.remove('hidden');
  setDis('btn-roll',true);
  if(curPlayer().inJail) document.getElementById('btn-pay-jail').classList.remove('hidden');
  syncActionButtons();
}

function payJail(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){clientSendAction('payJail');return;}
  var p=curPlayer(); if(!p.inJail) return;
  charge(p,50); p.inJail=false; p.jailTurns=0;
  log(p.name+' pays '+M+'50 and leaves jail.','important');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  G.phase='rolling'; setDis('btn-roll',false); syncActionButtons();
  if(MP.mode==='host') hostBroadcastState();
}

function buyProperty(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){clientSendAction('buy');return;}
  var p=curPlayer(),id=parseInt(document.getElementById('btn-buy').dataset.squareId,10),sq=SQUARES[id];
  if(p.money<sq.price){log(p.name+" can't afford "+sq.name+'!','bad');return;}
  charge(p,sq.price); G.properties[id]={owner:G.current,houses:0}; p.properties.push(id);
  log(p.name+' buys '+sq.name+' for '+fmt(sq.price)+'!','good');
  document.getElementById('btn-buy').classList.add('hidden'); renderPlayers();
  if(MP.mode==='host') hostBroadcastState();
}

function endTurn(fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){clientSendAction('endTurn');return;}
  document.getElementById('btn-buy').classList.add('hidden');
  document.getElementById('btn-pass').classList.add('hidden');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  setDis('btn-roll',false);
  document.getElementById('dice-total').textContent='';
  var p=curPlayer();
  if(G.lastDice[0]===G.lastDice[1]&&G.doublesCount>0&&!p.inJail){
    G.phase='rolling';log(p.name+' rolled doubles - roll again!','important');renderTurnInfo();syncActionButtons();
    if(MP.mode==='host') hostBroadcastState(); return;
  }
  nextTurn();
}

function nextTurn(){
  G.lastDice=[0,0];
  document.getElementById('die1').textContent='·';
  document.getElementById('die2').textContent='·';
  document.getElementById('btn-buy').classList.add('hidden');
  document.getElementById('btn-pass').classList.add('hidden');
  document.getElementById('btn-pay-jail').classList.add('hidden');
  setDis('btn-roll',false);
  var next=(G.current+1)%G.players.length,loops=0;
  while(G.players[next].bankrupt&&loops<G.players.length){next=(next+1)%G.players.length;loops++;}
  G.current=next; G.phase='rolling'; G.doublesCount=0;
  renderAll();
  log('-- '+curPlayer().name+"'s turn --",'important');
  if(MP.mode==='host') hostBroadcastState();
}

function sendToJail(player){player.pos=10;player.inJail=true;player.jailTurns=0;renderTokens();log(player.name+' is sent to JAIL!','bad');}

// --- CARDS --------------------------------------------------
var pendingCardAction=null;

function drawCard(type,player) {
  var deck=type==='chance'?G.chanceDeck:G.communityDeck;
  var card=deck.shift(); deck.push(card);

  // Build card visual using sprite sheet
  var popup   = document.getElementById('card-popup');
  var imgEl   = document.getElementById('card-sprite-display');
  var textEl  = document.getElementById('card-popup-text');
  var labelEl = document.getElementById('card-type-label');
  var titleEl = document.getElementById('card-title-display');

  labelEl.textContent = type==='chance'?'Chance':'Et Si?';
  labelEl.className   = 'card-type-label '+(type==='chance'?'chance':'community');
  titleEl.textContent = '';  // title is on the card image

  // Show sprite if available
  if (card.spriteIdx !== null && card.spriteIdx !== undefined) {
    var pos = SPRITE.pos(card.spriteIdx);
    // Display at 2x scale for readability: 488x314 viewport showing 244x157 portion
    imgEl.style.display      = 'block';
    imgEl.style.width        = '488px';
    imgEl.style.height       = '314px';
    imgEl.style.backgroundImage  = 'url("'+SPRITE.sheet+'")';
    imgEl.style.backgroundSize   = (1220*2)+'px '+(1099*2)+'px';
    imgEl.style.backgroundPosition = (pos.x*2)+'px '+(pos.y*2)+'px';
    imgEl.style.backgroundRepeat = 'no-repeat';
    textEl.style.display = 'none';
  } else {
    // No sprite - show text
    imgEl.style.display  = 'none';
    textEl.style.display = 'block';
    textEl.textContent   = card.text;
  }

  // Animate card flip in
  popup.classList.remove('hidden');
  var inner = document.getElementById('card-popup-inner');
  inner.classList.remove('card-flip');
  void inner.offsetWidth; // reflow
  inner.classList.add('card-flip');

  var p=player;
  pendingCardAction=function(){card.action(p);showPostMoveButtons(p);};
  if(MP.mode==='host') hostBroadcastState();
}

function dismissCard(){
  document.getElementById('card-popup').classList.add('hidden');
  if(pendingCardAction){pendingCardAction();pendingCardAction=null;}
  renderAll();
  if(MP.mode==='host') hostBroadcastState();
}

// --- RULES POPUP --------------------------------------------
function openRules(){ showModal(RULES_HTML); }

// --- MODAL: PROPERTIES --------------------------------------
function openProperties(){
  var gc={'brown':'#7B3F1A','light-blue':'#6bbfd4','pink':'#e05a8a','orange':'#e07820','red':'#cc2020','yellow':'#d4aa00','green':'#2a8040','dark-blue':'#1a3a8a','station':'#555','utility':'#888'};
  var skip={go:1,tax:1,jail:1,gotojail:1,parking:1,chance:1,community:1};
  var groups={};
  SQUARES.forEach(function(sq){if(!sq.group||skip[sq.type])return;if(!groups[sq.group])groups[sq.group]=[];groups[sq.group].push(sq);});
  var html='<h2>Properties</h2>';
  Object.keys(groups).forEach(function(g){
    html+='<div class="prop-group"><div class="prop-group-title">'+g.toUpperCase()+'</div>';
    groups[g].forEach(function(sq){
      var prop=G.properties[sq.id],owner=prop?G.players[prop.owner]:null,h=prop?prop.houses:0;
      var hs=h===0?'':(h===5?'Hotel':'x'+h+' Houses');
      html+='<div class="prop-item" style="border-left-color:'+(gc[g]||'#aaa')+'">'+
        '<span>'+sq.name+'</span>'+
        '<span>'+(owner?'<span class="prop-owner">'+owner.token+' '+owner.name+'</span>':'')+
        (hs?'<span class="prop-houses"> '+hs+'</span>':'')+'</span></div>';
    });
    html+='</div>';
  });
  showModal(html);
}

// --- MODAL: TRADE -------------------------------------------
function openTrade(){
  var p=curPlayer(),others=G.players.filter(function(o){return !o.bankrupt&&o!==p;});
  if(!others.length){showModal('<h2>No other active players to trade with!</h2>');return;}
  var html='<h2>Trade</h2>'+
    '<div class="trade-section"><label>Trade with</label><select id="trade-partner">'+
    others.map(function(o){return '<option value="'+G.players.indexOf(o)+'">'+o.token+' '+o.name+'</option>';}).join('')+
    '</select></div>'+
    '<div class="trade-section"><label>You offer ('+M+')</label><input type="number" id="trade-offer-money" value="0" min="0" max="'+p.money+'" /></div>'+
    '<div class="trade-section"><label>Your properties to give</label><div class="trade-checkboxes">'+
    (p.properties.length?p.properties.map(function(id){return '<label><input type="checkbox" class="trade-give-prop" value="'+id+'"> '+SQUARES[id].name+'</label>';}).join(''):'<span style="color:var(--text3)">None</span>')+
    '</div></div>'+
    '<div class="trade-section"><label>You receive ('+M+')</label><input type="number" id="trade-recv-money" value="0" min="0" /></div>'+
    '<div class="trade-section"><label>Their properties to receive</label><div class="trade-checkboxes" id="trade-recv-props"></div></div>'+
    '<div class="modal-actions"><button class="btn-action" onclick="executeTrade()">Confirm Trade</button><button class="btn-action secondary" onclick="closeModalForce()">Cancel</button></div>';
  showModal(html);
  function upd(){var pi=parseInt(document.getElementById('trade-partner').value,10),partner=G.players[pi];
    document.getElementById('trade-recv-props').innerHTML=partner.properties.length?partner.properties.map(function(id){return '<label><input type="checkbox" class="trade-recv-prop" value="'+id+'"> '+SQUARES[id].name+'</label>';}).join(''):'<span style="color:var(--text3)">None</span>';}
  upd(); document.getElementById('trade-partner').addEventListener('change',upd);
}

function executeTrade(tradeData,fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){
    var td2={pi:parseInt(document.getElementById('trade-partner').value,10),om:parseInt(document.getElementById('trade-offer-money').value,10)||0,rm:parseInt(document.getElementById('trade-recv-money').value,10)||0,
      gp:[].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){return parseInt(e.value,10);}),
      rp:[].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){return parseInt(e.value,10);})};
    clientSendAction('trade',{tradeData:td2}); closeModalForce(); return;
  }
  var td=tradeData||{pi:parseInt(document.getElementById('trade-partner').value,10),om:parseInt(document.getElementById('trade-offer-money').value,10)||0,rm:parseInt(document.getElementById('trade-recv-money').value,10)||0,
    gp:[].slice.call(document.querySelectorAll('.trade-give-prop:checked')).map(function(e){return parseInt(e.value,10);}),
    rp:[].slice.call(document.querySelectorAll('.trade-recv-prop:checked')).map(function(e){return parseInt(e.value,10);})};
  var p=curPlayer(),partner=G.players[td.pi];
  if(td.om>p.money){alert(p.name+" doesn't have "+fmt(td.om)+'!');return;}
  if(td.rm>partner.money){alert(partner.name+" doesn't have "+fmt(td.rm)+'!');return;}
  p.money-=td.om;partner.money+=td.om;partner.money-=td.rm;p.money+=td.rm;
  td.gp.forEach(function(id){G.properties[id].owner=td.pi;p.properties=p.properties.filter(function(x){return x!==id;});partner.properties.push(id);});
  td.rp.forEach(function(id){G.properties[id].owner=G.current;partner.properties=partner.properties.filter(function(x){return x!==id;});p.properties.push(id);});
  log('Trade: '+p.name+' <-> '+partner.name,'important'); closeModalForce(); renderAll();
  if(MP.mode==='host') hostBroadcastState();
}

// --- MODAL: BUILD -------------------------------------------
function openBuildMenu(){
  var p=curPlayer();
  var buildable=p.properties.filter(function(id){
    var sq=SQUARES[id]; if(!sq.group||sq.type!=='property') return false;
    return (COLOR_GROUPS[sq.group]||[]).every(function(gid){return G.properties[gid]&&G.properties[gid].owner===G.current;});
  });
  if(!buildable.length){showModal('<h2>Build Houses</h2><p>Own a complete colour set to build. No complete sets yet.</p>');return;}
  var html='<h2>Build Houses / Hotels</h2>';
  buildable.forEach(function(id){
    var sq=SQUARES[id],prop=G.properties[id],cost=HOUSE_COST[sq.group]||100,h=prop.houses;
    var hl=h===0?'None':(h===5?'Hotel':h+' House'+(h>1?'s':''));
    html+='<div class="build-row"><div><strong>'+sq.name+'</strong><br><small style="color:var(--text3)">'+fmt(cost)+' each</small></div>'+
      '<div class="build-controls"><button class="build-btn" onclick="buildHouse('+id+',-1)">-</button>'+
      '<span class="house-display">'+hl+'</span>'+
      '<button class="build-btn" onclick="buildHouse('+id+',1)">+</button></div></div>';
  });
  html+='<div class="modal-actions"><button class="btn-action secondary" onclick="closeModalForce()">Close</button></div>';
  showModal(html);
}

function buildHouse(id,dir,fromHost){
  if(!fromHost&&mpEnabled()&&MP.mode==='client'){clientSendAction('build',{squareId:id,dir:dir});return;}
  var p=curPlayer(),sq=SQUARES[id],prop=G.properties[id],cost=HOUSE_COST[sq.group]||100;
  if(dir===1){if(prop.houses>=5)return;if(p.money<cost){log('Not enough money to build!','bad');return;}charge(p,cost);prop.houses++;log(p.name+' builds on '+sq.name+' ('+(prop.houses===5?'Hotel':'House '+prop.houses)+')','good');}
  else{if(prop.houses<=0)return;var ref=Math.floor(cost/2);prop.houses--;collect(p,ref);log(p.name+' sells house on '+sq.name+', refund '+fmt(ref));}
  renderAll(); openBuildMenu();
  if(MP.mode==='host') hostBroadcastState();
}

// --- MODAL UTILS --------------------------------------------
function showModal(html){document.getElementById('modal-content').innerHTML=html;document.getElementById('modal-overlay').classList.remove('hidden');}
function closeModal(e){if(e.target===document.getElementById('modal-overlay'))closeModalForce();}
function closeModalForce(){document.getElementById('modal-overlay').classList.add('hidden');}

// --- WINNER -------------------------------------------------
function showWinner(player){
  var d=document.createElement('div'); d.id='winner-banner';
  d.innerHTML='<div id="winner-inner"><div class="w-emoji">'+player.token+'</div><h1>'+player.name+' wins!</h1><p>'+fmt(player.money)+' in the bank &bull; '+player.properties.length+' properties</p><button class="btn-action" style="justify-content:center" onclick="location.reload()">Play Again</button></div>';
  document.body.appendChild(d);
}

// --- RENDER -------------------------------------------------
function renderAll(){renderPlayers();renderTokens();renderTurnInfo();updateBank();syncActionButtons();}

function renderPlayers(){
  var panel=document.getElementById('players-panel'); panel.innerHTML='<div class="panel-title">Players</div>';
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
  setDis('btn-roll',G.phase!=='rolling');
}

function updateBank(){
  document.getElementById('bank-display').innerHTML='Free Parking pot: '+fmt(G.freeParkingPot);
}

function renderTokens(){
  var layer=document.getElementById('tokens-layer'),cont=document.getElementById('board-container');
  var W=cont.offsetWidth,H=cont.offsetHeight;
  layer.innerHTML='';
  G.players.forEach(function(p,i){
    if(p.bankrupt) return;
    var sq=SQUARES[p.pos],pos=sq.pos;
    var same=G.players.slice(0,i).filter(function(pp){return !pp.bankrupt&&pp.pos===p.pos;}).length;
    var ox=(same%3-1)*13,oy=Math.floor(same/3)*16;
    var el=document.createElement('div'); el.className='token';
    el.style.left=(pos[0]*W+ox)+'px'; el.style.top=(pos[1]*H+oy)+'px';
    el.innerHTML='<div class="token-bubble" style="--tc:'+p.color+'">'+p.token+'</div>'+
      '<div class="token-name-tag" style="--tc:'+p.color+'">'+p.name.split(' ')[0]+'</div>';
    el.title=p.name; layer.appendChild(el);
  });
}

// --- BOARD SIZING -------------------------------------------
function sizeBoard(){
  var wrap=document.getElementById('board-wrap'),cont=document.getElementById('board-container');
  var avail=Math.min(wrap.clientWidth-24,wrap.clientHeight-24);
  cont.style.width=avail+'px'; cont.style.height=avail+'px';
  renderTokens();
}

window.addEventListener('resize',sizeBoard);

window.addEventListener('DOMContentLoaded',function(){
  initSetup(); setTimeout(sizeBoard,120);
});