// チェストシステム

// チェストクラス
class Chest {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.slots = [];
        this.maxSlots = 27; // 9x3のチェスト容量

        // スロット初期化
        for (let i = 0; i < this.maxSlots; i++) {
            this.slots.push({ item: null, count: 0 });
        }
    }

    addItem(itemType, count = 1) {
        // 既存のスタックに追加
        for (let slot of this.slots) {
            if (slot.item === itemType && slot.count < 64) {
                const addCount = Math.min(count, 64 - slot.count);
                slot.count += addCount;
                count -= addCount;
                if (count <= 0) return true;
            }
        }

        // 新しいスロットに追加
        for (let slot of this.slots) {
            if (slot.item === null) {
                slot.item = itemType;
                slot.count = Math.min(count, 64);
                count -= slot.count;
                if (count <= 0) return true;
            }
        }

        return count <= 0;
    }

    removeItem(slotIndex, count = 1) {
        if (slotIndex < 0 || slotIndex >= this.maxSlots) return null;
        const slot = this.slots[slotIndex];

        if (slot.item === null) return null;

        const removeCount = Math.min(count, slot.count);
        slot.count -= removeCount;
        const removedItem = slot.item;

        if (slot.count <= 0) {
            slot.item = null;
            slot.count = 0;
        }

        return { item: removedItem, count: removeCount };
    }

    getSlot(index) {
        if (index < 0 || index >= this.maxSlots) return null;
        return this.slots[index];
    }
}

// チェスト管理システム
class ChestManager {
    constructor() {
        this.chests = new Map(); // 位置をキーとしたチェストのマップ
    }

    createChest(x, y) {
        const key = `${x},${y}`;
        if (!this.chests.has(key)) {
            this.chests.set(key, new Chest(x, y));
        }
        return this.chests.get(key);
    }

    getChest(x, y) {
        const key = `${x},${y}`;
        return this.chests.get(key);
    }

    removeChest(x, y) {
        const key = `${x},${y}`;
        return this.chests.delete(key);
    }
}

// チェストUI
class ChestUI {
    constructor(inventory, chestManager) {
        this.inventory = inventory;
        this.chestManager = chestManager;
        this.currentChest = null;
        this.isOpen = false;
        this.selectedChestSlot = -1;
        this.createUI();
    }

    createUI() {
        // チェストUIコンテナ
        const chestUI = document.createElement('div');
        chestUI.id = 'chestUI';
        chestUI.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #8B4513;
            border-radius: 10px;
            padding: 20px;
            display: none;
            z-index: 200;
            min-width: 400px;
        `;

        // タイトル
        const title = document.createElement('h2');
        title.textContent = 'チェスト';
        title.style.cssText = `
            color: white;
            text-align: center;
            margin-bottom: 15px;
            font-size: 20px;
        `;
        chestUI.appendChild(title);

        // チェストスロット（上部）
        const chestGrid = document.createElement('div');
        chestGrid.id = 'chestGrid';
        chestGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(9, 45px);
            grid-template-rows: repeat(3, 45px);
            gap: 3px;
            margin-bottom: 20px;
            justify-content: center;
        `;
        chestUI.appendChild(chestGrid);

        // 区切り線
        const divider = document.createElement('hr');
        divider.style.cssText = `
            border: 1px solid #666;
            margin: 15px 0;
        `;
        chestUI.appendChild(divider);

        // インベントリスロット（下部）
        const inventoryLabel = document.createElement('div');
        inventoryLabel.textContent = 'インベントリ';
        inventoryLabel.style.cssText = `
            color: #AAA;
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
        `;
        chestUI.appendChild(inventoryLabel);

        const inventoryGrid = document.createElement('div');
        inventoryGrid.id = 'chestInventoryGrid';
        inventoryGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(8, 45px);
            grid-template-rows: repeat(2, 45px);
            gap: 3px;
            margin-bottom: 15px;
            justify-content: center;
        `;
        chestUI.appendChild(inventoryGrid);

        // 閉じるボタン
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '閉じる';
        closeBtn.style.cssText = `
            width: 100px;
            padding: 8px;
            background: #f44336;
            border: 2px solid #333;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        `;
        closeBtn.onclick = () => this.close();
        chestUI.appendChild(closeBtn);

        document.body.appendChild(chestUI);
        this.uiElement = chestUI;
    }

    open(x, y) {
        const chest = this.chestManager.getChest(x, y);
        if (!chest) {
            // チェストが存在しない場合は新規作成
            this.currentChest = this.chestManager.createChest(x, y);
        } else {
            this.currentChest = chest;
        }

        this.isOpen = true;
        this.updateUI();
        this.uiElement.style.display = 'block';

        // Escキーでチェストを閉じるイベントリスナーを追加
        this.escKeyHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        window.addEventListener('keydown', this.escKeyHandler);
    }

