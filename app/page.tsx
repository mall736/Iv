export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      
      {/* Header */}
      <div className="w-full max-w-xl mb-12">
        <h1 className="text-8xl font-black tracking-tighter text-black leading-none">
          Iv
        </h1>
        <div className="w-16 h-1 bg-red-600 mt-3" />
        <p className="text-sm font-medium tracking-widest uppercase text-black/40 mt-3">
          Paste a URL. Pick a format. Done.
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-xl">
        <div className="border-2 border-black flex items-center">
          <input
            type="text"
            placeholder="Paste video URL here..."
            className="flex-1 px-5 py-4 text-sm font-medium bg-white outline-none placeholder:text-black/30"
          />
          <button className="bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-red-600 transition-colors duration-200">
            Analyze
          </button>
        </div>
      </div>

    </main>
  );
}
