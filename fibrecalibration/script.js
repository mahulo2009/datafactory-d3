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
            .domain([0,1024] )
            .range([0,height])

    var scaleRadius
            = d3.scaleLinear()
                .domain([0,15])
                .range([3,7])

    var scaleFlux
        = d3.scaleLinear()
            .domain([0,d3.max( theWFSCentroids.map (function (d) { return d.flux.value} ))] )
            .range(["black","grey"])

    // Html UL (unsorted list)
    var svg
        = d3.select("body")
            .append("svg")

    svg
        .attr("width",width)
        .attr("height",height)
        .selectAll("circle")
        .data(theWFSCentroids)
        .enter()
        .append("circle")
        .attr("r",          function(d) { return scaleRadius(
                                                Math.sqrt(
                                                    Math.pow(d.sigma[0],2) + Math.pow(d.sigma[1],2)))
                                    })
        .attr("cx",function(d) { return scaleX(d.centroidPosition[0]) })
        .attr("cy",function(d) { return scaleY(d.centroidPosition[1]) })
        .attr("fill",function(d) { return scaleFlux(d.flux.value) })
        .on("mouseover",function(d) { drawTooltip(d) })
        .on("mouseout",function(d) { removeTooltip(d) })

        var tooltip = 
            d3.select("body")
                .append("div")
                .attr("class","tooltip")

        function  drawTooltip(d)
        {
            tooltip
                .text("Hi")
                .style("top",d3.event.pageY+"px")
                .style("left",d3.event.pageX+"px")
                .style("opacity",1)
        }

        function  removeTooltip(d)
        {
            tooltip
                .style("opacity",0)
        }

})

