let data = [{
    "nodeName": "测试服务1(111)",
    "providerName": "测试服务1",
    "providerVersion": "111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:11})",
    "centerNodeType": 1,
    "target": null,
    "source": null,
    "nodeType": 1
}, {
    "nodeName": "测试服务2(1111)",
    "providerName": "测试服务2",
    "providerVersion": "1111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:12})",
    "centerNodeType": 0,
    "target": "测试服务1(111)",
    "source": null,
    "nodeType": 1
}, {
    "nodeName": "测试服务3(111)",
    "providerName": "测试服务3",
    "providerVersion": "111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:24})",
    "centerNodeType": 0,
    "target": "测试服务1(111)",
    "source": null,
    "nodeType": 1
}, {
    "nodeName": "javaf2(1.0.0)",
    "providerName": null,
    "providerVersion": null,
    "appId": 331,
    "appName": "javaf2",
    "refAppVersion": "1.0.0,1.0.2",
    "nodeUrl": null,
    "centerNodeType": 0,
    "target": "测试服务1(111)",
    "source": null,
    "nodeType": 2
}, {
    "nodeName": "javaf2(1.0.1)",
    "providerName": null,
    "providerVersion": null,
    "appId": 331,
    "appName": "javaf2",
    "refAppVersion": "1.0.1",
    "nodeUrl": null,
    "centerNodeType": 0,
    "target": "测试服务2(1111)",
    "source": null,
    "nodeType": 2
}, {
    "nodeName": "测试服务4(111)",
    "providerName": "测试服务4",
    "providerVersion": "111",
    "appId": null,
    "appName": null,
    "refAppVersion": null,
    "nodeUrl": "overview.providerDetail({providerId:25})",
    "centerNodeType": 0,
    "target": null,
    "source": "测试服务1(111)",
    "nodeType": 1
}]

let links = []

data.forEach(d => {
    if (d.target != null) {
        var obj = {};
        obj['source'] = d.nodeName;
        obj['target'] = d.target;
        links.push(obj);
    }
    if (d.source != null) {
        var obj = {};
        obj['source'] = d.source;
        obj['target'] = d.nodeName;
        links.push(obj);
    }

})

var nodes = {};
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {
        name: link.source
    });
    link.target = nodes[link.target] || (nodes[link.target] = {
        name: link.target
    });
});
console.log(nodes);
for (var key in nodes) {
    data.forEach(function(e) {
        if (e.nodeName == key) {
            nodes[key].nodeName = e.nodeName;
            nodes[key].providerName = e.providerName;
            nodes[key].providerVersion = e.providerVersion;
            nodes[key].appId = e.appId;
            nodes[key].appName = e.appName;
            nodes[key].refAppVersion = e.refAppVersion;
            nodes[key].nodeUrl = e.nodeUrl;
            nodes[key].centerNodeType = e.centerNodeType;
            nodes[key].nodeType = e.nodeType;
        }
    });
}
var width = 1200,
    height = 500;

var force = d3.forceSimulation() //layout将json格式转化为力学图可用的格式
    .nodes(d3.values(nodes)) //设定节点数组
    .links(links) //设定连线数组
    .size([width, height]) //作用域的大小
    .linkDistance(180) //连接线长度
    .charge(-1500) //顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
    .on("tick", tick) //指时间间隔，隔一段时间刷新一次画面
    .start(); //开始转换

var svg = d3.select("#net").append("svg")
    .attr("width", width)
    .attr("height", height);

//箭头
var marker =
    svg.append("marker")
    //.attr("id", function(d) { return d; })
    .attr("id", "resolved")
    //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "0 -5 10 10") //坐标系的区域
    .attr("refX", 44) //箭头坐标
    .attr("refY", 0)
    .attr("markerWidth", 12) //标识的大小
    .attr("markerHeight", 12)
    .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr("stroke-width", 2) //箭头宽度
    .append("path")
    .attr("d", "M0,-5L10,0L0,5") //箭头的路径
    .attr('fill', '#aaa'); //箭头颜色


//设置连接线    
var edges_line = svg.selectAll(".edgepath")
    .data(force.links())
    .enter()
    .append("path")
    .attr({
        'd': function(d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
        },
        'class': 'edgepath',
        //'fill-opacity':0,
        //'stroke-opacity':0,
        'fill': 'blue',
        'stroke': 'red',
        'id': function(d, i) {
            return 'edgepath' + i;
        }
    })
    .style("stroke", function(d) {
        var lineColor;
        //根据关系的不同设置线条颜色
        //if(d.rela=="上位产品" || d.rela=="上游" || d.rela=="下位产品"){
        lineColor = "#aaa";
        //}else if(d.rela=="主营产品"){
        // lineColor="#B43232";
        //}
        return lineColor;
    })
    .style("pointer-events", "none")
    .style("stroke-width", 3) //线条粗细
    .attr("marker-end", "url(#resolved)"); //根据箭头标记的id号标记箭头

var edges_text = svg.append("g").selectAll(".edgelabel")
    .data(force.links())
    .enter()
    .append("text")
    .style("pointer-events", "none")
    //.attr("class","linetext")
    .attr({
        'class': 'edgelabel',
        'id': function(d, i) {
            return 'edgepath' + i;
        },
        'dx': 80,
        'dy': 0
        //'font-size':10,
        //'fill':'#aaa'
    });

