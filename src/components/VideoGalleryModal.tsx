import React, { useState, useEffect, useRef } from 'react';
import { X, Play, X as XIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VideoGalleryModalProps {
  projectTitle: string;
  videos: string[];
  onClose: () => void;
}

export const VideoGalleryModal: React.FC<VideoGalleryModalProps> = ({ projectTitle, videos, onClose }) => {
  const { setIsOverlayActive } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set overlay state when modal opens/closes
  useEffect(() => {
    setIsOverlayActive(true);
    return () => setIsOverlayActive(false);
  }, [setIsOverlayActive]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedVideo) {
          // Stop video and return to gallery
          if (videoRef.current) {
            videoRef.current.pause();
          }
          setSelectedVideo(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle video playback
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [selectedVideo]);

  const handleVideoSelect = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setCurrentVideoIndex(videos.indexOf(videoUrl));
  };

  const handleNextVideo = () => {
    if (selectedVideo) {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      setCurrentVideoIndex(nextIndex);
      setSelectedVideo(videos[nextIndex]);
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideo) {
      const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
      setCurrentVideoIndex(prevIndex);
      setSelectedVideo(videos[prevIndex]);
    }
  };

  const handleCloseGallery = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  if (!selectedVideo) {
    // Gallery view
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={handleCloseGallery}
      >
        <div
          className="relative w-full max-w-6xl max-h-[90vh] bg-black/95 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/20 bg-black/80">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{projectTitle}</h2>
              <p className="text-xs text-white/60 mt-0.5">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={handleCloseGallery}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Grid */}
          <div className="p-4 sm:p-5 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {videos.map((videoUrl, index) => (
                <div
                  key={index}
                  onClick={() => handleVideoSelect(videoUrl)}
                  className="relative aspect-video rounded-lg cursor-pointer overflow-hidden transition-transform hover:scale-[1.02] shadow-lg"
                >
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                    <Play className="w-3 h-3 text-black fill-current" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video player view
  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={handleCloseGallery}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={selectedVideo}
            className="w-full h-full object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
            onEnded={handleNextVideo}
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevVideo}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous video"
          >
            ‹
          </button>
          <button
            onClick={handleNextVideo}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next video"
          >
            ›
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-black/80 border-b border-white/20">
          <div>
            <p className="text-xs text-white/60">Now Playing</p>
            <p className="text-sm font-semibold text-white">{projectTitle} — Video {currentVideoIndex + 1} of {videos.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedVideo(null)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              View Gallery
            </button>
            <button
              onClick={handleCloseGallery}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};