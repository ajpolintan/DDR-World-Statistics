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
        default:
          setSelected("Jumps")
          break;
      } 


  }


  // * UseEffect Creates the Chart a it's loaded in 
  useEffect(() => {
    console.log(selected)

    d3.csv<DDR_SONG>('/DDR_World.csv', d3.autoType).then((data) => {

        const sorted_jumps = data.sort((a,b) => { return d3.descending(a.Jumps,b.Jumps)}).filter(function(d,i){ return i < 10})
        const sorted_steps = data.sort((a,b) => { return d3.descending(a.Steps,b.Steps)}).filter(function(d,i){ return i < 10})
        const sorted_holds = data.sort((a,b) => { return d3.descending(a.Holds,b.Holds)}).filter(function(d,i){ return i < 10})
        const sorted_crossovers = data.sort((a,b) => { return d3.descending(a.Crossovers,b.Crossovers)}).filter(function(d,i){ return i < 10})

        const songs = d3.group(data, (data) => data.Rating);
      
        //selects the current component
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

          const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(sorted_crossovers, (d) => d.Jumps)!])
            .range([0, width])

          const yScale = d3
                .scaleBand()
                .range([0, height])
                .domain(sorted_crossovers.map((d) => d.Title))
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
                
          chart
            .selectAll('.bar')
            .data(sorted_crossovers)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(0))
            .attr('y', (d) => yScale(d.Title)!)
            .attr('height', yScale.bandwidth())
            .attr('width', 0)
            .attr('fill', '#800080')
            .transition()
            .duration(1000)
            .attr('width', (d) => xScale(d.Crossovers)!)
      
          chart
            .selectAll('.bar')
            .on("mouseover", function(event, d) {
                  //Create tooltip
                  tooltip.style("opacity",1)
                      .style("visibility", "visible")
                      .style("left", (event.pageX + 200) + "px")
                      .style("top",  (event.pageY) + "px")
                      .html("<p> Jumps: " + d.Jumps  + "<br>Title: " + d.Title + "</p>" )
                  //Highlight hover
                  chart.selectAll(".bar")
                    .transition()
                    .duration(300) 
                    .style("fill", "#4B0082")
                  //Brush other data out
                  d3.select(this)
                  .transition()
                  .duration(300) 
                  .style("fill", "#800080")
                  .style("stroke","black")
                  console.log(d.Title)
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


          // * END OF D3
          

            
  },[selected])

  return ( 
    <div>
      <div className='flex gap-4'> 
        <button className='text-white bg-teal-800 hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Jumps")}> jumps</button>
        <button className='text-white bg-teal-800  hover:bg-teal-950 px-5 py-2.5' onClick={() => handleClick("Crossovers")}> crossovers</button>

      </div>
      <h1> Highest Number of Jumps</h1>
      <svg width={svgWidth} height={svgHeight} ref={ref} className='w-full h-auto'/>
    </div>
  )
}