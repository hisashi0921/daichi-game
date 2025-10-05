// レシピブックシステム

class RecipeBook {
    constructor() {
        this.isOpen = false;
        this.currentPage = 0;
        this.recipesPerPage = 6;
        this.createUI();
        this.loadRecipes();
    }

    loadRecipes() {
        // すべてのレシピを読み込み
        this.recipes = [];

        // 2x2レシピ
        if (window.recipes2x2) {
            for (const recipe of window.recipes2x2) {
                this.recipes.push({
                    pattern: recipe.pattern,
                    result: recipe.result,
                    type: '2x2',
                    name: this.getItemName(recipe.result)
                });
            }
        }

        // 3x3レシピ
        if (window.recipes3x3) {
            for (const recipe of window.recipes3x3) {
                this.recipes.push({
                    pattern: recipe.pattern,
                    result: recipe.result,
                    type: '3x3',
                    name: this.getItemName(recipe.result)
                });
            }
        }

        // お楽しみレシピ
        if (window.funRecipes) {
            for (const recipe of window.funRecipes) {
                this.recipes.push({
                    pattern: recipe.pattern,
                    result: recipe.result,
                    type: recipe.pattern.length === 4 ? '2x2' : '3x3',
                    name: this.getItemName(recipe.result),
                    isFun: true
                });
            }
        }

        // レシピを名前順にソート
        this.recipes.sort((a, b) => {
            if (a.isFun && !b.isFun) return 1;
            if (!a.isFun && b.isFun) return -1;
            return a.name.localeCompare(b.name);
        });
    }

    getItemName(itemId) {
        if (window.itemInfo && window.itemInfo[itemId]) {
            return window.itemInfo[itemId].name;
        }
        return 'アイテム' + itemId;
    }

    getItemIcon(itemId) {
        const icons = {
            1: '🟫', 2: '🟩', 3: '⬜', 4: '🪵',
            5: '🍃', 6: '🟨', 7: '🟫', 8: '｜',
            9: '🔨', 15: '🔥', 16: '📦', 17: '🔦',
            33: '⚫', 34: '🔶', 54: '🔩', 35: '🟡',
            55: '🪙', 36: '💚', 37: '🗡️', 38: '⚔️',
            39: '🗡️', 41: '💎', 10: '⛏️', 11: '⛏️',
            12: '🪓', 13: '🪓', 14: '🪨',
            23: '❓', 24: '✨', 25: '🌈', 26: '😊',
            27: '⭐', 28: '🍰', 29: '🍪', 30: '💎',
            31: '🪄', 32: '🪴'
        };
        return icons[itemId] || '❔';
    }

    createUI() {
        // レシピブックコンテナ
        const recipeUI = document.createElement('div');
        recipeUI.id = 'recipeBookUI';
        recipeUI.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(139, 69, 19, 0.95), rgba(101, 67, 33, 0.95));
            border: 4px solid #654321;
            border-radius: 15px;
            padding: 20px;
            display: none;
            z-index: 250;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;

        // タイトル
        const title = document.createElement('h1');
        title.textContent = '📖 レシピブック';
        title.style.cssText = `
            color: #FFD700;
            text-align: center;
            margin-bottom: 20px;
            font-size: 28px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;
        recipeUI.appendChild(title);

        // タブ
        const tabs = document.createElement('div');
        tabs.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        `;

        const basicTab = this.createTab('基本レシピ', true);
        const funTab = this.createTab('お楽しみレシピ', false);

        basicTab.onclick = () => {
            this.showBasicRecipes();
            basicTab.classList.add('active');
            funTab.classList.remove('active');
        };

        funTab.onclick = () => {
            this.showFunRecipes();
            funTab.classList.add('active');
            basicTab.classList.remove('active');
        };

        tabs.appendChild(basicTab);
        tabs.appendChild(funTab);
        recipeUI.appendChild(tabs);

        // レシピリストコンテナ
        const recipeList = document.createElement('div');
        recipeList.id = 'recipeList';
        recipeList.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        `;
        recipeUI.appendChild(recipeList);

        // ページネーション
        const pagination = document.createElement('div');
        pagination.id = 'recipePagination';
        pagination.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 20px;
        `;
        recipeUI.appendChild(pagination);

        // 閉じるボタン
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ 閉じる';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 8px 16px;
            background: #f44336;
            border: 2px solid #333;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.onclick = () => this.close();
        recipeUI.appendChild(closeBtn);

        // 説明テキスト
        const helpText = document.createElement('div');
        helpText.innerHTML = `
            <div style="color: #FFE4B5; text-align: center; margin-top: 10px; font-size: 12px;">
                💡 ヒント: 木の棒は木材を縦に2つ並べて作ります<br>
                🌈 虹色ブロックはお楽しみレシピで作れます！
            </div>
        `;
        recipeUI.appendChild(helpText);

        document.body.appendChild(recipeUI);
        this.uiElement = recipeUI;

