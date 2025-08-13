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
  Title: string
}
export default function DDR_Randomizer({ svgWidth, svgHeight }: D3Props) {
  const ref = useRef<SVGSVGElement | null>(null)

  const [clicked, setClicked] = useState(false)
  const [data, setData] = useState<DDR_SONG[]>([])
  const [songOne, setSongOne] = useState("")
  const [songTwo, setSongTwo] = useState("")
  const [songThree, setSongThree] = useState("")
  const [songFour, setSongFour] = useState("")

  const [ones, setOnes] = useState<DDR_SONG[]>([])

  // * LOAD IN DATA
  useEffect(() => {
    d3.csv<DDR_SONG>('/DDR_World.csv', d3.autoType).then((data) => {
      // * Songs grouped by data  
      const all_songs = d3.group(data, (data) => data.Rating);
      setData(data)
    })
  }, []) 

  

  // * RANDOMLY GENERATE SONGS BASED OFF CLICK
  const handleClick = () => {
    
    // * Get Unique Song Indices for each number
    const songSet = new Set<number>()
   
    // * Add song to the set
    while (songSet.size < 4) {
      songSet.add(Math.floor(Math.random() * data.length - 1))
    }
    
    // * get Song Indices
    const songArray = Array.from(songSet)
    
    // * Set the Songs
    setSongOne(data[songArray[0]].Title)
    setSongTwo(data[songArray[1]].Title)
    setSongThree(data[songArray[2]].Title)
    setSongFour(data[songArray[3]].Title)

    setClicked(true)
  };

  return (
    <div className='flex-col'>
      <button className="bg-teal-900 transition-all ease-in-out hover:bg-teal-950 rounded-3xl p-4 text-white mb-8" onClick={handleClick}> Randomly Generate a Set of Songs </button>
        <p>{songOne}</p>
        <p>{songTwo}</p>
        <p>{songThree}</p>
        <p>{songFour}</p>

    </div>
  )
}