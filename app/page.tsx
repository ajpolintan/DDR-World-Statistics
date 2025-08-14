import Image from "next/image";
import DDR_Randomizer from "@/components/DDR_Randomizer";
import DDR_Stats from "../components/DDR_Stats";

export default function Home() {
    

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

      <h1 className="text-4xl"> DDR World Statistics</h1>

      <h1 className="text-2xl">  Data collected from user: <a href="https://www.reddit.com/r/DanceDanceRevolution/comments/11odskw/spreadsheet_of_step_data_for_all_songs_and_charts/"
       target="_blank" className="text-fuchsia-400 transition-all ease-in-out hover:underline">Landpuddle</a>  </h1>

        <div className="w-full h-auto">
          <DDR_Stats svgWidth={1000} svgHeight={600} />
        </div>
        <DDR_Randomizer svgWidth={100} svgHeight={100} /> 
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
