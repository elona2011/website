(function() {
    var svg = d3.select("svg"),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height"))

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2));


    function getGraph() {
        let nodes = [],
            nodesId = {},
            links = [],
            num = 1e2

        for (let i = 0; i < num; i++) {
            nodesId[makeid()] = Math.ceil(Math.random() * 10)
        }
        for (let n in nodesId) {
            nodes.push({
                id: n,
                group: nodesId[n]
            })
        }

        for (let i = 0; i < num; i++) {
            links.push({
                source: nodes[i].id,
                target: nodes[Math.floor(nodes.length * Math.random())].id,
                value: 1
            })
            links.push({
                source: nodes[i].id,
                target: nodes[Math.floor(nodes.length * Math.random())].id,
                value: 1
            })
            links.push({
                source: nodes[i].id,
                target: nodes[Math.floor(nodes.length * Math.random())].id,
                value: 1
            })
        }

        return { nodes, links }
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    let graph = getGraph()

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
})();