        // スタイル追加
        const style = document.createElement('style');
        style.textContent = `
            .recipe-tab {
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #8B4513;
                border-radius: 8px;
                color: #FFF;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .recipe-tab:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .recipe-tab.active {
                background: rgba(255, 215, 0, 0.3);
                border-color: #FFD700;
                color: #FFD700;
            }

            .recipe-card {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid #8B4513;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s;
            }

            .recipe-card:hover {
                background: rgba(0, 0, 0, 0.6);
                border-color: #FFD700;
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }

    createTab(text, isActive) {
        const tab = document.createElement('button');
        tab.textContent = text;
        tab.className = 'recipe-tab' + (isActive ? ' active' : '');
        return tab;
    }

    open() {
        this.isOpen = true;
        this.currentPage = 0;
        this.showBasicRecipes();
        this.uiElement.style.display = 'block';
    }

    close() {
        this.isOpen = false;
        this.uiElement.style.display = 'none';
    }

    showBasicRecipes() {
        const basicRecipes = this.recipes.filter(r => !r.isFun);
        this.displayRecipes(basicRecipes);
    }

    showFunRecipes() {
        const funRecipes = this.recipes.filter(r => r.isFun);
        this.displayRecipes(funRecipes);
    }

    displayRecipes(recipes) {
        const recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        const startIdx = this.currentPage * this.recipesPerPage;
        const endIdx = Math.min(startIdx + this.recipesPerPage, recipes.length);

        for (let i = startIdx; i < endIdx; i++) {
            const recipe = recipes[i];
            const card = this.createRecipeCard(recipe);
            recipeList.appendChild(card);
        }

        // ページネーション更新
        this.updatePagination(recipes.length);
    }

    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        // レシピパターン表示
        const patternDiv = document.createElement('div');
        patternDiv.style.cssText = `
            display: grid;
            gap: 2px;
            background: rgba(0, 0, 0, 0.5);
            padding: 5px;
            border-radius: 5px;
        `;

        if (recipe.type === '2x2') {
            patternDiv.style.gridTemplateColumns = 'repeat(2, 25px)';
            patternDiv.style.gridTemplateRows = 'repeat(2, 25px)';
        } else {
            patternDiv.style.gridTemplateColumns = 'repeat(3, 25px)';
            patternDiv.style.gridTemplateRows = 'repeat(3, 25px)';
        }

        for (const itemId of recipe.pattern) {
            const slot = document.createElement('div');
            slot.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #444;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            `;
            if (itemId !== 0) {
                slot.textContent = this.getItemIcon(itemId);
                slot.title = this.getItemName(itemId);
            }
            patternDiv.appendChild(slot);
        }

        card.appendChild(patternDiv);

        // 矢印
        const arrow = document.createElement('div');
        arrow.textContent = '→';
        arrow.style.cssText = `
            color: #FFD700;
            font-size: 24px;
            font-weight: bold;
            margin: 0 10px;
        `;
        card.appendChild(arrow);

        // 結果アイテム
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        `;

        const resultIcon = document.createElement('div');
        resultIcon.style.cssText = `
            width: 50px;
            height: 50px;
            background: rgba(255, 215, 0, 0.2);
            border: 2px solid #FFD700;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        `;
        resultIcon.textContent = this.getItemIcon(recipe.result);

        const resultName = document.createElement('div');
        resultName.textContent = recipe.name;
        resultName.style.cssText = `
            color: #FFD700;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
        `;

        resultDiv.appendChild(resultIcon);
        resultDiv.appendChild(resultName);
        card.appendChild(resultDiv);

        return card;
    }

    updatePagination(totalRecipes) {
        const pagination = document.getElementById('recipePagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(totalRecipes / this.recipesPerPage);

        if (totalPages <= 1) return;

        // 前ページボタン
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '◀';
        prevBtn.style.cssText = `
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #8B4513;
            border-radius: 5px;
            color: white;
            cursor: pointer;
        `;
        prevBtn.disabled = this.currentPage === 0;
        prevBtn.onclick = () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.displayRecipes(totalRecipes);
            }
        };
        pagination.appendChild(prevBtn);

        // ページ番号
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `${this.currentPage + 1} / ${totalPages}`;
        pageInfo.style.color = '#FFD700';
        pageInfo.style.fontWeight = 'bold';
        pagination.appendChild(pageInfo);

        // 次ページボタン
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '▶';
        nextBtn.style.cssText = `
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #8B4513;
            border-radius: 5px;
            color: white;
            cursor: pointer;
        `;
        nextBtn.disabled = this.currentPage >= totalPages - 1;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages - 1) {
                this.currentPage++;
                this.displayRecipes(totalRecipes);
            }
        };
        pagination.appendChild(nextBtn);
    }
}

// レシピブックボタンを追加
function addRecipeBookButton() {
    const button = document.createElement('button');
    button.id = 'recipeBookBtn';
    button.textContent = '📖 レシピ';
    button.style.cssText = `
        position: fixed;
        top: 110px;
        right: 10px;
        width: 100px;
        height: 40px;
        background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
        border: 2px solid #654321;
        border-radius: 10px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 100;
    `;

    button.onmouseover = () => {
        button.style.transform = 'scale(1.05)';
    };

    button.onmouseout = () => {
        button.style.transform = 'scale(1)';
    };

    button.onclick = () => {
        if (window.recipeBook) {
            window.recipeBook.open();
        }
    };

    document.body.appendChild(button);
}

// 初期化
window.addEventListener('load', () => {
    window.recipeBook = new RecipeBook();
    addRecipeBookButton();
});