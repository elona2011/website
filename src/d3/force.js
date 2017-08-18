let graph = {
    nodes: [
        { name: "aaa", age: 36 },
        { name: "bbb", age: 22 },
        { name: "ccc", age: 55 },
        { name: "dd", age: 44 },
        { name: "ee", age: 11 },
        { name: "fff", age: 23 },
        { name: "gg", age: 45 },
    ],
    links: [{
        source: 'aaa', target: 'bbb'
    },{
        source: 'aaa', target: 'ccc'
    },{
        source: 'aaa', target: 'dd'
    },{
        source: 'aaa', target: 'fff'
    }]
}

let canvas = d3.select('#network'),
    width = canvas.attr('width'),
    height = canvas.attr('height'),
    r = 30,
    ctx = canvas.node().getContext('2d'),
    simulation = d3.forceSimulation()
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .force('collide', d3.forceCollide(r+10))
        // .force('charge', d3.forceManyBody().strength(-20))
        .force('link', d3.forceLink().id(d => d.name))
        .on('tick', update)

graph.nodes.forEach(d => {
    d.x = Math.random() * width
    d.y = Math.random() * height
})

simulation.nodes(graph.nodes)
simulation.force('link').links(graph.links)

function update() {
    ctx.clearRect(0, 0, width, height)

    ctx.beginPath()
    graph.links.forEach(drawLink)
    ctx.stroke()

    ctx.beginPath()
    graph.nodes.forEach(drawNode)
    ctx.fill()
}

function drawNode(d) {
    ctx.moveTo(d.x, d.y)
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI)
}

function drawLink(l) {
    ctx.moveTo(l.source.x, l.source.y)
    ctx.lineTo(l.target.x, l.target.y)
}