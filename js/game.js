// ゲーム設定
const BLOCK_SIZE = 32;
const WORLD_WIDTH = 300;  // 100 → 300に拡張（3倍）
const WORLD_HEIGHT = 100; // 30 → 100に拡張（3倍以上）
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;

// キャンバス設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ブロックタイプ（crafting.jsから読み込み）
const BlockType = window.ItemType || {
    AIR: 0,
    DIRT: 1,
    GRASS: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    SAND: 6,
    PLANKS: 7,
    STICK: 8,
    CRAFTING_TABLE: 9,
    WOODEN_PICKAXE: 10,
    STONE_PICKAXE: 11,
    WOODEN_AXE: 12,
    STONE_AXE: 13,
    COBBLESTONE: 14
};

// ブロック情報（crafting.jsから読み込み）
const blockInfo = window.itemInfo || {
    [BlockType.AIR]: { name: '空気', color: null, drops: null },
    [BlockType.DIRT]: { name: '土', color: '#8B4513', drops: BlockType.DIRT },
    [BlockType.GRASS]: { name: '草ブロック', color: '#228B22', drops: BlockType.DIRT },
    [BlockType.STONE]: { name: '石', color: '#808080', drops: BlockType.COBBLESTONE },
    [BlockType.WOOD]: { name: '原木', color: '#654321', drops: BlockType.WOOD },
    [BlockType.LEAVES]: { name: '葉', color: '#006400', drops: BlockType.LEAVES },
    [BlockType.SAND]: { name: '砂', color: '#F4E4BC', drops: BlockType.SAND },
    [BlockType.PLANKS]: { name: '木材', color: '#DEB887', drops: BlockType.PLANKS },
    [BlockType.STICK]: { name: '棒', color: '#8B7355', drops: BlockType.STICK },
    [BlockType.CRAFTING_TABLE]: { name: '作業台', color: '#8B4513', drops: BlockType.CRAFTING_TABLE },
    [BlockType.WOODEN_PICKAXE]: { name: '木のツルハシ', color: '#A0522D', drops: BlockType.WOODEN_PICKAXE },
    [BlockType.STONE_PICKAXE]: { name: '石のツルハシ', color: '#696969', drops: BlockType.STONE_PICKAXE },
    [BlockType.WOODEN_AXE]: { name: '木のオノ', color: '#A0522D', drops: BlockType.WOODEN_AXE },
    [BlockType.STONE_AXE]: { name: '石のオノ', color: '#696969', drops: BlockType.STONE_AXE },
    [BlockType.COBBLESTONE]: { name: '丸石', color: '#A9A9A9', drops: BlockType.COBBLESTONE }
};

