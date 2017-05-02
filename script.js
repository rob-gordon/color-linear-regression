var ___data = [];
var ___slice = 20;
var width, height;
var svg, x, y, g;

function initGraph(data) {
    svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 70, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
}

function makeGraph(data) {

    x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    y = d3.scaleLinear().rangeRound([height, 0]);

    g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.hex; }));
    y.domain([0, data[0].count]);

    // X axis labels
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");


    // Y axis labels
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(20))
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Count");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.hex); })
            .attr("y", function(d) { return y(d.count); })
            .attr("fill", function(d) { return d.hex.slice(0, -2) })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.count); });
}

function updateGraph() {
    
    data = sliceData();
    
    x.domain(data.map(function(d) { return d.hex; }));
    y.domain([0, data[0].count]); //d3.max(data, function(d) { return d.count; })]);

    g.selectAll(".axis.axis--x")
        .transition()
        .duration(750)
        .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    //g.selectAll(".axis.axis-y").transition().duration(750).call(d3.axisLeft(y).ticks(20));
    var bars = g.selectAll('.bar').data(data);

    bars.exit()
        .transition()
        .duration(375)
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", y(0))
        .attr("height", height - y(0));

    // the "UPDATE" set:
    bars.transition().duration(375).attr("x", function(d) { return x(d.hex); })
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.hex); })
        .attr("y", function(d) { return y(d.count); })
        .attr("fill", function(d) { return d.hex.slice(0, -2) })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); });

}

function sliceData() {
    return ___data.filter(function(a) {
        return a.count > ___slice;
    });
}

function prepareData(data) {
    data.sort(function(a, b) {
        return b.count - a.count;
    });
    initGraph(sliceData());
    makeGraph(sliceData());
}

function sliceValUpdate(val) {
    document.querySelector('#mpc').value = val;
    ___slice = parseInt(val);
}

function onFileSelect() {
    var filename = document.getElementById('myfiles').files[0].name;
    socket.emit('setNewFileName', "/Users/robgordon/Desktop/"+filename);
}

/* Socket connections */

var socket = io.connect('http://localhost:4200');

socket.on('connect', function(data) { socket.emit('join', 'Connected...'); });
socket.on('imgData', function(data) {
    console.log('Recieved Image Data');
    console.log(data);
    ___data = data;
    prepareData(data);
});


/* DOM */
$(function() {

    $('svg').attr('width', ($('.svg-container').width()));

    $('.load-file').click(function() {
        socket.emit('run', true);
    });

    $('.update-graph').click(function() {
        updateGraph();
        updateGraph();
    });
});