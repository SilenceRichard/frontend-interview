const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3002;

// 缓存控制中间件
const setCacheControl = (req, res, next) => {
  // 根据文件类型设置不同的缓存策略
  const url = req.url;

  if (url.includes('.css')) {
    // CSS文件设置较短缓存时间
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1小时
  } else if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif')) {
    // 图片设置较长缓存时间
    res.setHeader('Cache-Control', 'public, max-age=10'); // 
  } else if (url.includes('.html')) {
    // HTML文件设置不缓存
    res.setHeader('Cache-Control', 'max-age=0, must-revalidate');
  } else {
    // 其他文件使用默认缓存策略
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5分钟
  }

  // 设置ETag和Last-Modified
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const lastModified = stats.mtime.toUTCString();
    res.setHeader('Last-Modified', lastModified);

    // 简单的ETag生成
    const etag = `W/"${stats.size.toString(16)}-${stats.mtime.getTime().toString(16)}"`;
    res.setHeader('ETag', etag);

    // 处理条件请求
    if (req.headers['if-none-match'] === etag ||
      req.headers['if-modified-since'] === lastModified) {
      return res.status(304).end();
    }
  }

  next();
};

// 应用缓存控制中间件
app.use(setCacheControl);

// 提供静态文件服务
app.use(express.static(__dirname, {
  etag: false, // 禁用Express的默认ETag，使用我们自定义的
  lastModified: false // 禁用Express的默认Last-Modified，使用我们自定义的
}));

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('缓存演示说明:');
  console.log('- HTML文件: 无缓存 (no-cache)');
  console.log('- CSS文件: 1小时缓存 (max-age=3600)');
  console.log('- 图片文件: 24小时缓存 (max-age=86400)');
  console.log('- 其他文件: 5分钟缓存 (max-age=300)');
}); 