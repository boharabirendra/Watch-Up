export interface ICommentCard{
    id: string;
    createdAt: Date,
    text: string;
    updatedAt: Date,
    user: {
        id: string;
        email: string;
        profileUrl: string;
        fullName: string
    }
}

