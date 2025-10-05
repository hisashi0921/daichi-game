// クラフトシステム

// アイテムタイプの拡張
const ItemType = {
    // 基本ブロック
    AIR: 0,
    DIRT: 1,
    GRASS: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    SAND: 6,
    // クラフトアイテム
    PLANKS: 7,
    STICK: 8,
    CRAFTING_TABLE: 9,
    // 道具
    WOODEN_PICKAXE: 10,
    STONE_PICKAXE: 11,
    WOODEN_AXE: 12,
    STONE_AXE: 13,
    // その他
    COBBLESTONE: 14,
    FURNACE: 15,
    CHEST: 16,
    TORCH: 17,
    GLASS: 18,
    BRICK: 19,
    DOOR: 20,
    LADDER: 21,
    FENCE: 22,
    // 鉱石
    COAL: 33,
    IRON_ORE: 34,
    GOLD_ORE: 35,
    EMERALD: 36,
    // 武器
    WOODEN_SWORD: 37,
    STONE_SWORD: 38,
    IRON_SWORD: 39,
    GOLD_SWORD: 40,
    DIAMOND_SWORD: 41,
    // 防具
    LEATHER_HELMET: 42,
    LEATHER_CHESTPLATE: 43,
    LEATHER_LEGGINGS: 44,
    LEATHER_BOOTS: 45,
    IRON_HELMET: 46,
    IRON_CHESTPLATE: 47,
    IRON_LEGGINGS: 48,
    IRON_BOOTS: 49,
    // その他戦闘系
    BOW: 50,
    ARROW: 51,
    STRING: 52,
    LEATHER: 53,
    IRON_INGOT: 54,
    GOLD_INGOT: 55
};

