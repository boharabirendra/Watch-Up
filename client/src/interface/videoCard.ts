export interface IVideo {
  playbackUrl: string;
  thumbnailUrl: string;
  _count: {
    userComment: number;
  };
  profileUrl: string;
  title: string;
  description: string;
  userEmail: string;
  likes: number;
  views: number;
  createdAt: Date;
  videoPublicId: string;
  isPublished: boolean;
  duration: number;
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    profileUrl: string;
  };
}
