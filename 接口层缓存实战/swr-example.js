// Stale-While-Revalidate (SWR) 缓存策略示例
// 适用于需要快速显示但又需要保持较新的数据

import api from './api-service.js';

// 简单的SWR策略实现
class SWRStrategy {
  constructor(fetchFunction, staleTimeMs = 60000) { // 默认1分钟过期
    this.fetchFunction = fetchFunction;
    this.staleTimeMs = staleTimeMs;
    this.cache = null;
    this.cacheTime = null;
    this.isValidating = false;
    // 存储订阅更新的回调函数
    this.subscribers = [];
  }

  // 注册数据更新的回调
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // 通知所有订阅者数据已更新
  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  // 检查数据是否过期
  isStale() {
    if (!this.cacheTime) return true;
    return (Date.now() - this.cacheTime) > this.staleTimeMs;
  }

  // 在后台重新验证数据
  async revalidate() {
    // 防止多次重复验证
    if (this.isValidating) return;
    
    this.isValidating = true;
    console.log('🔄 后台重新验证数据...');
    
    try {
      const freshData = await this.fetchFunction();
      this.cache = freshData;
      this.cacheTime = Date.now();
      console.log('✨ 后台数据更新成功，通知订阅者');
      
      // 通知订阅者数据已更新
      this.notifySubscribers(freshData);
    } catch (error) {
      console.error('❌ 后台重新验证失败:', error);
    } finally {
      this.isValidating = false;
    }
  }

  async getData() {
    // 如果有缓存，立即返回（无论是否过期）
    if (this.cache) {
      console.log('⚡ 立即返回缓存数据');
      
      // 如果数据已过期，在后台触发重新验证
      if (this.isStale()) {
        console.log('⚠️ 数据已过期，触发后台更新');
        this.revalidate();
      }
      
      return this.cache;
    }
    
    // 没有缓存，必须等待网络请求
    console.log('🔍 无缓存数据，等待网络请求...');
    try {
      const data = await this.fetchFunction();
      this.cache = data;
      this.cacheTime = Date.now();
      console.log('✅ 成功获取并缓存数据');
      return data;
    } catch (error) {
      console.error('❌ 获取数据失败:', error);
      throw error;
    }
  }
  
  // 手动使缓存失效并重新获取
  async invalidateAndFetch() {
    this.cacheTime = null; // 使缓存立即过期
    console.log('🗑️ 缓存已失效，重新获取数据');
    return this.getData(); // 这将触发新的获取
  }
}

// 创建使用SWR策略的用户资料获取器
const userProfileCache = new SWRStrategy(() => api.getUserProfile(1));

// 使用示例
async function demo() {
  console.log('--- SWR 策略演示 ---');
  
  // 设置数据更新的回调函数
  const unsubscribe = userProfileCache.subscribe(newData => {
    console.log('🔔 收到数据更新通知:', newData);
  });
  
  // 第一次请求，没有缓存，会等待网络请求
  console.log('🔄 第一次请求 (无缓存):');
  const result1 = await userProfileCache.getData();
  console.log('📊 获取数据:', result1);
  
  // 第二次请求，立即返回缓存，后台不更新（因为数据未过期）
  console.log('\n🔄 第二次请求 (有新鲜缓存):');
  const result2 = await userProfileCache.getData();
  console.log('📊 获取数据:', result2);
  
  // 模拟数据过期
  console.log('\n⏱️ 模拟数据过期...');
  userProfileCache.cacheTime = Date.now() - userProfileCache.staleTimeMs - 1000;
  
  // 第三次请求，立即返回过期缓存，同时后台更新
  console.log('\n🔄 第三次请求 (有过期缓存):');
  const result3 = await userProfileCache.getData();
  console.log('📊 获取数据 (过期):', result3);
  
  // 等待后台更新完成
  console.log('\n⏳ 等待后台更新完成...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 手动使缓存失效并重新获取
  console.log('\n🔄 手动使缓存失效并重新获取:');
  const result4 = await userProfileCache.invalidateAndFetch();
  console.log('📊 获取的新数据:', result4);
  
  // 清理订阅
  unsubscribe();
}

// 仅在直接运行文件时执行演示
if (typeof require !== 'undefined' && require.main === module) {
  demo();
}

export { SWRStrategy, userProfileCache }; 