// アイテム情報の拡張
const itemInfo = {
    [ItemType.AIR]: { name: '空気', color: null, drops: null },
    [ItemType.DIRT]: { name: '土', color: '#8B4513', drops: ItemType.DIRT },
    [ItemType.GRASS]: { name: '草ブロック', color: '#228B22', drops: ItemType.DIRT },
    [ItemType.STONE]: { name: '石', color: '#808080', drops: ItemType.COBBLESTONE },
    [ItemType.WOOD]: { name: '原木', color: '#654321', drops: ItemType.WOOD },
    [ItemType.LEAVES]: { name: '葉', color: '#006400', drops: ItemType.LEAVES },
    [ItemType.SAND]: { name: '砂', color: '#F4E4BC', drops: ItemType.SAND },
    [ItemType.PLANKS]: { name: '木材', color: '#DEB887', drops: ItemType.PLANKS },
    [ItemType.STICK]: { name: '棒', color: '#8B7355', drops: ItemType.STICK },
    [ItemType.CRAFTING_TABLE]: { name: '作業台', color: '#8B4513', drops: ItemType.CRAFTING_TABLE },
    [ItemType.WOODEN_PICKAXE]: { name: '木のツルハシ', color: '#A0522D', drops: ItemType.WOODEN_PICKAXE },
    [ItemType.STONE_PICKAXE]: { name: '石のツルハシ', color: '#696969', drops: ItemType.STONE_PICKAXE },
    [ItemType.WOODEN_AXE]: { name: '木のオノ', color: '#A0522D', drops: ItemType.WOODEN_AXE },
    [ItemType.STONE_AXE]: { name: '石のオノ', color: '#696969', drops: ItemType.STONE_AXE },
    [ItemType.COBBLESTONE]: { name: '丸石', color: '#A9A9A9', drops: ItemType.COBBLESTONE },
    [ItemType.FURNACE]: { name: 'かまど', color: '#696969', drops: ItemType.FURNACE },
    [ItemType.CHEST]: { name: 'チェスト', color: '#8B4513', drops: ItemType.CHEST },
    [ItemType.TORCH]: { name: 'たいまつ', color: '#FFA500', drops: ItemType.TORCH },
    [ItemType.GLASS]: { name: 'ガラス', color: '#87CEEB', drops: ItemType.GLASS },
    [ItemType.BRICK]: { name: 'レンガ', color: '#A0522D', drops: ItemType.BRICK },
    [ItemType.DOOR]: { name: 'ドア', color: '#8B4513', drops: ItemType.DOOR },
    [ItemType.LADDER]: { name: 'はしご', color: '#D2691E', drops: ItemType.LADDER },
    [ItemType.FENCE]: { name: 'フェンス', color: '#8B4513', drops: ItemType.FENCE },

    // お楽しみアイテム
    23: { name: 'なぞのカタマリ', color: '#FF1493', drops: 23 },
    24: { name: 'ふしぎなこな', color: '#9370DB', drops: 24 },
    25: { name: 'にじいろブロック', color: '#FFB6C1', drops: 25 },
    26: { name: 'にっこりブロック', color: '#FFD700', drops: 26 },
    27: { name: 'ほしブロック', color: '#4169E1', drops: 27 },
    28: { name: 'ケーキ', color: '#FFC0CB', drops: 28 },
    29: { name: 'クッキー', color: '#D2691E', drops: 29 },
    30: { name: 'ダイヤ', color: '#00CED1', drops: 30 },
    31: { name: 'まほうのつえ', color: '#9932CC', drops: 31 },
    32: { name: 'うえきばち', color: '#CD853F', drops: 32 },
    // 鉱石
    [ItemType.COAL]: { name: '石炭', color: '#2C2C2C', drops: ItemType.COAL },
    [ItemType.IRON_ORE]: { name: '鉄鉱石', color: '#B87333', drops: ItemType.IRON_ORE },
    [ItemType.GOLD_ORE]: { name: '金鉱石', color: '#FFD700', drops: ItemType.GOLD_ORE },
    [ItemType.EMERALD]: { name: 'エメラルド', color: '#50C878', drops: ItemType.EMERALD },
    // 武器
    [ItemType.WOODEN_SWORD]: { name: '木の剣', color: '#8B4513', drops: ItemType.WOODEN_SWORD },
    [ItemType.STONE_SWORD]: { name: '石の剣', color: '#808080', drops: ItemType.STONE_SWORD },
    [ItemType.IRON_SWORD]: { name: '鉄の剣', color: '#C0C0C0', drops: ItemType.IRON_SWORD },
    [ItemType.GOLD_SWORD]: { name: '金の剣', color: '#FFD700', drops: ItemType.GOLD_SWORD },
    [ItemType.DIAMOND_SWORD]: { name: 'ダイヤの剣', color: '#00CED1', drops: ItemType.DIAMOND_SWORD },
    // 防具
    [ItemType.LEATHER_HELMET]: { name: '革の帽子', color: '#8B4513', drops: ItemType.LEATHER_HELMET },
    [ItemType.LEATHER_CHESTPLATE]: { name: '革の服', color: '#8B4513', drops: ItemType.LEATHER_CHESTPLATE },
    [ItemType.LEATHER_LEGGINGS]: { name: '革のズボン', color: '#8B4513', drops: ItemType.LEATHER_LEGGINGS },
    [ItemType.LEATHER_BOOTS]: { name: '革のくつ', color: '#8B4513', drops: ItemType.LEATHER_BOOTS },
    [ItemType.IRON_HELMET]: { name: '鉄のかぶと', color: '#C0C0C0', drops: ItemType.IRON_HELMET },
    [ItemType.IRON_CHESTPLATE]: { name: '鉄のよろい', color: '#C0C0C0', drops: ItemType.IRON_CHESTPLATE },
    [ItemType.IRON_LEGGINGS]: { name: '鉄のズボン', color: '#C0C0C0', drops: ItemType.IRON_LEGGINGS },
    [ItemType.IRON_BOOTS]: { name: '鉄のくつ', color: '#C0C0C0', drops: ItemType.IRON_BOOTS },
    // その他
    [ItemType.BOW]: { name: '弓', color: '#8B4513', drops: ItemType.BOW },
    [ItemType.ARROW]: { name: '矢', color: '#D2691E', drops: ItemType.ARROW },
    [ItemType.STRING]: { name: '糸', color: '#F5F5DC', drops: ItemType.STRING },
    [ItemType.LEATHER]: { name: '革', color: '#8B4513', drops: ItemType.LEATHER },
    [ItemType.IRON_INGOT]: { name: '鉄インゴット', color: '#C0C0C0', drops: ItemType.IRON_INGOT },
    [ItemType.GOLD_INGOT]: { name: '金インゴット', color: '#FFD700', drops: ItemType.GOLD_INGOT }
};

// クラフトレシピ
class CraftingRecipes {
    constructor() {
        this.recipes = [];
        this.initializeRecipes();
    }

