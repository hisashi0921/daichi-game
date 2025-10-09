// 敵システム

// 敵の種類
const EnemyType = {
    ZOMBIE: 'zombie',
    SKELETON: 'skeleton',
    SPIDER: 'spider'
};

// 敵クラス
class Enemy {
    constructor(x, y, type = EnemyType.ZOMBIE) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = BLOCK_SIZE * 0.8;
        this.height = BLOCK_SIZE * 1.8;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.direction = Math.random() > 0.5 ? 1 : -1; // 1:右 -1:左

        // タイプ別パラメータ
        switch(type) {
            case EnemyType.ZOMBIE:
                this.health = 20;
                this.maxHealth = 20;
                this.speed = 1;
                this.damage = 3;
                this.color = '#006400';
                this.jumpPower = -8;
                break;
            case EnemyType.SKELETON:
                this.health = 15;
                this.maxHealth = 15;
                this.speed = 1.5;
                this.damage = 2;
                this.color = '#F5F5DC';
                this.jumpPower = -10;
                break;
            case EnemyType.SPIDER:
                this.health = 16;
                this.maxHealth = 16;
                this.speed = 2;
                this.damage = 2;
                this.color = '#8B4513';
                this.jumpPower = -6;
                this.width = BLOCK_SIZE;
                this.height = BLOCK_SIZE * 0.8;
                break;
        }

