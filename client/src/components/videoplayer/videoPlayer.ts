import Hls from "hls.js";
import Plyr from "plyr";

interface PlyrOptions {
  controls: string[];
  quality: {
    default: number;
    options: number[];
    forced: boolean;
    onChange: (newQuality: number) => void;
  };
}

export class VideoPlayer {
  private videoElement: HTMLVideoElement;
  private hls: Hls | null = null;

  constructor(videoElement: HTMLVideoElement, source: string) {
    this.videoElement = videoElement;
    this.initializePlayer(source);
  }

  private initializePlayer(source: string) {
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(source);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = this.hls!.levels.map((l) => l.height);

        const defaultOptions: PlyrOptions = {
          controls: ["play-large", "restart", "rewind", "play", "fast-forward", "progress", "current-time", "duration", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
          quality: {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (e) => this.updateQuality(e),
          },
        };

        new Plyr(this.videoElement, defaultOptions);
        this.videoElement.muted = false;
      });

      this.hls.attachMedia(this.videoElement);
    }
  }

  private updateQuality(newQuality: number) {
    if (this.hls) {
      this.hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          this.hls!.currentLevel = levelIndex;
        }
      });
    }
  }
}