    initializeRecipes() {
        // 手持ちクラフト（2x2）レシピ

        // 原木 → 木材×4
        this.addRecipe({
            pattern: [
                [ItemType.WOOD, null],
                [null, null]
            ],
            result: { item: ItemType.PLANKS, count: 4 },
            type: 'hand'
        });

        // 木材 → 棒×4
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, null],
                [ItemType.PLANKS, null]
            ],
            result: { item: ItemType.STICK, count: 4 },
            type: 'hand'
        });

        // 木材×4 → 作業台
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.PLANKS],
                [ItemType.PLANKS, ItemType.PLANKS]
            ],
            result: { item: ItemType.CRAFTING_TABLE, count: 1 },
            type: 'hand'
        });

        // 作業台クラフト（3x3）レシピ

        // 木のツルハシ
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.PLANKS, ItemType.PLANKS],
                [null, ItemType.STICK, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.WOODEN_PICKAXE, count: 1 },
            type: 'table'
        });

        // 石のツルハシ
        this.addRecipe({
            pattern: [
                [ItemType.COBBLESTONE, ItemType.COBBLESTONE, ItemType.COBBLESTONE],
                [null, ItemType.STICK, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.STONE_PICKAXE, count: 1 },
            type: 'table'
        });

        // 木のオノ
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.PLANKS, null],
                [ItemType.PLANKS, ItemType.STICK, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.WOODEN_AXE, count: 1 },
            type: 'table'
        });

        // 石のオノ
        this.addRecipe({
            pattern: [
                [ItemType.COBBLESTONE, ItemType.COBBLESTONE, null],
                [ItemType.COBBLESTONE, ItemType.STICK, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.STONE_AXE, count: 1 },
            type: 'table'
        });

        // 追加レシピ

        // かまど
        this.addRecipe({
            pattern: [
                [ItemType.COBBLESTONE, ItemType.COBBLESTONE, ItemType.COBBLESTONE],
                [ItemType.COBBLESTONE, null, ItemType.COBBLESTONE],
                [ItemType.COBBLESTONE, ItemType.COBBLESTONE, ItemType.COBBLESTONE]
            ],
            result: { item: ItemType.FURNACE, count: 1 },
            type: 'table'
        });

        // チェスト
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.PLANKS, ItemType.PLANKS],
                [ItemType.PLANKS, null, ItemType.PLANKS],
                [ItemType.PLANKS, ItemType.PLANKS, ItemType.PLANKS]
            ],
            result: { item: ItemType.CHEST, count: 1 },
            type: 'table'
        });

        // たいまつ（手持ちクラフト可能）
        this.addRecipe({
            pattern: [
                [ItemType.STICK, null],
                [null, null]
            ],
            result: { item: ItemType.TORCH, count: 4 },
            type: 'hand'
        });

        // ドア
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.PLANKS, null],
                [ItemType.PLANKS, ItemType.PLANKS, null],
                [ItemType.PLANKS, ItemType.PLANKS, null]
            ],
            result: { item: ItemType.DOOR, count: 3 },
            type: 'table'
        });

        // はしご
        this.addRecipe({
            pattern: [
                [ItemType.STICK, null, ItemType.STICK],
                [ItemType.STICK, ItemType.STICK, ItemType.STICK],
                [ItemType.STICK, null, ItemType.STICK]
            ],
            result: { item: ItemType.LADDER, count: 3 },
            type: 'table'
        });

        // フェンス
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.STICK, ItemType.PLANKS],
                [ItemType.PLANKS, ItemType.STICK, ItemType.PLANKS],
                [null, null, null]
            ],
            result: { item: ItemType.FENCE, count: 3 },
            type: 'table'
        });

        // ガラス（仮レシピ - 本来は砂を精錬）
        this.addRecipe({
            pattern: [
                [ItemType.SAND, ItemType.SAND, null],
                [ItemType.SAND, ItemType.SAND, null],
                [null, null, null]
            ],
            result: { item: ItemType.GLASS, count: 1 },
            type: 'table'
        });

        // お楽しみ隠しレシピ

        // ケーキ = 土 + 草 + 花
        this.addRecipe({
            pattern: [
                [ItemType.DIRT, ItemType.LEAVES, null],
                [ItemType.GRASS, null, null],
                [null, null, null]
            ],
            result: { item: 28, count: 1 }, // ケーキ
            type: 'table'
        });

        // クッキー = 木材 + 砂
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, ItemType.SAND, null],
                [null, null, null],
                [null, null, null]
            ],
            result: { item: 29, count: 8 }, // クッキー
            type: 'table'
        });

        // ダイヤ = ガラス×4
        this.addRecipe({
            pattern: [
                [ItemType.GLASS, ItemType.GLASS, null],
                [ItemType.GLASS, ItemType.GLASS, null],
                [null, null, null]
            ],
            result: { item: 30, count: 1 }, // ダイヤ
            type: 'table'
        });

        // にじいろブロック = 土+石+砂+草
        this.addRecipe({
            pattern: [
                [ItemType.DIRT, ItemType.STONE, null],
                [ItemType.SAND, ItemType.GRASS, null],
                [null, null, null]
            ],
            result: { item: 25, count: 1 }, // にじいろブロック
            type: 'table'
        });

        // にっこりブロック = 木材×2
        this.addRecipe({
            pattern: [
                [ItemType.PLANKS, null],
                [ItemType.PLANKS, null]
            ],
            result: { item: 26, count: 1 }, // にっこりブロック
            type: 'hand'
        });

        // ほしブロック = 石×4（作業台）
        this.addRecipe({
            pattern: [
                [null, ItemType.STONE, null],
                [ItemType.STONE, null, ItemType.STONE],
                [null, ItemType.STONE, null]
            ],
            result: { item: 27, count: 1 }, // ほしブロック
            type: 'table'
        });

        // まほうのつえ = ダイヤ + 棒×2
        this.addRecipe({
            pattern: [
                [null, null, 30], // ダイヤ
                [null, ItemType.STICK, null],
                [ItemType.STICK, null, null]
            ],
            result: { item: 31, count: 1 }, // まほうのつえ
            type: 'table'
        });

        // うえきばち = 土×3
        this.addRecipe({
            pattern: [
                [ItemType.DIRT, null, ItemType.DIRT],
                [null, ItemType.DIRT, null],
                [null, null, null]
            ],
            result: { item: 32, count: 1 }, // うえきばち
            type: 'table'
        });

        // なぞのカタマリ×4 = にじいろブロック
        this.addRecipe({
            pattern: [
                [23, 23, null],
                [23, 23, null],
                [null, null, null]
            ],
            result: { item: 25, count: 1 }, // にじいろブロック
            type: 'table'
        });

        // 武器レシピ

        // 木の剣
        this.addRecipe({
            pattern: [
                [null, ItemType.PLANKS, null],
                [null, ItemType.PLANKS, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.WOODEN_SWORD, count: 1 },
            type: 'table'
        });

        // 石の剣
        this.addRecipe({
            pattern: [
                [null, ItemType.COBBLESTONE, null],
                [null, ItemType.COBBLESTONE, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.STONE_SWORD, count: 1 },
            type: 'table'
        });

        // 鉄の剣（鉄インゴットが必要）
        this.addRecipe({
            pattern: [
                [null, ItemType.IRON_INGOT, null],
                [null, ItemType.IRON_INGOT, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.IRON_SWORD, count: 1 },
            type: 'table'
        });

        // 金の剣
        this.addRecipe({
            pattern: [
                [null, ItemType.GOLD_INGOT, null],
                [null, ItemType.GOLD_INGOT, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.GOLD_SWORD, count: 1 },
            type: 'table'
        });

        // ダイヤの剣
        this.addRecipe({
            pattern: [
                [null, 30, null], // ダイヤ
                [null, 30, null],
                [null, ItemType.STICK, null]
            ],
            result: { item: ItemType.DIAMOND_SWORD, count: 1 },
            type: 'table'
        });

        // 弓
        this.addRecipe({
            pattern: [
                [null, ItemType.STICK, ItemType.STRING],
                [ItemType.STICK, null, ItemType.STRING],
                [null, ItemType.STICK, ItemType.STRING]
            ],
            result: { item: ItemType.BOW, count: 1 },
            type: 'table'
        });

        // 矢
        this.addRecipe({
            pattern: [
                [null, ItemType.STICK, null],
                [null, ItemType.STICK, null],
                [null, ItemType.LEAVES, null]
            ],
            result: { item: ItemType.ARROW, count: 4 },
            type: 'table'
        });

        // 精錬レシピ（簡易版）

        // 鉄鉱石→鉄インゴット（かまどで精錬の代わり）
        this.addRecipe({
            pattern: [
                [ItemType.IRON_ORE, ItemType.COAL, null],
                [null, null, null],
                [null, null, null]
            ],
            result: { item: ItemType.IRON_INGOT, count: 1 },
            type: 'table'
        });

        // 金鉱石→金インゴット
        this.addRecipe({
            pattern: [
                [ItemType.GOLD_ORE, ItemType.COAL, null],
                [null, null, null],
                [null, null, null]
            ],
            result: { item: ItemType.GOLD_INGOT, count: 1 },
            type: 'table'
        });

        // 糸（簡易レシピ）
        this.addRecipe({
            pattern: [
                [ItemType.LEAVES, ItemType.LEAVES, null],
                [ItemType.LEAVES, ItemType.LEAVES, null],
                [null, null, null]
            ],
            result: { item: ItemType.STRING, count: 2 },
            type: 'table'
        });

        // 革（簡易レシピ）
        this.addRecipe({
            pattern: [
                [ItemType.DIRT, ItemType.DIRT, null],
                [ItemType.DIRT, ItemType.DIRT, null],
                [null, null, null]
            ],
            result: { item: ItemType.LEATHER, count: 1 },
            type: 'table'
        });

        // 防具レシピ（革のみ実装）

        // 革の帽子
        this.addRecipe({
            pattern: [
                [ItemType.LEATHER, ItemType.LEATHER, ItemType.LEATHER],
                [ItemType.LEATHER, null, ItemType.LEATHER],
                [null, null, null]
            ],
            result: { item: ItemType.LEATHER_HELMET, count: 1 },
            type: 'table'
        });

        // 革の服
        this.addRecipe({
            pattern: [
                [ItemType.LEATHER, null, ItemType.LEATHER],
                [ItemType.LEATHER, ItemType.LEATHER, ItemType.LEATHER],
                [ItemType.LEATHER, ItemType.LEATHER, ItemType.LEATHER]
            ],
            result: { item: ItemType.LEATHER_CHESTPLATE, count: 1 },
            type: 'table'
        });

        // 革のズボン
        this.addRecipe({
            pattern: [
                [ItemType.LEATHER, ItemType.LEATHER, ItemType.LEATHER],
                [ItemType.LEATHER, null, ItemType.LEATHER],
                [ItemType.LEATHER, null, ItemType.LEATHER]
            ],
            result: { item: ItemType.LEATHER_LEGGINGS, count: 1 },
            type: 'table'
        });

        // 革のくつ
        this.addRecipe({
            pattern: [
                [null, null, null],
                [ItemType.LEATHER, null, ItemType.LEATHER],
                [ItemType.LEATHER, null, ItemType.LEATHER]
            ],
            result: { item: ItemType.LEATHER_BOOTS, count: 1 },
            type: 'table'
        });
    }

    addRecipe(recipe) {
        this.recipes.push(recipe);
    }

    findRecipe(pattern, craftType) {
        for (let recipe of this.recipes) {
            // クラフトタイプが合わない場合はスキップ
            if (craftType === 'hand' && recipe.type === 'table') continue;

            if (this.matchesPattern(pattern, recipe.pattern)) {
                return recipe.result;
            }
        }

        // レシピが見つからない場合、失敗作を生成
        if (this.hasAnyItems(pattern)) {
            return this.generateFailureItem(pattern);
        }

        return null;
    }

    hasAnyItems(pattern) {
        for (let row of pattern) {
            if (row) {
                for (let item of row) {
                    if (item !== null && item !== undefined) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    generateFailureItem(pattern) {
        // アイテムの組み合わせによって失敗作を決める
        let itemCount = 0;
        let hasStone = false;
        let hasWood = false;
        let hasDirt = false;

        for (let row of pattern) {
            if (row) {
                for (let item of row) {
                    if (item !== null && item !== undefined) {
                        itemCount++;
                        if (item === ItemType.STONE || item === ItemType.COBBLESTONE) hasStone = true;
                        if (item === ItemType.WOOD || item === ItemType.PLANKS) hasWood = true;
                        if (item === ItemType.DIRT || item === ItemType.GRASS) hasDirt = true;
                    }
                }
            }
        }

        // 失敗作の種類を決定
        if (itemCount === 1) {
            // アイテム1個だけの場合は「ふしぎなこな」
            return { item: 24, count: 1 };
        } else if (hasStone && hasWood) {
            // 石と木の組み合わせ
            return { item: 23, count: 1 }; // なぞのカタマリ
        } else if (itemCount >= 4) {
            // たくさんのアイテム
            return { item: 23, count: 2 }; // なぞのカタマリ×2
        } else {
            // その他
            return { item: 24, count: itemCount }; // ふしぎなこな
        }
    }

    matchesPattern(input, recipe) {
        // 入力パターンのサイズ
        const inputSize = input.length;
        const recipeSize = recipe.length;

        // 手持ちクラフト（2x2）の場合
        if (inputSize === 2 && recipeSize === 2) {
            for (let y = 0; y < 2; y++) {
                for (let x = 0; x < 2; x++) {
                    const inputItem = input[y] ? input[y][x] : null;
                    const recipeItem = recipe[y] ? recipe[y][x] : null;
                    if (inputItem !== recipeItem) {
                        return false;
                    }
                }
            }
            return true;
        }

        // 作業台クラフト（3x3）の場合
        if (inputSize === 3 && recipeSize === 3) {
            // すべての配置をチェック
            for (let offsetY = 0; offsetY <= 3 - recipeSize; offsetY++) {
                for (let offsetX = 0; offsetX <= 3 - recipeSize; offsetX++) {
                    if (this.matchesAtPosition(input, recipe, offsetX, offsetY)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    matchesAtPosition(input, recipe, offsetX, offsetY) {
        // 3x3グリッド全体をチェック
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const inputItem = input[y] ? input[y][x] : null;

                // レシピの対応する位置
                const recipeY = y - offsetY;
                const recipeX = x - offsetX;

                let recipeItem = null;
                if (recipeY >= 0 && recipeY < recipe.length &&
                    recipeX >= 0 && recipeX < recipe[0].length) {
                    recipeItem = recipe[recipeY][recipeX];
                }

                if (inputItem !== recipeItem) {
                    return false;
                }
            }
        }
        return true;
    }
}

// クラフトUIクラス
class CraftingUI {
    constructor() {
        this.isOpen = false;
        this.craftType = 'hand'; // 'hand' または 'table'
        this.gridSize = 2;
        this.craftingGrid = [];
        this.recipes = new CraftingRecipes();
        this.currentResult = null;

        this.initializeGrid();
        this.setupEventListeners();
    }

    initializeGrid() {
        // グリッドの初期化
        for (let i = 0; i < 9; i++) {
            this.craftingGrid[i] = null;
        }
    }

    setupEventListeners() {
        // クラフトボタン
        document.getElementById('craftBtn').addEventListener('click', () => {
            this.toggle();
        });

        // 閉じるボタン
        document.getElementById('closeBtn').addEventListener('click', () => {
            this.close();
        });

        // クリアボタン
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearGrid();
        });

        // クラフトスロット
        const slots = document.querySelectorAll('.craft-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                this.onSlotClick(parseInt(e.target.dataset.index));
            });
        });

        // 結果スロット
        document.getElementById('craftResult').addEventListener('click', () => {
            this.takeCraftResult();
        });

        // Eキーでもクラフトメニューを開く
        window.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                this.toggle();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open(type = 'hand') {
        this.isOpen = true;
        this.craftType = type;
        this.gridSize = type === 'table' ? 3 : 2;

        const ui = document.getElementById('craftUI');
        const grid = document.getElementById('craftGrid');
        const title = document.querySelector('.craft-title');

        ui.classList.add('active');

        // グリッドサイズの変更
        if (type === 'table') {
            grid.className = 'craft-grid craft-grid-3x3';
            title.textContent = '作業台クラフト';

            // 3x3グリッドを作成
            grid.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const slot = document.createElement('div');
                slot.className = 'craft-slot';
                slot.dataset.index = i;
                slot.addEventListener('click', (e) => {
                    this.onSlotClick(parseInt(e.target.dataset.index));
                });
                grid.appendChild(slot);
            }
        } else {
            grid.className = 'craft-grid craft-grid-2x2';
            title.textContent = '手持ちクラフト';

            // 2x2グリッドを維持
            grid.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const slot = document.createElement('div');
                slot.className = 'craft-slot';
                slot.dataset.index = i;
                slot.addEventListener('click', (e) => {
                    this.onSlotClick(parseInt(e.target.dataset.index));
                });
                grid.appendChild(slot);
            }
        }

        this.updateDisplay();
    }

    close() {
        this.isOpen = false;
        document.getElementById('craftUI').classList.remove('active');

        // アイテムを返却
        this.returnItemsToInventory();
    }

    onSlotClick(index) {
        if (!window.inventory) return;

        const maxIndex = this.gridSize * this.gridSize - 1;
        if (index > maxIndex) return;

        if (this.craftingGrid[index]) {
            // スロットからアイテムを取り出す
            const item = this.craftingGrid[index];
            window.inventory.addItem(item);
            this.craftingGrid[index] = null;
        } else {
            // インベントリから選択中のアイテムを置く
            const selectedItem = window.inventory.getSelectedItem();
            if (selectedItem && window.inventory.useSelectedItem()) {
                this.craftingGrid[index] = selectedItem;
            }
        }

        this.updateDisplay();
        this.checkRecipe();
    }

    clearGrid() {
        // すべてのアイテムをインベントリに返す
        this.returnItemsToInventory();
        this.updateDisplay();
        this.checkRecipe();
    }

    returnItemsToInventory() {
        if (!window.inventory) return;

        for (let i = 0; i < this.craftingGrid.length; i++) {
            if (this.craftingGrid[i]) {
                window.inventory.addItem(this.craftingGrid[i]);
                this.craftingGrid[i] = null;
            }
        }
    }

    checkRecipe() {
        // 現在のグリッドをパターンに変換
        const pattern = this.getPattern();

        // レシピを検索
        this.currentResult = this.recipes.findRecipe(pattern, this.craftType);

        // 結果を表示
        this.updateResultDisplay();
    }

    getPattern() {
        if (this.gridSize === 2) {
            return [
                [this.craftingGrid[0], this.craftingGrid[1]],
                [this.craftingGrid[2], this.craftingGrid[3]]
            ];
        } else {
            return [
                [this.craftingGrid[0], this.craftingGrid[1], this.craftingGrid[2]],
                [this.craftingGrid[3], this.craftingGrid[4], this.craftingGrid[5]],
                [this.craftingGrid[6], this.craftingGrid[7], this.craftingGrid[8]]
            ];
        }
    }

    takeCraftResult() {
        if (!this.currentResult || !window.inventory) return;

        // 結果アイテムをインベントリに追加
        for (let i = 0; i < this.currentResult.count; i++) {
            if (!window.inventory.addItem(this.currentResult.item)) {
                // インベントリが満杯の場合
                alert('インベントリがいっぱいです！');
                return;
            }
        }

        // クラフトグリッドをクリア
        this.craftingGrid.fill(null);
        this.currentResult = null;

        this.updateDisplay();
        this.checkRecipe();
    }

    updateDisplay() {
        const slots = document.querySelectorAll('.craft-slot');
        const maxSlots = this.gridSize * this.gridSize;

        slots.forEach((slot, index) => {
            if (index >= maxSlots) {
                slot.style.display = 'none';
                return;
            }

            slot.style.display = 'flex';
            slot.innerHTML = '';

            const item = this.craftingGrid[index];
            if (item && itemInfo[item]) {
                slot.style.background = itemInfo[item].color;

                // アイテム名を表示
                const label = document.createElement('span');
                label.style.color = 'white';
                label.style.fontSize = '8px';
                label.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
                label.textContent = itemInfo[item].name.substring(0, 2);
                slot.appendChild(label);
            } else {
                slot.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }

    updateResultDisplay() {
        const resultSlot = document.getElementById('craftResult');
        resultSlot.innerHTML = '';

        if (this.currentResult) {
            const info = itemInfo[this.currentResult.item];
            resultSlot.style.background = info.color;

            // アイテム名
            const label = document.createElement('span');
            label.style.color = 'white';
            label.style.fontSize = '10px';
            label.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
            label.textContent = info.name.substring(0, 3);
            resultSlot.appendChild(label);

            // 個数
            if (this.currentResult.count > 1) {
                const count = document.createElement('span');
                count.className = 'item-count';
                count.textContent = this.currentResult.count;
                resultSlot.appendChild(count);
            }
        } else {
            resultSlot.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    }
}

// グローバル変数として公開
window.craftingUI = new CraftingUI();
window.ItemType = ItemType;
window.itemInfo = itemInfo;