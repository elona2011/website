let data = [{
    "nodeName": "所发生的(111)",
    "providerName": "所发生的",
    "providerVersion": "111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:11})",
    "centerNodeType": 1,
    "target": "sfdsdfs111(sdfsdfds)",
    "source": "所发生的(111)",
    "nodeType": 1,
}, {
    "nodeName": "sdfsd(1111)",
    "providerName": "sdfsd",
    "providerVersion": "1111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:12})",
    "centerNodeType": 0,
    "target": "所发生的(111)",
    "source": "所发生的(111)",
    "nodeType": 1
}, {
    "nodeName": "sfdsdfs111(sdfsdfds)",
    "providerName": "sfdsdfs111",
    "providerVersion": "sdfsdfds",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:24})",
    "centerNodeType": 0,
    "target": "所发生的(111)",
    "source": "sdfsd(1111)",
    "nodeType": 1
}, {
    "nodeName": "javaf2(1.0.0)",
    "providerName": null,
    "providerVersion": null,
    "appId": 331,
    "appName": "javaf2",
    "refAppVersion": "1.0.0,1.0.2",
    "nodeUrl": null,
    "centerNodeType": 0,
    "target": "所发生的(111)",
    "source": "sdfsd(1111)",
    "nodeType": 2
}, {
    "nodeName": "javaf2(1.0.1)",
    "providerName": null,
    "providerVersion": null,
    "appId": 331,
    "appName": "javaf2",
    "refAppVersion": "1.0.1",
    "nodeUrl": null,
    "centerNodeType": 0,
    "target": "sdfsd(1111)",
    "source": "sdfsd(1111)",
    "nodeType": 2
}, {
    "nodeName": "sdfsdfs(sdfsdfsd)",
    "providerName": "sdfsdfs",
    "providerVersion": "sdfsdfsd",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:25})",
    "centerNodeType": 0,
    "target": "sdfsd(1111)",
    "source": "所发生的(111)",
    "nodeType": 1
}, {
    "nodeName": "abc(1.0.1)",
    "providerName": "abc",
    "providerVersion": "1.0.1",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:1})",
    "centerNodeType": 0,
    "target": "sdfsd(1111)",
    "source": "所发生的(111)",
    "nodeType": 1
}]

let links = []
data.forEach(d => {
    if (d.target != null) {
        var obj = {};
        obj['source'] = d.nodeName;
        obj['target'] = d.target;
        links.push(obj);
    }
    if (d.source != null) {
        var obj = {};
        obj['source'] = d.source;
        obj['target'] = d.nodeName;
        links.push(obj);
    }
})

let canvas = d3.select('#network'),
    width = canvas.attr('width'),
    height = canvas.attr('height'),
    r = 20,
    ctx = canvas.node().getContext('2d'),
    simulation = d3.forceSimulation()
    // .alphaMin(0.9)
    .alphaDecay(0.07)
    .force('x', d3.forceX(width / 2))
    .force('y', d3.forceY(height / 2))
    .force('collide', d3.forceCollide(2 * r))
    // .force('charge', d3.forceManyBody().strength(-20))
    .force('link', d3.forceLink().id(d => d.nodeName))
    .on('tick', update)

data.forEach(d => {
    d.x = Math.random() * width
    d.y = Math.random() * height
})

simulation.nodes(data)
simulation.force('link').links(links)

function update() {
    ctx.clearRect(0, 0, width, height)

    links.forEach(drawLink)
    data.forEach(drawNode)
}

function drawNode(d) {
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    if (d.nodeType === 1) {
        ctx.arc(d.x, d.y, r, 0, 2 * Math.PI)
        if (d.centerNodeType === 1) {
            ctx.fillStyle = 'green'
        } else {
            ctx.fillStyle = 'red'
        }
    } else if (d.nodeType === 2) {
        ctx.rect(d.x - r, d.y - r, 2 * r, 2 * r)
        ctx.fillStyle = 'blue'
    }
    ctx.fill()

    ctx.fillStyle = 'black'
    ctx.fillText(d.nodeName, d.x - r, d.y);
}

function drawLink(l) {
    ctx.beginPath()
    ctx.moveTo(l.source.x, l.source.y)
    ctx.lineTo(l.target.x, l.target.y)
    ctx.stroke()
    drawArrow(l.source.x, l.source.y, l.target.x, l.target.y)
}

function drawArrow(x1, y1, x2, y2) {
    let p = getPoint(x1, y1, x2, y2)
    ctx.beginPath()
    ctx.moveTo(p[0].x, p[0].y)
    ctx.lineTo(p[1].x, p[1].y);
    ctx.lineTo(p[2].x, p[2].y);
    ctx.fill()
}

function getPoint(x1, y1, x2, y2) {
    const len = 15
    let angle = Math.atan((y2 - y1) / (x2 - x1)),
        angle0 = Math.PI / 2 - angle,
        angle1 = angle - Math.PI / 12,
        angle2 = Math.PI / 2 - angle1,
        angle3 = Math.PI / 3 - angle1,
        angle4 = Math.PI / 2 - angle3

    return [{
        x: x2 - r * Math.sin(angle0),
        y: y2 - r * Math.sin(angle),
    }, {
        x: x2 - r * Math.sin(angle0) - len * Math.sin(angle2),
        y: y2 - r * Math.sin(angle) - len * Math.sin(angle1),
    }, {
        x: x2 - r * Math.sin(angle0) - len * Math.sin(angle3),
        y: y2 - r * Math.sin(angle) - len * Math.sin(angle4),
    }]
}

document.getElementById('network').onmousemove = function(e) {
    let rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        index = getHoverIndex(x, y, data),
        tip = document.querySelector('.cd-canvas-tip')
    if (index >= 0) {
        tip.style.display = ''
        tip.style.height = '100px'
        tip.style.width = '100px'
        tip.style.top = data[index].y + 'px'
        tip.style.left = data[index].x + 'px'
        tip.textContent = data[index].nodeName
    } else {
        tip.style.display = 'none'
    }
}

function getHoverIndex(x, y, d) {
    let index
    d.forEach((e, i) => {
        if (x > e.x - r && x < e.x + r && y > e.y - r && y < e.y + r) {
            index = i
        }
    })
    return index
}