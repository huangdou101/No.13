// 游戏存档管理器
class GameSaveManager {
    constructor() {
        this.currentUser = null;
        this.saveKey = 'gameSaveData';
        this.autoSaveInterval = 30000; // 30秒自动保存
        this.autoSaveTimer = null;
        this.lastSaveTime = 0;
        
        // 游戏章节映射
        this.chapterMap = {
            'prologue.html': { name: '序章', order: 0 },
            'part_1_1.html': { name: '第一章：苏醒', order: 1 },
            '%E8%BD%AC%E5%9C%BA1.html': { name: '转场1', order: 2 }, // URL编码后的转场1.html
            '转场1.html': { name: '转场1', order: 2 }, // 原始中文文件名
            'part_1_2.html': { name: '第二章：探索', order: 3 },
            'part_2.html': { name: '第三章：走廊', order: 4 },
            'endings.html': { name: '结局', order: 5 }
        };
    }

    // 初始化存档管理器
    init() {
        this.currentUser = localStorage.getItem('currentUser');
        if (!this.currentUser) {
            console.warn('No current user found for save system');
            return false;
        }
        
        // 启动自动保存
        this.startAutoSave();
        
        // 页面关闭时保存
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        // 页面隐藏时保存（切换标签页）
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGame();
            }
        });
        
        console.log('Game Save Manager initialized for user:', this.currentUser);
        return true;
    }

    // 启动自动保存定时器
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveGame();
        }, this.autoSaveInterval);
    }

    // 停止自动保存
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // 获取当前页面的章节信息
    getCurrentChapter() {
        const pathname = window.location.pathname;
        let filename = pathname.split('/').pop() || 'index.html';
        
        // 处理URL编码的中文文件名
        try {
            filename = decodeURIComponent(filename);
        } catch (e) {
            // 如果URL解码失败，使用原始文件名
            console.warn('Failed to decode filename:', filename);
        }
        
        // 处理特殊情况
        if (filename === 'index.html' || filename === '') {
            return { name: '主页', order: -1, filename: 'index.html' };
        }
        
        // 先尝试原始文件名，再尝试URL编码的文件名
        let chapter = this.chapterMap[filename];
        if (!chapter && filename !== encodeURIComponent(filename)) {
            chapter = this.chapterMap[encodeURIComponent(filename)];
        }
        
        if (chapter) {
            return { ...chapter, filename };
        }
        
        // 未知页面，尝试从标题获取
        const title = document.title || filename;
        return { name: title, order: 999, filename };
    }

    // 保存游戏数据
    saveGame(gameData = {}) {
        if (!this.currentUser) return false;
        
        const now = Date.now();
        
        // 防止频繁保存（1秒内只能保存一次）
        if (now - this.lastSaveTime < 1000) {
            return false;
        }
        
        try {
            // 获取所有保存数据
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            
            // 获取当前用户的存档
            if (!allSaves[this.currentUser]) {
                allSaves[this.currentUser] = {
                    createdAt: now,
                    saves: []
                };
            }
            
            const currentChapter = this.getCurrentChapter();
            
            // 构建保存数据
            const saveData = {
                timestamp: now,
                chapter: currentChapter,
                playerData: this.extractPlayerData(),
                backpackData: this.extractBackpackData(),
                gameFlags: this.extractGameFlags(),
                customData: gameData // 允许传入自定义数据
            };
            
            // 检查是否为同一章节的更新还是新章节
            const userSaves = allSaves[this.currentUser].saves;
            const existingIndex = userSaves.findIndex(save => 
                save.chapter.filename === currentChapter.filename
            );
            
            if (existingIndex >= 0) {
                // 更新现有章节存档
                userSaves[existingIndex] = saveData;
            } else {
                // 新章节存档
                userSaves.push(saveData);
                
                // 按章节顺序排序
                userSaves.sort((a, b) => a.chapter.order - b.chapter.order);
                
                // 限制保存数量（最多保留20个存档点）
                if (userSaves.length > 20) {
                    userSaves.splice(0, userSaves.length - 20);
                }
            }
            
            // 更新最后保存时间
            allSaves[this.currentUser].lastSaved = now;
            allSaves[this.currentUser].currentChapter = currentChapter;
            
            // 保存到localStorage
            localStorage.setItem(this.saveKey, JSON.stringify(allSaves));
            
            this.lastSaveTime = now;
            
            // 显示保存提示
            this.showSaveNotification();
            
            console.log('Game saved:', saveData);
            return true;
            
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    // 加载游戏数据
    loadGame(username = null) {
        const targetUser = username || this.currentUser;
        if (!targetUser) return null;
        
        try {
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            const userSaves = allSaves[targetUser];
            
            if (!userSaves || !userSaves.saves.length) {
                return null;
            }
            
            // 返回最新的存档
            const latestSave = userSaves.saves[userSaves.saves.length - 1];
            console.log('Game loaded:', latestSave);
            
            return latestSave;
            
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    // 获取用户所有存档
    getAllSaves(username = null) {
        const targetUser = username || this.currentUser;
        if (!targetUser) return [];
        
        try {
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            const userSaves = allSaves[targetUser];
            
            return userSaves ? userSaves.saves : [];
            
        } catch (error) {
            console.error('Failed to get saves:', error);
            return [];
        }
    }

    // 获取用户存档摘要
    getUserSaveInfo(username = null) {
        const targetUser = username || this.currentUser;
        if (!targetUser) return null;
        
        try {
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            const userSaves = allSaves[targetUser];
            
            if (!userSaves) return null;
            
            return {
                username: targetUser,
                createdAt: userSaves.createdAt,
                lastSaved: userSaves.lastSaved,
                currentChapter: userSaves.currentChapter,
                saveCount: userSaves.saves.length,
                playTime: this.calculatePlayTime(userSaves)
            };
            
        } catch (error) {
            console.error('Failed to get user save info:', error);
            return null;
        }
    }

    // 计算游戏时间
    calculatePlayTime(userSaves) {
        if (!userSaves.saves.length) return 0;
        
        const firstSave = userSaves.saves[0].timestamp;
        const lastSave = userSaves.lastSaved || userSaves.saves[userSaves.saves.length - 1].timestamp;
        
        return lastSave - firstSave;
    }

    // 提取玩家数据
    extractPlayerData() {
        // 尝试从全局变量获取玩家数据
        if (typeof player !== 'undefined') {
            return {
                x: player.x,
                y: player.y,
                direction: player.direction,
                isMoving: player.isMoving,
                currentFrame: player.walkCurrentFrame || player.standCurrentFrame || 0
            };
        }
        
        return null;
    }

    // 提取背包数据
    extractBackpackData() {
        // 尝试从全局变量获取背包数据
        if (typeof backpack !== 'undefined') {
            return {
                items: backpack.items || [],
                maxItems: backpack.maxItems || 16,
                hasNewItem: backpack.hasNewItem || false
            };
        }
        
        return { items: [], maxItems: 16, hasNewItem: false };
    }

    // 恢复背包数据
    restoreBackpackData(savedBackpackData) {
        if (!savedBackpackData) return false;
        
        try {
            // 如果全局背包变量存在，直接更新
            if (typeof backpack !== 'undefined') {
                backpack.items = savedBackpackData.items || [];
                backpack.maxItems = savedBackpackData.maxItems || 16;
                backpack.hasNewItem = savedBackpackData.hasNewItem || false;
                
                // 如果页面有更新背包UI的函数，调用它
                if (typeof updateBackpackUI === 'function') {
                    updateBackpackUI();
                }
                if (typeof updateBackpackButton === 'function') {
                    updateBackpackButton();
                }
                
                console.log('背包数据已恢复:', backpack);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('恢复背包数据失败:', error);
            return false;
        }
    }

    // 获取最新的背包数据（从之前章节继承）
    getLatestBackpackData() {
        if (!this.currentUser) return { items: [], maxItems: 16, hasNewItem: false };
        
        try {
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            const userSaves = allSaves[this.currentUser]?.saves || [];
            
            // 找到最新的有背包数据的存档
            for (let i = userSaves.length - 1; i >= 0; i--) {
                const save = userSaves[i];
                if (save.backpackData && save.backpackData.items && save.backpackData.items.length > 0) {
                    return save.backpackData;
                }
            }
            
            return { items: [], maxItems: 16, hasNewItem: false };
        } catch (error) {
            console.error('获取最新背包数据失败:', error);
            return { items: [], maxItems: 16, hasNewItem: false };
        }
    }

    // 提取游戏标志
    extractGameFlags() {
        // 从页面URL和状态提取游戏标志
        const flags = {};
        
        // 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            flags[key] = value;
        });
        
        // 检查全局游戏状态变量
        if (typeof gameFlags !== 'undefined') {
            Object.assign(flags, gameFlags);
        }
        
        return flags;
    }

    // 应用保存的数据到当前游戏
    applyLoadedData(saveData) {
        if (!saveData) return false;
        
        try {
            // 应用玩家数据
            if (saveData.playerData && typeof player !== 'undefined') {
                Object.assign(player, saveData.playerData);
            }
            
            // 应用背包数据
            if (saveData.backpackData && typeof backpack !== 'undefined') {
                Object.assign(backpack, saveData.backpackData);
                
                // 更新背包UI
                if (typeof updateBackpackUI === 'function') {
                    updateBackpackUI();
                }
                if (typeof updateBackpackButton === 'function') {
                    updateBackpackButton();
                }
            }
            
            // 应用游戏标志
            if (saveData.gameFlags) {
                if (typeof gameFlags !== 'undefined') {
                    Object.assign(gameFlags, saveData.gameFlags);
                } else {
                    window.gameFlags = saveData.gameFlags;
                }
            }
            
            console.log('Loaded data applied to game');
            return true;
            
        } catch (error) {
            console.error('Failed to apply loaded data:', error);
            return false;
        }
    }

    // 显示保存通知
    showSaveNotification() {
        // 创建保存提示元素
        let notification = document.getElementById('saveNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'saveNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                font-family: 'Courier New', monospace;
                border: 1px solid #00ff00;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = '游戏已自动保存';
        notification.style.opacity = '1';
        
        // 3秒后隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }

    // 删除用户存档
    deleteSave(username = null) {
        const targetUser = username || this.currentUser;
        if (!targetUser) return false;
        
        try {
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            delete allSaves[targetUser];
            localStorage.setItem(this.saveKey, JSON.stringify(allSaves));
            
            console.log('Save data deleted for user:', targetUser);
            return true;
            
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    // 导出存档（用于备份）
    exportSave(username = null) {
        const saveInfo = this.getUserSaveInfo(username);
        const saves = this.getAllSaves(username);
        
        if (!saveInfo) return null;
        
        const exportData = {
            saveInfo,
            saves,
            exportedAt: Date.now(),
            version: '1.0'
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // 导入存档
    importSave(exportDataString) {
        try {
            const importData = JSON.parse(exportDataString);
            
            if (!importData.saveInfo || !importData.saves) {
                throw new Error('Invalid save data format');
            }
            
            const username = importData.saveInfo.username;
            const allSaves = JSON.parse(localStorage.getItem(this.saveKey) || '{}');
            
            allSaves[username] = {
                createdAt: importData.saveInfo.createdAt,
                lastSaved: importData.saveInfo.lastSaved,
                currentChapter: importData.saveInfo.currentChapter,
                saves: importData.saves
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(allSaves));
            
            console.log('Save data imported for user:', username);
            return true;
            
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }

    // 清理所有存档（慎用）
    clearAllSaves() {
        localStorage.removeItem(this.saveKey);
        console.log('All save data cleared');
    }
}

// 全局存档管理器实例
window.gameSaveManager = new GameSaveManager();

// DOM加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.gameSaveManager) {
        const initialized = window.gameSaveManager.init();
        
        // 如果初始化成功，尝试加载并应用存档数据
        if (initialized) {
            const saveData = window.gameSaveManager.loadGame();
            if (saveData) {
                // 延迟一点应用数据，确保游戏初始化完成
                setTimeout(() => {
                    window.gameSaveManager.applyLoadedData(saveData);
                }, 1000);
            }
        }
    }
});

// 工具函数：初始化背包数据（跨页面一致性）
function initializeBackpackWithSavedData() {
    if (window.gameSaveManager && window.gameSaveManager.currentUser) {
        const latestBackpackData = window.gameSaveManager.getLatestBackpackData();
        
        console.log('尝试恢复背包数据:', latestBackpackData);
        
        // 如果有已保存的背包数据，恢复它
        if (latestBackpackData && latestBackpackData.items && latestBackpackData.items.length > 0) {
            if (typeof backpack !== 'undefined') {
                backpack.items = [...latestBackpackData.items]; // 使用展开操作符确保深拷贝
                backpack.maxItems = latestBackpackData.maxItems || 16;
                backpack.hasNewItem = false; // 重新进入时不显示新物品提示
                
                console.log('成功恢复背包数据，当前背包物品数量:', backpack.items.length);
                console.log('背包详细内容:', backpack);
                
                // 更新UI
                if (typeof updateBackpackUI === 'function') {
                    updateBackpackUI();
                }
                if (typeof updateBackpackButton === 'function') {
                    updateBackpackButton();
                }
                
                return true;
            } else {
                console.warn('背包全局变量未定义，无法恢复数据');
            }
        } else {
            console.log('没有找到可恢复的背包数据');
        }
    } else {
        console.log('游戏存档管理器未初始化或用户未登录');
    }
    return false;
}

// 工具函数：手动触发保存
function saveGameNow(customData = {}) {
    if (window.gameSaveManager) {
        // 在保存前检查背包数据
        if (typeof backpack !== 'undefined') {
            console.log('保存前背包状态:', {
                itemCount: backpack.items.length,
                items: backpack.items
            });
        }
        
        const result = window.gameSaveManager.saveGame(customData);
        
        if (result) {
            console.log('游戏数据保存成功');
        } else {
            console.warn('游戏数据保存失败');
        }
        
        return result;
    } else {
        console.error('游戏存档管理器未初始化');
        return false;
    }
}

// 工具函数：获取当前用户存档信息
function getUserGameInfo() {
    if (window.gameSaveManager) {
        return window.gameSaveManager.getUserSaveInfo();
    }
    return null;
}