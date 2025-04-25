// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;

http.createServer((req, res) => {
    console.log(`Request for ${req.url}`);

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html'; // 根路径默认服务 index.html
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                // 文件未找到
                fs.readFile('./404.html', (error404, content404) => { // 可选：提供404页面
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404 || '404 Not Found', 'utf-8');
                });
            } else {
                // 服务器内部错误
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            // 成功读取文件
            // 特别注意：为了防止浏览器缓存捣乱，我们给 HTML 和 SW 文件设置不缓存的头
            if (filePath === './index.html' || filePath === './sw.js') {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                });
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
            }
            res.end(content, 'utf-8');
        }
    });

}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
console.log('Press Ctrl+C to quit.');