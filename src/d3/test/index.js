var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(32," + (height / 2) + ")");

function update(data) {

    // DATA JOIN
    // Join new data with old elements, if any.
    var text = g.selectAll("text")
        .data(data);

    // UPDATE
    // Update old elements as needed.
    text.attr("class", "update");

    // ENTER
    // Create new elements as needed.
    //
    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.
    text.enter().append("text")
        .attr("class", "enter")
        .attr("x", function(d, i) {
            return i * 32;
        })
        .attr("dy", ".35em")
        .merge(text)
        .text(function(d) {
            return d;
        });

    // EXIT
    // Remove old elements as needed.
    text.exit().remove();
}

// The initial display.
update(alphabet);

// Grab a random sample of letters from the alphabet, in alphabetical order.
document.addEventListener('click',()=>{

    update(d3.shuffle(alphabet)
        .slice(0, Math.floor(Math.random() * 26))
        .sort());
})
