const http = require('http')

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    })
    res.write(`<html>
                    <head>
                        <meta charset="utf-8">
                    </head>
                    <body>yanjie.me网站建设中</body>
                </html>`)
    res.end()
}).listen(80)