console.log("Fibre calibration version v.0")

d3.json("https://raw.githubusercontent.com/mahulo2009/datafactory-d3/main/fibrecalibration/data/result.json")
    .then (function (result) {

    console.log("Fibre calibration data loaded!")

    // This is for debugging
    // window.result = result

    // Extract the WFS Centroids from data
    theWFSCentroids =   []
    for (const e0 of result.elements) {
        if (e0.name == "theWFSCentroids")
        {
            for (const e1 of e0.value.elements[0].value)
            {
                for (const e2 of e1.elements) {
                    if (e2.name == "centroidCharacterization")
                    {
                        theWFSCentroids.push(e2.value)

                    }
                }
            }
        }
    }

    var width   = 512;
    var height  = 512;

    var scaleX
        = d3.scaleLinear()
            .domain([0,1024] )
            .range([0,width])

    var scaleY
        = d3.scaleLinear()
            .domain([1024, 0])
            .range([0,height])

    var scaleRadius
            = d3.scaleLinear()
                .domain([0,15])
            .range([3, 5])

    var scaleFlux
        = d3.scaleLinear()
            .domain([0,d3.max( theWFSCentroids.map (function (d) { return d.flux.value} ))] )
            .range(["black","grey"])

    // Html UL (unsorted list)
    var svg
        = d3.select("#fibregraph")
            .append("svg")

    svg
        .attr("width",width)
        .attr("height",height)
        .selectAll("circle")
        .data(theWFSCentroids)
        .enter()
        .append("circle")
        .attr("r", "4")
        .attr("cx",function(d) { return scaleX(d.centroidPosition[0]) })
        .attr("cy", function (d) { return scaleY(d.centroidPosition[1]) })
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("flux", function (d) { return d.flux.value })
        //.attr("fill",function(d) { return scaleFlux(d.flux.value) })
        .on("mouseover",function(d) { drawTooltip(d) })
        .on("mouseout",function(d) { removeTooltip(d) })



        var slider = d3.select("#sliderFlux");
        slider.on("input", function () {
            var sliderValue = this.value;
            svg.selectAll("circle")
                .each(function () {
                    var circle = d3.select(this)

                    if (circle.attr("flux") < sliderValue) {
                        circle.attr("stroke", "red")
                    } else {
                        circle.attr("stroke", "black")
                    }

                })
        });        

        var tooltip =
            d3.select("body")
                .append("div")
                .attr("class", "tooltip")
        function drawTooltip(d) {
            tooltip
            .html(
                "<b>Centroid Characterization</b><br>" +
                "<b>Position:</b> " + d.centroidPosition[0].toFixed(1) + " " + d.centroidPosition[1].toFixed(1) + "<br>" +
                "<b>Sigma:</b> " + d.sigma[0].toFixed(1) + " " + d.sigma[1].toFixed(1) + "<br>" +
                "<b>Flux:</b> " + d.flux.value.toFixed(1))
            .style("top", d3.event.pageY + "px")
            .style("left", d3.event.pageX + "px")
            .style("opacity", 1)
    }
        function removeTooltip(d) {
            tooltip
                .style("opacity", 0)
        }

    })