        this.lastAttackTime = 0;
        this.attackCooldown = 1000; // 1秒に1回攻撃
        this.knockback = 0;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }

    update(world, player, deltaTime) {
        // 重力
        this.vy += GRAVITY;
        this.vy = Math.min(this.vy, 15);

        // プレイヤーを追跡
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 近くにいる場合は追跡
        if (distance < BLOCK_SIZE * 10) {
            // プレイヤーの方向に移動
            if (dx > BLOCK_SIZE) {
                this.direction = 1;
                this.vx = this.speed;
            } else if (dx < -BLOCK_SIZE) {
                this.direction = -1;
                this.vx = -this.speed;
            } else {
                this.vx = 0;
            }

            // ランダムにジャンプ（壁を越えるため）
            if (this.onGround && Math.random() < 0.02) {
                this.vy = this.jumpPower;
            }

            // 壁があったらジャンプ
            const ahead = this.direction * BLOCK_SIZE;
            const blockAhead = world.getBlock(
                Math.floor((this.x + ahead) / BLOCK_SIZE),
                Math.floor(this.y / BLOCK_SIZE)
            );
            if (blockAhead !== BlockType.AIR && this.onGround) {
                this.vy = this.jumpPower;
            }
        } else {
            // ランダム移動
            if (Math.random() < 0.02) {
                this.direction = -this.direction;
            }
            this.vx = this.direction * this.speed * 0.5;
        }

        // ノックバック処理
        if (this.knockback !== 0) {
            this.vx = this.knockback;
            this.knockback *= 0.8;
            if (Math.abs(this.knockback) < 0.1) this.knockback = 0;
        }

        // X方向の移動と衝突判定
        const newX = this.x + this.vx;
        if (!this.checkCollision(world, newX, this.y)) {
            this.x = newX;
        } else {
            this.vx = 0;
            // 壁にぶつかったら方向転換
            this.direction = -this.direction;
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

        // 無敵時間の更新
        if (this.invulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // 範囲外に落ちたら削除
        if (this.y > world.height * BLOCK_SIZE) {
            this.health = 0;
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

    checkPlayerCollision(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }

    takeDamage(damage, knockbackX) {
        if (this.invulnerable) return;

        this.health -= damage;
        this.knockback = knockbackX;
        this.invulnerable = true;
        this.invulnerableTime = 500; // 0.5秒の無敵時間

        if (this.health <= 0) {
            return this.dropItems();
        }
        return null;
    }

    dropItems() {
        // ドロップアイテム
        const drops = [];

        switch(this.type) {
            case EnemyType.ZOMBIE:
                // 腐った肉またはレアで鉄
                if (Math.random() < 0.05) {
                    drops.push(window.ItemType.IRON_ORE);
                }
                if (Math.random() < 0.5) {
                    drops.push(window.ItemType.LEATHER || window.ItemType.DIRT);
                }
                break;
            case EnemyType.SKELETON:
                // 骨と矢
                if (Math.random() < 0.5) {
                    drops.push(window.ItemType.STICK); // 骨の代わり
                }
                if (Math.random() < 0.3) {
                    drops.push(window.ItemType.ARROW || window.ItemType.STICK);
                }
                break;
            case EnemyType.SPIDER:
                // 糸
                if (Math.random() < 0.5) {
                    drops.push(window.ItemType.STRING || window.ItemType.STICK);
                }
                break;
        }

        return drops;
    }

    draw(ctx, camera) {
        // 無敵時間中は点滅
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // 本体
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - camera.x,
            this.y - camera.y,
            this.width,
            this.height
        );

        // 顔
        ctx.fillStyle = this.type === EnemyType.ZOMBIE ? '#FF0000' : '#000';

        if (this.type === EnemyType.SPIDER) {
            // クモの目（2個）
            ctx.fillRect(this.x - camera.x + 6, this.y - camera.y + 6, 4, 4);
            ctx.fillRect(this.x - camera.x + 16, this.y - camera.y + 6, 4, 4);
        } else {
            // ゾンビ・スケルトンの目
            ctx.fillRect(this.x - camera.x + 6, this.y - camera.y + 8, 4, 4);
            ctx.fillRect(this.x - camera.x + 16, this.y - camera.y + 8, 4, 4);

            // 口
            if (this.type === EnemyType.ZOMBIE) {
                ctx.fillRect(this.x - camera.x + 8, this.y - camera.y + 16, 10, 2);
            }
        }

        // 体力バー
        if (this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 4;
            const barY = this.y - 10;

            // 背景
            ctx.fillStyle = '#333';
            ctx.fillRect(
                this.x - camera.x,
                barY - camera.y,
                barWidth,
                barHeight
            );

            // 体力
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(
                this.x - camera.x,
                barY - camera.y,
                barWidth * (this.health / this.maxHealth),
                barHeight
            );
        }

        ctx.globalAlpha = 1.0;
    }
}

// 敵管理システム
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 20000; // 20秒ごとにスポーン（10秒→20秒に変更）
        this.maxEnemies = 5; // 最大5体（10体→5体に変更）
        this.dayNightCycle = null; // 昼夜サイクルの参照
    }

    setDayNightCycle(dayNightCycle) {
        this.dayNightCycle = dayNightCycle;
    }

    update(world, player, deltaTime) {
        // 夜のみスポーン処理
        if (this.dayNightCycle && this.dayNightCycle.isNight()) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnEnemy(world, player);
            }
        } else {
            // 昼になったらタイマーリセット
            this.spawnTimer = 0;
        }

        // 敵の更新
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(world, player, deltaTime);

            // 昼間は敵に継続ダメージ（太陽光でダメージ）
            if (this.dayNightCycle && this.dayNightCycle.isDay()) {
                // ゾンビとスケルトンは太陽光でダメージ
                if (enemy.type === EnemyType.ZOMBIE || enemy.type === EnemyType.SKELETON) {
                    enemy.health -= deltaTime * 0.005; // 徐々にダメージ
                }
            }

            // 死亡チェック
            if (enemy.health <= 0) {
                // ドロップアイテムを取得
                const drops = enemy.dropItems();
                for (const item of drops) {
                    if (window.inventory) {
                        window.inventory.addItem(item);
                    }
                }
                this.enemies.splice(i, 1);
            }
        }
    }

    spawnEnemy(world, player) {
        // 夜でない場合はスポーンしない
        if (this.dayNightCycle && !this.dayNightCycle.isNight()) return;

        if (this.enemies.length >= this.maxEnemies) return;

        // プレイヤーから離れた場所にスポーン
        const spawnDistance = BLOCK_SIZE * 20;
        const angle = Math.random() * Math.PI * 2;
        let spawnX = player.x + Math.cos(angle) * spawnDistance;
        const spawnY = 20 * BLOCK_SIZE; // 地表付近

        // 範囲内に収める
        spawnX = Math.max(BLOCK_SIZE, Math.min(spawnX, (world.width - 1) * BLOCK_SIZE));

        // 敵の種類をランダムに選択
        const types = [EnemyType.ZOMBIE, EnemyType.ZOMBIE, EnemyType.SKELETON, EnemyType.SPIDER];
        const type = types[Math.floor(Math.random() * types.length)];

        const enemy = new Enemy(spawnX, spawnY, type);
        this.enemies.push(enemy);
    }

    checkCollisions(player) {
        let totalDamage = 0;

        for (const enemy of this.enemies) {
            if (enemy.checkPlayerCollision(player)) {
                const now = Date.now();
                if (now - enemy.lastAttackTime >= enemy.attackCooldown) {
                    enemy.lastAttackTime = now;
                    totalDamage += enemy.damage;
                }
            }
        }

        return totalDamage;
    }

    attackEnemiesAt(x, y, damage, range) {
        const hitEnemies = [];

        for (const enemy of this.enemies) {
            const dx = enemy.x + enemy.width / 2 - x;
            const dy = enemy.y + enemy.height / 2 - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= range) {
                const knockback = dx > 0 ? 10 : -10;
                enemy.takeDamage(damage, knockback);
                hitEnemies.push(enemy);
            }
        }

        return hitEnemies;
    }

    draw(ctx, camera) {
        for (const enemy of this.enemies) {
            enemy.draw(ctx, camera);
        }
    }
}

// グローバルに公開
window.EnemyManager = EnemyManager;
window.EnemyType = EnemyType;