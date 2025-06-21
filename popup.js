// 顔文字データベース
const emojiDatabase = {
    happy: [
        '😊', '😄', '😃', '😁', '😆', '😅', '😂', '🤣', '😉', '😋',
        '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩',
        '🥳', '😇', '🤠', '🤡', '🤪', '🤨', '🧐', '🤓', '😏', '😌'
    ],
    angry: [
        '😠', '😡', '🤬', '😤', '😾', '😿', '💀', '👿', '😈', '🤯',
        '😨', '😰', '😥', '😓', '😩', '😫', '😖', '😣', '😱', '😨',
        '😰', '😥', '😓', '😩', '😫', '😖', '😣', '😱', '😨', '😰'
    ],
    sad: [
        '😢', '😭', '😦', '😧', '😨', '😩', '🥺', '😣', '😖', '😫',
        '😞', '😔', '😟', '😕', '🙁', '☹️', '😯', '😦', '😧', '😨',
        '😩', '🥺', '😣', '😖', '😫', '😞', '😔', '😟', '😕', '🙁'
    ],
    joy: [
        '🤪', '😜', '😝', '🤨', '🧐', '🤓', '😏', '😌', '😉', '😋',
        '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩',
        '🥳', '😇', '🤠', '🤡', '🤪', '🤨', '🧐', '🤓', '😏', '😌'
    ]
};

// 現在のカテゴリ
let currentCategory = 'all';
let history = [];

// DOM要素の取得
const emojiElement = document.getElementById('emoji');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const historyList = document.getElementById('historyList');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // 履歴の読み込み
    loadHistory();
    
    // イベントリスナーの設定
    generateBtn.addEventListener('click', generateRandomEmoji);
    copyBtn.addEventListener('click', copyToClipboard);
    emojiElement.addEventListener('click', generateRandomEmoji);
    
    // カテゴリボタンのイベントリスナー
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            setCategory(category);
        });
    });
    
    // 初期顔文字の生成
    generateRandomEmoji();
});

// ランダム顔文字を生成
function generateRandomEmoji() {
    let emojiArray;
    
    if (currentCategory === 'all') {
        // すべてのカテゴリからランダムに選択
        const allEmojis = Object.values(emojiDatabase).flat();
        emojiArray = allEmojis;
    } else {
        emojiArray = emojiDatabase[currentCategory] || emojiDatabase.happy;
    }
    
    const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
    
    // アニメーション効果
    emojiElement.style.transform = 'scale(0.8)';
    setTimeout(() => {
        emojiElement.textContent = randomEmoji;
        emojiElement.style.transform = 'scale(1)';
    }, 150);
    
    // 履歴に追加
    addToHistory(randomEmoji);
}

// カテゴリを設定
function setCategory(category) {
    currentCategory = category;
    
    // ボタンのアクティブ状態を更新
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // 新しい顔文字を生成
    generateRandomEmoji();
}

// 履歴に追加
function addToHistory(emoji) {
    // 重複を避ける
    if (!history.includes(emoji)) {
        history.unshift(emoji);
        
        // 履歴を最大10個に制限
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // 履歴を保存
        saveHistory();
        
        // 履歴表示を更新
        updateHistoryDisplay();
    }
}

// 履歴表示を更新
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    history.forEach(emoji => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = emoji;
        historyItem.title = 'クリックして選択';
        
        historyItem.addEventListener('click', function() {
            emojiElement.textContent = emoji;
            emojiElement.style.transform = 'scale(0.8)';
            setTimeout(() => {
                emojiElement.style.transform = 'scale(1)';
            }, 150);
        });
        
        historyList.appendChild(historyItem);
    });
}

// クリップボードにコピー
async function copyToClipboard() {
    const emoji = emojiElement.textContent;
    
    try {
        await navigator.clipboard.writeText(emoji);
        
        // コピー成功のフィードバック
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'コピー完了！';
        copyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        }, 2000);
        
    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);
        
        // フォールバック: 古い方法
        const textArea = document.createElement('textarea');
        textArea.value = emoji;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // フィードバック
        copyBtn.textContent = 'コピー完了！';
        setTimeout(() => {
            copyBtn.textContent = 'クリップボードにコピー';
        }, 2000);
    }
}

// 履歴を保存
function saveHistory() {
    try {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ 'emojiHistory': history }, function() {
                if (chrome.runtime.lastError) {
                    console.error('履歴の保存に失敗しました:', chrome.runtime.lastError);
                } else {
                    console.log('履歴を保存しました');
                }
            });
        } else {
            // chrome.storageが利用できない場合はlocalStorageを使用
            localStorage.setItem('emojiHistory', JSON.stringify(history));
            console.log('localStorageに履歴を保存しました');
        }
    } catch (error) {
        console.error('履歴の保存に失敗しました:', error);
    }
}

// 履歴を読み込み
function loadHistory() {
    try {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['emojiHistory'], function(result) {
                if (chrome.runtime.lastError) {
                    console.error('履歴の読み込みに失敗しました:', chrome.runtime.lastError);
                    // エラーの場合はlocalStorageから読み込みを試行
                    loadFromLocalStorage();
                } else if (result.emojiHistory) {
                    history = result.emojiHistory;
                    updateHistoryDisplay();
                }
            });
        } else {
            // chrome.storageが利用できない場合はlocalStorageを使用
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('履歴の読み込みに失敗しました:', error);
        loadFromLocalStorage();
    }
}

// localStorageから履歴を読み込み
function loadFromLocalStorage() {
    try {
        const savedHistory = localStorage.getItem('emojiHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
    } catch (error) {
        console.error('localStorageからの履歴読み込みに失敗しました:', error);
    }
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        generateRandomEmoji();
    } else if (e.code === 'KeyC' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        copyToClipboard();
    }
}); 