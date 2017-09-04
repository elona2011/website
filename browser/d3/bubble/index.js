(function() {
    let svg = d3.select('svg'),
        width = +svg.attr('width'),
        height = +svg.attr('height'),
        color = d3.scaleOrdinal(d3.schemeCategory20c)

    let pack = d3.pack()
        .size([width, height])
        .padding(1.5)

    let root = d3.hierarchy({
        children: [{
            id: 'd3',
            value: 2,
            children: [{
                id: 'bubble',
                value: 4
            }, {
                id: 'connect',
                value: 4,
                url: '/d3/connect/index.html',
            }, {
                id: 'force',
                value: 4,
                url: '/d3/force/index.html',
            }, {
                id: 'pie',
                value: 4,
                url: '/d3/pie/index.html',
            }, {
                id: 'tree',
                value: 4,
                url: '/d3/tree/index.html',
            }]
        }, {
            id: 'b',
            value: 5
        }]
    }).sum(function(d) {
        return d.value;
    }).each(d => {
        d.id = d.data.id
        d.url = d.data.url
    })

    let node = svg.selectAll('.node')
        .data(pack(root).descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')'
        })
    let a = node.append('a')
        .attr('href', d => d.url)
    a.append('circle')
        .attr('r', function(d) {
            return d.r
        })
        .attr('fill', d => {
            return color(d.id)
        })
        .style('cursor', 'pointer')
        .on('click', d => {
            d
        })
    a.append('text')
        .text(d => d.id)
        .attr('text-anchor', 'middle')
})();