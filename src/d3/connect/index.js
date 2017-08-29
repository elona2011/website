(function() {
    class RectGroup {
        constructor(nodes, links) {
            this.nodes = nodes || []
            this.links = links || []
            this.index = 10
        }

        addNode() {
            this.nodes.push({
                id: index,
                name: 'server ' + index++,
                x: 250,
                y: 250
            })
        }

        addLink(source, target) {
            if (!source || !target) return

            let r = this.links.find(n => {
                if (n.source.id === source.id && n.target.id === target.id)
                    return true
                if (n.source.id === target.id && n.target.id === source.id)
                    return true
            })

            //该两点间已经存在link
            if (r) return

            //起点终点相同
            if (source.id === target.id) return

            this.links.push({
                source,
                target
            })
        }

        remove() {
            this.rectData.pop()
        }
    }

    let data = new RectGroup([{
                "id": 1,
                "name": "server 1"
            },
            {
                "id": 2,
                "name": "server 2"
            }
        ], [{
            source: 1,
            target: 2
        }]),
        svg = d3.select('svg'),
        svgWidth = +svg.attr('width'),
        svgHeight = +svg.attr('height'),
        rectWidth = 100,
        rectHeight = 50,
        index = 10,
        gMerge, path,
        drawLineEnable = false,
        drawLineFrom, drawLineTo

    let drag_line = svg.append('path')
        .attr('class', 'dragline hidden')
        .attr('d', 'M0,0L0,0')

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(100))
        .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
        .force('collide', d3.forceCollide(70))

    init()

    function init() {
        initD3()
        addEvent()
        svg.on('mousemove', mousemove)
            .on('mouseup', mouseup)
    }

    function initD3() {
        let link = svg.selectAll('.link')
            .data(data.links, d => d.target.id)
        link.exit().remove()
        link = link.enter()
            .append('g')
            .on('click', function(d) {
                d3.select(this)
                    .select('use')
                    .classed('hidden', false)
            })
        path = link.append('path')
            .attr('class', 'link')
            .attr('marker-mid', 'url(#Triangle)')
        path.merge(path)
        link.append('use')
            .attr('class', 'cross hidden')
            .attr('xlink:href', '#cross')
            .attr('x',function (d) {
                d
            })

        dataJoin = svg.selectAll('.node')
            .data(data.nodes, d => d.id)
        dataJoin.exit().remove()
        let g = dataJoin.enter()
            .append('g')
            .attr('class', 'node')

        g.append('rect')
            .attr('class', 'rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .attr('transform', 'translate(-' + rectWidth / 2 + ',-' + rectHeight / 2 + ')')

        g.append('text')
            .attr('dy', 3)
            .text(d => d.name)

        g.append('use')
            .attr('class', 'cross hidden')
            .attr('xlink:href', '#cross')
            .attr('transform', 'translate(' + (rectWidth / 2 - 5) + ',-' + (rectHeight / 2 + 5) + ')')
            .on('click', function(d) {
                data.nodes = data.nodes.filter(n => n.id !== d.id)
                data.links = data.links.filter(n => n.source.id !== d.id && n.target.id !== d.id)
                initD3()
            })

        gMerge = g.merge(dataJoin)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mousedown', function(d) {
                if (drawLineEnable) {
                    drawLineFrom = d
                    clearAllEditStyle()

                    let g = d3.select(this)
                    g.classed('selected', true)
                    g.select('use').classed('hidden', false)
                    data
                    drag_line.attr('marker-mid', 'url(#Triangle)')
                        .attr('class', 'dragline')
                        .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`)
                    simulation.alphaTarget(0.3).restart()
                }
            }).on('mouseup', d => {
                // d3.event.stopPropagation();
                drawLineTo = d
                data.addLink(drawLineFrom, drawLineTo)
                initD3();
                simulation.alphaTarget(0)
                if (drawLineFrom !== drawLineTo) {
                    clearAllEditStyle()
                }
            })

        if (drawLineEnable) {
            gMerge.on('.drag', null)
        }

        simulation.nodes(data.nodes)
            .on('tick', ticked)
        simulation.force('link')
            .links(data.links)
    }

    function ticked() {
        path.attr("d", function(d) {
            let centerX = d.source.x + (d.target.x - d.source.x) / 2,
                centerY = d.source.y + (d.target.y - d.source.y) / 2
            return `M${d.source.x},${d.source.y}L${centerX},${centerY}L${d.target.x},${d.target.y}`;
        })

        gMerge.attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });
    }

    function dragstarted(d) {
        if (drawLineEnable) return

        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    }

    function dragged(d) {
        if (drawLineEnable) return

        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (drawLineEnable) return

        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = undefined;
        d.fy = undefined;
    }

    function addEvent() {
        let buttonAdd = document.querySelector('.connect .add'),
            buttonView = document.querySelector('.connect .view'),
            buttonEdit = document.querySelector('.connect .edit'),
            svg = document.querySelector('svg')

        buttonAdd.addEventListener('click', e => {
            data.addNode()
            initD3();
            simulation.alphaTarget(0.3).restart()
        }, false)

        buttonView.addEventListener('click', e => {
            buttonView.classList.add('hidden')
            buttonEdit.classList.remove('hidden')
            buttonAdd.classList.add('hidden')

            svg.classList.remove('edit')
            clearAllEditStyle()

            drawLineEnable = false
            initD3()
        }, false)

        buttonEdit.addEventListener('click', e => {
            buttonView.classList.remove('hidden')
            buttonEdit.classList.add('hidden')
            buttonAdd.classList.remove('hidden')

            svg.classList.add('edit')
            drawLineEnable = true
            initD3()
        }, false)
    }

    function mousemove() {
        if (drawLineEnable && drawLineFrom) {
            let p = d3.mouse(this),
                centerX = drawLineFrom.x / 2 + p[0] / 2,
                centerY = drawLineFrom.y / 2 + p[1] / 2
            drag_line.attr('d', `M${drawLineFrom.x},${drawLineFrom.y}L${centerX},${centerY}L${p[0]},${p[1]}`)
        }
    }

    function mouseup() {
        if (drawLineEnable && drawLineFrom) {
            drag_line.attr('class', 'hidden')
            drawLineFrom = null
        } else {
            clearAllEditStyle()
        }
        simulation.alphaTarget(0)
    }

    function clearAllEditStyle() {
        d3.selectAll('.node').classed('selected', false)
        d3.selectAll('.cross').classed('hidden', true)
    }
})();