// 動物システム
class Animal {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 24;
        this.height = 24;
        this.health = 10;
        this.maxHealth = 10;
        this.direction = 1; // 1: 右向き, -1: 左向き
        this.moveTimer = 0;
        this.jumpTimer = 0;
        this.drops = [];

        // 動物タイプごとの設定
        switch(type) {
            case 'pig':
                this.emoji = '🐷';
                this.health = 10;
                this.drops = [window.ItemType?.RAW_PORK, window.ItemType?.RAW_PORK];
                break;
            case 'cow':
                this.emoji = '🐄';
                this.health = 15;
                this.width = 32;
                this.height = 32;
                this.drops = [window.ItemType?.RAW_BEEF, window.ItemType?.RAW_BEEF, window.ItemType?.LEATHER];
                break;
            case 'chicken':
                this.emoji = '🐔';
                this.health = 5;
                this.width = 16;
                this.height = 16;
                this.drops = [window.ItemType?.RAW_CHICKEN, window.ItemType?.EGG];
                break;
        }
    }

    update(world, deltaTime) {
        // 重力
        this.vy += GRAVITY * 0.8;
        this.vy = Math.min(this.vy, 10);

        // ランダムな動き
        this.moveTimer -= deltaTime || 16;
        if (this.moveTimer <= 0) {
            // 新しい動きを決定
            const action = Math.random();
            if (action < 0.3) {
                // 停止
                this.vx = 0;
            } else if (action < 0.6) {
                // 左に移動
                this.direction = -1;
                this.vx = -1;
            } else if (action < 0.9) {
                // 右に移動
                this.direction = 1;
                this.vx = 1;
            } else {
                // ジャンプ（鶏は頻繁にジャンプ）
                if (this.type === 'chicken' || Math.random() < 0.3) {
                    this.vy = -8;
                }
            }
            this.moveTimer = 1000 + Math.random() * 2000;
        }

        // 移動と衝突判定
        const newX = this.x + this.vx;
        if (!this.checkCollision(world, newX, this.y)) {
            this.x = newX;
        } else {
            this.vx = -this.vx; // 壁にぶつかったら反転
            this.direction = -this.direction;
        }

        const newY = this.y + this.vy;
        if (!this.checkCollision(world, this.x, newY)) {
            this.y = newY;
        } else {
            this.vy = 0;
        }

        // 摩擦
        this.vx *= 0.9;
    }

    checkCollision(world, x, y) {
        const left = Math.floor(x / BLOCK_SIZE);
        const right = Math.floor((x + this.width) / BLOCK_SIZE);
        const top = Math.floor(y / BLOCK_SIZE);
        const bottom = Math.floor((y + this.height) / BLOCK_SIZE);

        for (let bx = left; bx <= right; bx++) {
            for (let by = top; by <= bottom; by++) {
                const block = world.getBlock(bx, by);
                if (block !== 0 && block !== window.ItemType?.WATER) {
                    return true;
                }
            }
        }
        return false;
    }

    takeDamage(damage) {
        this.health -= damage;

        // ダメージを受けたら逃げる
        this.vx = this.direction * 3;
        this.vy = -5;

        return this.health <= 0;
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // 動物の絵文字を表示
        ctx.font = `${this.height}px Arial`;
        ctx.fillText(this.emoji, screenX, screenY + this.height);

        // 体力バー（ダメージを受けたときのみ）
        if (this.health < this.maxHealth) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(screenX, screenY - 10, this.width, 4);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(screenX, screenY - 10, (this.width * this.health) / this.maxHealth, 4);
        }
    }
}

class AnimalManager {
    constructor() {
        this.animals = [];
        this.spawnTimer = 0;
        this.maxAnimals = 15;
    }

    update(world, player, deltaTime) {
        // 動物のスポーン
        this.spawnTimer -= deltaTime || 16;
        if (this.spawnTimer <= 0 && this.animals.length < this.maxAnimals) {
            this.trySpawnAnimal(world, player);
            this.spawnTimer = 10000 + Math.random() * 20000; // 10-30秒ごと
        }

        // 動物の更新
        for (let i = this.animals.length - 1; i >= 0; i--) {
            const animal = this.animals[i];
            animal.update(world, deltaTime);

            // 画面外の動物を削除
            const distance = Math.abs(animal.x - player.x);
            if (distance > 2000) {
                this.animals.splice(i, 1);
            }
        }
    }

    trySpawnAnimal(world, player) {
        // プレイヤーの近くにスポーン
        const spawnDistance = 300 + Math.random() * 500;
        const spawnX = player.x + (Math.random() < 0.5 ? -spawnDistance : spawnDistance);
        const spawnY = player.y - 100;

        // 地面を探す
        let groundY = spawnY;
        for (let y = Math.floor(spawnY / BLOCK_SIZE); y < WORLD_HEIGHT; y++) {
            const block = world.getBlock(Math.floor(spawnX / BLOCK_SIZE), y);
            if (block !== 0 && block !== window.ItemType?.WATER) {
                groundY = (y - 1) * BLOCK_SIZE;
                break;
            }
        }

        // ランダムな動物タイプ
        const types = ['pig', 'cow', 'chicken'];
        const type = types[Math.floor(Math.random() * types.length)];

        const animal = new Animal(type, spawnX, groundY);
        this.animals.push(animal);
    }

    checkAttack(player, attackX, attackY, damage) {
        const attacked = [];

        for (let i = this.animals.length - 1; i >= 0; i--) {
            const animal = this.animals[i];
            const distance = Math.sqrt(
                Math.pow(animal.x + animal.width/2 - attackX, 2) +
                Math.pow(animal.y + animal.height/2 - attackY, 2)
            );

            if (distance < 50) {
                const isDead = animal.takeDamage(damage);
                if (isDead) {
                    // アイテムドロップ
                    animal.drops.forEach(item => {
                        if (item && window.inventory) {
                            window.inventory.addItem(item);
                        }
                    });

                    // エフェクト
                    const msg = document.createElement('div');
                    msg.textContent = `${animal.emoji} +${animal.drops.length}`;
                    msg.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                         color: white; font-size: 24px; z-index: 1000;
                                         text-shadow: 2px 2px 4px rgba(0,0,0,0.8);`;
                    document.body.appendChild(msg);
                    setTimeout(() => msg.remove(), 1000);

                    this.animals.splice(i, 1);
                }
                attacked.push(animal);
            }
        }
        return attacked;
    }

    draw(ctx, camera) {
        this.animals.forEach(animal => {
            animal.draw(ctx, camera);
        });
    }
}

// グローバル変数
window.animalManager = new AnimalManager();