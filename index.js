const http = require('http')
const parse = require('url').parse
const qs = require('querystring')


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
                if (url.pathname === '/csrf/update') {
                    console.log(reqBody)
                    let params = qs.parse(reqBody)
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    })
                    res.write(`<!DOCTYPE html>
                                <html>

                                <head>
                                    <meta charset="utf-8">
                                </head>

                                <body>
                                    <form method="post" action="https://yanjie.me/csrf/update">
                                        <div>
                                            <label for="value">value:</label>
                                            <input type="text" name="value" value="${params.value+1}">
                                        </div>
                                        <button type="submit">update</button>
                                    </form>
                                </body>

                                </html>`)
                    res.end()
                    return
                }
                break
        }
    })
    // res.writeHead(200, {
    //     "Content-Type": "text/html"
    // })
    // res.write(`<html>
    //                 <head>
    //                     <meta charset="utf-8">
    //                 </head>
    //                 <body>yanjie.me网站建设中</body>
    //             </html>`)
    // res.end()
}).listen(8000)