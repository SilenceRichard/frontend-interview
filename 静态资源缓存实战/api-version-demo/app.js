// 当前前端代码的版本 - 这个值会在生产构建过程中自动注入
const FRONTEND_VERSION = "1.0.0";

// 缓存中保存的版本号
const STORAGE_VERSION_KEY = "app_version";

// DOM元素
const frontendVersionEl = document.getElementById("frontend-version");
const apiVersionEl = document.getElementById("api-version");
const versionStatusEl = document.getElementById("version-status");
const userListEl = document.getElementById("user-list");
const loadV1Btn = document.getElementById("load-v1");
const loadV2Btn = document.getElementById("load-v2");
const refreshPageBtn = document.getElementById("refresh-page");

// 初始化
(async function init() {
    // 显示前端代码版本
    frontendVersionEl.textContent = FRONTEND_VERSION;
    
    try {
        // 获取服务器端最新的版本信息
        const latestVersion = await fetchLatestVersion();
        
        // 检查版本是否匹配
        checkVersionMatch(latestVersion);
        
        // 默认加载V1版本的API数据
        await loadUserData("v1");
    } catch (error) {
        showError("初始化失败: " + error.message);
    }
})();

/**
 * 获取服务器端最新的版本信息
 */
async function fetchLatestVersion() {
    try {
        const response = await fetch("version.json?nocache=" + new Date().getTime());
        if (!response.ok) {
            throw new Error("无法获取版本信息");
        }
        return await response.json();
    } catch (error) {
        console.error("获取版本信息失败:", error);
        throw new Error("获取版本信息失败");
    }
}

/**
 * 检查前端版本与服务器版本是否匹配
 */
function checkVersionMatch(latestVersion) {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY) || FRONTEND_VERSION;
    
    // 保存最新版本到本地存储
    localStorage.setItem(STORAGE_VERSION_KEY, latestVersion.version);
    
    if (FRONTEND_VERSION !== latestVersion.version) {
        // 版本不匹配，显示提示
        versionStatusEl.textContent = "版本不匹配! 服务器版本: " + latestVersion.version;
        versionStatusEl.className = "version-mismatch";
        refreshPageBtn.classList.remove("hidden");
    } else {
        // 版本匹配
        versionStatusEl.textContent = "版本匹配";
        versionStatusEl.className = "version-match";
        refreshPageBtn.classList.add("hidden");
    }
}

/**
 * 加载用户数据 (V1或V2版本的API)
 */
async function loadUserData(version) {
    try {
        userListEl.innerHTML = '<p class="loading">加载中...</p>';
        apiVersionEl.textContent = "加载中...";
        
        // 获取用户数据
        const response = await fetch(`api/users-${version}.json?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error("加载数据失败");
        }
        
        const data = await response.json();
        apiVersionEl.textContent = data.version;
        
        // 根据V1版本的数据格式处理
        if (version === "v1") {
            renderUsersV1(data.users);
        } 
        // 尝试处理V2版本的数据，但如果前端代码版本是1.0.0，会抛出错误
        else if (version === "v2") {
            if (FRONTEND_VERSION === "1.0.0") {
                // 旧版前端代码无法正确处理新的数据结构
                renderWithError(data.users);
            } else {
                // 如果已经是新版前端代码，可以正确处理V2数据
                renderUsersV2(data.users);
            }
        }
    } catch (error) {
        showError("加载数据失败: " + error.message);
    }
}

/**
 * 渲染V1版本的用户数据
 */
function renderUsersV1(users) {
    userListEl.innerHTML = "";
    
    if (!users || users.length === 0) {
        userListEl.innerHTML = '<p>没有用户数据</p>';
        return;
    }
    
    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.className = "user-item";
        
        userItem.innerHTML = `
            <h3>${user.name}</h3>
            <div class="user-meta">
                <span>邮箱: ${user.email}</span>
                <span>注册时间: ${user.registered}</span>
            </div>
        `;
        
        userListEl.appendChild(userItem);
    });
}

/**
 * 尝试渲染V2版本数据但会失败 - 这是故意的，用来演示版本不匹配问题
 */
function renderWithError(users) {
    userListEl.innerHTML = "";
    
    // 添加错误提示
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = "前端代码版本 (1.0.0) 无法处理新的数据结构 (V2)，需要更新前端代码。";
    userListEl.appendChild(errorEl);
    
    // 尝试渲染，但会因为数据结构变化而产生问题
    users.forEach(user => {
        try {
            const userItem = document.createElement("div");
            userItem.className = "user-item";
            
            // 这里会因为V2数据结构变化而出错
            // V2中的name被拆分为firstName和lastName
            userItem.innerHTML = `
                <h3>${user.name}</h3>
                <div class="user-meta">
                    <span>邮箱: ${user.email}</span>
                    <span>注册时间: ${user.registered}</span>
                </div>
            `;
            
            userListEl.appendChild(userItem);
        } catch (error) {
            console.error("渲染错误:", error);
        }
    });
}

/**
 * 正确渲染V2版本的用户数据 (需要更新后的前端代码)
 */
function renderUsersV2(users) {
    userListEl.innerHTML = "";
    
    if (!users || users.length === 0) {
        userListEl.innerHTML = '<p>没有用户数据</p>';
        return;
    }
    
    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.className = "user-item";
        
        // V2 API 返回的用户数据格式不同
        userItem.innerHTML = `
            <h3>${user.firstName} ${user.lastName}</h3>
            <div class="user-meta">
                <span>邮箱: ${user.email}</span>
                <span>注册时间: ${formatDate(user.registeredAt)}</span>
                <span>角色: ${user.role}</span>
            </div>
        `;
        
        userListEl.appendChild(userItem);
    });
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * 显示错误信息
 */
function showError(message) {
    userListEl.innerHTML = `<div class="error-message">${message}</div>`;
}

// 事件监听
loadV1Btn.addEventListener("click", () => loadUserData("v1"));
loadV2Btn.addEventListener("click", () => loadUserData("v2"));
refreshPageBtn.addEventListener("click", () => {
    // 模拟页面刷新，获取最新代码
    location.reload();
}); 