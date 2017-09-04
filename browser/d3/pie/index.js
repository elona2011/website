let originData = {
    "created": {
        "bugs": 26.0,
        "tasks": 4.0,
        "requireMents": 14.0
    },
    "pending": {
        "bugs": 19.0,
        "tasks": 1.0,
        "requireMents": 51.0
    },
    "focus": {
        "bugs": 25.0,
        "tasks": 4.0,
        "requireMents": 3.0
    }
}
let colors = {
    requireMents: '#F7CB45',
    tasks: '#7CD84D',
    bugs: '#E84E63'
}

let data = {}

for (let n in originData) {
    data[n] = []
    for (let e in originData[n]) {
        data[n].push({
            name: e,
            value: originData[n][e]
        })
    }
}

drawPie(data.created)
drawCircle(data.pending, 'pending', 600, 200, '#64D7AF')
drawCircle(data.focus, 'focus', 600, 400, '#4043A7')

function drawPie(d) {
    let innerRadius = 100,
        width = 50

    let pie = d3.pie().value(d => d.value)

    let slices = pie(d)

    let arc = d3.arc().innerRadius(innerRadius).outerRadius(innerRadius + width)
    let arc1 = d3.arc().innerRadius(innerRadius).outerRadius(innerRadius + width + 10)

    let color = d3.scaleOrdinal(d3.schemeCategory10)
    let svg = d3.select('svg')
    let g = svg.append('g').attr('transform', 'translate(300,300)')

    let path = g.selectAll('path.slice')
        .data(slices)
        .enter()
        .append('path')
        .attr('class', 'slice')
        .attr('d', arc)
        .attr('fill', d => color(d.data.value))

    g.selectAll('text')
        .data(slices)
        .enter()
        .append('text')
        .text(d => d.data.name)
        .attr('x', d => {
            let center = arc.centroid(d),
                r = Math.abs(width * 2 / 3 * Math.cos(getOuterTextAngle(center)))
            return center[0] + (center[0] > 0 ? r : -r)
        })
        .attr('y', d => {
            let center = arc.centroid(d),
                r = Math.abs(width * 2 / 3 * Math.sin(getOuterTextAngle(center)))
            return center[1] + (center[1] > 0 ? r : -r)
        })
        .attr('dy', d => arc.centroid(d)[1] > 0 ? 10 : 0)
        .attr('text-anchor', d => arc.centroid(d)[0] < 0 ? 'end' : 'start')

    function getOuterTextAngle(d) {
        return Math.atan2(d[1], d[0])
    }

    path.on('mouseenter', function(e) {
        d3.select(this).transition().duration(100).attr('d', arc1)
    })
    path.on('mouseleave', function(e) {
        d3.select(this).transition().duration(100).attr('d', arc)
    })
}

/**
 * 
 * @param {object} d - data
 * @param {string} name - title文字
 * @param {number} x - 块坐标x
 * @param {number} y - 块坐标y
 * @param {string} c - circle color
 */
function drawCircle(d, name, x, y, c) {
    let radius = 50,
        svg = d3.select('svg'),
        g = svg.append('g').attr('transform', 'translate(' + x + ',' + y + ')')

    g.append('circle')
        .attr('r', 48)
        .attr('fill', c)
    g.append('text')
        .text(name)
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('dy', 15)
    g.append('text')
        .text(d.reduce((x, y) => x += y.value, 0))
        .attr('fill', '#fff')
        .attr('dy', -10)
        .attr('text-anchor', 'middle')

    let legend = g.append('g').attr('transform', 'translate(80,0)')

    legend.selectAll('rect')
        .data(d)
        .enter()
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d => colors[d.name])
        .attr('x', 0)
        .attr('y', (d, i) => 30 * i - 40)
    legend.selectAll('text')
        .data(d)
        .enter()
        .append('text')
        .text(d => d.name + ' :')
        .attr('x', 20)
        .attr('y', (d, i) => 30 * i - 30)
    legend.selectAll('a')
        .data(d)
        .enter()
        .append('a')
        .attr('xlink:href', 'http://saturnsit.cnsuning.com')
        .attr('target', '_blank')
        .append('text')
        .text(d => d.value)
        .attr('x', 100)
        .attr('y', (d, i) => 30 * i - 30)

}