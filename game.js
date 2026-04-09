/**
 * DARK REALM: SURVIVAL
 * Top-Down 2D Action-Survival Game built with Phaser 3
 *
 * Controls:
 *   WASD / Arrows : Move
 *   Mouse         : Aim
 *   LMB (hold)    : Shoot
 *   Q             : Ultimate Ability
 *   Shift         : Dash (requires upgrade)
 *   E             : Open nearby chest
 */

'use strict';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const GAME_WIDTH  = 1280;
const GAME_HEIGHT = 720;
const WORLD_WIDTH  = 3200;
const WORLD_HEIGHT = 3200;
const STAGE_DURATION = 600;   // 10 minutes in seconds
const MAX_LEVEL  = 50;
const ELITE_SPAWN_INTERVAL = 300; // seconds

// ─────────────────────────────────────────────
// WEAPON DEFINITIONS
// ─────────────────────────────────────────────
const WEAPONS = {
  dagger: {
    name:'Dagger', icon:'🗡️',
    damage:25, fireRate:150, bulletSpeed:620, bulletSize:6,
    bulletKey:'bullet_dagger', bulletColor:0x88aaff,
    pierceCount:1, knockback:80, range:420,
    ultimate:'shadowClone', description:'Fast strikes, low damage'
  },
  bow: {
    name:'Bow', icon:'🏹',
    damage:45, fireRate:500, bulletSpeed:820, bulletSize:8,
    bulletKey:'bullet_bow', bulletColor:0x44ffaa,
    pierceCount:3, knockback:50, range:720,
    ultimate:'arrowStorm', description:'Long range, piercing shots'
  },
  axe: {
    name:'Axe', icon:'🪓',
    damage:120, fireRate:1200, bulletSpeed:360, bulletSize:18,
    bulletKey:'bullet_axe', bulletColor:0xff4422,
    pierceCount:5, knockback:300, range:260,
    ultimate:'groundSlam', description:'Massive damage and knockback'
  },
  staff: {
    name:'Staff', icon:'🪄',
    damage:60, fireRate:800, bulletSpeed:460, bulletSize:14,
    bulletKey:'bullet_staff', bulletColor:0xaa44ff,
    pierceCount:2, knockback:120, range:560,
    ultimate:'meteorStrike', description:'Magic orbs that explode on impact'
  }
};

// ─────────────────────────────────────────────
// ENEMY DEFINITIONS
// ─────────────────────────────────────────────
const ENEMY_DEFS = {
  zombie : { hp:80,   speed:60,  damage:15, xp:10,  score:10,  color:0x44aa44, size:16, shape:'circle' },
  runner : { hp:40,   speed:140, damage:10, xp:15,  score:15,  color:0xcccc00, size:12, shape:'circle' },
  ranged : { hp:60,   speed:45,  damage:20, xp:20,  score:20,  color:0x4488cc, size:14, shape:'circle', isRanged:true, projSpeed:250, shootCooldown:2000 },
  tank   : { hp:350,  speed:30,  damage:40, xp:40,  score:40,  color:0x884400, size:26, shape:'rect'   },
  elite  : { hp:1200, speed:70,  damage:35, xp:150, score:200, color:0xff6600, size:32, shape:'circle', isElite:true }
};

// ─────────────────────────────────────────────
// UPGRADE POOL
// ─────────────────────────────────────────────
const UPGRADES = [
  { id:'atkspd',      name:'Swift Strikes',    desc:'Attack Speed +20%',         icon:'⚡', rarity:'common',  apply:p=>{ p.stats.fireRateMulti *= 0.80; } },
  { id:'movspd',      name:'Fleet Foot',        desc:'Move Speed +30',            icon:'💨', rarity:'common',  apply:p=>{ p.stats.speed += 30; } },
  { id:'maxhp',       name:'Fortitude',         desc:'Max HP +30',                icon:'❤️', rarity:'common',  apply:p=>{ p.stats.maxHp+=30; p.hp=Math.min(p.hp+30,p.stats.maxHp); } },
  { id:'hpregen',     name:'Regeneration',      desc:'HP Regen +3/sec',           icon:'💚', rarity:'common',  apply:p=>{ p.stats.hpRegen+=3; } },
  { id:'damage',      name:'Bloodlust',         desc:'Damage +25%',               icon:'🗡️', rarity:'common',  apply:p=>{ p.stats.damageMulti*=1.25; } },
  { id:'pierce',      name:'Piercing Shots',    desc:'Pierce +1 enemy',           icon:'→',  rarity:'rare',    apply:p=>{ p.stats.pierceBonus+=1; } },
  { id:'multishot',   name:'Multishot',         desc:'Fire +1 extra bullet',      icon:'✦',  rarity:'rare',    apply:p=>{ p.stats.extraBullets+=1; } },
  { id:'magnet',      name:'Soul Magnet',       desc:'XP pickup radius +80',      icon:'🧲', rarity:'common',  apply:p=>{ p.stats.xpRadius+=80; } },
  { id:'armor',       name:'Iron Skin',         desc:'Damage Reduction +12%',     icon:'🛡️', rarity:'rare',    apply:p=>{ p.stats.armor=Math.min(0.75,p.stats.armor+0.12); } },
  { id:'crit',        name:'Critical Eye',      desc:'Crit Chance +15%',          icon:'👁️', rarity:'rare',    apply:p=>{ p.stats.critChance=Math.min(0.80,p.stats.critChance+0.15); } },
  { id:'critdmg',     name:'Executioner',       desc:'Crit Damage +50%',          icon:'💥', rarity:'rare',    apply:p=>{ p.stats.critDamage+=0.50; } },
  { id:'aoesize',     name:'Shockwave',         desc:'AOE Size +30%',             icon:'🌀', rarity:'rare',    apply:p=>{ p.stats.aoeMulti*=1.30; } },
  { id:'projspd',     name:'Velocity',          desc:'Projectile Speed +25%',     icon:'🚀', rarity:'common',  apply:p=>{ p.stats.projSpeedMulti*=1.25; } },
  { id:'knockback',   name:'Repulsor',          desc:'Knockback +50%',            icon:'💫', rarity:'common',  apply:p=>{ p.stats.knockbackMulti*=1.50; } },
  { id:'lifesteal',   name:'Vampiric',          desc:'Life Steal 8%',             icon:'🩸', rarity:'epic',    apply:p=>{ p.stats.lifeSteal+=0.08; } },
  { id:'explosive',   name:'Explosive Rounds',  desc:'Bullets explode on hit',    icon:'💣', rarity:'epic',    apply:p=>{ p.stats.explosive=true; } },
  { id:'ultimate_cd', name:'Readiness',         desc:'Ultimate Cooldown -30%',    icon:'⭐', rarity:'epic',    apply:p=>{ p.stats.ultimateCdMulti*=0.70; } },
  { id:'xpboost',     name:'Scholar',           desc:'XP Gain +25%',              icon:'📚', rarity:'common',  apply:p=>{ p.stats.xpMulti*=1.25; } },
  { id:'dash',        name:'Shadow Step',       desc:'Gain a Dash (Shift key)',   icon:'🌑', rarity:'epic',    apply:p=>{ p.stats.hasDash=true; } },
  { id:'ghostbullet', name:'Ghost Bullets',     desc:'Bullets pierce everything', icon:'👻', rarity:'rare',    apply:p=>{ p.stats.ghostBullets=true; } },
];

// ─────────────────────────────────────────────
// SYNERGY DEFINITIONS
// ─────────────────────────────────────────────
const SYNERGIES = [
  { id:'blade_storm',    name:'Blade Storm',    desc:'Dagger fires in all 8 directions!',           requires:{ weapon:'dagger', upgrades:['atkspd'] } },
  { id:'meteor_storm',   name:'Meteor Storm',   desc:'Staff orbs split into 3 mini-explosions!',    requires:{ weapon:'staff',  upgrades:['aoesize','explosive'] } },
  { id:'rain_of_arrows', name:'Rain of Arrows', desc:'Auto-fires arrows in 8 directions every 2s!', requires:{ weapon:'bow',    upgrades:['pierce','multishot'] } },
];

// ─────────────────────────────────────────────
// GEAR POOL
// ─────────────────────────────────────────────
const RARITY_COLORS = { common:0xaaaaaa, rare:0x4499ff, epic:0xaa44ff, legendary:0xffaa00 };

const GEAR_POOL = [
  // Weapons
  { id:'rusty_dagger',   name:'Rusty Dagger',    type:'weapon', weaponType:'dagger', rarity:'common',    level:1,  stats:{ damage:5 } },
  { id:'sharp_dagger',   name:'Sharp Dagger',    type:'weapon', weaponType:'dagger', rarity:'rare',      level:3,  stats:{ damage:15, atkspd:0.1 } },
  { id:'shadow_dagger',  name:'Shadow Dagger',   type:'weapon', weaponType:'dagger', rarity:'epic',      level:8,  stats:{ damage:30, pierce:1 } },
  { id:'hunting_bow',    name:'Hunting Bow',     type:'weapon', weaponType:'bow',    rarity:'common',    level:1,  stats:{ damage:8 } },
  { id:'elven_bow',      name:'Elven Bow',       type:'weapon', weaponType:'bow',    rarity:'rare',      level:4,  stats:{ damage:20, range:100 } },
  { id:'war_axe',        name:'War Axe',         type:'weapon', weaponType:'axe',    rarity:'common',    level:2,  stats:{ damage:20 } },
  { id:'berserker_axe',  name:'Berserker Axe',   type:'weapon', weaponType:'axe',    rarity:'epic',      level:7,  stats:{ damage:50 } },
  { id:'magic_staff',    name:'Magic Staff',     type:'weapon', weaponType:'staff',  rarity:'rare',      level:3,  stats:{ damage:15 } },
  { id:'chaos_staff',    name:'Chaos Staff',     type:'weapon', weaponType:'staff',  rarity:'legendary', level:10, stats:{ damage:40 } },
  // Helmets
  { id:'leather_helm',   name:'Leather Helm',    type:'helmet', rarity:'common',    level:1,  stats:{ hp:20, defense:0.03 } },
  { id:'iron_helm',      name:'Iron Helm',       type:'helmet', rarity:'rare',      level:3,  stats:{ hp:50, defense:0.08 } },
  { id:'shadow_cowl',    name:'Shadow Cowl',     type:'helmet', rarity:'epic',      level:6,  stats:{ hp:30, defense:0.05, speed:15 } },
  { id:'void_crown',     name:'Void Crown',      type:'helmet', rarity:'legendary', level:12, stats:{ hp:80, defense:0.12, hpregen:2 } },
  // Body Armor
  { id:'cloth_armor',    name:'Cloth Armor',     type:'armor',  rarity:'common',    level:1,  stats:{ hp:30, defense:0.05 } },
  { id:'chain_mail',     name:'Chain Mail',      type:'armor',  rarity:'rare',      level:3,  stats:{ hp:70, defense:0.12 } },
  { id:'dark_plate',     name:'Dark Plate',      type:'armor',  rarity:'epic',      level:7,  stats:{ hp:120, defense:0.18 } },
  { id:'void_armor',     name:'Void Armor',      type:'armor',  rarity:'legendary', level:15, stats:{ hp:200, defense:0.25, hpregen:3 } },
];


// ═══════════════════════════════════════════════════════════
// BOOT SCENE  –  generate ALL textures programmatically
// ═══════════════════════════════════════════════════════════
class BootScene extends Phaser.Scene {
  constructor() { super({ key:'BootScene' }); }

