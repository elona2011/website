let names = ['bubble', 'connect', 'force', 'network', 'tree'],
    flex = document.querySelector('.flex')

names.forEach(d => {
    let template = `<div class="grid">
                        <h2>${d}</h2>
                        <div class="iframe-wrap">
                            <div class="hover-iframe"></div>
                            <iframe src="/d3/${d}/index.html" frameborder="0"></iframe>
                        </div>
                    </div>`,
        frag = document.createRange().createContextualFragment(template)
    flex.appendChild(frag)
    flex.querySelector('div.grid:last-child .hover-iframe').addEventListener('click', e => {
        location.href = `/d3/${d}/index.html`
    })
})