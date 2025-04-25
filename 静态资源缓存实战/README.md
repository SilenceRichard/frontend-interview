# 静态资源缓存实战

静态资源缓存策略演示项目

## 三个演示项目

1. **Vercel Next.js 缓存演示** (`demo-1-vercel`)
   - 基于 Next.js 的内容哈希与缓存策略
   - HTML 使用协商缓存，JS/CSS 使用强缓存

2. **Cloudflare Pages 缓存演示** (`demo-2-cloudflare`)
   - 基于 Vite 的静态资源缓存配置
   - 自定义 `_headers` 设置缓存策略

3. **Service Worker 缓存演示** (`demo-3-service-worker`)
   - `v1`: 有缓存更新问题的实现
   - `v2`: 正确的缓存与更新策略

每个文件夹都有详细的说明文档，请参阅各自的 README.md 文件。 