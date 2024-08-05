import api from "../../utils/axiosInerceptor";

export class ViewTracker {
  private videoId: string;
  private viewRecorded: boolean = false;
  private viewThreshold: number = 5000; 
  private timer: number | null = null;

  constructor(videoId: string) {
    this.videoId = videoId;
  }

  startTracking() {
    if (this.timer === null) {
      this.timer = setTimeout(() => this.recordView(), this.viewThreshold);
    }
  }

  stopTracking() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private async recordView() {
    if (!this.viewRecorded) {
      try {
        await api.put(`/videos/update-views/${this.videoId}`);
        this.viewRecorded = true;
      } catch (error) {
        console.error(`Failed to record view for video ${this.videoId}:`, error);
      }
    }
  }
}
