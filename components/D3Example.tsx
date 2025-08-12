'use client';

import { useEffect, createRef, useRef} from 'react'
import * as d3 from 'd3'

interface D3Props {
  svgWidth: number
  svgHeight: number
}

interface DDR_SONG {
  Jumps: number,
  Steps: number,
  Title: string
}
export default function D3Example({ svgWidth, svgHeight }: D3Props) {
  const ref = useRef<SVGSVGElement | null>(null)
  
  useEffect(() => {
    d3.csv<DDR_SONG>('DDR_WORLD.csv', d3.autoType).then((data) => {
        const sorted_jumps = data.sort((a,b) => { return d3.descending(a.Jumps,b.Jumps)}).filter(function(d,i){ return i < 10})
        console.log("TESTING")
        console.log(sorted_jumps)
        console.log(sorted_jumps[0].Jumps)
        console.log(sorted_jumps[sorted_jumps.length - 1].Jumps)
          
        //selects the current component
        const svg = d3.select(ref.current)

        
        const margin = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 40,
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
            .scaleBand()
            .domain(sorted_jumps.map((d) => d.Title))
            .range([0, width])
            .padding(0.1);

          const yScale = d3
                .scaleLinear()
                .domain([0, d3.max(sorted_jumps, (d) => d.Jumps)!])
                .nice()
                .range([height, 0]);


          //Create tooltip: Referenced from D3-Graph Gallery
          var tooltip = d3.select("body")
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
            .data(sorted_jumps)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(d.Title)!)
            .attr('y', (d) => yScale(d.Jumps))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.Jumps))
            .attr('fill', 'steelblue')
            .on("mouseover", function(event, d) {
              //Create tooltip
              tooltip.style("opacity",1)
                  .style("visibility", "visible")
                  .style("left", (event.pageX) + "px")
                  .style("top",  (event.pageY) + "px")
                  .html("<p> Jumps: " + d.Jumps  + "<br>Title: " + d.Title + "</p>" )
              console.log(d.Title)
            })
            .on("mouseout", function(event, d) { 
            
              tooltip.style("visibility", "hidden")
                  .style("stroke","none")
            })
          
          })
          

            
  },[])

  return <svg width={svgWidth} height={svgHeight} ref={ref} />
}