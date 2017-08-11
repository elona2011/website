class Pie {
    constructor({
        dom,
        data,
        config
    }) {
        this.config = config
        this.data = data
        this.initDom(dom)
    }

    get config() {
        return this._config
    }
    set config(config) {
        let r = 15.9155,
            strokeWidth = 10
        this.config_default = {
            pie: {
                r,
                strokeWidth,
                cx: r + strokeWidth / 2,
                cy: r + strokeWidth / 2,
                'fill-opacity': 0,
            },
            svg: {
                width: '400px',
                height: '400px',
                viewBox: '0 0 ' + (2 * r + strokeWidth) + ' ' + (2 * r + strokeWidth)
            },
            color: ['#001f3f', '#FF851B', '#0074D9', '#FF4136', '#7FDBFF', '#85144b', '#39CCCC', '#F012BE', '#3D9970', '#B10DC9', '#FFDC00', '#DDDDDD']
        }
        Object.assign(this.config_default.pie, config && config.pie)
        Object.assign(this.config_default.svg, config && config.svg)
        Object.assign(this.config_default.color, config && config.color)
        this._config = this.config_default
    }
    get data() {
        return this._data
    }
    set data(data) {
        if (!this._data) this._data = data

        data.value.sum = data.value.reduce((x, y) => x + y)
        this._data.value = data.value.map(d => {
            return {
                num: d,
                dashwidth: d * 100 / data.value.sum,
                dashgap: 100 - d * 100 / data.value.sum,
                dashoffset: 25.01
            }
        })
        this._data.value.forEach((d, index, arr) => {
            for (let i = 0; i < index; i++) {
                d.dashoffset -= arr[i].dashwidth
            }
            if (d.dashoffset < 0) {
                d.dashoffset += 100
            }
        })
    }

    initDom(dom) {
        this.dom = dom
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', this.config.svg.width)
        svg.setAttribute('height', this.config.svg.height)
        svg.setAttribute('viewBox', this.config.svg.viewBox)
        this.dom.appendChild(svg)
        this.svg = this.dom.querySelector('svg')
        this.data.value.forEach((d, i) => {
            this.drawPie(d, this.config.color[i])
        })
        let g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        this.svg.appendChild(g)
        this.g = this.dom.querySelector('g')
        this.data.innerText.forEach((d, i) => {
            this.drawText(d)
        })
    }

    drawPie(d, color) {
        let pie = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        pie.setAttribute('r', this.config.pie.r)
        pie.setAttribute('cx', this.config.pie.cx)
        pie.setAttribute('cy', this.config.pie.cy)
        this.svg.appendChild(pie)
        pie = this.svg.querySelector('svg circle:last-child')
        Object.assign(pie.style, this.config.pie)
        pie.style.strokeDasharray = d.dashwidth + ' ' + d.dashgap
        pie.style.strokeDashoffset = d.dashoffset
        pie.style.stroke = color
    }

    drawText(d) {
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x','50%')
        text.setAttribute('y','50%')
        text.textContent = d.value
        this.g.appendChild(text)
    }
}