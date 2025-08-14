'use client';

import { useState, useEffect, createRef, useRef} from 'react'
import * as d3 from 'd3'

interface D3Props {
  svgWidth: number
  svgHeight: number
}

interface DDR_SONG {
  Jumps: number,
  Steps: number
  Rating: number,
  Crossovers: number,
  Holds: number,
  Title: string
  Chart_Length: number,
  True_BPM_max: number,
  Shock_Arrows: number
}
export default function DDR_Stats({ svgWidth, svgHeight }: D3Props) {
  const [selected, setSelected] = useState("")
  const ref = useRef<SVGSVGElement | null>(null)
  
  // * Data Changes Depending on What is Clicked
  const handleClick = (statistic: string) => {
    switch (statistic) {
        case "Jumps":
          setSelected("Jumps")
          break;
        case "Crossovers":
          setSelected("Crossovers")
          break;
        case "Steps":
          setSelected("Steps")
          break;
        case "Holds":
          setSelected("Holds")
          break;
        case "Max_BPM":
          setSelected("Max_BPM")
          break;
        case "Chart_Length":
          setSelected("Chart_Length")
          break;
        case "Shock_Arrows":
          setSelected("Shock_Arrows")
          break;
        default:
          setSelected("Jumps")
          break;
      } 
  }

  // * UseEffect Creates the Chart a it's loaded in 
  useEffect(() => {
    console.log(selected)

    d3.csv<DDR_SONG>('/DDR_World.csv', d3.autoType).then((data) => {
        let sorted_data: DDR_SONG[] = [] 

        // * Add every new stat here
        type SortKey = "Jumps" | "Crossovers" | "Steps" | "Holds" | "Song_Length" | "Chart_Length" |  "True_BPM_max" | "Shock_Arrows";

        // * Changes the chart based off button input. Default is Jumps. Sorted Data sorts by specific DDR Stat like Jumps or Crossovers. Stat is the statistic that will be evaluated

        let stat: SortKey = "Jumps"
        switch (selected) {
          case "Jumps":
            const sorted_jumps = data.sort((a,b) => { return d3.descending(a.Jumps,b.Jumps)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_jumps
            stat = "Jumps"
            break;
          case "Crossovers":
            const sorted_crossovers = data.sort((a,b) => { return d3.descending(a.Crossovers,b.Crossovers)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_crossovers
            stat = "Crossovers"
            break;
          case "Steps":
            const sorted_steps = data.sort((a,b) => { return d3.descending(a.Steps,b.Steps)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_steps
            stat="Steps"
            break;
          case "Holds":
            const sorted_holds = data.sort((a,b) => { return d3.descending(a.Holds,b.Holds)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_holds
            stat="Holds"
            break;
          case "Chart_Length":
            const sorted_length = data.sort((a,b) => { return d3.descending(a.Chart_Length,b.Chart_Length)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_length
            stat="Chart_Length"
            break;
          case "Max_BPM":
            const sorted_max_bpm = data.sort((a,b) => { return d3.descending(a.True_BPM_max,b.True_BPM_max)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_max_bpm
            stat="True_BPM_max"
            console.log(sorted_max_bpm)
            break;
          case "Shock_Arrows":
            const sorted_shocks = data.sort((a,b) => { return d3.descending(a.Shock_Arrows,b.Shock_Arrows)}).filter(function(d,i){ return i < 10})
            sorted_data = sorted_shocks
            stat="Shock_Arrows"
            break;
          default:
            setSelected("Jumps")
            break;
        } 
      
        // * Creates the SVG and the Chart
        const svg = d3.select(ref.current)

        svg.selectAll("*").remove();
        
        const margin = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 220,
        };

        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        const chart = svg
          .append('g')
          .attr(
            'transform',
            `translate(${margin.left},${margin.top})`,
          );

          // * Scales

          const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(sorted_data, (d) => d[stat])!])
            .range([0, width])

          const yScale = d3
                .scaleBand()
                .range([0, height])
                .domain(sorted_data.map((d) => d.Title))
                .padding(.1);

          // * Created Tooltips
          let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown> = d3.select("#tooltip");
          if (tooltip.empty()) {
              tooltip = d3.select("body")
                .attr("class", "tooltip")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "black")
                .style("color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");
          }


          // * X and Y Axis

          chart
              .append('g')
              .attr('class', 'axis axis-x')
              .attr('transform', `translate(0, ${height})`)
              .call(d3.axisBottom(xScale))
              .call((g) =>
                  g
                    .select('.tick:last-of-type text')
                    .clone()
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('font-weight', 'bold')
                    .attr('fill', 'steelblue')
                    .text('DDR SONGS'),
                )

          chart
              .append('g')
              .attr('class', 'axis axis-y')
              .call(d3.axisLeft(yScale).ticks(6))
              .call((g) =>
                g
                  .select('.tick:last-of-type text')
                  .clone()
                  .attr('x', 10)
                  .attr('text-anchor', 'start')
                  .attr('font-weight', 'bold')
                  .text('Number of Jumps'),
              );

          // * Bar Chart

          const bar = chart
              .selectAll('.bar')
              .data(sorted_data)
              .enter()
              .append('rect')
              .attr('class', 'bar')
              .attr('x', (d) => xScale(0))
              .attr('y', (d) => yScale(d.Title)!)
              .attr('height', yScale.bandwidth())
              .attr('width', 0)
              .attr('fill', '#800080')
              .transition()
              .duration(350)
              .attr('width', (d) => xScale(d[stat])!)
      

          // * Bar Hover Events
          bar.on("end", () => {

       
          chart
              .selectAll('.bar')
              .data(sorted_data)
              .on("mouseover", function(event, d) {
                    // *Create tooltip
                    tooltip.style("opacity",1)
                      .style("visibility", "visible")
                      .style("left", (event.pageX + 200) + "px")
                      .style("top",  (event.pageY) + "px")
                      .html(`<p> ${stat}: ` + d[stat]  + "<br>Title: " + d.Title + "<br> Rating: " + d.Rating + "</p>")
                    
                    // * Highlight hover
                    chart.selectAll(".bar")
                      .transition()
                      .duration(300) 
                      .style("fill", "#4B0082")
                    
                      // * Brush other data out
                    d3.select(this)
                      .transition()
                      .duration(300) 
                      .style("fill", "#800080")
                      .style("stroke","black")
              })
              .on("mouseout", function(event, d) { 
                    tooltip.style("visibility", "hidden")
                        .transition()
                        .duration(300)     
                        .style("stroke","none")
                    chart.selectAll(".bar")
                        .transition()
                        .duration(300) 
                        .style("fill", "#800080")
              }) 
                 })
    })
    
    // * END OF D3
  },[selected])


  // * Element that is returned

  return ( 
    <div>
      <div className='flex gap-4'> 
        <button className='text-white bg-teal-800 hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Jumps")}> Jumps</button>
        <button className='text-white bg-teal-800  hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Crossovers")}> Crossovers</button>
        <button className='text-white bg-teal-800  hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Steps")}> Steps</button>
        <button className='text-white bg-teal-800  hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Holds")}> Holds</button>
        <button className='text-white bg-teal-800  hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Shock_Arrows")}> Shock_Arrows </button>

      </div>
      <h1> Highest Number of {selected}</h1>
      <svg width={svgWidth} height={svgHeight} ref={ref} className='w-full h-auto'/>
    </div>
  )
}