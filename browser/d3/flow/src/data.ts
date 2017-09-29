class RectGroup {
    public nodes: {'name'}[]
    public links: any[]
    private index: number

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