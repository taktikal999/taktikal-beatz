'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Share2, Download, Heart, Clock } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  title: string
  artist?: string
  coverImage?: string
  onLike?: () => void
  onShare?: () => void
  onDownload?: () => void
  isLiked?: boolean
  showWaveform?: boolean
}

export default function AudioPlayer({
  audioUrl,
  title,
  artist = 'Taktikal Beatz',
  coverImage,
  onLike,
  onShare,
  onDownload,
  isLiked = false,
  showWaveform = true,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [waveform, setWaveform] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      generateWaveform()
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const generateWaveform = () => {
    const bars = 50
    const waveformData = Array.from({ length: bars }, () => Math.random() * 100)
    setWaveform(waveformData)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
    if (audioRef.current) {
      audioRef.current.loop = !isLooping
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - ${artist}`,
        text: `Check out this beat: ${title}`,
        url: window.location.href,
      })
    } else if (onShare) {
      onShare()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-48 h-48 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="w-48 h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎵</div>
                <div className="font-semibold">{artist}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600">{artist}</p>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onDownload}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showWaveform && waveform.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                <span className="text-sm text-gray-600">{formatTime(duration)}</span>
              </div>
              
              <div className="relative h-12 mb-2">
                <div className="absolute inset-0 flex items-center">
                  {waveform.map((height, index) => {
                    const isActive = (index / waveform.length) * duration <= currentTime
                    return (
                      <div
                        key={index}
                        className={`flex-1 mx-0.5 rounded-sm transition-all duration-300 ${
                          isActive ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                        style={{
                          height: `${height}%`,
                          transform: `scaleY(${isActive ? 1.2 : 1})`,
                        }}
                      />
                    )
                  })}
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={toggleLoop}
                className={`p-2 rounded-full transition-colors ${
                  isLooping 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
              
              <button
                onClick={skipBackward}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>
              
              <button
                onClick={skipForward}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              
              <button
                onClick={toggleLoop}
                className={`p-2 rounded-full transition-colors ${
                  isLooping 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                
                <div className="w-32">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
              <p className="text-gray-500 text-sm mt-2">Loading audio...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Bitrate</div>
            <div className="font-semibold">320 kbps</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Format</div>
            <div className="font-semibold">MP3/WAV</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">License</div>
            <div className="font-semibold">Standard</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">BPM</div>
            <div className="font-semibold">140</div>
          </div>
        </div>
      </div>
    </div>
  )
}