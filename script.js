console.log("Hello Data Factory v1.0")

d3.json
    ("https://raw.githubusercontent.com/mahulo2009/datafactory-d3/main/data/result.json").then(
        function (result) {
            console.log("Data Loaded...")

            for (const element of result.elements) {
                //console.log(element.name)

                if (element.name == "pupilPositionDistances") {
                    pupilPositionDistances = element
                }

                if (element.name == "modulations") {
                    modulations = element
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
            var modulationValue = modulationsValue[0]

            var data = pupilPositionDistanceValue.map((value, index) => {
                return { x: value, y: modulationValue[index] };
            });

            console.log(data)

            width = 460
            height = 150

            var margin = {
                top: 10,
                right: 20,
                bottom: 30,
                left: 30
            };

            var scalePupilPositionDistanceValue = d3.scaleLinear()
                .domain([Math.min(...pupilPositionDistanceValue), Math.max(...pupilPositionDistanceValue)])
                .range([0 + margin.left, width - margin.right])

            var scaleModulationValue = d3.scaleLinear()
                .domain([0, 1])
                .range([height - margin.bottom, 0 + margin.top])


            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

            // Create a line generator
            const lineGenerator = d3.line()
                .x(function (d) { return scalePupilPositionDistanceValue(d.x) })
                .y(function (d) { return scaleModulationValue(d.y) })

            // Draw the line
            svg.append("path")
                .attr("d", lineGenerator(data))
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            var ejeY = d3.axisLeft(scaleModulationValue)
            svg.append("g")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(ejeY)

            var ejeX = d3.axisBottom(scalePupilPositionDistanceValue)
                .ticks(10)
                .tickFormat(d3.format(".3s"))

            svg.append("g")
                .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                .call(ejeX)

        })