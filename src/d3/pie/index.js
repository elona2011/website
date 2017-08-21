let sales = [
    { product: 'aaaa', count: 12 },
    { product: 'bb', count: 3 },
    { product: 'cc', count: 5 },
    { product: 'dd', count: 7 },
    { product: 'ee', count: 8 },
    { product: 'ff', count: 1 }
]

let pie = d3.pie().value(d => d.count)

let slices = pie(sales)

let arc = d3.arc().innerRadius(0).outerRadius(100)

let color = d3.scaleOrdinal(d3.schemeCategory10)
let svg = d3.select('svg')
let g = svg.append('g').attr('transform', 'translate(200,100)')

g.selectAll('path.slice')
    .data(slices)
    .enter()
    .append('path')
    .attr('class', 'slice')
    .attr('d', arc)
    .attr('fill', d => color(d.data.product))

let legend = svg.append('g')
    .attr('class', 'legend')
    
legend.selectAll('rect')
    .data(slices)
    .enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', d => color(d.data.product))
    .attr('y', (d, i) => 20 * (i + 1) - 10)

legend.selectAll('text')
    .data(slices)
    .enter()
    .append('text')
    .text(d => d.data.product)
    .attr('fill', d => color(d.data.product))
    .attr('y', (d, i) => 20 * (i + 1))
    .attr('x', 20)