(async function getData() {
    let res = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    let dataset = await res.json()
    dataset = dataset.data
    // console.log(dataset)

    const margin = { top: 50, bottom: 50, left: 50, right: 50 }
    const width = 900;
    const height = 400;

    let svg = d3.select(".container")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("viewbox", [0, 0, width, height])
    // let timeFormat = d3.utcFormat("%Y-%m-%d")
    // console.log(d3.scaleUtc().ticks(d3.utcYear))

    let xTime = d3.scaleTime()
        .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
        .range([margin.left, width - margin.right ])

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height - margin.bottom, margin.top])

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xTime))

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale))

    let barXPosition = d => xTime(new Date(d[0]))

    let tooltip = d3.select(".container")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", "0")
        .text("A single tooltip");
    
    let mouseover = (d) => {
        // console.log(d)
        let date = (d.target.attributes["data-date"]["value"]).split('-')
        let price = (d.target.attributes["data-gdp"]["value"])
        let quarters = {'01':'Q1', '04':'Q2', '07':'Q3', '10': 'Q4'}
        return tooltip
            .style("top", (d.clientY-100) + "px")
            .style("left", (d.clientX+15) + "px")
            .style("opacity", "1")
            .attr("data-date", date.join('-'))
            .html(`${date[0]} ${quarters[date[1]]}<br>$${price}`)
    }
    let mouseleave = (d) => tooltip.style("opacity", "0")

    svg.append("g")
        .selectAll("rect")
        .data(dataset)
        .join("rect")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("class", "bar")
        .attr("x", barXPosition)
        .attr("width", 3)
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(0) - yScale(d[1]))
        .text(d=>d)
        .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", margin.left + 25)
        .attr("x", margin.top - 100)
        .attr("dy", ".75em")
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product");
    svg.node()
})()