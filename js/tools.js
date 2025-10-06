// 道具システム

// 道具のタイプ
const ToolType = {
    NONE: 'none',
    PICKAXE: 'pickaxe',
    AXE: 'axe',
    SHOVEL: 'shovel',
    SWORD: 'sword'
};

// 道具の素材レベル
const ToolMaterial = {
    NONE: 0,
    WOOD: 1,
    STONE: 2,
    IRON: 3,
    DIAMOND: 4
};

// 道具の情報
const toolInfo = {
    [window.ItemType.WOODEN_PICKAXE]: {
        type: ToolType.PICKAXE,
        material: ToolMaterial.WOOD,
        damage: 2,
        speed: 2
    },
    [window.ItemType.STONE_PICKAXE]: {
        type: ToolType.PICKAXE,
        material: ToolMaterial.STONE,
        damage: 3,
        speed: 3
    },
    [window.ItemType.WOODEN_AXE]: {
        type: ToolType.AXE,
        material: ToolMaterial.WOOD,
        damage: 2,
        speed: 2
    },
    [window.ItemType.STONE_AXE]: {
        type: ToolType.AXE,
        material: ToolMaterial.STONE,
        damage: 3,
        speed: 3
    },
    [window.ItemType.WOODEN_SHOVEL]: {
        type: ToolType.SHOVEL,
        material: ToolMaterial.WOOD,
        damage: 1,
        speed: 2
    },
    [window.ItemType.STONE_SHOVEL]: {
        type: ToolType.SHOVEL,
        material: ToolMaterial.STONE,
        damage: 2,
        speed: 4
    },
    [window.ItemType.IRON_SHOVEL]: {
        type: ToolType.SHOVEL,
        material: ToolMaterial.IRON,
        damage: 3,
        speed: 6
    },
    [window.ItemType.DIAMOND_SHOVEL]: {
        type: ToolType.SHOVEL,
        material: ToolMaterial.DIAMOND,
        damage: 4,
        speed: 8
    }
};

// ブロックの属性
const blockProperties = {
    [window.ItemType.DIRT]: {
        hardness: 0.5,
        tool: ToolType.SHOVEL,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 750
    },
    [window.ItemType.GRASS]: {
        hardness: 0.6,
        tool: ToolType.SHOVEL,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 900
    },
    [window.ItemType.STONE]: {
        hardness: 1.5,
        tool: ToolType.PICKAXE,
        minLevel: ToolMaterial.WOOD,
        baseBreakTime: 2250
    },
    [window.ItemType.COBBLESTONE]: {
        hardness: 2.0,
        tool: ToolType.PICKAXE,
        minLevel: ToolMaterial.WOOD,
        baseBreakTime: 3000
    },
    [window.ItemType.WOOD]: {
        hardness: 2.0,
        tool: ToolType.AXE,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 3000
    },
    [window.ItemType.PLANKS]: {
        hardness: 2.0,
        tool: ToolType.AXE,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 3000
    },
    [window.ItemType.LEAVES]: {
        hardness: 0.2,
        tool: ToolType.NONE,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 300
    },
    [window.ItemType.SAND]: {
        hardness: 0.5,
        tool: ToolType.SHOVEL,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 750
    },
    [window.ItemType.CRAFTING_TABLE]: {
        hardness: 2.5,
        tool: ToolType.AXE,
        minLevel: ToolMaterial.NONE,
        baseBreakTime: 3750
    }
};

// 採掘システム
class MiningSystem {
    constructor() {
        this.miningBlock = null;
        this.miningProgress = 0;
        this.miningTime = 0;
        this.totalMiningTime = 0;
        this.particles = [];
    }

    startMining(x, y, blockType, toolItem) {
        // 既に採掘中の同じブロックなら継続
        if (this.miningBlock && this.miningBlock.x === x && this.miningBlock.y === y) {
            return;
        }

        // 新しいブロックの採掘開始
        this.miningBlock = { x, y, type: blockType };
        this.miningProgress = 0;
        this.miningTime = 0;

        // 採掘時間を計算
        this.totalMiningTime = this.calculateBreakTime(blockType, toolItem);
    }

    stopMining() {
        this.miningBlock = null;
        this.miningProgress = 0;
        this.miningTime = 0;
        this.totalMiningTime = 0;
    }

