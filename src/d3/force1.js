let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let r = 20
drawLink(100, 20, 30, 200)

function drawLink(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    drawArrow(x1, y1, x2, y2)
}

function drawArrow(x1, y1, x2, y2) {
    let p = getPoint(x1, y1, x2, y2)
    ctx.beginPath()
    ctx.moveTo(p[0].x, p[0].y)
    ctx.lineTo(p[1].x, p[1].y);
    ctx.lineTo(p[2].x, p[2].y);
    ctx.fillStyle = 'black'
    ctx.fill()
}

function getPoint(x1, y1, x2, y2) {
    const len = 40
    let angle = Math.abs(Math.atan((y2 - y1) / (x2 - x1))),
        angle0 = Math.PI / 2 - angle,
        angle1 = angle - Math.PI / 12,
        angle2 = Math.PI / 2 - angle1,
        angle3 = Math.PI / 3 - angle1,
        angle4 = Math.PI / 2 - angle3

    let x0 = x2 > x1 ? x2 - r * Math.sin(angle0) : x2 + r * Math.sin(angle0)
    let y0 = y2 > y1 ? y2 - r * Math.sin(angle) : y2 + r * Math.sin(angle)

    return [{
        x: x0,
        y: y0,
    }, {
        x: x0 - len * Math.sin(angle2),
        y: y0 - len * Math.sin(angle1),
    }, {
        x: x0 - len * Math.sin(angle3),
        y: y0 - len * Math.sin(angle4),
    }]
}