//圆圈
var circle = svg.append("g").selectAll("circle")
    .data(force.nodes()) //表示使用force.nodes数据
    .enter().append("circle")
    .style("fill", function(node) {
        var color; //圆圈背景色
        var link = links[node.index];
        console.log(node);
        if (node.centerNodeType == 1) {
            color = '#c23531';
        } else if (node.nodeType == 1) {
            color = "#11B983";
        } else if (node.nodeType == 2) {
            color = "#7A97F8";
        }
        return color;
    })
    .style('stroke', function(node) {
        var color; //圆圈线条的颜色
        var link = links[node.index];
        //if(node.name==link.source.name && link.rela=="主营产品"){
        color = "#fff";
        //}else{
        //color="#A254A2";
        //}
        return color;
    })
    .attr("r", 40) //设置圆圈半径
    .on("click", function(node) {
        //单击时让连接线加粗
        edges_line.style("stroke-width", function(line) {
            console.log(line);
            if (line.source.name == node.name || line.target.name == node.name) {
                return 4;
            } else {
                return 3;
            }
        });
    })
    .on("mouseover", function(node) {
        $('.cd-canvas-tip').show()
            .css({
                'top': node.y + 'px',
                'left': node.x + 'px'
            });
        if (node.nodeType == 1) {
            var str = node.nodeUrl;
            var url = str.split('(')[0];
            var kk = str.split('(')[1];
            var num = kk.split(')')[0];
            var aa = num.split('{')[1];
            var bb = aa.split('}')[0];
            var key = bb.split(':')[0];
            var val = bb.split(':')[1];
            var obj = {
                key: val
            };
            var str = url + ',' + val;
            $('.cd-canvas-tip').html('服务名称：</br><a style="color:#11B983;cursor:pointer;" data-url="' + str + '">' + node.nodeName + '</a>');
        } else {
            if (node.refAppVersion.indexOf(',') != -1) {
                var arr = node.refAppVersion.split(',');
            } else {
                var arr = [node.refAppVersion];
            }

            var html = '';
            for (var i = 0; i < arr.length; i++) {
                html += arr[i] + '</br>';
            }
            $('.cd-canvas-tip').html('应用名称:</br>' + node.nodeName + '</br>版本：</br>' + html);
        }


    })
    .on("mouseout", function(node) {
        $('.cd-canvas-tip').hide()
    })
    .call(force.drag); //将当前选中的元素传到drag函数中，使顶点可以被拖动

$('.cd-canvas-tip').on('mouseover', function() {
    $(this).show();
}).on('mouseleave', function() {
    $(this).hide();
});
$('.cd-canvas-tip').on('click', 'a', function() {
    var array = $(this).attr('data-url').split(',');
    var url = $state.href(array[0], {
        providerId: array[1]
    });
    window.open(url);
})
//圆圈的提示文字
circle.append("svg:title")
    .text(function(node) {
        var link = links[node.index];
    });

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter()
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") //在圆圈中加上数据  
    .style('fill', function(node) {
        var color; //文字颜色
        var link = links[node.index];
        color = "#fff";
        return color;
    }).attr('x', function(d) {
        // console.log(d.name+"---"+ d.name.length);
        var re_en = /[a-zA-Z]+/g;
        //如果是全英文，不换行
        if (d.name.match(re_en)) {
            d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 2)
                .text(function() {
                    return d.name;
                });
        }
        //如果小于四个字符，不换行
        else if (d.name.length <= 4) {
            d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 2)
                .text(function() {
                    return d.name;
                });
        } else {
            var top = d.name.substring(0, 4);
            var bot = d.name.substring(4, d.name.length);

            d3.select(this).text(function() {
                return '';
            });

            d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', -5)
                .text(function() {
                    return top;
                });

            d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 18)
                .text(function() {
                    return bot;
                });
        }
    });
/*document.getElementById('net').onmousemove = function (e) {
    console.log(e);
        $('.cd-canvas-tip').hide();
}*/
function tick() {

    circle.attr("transform", transform1); //圆圈
    text.attr("transform", transform2); //顶点文字
    edges_line.attr('d', function(d) {
        var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        return path;
    });

    /*edges_text.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
                bbox = this.getBBox();
                rx = bbox.x+bbox.width/2;
                ry = bbox.y+bbox.height/2;
                return 'rotate(180 '+rx+' '+ry+')';
            }
            else {
                return 'rotate(0)';
            }
    });*/
}

//设置连接线的坐标,使用椭圆弧路径段双向编码
function linkArc(d) {
    //var dx = d.target.x - d.source.x,
    // dy = d.target.y - d.source.y,
    // dr = Math.sqrt(dx * dx + dy * dy);
    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    //打点path格式是：Msource.x,source.yArr00,1target.x,target.y  

    return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
}
//设置圆圈和文字的坐标
function transform1(d) {
    return "translate(" + d.x + "," + d.y + ")";
}

function transform2(d) {
    return "translate(" + (d.x) + "," + d.y + ")";
}