    update(deltaTime) {
        if (!this.miningBlock) return false;

        this.miningTime += deltaTime;
        this.miningProgress = Math.min(this.miningTime / this.totalMiningTime, 1.0);

        // パーティクル生成
        if (Math.random() < 0.1) {
            this.addParticle(this.miningBlock.x, this.miningBlock.y);
        }

        // パーティクル更新
        this.updateParticles(deltaTime);

        // 採掘完了
        if (this.miningProgress >= 1.0) {
            const completed = { ...this.miningBlock };
            this.stopMining();
            return completed;
        }

        return false;
    }

    calculateBreakTime(blockType, toolItem) {
        const props = blockProperties[blockType];
        if (!props) return 1000; // デフォルト値

        let breakTime = props.baseBreakTime;

        // 道具を持っている場合
        if (toolItem && toolInfo[toolItem]) {
            const tool = toolInfo[toolItem];

            // 適正道具の場合
            if (tool.type === props.tool) {
                breakTime = breakTime / tool.speed;
            }
            // 不適正だが道具を持っている場合
            else if (tool.type !== ToolType.NONE) {
                breakTime = breakTime / 1.5;
            }

            // レベルチェック（石には木以上のツルハシが必要など）
            if (props.minLevel > ToolMaterial.NONE &&
                props.tool === tool.type &&
                tool.material < props.minLevel) {
                // 適正レベル未満の場合、破壊に時間がかかる
                breakTime = breakTime * 3;
            }
        }

        return breakTime;
    }

    canHarvest(blockType, toolItem) {
        const props = blockProperties[blockType];
        if (!props) return true;

        // 最低限必要な道具レベルをチェック
        if (props.minLevel > ToolMaterial.NONE) {
            if (!toolItem || !toolInfo[toolItem]) {
                // 石などは素手で壊せない（アイテムをドロップしない）
                return props.minLevel === ToolMaterial.NONE;
            }

            const tool = toolInfo[toolItem];
            if (tool.type !== props.tool || tool.material < props.minLevel) {
                return false;
            }
        }

        return true;
    }

    addParticle(blockX, blockY) {
        const particle = {
            x: (blockX + 0.5) * BLOCK_SIZE + (Math.random() - 0.5) * BLOCK_SIZE,
            y: (blockY + 0.5) * BLOCK_SIZE + (Math.random() - 0.5) * BLOCK_SIZE,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 1.0,
            size: 2 + Math.random() * 2
        };
        this.particles.push(particle);
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // 重力
            p.life -= deltaTime / 500;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, camera) {
        // 採掘進捗の表示
        if (this.miningBlock && this.miningProgress > 0) {
            const x = this.miningBlock.x * BLOCK_SIZE - camera.x;
            const y = this.miningBlock.y * BLOCK_SIZE - camera.y;

            // ひび割れエフェクト
            ctx.globalAlpha = this.miningProgress;
            const stage = Math.floor(this.miningProgress * 10);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;

            // ステージに応じたひび割れパターン
            if (stage >= 1) {
                ctx.beginPath();
                ctx.moveTo(x + 8, y + 8);
                ctx.lineTo(x + 16, y + 16);
                ctx.stroke();
            }
            if (stage >= 3) {
                ctx.beginPath();
                ctx.moveTo(x + 24, y + 8);
                ctx.lineTo(x + 16, y + 16);
                ctx.stroke();
            }
            if (stage >= 5) {
                ctx.beginPath();
                ctx.moveTo(x + 16, y + 16);
                ctx.lineTo(x + 8, y + 24);
                ctx.stroke();
            }
            if (stage >= 7) {
                ctx.beginPath();
                ctx.moveTo(x + 16, y + 16);
                ctx.lineTo(x + 24, y + 24);
                ctx.stroke();
            }
            if (stage >= 9) {
                // 全体にひび
                ctx.beginPath();
                ctx.moveTo(x + 4, y + 4);
                ctx.lineTo(x + 28, y + 28);
                ctx.moveTo(x + 28, y + 4);
                ctx.lineTo(x + 4, y + 28);
                ctx.stroke();
            }

            ctx.globalAlpha = 1.0;
        }

        // パーティクルの描画
        ctx.fillStyle = '#8B4513';
        for (const p of this.particles) {
            ctx.globalAlpha = p.life;
            ctx.fillRect(
                p.x - camera.x - p.size / 2,
                p.y - camera.y - p.size / 2,
                p.size,
                p.size
            );
        }
        ctx.globalAlpha = 1.0;
    }
}

// グローバルに公開
window.MiningSystem = MiningSystem;
window.toolInfo = toolInfo;
window.blockProperties = blockProperties;