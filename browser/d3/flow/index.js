(function () {
    document.addEventListener('dragstart', e => {
        let fa = e.target.querySelector('i.fa')
        if (fa) {
            let type = fa.className.split(' ')[1]
            e.dataTransfer.setData('text/plain', type)
        }
    })
    document.querySelector('svg').addEventListener('drop', e => {
        let type = e.dataTransfer.getData('text')
        data.addNode(type, e.clientX - 50, e.clientY - 50)
        initD3();
        simulation.restart()
    })
    document.addEventListener('dragover', e => {
        e.preventDefault()
    })
    
    class RectGroup {
        constructor() {
            this.nodes = []
            this.links = []
            this.index = 0
        }

        addNode(type, x, y) {
            this.index++;
            this.nodes.push({
                id: this.index,
                name: 'server ' + this.index,
                x,
                y,
                type,
                icon: this.getIcon(type)
            })
        }

        getIcon(type) {
            switch (type) {
                case 'fa-anchor':
                    return '\uf13d'
                case 'fa-archive':
                    return '\uf187'
                case 'fa-bed':
                    return '\uf236'
                case 'fa-bug':
                    return '\uf188'
                case 'fa-car':
                    return '\uf1b9'
                case 'fa-cc':
                    return '\uf20a'
                case 'fa-cog':
                    return '\uf013'
            }
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

    let data = new RectGroup(),
        svg = d3.select('svg'),
        svgWidth = parseInt(svg.style('width')),
        svgHeight = parseInt(svg.style('height')),
        rectWidth = 100,
        rectHeight = 100,
        index = 10,
        gMerge, path, pathHover, pathCross,
        drawLineEnable = false,
        drawLineFrom, drawLineTo

    data.addNode('fa-car', 200, 200)
    data.addNode('fa-car', 200, 200)
    data.addLink(data.nodes[0], data.nodes[1])

    let drag_line = svg.append('path')
        .attr('class', 'dragline hidden')
        .attr('d', 'M0,0L0,0')

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(200))
        // .force('charge', d3.forceManyBody().strength(200))
        // .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
        .force('collide', d3.forceCollide(100))

    init()

    function init() {
        initD3()
        addEvent()
        svg.on('mousemove', mousemove)
            .on('mouseup', mouseup)
    }

    function initD3() {
        let g
        let linkData = svg.selectAll('.link')
            .data(data.links, d => d.target.id)
        linkData.exit().remove()
        g = linkData.enter()
            .append('g')
            .attr('class', 'link')
            .on('click', function (d) {
                if (drawLineEnable) {
                    let l = d3.select(this)
                    l.select('.line-hover')
                        .classed('selected', true)
                    l.select('use')
                        .classed('hidden', false)
                        .attr('x', function (d) {
                            return (d.source.x + d.target.x) / 2 - 5
                        })
                        .attr('y', function (d) {
                            return (d.source.y + d.target.y) / 2 - 5
                        })
                        .on('mousedown', d => {
                            data.links = data.links.filter(n => n.source.id !== d.source.id || n.target.id !== d.target.id)
                            initD3()
                            clearAllEditStyle()
                            simulation.alphaTarget(0.1).restart()
                        })
                }
            })
        path = g.append('path')
            .attr('class', 'line')
            .attr('marker-mid', 'url(#Triangle)')
            .merge(linkData.select('.line'))
        pathHover = g.append('path')
            .attr('class', 'line-hover')
            .merge(linkData.select('.line-hover'))

        pathCross = g.append('use')
            .attr('class', 'cross hidden')
            .attr('xlink:href', '#cross')
            .merge(linkData.select('.cross'))

        //防止link遮盖rect
        svg.selectAll('.link,.node')
            .sort((a, b) => {
                if (a.source) return -1
                else return 1
            })

        dataJoin = svg.selectAll('.node')
            .data(data.nodes, d => d.id)
        dataJoin.exit().remove()
        g = dataJoin.enter()
            .append('g')
            .attr('class', 'node')

        g.append('rect')
            .attr('class', 'rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .attr('transform', 'translate(-' + rectWidth / 2 + ',-' + rectHeight / 2 + ')')
        g.append('text')
            .attr('class', 'awe')
            .text(d => d.icon)
        g.append('text')
            .attr('dy', 30)
            .text(d => d.name)

        g.append('use')
            .attr('class', 'cross hidden')
            .attr('xlink:href', '#cross')
            .attr('transform', 'translate(' + (rectWidth / 2 - 5) + ',-' + (rectHeight / 2 + 5) + ')')

        gMerge = g.merge(dataJoin)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mousedown', function (d) {
                if (drawLineEnable) {
                    drawLineFrom = d

                    //去除所有
                    clearAllEditStyle()

                    //选中当前元素
                    let g = d3.select(this)
                    g.classed('selected', true)
                    g.select('use')
                        .classed('hidden', false)
                        .on('mousedown', function (d) {
                            data.nodes = data.nodes.filter(n => n.id !== d.id)
                            data.links = data.links.filter(n => n.source.id !== d.id && n.target.id !== d.id)
                            initD3()
                        })
                    drag_line.attr('marker-mid', 'url(#Triangle)')
                        .classed('hidden', false)
                        .attr('d', `M${d.x},${d.y}L${d.x},${d.y}`)
                    simulation.alphaTarget(0.1).restart()
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
        path.attr("d", function (d) {
            let centerX = d.source.x + (d.target.x - d.source.x) / 2,
                centerY = d.source.y + (d.target.y - d.source.y) / 2
            return `M${d.source.x},${d.source.y}L${centerX},${centerY}L${d.target.x},${d.target.y}`;
        })
        pathHover.attr("d", function (d) {
            let centerX = d.source.x + (d.target.x - d.source.x) / 2,
                centerY = d.source.y + (d.target.y - d.source.y) / 2
            return `M${d.source.x},${d.source.y}L${centerX},${centerY}L${d.target.x},${d.target.y}`;
        })
        pathCross.attr('x', d => {
            return (d.source.x + d.target.x) / 2
        })
        pathCross.attr('y', d => {
            return (d.source.y + d.target.y) / 2
        })

        gMerge.attr("transform", function (d) {
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
            drag_line.classed('hidden', true)
            drawLineFrom = null
        } else {
            clearAllEditStyle()
        }
        simulation.alphaTarget(0)
    }

    function clearAllEditStyle() {
        d3.selectAll('.node').classed('selected', false)
        d3.selectAll('.cross').classed('hidden', true)
        d3.selectAll('.selected').classed('selected', false)
    }
})();