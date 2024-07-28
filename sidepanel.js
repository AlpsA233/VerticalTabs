// 获取并显示所有标签页
function displayTabs() {
    chrome.tabs.query({}, function(tabs) {
        const tabList = document.getElementById('tabList');
        tabList.innerHTML = '';
        
        tabs.forEach(function(tab) {
            const li = document.createElement('li');
            li.textContent = tab.title;
            li.title = tab.url;
            
            li.addEventListener('click', function() {
                chrome.tabs.update(tab.id, {active: true});
                updateUrlBar(tab.url);
            });
            
            tabList.appendChild(li);
        });
    });
}

// 更新URL栏
function updateUrlBar(url) {
    document.getElementById('urlInput').value = url;
}

// 获取并显示书签
function displayBookmarks() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        const bookmarkList = document.getElementById('bookmarkList');
        bookmarkList.innerHTML = '';
        
        function traverseBookmarks(bookmarkNode) {
            if (bookmarkNode.url) {
                const li = document.createElement('li');
                li.textContent = bookmarkNode.title;
                li.addEventListener('click', function() {
                    chrome.tabs.create({ url: bookmarkNode.url });
                });
                bookmarkList.appendChild(li);
            }
            if (bookmarkNode.children) {
                bookmarkNode.children.forEach(traverseBookmarks);
            }
        }
        
        bookmarkTreeNodes.forEach(traverseBookmarks);
    });
}

// 设置导航控件
document.getElementById('backBtn').addEventListener('click', function() {
    chrome.tabs.goBack();
});

document.getElementById('forwardBtn').addEventListener('click', function() {
    chrome.tabs.goForward();
});

document.getElementById('refreshBtn').addEventListener('click', function() {
    chrome.tabs.reload();
});

document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        chrome.tabs.update({ url: this.value });
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    displayTabs();
    displayBookmarks();
    
    // 获取当前活动标签页的URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            updateUrlBar(tabs[0].url);
        }
    });
});

// 监听标签页更新、创建和关闭事件
chrome.tabs.onUpdated.addListener(displayTabs);
chrome.tabs.onCreated.addListener(displayTabs);
chrome.tabs.onRemoved.addListener(displayTabs);
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        updateUrlBar(tab.url);
    });
});