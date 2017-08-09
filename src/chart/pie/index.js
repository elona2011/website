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
        this.config_default = {
            pie: {
                cx: 20,
                cy: 20,
                'fill-opacity': 0,
                strokeWidth: 5
            },
            svg: {
                width: 400,
                height: 400,
            },
            color: ['#001f3f', '#FF851B', '#0074D9', '#FF4136', '#7FDBFF', '#85144b', '#39CCCC', '#F012BE', '#3D9970', '#B10DC9', '#FFDC00', '#DDDDDD']
        }
        Object.assign(this.config_default.pie, config && config.pie)
        this._config = this.config_default
    }
    get data() {
        return this._data
    }
    set data(data) {
        data.sum = data.reduce((x, y) => x + y)
        this._data = data.map(d => {
            return {
                num: d,
                dashwidth: d * 100 / data.sum,
                dashgap: 100 - d * 100 / data.sum,
                dashoffset: 25
            }
        })
        this._data.forEach((d, index, arr) => {
            for (let i = 0; i < index; i++) {
                d.dashoffset -= arr[i].dashwidth
            }
            if (d.dashoffset < 100) {
                d.dashoffset += 100
            }
        })
    }

    initDom(dom) {
        this.dom = dom
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.dom.appendChild(svg)
        this.svg = this.dom.querySelector('svg')
        this.svg.setAttribute('viewBox', '0 0 40 40')
        Object.assign(this.svg.style, this.config.svg)
        this.data.forEach((d, i) => {
            this.drawPie(d, this.config.color[i])
        })
    }

    drawPie(d, color) {
        let PI2 = Math.PI * 2,
            pie = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
            l = PI2 * this.config.pie.r
        pie.setAttribute('r', 15.91549430918954)
        pie.setAttribute('cx', 20)
        pie.setAttribute('cy', 20)
        this.svg.appendChild(pie)
        pie = this.svg.querySelector('svg circle:last-child')
        Object.assign(pie.style, this.config.pie)
        pie.style.strokeDasharray = d.dashwidth + ' ' + d.dashgap
        pie.style.strokeDashoffset = d.dashoffset
        pie.style.stroke = color
    }
}