# 接口层缓存策略教学示例

这个目录包含了用于演示不同接口缓存策略的示例代码，配合「接口层缓存实战」教程使用。

## 示例内容

本示例包含以下文件：

1. `api-service.js` - 模拟API服务，提供三种不同类型的数据接口
2. `cache-first-example.js` - Cache-First (缓存优先) 策略示例实现
3. `network-first-example.js` - Network-First (网络优先) 策略示例实现
4. `swr-example.js` - Stale-While-Revalidate (先用旧的，后台更新) 策略示例实现
5. `local-storage-cache-example.js` - 使用localStorage实现持久化缓存的示例
6. `demo.html` - 综合演示页面，可视化展示各种缓存策略效果

## 如何使用

### 1. 通过Web页面演示

最简单的方式是直接在浏览器中打开 `demo.html` 文件，它提供了一个交互式界面来演示四种不同的缓存策略：

- 点击对应区域的"获取数据"按钮，观察各种缓存策略的行为
- 通过其他按钮模拟数据过期、网络故障等情况
- 控制台输出区域会显示详细的操作日志和数据流程

### 2. 通过Node.js运行单个示例

如果你想单独运行某个示例文件来查看其行为，可以使用Node.js：

```bash
# 首先安装相关依赖（如果需要）
npm install

# 运行Cache-First示例
node -r esm cache-first-example.js

# 运行Network-First示例
node -r esm network-first-example.js

# 运行SWR示例
node -r esm swr-example.js

# 运行LocalStorage缓存示例（注意：这个需要浏览器环境，在Node环境会使用模拟的localStorage）
node -r esm local-storage-cache-example.js
```

注意：运行Node.js示例需要安装`esm`模块来支持ES模块语法：`npm install esm`

## 教学重点

这些示例旨在说明以下核心概念：

### Cache-First 策略
- 适用于几乎不变的数据（系统配置、静态字典表等）
- 优先从缓存获取，大幅减少网络请求
- 当缓存不存在或过期时才从网络获取
- 通常设置较长的缓存有效期

### Network-First 策略
- 适用于实时性要求高的数据（股票价格、比赛分数等）
- 始终尝试从网络获取最新数据
- 只有当网络请求失败时才使用缓存作为后备
- 确保用户总是看到最新数据（除非网络故障）

### Stale-While-Revalidate (SWR) 策略
- 适用于既要快速展示又需要保持较新的数据
- 立即返回缓存数据（即使已过期），然后在后台更新
- 平衡了性能与数据新鲜度，用户体验好
- 支持通过订阅机制在数据更新时自动刷新UI

### 持久化缓存（LocalStorage）
- 将缓存数据保存到浏览器存储中，页面刷新或重启后仍然有效
- 适用于应用配置、用户首选项等需要长期保存的数据
- 需要管理缓存清理机制，防止存储空间溢出
- 可以与其他缓存策略结合使用

## 实际开发建议

在实际项目中，建议：

1. **分析数据特性**：根据数据的变化频率和实时性要求，选择合适的缓存策略
2. **使用成熟的库**：考虑使用 SWR、React Query、Apollo Client 等成熟的数据请求库，它们已经实现了高效的缓存机制
3. **合理设置缓存时间**：不同类型的数据应有不同的缓存过期时间
4. **实现手动失效机制**：在某些操作后（如数据提交），可能需要手动使相关缓存失效
5. **考虑离线支持**：结合 ServiceWorker 和持久化存储，可以实现更好的离线体验

希望这些示例能帮助你更好地理解接口缓存的原理和实现！ 