// ワールド生成
class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.blocks = [];
        this.generate();
    }

    generate() {
        // ワールド配列初期化
        for (let x = 0; x < this.width; x++) {
            this.blocks[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.blocks[x][y] = BlockType.AIR;
            }
        }

        // 地形生成 - 地表は中央付近に配置（高さ40付近）
        const surfaceLevel = Math.floor(this.height * 0.4);  // 地表レベルを上の方に

        for (let x = 0; x < this.width; x++) {
            // 地形の高さを変化させる（より大きな起伏）
            const largeTerrain = Math.sin(x * 0.02) * 8;  // 大きな起伏
            const smallTerrain = Math.sin(x * 0.1) * 3;   // 小さな起伏
            const microTerrain = Math.sin(x * 0.3) * 1;   // 細かい起伏

            const terrainHeight = Math.floor(surfaceLevel + largeTerrain + smallTerrain + microTerrain);

            for (let y = 0; y < this.height; y++) {
                if (y === terrainHeight) {
                    // 地表
                    this.blocks[x][y] = BlockType.GRASS;
                } else if (y > terrainHeight && y < terrainHeight + 4) {
                    // 表層の土
                    this.blocks[x][y] = BlockType.DIRT;
                } else if (y >= terrainHeight + 4 && y < terrainHeight + 8) {
                    // 土と石の混合層
                    this.blocks[x][y] = Math.random() < 0.7 ? BlockType.DIRT : BlockType.STONE;
                } else if (y >= terrainHeight + 8 && y < this.height * 0.8) {
                    // 石層
                    this.blocks[x][y] = BlockType.STONE;

                    // 鉱石の生成（深さによって確率変化）
                    const depth = y / this.height;

                    // 石炭（浅い〜中層）
                    if (depth > 0.45 && depth < 0.65 && Math.random() < 0.03) {
                        this.blocks[x][y] = window.ItemType ? window.ItemType.COAL : BlockType.STONE;
                    }
                    // 鉄鉱石（中層）
                    else if (depth > 0.5 && depth < 0.7 && Math.random() < 0.02) {
                        this.blocks[x][y] = window.ItemType ? window.ItemType.IRON_ORE : BlockType.STONE;
                    }
                    // 金鉱石（深層）
                    else if (depth > 0.6 && depth < 0.75 && Math.random() < 0.01) {
                        this.blocks[x][y] = window.ItemType ? window.ItemType.GOLD_ORE : BlockType.STONE;
                    }
                    // ダイヤモンド鉱石（深層・レア）
                    else if (depth > 0.6 && depth < 0.85 && Math.random() < 0.025) {
                        this.blocks[x][y] = window.ItemType ? window.ItemType.DIAMOND_ORE : BlockType.STONE;
                    }
                    // エメラルド（最深層・レア）
                    else if (depth > 0.7 && Math.random() < 0.005) {
                        this.blocks[x][y] = window.ItemType ? window.ItemType.EMERALD : BlockType.STONE;
                    }
                } else if (y >= this.height * 0.8) {
                    // 最深部 - 岩盤層
                    this.blocks[x][y] = BlockType.STONE;
                }

                // 洞窟の生成（簡易版）
                if (y > terrainHeight + 10 && y < this.height * 0.7) {
                    const caveNoise = Math.sin(x * 0.1) * Math.cos(y * 0.1);
                    if (Math.abs(caveNoise) > 0.8 && Math.random() < 0.3) {
                        this.blocks[x][y] = BlockType.AIR;
                    }
                }
            }

            // 川の生成
            if (Math.sin(x * 0.03) > 0.7 && Math.random() < 0.8) {
                // 川底を作る
                for (let dy = 0; dy < 4; dy++) {
                    if (terrainHeight + dy < this.height) {
                        if (dy < 2) {
                            // 水ブロック
                            this.blocks[x][terrainHeight + dy] = window.ItemType ? window.ItemType.WATER : BlockType.AIR;
                        } else {
                            // 川底は砂
                            this.blocks[x][terrainHeight + dy] = BlockType.SAND;
                        }
                    }
                }
                // 川の両岸も砂にする
                if (x > 0 && x < this.width - 1) {
                    for (let dx = -2; dx <= 2; dx++) {
                        if (x + dx >= 0 && x + dx < this.width) {
                            if (this.blocks[x + dx][terrainHeight + 2] === BlockType.DIRT) {
                                this.blocks[x + dx][terrainHeight + 2] = BlockType.SAND;
                            }
                        }
                    }
                }
            }
            // 砂地の生成（川や湖の近く風）
            else if (Math.sin(x * 0.05) > 0.6) {
                for (let dy = 0; dy < 3; dy++) {
                    if (terrainHeight + dy < this.height) {
                        if (this.blocks[x][terrainHeight + dy] === BlockType.GRASS ||
                            this.blocks[x][terrainHeight + dy] === BlockType.DIRT) {
                            this.blocks[x][terrainHeight + dy] = BlockType.SAND;
                        }
                    }
                }
            }

            // 木を生成（確率を調整）
            if (Math.random() < 0.05 && x > 5 && x < this.width - 5) {
                // 草ブロックの上にのみ生成
                if (this.blocks[x][terrainHeight] === BlockType.GRASS) {
                    const treeHeight = 5 + Math.floor(Math.random() * 4);
                    const treeY = terrainHeight - 1;

                    // 幹
                    for (let i = 0; i < treeHeight; i++) {
                        if (treeY - i >= 0) {
                            this.blocks[x][treeY - i] = BlockType.WOOD;
                        }
                    }

                    // 葉っぱ（より大きく）
                    for (let dx = -3; dx <= 3; dx++) {
                        for (let dy = 0; dy <= 3; dy++) {
                            const leafX = x + dx;
                            const leafY = treeY - treeHeight - dy;
                            if (leafX >= 0 && leafX < this.width && leafY >= 0 && leafY < this.height) {
                                if (Math.abs(dx) <= 2 || dy <= 2) {
                                    if (this.blocks[leafX][leafY] === BlockType.AIR) {
                                        this.blocks[leafX][leafY] = BlockType.LEAVES;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    getBlock(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return BlockType.AIR;
        }
        return this.blocks[Math.floor(x)][Math.floor(y)];
    }

    setBlock(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.blocks[Math.floor(x)][Math.floor(y)] = type;
            return true;
        }
        return false;
    }

    breakBlock(x, y) {
        const blockType = this.getBlock(x, y);
        if (blockType !== BlockType.AIR) {
            const drops = blockInfo[blockType].drops;
            this.setBlock(x, y, BlockType.AIR);
            return drops;
        }
        return null;
    }
}

// プレイヤークラス
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = BLOCK_SIZE * 0.8;
        this.height = BLOCK_SIZE * 1.8;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;

        // 体力システム
        this.health = 20;
        this.maxHealth = 20;
        this.defense = 0; // 防御力
        this.attackPower = 1; // 攻撃力
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.lastAttackTime = 0;
        this.attackCooldown = 500; // 攻撃クールダウン

        // 装備
        this.equippedWeapon = null;
        this.equippedArmor = {
            helmet: null,
            chestplate: null,
            leggings: null,
            boots: null
        };
    }

    update(world, deltaTime) {
        // 水中チェック
        const blockX = Math.floor((this.x + this.width/2) / BLOCK_SIZE);
        const blockY = Math.floor((this.y + this.height/2) / BLOCK_SIZE);
        const inWater = world.getBlock(blockX, blockY) === window.ItemType?.WATER;

        if (inWater) {
            // 水中での動き
            this.vy += GRAVITY * 0.3; // 重力を弱める
            this.vy = Math.min(this.vy, 3); // 落下速度制限

            // 泳ぐ（ジャンプキーで上昇）
            if (this.isSwimming) {
                this.vy = -4;
            }
        } else {
            // 通常の重力
            this.vy += GRAVITY;
            this.vy = Math.min(this.vy, 15);
        }

        // X方向の移動と衝突判定
        const newX = this.x + this.vx;
        if (!this.checkCollision(world, newX, this.y)) {
            this.x = newX;
        } else {
            this.vx = 0;
        }

        // Y方向の移動と衝突判定
        const newY = this.y + this.vy;
        if (!this.checkCollision(world, this.x, newY)) {
            this.y = newY;
            this.onGround = false;
        } else {
            if (this.vy > 0) {
                this.onGround = true;
            }
            this.vy = 0;
        }

        // 摩擦
        if (inWater) {
            this.vx *= 0.9; // 水中では摩擦が大きい
        } else {
            this.vx *= 0.8;
        }

        // 無敵時間の更新
        if (this.invulnerable && deltaTime) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // 落下死判定
        if (this.y > world.height * BLOCK_SIZE) {
            this.takeDamage(100);
        }
    }

    checkCollision(world, x, y) {
        const left = Math.floor(x / BLOCK_SIZE);
        const right = Math.floor((x + this.width) / BLOCK_SIZE);
        const top = Math.floor(y / BLOCK_SIZE);
        const bottom = Math.floor((y + this.height) / BLOCK_SIZE);

        for (let bx = left; bx <= right; bx++) {
            for (let by = top; by <= bottom; by++) {
                if (world.getBlock(bx, by) !== BlockType.AIR) {
                    return true;
                }
            }
        }
        return false;
    }

    jump() {
        // 水中チェック
        const blockX = Math.floor((this.x + this.width/2) / BLOCK_SIZE);
        const blockY = Math.floor((this.y + this.height/2) / BLOCK_SIZE);
        const inWater = world.getBlock(blockX, blockY) === window.ItemType?.WATER;

        if (inWater) {
            // 水中では常に泳げる
            this.isSwimming = true;
            this.vy = -4;
        } else if (this.onGround) {
            this.vy = JUMP_FORCE;
        }
    }

    moveLeft() {
        this.vx = -MOVE_SPEED;
    }

    moveRight() {
        this.vx = MOVE_SPEED;
    }

    takeDamage(damage) {
        if (this.invulnerable) return;

        const actualDamage = Math.max(1, damage - this.defense);
        this.health -= actualDamage;
        this.health = Math.max(0, this.health);

        this.invulnerable = true;
        this.invulnerableTime = 1000; // 1秒の無敵時間

        this.updateHealthBar();

        if (this.health <= 0) {
            this.respawn();
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthBar();
    }

    respawn() {
        this.x = WORLD_WIDTH * BLOCK_SIZE / 2;
        this.y = 30 * BLOCK_SIZE;
        this.health = this.maxHealth;
        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthBar = document.getElementById('healthFill');
        const healthText = document.getElementById('healthText');
        if (healthBar && healthText) {
            const percentage = (this.health / this.maxHealth) * 100;
            healthBar.style.width = percentage + '%';
            healthText.textContent = `❤️ ${Math.floor(this.health)}/${this.maxHealth}`;
        }
    }

    equipWeapon(itemType) {
        this.equippedWeapon = itemType;

        // 武器による攻撃力設定
        switch(itemType) {
            case window.ItemType?.WOODEN_SWORD:
                this.attackPower = 4;
                break;
            case window.ItemType?.STONE_SWORD:
                this.attackPower = 5;
                break;
            case window.ItemType?.IRON_SWORD:
                this.attackPower = 6;
                break;
            case window.ItemType?.GOLD_SWORD:
                this.attackPower = 4;
                break;
            case window.ItemType?.DIAMOND_SWORD:
                this.attackPower = 7;
                break;
            default:
                this.attackPower = 1;
        }
    }

    attack(enemyManager) {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.lastAttackTime = now;

        // 攻撃範囲の計算
        const attackX = this.x + this.width / 2;
        const attackY = this.y + this.height / 2;
        const attackRange = BLOCK_SIZE * 2;

        // 敵にダメージを与える
        if (enemyManager) {
            enemyManager.attackEnemiesAt(attackX, attackY, this.attackPower, attackRange);
        }

        // 動物にダメージを与える
        if (window.animalManager) {
            window.animalManager.checkAttack(this, attackX, attackY, this.attackPower);
        }
    }

    draw(ctx, camera) {
        // 無敵時間中は点滅
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(
            this.x - camera.x,
            this.y - camera.y,
            this.width,
            this.height
        );

        // 顔を描く
        ctx.fillStyle = '#000';
        // 目
        ctx.fillRect(this.x - camera.x + 5, this.y - camera.y + 10, 4, 4);
        ctx.fillRect(this.x - camera.x + 16, this.y - camera.y + 10, 4, 4);
        // 口
        ctx.fillRect(this.x - camera.x + 8, this.y - camera.y + 18, 8, 2);

        // 剣を持っている場合の表示
        if (this.equippedWeapon) {
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(
                this.x - camera.x + this.width,
                this.y - camera.y + 12,
                4,
                20
            );
        }

        ctx.globalAlpha = 1.0;
    }
}

// カメラクラス
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    follow(player) {
        this.x = player.x - canvas.width / 2;
        this.y = player.y - canvas.height / 2;

        // カメラ範囲制限
        this.x = Math.max(0, Math.min(this.x, world.width * BLOCK_SIZE - canvas.width));
        this.y = Math.max(0, Math.min(this.y, world.height * BLOCK_SIZE - canvas.height));
    }
}

// インベントリクラス
class Inventory {
    constructor() {
        this.slots = [];
        this.selectedIndex = 0;
        this.maxSlots = 16; // 8→16スロットに拡張

        // スロット初期化
        for (let i = 0; i < this.maxSlots; i++) {
            this.slots.push({ item: null, count: 0 });
        }

        this.createUI();
    }

    createUI() {
        const inventoryDiv = document.getElementById('inventory');
        inventoryDiv.innerHTML = '';

        for (let i = 0; i < this.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            if (i === this.selectedIndex) {
                slot.classList.add('selected');
            }
            slot.onclick = () => this.selectSlot(i);

            if (this.slots[i].item) {
                const info = blockInfo[this.slots[i].item];

                // 背景色を薄くして文字を見やすく
                slot.style.background = info.color + '44'; // 透明度を追加

                // アイテム名を表示（短縮版）
                const label = document.createElement('div');
                label.style.color = '#FFF';
                label.style.fontSize = '8px';
                label.style.textAlign = 'center';
                label.style.textShadow = '1px 1px 2px #000';
                label.style.fontWeight = 'bold';

                // アイコンか名前の短縮版を表示
                const icons = {
                    [BlockType.DIRT]: '🟫土',
                    [BlockType.GRASS]: '🟩草',
                    [BlockType.STONE]: '⬜石',
                    [BlockType.WOOD]: '🪵木',
                    [BlockType.LEAVES]: '🍃葉',
                    [BlockType.SAND]: '🟨砂',
                    [BlockType.PLANKS]: '🟫板',
                    [BlockType.STICK]: '｜棒',
                    [BlockType.CRAFTING_TABLE]: '🔨台',
                    [BlockType.FURNACE]: '🔥炉',
                    [BlockType.CHEST]: '📦箱',
                    [BlockType.TORCH]: '🔦灯',
                    [BlockType.COAL]: '⚫炭',
                    [BlockType.IRON_ORE]: '🔶鉄鉱',
                    [BlockType.IRON_INGOT]: '🔩鉄',
                    [BlockType.GOLD_ORE]: '🟡金鉱',
                    [BlockType.GOLD_INGOT]: '🪙金',
                    [BlockType.EMERALD]: '💚緑',
                    [BlockType.WOODEN_SWORD]: '🗡️木剣',
                    [BlockType.STONE_SWORD]: '⚔️石剣',
                    [BlockType.IRON_SWORD]: '🗡️鉄剣',
                    [BlockType.DIAMOND_SWORD]: '💎剣',
                    // ツール
                    [BlockType.WOODEN_PICKAXE]: '⛏️木',
                    [BlockType.STONE_PICKAXE]: '⛏️石',
                    [BlockType.WOODEN_AXE]: '🪓木',
                    [BlockType.STONE_AXE]: '🪓石',
                    [BlockType.IRON_PICKAXE]: '⛏️鉄',
                    [BlockType.IRON_AXE]: '🪓鉄',
                    // その他
                    [BlockType.COBBLESTONE]: '🪨石',
                    [BlockType.GLASS]: '🪟硝',
                    [BlockType.BRICK]: '🧱煉',
                    [BlockType.DOOR]: '🚪扉',
                    [BlockType.LADDER]: '🪜梯',
                    [BlockType.FENCE]: '🪵柵',
                    // 防具
                    [BlockType.LEATHER_HELMET]: '🎩革兜',
                    [BlockType.LEATHER_CHESTPLATE]: '🦺革鎧',
                    [BlockType.LEATHER_LEGGINGS]: '👖革脚',
                    [BlockType.LEATHER_BOOTS]: '👢革靴',
                    [BlockType.IRON_HELMET]: '⛑️鉄兜',
                    [BlockType.IRON_CHESTPLATE]: '🦺鉄鎧',
                    [BlockType.IRON_LEGGINGS]: '👖鉄脚',
                    [BlockType.IRON_BOOTS]: '👢鉄靴',
                    // その他戦闘
                    [BlockType.BOW]: '🏹弓',
                    [BlockType.ARROW]: '➡️矢',
                    [BlockType.STRING]: '🪢糸',
                    [BlockType.LEATHER]: '🟫革',
                    // 楽しいアイテム
                    23: '❓謎',
                    24: '✨粉',
                    25: '🌈虹',
                    26: '😊笑',
                    27: '⭐星',
                    28: '🍰蛋',
                    29: '🍪菓',
                    30: '💎宝',
                    31: '🪄杖',
                    32: '🪴鉢'
                };

                label.textContent = icons[this.slots[i].item] ||
                                   info.name.substring(0, 2);
                slot.appendChild(label);

                // 個数表示
                const count = document.createElement('span');
                count.className = 'item-count';
                count.textContent = this.slots[i].count;
                slot.appendChild(count);
            }

            inventoryDiv.appendChild(slot);
        }
    }

    selectSlot(index) {
        this.selectedIndex = index;
        this.createUI();
    }

    addItem(item, count = 1) {
        // 同じアイテムのスロットを探す
        for (let slot of this.slots) {
            if (slot.item === item) {
                slot.count += count;
                this.createUI();
                return true;
            }
        }

        // 空きスロットを探す
        for (let slot of this.slots) {
            if (!slot.item) {
                slot.item = item;
                slot.count = count;
                this.createUI();
                return true;
            }
        }

        return false; // インベントリが満杯
    }

    removeItemAt(index, count = 1) {
        if (index < 0 || index >= this.maxSlots) return false;
        const slot = this.slots[index];

        if (slot.item === null) return false;

        slot.count -= count;
        if (slot.count <= 0) {
            slot.item = null;
            slot.count = 0;
        }

        this.createUI();
        return true;
    }

    getSelectedItem() {
        const slot = this.slots[this.selectedIndex];
        return slot.item;
    }

    useSelectedItem() {
        const slot = this.slots[this.selectedIndex];
        if (slot.item && slot.count > 0) {
            slot.count--;
            if (slot.count === 0) {
                slot.item = null;
            }
            this.createUI();
            return true;
        }
        return false;
    }
}

// ゲーム初期化
const world = new World(WORLD_WIDTH, WORLD_HEIGHT);
const player = new Player(WORLD_WIDTH * BLOCK_SIZE / 2, 30 * BLOCK_SIZE); // 地表付近に配置
const camera = new Camera();
const inventory = new Inventory();
const miningSystem = new (window.MiningSystem || class {})();
const enemyManager = new (window.EnemyManager || class {})();
const dayNightCycle = new (window.DayNightCycle || class {})();

// 敵マネージャーに昼夜サイクルを設定
if (enemyManager.setDayNightCycle) {
    enemyManager.setDayNightCycle(dayNightCycle);
}

// 初期アイテムを与える
inventory.addItem(BlockType.WOOD);
inventory.addItem(BlockType.WOOD);
inventory.addItem(BlockType.WOOD);
inventory.addItem(BlockType.WOOD);
inventory.addItem(BlockType.WOODEN_SWORD || BlockType.WOOD); // 木の剣もスタート時に与える

// インベントリをグローバルに公開
window.inventory = inventory;

// チェストシステムの初期化
const chestManager = new ChestManager();
const chestUI = new ChestUI(inventory, chestManager);
window.chestUI = chestUI;

// プレイヤーの初期設定
player.updateHealthBar();

// タッチ/クリックイベント
let isMining = false;
let miningTarget = null;

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('mousedown', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('mouseup', handleTouchEnd);
canvas.addEventListener('touchcancel', handleTouchEnd);
canvas.addEventListener('mouseleave', handleTouchEnd);

function handleTouchStart(e) {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // ワールド座標に変換
    const worldX = Math.floor((x + camera.x) / BLOCK_SIZE);
    const worldY = Math.floor((y + camera.y) / BLOCK_SIZE);

    // プレイヤーとの距離をチェック
    const playerBlockX = Math.floor(player.x / BLOCK_SIZE);
    const playerBlockY = Math.floor(player.y / BLOCK_SIZE);
    const distance = Math.sqrt(Math.pow(worldX - playerBlockX, 2) + Math.pow(worldY - playerBlockY, 2));

    if (distance <= 5) { // 到達範囲内
        const currentBlock = world.getBlock(worldX, worldY);

        if (currentBlock === BlockType.AIR) {
            // ブロック設置
            const selectedItem = inventory.getSelectedItem();
            if (selectedItem && selectedItem !== BlockType.AIR) {
                // プレイヤーと重ならないかチェック
                const blockLeft = worldX * BLOCK_SIZE;
                const blockTop = worldY * BLOCK_SIZE;
                const blockRight = blockLeft + BLOCK_SIZE;
                const blockBottom = blockTop + BLOCK_SIZE;

                const playerRight = player.x + player.width;
                const playerBottom = player.y + player.height;

                if (!(blockLeft < playerRight && blockRight > player.x &&
                      blockTop < playerBottom && blockBottom > player.y)) {
                    if (inventory.useSelectedItem()) {
                        world.setBlock(worldX, worldY, selectedItem);
                    }
                }
            }
        } else if (currentBlock === window.ItemType?.TNT) {
            // TNTを爆破
            explodeTNT(worldX, worldY);
        } else if (currentBlock === window.ItemType?.BED) {
            // ベッドで寝る（夜のみ）
            if (dayNightCycle && dayNightCycle.isNight()) {
                sleepInBed();
            } else {
                const msg = document.createElement('div');
                msg.textContent = '☀️ 夜にしか寝られません！';
                msg.style.cssText = 'position: fixed; top: 20%; left: 50%; transform: translateX(-50%); background: rgba(255, 200, 0, 0.9); color: #333; padding: 15px; border-radius: 10px; font-size: 18px; z-index: 1000;';
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 2000);
            }
        } else if (currentBlock === window.ItemType?.FURNACE) {
            // かまどで肉を焼く
            openFurnaceUI();
        } else if (currentBlock === BlockType.CRAFTING_TABLE) {
            // 作業台を使う
            if (window.craftingUI) {
                window.craftingUI.open('table');
            }
        } else if (currentBlock === BlockType.CHEST) {
            // チェストを開く
            if (chestUI) {
                chestUI.open(worldX, worldY);
            }
        } else {
            // ブロック破壊開始
            isMining = true;
            miningTarget = { x: worldX, y: worldY, type: currentBlock };

            // 採掘開始
            if (miningSystem) {
                const selectedItem = inventory.getSelectedItem();
                miningSystem.startMining(worldX, worldY, currentBlock, selectedItem);
            }
        }
    }
}

function handleTouchEnd(e) {
    if (isMining) {
        isMining = false;
        miningTarget = null;
        if (miningSystem) {
            miningSystem.stopMining();
        }
    }
}

// コントロールボタン
// モバイル用コントロール（押し続け対応）
let leftPressed = false;
let rightPressed = false;

// 左ボタン
document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    leftPressed = true;
});
document.getElementById('leftBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    leftPressed = false;
    player.vx = 0;
});
document.getElementById('leftBtn').addEventListener('mousedown', () => {
    leftPressed = true;
});
document.getElementById('leftBtn').addEventListener('mouseup', () => {
    leftPressed = false;
    player.vx = 0;
});

// 右ボタン
document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    rightPressed = true;
});
document.getElementById('rightBtn').addEventListener('touchend', (e) => {
    e.preventDefault();
    rightPressed = false;
    player.vx = 0;
});
document.getElementById('rightBtn').addEventListener('mousedown', () => {
    rightPressed = true;
});
document.getElementById('rightBtn').addEventListener('mouseup', () => {
    rightPressed = false;
    player.vx = 0;
});

