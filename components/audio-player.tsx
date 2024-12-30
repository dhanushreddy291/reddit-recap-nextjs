'use client'

import { useState, useRef, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { AudioItem } from "@/types/audio"

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  if (!currentTrack) return null

  const imageUrl = currentTrack.title.includes("Singularity") ? "/Singularity.png" : currentTrack.title.includes("Home Automation") ? "/HomeAutomation.png" : "/LocalLLaMA.png"

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={imageUrl}
            alt="Now playing"
            className="w-12 h-12 rounded"
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

