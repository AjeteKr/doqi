import { useState, useRef } from 'react'

const VideoPlayer = ({ 
  videoSrc = "/videos/doqishpk.mp4",
  posterSrc = "/images/video-thumbnail.jpg",
  className = "w-80 h-44"
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <>
      {/* Video Card */}
      <div className={`relative ${className} bg-black/10 backdrop-blur-md rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 glass-border select-none`} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
        {/* Video Element */}
        <video 
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover rounded-xl"
          poster={posterSrc}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-center select-none">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors mr-3 select-none focus:outline-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {isPlaying ? (
              // Pause Icon
              <svg className="w-8 h-8 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              // Play Icon
              <svg className="w-8 h-8 text-white ml-1 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={openFullscreen}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors select-none focus:outline-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <svg className="w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div className="relative w-full max-w-6xl aspect-video">
            <video 
              className="w-full h-full rounded-lg"
              controls 
              autoPlay
              onEnded={closeFullscreen}
              onClick={(e) => e.stopPropagation()}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for glassmorphism effect */}
      <style>{`
        .glass-border {
          border: 4px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(22.9px);
          -webkit-backdrop-filter: blur(22.9px);
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .glass-border::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          border-radius: 20px;
          z-index: -1;
        }
        }
        
        .glass-border::after {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </>
  )
}

export default VideoPlayer