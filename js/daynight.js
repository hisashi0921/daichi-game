// 昼夜サイクルシステム

class DayNightCycle {
    constructor() {
        // 1日 = 10分（600秒 = 600000ミリ秒）
        this.dayDuration = 600000; // 10分
        this.currentTime = 0; // 0-1の範囲（0=朝6時, 0.25=正午, 0.5=夕方6時, 0.75=深夜0時）

        // 時間帯の定義
        this.phases = {
            DAWN: { start: 0.0, end: 0.1, name: '朝' },       // 6:00 - 8:24
            MORNING: { start: 0.1, end: 0.25, name: '午前' }, // 8:24 - 12:00
            NOON: { start: 0.25, end: 0.35, name: '正午' },    // 12:00 - 14:24
            AFTERNOON: { start: 0.35, end: 0.45, name: '午後' }, // 14:24 - 16:48
            DUSK: { start: 0.45, end: 0.55, name: '夕方' },    // 16:48 - 19:12
            NIGHT: { start: 0.55, end: 0.95, name: '夜' },     // 19:12 - 4:48
            LATE_NIGHT: { start: 0.95, end: 1.0, name: '深夜' } // 4:48 - 6:00
        };

        this.lastUpdate = Date.now();
        this.isPaused = false;
    }

    update() {
        if (this.isPaused) return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // 時間を進める
        this.currentTime += deltaTime / this.dayDuration;

        // 1日が終わったらリセット
        if (this.currentTime >= 1.0) {
            this.currentTime -= 1.0;
        }
    }

    getCurrentPhase() {
        for (const phaseName in this.phases) {
            const phase = this.phases[phaseName];
            if (this.currentTime >= phase.start && this.currentTime < phase.end) {
                return phaseName;
            }
        }
        return 'DAWN';
    }

    isNight() {
        const phase = this.getCurrentPhase();
        return phase === 'NIGHT' || phase === 'LATE_NIGHT' || phase === 'DUSK';
    }

    isDay() {
        return !this.isNight();
    }

    getTimeString() {
        // 0-1を0-24時間に変換
        const hours = Math.floor(((this.currentTime + 0.25) % 1) * 24); // 0.0を6時として計算
        const minutes = Math.floor((((this.currentTime + 0.25) % 1) * 24 * 60) % 60);

        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');

        return `${hoursStr}:${minutesStr}`;
    }

    getSkyGradient(ctx, canvas) {
        const phase = this.getCurrentPhase();
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

        switch(phase) {
            case 'DAWN':
                // 朝焼け
                gradient.addColorStop(0, '#FFB366');
                gradient.addColorStop(0.5, '#FFA500');
                gradient.addColorStop(1, '#FFD4A3');
                break;

            case 'MORNING':
            case 'NOON':
                // 昼間の青空
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#98D8E8');
                break;

            case 'AFTERNOON':
                // 午後の空
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#B0E0E6');
                break;

            case 'DUSK':
                // 夕焼け
                gradient.addColorStop(0, '#FF8C00');
                gradient.addColorStop(0.5, '#FF6347');
                gradient.addColorStop(1, '#FF69B4');
                break;

            case 'NIGHT':
            case 'LATE_NIGHT':
                // 夜空
                gradient.addColorStop(0, '#000428');
                gradient.addColorStop(0.5, '#004e92');
                gradient.addColorStop(1, '#000428');
                break;

            default:
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(1, '#98D8E8');
        }

        return gradient;
    }

    getDarkness() {
        const phase = this.getCurrentPhase();

        switch(phase) {
            case 'DAWN':
                return 0.3;
            case 'MORNING':
            case 'NOON':
            case 'AFTERNOON':
                return 0;
            case 'DUSK':
                return 0.4;
            case 'NIGHT':
                return 0.7;
            case 'LATE_NIGHT':
                return 0.8;
            default:
                return 0;
        }
    }

    drawStars(ctx, camera, canvas) {
        if (!this.isNight()) return;

        const darkness = this.getDarkness();
        if (darkness < 0.3) return;

        // 星を描画
        ctx.fillStyle = 'white';
        const starSeed = 12345; // 固定シードで星の位置を一定に

        for (let i = 0; i < 100; i++) {
            const x = (Math.sin(starSeed + i * 100) + 1) * 0.5 * canvas.width;
            const y = (Math.sin(starSeed + i * 200) + 1) * 0.5 * canvas.height * 0.6;
            const size = (Math.sin(starSeed + i * 300) + 1) * 0.5 * 2 + 1;

            ctx.globalAlpha = darkness * ((Math.sin(Date.now() / 1000 + i) + 1) * 0.3 + 0.4);
            ctx.fillRect(x, y, size, size);
        }

        // 月を描画
        if (darkness > 0.5) {
            ctx.globalAlpha = darkness;
            ctx.fillStyle = '#FFFFCC';
            ctx.beginPath();
            ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 30, 0, Math.PI * 2);
            ctx.fill();

            // 月のクレーター
            ctx.fillStyle = '#FFFF99';
            ctx.beginPath();
            ctx.arc(canvas.width * 0.8 - 5, canvas.height * 0.2 - 5, 5, 0, Math.PI * 2);
            ctx.arc(canvas.width * 0.8 + 8, canvas.height * 0.2 + 3, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1.0;
    }

    drawSun(ctx, canvas) {
        if (this.isNight()) return;

        const phase = this.getCurrentPhase();
        if (phase === 'DAWN' || phase === 'DUSK') {
            ctx.globalAlpha = 0.8;
        }

        // 太陽の位置を時間に応じて計算
        const sunProgress = (this.currentTime + 0.75) % 1; // 朝6時を起点に
        let sunX, sunY;

        if (sunProgress < 0.5) {
            // 昼間は弧を描く
            const angle = sunProgress * Math.PI;
            sunX = canvas.width * 0.1 + (canvas.width * 0.8) * sunProgress * 2;
            sunY = canvas.height * 0.5 - Math.sin(angle) * canvas.height * 0.3;
        } else {
            sunX = -100; // 夜は画面外
            sunY = -100;
        }

        if (sunX > 0 && sunY > 0) {
            // 太陽を描画
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
            ctx.fill();

            // 太陽の光線
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                ctx.beginPath();
                ctx.moveTo(
                    sunX + Math.cos(angle) * 50,
                    sunY + Math.sin(angle) * 50
                );
                ctx.lineTo(
                    sunX + Math.cos(angle) * 60,
                    sunY + Math.sin(angle) * 60
                );
                ctx.stroke();
            }
        }

        ctx.globalAlpha = 1.0;
    }

    // 時間を設定（デバッグ用）
    setTime(time) {
        this.currentTime = Math.max(0, Math.min(1, time));
    }

    // 時間を特定の時刻に設定
    setToNoon() {
        this.currentTime = 0.25;
    }

    setToMidnight() {
        this.currentTime = 0.75;
    }

    setToDawn() {
        this.currentTime = 0.0;
    }

    setToDusk() {
        this.currentTime = 0.45;
    }
}

// グローバルに公開
window.DayNightCycle = DayNightCycle;