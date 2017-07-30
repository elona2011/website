const http = require('http')
const parse = require('url').parse

http.createServer((req, res) => {
    let reqBody = ''
    req.on('data', d => {
        reqBody += d
    })
    req.on('end', d => {
        let url = parse(req.url)

        switch (req.method) {
            case "GET":
                break
            case "POST":
                if(url.pathname === '/csrf/update'){
                    console.log('csrf')
                }
                break
        }
    })
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
}).listen(8000)