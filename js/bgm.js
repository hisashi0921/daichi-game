// BGMシステム
class BGMManager {
    constructor() {
        this.isPlaying = false;
        this.volume = 0.3;
        this.currentBGM = null;
        this.audioContext = null;
        this.oscillators = [];
        this.gainNode = null;

        // BGMの状態を保存
        this.loadSettings();

        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;
        } catch(e) {
            console.log('Web Audio APIがサポートされていません');
        }
    }

    // シンプルな環境音を生成
    playDayBGM() {
        if (!this.audioContext) return;
        this.stopBGM();

        // 昼は鳥の鳴き声風の音
        this.playAmbientSound(800, 1200, 'day');
    }

    playNightBGM() {
        if (!this.audioContext) return;
        this.stopBGM();

        // 夜はコオロギの音風
        this.playAmbientSound(400, 450, 'night');
    }

    playAmbientSound(minFreq, maxFreq, type) {
        const playChirp = () => {
            if (!this.isPlaying || this.currentBGM !== type) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.gainNode);

            // ランダムな周波数
            oscillator.frequency.value = minFreq + Math.random() * (maxFreq - minFreq);
            oscillator.type = type === 'day' ? 'sine' : 'square';

            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.02, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            oscillator.start(now);
            oscillator.stop(now + 0.1);

            // 次の音までランダムな間隔
            const interval = type === 'day' ?
                2000 + Math.random() * 3000 : // 昼は2-5秒ごと
                500 + Math.random() * 1000;   // 夜は0.5-1.5秒ごと

            setTimeout(playChirp, interval);
        };

        playChirp();
        this.currentBGM = type;
    }

    playMelody(melody, type) {
        let time = this.audioContext.currentTime;

        const playNote = (frequency, duration, startTime) => {
            if (frequency === 0) return; // 休符

            const oscillator = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();

            oscillator.connect(noteGain);
            noteGain.connect(this.gainNode);

            oscillator.frequency.value = frequency;
            oscillator.type = type === 'day' ? 'triangle' : 'sine'; // 昼は三角波、夜はサイン波

            // エンベロープ（音の立ち上がりと減衰）
            noteGain.gain.setValueAtTime(0, startTime);
            noteGain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
            noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);

            this.oscillators.push(oscillator);
        };

        // メロディーをループ再生
        const playLoop = () => {
            melody.forEach(note => {
                playNote(note.note, note.duration, time);
                time += note.duration;
            });

            // ループ
            if (this.isPlaying) {
                setTimeout(() => {
                    if (this.isPlaying && this.currentBGM === type) {
                        this.playMelody(melody, type);
                    }
                }, (time - this.audioContext.currentTime) * 1000);
            }
        };

        playLoop();
        this.currentBGM = type;
    }

    toggle() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            // 時間帯に応じてBGMを再生
            if (window.dayNightCycle && window.dayNightCycle.isNight()) {
                this.playNightBGM();
            } else {
                this.playDayBGM();
            }
        } else {
            this.stopBGM();
        }

        // ボタンのテキストを更新
        const btn = document.getElementById('bgmBtn');
        if (btn) {
            btn.textContent = this.isPlaying ? '🔇 BGM' : '🎵 BGM';
        }

        this.saveSettings();
    }

    stopBGM() {
        // 全ての音を停止
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch(e) {
                // 既に停止している場合は無視
            }
        });
        this.oscillators = [];
        this.currentBGM = null;
    }

    setVolume(value) {
        this.volume = value / 100;
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }

        // ボリューム表示を更新
        const volumeText = document.getElementById('volumeText');
        if (volumeText) {
            volumeText.textContent = value;
        }

        this.saveSettings();
    }

    // 昼夜の切り替わりをチェック
    updateBGM() {
        if (!this.isPlaying) return;

        const isNight = window.dayNightCycle && window.dayNightCycle.isNight();
        const shouldPlayNight = isNight;
        const shouldPlayDay = !isNight;

        if (shouldPlayNight && this.currentBGM !== 'night') {
            this.playNightBGM();
        } else if (shouldPlayDay && this.currentBGM !== 'day') {
            this.playDayBGM();
        }
    }

    saveSettings() {
        localStorage.setItem('bgmSettings', JSON.stringify({
            isPlaying: this.isPlaying,
            volume: this.volume * 100
        }));
    }

    loadSettings() {
        const settings = localStorage.getItem('bgmSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.volume = (parsed.volume || 30) / 100;

            // 自動再生はしない（ブラウザの制限のため）
            // ユーザーが手動で開始する必要がある
        }
    }
}

// グローバル関数
function toggleBGM() {
    if (!window.bgmManager) {
        window.bgmManager = new BGMManager();
    }
    window.bgmManager.toggle();
}

function changeBGMVolume(value) {
    if (window.bgmManager) {
        window.bgmManager.setVolume(value);
    }
}

// 初期化
window.addEventListener('load', () => {
    window.bgmManager = new BGMManager();

    // ボリューム設定を復元
    const volumeSlider = document.getElementById('bgmVolume');
    const volumeText = document.getElementById('volumeText');
    if (volumeSlider && volumeText) {
        const savedVolume = window.bgmManager.volume * 100;
        volumeSlider.value = savedVolume;
        volumeText.textContent = Math.round(savedVolume);
    }
});