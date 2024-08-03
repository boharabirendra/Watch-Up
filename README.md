# WatchUp - Video Streaming Platform

WatchUp is a feature-rich video streaming platform that allows users to upload, share, and interact with videos. Built with modern web technologies, it provides a seamless experience for content creators and viewers alike.

## Database schema of WatchUp

![logo](/public/dbschema.png)

## Features

- User Authentication:
  - Sign up with email, password, fullname, profile picture (optional)
  - Login with existing credentials
  - Secure password hashing using bcryptjs

- Video Management:
  - Upload videos, if he/she has CREATER role (here we have two role VIEWER & CREATER)
  - Set video privacy (public/private)
  - Delete own videos
  - User can see number of likes & comments on their videos

- Interaction:
  - Like videos
  - Comment on videos
  - View like and comment counts

- User Profile:
  - View own uploaded videos
  - Manage video privacy settings
  - See video statistics (likes, comments)

- Responsive Design:
  - Mobile-friendly interface
  - Adaptive layout for various screen sizes

## Tech Stack

- Frontend:
  - HTML5
  - TypeScript
  - Tailwind CSS

- Backend:
  - Node.js
  - Express.js

- Database:
  - PostgreSQL
  - Prisma ORM

- Validation:
  - Joi

- Authentication:
  - JSON Web Tokens (JWT)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm 
- PostgreSQL 

## Setup

1. Clone the repository:

```sh

git clone git@github.com:boharabirendra/Watch-Up.git
cd Watch-Up
cd client & npm i
cd server & npm i

```
2. Set up environment variables by looking .env.example file:
Create a `.env` file in the root directory and add the following
3. Set up the database:
4. Start back end

```sh
    npm run start
```

5. Start frontend

```sh
    npm run dev
```


## API Endpoints

### User Management

- GET `/api/users/me`
  - Description: Get the current user's profile
  - Authentication: Required

- POST `/api/users/login`
  - Description: Authenticate a user
  - Body: Login credentials (validated by loginBodySchema)

- POST `/api/users/register`
  - Description: Register a new user
  - Body: User registration data (validated by registerUserBodySchema)

- PUT `/api/users/logout`
  - Description: Log out the current user
  - Authentication: Required

- PUT `/api/users/update-profile`
  - Description: Update user's profile picture
  - Authentication: Required
  - Body: Form-data with 'profile' file

- PUT `/api/users/update-user`
  - Description: Update user's information
  - Authentication: Required
  - Body: User update data (validated by updateBodySchema)

- PUT `/api/users/change-password`
  - Description: Change user's password
  - Authentication: Required
  - Body: Password change data (validated by changePasswordBodySchema)

Note: All endpoints are prefixed with `/api/users`. Authentication is handled by the `authenticate` middleware where required.



### Video Management

- GET `/api/videos/myvideos`
  - Description: Get the current user's videos
  - Authentication: Required

- GET `/api/videos/get-video/:id`
  - Description: Get a video by its ID
  - Authentication: Required

- GET `/api/videos/get-video/public/:videoPublicId`
  - Description: Get a public video by its public ID
  - Authentication: Not required

- GET `/api/videos/get-videos`
  - Description: Get videos (with filtering options)
  - Query Parameters: Validated by getUserQuerySchema

- GET `/api/videos/get-suggestion-videos/:videoPublicId`
  - Description: Get suggested videos based on a video's public ID

- PUT `/api/videos/publish/:id`
  - Description: Publish a video
  - Authentication: Required

- PUT `/api/videos/unpublish/:id`
  - Description: Unpublish a video
  - Authentication: Required

- PUT `/api/videos/update-views/:videoPublicId`
  - Description: Update view count for a video
  - Authentication: Required

- PUT `/api/videos/update-video/:videoId`
  - Description: Update video details
  - Authentication: Required
  - Body: Updated video data

- DELETE `/api/videos/delete/:id`
  - Description: Delete a video by its ID
  - Authentication: Required

- POST `/api/videos/add-video`
  - Description: Upload a new video
  - Authentication: Required
  - Authorization: User must have "CREATOR" role
  - Body: Video data (validated by videoReqBodySchema)

Note: All endpoints are prefixed with `/api/videos`. Authentication is handled by the `authenticate` middleware where required. Some endpoints have additional authorization or validation middleware.



### Like Management

- PUT `/api/likes/update-like/:videoPublicId`
  - Description: Update the like count for a video
  - Authentication: Required
  - Parameters: videoPublicId (in URL)

- GET `/api/likes/get-like-status/:videoPublicId`
  - Description: Get the like status of a video for the current user
  - Authentication: Required
  - Parameters: videoPublicId (in URL)

- GET `/api/likes/get-like-count/:videoPublicId`
  - Description: Get the total like count for a video
  - Authentication: Required
  - Parameters: videoPublicId (in URL)

Note: All endpoints are prefixed with `/api/likes`. Authentication is required for all endpoints and is handled by the `authenticate` middleware.


### Comment Management

- PUT `/api/comments/update/:id`
  - Description: Update a comment by its ID
  - Authentication: Required
  - Parameters: id (comment ID in URL)

- DELETE `/api/comments/delete/:id`
  - Description: Delete a comment by its ID
  - Authentication: Required
  - Parameters: id (comment ID in URL)

- GET `/api/comments/get-comments/:videoId`
  - Description: Get comments for a specific video
  - Authentication: Required (handled by commentAuthenticator)
  - Parameters: videoId (in URL)

- POST `/api/comments/create-comment`
  - Description: Create a new comment
  - Authentication: Required
  - Body: Comment data (parsed by commentBodyParser)

Note: All endpoints are prefixed with `/api/comments`. Authentication is required for all endpoints and is handled by the `authenticate` middleware, except for the GET endpoint which uses a custom `commentAuthenticator`.