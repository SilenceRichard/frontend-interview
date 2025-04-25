
### ✅ 演示 1：使用 **Vercel** 部署并验证缓存效果（适合 Next.js / Vite 项目）

**目标：** 部署一个带有内容哈希的静态站点，观察 JS/CSS 的强缓存与 HTML 的协商缓存效果。

#### 步骤如下：

1. **准备项目：**
    
    - 创建一个简单的Next.js 项目。
        
    - 确保构建时使用内容哈希（Next.js 内置支持）。
        
2. **打包构建：**
    
    ```bash
    npm run build
    ```
    
3. **部署到 Vercel：**
    
    - 登录 [vercel.com](https://vercel.com/)
        
    - 绑定 GitHub 仓库并自动部署（推荐）
        
    - 或使用 CLI：
        
        ```bash
        npm i -g vercel
        vercel
        ```
        
4. **验证缓存策略：**
    
    - 打开浏览器 → 开发者工具 → Network 面板
        
    - 刷新页面，观察：
        
        - `index.html` 的 `Cache-Control` 应该是 `no-cache`
            
        - `.js` / `.css` 文件应该是 `max-age=31536000, immutable`
            
        - 尝试修改一个组件并重新部署，查看是否生成了不同哈希的文件，旧的缓存是否被自动绕过
            
5. **Vercel 自定义缓存头（可选）：** 在 `vercel.json` 中配置：
    
    ```json
    {
      "headers": [
        {
          "source": "/_next/static/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "/(.*).html",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache"
            }
          ]
        }
      ]
    }
    ```
    

---

### ✅ 演示 2：使用 **Cloudflare Pages + Workers** 验证缓存策略（适合纯静态站点）

**目标：** 用 Cloudflare Pages 托管静态网站，并使用 Headers 自定义缓存行为。

#### 步骤如下：

1. **准备静态文件夹：**
    
    ```bash
    npm create vite@latest my-cache-demo
    cd my-cache-demo
    npm install && npm run build
    ```
    
2. **部署到 Cloudflare Pages：**
    
    - 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
        
    - 连接 GitHub 仓库或上传打包后的 `dist` 目录
        
    - 选择 `dist` 为构建输出路径
        
3. **添加 `_headers` 文件（位于 `public/` 或 `dist/` 根目录）：**
    
    ```txt
    /*.html
      Cache-Control: no-cache
    
    /assets/*
      Cache-Control: public, max-age=31536000, immutable
    ```
    
4. **访问已部署页面：**
    
    - 打开 DevTools，刷新页面
        
    - 观察 HTML 与静态资源是否应用了预期的缓存策略
        
5. **（可选）进阶玩法：加 Cloudflare Workers 配灰度发布策略。**
    

### ✅ 演示 3：**Service Worker 缓存导致页面无法更新**

>演示方式：本地或 GitHub Pages/Vercel 上部署两个版本的小网页，配合 DevTools 演示更新失败与更新修复。

### 🧱 Step 1：准备两个版本页面 + 一个有 SW 的简易项目

我们创建一个带 SW 的小项目，页面只显示一段文字，比如：

#### `index.html` - 初始版本：

```html
<h1>Hello from Version 1</h1>
<script>
  navigator.serviceWorker.register('/sw.js');
</script>

```

#### `sw.js`（错误示范，没用 skipWaiting 和 claim）：
```js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('demo-cache-v1').then(cache => {
      return cache.addAll(['/index.html']);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

```

---

### 🧪 Step 2：部署并访问页面，打开 DevTools

- 打开 DevTools 的 Application 面板
    
- 查看 Service Worker 状态
    
- 查看 Cache Storage 是否缓存了 `index.html`
    
- 刷新页面，确认页面加载的是 `"Version 1"`
    

---

### 🧪 Step 3：**发布 Version 2 但不更新 SW 缓存版本号**

```html
<h1>Hello from Version 2</h1>
```

**关键点：我们不修改 `sw.js` 文件内容**，导致浏览器不会重新安装 SW。

部署到同一个地址，用户访问后：

> 页面仍然显示的是 **Version 1**！

即使按下 DevTools 的 “Clear Site Data”、刷新、或清空缓存，**页面内容仍然无法更新**。

---

### 🧠 解释：

这是因为旧的 `sw.js` 仍然生效，并从缓存中返回了旧的 `index.html`，即使服务端已经更新了内容。

---

### ✅ Step 4：修复方法演示

我们修改 `sw.js`，引入正确的更新流程：
```js
self.addEventListener('install', event => {
  self.skipWaiting(); // 🚀 立即激活
  event.waitUntil(
    caches.open('demo-cache-v2').then(cache => {
      return cache.addAll(['/index.html']);
    })
  );
});

self.addEventListener('activate', event => {
  clients.claim(); // 🚀 控制所有页面
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

```

> 同时更新缓存版本为 `demo-cache-v2`

---

### 💡 Bonus：加入一个提示组件

在前端加入一段检测版本的小逻辑：

```js
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    alert('新版本已就绪，请刷新页面！');
  });
}

```