  create() {
    this._generateTextures();

    // Hide HTML loading screen
    const el = document.getElementById('loading');
    if (el) { el.style.opacity = '0'; setTimeout(()=>el.style.display='none', 500); }

    this.scene.start('MainMenuScene');
  }

  _generateTextures() {
    const g = this.make.graphics({ x:0, y:0, add:false });

    // ── PLAYER ──────────────────────────────────────────────
    g.clear();
    g.fillStyle(0x0033ff, 0.30); g.fillCircle(24,24,22);   // outer glow
    g.fillStyle(0x2255cc, 1.00); g.fillCircle(24,24,16);   // body
    g.fillStyle(0x88aaff, 1.00); g.fillCircle(24,24, 8);   // core
    g.fillStyle(0xffffff, 0.60); g.fillCircle(20,20, 4);   // highlight
    g.generateTexture('player',48,48);

    // ── BULLETS ─────────────────────────────────────────────
    const bullets = [
      { key:'bullet_dagger', col:0x88aaff, glow:0x4466ff, w:12, h:6  },
      { key:'bullet_bow',    col:0x44ffaa, glow:0x22cc77, w:16, h:4  },
      { key:'bullet_axe',    col:0xff4422, glow:0xcc2200, w:22, h:18 },
      { key:'bullet_staff',  col:0xaa44ff, glow:0x7700cc, w:18, h:18 },
    ];
    bullets.forEach(({ key, col, glow, w, h }) => {
      g.clear();
      g.fillStyle(glow, 0.40); g.fillEllipse(w/2+3, h/2+3, w+6, h+6);
      g.fillStyle(col,  1.00); g.fillEllipse(w/2+3, h/2+3, w,   h  );
      g.fillStyle(0xffffff, 0.80); g.fillEllipse(w/2, h/2+1, w/3, h/3);
      g.generateTexture(key, w+6, h+6);
    });

    // ── ENEMIES ─────────────────────────────────────────────
    Object.entries(ENEMY_DEFS).forEach(([type, def]) => {
      const s  = def.size;
      const sz = s * 2 + 12;
      g.clear();
      // glow ring
      g.fillStyle(def.color, 0.22); g.fillCircle(sz/2, sz/2, s+5);
      // body
      if (def.shape === 'rect') {
        g.fillStyle(def.color, 1); g.fillRect(sz/2-s, sz/2-s, s*2, s*2);
      } else {
        g.fillStyle(def.color, 1); g.fillCircle(sz/2, sz/2, s);
      }
      // eyes
      g.fillStyle(0xffffff,0.9);
      g.fillCircle(sz/2-s/3, sz/2-s/4, s/5);
      g.fillCircle(sz/2+s/3, sz/2-s/4, s/5);
      g.fillStyle(0x000000,1);
      g.fillCircle(sz/2-s/3+1, sz/2-s/4+1, s/9);
      g.fillCircle(sz/2+s/3+1, sz/2-s/4+1, s/9);
      // elite ring
      if (def.isElite) { g.lineStyle(3,0xffaa00,1); g.strokeCircle(sz/2,sz/2,s+2); }
      g.generateTexture('enemy_'+type, sz, sz);
    });

    // ── ENEMY BULLET ────────────────────────────────────────
    g.clear();
    g.fillStyle(0xff4444,0.4); g.fillCircle(8,8,8);
    g.fillStyle(0xff0000,1);   g.fillCircle(8,8,5);
    g.generateTexture('enemy_bullet',16,16);

    // ── CHESTS ──────────────────────────────────────────────
    ['common','rare','epic','legendary'].forEach(r => {
      const col = RARITY_COLORS[r];
      g.clear();
      g.fillStyle(0x000000,0.35); g.fillRect(3,36,44,8);       // shadow
      g.fillStyle(0x5a3a1a,1);    g.fillRect(2,12,44,26);      // body
      g.fillStyle(0x7a5a2a,1);    g.fillRect(0, 6,48,14);      // lid
      g.lineStyle(3,col,1);       g.strokeRect(0,6,48,32);     // rarity border
      g.fillStyle(col,1);         g.fillCircle(24,24,7);       // lock
      g.fillStyle(0xffffff,0.6);  g.fillCircle(24,24,3);
      if (r==='epic'||r==='legendary') { g.fillStyle(col,0.13); g.fillRect(-4,2,56,40); }
      g.generateTexture('chest_'+r,48,44);
    });

    // ── XP ORB ──────────────────────────────────────────────
    g.clear();
    g.fillStyle(0x00ffaa,0.30); g.fillCircle(8,8,8);
    g.fillStyle(0x00ffaa,1.00); g.fillCircle(8,8,5);
    g.fillStyle(0xffffff,0.80); g.fillCircle(6,6,2);
    g.generateTexture('xp_orb',16,16);

    // ── PARTICLES ───────────────────────────────────────────
    g.clear(); g.fillStyle(0xcc0000,1); g.fillCircle(4,4,4); g.generateTexture('particle_blood',8,8);
    g.clear(); g.fillStyle(0xffff00,1); g.fillCircle(3,3,3); g.generateTexture('particle_spark',6,6);
    g.clear();
    g.fillStyle(0xaa44ff,0.8); g.fillCircle(4,4,4);
    g.fillStyle(0xffffff,1);   g.fillCircle(4,4,2);
    g.generateTexture('particle_magic',8,8);
    g.clear(); g.fillStyle(0x00ffaa,1); g.fillCircle(4,4,4); g.generateTexture('particle_xp',8,8);

    // ── EXPLOSION ───────────────────────────────────────────
    g.clear();
    g.fillStyle(0xff6600,0.6); g.fillCircle(32,32,32);
    g.fillStyle(0xffcc00,0.8); g.fillCircle(32,32,20);
    g.fillStyle(0xffffff,0.9); g.fillCircle(32,32,10);
    g.generateTexture('explosion',64,64);

    // ── HAZARDS ─────────────────────────────────────────────
    g.clear();
    g.fillStyle(0xff4400,0.85); g.fillEllipse(48,30,96,60);
    g.fillStyle(0xff8800,0.60); g.fillEllipse(48,30,68,40);
    g.fillStyle(0xffcc00,0.35); g.fillEllipse(48,30,38,22);
    g.generateTexture('hazard_lava',96,60);

    g.clear();
    g.fillStyle(0x999999,1); g.fillCircle(20,20,18);
    for (let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2;
      g.fillTriangle(
        20+Math.cos(a)*18, 20+Math.sin(a)*18,
        20+Math.cos(a+0.30)*14, 20+Math.sin(a+0.30)*14,
        20+Math.cos(a+0.15)*27, 20+Math.sin(a+0.15)*27
      );
    }
    g.fillStyle(0xbbbbbb,1); g.fillCircle(20,20,8);
    g.fillStyle(0x333333,1); g.fillCircle(20,20,4);
    g.generateTexture('hazard_saw',40,40);

    // ── FLOOR TILE ──────────────────────────────────────────
    g.clear();
    g.fillStyle(0x0e0e1a,1); g.fillRect(0,0,64,64);
    g.lineStyle(1,0x1a1a28,1); g.strokeRect(0,0,64,64);
    g.fillStyle(0x141420,0.5);
    g.fillRect(8,8,20,20); g.fillRect(36,36,20,20);
    g.generateTexture('tile_floor',64,64);

    // ── BACKGROUND ──────────────────────────────────────────
    const bg = this.make.graphics({ x:0, y:0, add:false });
    bg.fillGradientStyle(0x050510,0x050510,0x0a0a1a,0x0a0a1a,1);
    bg.fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
    for (let i=0;i<180;i++){
      bg.fillStyle(0x1a1a32, 0.15+Math.random()*0.25);
      bg.fillCircle(Math.random()*WORLD_WIDTH, Math.random()*WORLD_HEIGHT, 4+Math.random()*28);
    }
    bg.generateTexture('background',WORLD_WIDTH,WORLD_HEIGHT);
    bg.destroy();

    g.destroy();
  }
}


// ═══════════════════════════════════════════════════════════
// MAIN MENU SCENE
// ═══════════════════════════════════════════════════════════
class MainMenuScene extends Phaser.Scene {
  constructor() { super({ key:'MainMenuScene' }); }