// ジャンプボタン
document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.jump();
});
document.getElementById('jumpBtn').addEventListener('mousedown', () => player.jump());

// キーボード操作
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // スペースキーはジャンプ用
    if (e.key === ' ') {
        e.preventDefault(); // ページのスクロールを防ぐ
        player.jump();
    }

    // Tキーで2D/3D切り替え
    if (e.key === 't' || e.key === 'T') {
        if (window.isometricRenderer) {
            const is3D = window.isometricRenderer.toggle();
            // ボタンのテキストも更新
            const button = document.getElementById('3dToggleBtn');
            if (button) {
                button.innerHTML = is3D ?
                    '🎮 3D<br><span style="font-size: 10px">[T]</span>' :
                    '🎮 2D<br><span style="font-size: 10px">[T]</span>';
                button.style.background = is3D ?
                    'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' :
                    'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            }
        }
    }

    // Eキーで食べ物を食べる
    if (e.key === 'e' || e.key === 'E') {
        const selectedItem = inventory.getSelectedItem();
        if (selectedItem) {
            const itemData = window.itemInfo[selectedItem];
            if (itemData && itemData.healing) {
                if (eatFood(selectedItem)) {
                    inventory.useSelectedItem();
                }
            }
        }
    }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

function handleKeyboard() {
    if (keys['ArrowLeft'] || keys['a'] || leftPressed) player.moveLeft();
    if (keys['ArrowRight'] || keys['d'] || rightPressed) player.moveRight();
    if (keys[' '] || keys['ArrowUp'] || keys['w']) player.jump();

    // 攻撃（Fキー）
    if (keys['f'] || keys['F']) {
        player.attack(enemyManager);
    }

    // 数字キーでインベントリスロット選択
    for (let i = 1; i <= 8; i++) {
        if (keys[i.toString()]) {
            inventory.selectSlot(i - 1);

            // 選択したアイテムが武器の場合、装備する
            const selectedItem = inventory.getSelectedItem();
            if (selectedItem >= window.ItemType?.WOODEN_SWORD &&
                selectedItem <= window.ItemType?.DIAMOND_SWORD) {
                player.equipWeapon(selectedItem);
            }
        }
    }
}

// ゲームループ
let lastTime = Date.now();

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 入力処理
    handleKeyboard();

    // 更新
    player.update(world, deltaTime);
    camera.follow(player);

    // 昼夜サイクルの更新
    if (dayNightCycle && dayNightCycle.update) {
        dayNightCycle.update();

        // BGMの更新（昼夜切り替え）
        if (window.bgmManager) {
            window.bgmManager.updateBGM();
        }

        // 時間表示の更新
        const timeIcon = document.getElementById('timeIcon');
        const timeText = document.getElementById('timeText');
        const phaseText = document.getElementById('phaseText');

        if (timeIcon && timeText && phaseText) {
            timeText.textContent = dayNightCycle.getTimeString();

            const phase = dayNightCycle.getCurrentPhase();
            const phaseNames = {
                'DAWN': '朝',
                'MORNING': '午前',
                'NOON': '正午',
                'AFTERNOON': '午後',
                'DUSK': '夕方',
                'NIGHT': '夜',
                'LATE_NIGHT': '深夜'
            };
            phaseText.textContent = phaseNames[phase] || '';

            // アイコンを時間帯に応じて変更
            if (dayNightCycle.isNight()) {
                timeIcon.textContent = '🌙';
            } else {
                timeIcon.textContent = '☀️';
            }
        }
    }

    // 敵の更新
    if (enemyManager && enemyManager.update) {
        enemyManager.update(world, player, deltaTime);

        // プレイヤーと敵の衝突判定
        const damage = enemyManager.checkCollisions(player);
        if (damage > 0) {
            player.takeDamage(damage);
        }
    }

    // 動物の更新
    if (window.animalManager) {
        window.animalManager.update(world, player, deltaTime);
    }

    // 採掘の更新
    if (miningSystem && isMining) {
        const completed = miningSystem.update(deltaTime);
        if (completed) {
            // 採掘完了
            const selectedItem = inventory.getSelectedItem();

            // アイテムドロップチェック
            if (miningSystem.canHarvest(completed.type, selectedItem)) {
                const drops = world.breakBlock(completed.x, completed.y);
                if (drops !== null) {
                    inventory.addItem(drops);
                }
            } else {
                // 適正道具なしの場合、アイテムドロップなし
                world.setBlock(completed.x, completed.y, BlockType.AIR);
            }

            isMining = false;
            miningTarget = null;
        }
    }

    // 描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景（空）- 昼夜に応じて変化
    if (dayNightCycle && dayNightCycle.getSkyGradient) {
        const gradient = dayNightCycle.getSkyGradient(ctx, canvas);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 太陽の描画
        if (dayNightCycle.drawSun) {
            dayNightCycle.drawSun(ctx, canvas);
        }

        // 星と月の描画
        if (dayNightCycle.drawStars) {
            dayNightCycle.drawStars(ctx, camera, canvas);
        }
    } else {
        // デフォルトの空
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ワールドの描画
    const startX = Math.floor(camera.x / BLOCK_SIZE);
    const endX = Math.ceil((camera.x + canvas.width) / BLOCK_SIZE);
    const startY = Math.floor(camera.y / BLOCK_SIZE);
    const endY = Math.ceil((camera.y + canvas.height) / BLOCK_SIZE);

    // 3D/2D表示切り替え
    if (window.isometricRenderer && window.isometricRenderer.enabled) {
        // 3Dアイソメトリック表示
        // 奥から手前に描画（正しい重なり順のため）
        let blockCount = 0;
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const block = world.getBlock(x, y);
                if (block !== 0) { // 空気以外を描画
                    window.isometricRenderer.drawIsometricBlock(ctx, x, y, block, camera, blockInfo);
                    blockCount++;
                }
            }
        }
        // デバッグ用：描画ブロック数を表示
        if (blockCount === 0) {
            console.warn('No blocks drawn in 3D mode');
        }
    } else {
        // 通常の2D表示
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const block = world.getBlock(x, y);
                if (block !== BlockType.AIR) {
                    const info = blockInfo[block];
                    ctx.fillStyle = info.color;
                    ctx.fillRect(
                        x * BLOCK_SIZE - camera.x,
                        y * BLOCK_SIZE - camera.y,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );

                    // ブロックの境界線
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.strokeRect(
                        x * BLOCK_SIZE - camera.x,
                        y * BLOCK_SIZE - camera.y,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );

                    // 特別なブロックの装飾
                    const blockX = x * BLOCK_SIZE - camera.x;
                    const blockY = y * BLOCK_SIZE - camera.y;

                    if (block === BlockType.CRAFTING_TABLE) {
                        // 作業台の格子模様
                        ctx.strokeStyle = '#654321';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(blockX + 8, blockY + 8, 8, 8);
                        ctx.strokeRect(blockX + 16, blockY + 8, 8, 8);
                        ctx.strokeRect(blockX + 8, blockY + 16, 8, 8);
                        ctx.strokeRect(blockX + 16, blockY + 16, 8, 8);
                        ctx.lineWidth = 1;
                    } else if (block === 26) { // にっこりブロック
                        ctx.fillStyle = '#000';
                        // 目
                        ctx.fillRect(blockX + 8, blockY + 10, 4, 4);
                        ctx.fillRect(blockX + 20, blockY + 10, 4, 4);
                        // 口
                        ctx.beginPath();
                        ctx.arc(blockX + 16, blockY + 20, 6, 0, Math.PI);
                        ctx.stroke();
                    } else if (block === 27) { // ほしブロック
                        ctx.fillStyle = '#FFD700';
                        ctx.font = '20px Arial';
                        ctx.fillText('★', blockX + 6, blockY + 24);
                    } else if (block === 25) { // にじいろブロック
                        // 虹色グラデーション
                        const rainbow = ctx.createLinearGradient(blockX, blockY, blockX + BLOCK_SIZE, blockY + BLOCK_SIZE);
                        rainbow.addColorStop(0, '#FF0000');
                        rainbow.addColorStop(0.17, '#FF7F00');
                        rainbow.addColorStop(0.33, '#FFFF00');
                        rainbow.addColorStop(0.5, '#00FF00');
                        rainbow.addColorStop(0.67, '#0000FF');
                        rainbow.addColorStop(0.83, '#4B0082');
                        rainbow.addColorStop(1, '#8B00FF');
                        ctx.fillStyle = rainbow;
                        ctx.fillRect(blockX + 4, blockY + 4, BLOCK_SIZE - 8, BLOCK_SIZE - 8);
                    } else if (block === 28) { // ケーキ
                        ctx.fillStyle = '#FF0000';
                        ctx.fillRect(blockX + 14, blockY + 8, 4, 4);
                        ctx.fillStyle = '#FFF';
                        ctx.fillRect(blockX + 8, blockY + 16, 16, 8);
                    } else if (block === 30) { // ダイヤ
                        ctx.fillStyle = '#00CED1';
                        ctx.beginPath();
                        ctx.moveTo(blockX + 16, blockY + 4);
                        ctx.lineTo(blockX + 28, blockY + 16);
                        ctx.lineTo(blockX + 16, blockY + 28);
                        ctx.lineTo(blockX + 4, blockY + 16);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    } else if (block === window.ItemType?.WATER) { // 水
                        // 半透明の青色
                        ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
                        ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
                        // 波のアニメーション
                        ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
                        ctx.beginPath();
                        const waveOffset = (Date.now() / 500 + x * 0.5) % (Math.PI * 2);
                        ctx.moveTo(blockX, blockY + BLOCK_SIZE/2 + Math.sin(waveOffset) * 3);
                        ctx.lineTo(blockX + BLOCK_SIZE, blockY + BLOCK_SIZE/2 + Math.sin(waveOffset + 1) * 3);
                        ctx.stroke();
                    } else if (block === window.ItemType?.TNT) { // TNT
                        // 赤いブロック
                        ctx.fillStyle = '#C41E3A';
                        ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
                        // TNTの文字
                        ctx.fillStyle = '#FFF';
                        ctx.font = 'bold 10px Arial';
                        ctx.fillText('TNT', blockX + 4, blockY + 20);
                        // 導火線
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(blockX + 16, blockY);
                        ctx.lineTo(blockX + 16, blockY + 8);
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    } else if (block === BlockType.TORCH) { // たいまつ
                        ctx.fillStyle = '#8B4513';
                        ctx.fillRect(blockX + 14, blockY + 16, 4, 12);
                        ctx.fillStyle = '#FFA500';
                        ctx.beginPath();
                        ctx.arc(blockX + 16, blockY + 12, 6, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (block === BlockType.FURNACE) { // かまど
                        ctx.fillStyle = '#333';
                        ctx.fillRect(blockX + 10, blockY + 18, 12, 8);
                        ctx.fillStyle = '#FF4500';
                        ctx.fillRect(blockX + 12, blockY + 20, 8, 4);
                    } else if (block === BlockType.CHEST) { // チェスト
                        ctx.strokeStyle = '#654321';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(blockX + 4, blockY + 12, 24, 16);
                        ctx.fillStyle = '#FFD700';
                        ctx.fillRect(blockX + 14, blockY + 16, 4, 6);
                        ctx.lineWidth = 1;
                    } else if (window.ItemType && block === window.ItemType.COAL) { // 石炭
                        ctx.fillStyle = '#000';
                        ctx.fillRect(blockX + 8, blockY + 8, 6, 6);
                        ctx.fillRect(blockX + 18, blockY + 12, 6, 6);
                        ctx.fillRect(blockX + 10, blockY + 18, 6, 6);
                    } else if (window.ItemType && block === window.ItemType.IRON_ORE) { // 鉄鉱石
                        ctx.fillStyle = '#CD853F';
                        ctx.fillRect(blockX + 8, blockY + 10, 8, 4);
                        ctx.fillRect(blockX + 16, blockY + 18, 8, 4);
                        ctx.fillRect(blockX + 12, blockY + 14, 4, 4);
                    } else if (window.ItemType && block === window.ItemType.GOLD_ORE) { // 金鉱石
                        ctx.fillStyle = '#FFD700';
                        ctx.beginPath();
                        ctx.arc(blockX + 10, blockY + 10, 3, 0, Math.PI * 2);
                        ctx.arc(blockX + 22, blockY + 22, 3, 0, Math.PI * 2);
                        ctx.arc(blockX + 16, blockY + 16, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (window.ItemType && block === window.ItemType.DIAMOND_ORE) { // ダイヤ鉱石
                        ctx.fillStyle = '#696969';
                        ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.fillStyle = '#00CED1';
                        ctx.beginPath();
                        ctx.moveTo(blockX + 16, blockY + 8);
                        ctx.lineTo(blockX + 20, blockY + 12);
                        ctx.lineTo(blockX + 16, blockY + 16);
                        ctx.lineTo(blockX + 12, blockY + 12);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = '#B0FFFF';
                        ctx.fillRect(blockX + 15, blockY + 10, 2, 2);
                    } else if (window.ItemType && block === window.ItemType.BED) { // ベッド
                        // ベッドの枠
                        ctx.fillStyle = '#8B4513';
                        ctx.fillRect(blockX, blockY + 16, BLOCK_SIZE, 8);
                        // 枕
                        ctx.fillStyle = '#FFF';
                        ctx.fillRect(blockX + 2, blockY + 8, 8, 8);
                        // マットレス
                        ctx.fillStyle = '#FF4444';
                        ctx.fillRect(blockX + 10, blockY + 8, 20, 8);
                    } else if (window.ItemType && block === window.ItemType.EMERALD) { // エメラルド
                        ctx.fillStyle = '#50C878';
                        ctx.beginPath();
                        ctx.moveTo(blockX + 16, blockY + 8);
                        ctx.lineTo(blockX + 20, blockY + 14);
                        ctx.lineTo(blockX + 16, blockY + 20);
                        ctx.lineTo(blockX + 12, blockY + 14);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = '#2E8B57';
                        ctx.stroke();
                    }
                }
            }
        }
    }

    // プレイヤーの描画
    if (window.isometricRenderer && window.isometricRenderer.enabled) {
        window.isometricRenderer.drawIsometricPlayer(ctx, player, camera);
    } else {
        player.draw(ctx, camera);
    }

    // 敵の描画
    if (enemyManager && enemyManager.draw) {
        if (window.isometricRenderer && window.isometricRenderer.enabled) {
            // 3D表示で敵を描画
            for (const enemy of enemyManager.enemies) {
                window.isometricRenderer.drawIsometricEnemy(ctx, enemy, camera);
            }
        } else {
            enemyManager.draw(ctx, camera);
        }
    }

    // 動物の描画
    if (window.animalManager) {
        window.animalManager.draw(ctx, camera);
    }

    // 採掘エフェクトの描画
    if (miningSystem) {
        miningSystem.draw(ctx, camera);
    }

    // 到達範囲の表示（デバッグ用、後で削除可能）
    const playerBlockX = Math.floor(player.x / BLOCK_SIZE);
    const playerBlockY = Math.floor(player.y / BLOCK_SIZE);
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(
        player.x + player.width / 2 - camera.x,
        player.y + player.height / 2 - camera.y,
        5 * BLOCK_SIZE,
        0,
        Math.PI * 2
    );
    ctx.stroke();

    // 夜の暗さオーバーレイとたいまつの明かり効果
    if (dayNightCycle && dayNightCycle.getDarkness) {
        const darkness = dayNightCycle.getDarkness();
        if (darkness > 0) {
            // たいまつの位置を収集
            const torches = [];
            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    const block = world.getBlock(x, y);
                    if (block === window.ItemType.TORCH) {
                        torches.push({ x: x * BLOCK_SIZE - camera.x + BLOCK_SIZE / 2, y: y * BLOCK_SIZE - camera.y + BLOCK_SIZE / 2 });
                    }
                }
            }

            // プレイヤーがたいまつを持っているか確認
            const holdingTorch = inventory.getSelectedItem() === window.ItemType.TORCH;
            if (holdingTorch) {
                torches.push({
                    x: player.x + player.width / 2 - camera.x,
                    y: player.y + player.height / 2 - camera.y
                });
            }

            // 暗さを描画（たいまつの明かり効果付き）
            if (torches.length > 0) {
                // グラデーションマスクを作成
                const offCanvas = document.createElement('canvas');
                offCanvas.width = canvas.width;
                offCanvas.height = canvas.height;
                const offCtx = offCanvas.getContext('2d');

                // 全体を暗くする
                offCtx.fillStyle = `rgba(0, 0, 20, ${darkness})`;
                offCtx.fillRect(0, 0, canvas.width, canvas.height);

                // たいまつの明かりを切り抜く
                offCtx.globalCompositeOperation = 'destination-out';
                for (const torch of torches) {
                    const gradient = offCtx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 150);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    offCtx.fillStyle = gradient;
                    offCtx.fillRect(torch.x - 150, torch.y - 150, 300, 300);
                }

                // メインキャンバスに描画
                ctx.drawImage(offCanvas, 0, 0);

                // たいまつの光の効果を追加
                for (const torch of torches) {
                    const gradient = ctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 100);
                    gradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
                    gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.1)');
                    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(torch.x - 100, torch.y - 100, 200, 200);
                }
            } else {
                // たいまつがない場合は通常の暗さ
                ctx.fillStyle = `rgba(0, 0, 20, ${darkness})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

// ========== 肉を食べる機能 ==========
function eatFood(itemType) {
    const itemData = window.itemInfo[itemType];
    if (itemData && itemData.healing) {
        // 体力回復
        player.health = Math.min(player.health + itemData.healing, player.maxHealth);

        // メッセージ表示
        const msg = document.createElement('div');
        msg.textContent = `😋 ${itemData.name} +${itemData.healing}HP`;
        msg.style.cssText = 'position: fixed; top: 30%; left: 50%; transform: translateX(-50%); background: rgba(76, 175, 80, 0.9); color: white; padding: 15px; border-radius: 10px; font-size: 18px; z-index: 1000;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);

        return true;
    }
    return false;
}

// ========== かまどUI ==========
function openFurnaceUI() {
    const furnaceUI = document.createElement('div');
    furnaceUI.id = 'furnaceUI';
    furnaceUI.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.95); border: 3px solid #8B4513; border-radius: 10px; padding: 20px; z-index: 100;';

    furnaceUI.innerHTML = `
        <h2 style="color: #FFD700; text-align: center; margin-bottom: 15px;">🔥 かまど</h2>
        <div style="color: white; margin-bottom: 10px;">生肉を焼いて調理しよう！</div>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <button onclick="cookMeat('pork')" style="padding: 10px 20px; background: #FF6B6B; border: 2px solid #333; border-radius: 5px; color: white; cursor: pointer;">🐷 豚肉を焼く</button>
            <button onclick="cookMeat('beef')" style="padding: 10px 20px; background: #DC143C; border: 2px solid #333; border-radius: 5px; color: white; cursor: pointer;">🐄 牛肉を焼く</button>
            <button onclick="cookMeat('chicken')" style="padding: 10px 20px; background: #FFE4E1; border: 2px solid #333; border-radius: 5px; color: white; cursor: pointer;">🐔 鶏肉を焼く</button>
        </div>
        <button onclick="closeFurnaceUI()" style="margin-top: 20px; padding: 10px 20px; background: #f44336; border: 2px solid #333; border-radius: 5px; color: white; cursor: pointer; width: 100%;">とじる</button>
    `;

    document.body.appendChild(furnaceUI);
}

function closeFurnaceUI() {
    const ui = document.getElementById('furnaceUI');
    if (ui) ui.remove();
}

function cookMeat(type) {
    const recipes = {
        'pork': { raw: window.ItemType.RAW_PORK, cooked: window.ItemType.COOKED_PORK, name: '焼き豚' },
        'beef': { raw: window.ItemType.RAW_BEEF, cooked: window.ItemType.COOKED_BEEF, name: 'ステーキ' },
        'chicken': { raw: window.ItemType.RAW_CHICKEN, cooked: window.ItemType.COOKED_CHICKEN, name: '焼き鳥' }
    };

    const recipe = recipes[type];
    if (!recipe) return;

    // 生肉を持っているかチェック
    let rawSlotIndex = -1;
    for (let i = 0; i < inventory.slots.length; i++) {
        if (inventory.slots[i].item === recipe.raw) {
            rawSlotIndex = i;
            break;
        }
    }

    if (rawSlotIndex !== -1) {
        // 生肉を消費して調理済みに変換
        inventory.slots[rawSlotIndex].item = recipe.cooked;
        inventory.createUI();

        // メッセージ表示
        const msg = document.createElement('div');
        msg.textContent = `🔥 ${recipe.name}ができた！`;
        msg.style.cssText = 'position: fixed; top: 30%; left: 50%; transform: translateX(-50%); background: rgba(255, 152, 0, 0.9); color: white; padding: 15px; border-radius: 10px; font-size: 18px; z-index: 1001;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    } else {
        const msg = document.createElement('div');
        msg.textContent = '❌ 生肉がありません';
        msg.style.cssText = 'position: fixed; top: 30%; left: 50%; transform: translateX(-50%); background: rgba(244, 67, 54, 0.9); color: white; padding: 15px; border-radius: 10px; font-size: 18px; z-index: 1001;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }
}

// グローバル関数として登録
window.cookMeat = cookMeat;
window.closeFurnaceUI = closeFurnaceUI;

// ========== ベッドで寝る機能 ==========
function sleepInBed() {
    // 寝るエフェクト
    const sleepOverlay = document.createElement('div');
    sleepOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; opacity: 0; z-index: 999; transition: opacity 2s;';
    document.body.appendChild(sleepOverlay);

    // メッセージ表示
    const msg = document.createElement('div');
    msg.textContent = '😴 おやすみなさい...';
    msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 36px; z-index: 1000; opacity: 0; transition: opacity 1s;';
    document.body.appendChild(msg);

    // フェードイン
    setTimeout(() => {
        sleepOverlay.style.opacity = '1';
        msg.style.opacity = '1';
    }, 100);

    // 朝にする
    setTimeout(() => {
        // 時間を朝6時にセット
        if (dayNightCycle) {
            dayNightCycle.currentTime = 6 * 60; // 6:00 AM
        }

        // 体力回復
        player.health = player.maxHealth;

        // フェードアウト
        msg.textContent = '☀️ おはよう！';
        setTimeout(() => {
            sleepOverlay.style.opacity = '0';
            msg.style.opacity = '0';
            setTimeout(() => {
                sleepOverlay.remove();
                msg.remove();
            }, 2000);
        }, 1000);
    }, 3000);
}

// ========== TNT爆発機能 ==========
function explodeTNT(x, y) {
    // 爆発エフェクト（視覚的）
    const explodeEffect = () => {
        const originalFillStyle = ctx.fillStyle;

        // 爆発の光
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                ctx.save();
                ctx.fillStyle = `rgba(255, ${200 - i * 40}, 0, ${0.8 - i * 0.15})`;
                ctx.beginPath();
                ctx.arc(
                    x * BLOCK_SIZE - camera.x + BLOCK_SIZE/2,
                    y * BLOCK_SIZE - camera.y + BLOCK_SIZE/2,
                    (i + 1) * BLOCK_SIZE * 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.restore();
            }, i * 50);
        }
    };

    // 爆発音（簡易）
    const msg = document.createElement('div');
    msg.textContent = '💥 ドカーン！';
    msg.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                         background: rgba(255, 100, 0, 0.9); color: white; padding: 20px;
                         border-radius: 10px; font-size: 36px; z-index: 1000; font-weight: bold;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1000);

    // 爆発範囲のブロック破壊
    const explosionRadius = 4; // 爆発半径

    for (let dx = -explosionRadius; dx <= explosionRadius; dx++) {
        for (let dy = -explosionRadius; dy <= explosionRadius; dy++) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= explosionRadius) {
                const bx = x + dx;
                const by = y + dy;

                const block = world.getBlock(bx, by);
                // 岩盤以外のブロックを破壊
                if (block !== BlockType.AIR && block !== undefined) {
                    // 爆発の中心に近いほど破壊確率が高い
                    const destroyChance = 1 - (distance / explosionRadius) * 0.3;
                    if (Math.random() < destroyChance) {
                        // ブロックを破壊してアイテムドロップ
                        const drops = world.breakBlock(bx, by);
                        // TNT自体と水はドロップしない
                        if (drops !== null && drops !== window.ItemType?.TNT && drops !== window.ItemType?.WATER) {
                            // ランダムにアイテムを散らばらせる（50%の確率でドロップ）
                            if (Math.random() < 0.5) {
                                inventory.addItem(drops);
                            }
                        }
                    }
                }
            }
        }
    }

    // プレイヤーへのダメージ
    const playerBlockX = Math.floor(player.x / BLOCK_SIZE);
    const playerBlockY = Math.floor(player.y / BLOCK_SIZE);
    const playerDistance = Math.sqrt(
        Math.pow(x - playerBlockX, 2) +
        Math.pow(y - playerBlockY, 2)
    );

    if (playerDistance <= explosionRadius) {
        const damage = Math.max(1, Math.floor((explosionRadius - playerDistance) * 3));
        player.takeDamage(damage);

        // ノックバック
        const knockbackX = (playerBlockX - x) * 2;
        const knockbackY = -10; // 上方向に吹き飛ばす
        player.vx = knockbackX;
        player.vy = knockbackY;
    }

    explodeEffect();
}

// ========== セーブ/ロード機能 ==========
function saveGame() {
    // 完全なセーブデータを作成
    const saveData = {
        version: '1.1',
        timestamp: Date.now(),
        world: {
            blocks: world.blocks,
            width: world.width,
            height: world.height
        },
        player: {
            x: player.x,
            y: player.y,
            vx: player.vx,
            vy: player.vy,
            health: player.health,
            maxHealth: player.maxHealth,
            equippedWeapon: player.equippedWeapon,
            equippedArmor: player.equippedArmor
        },
        camera: {
            x: camera.x,
            y: camera.y
        },
        inventory: {
            slots: inventory.slots,
            selectedIndex: inventory.selectedIndex,
            maxSlots: inventory.maxSlots
        },
        dayNight: {
            currentTime: dayNightCycle ? dayNightCycle.currentTime : 720,
            dayDuration: dayNightCycle ? dayNightCycle.dayDuration : 600
        },
        enemies: enemyManager ? {
            enemies: enemyManager.enemies.map(e => ({
                x: e.x,
                y: e.y,
                type: e.type,
                health: e.health
            }))
        } : null,
        chests: chestManager ? Array.from(chestManager.chests.entries()).map(([key, chest]) => ({
            key: key,
            slots: chest.slots
        })) : []
    };

    localStorage.setItem('craftMasterSave', JSON.stringify(saveData));

    // セーブ成功メッセージ
    const msg = document.createElement('div');
    msg.textContent = '💾 セーブしました！';
    msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #4CAF50; color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function loadGame() {
    const saveDataStr = localStorage.getItem('craftMasterSave');
    if (!saveDataStr) {
        const msg = document.createElement('div');
        msg.textContent = '❌ セーブデータがありません';
        msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f44336; color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
        return;
    }

    try {
        const saveData = JSON.parse(saveDataStr);

        // ワールドデータの復元
        if (saveData.world) {
            world.blocks = saveData.world.blocks;
            if (saveData.world.width) world.width = saveData.world.width;
            if (saveData.world.height) world.height = saveData.world.height;
        }

        // プレイヤーデータの復元
        if (saveData.player) {
            player.x = saveData.player.x || player.x;
            player.y = saveData.player.y || player.y;
            player.vx = saveData.player.vx || 0;
            player.vy = saveData.player.vy || 0;
            player.health = saveData.player.health || player.health;
            player.maxHealth = saveData.player.maxHealth || player.maxHealth;
            player.equippedWeapon = saveData.player.equippedWeapon || null;
            player.equippedArmor = saveData.player.equippedArmor || null;
        }

        // インベントリの復元（完全に復元）
        if (saveData.inventory) {
            if (saveData.inventory.slots) {
                inventory.slots = saveData.inventory.slots;
            }
            if (saveData.inventory.selectedIndex !== undefined) {
                inventory.selectedIndex = saveData.inventory.selectedIndex;
            }
            if (saveData.inventory.maxSlots) {
                inventory.maxSlots = saveData.inventory.maxSlots;
            }
            inventory.createUI();
        }

        // 昼夜サイクルの復元（時間を正確に復元）
        if (saveData.dayNight && dayNightCycle) {
            dayNightCycle.currentTime = saveData.dayNight.currentTime || 720;
            if (saveData.dayNight.dayDuration) {
                dayNightCycle.dayDuration = saveData.dayNight.dayDuration;
            }
        }

        // 敵の復元（オプション - エラーを防ぐ）
        if (saveData.enemies && saveData.enemies.enemies && enemyManager) {
            try {
                enemyManager.enemies = [];
                // createEnemyメソッドが存在しない場合はスキップ
            } catch(e) {
                console.log('敵データのスキップ');
            }
        }

        // チェストの復元
        if (saveData.chests && chestManager) {
            try {
                chestManager.chests.clear();
                saveData.chests.forEach(chestData => {
                    const chest = new Chest(0, 0);
                    chest.slots = chestData.slots;
                    chestManager.chests.set(chestData.key, chest);
                });
            } catch(e) {
                console.log('チェストデータの復元エラー:', e);
            }
        }

        // カメラ位置の復元
        if (saveData.camera) {
            camera.x = saveData.camera.x;
            camera.y = saveData.camera.y;
        } else {
            // 古いセーブデータの場合、プレイヤーを中心にカメラを設定
            camera.follow(player);
        }

        // 装備表示の更新
        updateEquipmentDisplay();

        // ロード成功メッセージ
        const msg = document.createElement('div');
        msg.textContent = '📂 ロードしました！';
        msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2196F3; color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);

    } catch(error) {
        console.error('セーブデータの読み込みエラー:', error);
        const msg = document.createElement('div');
        msg.textContent = '❌ セーブデータが壊れています';
        msg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f44336; color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }
}

// セーブ/ロードボタンのイベント
document.getElementById('saveBtn').addEventListener('click', saveGame);
document.getElementById('loadBtn').addEventListener('click', loadGame);

// ========== スマホ用攻撃ボタン ==========
document.getElementById('attackBtn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.attack(enemyManager);
});
document.getElementById('attackBtn').addEventListener('click', () => {
    player.attack(enemyManager);
});

// ========== 装備システム ==========
// プレイヤーに装備関連のプロパティを追加
player.equippedWeapon = null;
player.equippedArmor = null;

player.equipWeapon = function(itemType) {
    this.equippedWeapon = itemType;
    updateEquipmentDisplay();
};

player.equipArmor = function(itemType) {
    this.equippedArmor = itemType;
    updateEquipmentDisplay();
};

function updateEquipmentDisplay() {
    const weaponSlot = document.getElementById('weaponSlot');
    const armorSlot = document.getElementById('armorSlot');

    if (weaponSlot) {
        if (player.equippedWeapon) {
            const info = window.itemInfo[player.equippedWeapon];
            weaponSlot.textContent = info.icon || '🗡️';
        } else {
            weaponSlot.textContent = '🗡️';
        }
    }

    if (armorSlot) {
        if (player.equippedArmor) {
            const info = window.itemInfo[player.equippedArmor];
            armorSlot.textContent = info.icon || '🛡️';
        } else {
            armorSlot.textContent = '🛡️';
        }
    }
}

// 装備スロットのクリックイベント
document.getElementById('weaponSlot').addEventListener('click', () => {
    const selectedItem = inventory.getSelectedItem();
    if (selectedItem >= window.ItemType.WOODEN_SWORD && selectedItem <= window.ItemType.DIAMOND_SWORD) {
        player.equipWeapon(selectedItem);
    }
});

document.getElementById('armorSlot').addEventListener('click', () => {
    const selectedItem = inventory.getSelectedItem();
    if ((selectedItem >= window.ItemType.LEATHER_HELMET && selectedItem <= window.ItemType.LEATHER_BOOTS) ||
        (selectedItem >= window.ItemType.IRON_HELMET && selectedItem <= window.ItemType.IRON_BOOTS)) {
        player.equipArmor(selectedItem);
    }
});

// レシピブックのイベントリスナー設定
document.getElementById('recipeBtn').addEventListener('click', () => {
    document.getElementById('recipeBookUI').style.display = 'block';
    if (window.recipeBook && window.recipeBook.displayDetailedRecipes) {
        window.recipeBook.displayDetailedRecipes();
    }
});

document.getElementById('closeRecipeBtn').addEventListener('click', () => {
    document.getElementById('recipeBookUI').style.display = 'none';
});

// カテゴリーボタンのイベント設定
document.querySelectorAll('.recipe-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.recipe-category-btn').forEach(b => b.style.opacity = '0.7');
        btn.style.opacity = '1';
        if (window.recipeBook && window.recipeBook.displayDetailedRecipes) {
            window.recipeBook.displayDetailedRecipes();
        }
    });
});

// ゲーム開始
gameLoop();