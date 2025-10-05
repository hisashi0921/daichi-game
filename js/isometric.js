// アイソメトリック（2.5D）レンダリングシステム

// BLOCK_SIZEはgame.jsから使用する

class IsometricRenderer {
    constructor() {
        this.tileWidth = 32;  // タイルの幅
        this.tileHeight = 16; // タイルの高さ（アイソメトリック）
        this.tileDepth = 32;  // タイルの奥行き
        this.enabled = false;
        this.blockHeights = new Map(); // ブロックの高さ情報
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // 2D座標をアイソメトリック座標に変換
    toIsometric(x, y) {
        const isoX = (x - y) * this.tileWidth / 2;
        const isoY = (x + y) * this.tileHeight / 2;
        return { x: isoX, y: isoY };
    }

    // アイソメトリック座標を2D座標に変換
    fromIsometric(isoX, isoY) {
        const x = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
        const y = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
        return { x: Math.floor(x), y: Math.floor(y) };
    }

    // ブロックの高さを計算（地形の起伏を作る）
    getBlockHeight(x, y, blockType) {
        const key = `${x},${y}`;
        if (!this.blockHeights.has(key)) {
            // ブロックタイプに応じた高さ
            let height = 0;
            switch(blockType) {
                case 0: // AIR
                    height = 0;
                    break;
                case 2: // GRASS
                    height = Math.sin(x * 0.1) * 2 + Math.cos(y * 0.1) * 2;
                    break;
                case 3: // STONE
                    height = 2;
                    break;
                case 4: // WOOD
                    height = 3;
                    break;
                default:
                    height = 1;
            }
            this.blockHeights.set(key, height);
        }
        return this.blockHeights.get(key);
    }

    // 3Dブロックを描画
    drawIsometricBlock(ctx, worldX, worldY, blockType, camera, blockInfo) {
        if (blockType === 0) return; // 空気ブロックは描画しない

        // 最もシンプルな描画でテスト
        const blockX = worldX * BLOCK_SIZE - camera.x;
        const blockY = worldY * BLOCK_SIZE - camera.y;

        // 画面外のブロックはスキップ
        if (blockX + BLOCK_SIZE < 0 || blockX > ctx.canvas.width ||
            blockY + BLOCK_SIZE < 0 || blockY > ctx.canvas.height) {
            return;
        }

        const depth = 6; // 立体感の深さ

        // BlockTypeごとにハードコードした色を使う
        const colorMap = {
            1: '#8B4513',  // DIRT - 茶色
            2: '#228B22',  // GRASS - 緑
            3: '#808080',  // STONE - グレー
            4: '#654321',  // WOOD - 木の色
            5: '#006400',  // LEAVES - 濃い緑
            6: '#F4E4BC',  // SAND - 砂色
            7: '#DEB887',  // PLANKS - 薄い木の色
            8: '#8B7355',  // STICK
            9: '#8B4513',  // CRAFTING_TABLE
            10: '#A0522D', // WOODEN_PICKAXE
            11: '#696969', // STONE_PICKAXE
            12: '#A0522D', // WOODEN_AXE
            13: '#696969', // STONE_AXE
            14: '#A9A9A9', // COBBLESTONE
            15: '#696969', // FURNACE
            16: '#8B4513', // CHEST
            17: '#FFA500', // TORCH
            25: '#FFB6C1', // 虹色ブロック
            26: '#FFD700', // にっこりブロック
            27: '#4169E1', // ほしブロック
            28: '#FFC0CB', // ケーキ
            30: '#00CED1', // ダイヤ
            33: '#2C2C2C', // COAL
            34: '#B87333', // IRON_ORE
            35: '#DAA520', // GOLD_ORE
            36: '#50C878', // EMERALD
            37: '#A0522D', // WOODEN_SWORD
            38: '#696969', // STONE_SWORD
            39: '#C0C0C0', // IRON_SWORD
            40: '#FFD700', // GOLD_SWORD
            41: '#00CED1', // DIAMOND_SWORD
        };

        let baseColor = colorMap[blockType] || '#FF00FF'; // マゼンタで未定義を表示

        // メインブロックを描画
        ctx.save();

        // 影を描画
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(blockX + depth/2, blockY + depth/2, BLOCK_SIZE, BLOCK_SIZE);

        // メインブロック
        ctx.fillStyle = baseColor;
        ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);

        // 右側面（少し暗めの面）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(blockX + BLOCK_SIZE, blockY);
        ctx.lineTo(blockX + BLOCK_SIZE + depth, blockY - depth);
        ctx.lineTo(blockX + BLOCK_SIZE + depth, blockY + BLOCK_SIZE - depth);
        ctx.lineTo(blockX + BLOCK_SIZE, blockY + BLOCK_SIZE);
        ctx.closePath();
        ctx.fill();

        // 上面（少し明るめの面）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(blockX, blockY);
        ctx.lineTo(blockX + depth, blockY - depth);
        ctx.lineTo(blockX + BLOCK_SIZE + depth, blockY - depth);
        ctx.lineTo(blockX + BLOCK_SIZE, blockY);
        ctx.closePath();
        ctx.fill();

        // 枠線
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);

