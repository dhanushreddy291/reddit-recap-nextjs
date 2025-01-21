'use client'

import { useState, useEffect } from 'react'
import { AudioCard } from '@/components/audio-card'
import { AudioPlayer } from '@/components/audio-player'
import { AudioItem, AudioPlayerState } from '@/types/audio'

export default function Home() {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([])
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
  })

  useEffect(() => {
    async function fetchAudio() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json()
        setAudioItems(data)
      } catch (error) {
        console.error('Error fetching audio:', error)
      }
    }

    fetchAudio()
  }, [])

  const handlePlay = (audio: AudioItem) => {
    if (playerState.currentTrack?.id === audio.id) {
      setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
    } else {
      setPlayerState({ currentTrack: audio, isPlaying: true })
    }
  }

  const handleNext = () => {
    if (!playerState.currentTrack) return
    const currentIndex = audioItems.findIndex(item => item.id === playerState.currentTrack?.id)
    const nextTrack = audioItems[currentIndex + 1] || audioItems[0]
    setPlayerState({ currentTrack: nextTrack, isPlaying: true })
  }

  const handlePrevious = () => {
    if (!playerState.currentTrack) return
    const currentIndex = audioItems.findIndex(item => item.id === playerState.currentTrack?.id)
    const previousTrack = audioItems[currentIndex - 1] || audioItems[audioItems.length - 1]
    setPlayerState({ currentTrack: previousTrack, isPlaying: true })
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold">Reddit Recap</h1>
        <h4 className='ml-0.5 mb-8'>Listen to summary of reddit posts from Singularity, Home Automation and LocalLLaMA, generated every 2 hours by AI (*the script is paused for now as I do not have sufficient BrightData credits to keep it running, you can find complete code here: https://dev.to/dhanushreddy29/reddit-recap-3j6d)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioItems.map((audio) => (
            <AudioCard
              key={audio.id}
              audio={audio}
              onPlay={handlePlay}
              isPlaying={playerState.isPlaying && playerState.currentTrack?.id === audio.id}
              isActive={playerState.currentTrack?.id === audio.id}
            />
          ))}
        </div>
      </main>
      <AudioPlayer
        currentTrack={playerState.currentTrack}
        isPlaying={playerState.isPlaying}
        onPlayPause={() => setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}

