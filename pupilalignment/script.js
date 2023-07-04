console.log("Hello Data Factory v1.0")

function parsePupilPositionDistances(result) {

    for (const element of result.elements) {
        if (element.name == "pupilPositionDistances") {        
            pupilPositionDistances = element
        }

    }

    var data = []
    for (let i=0; i<84; i++)
    {
        data.push(pupilPositionDistances.value.elements[i].value);
    }

    return data;

}

function parseModulations(result) {
    
    for (const element of result.elements) {
        if (element.name == "modulations") {
            modulations = element
        }
    }

    var data = []
    for (let i=0; i<84; i++)
    {
        data.push(modulations.value.elements[i].value);
    }

    return data;
}

function parseLensLetIDs(result) {

    for (const element of result.elements) {
        if (element.name == "lensLetIDs") {
            lensLetIDs = element
        }
    }

    var data = []
    for (let i=0; i<84; i++)
    {
        data.push(lensLetIDs.value[i]);
    }

    return data;
}


d3.json
    ("https://raw.githubusercontent.com/mahulo2009/datafactory-d3/main/pupilalignment/data/result.json").then(
        function (result) {

            console.log("Data Loaded...");

            var pupilPositionDistances = parsePupilPositionDistances(result);
            var modulations = parseModulations(result);
            var lensLetIDs = parseLensLetIDs(result);

            rect_size = 20

            width = rect_size * 84
            height = rect_size * 13

            var pupilPositionDistancesScale  = d3.scaleLinear()
                .domain([22,195])
                .range([0+rect_size/2.0,height-rect_size/2.0])

            const colorScale = d3.scaleSequential()
                .domain([1, 0])
                .interpolator(d3.interpolateRdYlBu);

            var tooltip  = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")

            var svgMap = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", "yellow")

            svgMap
                .selectAll("rect")
                .data(modulations)
                .enter()
                .append("g")
                .on('click', (event, d ) => {
                    drawModulation(d)
                })
                .attr("transform", function (d, i) {
                    return "translate(" +  i * rect_size + ")" })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("width",rect_size)
                .attr("height",rect_size)
                .style('fill', d => colorScale(d))
                .attr("x",0)
                .attr("y", function(d,i,j) { 
                    return pupilPositionDistancesScale(pupilPositionDistances[0][i]) - rect_size/2.0 } )
                .on('mouseover', (event, d, i , j ) => {
                    tooltip.style('visibility', 'visible')
                        .html(
                            `
                                <b>Modulation:</b> ${d.toFixed(2)}<br>
                            `
                        )
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', () => {
                    tooltip.style('visibility', 'hidden');
                })

            var svgGraph = d3.select("#graph")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")

            function drawModulation(data) {

                var xScale = d3.scaleLinear()
                    .domain([0, data.length - 1])
                    .range([0 + 25 , width - 25]);

                var yScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([height-25, 0]);

                var axisX = d3.axisBottom (xScale)
                var axisY = d3.axisLeft (yScale)

                var modulationLine = d3.line()
                    .x(function(d, i) { return xScale(i); })
                    .y(function(d) { return yScale(d); });

                svgGraph
                    .append("path")
                    .datum(data)
                    .attr("d", modulationLine)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2);

                dots = svgGraph.selectAll(".dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d,i) { return xScale(i); })
                    .attr("cy", function (d) { return yScale(d); })
                    .transition()
                    .duration(5000)
                    .ease(d3.easeElastic)
                    .attr("r", 5)

                svgGraph.append("g")
                    .attr("transform","translate (0," + (height - 25) + ")")
                    .call(axisX)

                svgGraph.append("g")
                    .attr("transform","translate (" + 25 + ",0)")
                    .call(axisY)
                    
            }

        })