  create() {
    const W = GAME_WIDTH, H = GAME_HEIGHT;

    // Dark background
    this.add.rectangle(W/2,H/2,W,H,0x05050f);

    // Animated background particles
    for (let i=0;i<35;i++) this._spawnBgParticle(W,H);

    // Title
    const title = this.add.text(W/2, H*0.18, 'DARK REALM', {
      fontSize:'72px', fontFamily:'Georgia,serif', color:'#cc8800',
      stroke:'#000', strokeThickness:6,
      shadow:{ offsetX:0, offsetY:0, color:'#ff8800', blur:30, fill:true }
    }).setOrigin(0.5);
    this.tweens.add({ targets:title, scaleX:1.03, scaleY:1.03, duration:1400, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

    this.add.text(W/2, H*0.30, 'S  U  R  V  I  V  A  L', {
      fontSize:'22px', fontFamily:'Georgia,serif', color:'#666666', letterSpacing:10
    }).setOrigin(0.5);

    // Separator line
    const lg = this.add.graphics();
    lg.lineStyle(1,0x664400,0.5);
    lg.lineBetween(W*0.28,H*0.38,W*0.72,H*0.38);

    // Stage info from save
    const save   = this._loadSave();
    const stages = ['The Cursed Forest','The Sunken Ruins','The Demon Citadel','The Void Realm','The Abyss'];
    const stageN = Math.min(save.unlockedStage||1, stages.length);
    const stageName = stages[stageN-1];

    this.add.text(W/2,H*0.43,`STAGE ${stageN}`, {
      fontSize:'20px', fontFamily:'Georgia,serif', color:'#888888'
    }).setOrigin(0.5);
    this.add.text(W/2,H*0.50,stageName, {
      fontSize:'16px', fontFamily:'Georgia,serif', color:'#555555'
    }).setOrigin(0.5);

    if (save.lastRun) {
      this.add.text(W/2, H*0.57,
        `Last Run: Lv ${save.lastRun.level}  |  Score ${save.lastRun.score}  |  ${save.lastRun.survived}`,
        { fontSize:'13px', fontFamily:'Georgia,serif', color:'#444444' }
      ).setOrigin(0.5);
    }

    // START button
    const btn = this.add.text(W/2,H*0.68,'[ START GAME ]', {
      fontSize:'34px', fontFamily:'Georgia,serif', color:'#ffaa00',
      stroke:'#000', strokeThickness:4
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    btn.on('pointerover',()=>btn.setColor('#ffffff'));
    btn.on('pointerout', ()=>btn.setColor('#ffaa00'));
    btn.on('pointerdown',()=>{
      this.cameras.main.fadeOut(400,0,0,0);
      this.time.delayedCall(420,()=> this.scene.start('GameScene',{ stage:stageN }));
    });
    this.tweens.add({ targets:btn, alpha:0.65, duration:750, yoyo:true, repeat:-1 });

    // Controls hint
    this.add.text(W/2,H*0.82,'WASD: Move   |   Mouse: Aim   |   LMB: Shoot   |   Q: Ultimate   |   Shift: Dash   |   E: Open Chest', {
      fontSize:'12px', fontFamily:'Georgia,serif', color:'#3a3a3a'
    }).setOrigin(0.5);

    this.add.text(W/2,H*0.93,'Dark Realm: Survival  v1.0', {
      fontSize:'11px', fontFamily:'Georgia,serif', color:'#2a2a2a'
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(700,0,0,0);
  }

  _spawnBgParticle(W,H) {
    const x = Phaser.Math.Between(0,W);
    const y = Phaser.Math.Between(0,H);
    const s = Phaser.Math.Between(1,4);
    const colors = [0x4455ff,0xaa44ff,0xff4400,0x44ffaa,0xffaa00];
    const p = this.add.circle(x,y,s,Phaser.Utils.Array.GetRandom(colors),0.6);
    this.tweens.add({
      targets:p, y:y-Phaser.Math.Between(100,350), alpha:0,
      duration:Phaser.Math.Between(3000,9000),
      onComplete:()=>{
        p.setPosition(Phaser.Math.Between(0,W), H+10); p.setAlpha(0.6);
        this.tweens.add({ targets:p, y:'-='+Phaser.Math.Between(100,350), alpha:0,
          duration:Phaser.Math.Between(3000,9000), repeat:-1 });
      }
    });
  }

  _loadSave() {
    try { return JSON.parse(localStorage.getItem('darkRealm_save')||'{}'); }
    catch(e){ return {}; }
  }
}


// ═══════════════════════════════════════════════════════════
// GAME SCENE  – core gameplay
// ═══════════════════════════════════════════════════════════
class GameScene extends Phaser.Scene {
  constructor() { super({ key:'GameScene' }); }

  init(data) {
    this.stageNum        = data.stage || 1;
    this.difficultyMulti = 1 + (this.stageNum - 1) * 0.5;
  }

  // ── CREATE ───────────────────────────────────────────────
  create() {
    this._setupWorld();
    this._setupGroups();
    this._setupPlayer();
    this._setupInput();
    this._setupCollisions();
    this._setupParticles();
    this._setupCamera();

    // Launch HUD overlay
    this.scene.launch('UIScene', { gameScene:this });
    this.uiScene = this.scene.get('UIScene');

    // Timers / counters
    this.stageTimer      = STAGE_DURATION;
    this.enemySpawnTimer = 1.5;
    this.eliteTimer      = 0;
    this.chestTimer      = 20;
    this.regenAccum      = 0;
    this.lavaAccum       = 0;
    this.waveNumber      = 1;
    this.diffRampAccum   = 0;
    this.score           = 0;
    this.killCount       = 0;

    // State flags
    this.isGameOver    = false;
    this.isVictory     = false;
    this.isPaused      = false;
    this.isDashing     = false;
    this.ultimateReady = false;
    this.ultimateCd    = 0;
    this.dashCd        = 0;
    this.lastFireTime  = 0;

    // Synergy tracking
    this.appliedSynergies = {};

    // Hazard arrays
    this.lavaZones = [];
    this.sawBlades = [];

    // Ranged enemies shoot on timer
    this.time.addEvent({ delay:2000, callback:this._enemyShootTick, callbackScope:this, loop:true });

    // Spawn initial environment hazards
    this._spawnInitialHazards();

    // Ultimate becomes available after 8s
    this.time.delayedCall(8000, ()=>{ this.ultimateReady = true; });

    this.cameras.main.fadeIn(800,0,0,0);
    this.time.delayedCall(600, ()=>{
      if (this.uiScene) this.uiScene.showMessage(`STAGE ${this.stageNum}: SURVIVE 10 MINUTES`,3000,0xffaa00);
    });
  }

  // ── WORLD SETUP ─────────────────────────────────────────
  _setupWorld() {
    this.add.image(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'background').setDepth(-10);

    // Grid overlay
    const grid = this.add.graphics().setDepth(-9);
    grid.lineStyle(1,0x181828,0.45);
    for (let x=0;x<=WORLD_WIDTH;x+=64)  grid.lineBetween(x,0,x,WORLD_HEIGHT);
    for (let y=0;y<=WORLD_HEIGHT;y+=64) grid.lineBetween(0,y,WORLD_WIDTH,y);

    // Arena border
    const border = this.add.graphics().setDepth(-8);
    border.lineStyle(8,0x440000,0.9);  border.strokeRect(8,8,WORLD_WIDTH-16,WORLD_HEIGHT-16);
    border.lineStyle(2,0x880000,0.4);  border.strokeRect(22,22,WORLD_WIDTH-44,WORLD_HEIGHT-44);

    this.physics.world.setBounds(50,50,WORLD_WIDTH-100,WORLD_HEIGHT-100);
  }

  // ── GROUPS SETUP ────────────────────────────────────────
  _setupGroups() {
    this.bullets      = this.physics.add.group({ maxSize:200, runChildUpdate:false });
    this.enemyGroup   = this.physics.add.group();
    this.xpOrbs       = this.physics.add.group({ maxSize:400 });
    this.chests       = this.physics.add.staticGroup();
    this.enemyBullets = this.physics.add.group({ maxSize:100 });
  }

  // ── PLAYER SETUP ────────────────────────────────────────
  _setupPlayer() {
    this.player = {
      sprite: this.physics.add.sprite(WORLD_WIDTH/2, WORLD_HEIGHT/2, 'player').setDepth(10).setCollideWorldBounds(true),
      hp: 150,
      stats: {
        maxHp:150, speed:200,
        fireRateMulti:1.0, damageMulti:1.0,
        pierceBonus:0, extraBullets:0,
        armor:0.0, critChance:0.10, critDamage:1.5,
        aoeMulti:1.0, projSpeedMulti:1.0, knockbackMulti:1.0,
        lifeSteal:0, explosive:false, ghostBullets:false,
        hasDash:false, ultimateCdMulti:1.0,
        xpRadius:100, xpMulti:1.0, hpRegen:0,
      },
      level:1, xp:0, xpToNext:100,
      weapon: { ...WEAPONS.dagger },
      equippedUpgrades:[],
      invincible:false, invincTimer:0, flashAccum:0,
      isShooting:false,
    };

    // Weapon glow light
    this.playerGlow = this.add.pointlight(WORLD_WIDTH/2,WORLD_HEIGHT/2,0x2255cc,130,0.55).setDepth(9);
  }

  // ── INPUT ───────────────────────────────────────────────
  _setupInput() {
    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      upA:   Phaser.Input.Keyboard.KeyCodes.UP,
      downA: Phaser.Input.Keyboard.KeyCodes.DOWN,
      leftA: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightA:Phaser.Input.Keyboard.KeyCodes.RIGHT,
      ult:   Phaser.Input.Keyboard.KeyCodes.Q,
      dash:  Phaser.Input.Keyboard.KeyCodes.SHIFT,
      inter: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.mouseWorld = { x: WORLD_WIDTH/2+120, y: WORLD_HEIGHT/2 };
    this.input.on('pointermove', ptr => { this.mouseWorld.x = ptr.worldX; this.mouseWorld.y = ptr.worldY; });
    this.input.on('pointerdown', ptr => { if(ptr.leftButtonDown()) this.player.isShooting = true;  });
    this.input.on('pointerup',   ()  => { this.player.isShooting = false; });
  }

  // ── COLLISIONS ──────────────────────────────────────────
  _setupCollisions() {
    // Player bullets vs enemies
    this.physics.add.overlap(this.bullets, this.enemyGroup,
      (bullet, enemy) => this._onBulletHit(bullet, enemy), null, this);

    // Player vs enemies (contact damage)
    this.physics.add.overlap(this.player.sprite, this.enemyGroup,
      (_ps, enemy) => this._onPlayerContactEnemy(enemy), null, this);

    // Enemy bullets vs player
    this.physics.add.overlap(this.enemyBullets, this.player.sprite,
      (bullet) => this._onEnemyBulletHit(bullet), null, this);
  }

  // ── PARTICLES ───────────────────────────────────────────
  _setupParticles() {
    this.pBlood = this.add.particles(0,0,'particle_blood',{
      speed:{min:60,max:200}, scale:{start:1.2,end:0}, lifespan:{min:300,max:600},
      quantity:6, angle:{min:0,max:360}, gravityY:220, emitting:false
    }).setDepth(15);
    this.pSpark = this.add.particles(0,0,'particle_spark',{
      speed:{min:80,max:240}, scale:{start:1,end:0}, lifespan:{min:200,max:500},
      quantity:8, angle:{min:0,max:360}, emitting:false
    }).setDepth(15);
    this.pMagic = this.add.particles(0,0,'particle_magic',{
      speed:{min:40,max:130}, scale:{start:1.5,end:0}, lifespan:{min:400,max:900},
      quantity:10, angle:{min:0,max:360}, emitting:false
    }).setDepth(15);
    this.pXP = this.add.particles(0,0,'particle_xp',{
      speed:{min:20,max:70}, scale:{start:0.8,end:0}, lifespan:400,
      quantity:3, tint:0x00ffaa, emitting:false
    }).setDepth(12);
  }

  // ── CAMERA ──────────────────────────────────────────────
  _setupCamera() {
    this.cameras.main
      .startFollow(this.player.sprite, true, 0.08, 0.08)
      .setZoom(1.1)
      .setBounds(0,0,WORLD_WIDTH,WORLD_HEIGHT);
  }


  // ── UPDATE ───────────────────────────────────────────────
  update(time, delta) {
    if (this.isGameOver || this.isVictory || this.isPaused) return;
    const dt = delta / 1000;

    // Stage countdown
    this.stageTimer -= dt;
    if (this.stageTimer <= 0) { this._triggerVictory(); return; }

    this._handleMovement();
    this._handleShooting(time);
    this._updateGlow();
    this._handleInvincibility(dt);
    this._tickRegen(dt);
    this._tickCooldowns(dt);
    this._handleKeyActions();
    this._spawnTick(dt);
    this._updateEnemies(dt);
    this._updateSawBlades(dt);
    this._collectXP();
    this._tickLavaDamage(dt);
    this._checkSawDamage();
    this._cleanBullets();
    this._difficultyRamp(dt);
    this._pushHUD();
  }

  // ── MOVEMENT ────────────────────────────────────────────
  _handleMovement() {
    const p = this.player;
    const spd = p.stats.speed;
    let vx=0, vy=0;
    if (this.keys.left.isDown  || this.keys.leftA.isDown)  vx -= spd;
    if (this.keys.right.isDown || this.keys.rightA.isDown) vx += spd;
    if (this.keys.up.isDown    || this.keys.upA.isDown)    vy -= spd;
    if (this.keys.down.isDown  || this.keys.downA.isDown)  vy += spd;
    if (vx && vy) { vx *= 0.707; vy *= 0.707; }
    p.sprite.setVelocity(vx, vy);
    const ang = Phaser.Math.Angle.Between(p.sprite.x,p.sprite.y,this.mouseWorld.x,this.mouseWorld.y);
    p.sprite.setRotation(ang + Math.PI/2);
    this.playerGlow.setPosition(p.sprite.x, p.sprite.y);
  }

  // ── SHOOTING ────────────────────────────────────────────
  _handleShooting(time) {
    const p = this.player;
    if (!p.isShooting) return;
    const rate = p.weapon.fireRate * p.stats.fireRateMulti;
    if (time - this.lastFireTime < rate) return;
    this.lastFireTime = time;

    const ang = Phaser.Math.Angle.Between(p.sprite.x,p.sprite.y,this.mouseWorld.x,this.mouseWorld.y);
    this._fireBullet(p.sprite.x, p.sprite.y, ang);

    // Extra bullets (multishot)
    for (let i=0; i<p.stats.extraBullets; i++) {
      const spread = (i%2===0?1:-1)*(Math.PI/12)*Math.ceil((i+1)/2);
      this._fireBullet(p.sprite.x, p.sprite.y, ang+spread);
    }

    // Blade storm synergy
    if (this.appliedSynergies['blade_storm'] && p.weapon.name==='Dagger') {
      for (let i=1;i<8;i++) this._fireBullet(p.sprite.x,p.sprite.y,(i/8)*Math.PI*2);
    }
  }

  _fireBullet(x, y, angle) {
    const p  = this.player;
    const wk = p.weapon.bulletKey;
    const b  = this.bullets.get(x, y, wk);
    if (!b) return;

    let dmg = p.weapon.damage * p.stats.damageMulti;
    let isCrit = Math.random() < p.stats.critChance;
    if (isCrit) dmg *= p.stats.critDamage;
    dmg = Math.round(dmg);

    b.setActive(true).setVisible(true).setDepth(8);
    b.damage     = dmg;
    b.isCrit     = isCrit;
    b.pierce     = p.weapon.pierceCount + p.stats.pierceBonus;
    b.pierceHits = 0;
    b.knockback  = p.weapon.knockback * p.stats.knockbackMulti;
    b.explosive  = p.stats.explosive;
    b.weaponName = p.weapon.name;
    b.lifeSteal  = p.stats.lifeSteal;

    const spd = p.weapon.bulletSpeed * p.stats.projSpeedMulti;
    b.setVelocity(Math.cos(angle)*spd, Math.sin(angle)*spd);
    b.setRotation(angle);

    // Destroy after range exceeded
    const ttl = (p.weapon.range / p.weapon.bulletSpeed) * 1000;
    this.time.delayedCall(ttl, ()=>{ if(b.active) this._recycleBullet(b); });

    this.pSpark.setPosition(x,y); this.pSpark.explode(3);
  }

  _recycleBullet(b) {
    if (!b.active) return;
    if (b.explosive) this._explode(b.x, b.y, Math.round(b.damage*0.45));
    b.setActive(false).setVisible(false).setVelocity(0,0);
  }

  // ── EXPLOSION ───────────────────────────────────────────
  _explode(x, y, dmg) {
    const img = this.add.image(x,y,'explosion').setDepth(12).setScale(0.5*this.player.stats.aoeMulti);
    this.tweens.add({ targets:img, scaleX:img.scaleX*4, scaleY:img.scaleY*4, alpha:0, duration:450,
      onComplete:()=>img.destroy() });
    this.pMagic.setPosition(x,y); this.pMagic.explode(12);
    this.cameras.main.shake(180,0.007);
    const r = 85 * this.player.stats.aoeMulti;
    this.enemyGroup.getChildren().forEach(e => {
      if (!e.active) return;
      if (Phaser.Math.Distance.Between(x,y,e.x,e.y) < r) this._damageEnemy(e, dmg, x, y, 120);
    });
  }

  // ── BULLET HIT ENEMY ────────────────────────────────────
  _onBulletHit(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    this.pBlood.setPosition(enemy.x,enemy.y); this.pBlood.explode(bullet.weaponName==='Axe'?14:6);
    if (bullet.weaponName==='Staff') { this.pMagic.setPosition(enemy.x,enemy.y); this.pMagic.explode(7); }
    if (bullet.weaponName==='Axe') this.cameras.main.shake(120,0.006);

    this._damageEnemy(enemy, bullet.damage, bullet.x, bullet.y, bullet.knockback, bullet.isCrit);

    if (bullet.lifeSteal>0) {
      const heal = Math.round(bullet.damage * bullet.lifeSteal);
      this.player.hp = Math.min(this.player.stats.maxHp, this.player.hp+heal);
      if (heal>0) this._floatText(this.player.sprite.x, this.player.sprite.y-20, `+${heal}`, 0x44ff44, 13);
    }
    if (bullet.explosive) this._explode(enemy.x, enemy.y, Math.round(bullet.damage*0.4));

    if (!this.player.stats.ghostBullets) {
      bullet.pierceHits++;
      if (bullet.pierceHits >= bullet.pierce) this._recycleBullet(bullet);
    }
  }

  // ── DAMAGE ENEMY ────────────────────────────────────────
  _damageEnemy(enemy, dmg, fromX, fromY, kb=0, isCrit=false) {
    if (!enemy.active) return;
    enemy.hp -= dmg;
    if (kb>0) {
      const a = Phaser.Math.Angle.Between(fromX,fromY,enemy.x,enemy.y);
      enemy.setVelocity(Math.cos(a)*kb, Math.sin(a)*kb);
    }
    const col  = isCrit ? 0xffff00 : 0xff8888;
    const txt  = isCrit ? `⚡${dmg}!` : `${dmg}`;
    const size = isCrit ? 20 : 14;
    this._floatText(enemy.x+Phaser.Math.Between(-18,18), enemy.y-18, txt, col, size);
    this.tweens.add({ targets:enemy, tint:0xffffff, duration:70, yoyo:true,
      onComplete:()=>{ if(enemy.active) enemy.clearTint(); } });
    if (enemy.hp <= 0) this._killEnemy(enemy, isCrit);
  }

  _killEnemy(enemy, isCrit=false) {
    if (!enemy.active) return;
    const {x,y} = enemy;
    this.pBlood.setPosition(x,y); this.pBlood.explode(enemy.isElite?28:10);
    if (enemy.isElite) { this.pSpark.setPosition(x,y); this.pSpark.explode(18); this.cameras.main.shake(250,0.012); }

    // XP drop
    this._dropXP(x, y, Math.round(enemy.xp * this.player.stats.xpMulti));

    // Chest drop
    const chestChance = enemy.isElite ? 1.0 : 0.09;
    if (Math.random() < chestChance) {
      const rar = enemy.isElite ? 'rare' : this._randRarity();
      this._spawnChest(x, y, rar);
    }

    this.score += enemy.scoreValue * (isCrit?2:1);
    this.killCount++;
    if (enemy._hpBg)    enemy._hpBg.destroy();
    if (enemy._hpFill)  enemy._hpFill.destroy();
    if (enemy._glow)    enemy._glow.destroy();
    enemy.setActive(false).setVisible(false);
    enemy.destroy();
  }

  // ── PLAYER CONTACT ──────────────────────────────────────
  _onPlayerContactEnemy(enemy) {
    if (!enemy.active || this.player.invincible || this.isDashing) return;
    const dmg = Math.round(enemy.damage * (1-this.player.stats.armor));
    this.player.hp -= dmg;
    this.cameras.main.shake(180,0.010);
    this.pBlood.setPosition(this.player.sprite.x, this.player.sprite.y); this.pBlood.explode(5);
    this._floatText(this.player.sprite.x, this.player.sprite.y-30, `-${dmg}`, 0xff2222, 18);
    this.player.invincible = true; this.player.invincTimer = 0.85; this.player.flashAccum = 0;
    if (this.player.hp <= 0) this._triggerGameOver();
  }

  _onEnemyBulletHit(bullet) {
    if (!bullet.active || this.player.invincible || this.isDashing) return;
    const dmg = Math.round(bullet.damage * (1-this.player.stats.armor));
    this.player.hp -= dmg;
    this.cameras.main.shake(120,0.007);
    this._floatText(this.player.sprite.x, this.player.sprite.y-30, `-${dmg}`, 0xff6666, 16);
    bullet.setActive(false).setVisible(false).setVelocity(0,0);
    this.player.invincible = true; this.player.invincTimer = 0.5; this.player.flashAccum = 0;
    if (this.player.hp <= 0) this._triggerGameOver();
  }

  // ── INVINCIBILITY FLASH ─────────────────────────────────
  _handleInvincibility(dt) {
    const p = this.player;
    if (!p.invincible) return;
    p.invincTimer  -= dt;
    p.flashAccum   += dt;
    if (p.flashAccum > 0.09) { p.flashAccum=0; p.sprite.setAlpha(p.sprite.alpha>0.5?0.25:1); }
    if (p.invincTimer <= 0) { p.invincible=false; p.sprite.setAlpha(1); }
  }


  // ── REGEN + COOLDOWNS ───────────────────────────────────
  _tickRegen(dt) {
    this.regenAccum += dt;
    if (this.regenAccum >= 1) {
      this.regenAccum = 0;
      if (this.player.stats.hpRegen > 0)
        this.player.hp = Math.min(this.player.stats.maxHp, this.player.hp + this.player.stats.hpRegen);
    }
  }

  _tickCooldowns(dt) {
    if (!this.ultimateReady) {
      this.ultimateCd -= dt;
      if (this.ultimateCd <= 0) {
        this.ultimateReady = true;
        if (this.uiScene) this.uiScene.showMessage('ULTIMATE READY!',1500,0xffaa00);
      }
    }
    if (this.dashCd > 0) this.dashCd -= dt;
  }

  // ── KEY ACTIONS ─────────────────────────────────────────
  _handleKeyActions() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.ult) && this.ultimateReady) this._activateUltimate();
    if (Phaser.Input.Keyboard.JustDown(this.keys.dash) && this.player.stats.hasDash && this.dashCd<=0) this._activateDash();
    if (Phaser.Input.Keyboard.JustDown(this.keys.inter)) this._tryInteract();
  }

  // ── SPAWN TICK ──────────────────────────────────────────
  _spawnTick(dt) {
    this.enemySpawnTimer -= dt;
    if (this.enemySpawnTimer <= 0) {
      this._spawnWave();
      const elapsed = STAGE_DURATION - this.stageTimer;
      const rate = Math.max(0.6, 3.5 - this.stageNum*0.3 - elapsed/130);
      this.enemySpawnTimer = rate;
    }
    this.eliteTimer += dt;
    if (this.eliteTimer >= ELITE_SPAWN_INTERVAL) { this.eliteTimer=0; this._spawnElite(); }
    this.chestTimer -= dt;
    if (this.chestTimer <= 0) { this.chestTimer = 22+Math.random()*16; this._spawnRandomChest(); }
  }

  // ── ENEMY WAVE ──────────────────────────────────────────
  _spawnWave() {
    const elapsed = STAGE_DURATION - this.stageTimer;
    const df = 1 + (elapsed/120) * this.difficultyMulti;
    const types = ['zombie'];
    if (elapsed>60)  types.push('runner');
    if (elapsed>120) types.push('ranged');
    if (elapsed>240) types.push('tank');
    const count = Math.min(3 + Math.floor(elapsed/30), 9);
    for (let i=0;i<count;i++) this._spawnEnemy(Phaser.Utils.Array.GetRandom(types), df);
  }

  _spawnEnemy(type, df=1) {
    const def = ENEMY_DEFS[type];
    if (!def) return null;
    const pos = this._edgePos();
    const e   = this.physics.add.sprite(pos.x, pos.y, 'enemy_'+type).setDepth(7).setAlpha(0);
    this.tweens.add({ targets:e, alpha:1, duration:280 });

    e.enemyType  = type;
    e.hp         = Math.round(def.hp * df);
    e.maxHp      = e.hp;
    e.speed      = def.speed;
    e.damage     = Math.round(def.damage * df);
    e.xp         = def.xp;
    e.scoreValue = def.score;
    e.isRanged   = def.isRanged || false;
    e.isElite    = def.isElite  || false;

    // HP bar
    const bw = 32;
    e._hpBg   = this.add.rectangle(pos.x, pos.y-def.size-8, bw, 5, 0x330000).setDepth(8);
    e._hpFill = this.add.rectangle(pos.x-bw/2, pos.y-def.size-8, bw, 5, 0xff2222).setDepth(9).setOrigin(0,0.5);
    this.enemyGroup.add(e);
    return e;
  }

  _spawnElite() {
    const e = this._spawnEnemy('elite', this.difficultyMulti);
    if (!e) return;
    e.hp *= 2; e.maxHp = e.hp; e.speed *= 1.15;
    e.eliteAbility = Phaser.Utils.Array.GetRandom(['charge','minions','slam']);
    e.abilityCd    = 6;
    e._glow = this.add.pointlight(e.x,e.y,0xff6600,90,0.5).setDepth(6);
    if (this.uiScene) this.uiScene.showMessage('⚠ ELITE ENEMY!',2200,0xff6600);
    this.cameras.main.shake(350,0.010);
  }

  _edgePos() {
    const cam = this.cameras.main;
    const m   = 90;
    const ed  = [
      { x: Phaser.Math.Between(cam.scrollX-m, cam.scrollX+GAME_WIDTH+m), y: cam.scrollY-m },
      { x: Phaser.Math.Between(cam.scrollX-m, cam.scrollX+GAME_WIDTH+m), y: cam.scrollY+GAME_HEIGHT+m },
      { x: cam.scrollX-m, y: Phaser.Math.Between(cam.scrollY-m, cam.scrollY+GAME_HEIGHT+m) },
      { x: cam.scrollX+GAME_WIDTH+m, y: Phaser.Math.Between(cam.scrollY-m, cam.scrollY+GAME_HEIGHT+m) },
    ];
    const p = Phaser.Utils.Array.GetRandom(ed);
    return { x: Phaser.Math.Clamp(p.x,60,WORLD_WIDTH-60), y: Phaser.Math.Clamp(p.y,60,WORLD_HEIGHT-60) };
  }

  // ── UPDATE ENEMIES ──────────────────────────────────────
  _updateEnemies(dt) {
    const px = this.player.sprite.x, py = this.player.sprite.y;
    this.enemyGroup.getChildren().forEach(e => {
      if (!e.active) return;
      const dist = Phaser.Math.Distance.Between(e.x,e.y,px,py);
      const ang  = Phaser.Math.Angle.Between(e.x,e.y,px,py);
      const tDist = e.isRanged ? 280 : 0;
      if (dist > tDist+10)       e.setVelocity(Math.cos(ang)*e.speed, Math.sin(ang)*e.speed);
      else if (dist < tDist-10)  e.setVelocity(-Math.cos(ang)*e.speed*0.5, -Math.sin(ang)*e.speed*0.5);
      else                       e.setVelocity(0,0);
      e.setRotation(ang + Math.PI/2);

      // HP bar update
      const hOff = (e.displayWidth/2)+9;
      if (e._hpBg)   e._hpBg.setPosition(e.x, e.y-hOff);
      if (e._hpFill) {
        const r = e.hp/e.maxHp;
        e._hpFill.setPosition(e.x-16, e.y-hOff);
        e._hpFill.setSize(32*r, 5);
        e._hpFill.setFillStyle(r>0.5?0x44ff44:r>0.25?0xffaa00:0xff2222);
      }
      if (e._glow) e._glow.setPosition(e.x, e.y);

      // Elite ability
      if (e.isElite && e.abilityCd !== undefined) {
        e.abilityCd -= dt;
        if (e.abilityCd <= 0) { e.abilityCd=8; this._eliteAbility(e); }
      }
    });
  }

  _eliteAbility(e) {
    switch(e.eliteAbility) {
      case 'charge': {
        const a = Phaser.Math.Angle.Between(e.x,e.y,this.player.sprite.x,this.player.sprite.y);
        this.tweens.add({ targets:e, x:e.x+Math.cos(a)*280, y:e.y+Math.sin(a)*280, duration:380, ease:'Power2' });
        this.pSpark.setPosition(e.x,e.y); this.pSpark.explode(14); break;
      }
      case 'minions':
        for (let i=0;i<3;i++) this.time.delayedCall(i*260, ()=> this._spawnEnemy('runner', this.difficultyMulti));
        this.pMagic.setPosition(e.x,e.y); this.pMagic.explode(18); break;
      case 'slam':
        this._explode(e.x, e.y, e.damage*1.5); break;
    }
  }

  // ── RANGED ENEMY SHOOT ──────────────────────────────────
  _enemyShootTick() {
    if (this.isGameOver||this.isVictory||this.isPaused) return;
    this.enemyGroup.getChildren().forEach(e => {
      if (!e.active || !e.isRanged) return;
      if (Phaser.Math.Distance.Between(e.x,e.y,this.player.sprite.x,this.player.sprite.y) > 480) return;
      const b = this.enemyBullets.get(e.x, e.y, 'enemy_bullet');
      if (!b) return;
      b.setActive(true).setVisible(true).setDepth(7);
      b.damage = e.damage;
      const a = Phaser.Math.Angle.Between(e.x,e.y,this.player.sprite.x,this.player.sprite.y);
      b.setVelocity(Math.cos(a)*250, Math.sin(a)*250);
      this.time.delayedCall(3200,()=>{ if(b.active) b.setActive(false).setVisible(false).setVelocity(0,0); });
    });
  }


  // ── XP ORBS ─────────────────────────────────────────────
  _dropXP(x, y, amount) {
    const n = Math.min(Math.ceil(amount/10),5);
    const v = Math.round(amount/n);
    for (let i=0;i<n;i++) {
      const orb = this.xpOrbs.get(x+Phaser.Math.Between(-28,28), y+Phaser.Math.Between(-28,28), 'xp_orb');
      if (!orb) continue;
      orb.setActive(true).setVisible(true).setDepth(5);
      orb.xpValue = v;
      orb.setVelocity(Phaser.Math.Between(-50,50), Phaser.Math.Between(-80,-15));
      this.time.delayedCall(380, ()=>{ if(orb.active) orb.setVelocity(0,0); });
    }
  }

  _collectXP() {
    const px = this.player.sprite.x, py = this.player.sprite.y;
    const r  = this.player.stats.xpRadius;
    this.xpOrbs.getChildren().forEach(orb => {
      if (!orb.active) return;
      const d = Phaser.Math.Distance.Between(orb.x,orb.y,px,py);
      if (d < r) {
        const spd = Math.min(450, 180+(r-d)*3);
        const a   = Phaser.Math.Angle.Between(orb.x,orb.y,px,py);
        orb.setVelocity(Math.cos(a)*spd, Math.sin(a)*spd);
      }
      if (d < 28) {
        this._gainXP(orb.xpValue);
        this.pXP.setPosition(px,py); this.pXP.explode(3);
        orb.setActive(false).setVisible(false).setVelocity(0,0);
      }
    });
  }

  _gainXP(amount) {
    if (this.player.level >= MAX_LEVEL) return;
    this.player.xp += amount;
    while (this.player.xp >= this.player.xpToNext && this.player.level < MAX_LEVEL) {
      this.player.xp     -= this.player.xpToNext;
      this._doLevelUp();
    }
  }

  _doLevelUp() {
    this.player.level++;
    this.player.xpToNext = Math.round(100 * Math.pow(1.15, this.player.level-1));
    this.cameras.main.flash(280,80,80,255);
    this.pMagic.setPosition(this.player.sprite.x,this.player.sprite.y); this.pMagic.explode(28);
    this._floatText(this.player.sprite.x, this.player.sprite.y-50,'LEVEL UP!',0xffff00,28);
    this.isPaused = true;
    this.physics.pause();
    const all     = [...UPGRADES];
    const choices = Phaser.Utils.Array.Shuffle(all).slice(0,3);
    this.time.delayedCall(350,()=>{
      this.scene.launch('UpgradeScene',{ choices, player:this.player, gameScene:this });
    });
  }

  applyUpgrade(upg) {
    upg.apply(this.player);
    this.player.equippedUpgrades.push(upg.id);
    this._checkSynergies();
    this.isPaused = false;
    this.physics.resume();
  }

  _checkSynergies() {
    SYNERGIES.forEach(syn => {
      if (this.appliedSynergies[syn.id]) return;
      const wMatch = !syn.requires.weapon || this.player.weapon.name.toLowerCase()===syn.requires.weapon;
      const uMatch = syn.requires.upgrades.every(uid => this.player.equippedUpgrades.includes(uid));
      if (wMatch && uMatch) {
        this.appliedSynergies[syn.id] = true;
        if (syn.id==='rain_of_arrows') {
          this.time.addEvent({ delay:2000, loop:true, callback:()=>{
            if(this.isGameOver||this.isVictory) return;
            for(let i=0;i<8;i++) this._fireBullet(this.player.sprite.x,this.player.sprite.y,(i/8)*Math.PI*2);
          }});
        }
        if(this.uiScene) this.uiScene.showMessage(`SYNERGY: ${syn.name}!`,2500,0xaa44ff);
        this.cameras.main.flash(400,170,68,255);
      }
    });
  }

  // ── CHESTS ──────────────────────────────────────────────
  _spawnRandomChest() {
    const cam = this.cameras.main;
    const x = Phaser.Math.Between(cam.scrollX+80, cam.scrollX+GAME_WIDTH-80);
    const y = Phaser.Math.Between(cam.scrollY+80, cam.scrollY+GAME_HEIGHT-80);
    const cx = Phaser.Math.Clamp(x,80,WORLD_WIDTH-80);
    const cy = Phaser.Math.Clamp(y,80,WORLD_HEIGHT-80);
    this._spawnChest(cx, cy, this._randRarity());
  }

  _spawnChest(x, y, rarity) {
    const c = this.chests.create(x, y, 'chest_'+rarity).setDepth(4);
    c.rarity = rarity;
    this.tweens.add({ targets:c, scaleX:1.08,scaleY:1.08, duration:600+Math.random()*400, yoyo:true, repeat:-1 });
    if (rarity==='legendary') {
      c._glow = this.add.pointlight(x,y,0xffaa00,110,0.8).setDepth(3);
    }
  }

  _tryInteract() {
    const px=this.player.sprite.x, py=this.player.sprite.y;
    let nearest=null, minD=85;
    this.chests.getChildren().forEach(c=>{
      const d = Phaser.Math.Distance.Between(px,py,c.x,c.y);
      if(d<minD){minD=d;nearest=c;}
    });
    if(nearest) this._openChest(nearest);
  }

  _openChest(chest) {
    this.pSpark.setPosition(chest.x,chest.y); this.pSpark.explode(18);
    if(chest.rarity==='epic'||chest.rarity==='legendary'){
      this.pMagic.setPosition(chest.x,chest.y); this.pMagic.explode(14);
    }
    if(chest._glow) chest._glow.destroy();
    const loot = this._genLoot(chest.rarity);
    if(this.uiScene) this.uiScene.showLoot(loot);
    this._applyGear(loot);
    const bonus={common:50,rare:160,epic:420,legendary:1000};
    this.score += bonus[chest.rarity]||50;
    this.tweens.add({ targets:chest, scaleX:2,scaleY:2,alpha:0, duration:300,
      onComplete:()=>chest.destroy() });
  }

  _genLoot(rarity) {
    const pool = GEAR_POOL.filter(g=>g.rarity===rarity);
    return pool.length ? Phaser.Utils.Array.GetRandom(pool) : Phaser.Utils.Array.GetRandom(GEAR_POOL);
  }

  _applyGear(gear) {
    if(!gear) return;
    if(gear.type==='weapon') {
      const base = { ...WEAPONS[gear.weaponType] };
      if(gear.stats.damage) base.damage += gear.stats.damage;
      if(gear.stats.range)  base.range  += gear.stats.range;
      this.player.weapon = base;
      this._checkSynergies();
    } else {
      const s = gear.stats;
      if(s.hp)      { this.player.stats.maxHp+=s.hp; this.player.hp=Math.min(this.player.hp+s.hp,this.player.stats.maxHp); }
      if(s.defense) this.player.stats.armor = Math.min(0.75,this.player.stats.armor+s.defense);
      if(s.speed)   this.player.stats.speed += s.speed;
      if(s.hpregen) this.player.stats.hpRegen += s.hpregen;
    }
  }

  _randRarity() {
    const r=Math.random();
    if(r<0.50) return 'common';
    if(r<0.78) return 'rare';
    if(r<0.94) return 'epic';
    return 'legendary';
  }


  // ── ULTIMATE ABILITIES ──────────────────────────────────
  _activateUltimate() {
    if(!this.ultimateReady) return;
    this.ultimateReady = false;
    const baseCd = 45;
    this.ultimateCd = baseCd * this.player.stats.ultimateCdMulti;
    this.cameras.main.flash(350,200,100,255);
    this.cameras.main.shake(450,0.018);
    const px=this.player.sprite.x, py=this.player.sprite.y;
    switch(this.player.weapon.ultimate) {
      case 'shadowClone':  this._ultClone(px,py);   break;
      case 'arrowStorm':   this._ultArrows(px,py);  break;
      case 'groundSlam':   this._ultSlam(px,py);    break;
      case 'meteorStrike': this._ultMeteor(px,py);  break;
    }
    if(this.uiScene) this.uiScene.showMessage('ULTIMATE!',1800,0xffaa00);
  }

  _ultClone(x,y) {
    for(let i=0;i<3;i++){
      const startAng = (i/3)*Math.PI*2;
      const clone = this.add.sprite(x,y,'player').setDepth(9).setAlpha(0.6).setTint(0x4444cc);
      let t = startAng;
      const ev = this.time.addEvent({ delay:100, loop:true, callback:()=>{
        if(this.isGameOver||this.isVictory){ev.destroy();clone.destroy();return;}
        t += 0.15;
        const cx=x+Math.cos(t)*90, cy=y+Math.sin(t)*90;
        clone.setPosition(cx,cy);
        const nearest = this._nearestEnemy(cx,cy,220);
        if(nearest) this._fireBullet(cx,cy,Phaser.Math.Angle.Between(cx,cy,nearest.x,nearest.y));
      }});
      this.time.delayedCall(5000,()=>{
        ev.destroy();
        this.tweens.add({ targets:clone, alpha:0, duration:350, onComplete:()=>clone.destroy() });
      });
    }
  }

  _ultArrows(x,y) {
    for(let burst=0;burst<5;burst++){
      this.time.delayedCall(burst*180,()=>{
        const px2=this.player.sprite.x, py2=this.player.sprite.y;
        for(let i=0;i<12;i++) this._fireBullet(px2,py2,(i/12)*Math.PI*2);
      });
    }
  }

  _ultSlam(x,y) {
    const slam = this.add.image(x,y,'explosion').setScale(0.5).setDepth(12);
    this.tweens.add({ targets:slam, scaleX:10,scaleY:10,alpha:0, duration:800, ease:'Power2',
      onComplete:()=>slam.destroy() });
    this.enemyGroup.getChildren().forEach(e=>{
      if(!e.active) return;
      if(Phaser.Math.Distance.Between(x,y,e.x,e.y)<420)
        this._damageEnemy(e, Math.round(this.player.weapon.damage*this.player.stats.damageMulti*5), x,y,500,true);
    });
    this.cameras.main.shake(700,0.022);
  }

  _ultMeteor(x,y) {
    const enemies = this.enemyGroup.getChildren().filter(e=>e.active);
    const targets = enemies.length
      ? Phaser.Utils.Array.Shuffle([...enemies]).slice(0,5)
      : Array.from({length:5},()=>({ x:x+Phaser.Math.Between(-300,300), y:y+Phaser.Math.Between(-300,300) }));
    targets.forEach((t,i)=>{
      this.time.delayedCall(i*280,()=>{
        const tx=t.x||t.x, ty=t.y||t.y;
        const warn = this.add.circle(tx,ty,65,0xff0000,0.25).setDepth(5);
        this.tweens.add({ targets:warn, alpha:0.55, duration:380, yoyo:true, repeat:1,
          onComplete:()=>{ warn.destroy(); this._explode(tx,ty,Math.round(this.player.weapon.damage*this.player.stats.damageMulti*4)); }
        });
      });
    });
  }

  // ── DASH ────────────────────────────────────────────────
  _activateDash() {
    this.isDashing = true; this.dashCd = 3;
    const dx=(this.keys.right.isDown?1:0)-(this.keys.left.isDown?1:0);
    const dy=(this.keys.down.isDown?1:0)-(this.keys.up.isDown?1:0);
    const ang = (dx===0&&dy===0)
      ? Phaser.Math.Angle.Between(this.player.sprite.x,this.player.sprite.y,this.mouseWorld.x,this.mouseWorld.y)
      : Math.atan2(dy,dx);
    const dist=210;
    // Ghost trail
    for(let i=1;i<=5;i++){
      const ghost = this.add.sprite(
        this.player.sprite.x+Math.cos(ang)*(dist/5)*i,
        this.player.sprite.y+Math.sin(ang)*(dist/5)*i,
        'player').setAlpha(0.5-i*0.08).setTint(0x3344cc).setDepth(8);
      this.time.delayedCall(120,()=>ghost.destroy());
    }
    this.tweens.add({
      targets:this.player.sprite,
      x: this.player.sprite.x+Math.cos(ang)*dist,
      y: this.player.sprite.y+Math.sin(ang)*dist,
      duration:190, ease:'Power2',
      onComplete:()=>{ this.isDashing=false; }
    });
  }

  _nearestEnemy(x,y,maxD=Infinity) {
    let best=null, md=maxD;
    this.enemyGroup.getChildren().forEach(e=>{
      if(!e.active) return;
      const d=Phaser.Math.Distance.Between(x,y,e.x,e.y);
      if(d<md){md=d;best=e;}
    });
    return best;
  }

  // ── HAZARDS ─────────────────────────────────────────────
  _spawnInitialHazards() {
    const numLava = 3+this.stageNum;
    for(let i=0;i<numLava;i++) this._spawnLava();
    if(this.stageNum>=2) for(let i=0;i<this.stageNum;i++) this._spawnSaw();
  }

  _spawnLava() {
    let x,y,tries=0;
    do { x=Phaser.Math.Between(300,WORLD_WIDTH-300); y=Phaser.Math.Between(300,WORLD_HEIGHT-300); tries++; }
    while(Phaser.Math.Distance.Between(x,y,WORLD_WIDTH/2,WORLD_HEIGHT/2)<450 && tries<10);
    const lava = this.add.image(x,y,'hazard_lava').setDepth(1).setAlpha(0.85);
    this.tweens.add({ targets:lava, alpha:0.6,scaleX:1.10,scaleY:1.10, duration:800+Math.random()*400, yoyo:true, repeat:-1 });
    this.lavaZones.push({ img:lava, x, y, r:38 });
  }

  _spawnSaw() {
    let x,y,tries=0;
    do { x=Phaser.Math.Between(250,WORLD_WIDTH-250); y=Phaser.Math.Between(250,WORLD_HEIGHT-250); tries++; }
    while(Phaser.Math.Distance.Between(x,y,WORLD_WIDTH/2,WORLD_HEIGHT/2)<550 && tries<10);
    const saw = this.add.image(x,y,'hazard_saw').setDepth(2);
    saw.startX=x; saw.startY=y;
    saw.moveRange = 140+Math.random()*100;
    saw.tOffset   = Math.random()*Math.PI*2;
    this.tweens.add({ targets:saw, angle:360, duration:900+Math.random()*400, repeat:-1 });
    this.sawBlades.push(saw);
  }

  _updateSawBlades(dt) {
    const elapsed = STAGE_DURATION - this.stageTimer;
    this.sawBlades.forEach(saw=>{
      saw.tOffset += dt*1.4;
      saw.x = saw.startX + Math.cos(saw.tOffset) * saw.moveRange;
      saw.y = saw.startY + Math.sin(saw.tOffset*0.7) * saw.moveRange*0.65;
    });
  }

  _tickLavaDamage(dt) {
    this.lavaAccum += dt;
    if(this.lavaAccum < 0.5) return;
    this.lavaAccum = 0;
    const px=this.player.sprite.x, py=this.player.sprite.y;
    this.lavaZones.forEach(lz=>{
      if(Phaser.Math.Distance.Between(px,py,lz.x,lz.y)<lz.r){
        const dmg=Math.round(8*(1-this.player.stats.armor));
        this.player.hp-=dmg;
        this._floatText(px,py-22,`🔥 -${dmg}`,0xff4400,14);
        if(this.player.hp<=0) this._triggerGameOver();
      }
    });
  }

  _checkSawDamage() {
    if(this.player.invincible||this.isDashing) return;
    const px=this.player.sprite.x, py=this.player.sprite.y;
    this.sawBlades.forEach(saw=>{
      if(Phaser.Math.Distance.Between(px,py,saw.x,saw.y)<26){
        const dmg=Math.round(30*(1-this.player.stats.armor));
        this.player.hp-=dmg;
        this.cameras.main.shake(260,0.013);
        this._floatText(px,py-32,`⚙ SAW -${dmg}`,0xff0000,20);
        this.player.invincible=true; this.player.invincTimer=1.5; this.player.flashAccum=0;
        if(this.player.hp<=0) this._triggerGameOver();
      }
    });
  }

  // ── MISC ────────────────────────────────────────────────
  _cleanBullets() {
    this.bullets.getChildren().forEach(b=>{
      if(!b.active) return;
      if(b.x<-50||b.x>WORLD_WIDTH+50||b.y<-50||b.y>WORLD_HEIGHT+50) this._recycleBullet(b);
    });
    this.enemyBullets.getChildren().forEach(b=>{
      if(!b.active) return;
      if(b.x<-50||b.x>WORLD_WIDTH+50||b.y<-50||b.y>WORLD_HEIGHT+50) b.setActive(false).setVisible(false).setVelocity(0,0);
    });
  }

  _difficultyRamp(dt) {
    this.diffRampAccum += dt;
    if(this.diffRampAccum >= 60){ this.diffRampAccum=0; this.waveNumber++; }
  }

  _updateGlow() {
    const cols={Dagger:0x88aaff,Bow:0x44ffaa,Axe:0xff4422,Staff:0xaa44ff};
    const c=cols[this.player.weapon.name]||0x2255cc;
    this.playerGlow.color.setFromRGB(Phaser.Display.Color.IntegerToColor(c));
    this.playerGlow.setPosition(this.player.sprite.x,this.player.sprite.y);
  }

  _floatText(x,y,text,color,size=16) {
    const t = this.add.text(x,y,text,{
      fontSize:`${size}px`,fontFamily:'Georgia,serif',
      color:'#'+color.toString(16).padStart(6,'0'),stroke:'#000',strokeThickness:3
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets:t, y:y-62,alpha:0,scaleX:1.45,scaleY:1.45, duration:880, ease:'Power2',
      onComplete:()=>t.destroy() });
  }

  _pushHUD() {
    if(!this.uiScene) return;
    this.uiScene.updateHUD({
      hp:this.player.hp, maxHp:this.player.stats.maxHp,
      xp:this.player.xp, xpToNext:this.player.xpToNext,
      level:this.player.level, timer:Math.ceil(this.stageTimer),
      score:this.score, weapon:this.player.weapon,
      ultReady:this.ultimateReady, ultCd:this.ultimateCd,
      armor:this.player.stats.armor, dashCd:this.dashCd, hasDash:this.player.stats.hasDash
    });
  }

  // ── WIN / LOSE ───────────────────────────────────────────
  _triggerVictory() {
    if(this.isVictory) return;
    this.isVictory=true;
    this.physics.pause();
    this.cameras.main.flash(900,60,255,90);
    this.cameras.main.shake(400,0.018);
    const save = this._loadSave();
    save.unlockedStage = Math.max(save.unlockedStage||1, this.stageNum+1);
    save.lastRun={ level:this.player.level, score:this.score, survived:'VICTORY!' };
    this._saveSave(save);
    this.time.delayedCall(900,()=>{
      this.scene.stop('UIScene');
      this.scene.start('VictoryScene',{ stage:this.stageNum, score:this.score, level:this.player.level, kills:this.killCount });
    });
  }

  _triggerGameOver() {
    if(this.isGameOver) return;
    this.isGameOver=true;
    this.player.hp=0;
    this.physics.pause();
    this.cameras.main.flash(400,255,0,0);
    this.pBlood.setPosition(this.player.sprite.x,this.player.sprite.y); this.pBlood.explode(30);
    this.player.sprite.setVisible(false);
    const elapsed=STAGE_DURATION-this.stageTimer;
    const save=this._loadSave();
    save.lastRun={ level:this.player.level, score:this.score, survived:`${Math.floor(elapsed/60)}m ${Math.floor(elapsed%60)}s` };
    this._saveSave(save);
    this.time.delayedCall(900,()=>{
      this.scene.stop('UIScene');
      this.scene.start('GameOverScene',{ stage:this.stageNum, score:this.score, level:this.player.level, kills:this.killCount });
    });
  }

  _loadSave(){ try{return JSON.parse(localStorage.getItem('darkRealm_save')||'{}')}catch(e){return {};} }
  _saveSave(d){ try{localStorage.setItem('darkRealm_save',JSON.stringify(d));}catch(e){} }
}


// ═══════════════════════════════════════════════════════════
// UI SCENE  –  HUD overlay (runs parallel with GameScene)
// ═══════════════════════════════════════════════════════════
class UIScene extends Phaser.Scene {
  constructor(){ super({ key:'UIScene' }); }
  init(data){ this.gameScene = data.gameScene; }

  create(){
    const W=GAME_WIDTH, H=GAME_HEIGHT;

    // ── XP BAR (top) ────────────────────────────────────
    this.add.rectangle(W/2, 8, W-40, 14, 0x0a0a14,0.85).setScrollFactor(0).setDepth(100);
    this.xpFill = this.add.rectangle(20, 8, 0, 10, 0x00ffaa).setScrollFactor(0).setDepth(101).setOrigin(0,0.5);
    this.xpText = this.add.text(W/2, 8,'Level 1',{fontSize:'11px',fontFamily:'Georgia,serif',color:'#ffffff'})
      .setScrollFactor(0).setDepth(102).setOrigin(0.5);

    // ── TIMER (top center) ──────────────────────────────
    this.add.rectangle(W/2, 30, 118, 28, 0x0a0a14,0.85).setScrollFactor(0).setDepth(100).setStrokeStyle(1,0x334455);
    this.timerTxt = this.add.text(W/2, 30,'10:00',{fontSize:'18px',fontFamily:'Georgia,serif',color:'#ffffff',stroke:'#000',strokeThickness:2})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── SCORE (top right) ───────────────────────────────
    this.scoreTxt = this.add.text(W-16, 16,'SCORE: 0',{fontSize:'13px',fontFamily:'Georgia,serif',color:'#ffcc00',stroke:'#000',strokeThickness:2})
      .setScrollFactor(0).setDepth(101).setOrigin(1,0.5);

    // ── LEVEL BADGE (top left) ──────────────────────────
    this.add.circle(38,38,26,0x111122,0.9).setScrollFactor(0).setDepth(100).setStrokeStyle(2,0x664400);
    this.lvlTxt = this.add.text(38,38,'LV\n1',{fontSize:'11px',fontFamily:'Georgia,serif',color:'#ffcc00',align:'center',stroke:'#000',strokeThickness:2})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── HP BAR (bottom center) ──────────────────────────
    this.add.rectangle(W/2, H-32, 284, 22, 0x330000,0.9).setScrollFactor(0).setDepth(100).setStrokeStyle(1,0x660000);
    this.hpFill = this.add.rectangle(W/2-140, H-32, 280, 18, 0xff2222).setScrollFactor(0).setDepth(101).setOrigin(0,0.5);
    this.hpTxt  = this.add.text(W/2, H-32,'150/150',{fontSize:'13px',fontFamily:'Georgia,serif',color:'#fff',stroke:'#000',strokeThickness:2})
      .setScrollFactor(0).setDepth(102).setOrigin(0.5);

    // ── WEAPON (bottom left) ────────────────────────────
    this.add.rectangle(65,H-52,110,34,0x111122,0.88).setScrollFactor(0).setDepth(100).setStrokeStyle(1,0x2255cc);
    this.weapTxt = this.add.text(65,H-52,'🗡️ Dagger',{fontSize:'13px',fontFamily:'Georgia,serif',color:'#88aaff',stroke:'#000',strokeThickness:2})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── ULTIMATE BOX (bottom right) ─────────────────────
    this.ultBox = this.add.rectangle(W-54,H-52,84,52,0x111111,0.88).setScrollFactor(0).setDepth(100).setStrokeStyle(2,0x664400);
    this.add.text(W-54,H-69,'ULTIMATE',{fontSize:'9px',fontFamily:'Georgia,serif',color:'#666'}).setScrollFactor(0).setDepth(101).setOrigin(0.5);
    this.ultKey = this.add.text(W-54,H-52,'[Q]',{fontSize:'20px',fontFamily:'Georgia,serif',color:'#ffaa00',stroke:'#000',strokeThickness:3})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);
    this.ultCdTxt = this.add.text(W-54,H-38,'READY',{fontSize:'11px',fontFamily:'Georgia,serif',color:'#ffff00'})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── DASH INDICATOR (bottom right - 2) ───────────────
    this.dashTxt = this.add.text(W-130, H-44,'',{fontSize:'11px',fontFamily:'Georgia,serif',color:'#8888ff'})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── ARMOR LABEL ─────────────────────────────────────
    this.armorTxt = this.add.text(W/2, H-16,'',{fontSize:'10px',fontFamily:'Georgia,serif',color:'#6688aa'})
      .setScrollFactor(0).setDepth(101).setOrigin(0.5);

    // ── MESSAGE TEXT (center) ───────────────────────────
    this.msgTxt = this.add.text(W/2, H*0.5-100,'',{
      fontSize:'24px',fontFamily:'Georgia,serif',color:'#ffffff',stroke:'#000',strokeThickness:4
    }).setScrollFactor(0).setDepth(200).setOrigin(0.5).setAlpha(0);

    // ── LOOT POPUP ──────────────────────────────────────
    this._buildLootPopup(W,H);
  }

  _buildLootPopup(W,H){
    this.lootCon = this.add.container(W/2, H/2).setScrollFactor(0).setDepth(500).setAlpha(0);
    const bg    = this.add.rectangle(0,0,340,160,0x0d1020,0.96).setStrokeStyle(2,0x445566);
    const title = this.add.text(0,-55,'CHEST OPENED!',{fontSize:'17px',fontFamily:'Georgia,serif',color:'#ffcc00',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
    this.lootName  = this.add.text(0,-22,'',{fontSize:'16px',fontFamily:'Georgia,serif',color:'#fff',stroke:'#000',strokeThickness:2}).setOrigin(0.5);
    this.lootRar   = this.add.text(0, 8,'',{fontSize:'13px',fontFamily:'Georgia,serif',color:'#888'}).setOrigin(0.5);
    this.lootStats = this.add.text(0,34,'',{fontSize:'12px',fontFamily:'Georgia,serif',color:'#aaffaa'}).setOrigin(0.5);
    this.lootCon.add([bg,title,this.lootName,this.lootRar,this.lootStats]);
  }

  showLoot(gear){
    if(!gear) return;
    const rc={common:'#aaaaaa',rare:'#4499ff',epic:'#aa44ff',legendary:'#ffaa00'};
    this.lootName.setText(gear.name).setColor(rc[gear.rarity]||'#fff');
    this.lootRar.setText(`[${gear.rarity.toUpperCase()}] ${gear.type.toUpperCase()}`);
    const stats=Object.entries(gear.stats).map(([k,v])=>{
      const L={hp:`+${v} HP`,defense:`+${Math.round(v*100)}% DEF`,damage:`+${v} DMG`,speed:`+${v} SPD`,hpregen:`+${v} HP/s`,range:`+${v} RNG`};
      return L[k]||`${k}:${v}`;
    });
    this.lootStats.setText(stats.join(' | '));
    this.tweens.killTweensOf(this.lootCon);
    this.lootCon.setAlpha(0).setScale(0.5).setY(GAME_HEIGHT/2);
    this.tweens.add({ targets:this.lootCon, alpha:1,scaleX:1,scaleY:1, duration:280, ease:'Back.easeOut' });
    this.time.delayedCall(2600,()=>this.tweens.add({ targets:this.lootCon, alpha:0, duration:380,
      onComplete:()=>this.lootCon.setY(GAME_HEIGHT/2) }));
  }

  showMessage(text,dur=2000,color=0xffffff){
    this.msgTxt.setText(text).setColor('#'+color.toString(16).padStart(6,'0')).setAlpha(1);
    this.tweens.killTweensOf(this.msgTxt);
    this.tweens.add({ targets:this.msgTxt, alpha:0, delay:dur*0.6, duration:dur*0.4 });
  }

  updateHUD(d){
    // XP bar
    const xpRatio=(d.xpToNext>0)?Math.min(d.xp/d.xpToNext,1):0;
    this.xpFill.setSize(Math.max(0,(GAME_WIDTH-40)*xpRatio),10);
    this.xpText.setText(`Level ${d.level}${d.level>=MAX_LEVEL?' (MAX)':''} — ${d.xp}/${d.xpToNext} XP`);
    this.lvlTxt.setText(`LV\n${d.level}`);

    // HP bar
    const hpR=Math.max(0,d.hp)/d.maxHp;
    this.hpFill.setSize(Math.max(0,280*hpR),18);
    this.hpFill.setFillStyle(hpR>0.5?0xff2222:hpR>0.25?0xff8800:0xdd0000);
    this.hpTxt.setText(`HP: ${Math.max(0,Math.round(d.hp))} / ${d.maxHp}`);

    // Timer
    const min=Math.floor(d.timer/60), sec=d.timer%60;
    this.timerTxt.setText(`${min}:${sec.toString().padStart(2,'0')}`);
    this.timerTxt.setColor(d.timer<=60?(d.timer%2<1?'#ff4444':'#ffaa00'):'#ffffff');

    // Score
    this.scoreTxt.setText(`SCORE: ${d.score.toLocaleString()}`);

    // Weapon
    const wIcons={Dagger:'🗡️',Bow:'🏹',Axe:'🪓',Staff:'🪄'};
    this.weapTxt.setText(`${wIcons[d.weapon.name]||'⚔️'} ${d.weapon.name}`);

    // Ultimate
    if(d.ultReady){ this.ultKey.setColor('#ffaa00'); this.ultCdTxt.setText('READY').setColor('#ffff00'); this.ultBox.setStrokeStyle(2,0xffaa00); }
    else { this.ultKey.setColor('#555'); this.ultCdTxt.setText(`${Math.ceil(d.ultCd)}s`).setColor('#777'); this.ultBox.setStrokeStyle(2,0x664400); }

    // Dash
    if(d.hasDash) this.dashTxt.setText(d.dashCd>0?`DASH ${Math.ceil(d.dashCd)}s`:'DASH RDY').setColor(d.dashCd>0?'#555':'#8888ff');

    // Armor
    if(d.armor>0) this.armorTxt.setText(`DEF: ${Math.round(d.armor*100)}%`);
  }
}


// ─────────────────────────────────────────────
// UPGRADE SCENE  (level-up card selection)
// ─────────────────────────────────────────────
class UpgradeScene extends Phaser.Scene {
  constructor(){ super({ key:'UpgradeScene' }); }

  init(data){
    this.choices   = data.choices;
    this.player    = data.player;
    this.gameScene = data.gameScene;
  }

  create(){
    const W=GAME_WIDTH, H=GAME_HEIGHT;

    // Dim overlay
    this.add.rectangle(W/2,H/2,W,H,0x000000,0.78).setScrollFactor(0);

    // Title
    this.add.text(W/2, H*0.11, 'LEVEL UP!', {
      fontSize:'46px', fontFamily:'Georgia,serif', color:'#ffcc00',
      stroke:'#000', strokeThickness:6,
      shadow:{ blur:24, color:'#ff8800', fill:true }
    }).setOrigin(0.5);

    this.add.text(W/2, H*0.22, 'Choose an Upgrade', {
      fontSize:'16px', fontFamily:'Georgia,serif', color:'#888'
    }).setOrigin(0.5);

    // Cards
    const cardW=220, cardH=210;
    const total   = this.choices.length;
    const spacing = cardW + 30;
    const startX  = W/2 - spacing*(total-1)/2;

    this.choices.forEach((upg,i)=>{
      this._makeCard(startX + i*spacing, H*0.56, cardW, cardH, upg, i);
    });

    this.cameras.main.fadeIn(180,0,0,0);
  }

  _makeCard(x,y,w,h,upg,idx){
    const RC = { common:0x777777, rare:0x4499ff, epic:0xaa44ff, legendary:0xffaa00 };
    const col = RC[upg.rarity] || 0x777777;

    // Glow bg for epic/legendary
    if(upg.rarity==='epic'||upg.rarity==='legendary'){
      const gl=this.add.rectangle(x,y,w+14,h+14,col,0.13);
      this.tweens.add({ targets:gl, alpha:0.04, duration:850, yoyo:true, repeat:-1 });
    }

    // Card body
    const card=this.add.rectangle(x,y,w,h,0x0c1018,0.96)
      .setStrokeStyle(2,col).setInteractive({ useHandCursor:true });

    // Icon
    this.add.text(x, y-68, upg.icon, { fontSize:'38px' }).setOrigin(0.5);

    // Name
    this.add.text(x, y-26, upg.name, {
      fontSize:'17px', fontFamily:'Georgia,serif',
      color:'#'+col.toString(16).padStart(6,'0'),
      stroke:'#000', strokeThickness:2
    }).setOrigin(0.5);

    // Desc
    this.add.text(x, y+16, upg.desc, {
      fontSize:'13px', fontFamily:'Georgia,serif', color:'#ccc',
      wordWrap:{ width:w-20 }, align:'center'
    }).setOrigin(0.5);

    // Rarity tag
    this.add.text(x, y+72, upg.rarity.toUpperCase(), {
      fontSize:'11px', fontFamily:'Georgia,serif',
      color:'#'+col.toString(16).padStart(6,'0')
    }).setOrigin(0.5);

    // Hover
    card.on('pointerover', ()=>{ card.setStrokeStyle(3,0xffffff); this.tweens.add({ targets:card, scaleX:1.05,scaleY:1.05, duration:110 }); });
    card.on('pointerout',  ()=>{ card.setStrokeStyle(2,col);      this.tweens.add({ targets:card, scaleX:1,scaleY:1, duration:110 }); });
    card.on('pointerdown', ()=>this._pick(upg));

    // Entrance
    card.setAlpha(0);
    this.tweens.add({ targets:card, alpha:1, duration:260, delay:idx*90, ease:'Back.easeOut' });
  }

  _pick(upg){
    this.cameras.main.fadeOut(130,0,0,0);
    this.time.delayedCall(130,()=>{
      this.gameScene.applyUpgrade(upg);
      this.scene.stop();
    });
  }
}

// ─────────────────────────────────────────────
// VICTORY SCENE
// ─────────────────────────────────────────────
class VictoryScene extends Phaser.Scene {
  constructor(){ super({ key:'VictoryScene' }); }

  init(data){
    this.stageNum = data.stage;
    this.score    = data.score;
    this.level    = data.level;
    this.kills    = data.kills;
  }

  create(){
    const W=GAME_WIDTH, H=GAME_HEIGHT;

    this.add.rectangle(W/2,H/2,W,H,0x040810);
    this._spawnConfetti();

    // Title
    this.add.text(W/2, H*0.17, 'STAGE CLEARED!', {
      fontSize:'58px', fontFamily:'Georgia,serif', color:'#44ff88',
      stroke:'#000', strokeThickness:7,
      shadow:{ blur:30, color:'#00ff44', fill:true }
    }).setOrigin(0.5);

    this.add.text(W/2, H*0.30, `Stage ${this.stageNum} — Survived!`, {
      fontSize:'20px', fontFamily:'Georgia,serif', color:'#666'
    }).setOrigin(0.5);

    // Stats
    [
      { label:'Score',          val:this.score.toLocaleString(), col:'#ffcc00' },
      { label:'Level Reached',  val:`${this.level}`,             col:'#88aaff' },
      { label:'Enemies Slain',  val:`${this.kills}`,             col:'#ff8888' },
    ].forEach((s,i)=>{
      const sy = H*0.44 + i*52;
      this.add.text(W/2-70, sy, s.label+':', { fontSize:'17px', fontFamily:'Georgia,serif', color:'#555' }).setOrigin(1,0.5);
      this.add.text(W/2-50, sy, s.val,       { fontSize:'20px', fontFamily:'Georgia,serif', color:s.col, stroke:'#000', strokeThickness:2 }).setOrigin(0,0.5);
    });

    this.add.text(W/2, H*0.71, `STAGE ${this.stageNum+1} UNLOCKED`, {
      fontSize:'15px', fontFamily:'Georgia,serif', color:'#44ff88'
    }).setOrigin(0.5);

    // Button
    const btn=this.add.text(W/2, H*0.83, '[ CONTINUE TO MENU ]', {
      fontSize:'28px', fontFamily:'Georgia,serif', color:'#44ff88',
      stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    btn.on('pointerover',()=>btn.setColor('#ffffff'));
    btn.on('pointerout', ()=>btn.setColor('#44ff88'));
    btn.on('pointerdown',()=>{
      this.cameras.main.fadeOut(380,0,0,0);
      this.time.delayedCall(380,()=>this.scene.start('MainMenuScene'));
    });

    this.tweens.add({ targets:btn, alpha:0.65, duration:750, yoyo:true, repeat:-1 });
    this.cameras.main.fadeIn(700,0,0,0);
  }

  _spawnConfetti(){
    const cols=[0x44ff88,0xffcc00,0x4488ff,0xff44aa,0xaaffaa,0xff8800];
    for(let i=0;i<55;i++){
      const x=Math.random()*GAME_WIDTH;
      const p=this.add.circle(x, GAME_HEIGHT+10, 2+Math.random()*5,
        Phaser.Utils.Array.GetRandom(cols), 0.85);
      this.tweens.add({
        targets:p, y:p.y-GAME_HEIGHT-60,
        x:x+Phaser.Math.Between(-120,120), alpha:0,
        duration:2200+Math.random()*3000,
        delay:Math.random()*2200, repeat:-1
      });
    }
  }
}

// ─────────────────────────────────────────────
// GAME OVER SCENE
// ─────────────────────────────────────────────
class GameOverScene extends Phaser.Scene {
  constructor(){ super({ key:'GameOverScene' }); }

  init(data){
    this.stageNum = data.stage;
    this.score    = data.score;
    this.level    = data.level;
    this.kills    = data.kills;
  }

  create(){
    const W=GAME_WIDTH, H=GAME_HEIGHT;

    this.add.rectangle(W/2,H/2,W,H,0x050005);

    // Blood vignette
    const vig=this.add.graphics();
    vig.fillGradientStyle(0x330000,0x330000,0x000000,0x000000,0.65);
    vig.fillRect(0,0,W,H);

    // Title
    this.add.text(W/2, H*0.17, 'YOU DIED', {
      fontSize:'76px', fontFamily:'Georgia,serif', color:'#cc0000',
      stroke:'#000', strokeThickness:9,
      shadow:{ blur:45, color:'#ff0000', fill:true }
    }).setOrigin(0.5);

    this.add.text(W/2, H*0.30, `Stage ${this.stageNum}`, {
      fontSize:'18px', fontFamily:'Georgia,serif', color:'#555'
    }).setOrigin(0.5);

    // Stats
    [
      { label:'Score',         val:this.score.toLocaleString(), col:'#ffcc00' },
      { label:'Level Reached', val:`${this.level}`,             col:'#88aaff' },
      { label:'Enemies Slain', val:`${this.kills}`,             col:'#ff8888' },
    ].forEach((s,i)=>{
      const sy=H*0.44+i*52;
      this.add.text(W/2-70, sy, s.label+':', { fontSize:'17px', fontFamily:'Georgia,serif', color:'#444' }).setOrigin(1,0.5);
      this.add.text(W/2-50, sy, s.val,       { fontSize:'20px', fontFamily:'Georgia,serif', color:s.col, stroke:'#000', strokeThickness:2 }).setOrigin(0,0.5);
    });

    // Buttons
    const retryBtn=this.add.text(W/2-110, H*0.78, '[ TRY AGAIN ]', {
      fontSize:'24px', fontFamily:'Georgia,serif', color:'#cc4444', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    retryBtn.on('pointerover',()=>retryBtn.setColor('#ff8888'));
    retryBtn.on('pointerout', ()=>retryBtn.setColor('#cc4444'));
    retryBtn.on('pointerdown',()=>{
      this.cameras.main.fadeOut(380,0,0,0);
      this.time.delayedCall(380,()=>this.scene.start('GameScene',{ stage:this.stageNum }));
    });

    const menuBtn=this.add.text(W/2+110, H*0.78, '[ MAIN MENU ]', {
      fontSize:'24px', fontFamily:'Georgia,serif', color:'#888', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setInteractive({ useHandCursor:true });

    menuBtn.on('pointerover',()=>menuBtn.setColor('#ccc'));
    menuBtn.on('pointerout', ()=>menuBtn.setColor('#888'));
    menuBtn.on('pointerdown',()=>{
      this.cameras.main.fadeOut(380,0,0,0);
      this.time.delayedCall(380,()=>this.scene.start('MainMenuScene'));
    });

    this.cameras.main.fadeIn(600,20,0,0);
  }
}

// ─────────────────────────────────────────────
// PHASER GAME CONFIG & BOOT
// ─────────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#05050f',
  parent: 'game-container',
  physics:{
    default:'arcade',
    arcade:{ debug:false, gravity:{ y:0 } }
  },
  scene:[ BootScene, MainMenuScene, GameScene, UIScene,
          UpgradeScene, VictoryScene, GameOverScene ],
  scale:{
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render:{ antialias:true, pixelArt:false }
};

window.addEventListener('load',()=>{
  // Hide loading screen once Phaser starts
  const loading = document.getElementById('loading');
  if(loading){
    setTimeout(()=>{
      loading.style.opacity='0';
      setTimeout(()=>{ loading.style.display='none'; },500);
    },1400);
  }
  window.gameInstance = new Phaser.Game(config);
});
