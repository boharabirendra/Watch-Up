export interface ICommentCard{
    id: string;
    createdAt: Date,
    text: string;
    owner: boolean;
    updatedAt: Date,
    user: {
        id: string;
        email: string;
        profileUrl: string;
        fullName: string
    }
}

