export interface IVideo{
    id?: number;
    title: string;
    description: string;
    playbackUrl: string;
    videoPublicId: string;
    duration: number;
    thumbnailUrl: string;
    isPublished?: boolean;
}

export type UploadVideo = {
    title: string;
    description: string;
    videoLocalPath: string;
    thumbnailLocalPath: string;
}

export type updateVideoInfo = Pick<IVideo, "title"| "description">;