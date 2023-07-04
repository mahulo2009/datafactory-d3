function  parseFibreCentroids(result) {
    // Extract the WFS Centroids from data
    theWFSCentroids =   []
    for (const e0 of result.elements) {
        if (e0.name == "theWFSCentroids")
        {
            for (const e1 of e0.value.elements[0].value)
            {
                for (const e2 of e1.elements) {
                    if (e2.name == "fiberCentroidCharacterization")
                    {
                        theWFSCentroids.push(e2.value)

                    }
                }
            }
        }
    }

    return theWFSCentroids

}

function  parseWFSCentroids(result) {
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

    return theWFSCentroids

}

d3.json("https://raw.githubusercontent.com/mahulo2009/datafactory-d3/main/wfs/data/result.json")
    .then (function (result) 
{

    console.log("Load data")

    wfsCentroids = parseWFSCentroids(result)
    fibreCentroids = parseFibreCentroids(result)

    width = 512
    height = 512

    var scaleX
        = d3.scaleLinear()
            .domain([0,1024] )
            .range([0,width])

    var scaleY
        = d3.scaleLinear()
            .domain([1024, 0])
            .range([0,height])

    var svgFibregraph
        = d3.select ("#fibregraph")
            .append("svg")
            .attr("width",width)
            .attr("height",height)

            
    svgFibregraph
        .selectAll ("circle")
        .data(wfsCentroids)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", d=> scaleX(d.centroidPosition[0]))
        .attr("cy", d=> scaleY(d.centroidPosition[1]))
        .style("fill", "black");

    svgFibregraph
        .selectAll ("ellipse")
        .data(fibreCentroids)
        .enter()
        .append("ellipse")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("cx", d=> scaleX(d.centroidPosition[0]))
        .attr("cy", d=> scaleY(d.centroidPosition[1]))
        .style("fill", "red");

})