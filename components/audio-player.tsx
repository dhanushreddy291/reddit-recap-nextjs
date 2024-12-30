'use client'

import { useState, useRef, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, FastForward } from 'lucide-react'
import { AudioItem } from "@/types/audio"
import Image from 'next/image'

interface AudioPlayerProps {
  currentTrack: AudioItem | null
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  isPlaying: boolean
}

export function AudioPlayer({ currentTrack, onPlayPause, onNext, onPrevious, isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime)
      const updateDuration = () => setDuration(audio.duration)

      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('loadedmetadata', updateDuration)

      return () => {
        audio.removeEventListener('timeupdate', updateTime)
        audio.removeEventListener('loadedmetadata', updateDuration)
      }
    }
  }, [currentTrack])

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  if (!currentTrack) return null

  const imageUrl = currentTrack.title.includes("Singularity") ? "/Singularity.png" : currentTrack.title.includes("Home Automation") ? "/HomeAutomation.png" : "/LocalLlama.png"

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 bg-pink-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={imageUrl}
            alt="Now playing"
            className="w-12 h-12 rounded"
            width={48}
            height={48}
            quality={100}
          />
          <div>
            <h4 className="font-medium">{currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground">News Source</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={onPlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-64">
          <span>{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={(value) => handleSeek(value)}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-2 w-32">
          <FastForward className="h-4 w-4" />
          <Slider
            value={[playbackRate]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => setPlaybackRate(value[0])}
          />
        </div>

        <div className="flex items-center gap-2 w-48">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={onNext}
        />
      </div>
    </div>
  )
}
