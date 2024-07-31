
const config = {
    port: process.env.PORT,
    cors: {
        origin: process.env.CORS_ORIGIN
    },
    jwt: {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY
    },
    cloudinary:{
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET

    }
}

export default config;