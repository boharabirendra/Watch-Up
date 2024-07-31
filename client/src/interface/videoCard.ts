export interface IVideo{
    playbackUrl: string;
    thumbnailUrl: string;
    profileUrl: string;
    title: string;
    description: string;
    userEmail: string;
    likes: number;
    views: number;
    createdAt: Date;
    videoPublicId: string;
    duration: number;
    id: number;
    userVideos: [{
        userId: number;
        fullName: string;
        email: string;
        profileUrl: string;
    }]
}



