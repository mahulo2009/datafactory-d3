console.log("Hello Data Factory v1.0")

d3.json
    ("https://raw.githubusercontent.com/mahulo2009/datafactory-d3/main/data/result.json").then(
        function (result) {
            console.log("Data Loaded...")


            for (const element of result.elements) {

                if (element.name == "pupilPositionDistances") {
                    console.log(element.name + ": " + element.value.elements.length)

                    pupilPositionDistances = element                    
                }

                if (element.name == "modulations") {
                    console.log(element.name + ": " + element.value.elements.length)

                    modulations = element
                }

                if (element.name == "lensLetIDs") {
                    console.log(element.name + ": " + element.value.length)

                    lensLetIDs = element
                }

            }


            pupilPositionDistancesValue = []

            for (const element of pupilPositionDistances.value.elements) {
                //console.log(element.name)
                pupilPositionDistancesValue.push(element.value)

            }
            //console.log(pupilPositionDistancesValue.length)

            modulationsValue = []

            for (const element of modulations.value.elements) {
                //console.log(modulations.name)
                modulationsValue.push(element.value)
            }
            //console.log(modulationsValue.length)

            var pupilPositionDistanceValue = pupilPositionDistancesValue[0]
            var data = modulationsValue

            console.log(data.length)

            width = 800
            height = 200

            var margin = {
                top: 10,
                right: 20,
                bottom: 30,
                left: 30
            };

            const colorScale = d3.scaleSequential()
                .domain([1, 0]) // Rango de valores en tu matriz
                .interpolator(d3.interpolateRdYlBu); // Escala de colores (puedes elegir otra interpolación)

            // Crea el tooltip
            const tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('background-color', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '5px')
                .style('font-size', '12px');


            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

            var radius = 4.5;
            var margining = 1;
            var cellSize = (radius * 2) + margining;

            svg.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + i * cellSize + ")"
                })
                .selectAll('circle')
                .data(function (d) { return d; })
                .enter()
                .append('circle')
                .attr('r', (_, i) => (radius))
                .attr('cx', (_, i) => (radius + margin.left))
                .attr('cy', (_, i) => (radius + i * cellSize + margin.top))
                .style('fill', d => colorScale(d))
                .on('mouseover', (event, d, i) => {

                    tooltip.style('visibility', 'visible')
                        .html(`Modulation: ${d.toFixed(2)}<br> 
                                Pupil Position: ${pupilPositionDistanceValue[0].toFixed(2)}<br> 
                                ${i}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', () => {
                    tooltip.style('visibility', 'hidden');
                });

        })