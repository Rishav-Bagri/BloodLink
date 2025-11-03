import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  // Choose which GIF to use
//   const gifPostId = "18613534" // Red Blood Cells GIF
  const gifPostId = "11494917795013311479" // Unohana Bankai GIF

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Tenor GIF Embed */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="tenor-gif-embed w-full h-full blur-sm"
          data-postid={gifPostId}
          data-share-method="host"
          data-aspect-ratio="1.77778"
          data-width="100%"
        >
          <a href={`https://tenor.com/view/${gifPostId}`}>GIF</a>
        </div>
        <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
      </div>

      {/* Red overlay for contrast */}
      <div className="absolute inset-0 bg-red-900/50"></div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 text-center px-4">
        <h1 className="text-6xl font-black text-white drop-shadow-[0_0_15px_red] animate-pulse">
          BloodLink
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          <div
            onClick={() => navigate("/hospital")}
            className="px-8 py-4 bg-red-700 text-white rounded-xl font-bold shadow-2xl hover:bg-red-800 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-[0_0_20px_red]"
          >
            For Hospital
          </div>
          <div
            onClick={() => navigate("/camps")}
            className="px-8 py-4 bg-red-700 text-white rounded-xl font-bold shadow-2xl hover:bg-red-800 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-[0_0_20px_red]"
          >
            For Camps
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
