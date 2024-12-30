export interface AudioItem {
  id: number
  url: string
  title: string
}

export interface AudioPlayerState {
  currentTrack: AudioItem | null
  isPlaying: boolean
}

