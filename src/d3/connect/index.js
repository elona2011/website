(function () {
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
            let r = this.links.find(n => {
                if (n.source.id === source.id && n.target.id === target.id)
                    return true
                else if (n.source.id === target.id && n.target.id === source.id)
                    return true
            })
            if (r) return

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
        node, link,
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
        link = svg.selectAll('.link')
            .data(data.links, d => d.target.id)
        // link.exit().remove()
        link = link.enter()
            .append('path')
            .attr('class', 'link')
            .attr('marker-mid', 'url(#Triangle)')
            .merge(link)

        node = svg.selectAll('.node')
            .data(data.nodes, d => d.id)
        // node.exit().remove()
        node = node.enter()
            .append('g')
            .merge(node)
            .attr('class', 'node')
            // .on("click", click)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))

        if (drawLineEnable) {
            node.on('.drag', null)
        }

        node.append('rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .attr('transform', 'translate(-' + rectWidth / 2 + ',-' + rectHeight / 2 + ')')
            .on('mousedown', d => {
                if (drawLineEnable) {
                    drawLineFrom = d
                    drag_line.attr('marker-mid', 'url(#Triangle)')
                        .attr('class', 'dragline')
                        .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`)
                }
            }).on('mouseup', d => {
                drawLineTo = d
                data.addLink(drawLineFrom, drawLineTo)
                initD3();
                simulation.alphaTarget(0.3).restart()
            })

        node.append('text')
            .attr('dy', 3)
            .text(d => d.name)

        simulation.nodes(data.nodes)
            .on('tick', ticked)
        simulation.force('link')
            .links(data.links)
    }

    function click(d) {
        data.nodes.push({
            id: index,
            name: "server " + index
        });
        data.links.push({
            source: d.id,
            target: index
        });
        index++;
        initD3();
    }

    function ticked() {
        link.attr("d", function (d) {
            let centerX = d.source.x + (d.target.x - d.source.x) / 2,
                centerY = d.source.y + (d.target.y - d.source.y) / 2
            return `M${d.source.x},${d.source.y}L${centerX},${centerY}L${d.target.x},${d.target.y}`;
        })

        node.attr("transform", function (d) {
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
        let buttonAdd = document.querySelector('.connect .add')
        let buttonView = document.querySelector('.connect .view')
        let buttonLine = document.querySelector('.connect .line')
        buttonAdd.addEventListener('click', e => {
            data.addNode()
            initD3();
            // simulation.alphaTarget(1).restart()
        }, false)

        buttonView.addEventListener('click', e => {
            buttonView.classList.toggle('hidden')
            buttonLine.classList.toggle('hidden')
            drawLineEnable = true
            initD3()
        }, false)

        buttonLine.addEventListener('click', e => {
            buttonView.classList.toggle('hidden')
            buttonLine.classList.toggle('hidden')
            drawLineEnable = false
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
        }
    }
})();