        ctx.restore();
    }

    // キューブを描画
    drawCube(ctx, x, y, width, height, depth, topColor, leftColor, rightColor) {
        // 上面
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height / 2);
        ctx.lineTo(x, y - height);
        ctx.lineTo(x - width / 2, y - height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // 左面
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y - height / 2);
        ctx.lineTo(x, y - height);
        ctx.lineTo(x, y - height + depth);
        ctx.lineTo(x - width / 2, y - height / 2 + depth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 右面
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height / 2);
        ctx.lineTo(x + width / 2, y - height / 2 + depth);
        ctx.lineTo(x, y + depth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // ブロックの装飾を描画
    drawBlockDecoration(ctx, x, y, blockType) {
        ctx.save();

        switch(blockType) {
            case 2: // GRASS
                // 草の装飾
                ctx.fillStyle = '#4CAF50';
                for (let i = 0; i < 3; i++) {
                    const offsetX = (Math.random() - 0.5) * 10;
                    const offsetY = (Math.random() - 0.5) * 5;
                    ctx.fillRect(x + offsetX - 1, y - this.tileDepth + offsetY - 10, 2, 4);
                }
                break;

            case 4: // WOOD
                // 木の年輪
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(x, y - this.tileDepth / 2, 4, 2, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;

            case 9: // CRAFTING_TABLE
                // 作業台のグリッド
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.strokeRect(x - 4, y - this.tileDepth / 2 - 4, 8, 8);
                break;

            case 16: // CHEST
                // チェストの鍵
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x - 2, y - this.tileDepth / 2, 4, 6);
                break;
        }

        ctx.restore();
    }

    // プレイヤーを3D描画
    drawIsometricPlayer(ctx, player, camera) {
        const drawX = player.x - camera.x;
        const drawY = player.y - camera.y;
        const depth = 4;

        // プレイヤーの影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(drawX + depth, drawY + player.height + depth, player.width, 4);

        // プレイヤー本体を立体的に
        // 側面（半透明の黒）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(drawX + player.width, drawY);
        ctx.lineTo(drawX + player.width + depth, drawY - depth);
        ctx.lineTo(drawX + player.width + depth, drawY + player.height - depth);
        ctx.lineTo(drawX + player.width, drawY + player.height);
        ctx.closePath();
        ctx.fill();

        // 上面（半透明の白）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(drawX + depth, drawY - depth);
        ctx.lineTo(drawX + player.width + depth, drawY - depth);
        ctx.lineTo(drawX + player.width, drawY);
        ctx.closePath();
        ctx.fill();

        // 正面
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(drawX, drawY, player.width, player.height);

        // 顔
        ctx.fillStyle = '#FFF';
        ctx.fillRect(drawX + 6, drawY + 8, 4, 4);
        ctx.fillRect(drawX + 16, drawY + 8, 4, 4);

        // 体力バー
        if (player.health < player.maxHealth) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(drawX, drawY - 10, player.width * (player.health / player.maxHealth), 4);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(drawX, drawY - 10, player.width, 4);
        }
    }

    // 敵を3D描画
    drawIsometricEnemy(ctx, enemy, camera) {
        const drawX = enemy.x - camera.x;
        const drawY = enemy.y - camera.y;
        const depth = 4;

        // 敵の影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(drawX + depth, drawY + enemy.height + depth, enemy.width, 4);

        // 敵本体を立体的に
        const bodyColor = enemy.color || '#006400';

        // 側面（半透明の黒）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(drawX + enemy.width, drawY);
        ctx.lineTo(drawX + enemy.width + depth, drawY - depth);
        ctx.lineTo(drawX + enemy.width + depth, drawY + enemy.height - depth);
        ctx.lineTo(drawX + enemy.width, drawY + enemy.height);
        ctx.closePath();
        ctx.fill();

        // 上面（半透明の白）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(drawX, drawY);
        ctx.lineTo(drawX + depth, drawY - depth);
        ctx.lineTo(drawX + enemy.width + depth, drawY - depth);
        ctx.lineTo(drawX + enemy.width, drawY);
        ctx.closePath();
        ctx.fill();

        // 正面
        ctx.fillStyle = bodyColor;
        ctx.fillRect(drawX, drawY, enemy.width, enemy.height);

        // 目
        ctx.fillStyle = enemy.type === 'zombie' ? '#FF0000' : '#FFF';
        ctx.fillRect(drawX + 6, drawY + 8, 3, 3);
        ctx.fillRect(drawX + enemy.width - 9, drawY + 8, 3, 3);

        // 体力バー
        if (enemy.health < enemy.maxHealth) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(drawX, drawY - 8, enemy.width * (enemy.health / enemy.maxHealth), 3);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(drawX, drawY - 8, enemy.width, 3);
        }
    }

    // 色を明るくする
    lightenColor(color, percent) {
        if (!color || typeof color !== 'string') return '#CCCCCC';
        try {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = ((num >> 8) & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return '#' + (0x1000000 + (R < 255 ? R : 255) * 0x10000 +
                         (G < 255 ? G : 255) * 0x100 +
                         (B < 255 ? B : 255)).toString(16).slice(1);
        } catch (e) {
            return '#CCCCCC';
        }
    }

    // 色を暗くする
    darkenColor(color, percent) {
        if (!color || typeof color !== 'string') return '#666666';
        try {
            const num = parseInt(color.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = ((num >> 8) & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
                         (G > 0 ? G : 0) * 0x100 +
                         (B > 0 ? B : 0)).toString(16).slice(1);
        } catch (e) {
            return '#666666';
        }
    }
}

// 3D表示切り替えボタンを追加
function add3DToggleButton() {
    const button = document.createElement('button');
    button.id = '3dToggleBtn';
    button.innerHTML = '🎮 2D<br><span style="font-size: 10px">[T]</span>';
    button.style.cssText = `
        position: fixed;
        top: 160px;
        right: 10px;
        width: 100px;
        height: 50px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        border: 2px solid #333;
        border-radius: 10px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 100;
        transition: all 0.3s;
        line-height: 1.2;
        padding: 5px;
    `;

    button.onclick = () => {
        if (window.isometricRenderer) {
            const is3D = window.isometricRenderer.toggle();
            button.innerHTML = is3D ?
                '🎮 3D<br><span style="font-size: 10px">[T]</span>' :
                '🎮 2D<br><span style="font-size: 10px">[T]</span>';
            button.style.background = is3D ?
                'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' :
                'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        }
    };

    document.body.appendChild(button);
}

// グローバルに公開
window.IsometricRenderer = IsometricRenderer;

// 初期化
window.addEventListener('load', () => {
    window.isometricRenderer = new IsometricRenderer();
    add3DToggleButton();
});