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
                r: 100,
                cx: 200,
                cy: 200,
                'fill-opacity': 0,
                strokeWidth: 30,
                'transform-origin': '50% 50%'
            },
            svg: {
                width: 400,
                height: 400
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
                deg: d / data.sum * 360,
                offset: 0
            }
        })
        this._data.forEach((d, index, arr) => {
            for (let i = 0; i < index; i++) {
                d.offset += arr[i].deg
            }
        })
    }

    initDom(dom) {
        this.dom = dom
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.dom.appendChild(svg)
        this.svg = this.dom.querySelector('svg')
        Object.assign(this.svg.style, this.config.svg)
        this.data.forEach((d, i) => {
            this.drawPie(d.deg, d.offset, this.config.color[i])
        })
    }

    drawPie(deg, offset, color) {
        let PI2 = Math.PI * 2,
            pie = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
            l = PI2 * this.config.pie.r
        this.svg.appendChild(pie)
        pie = this.svg.querySelector('svg circle:last-child')
        Object.assign(pie.style, this.config.pie)
        pie.style.strokeDasharray = deg * l / 360 + ' ' + l
        pie.style.transform = 'rotate(' + (offset - 90) + 'deg)'
        pie.style.stroke = color
    }
}