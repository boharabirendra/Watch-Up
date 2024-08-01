export interface IVideo{
    playbackUrl: string;
    thumbnailUrl: string;
    commentCount: number;
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
    userVideos: [{
        userId: number;
        fullName: string;
        email: string;
        profileUrl: string;
    }]
}