    close() {
        this.isOpen = false;
        this.currentChest = null;
        this.selectedChestSlot = -1;
        this.uiElement.style.display = 'none';

        // Escキーのイベントリスナーを削除
        if (this.escKeyHandler) {
            window.removeEventListener('keydown', this.escKeyHandler);
            this.escKeyHandler = null;
        }
    }

    updateUI() {
        if (!this.currentChest) return;

        // チェストスロットの更新
        const chestGrid = document.getElementById('chestGrid');
        chestGrid.innerHTML = '';

        for (let i = 0; i < this.currentChest.maxSlots; i++) {
            const slot = this.currentChest.getSlot(i);
            const slotDiv = this.createSlotElement(slot, i, true);
            chestGrid.appendChild(slotDiv);
        }

        // インベントリスロットの更新
        const inventoryGrid = document.getElementById('chestInventoryGrid');
        inventoryGrid.innerHTML = '';

        for (let i = 0; i < this.inventory.maxSlots; i++) {
            const slot = this.inventory.slots[i];
            const slotDiv = this.createSlotElement(slot, i, false);
            inventoryGrid.appendChild(slotDiv);
        }
    }

    createSlotElement(slot, index, isChestSlot) {
        const slotDiv = document.createElement('div');
        slotDiv.style.cssText = `
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #666;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            font-size: 10px;
            color: white;
            text-align: center;
        `;

        if (slot && slot.item !== null && slot.item !== undefined) {
            // アイテム情報取得
            const info = window.itemInfo[slot.item];
            if (info) {
                // 背景色
                slotDiv.style.background = (info.color || '#666') + '44';

                // アイコン表示
                const icons = {
                    1: '🟫土', 2: '🟩草', 3: '⬜石', 4: '🪵木',
                    5: '🍃葉', 6: '🟨砂', 7: '🟫板', 8: '｜棒',
                    9: '🔨台', 15: '🔥炉', 16: '📦箱', 17: '🔦灯',
                    33: '⚫炭', 34: '🔶鉄鉱', 54: '🔩鉄', 35: '🟡金鉱',
                    55: '🪙金', 36: '💚緑', 37: '🗡️木剣', 38: '⚔️石剣',
                    39: '🗡️鉄剣', 41: '💎剣', 10: '⛏️木', 11: '⛏️石',
                    12: '🪓木', 13: '🪓石', 14: '🪨石'
                };

                const icon = document.createElement('div');
                icon.textContent = icons[slot.item] || info.name.substring(0, 2);
                icon.style.cssText = `
                    font-size: 14px;
                    text-shadow: 1px 1px 2px #000;
                `;
                slotDiv.appendChild(icon);

                // 数量表示
                if (slot.count > 1) {
                    const countDiv = document.createElement('div');
                    countDiv.textContent = slot.count;
                    countDiv.style.cssText = `
                        position: absolute;
                        bottom: 2px;
                        right: 2px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 2px 4px;
                        font-size: 10px;
                        border-radius: 3px;
                    `;
                    slotDiv.appendChild(countDiv);
                }
            }
        }

        // クリックイベント
        slotDiv.onclick = () => {
            this.handleSlotClick(index, isChestSlot);
        };

        // ホバー効果
        slotDiv.onmouseover = () => {
            slotDiv.style.borderColor = '#999';
        };
        slotDiv.onmouseout = () => {
            slotDiv.style.borderColor = '#666';
        };

        return slotDiv;
    }

    handleSlotClick(index, isChestSlot) {
        if (isChestSlot) {
            // チェストスロットクリック
            const chestSlot = this.currentChest.getSlot(index);
            if (chestSlot && chestSlot.item !== null) {
                // アイテムをインベントリに移動
                const removed = this.currentChest.removeItem(index, chestSlot.count);
                if (removed) {
                    this.inventory.addItem(removed.item, removed.count);
                    this.updateUI();
                }
            }
        } else {
            // インベントリスロットクリック
            const invSlot = this.inventory.slots[index];
            if (invSlot && invSlot.item !== null) {
                // アイテムをチェストに移動
                const count = invSlot.count;
                const item = invSlot.item;

                if (this.currentChest.addItem(item, count)) {
                    // チェストに追加成功したらインベントリから削除
                    this.inventory.removeItemAt(index, count);
                    this.updateUI();
                }
            }
        }
    }
}

// グローバルに公開
window.ChestManager = ChestManager;
window.ChestUI = ChestUI;