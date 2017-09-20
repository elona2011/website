import { createServer, IncomingMessage, ServerResponse } from 'http'

let server = createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log('method', req.method)
    console.log('headers', req.headers)
    console.log('------------------------------')
    res.end()
})
server.listen(80)