// 简化的BGM管理器
class BGMManager {
    constructor() {
        this.audio = null;
        this.toggle = null;
        this.isPlaying = false;
    }

    // 初始化BGM
    init() {
        this.audio = document.getElementById('bgmAudio');
        this.toggle = document.getElementById('bgmToggle');
        
        if (!this.audio || !this.toggle) return;

        // 设置基本属性
        this.audio.volume = 0.3;
        this.audio.loop = true;
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 更新UI状态
        this.updateUI();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 播放/暂停按钮点击事件
        this.toggle.addEventListener('click', () => {
            this.togglePlay();
        });

        // 音频事件监听
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateUI();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateUI();
        });
    }

    // 切换播放状态
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(error => {
                console.log('音频播放失败:', error);
            });
        }
    }

    // 更新UI状态
    updateUI() {
        if (!this.toggle) return;

        if (this.isPlaying) {
            this.toggle.textContent = '🔊';
            this.toggle.title = '点击暂停背景音乐';
        } else {
            this.toggle.textContent = '🔇';
            this.toggle.title = '点击播放背景音乐';
        }
    }
}

// 全局BGM管理器实例
window.bgmManager = new BGMManager();

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.bgmManager) {
        window.bgmManager.init();
    }
});