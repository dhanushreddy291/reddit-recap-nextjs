import { Card, CardContent } from "@/components/ui/card"
import { Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AudioItem } from "@/types/audio"

interface AudioCardProps {
  audio: AudioItem
  onPlay: (audio: AudioItem) => void
  isPlaying: boolean
  isActive: boolean
}

export function AudioCard({ audio, onPlay, isPlaying, isActive }: AudioCardProps) {
  const imageUrl = audio.title.includes("Singularity") ? "/Singularity.png" : audio.title.includes("Home Automation") ? "/HomeAutomation.png" : "/LocalLLaMA.png";
  return (
    <Card className={`relative overflow-hidden transition-all hover:bg-accent ${isActive ? 'bg-accent' : ''}`}>
      <CardContent className="p-6">
        <div className="aspect-square bg-muted rounded-lg mb-4">
          <img
            src={imageUrl}
            alt="Audio thumbnail"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{audio.title}</h3>
            <p className="text-sm text-muted-foreground">News Source</p>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={() => onPlay(audio)}
          >
            <Play className="h-4 w-4" />
            <span className="sr-only">Play</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

