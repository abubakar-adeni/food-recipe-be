<h1 align="center">backend-recipes</h1>

# Pijar Camp Backend - Tugas

Backend API for RecipesApp and Recipes Web.

## Built with

- NodeJS
- ExpressJS
- PostgreSQL

## Packages used

- "argon2": "^0.30.3"
- "cloudinary": "^1.34.0"
- "cors": "^2.8.5"
- "dotenv": "^16.0.3"
- "express": "^4.18.2"
- "helmet": "^6.0.1"
- "jsonwebtoken": "^9.0.0"
- "multer": "^1.4.5-lts.1"
- "nodemailer": "^6.9.1"
- "pg": "^8.9.0"
- "uuid": "^9.0.0"
- "xss-clean": "^0.1.1"

## Features

- CRUD
- Sort, Pagination -> http://localhost:4000/recipe?sortby=created_at&sort=desc&page=1&limit=10
- Search by field -> http://localhost:4000/recipe?search=nasi
- Error Handling
- Upload and filter file/photo
- User registration with email verification
- Private routes

## .env example

```
DB_USER=
DB_PASS=
DB_PORT=
DB_HOST=
DB_NAME=

JWT_ACCESS_KEY=
JWT_REFRESH_KEY=

EMAIL_NAME=
EMAIL_PASSWORD=

BASE_URL=
PORT=

PHOTO_NAME=
PHOTO_KEY=
PHOTO_SECRET=
```
# Related Project

:rocket: [`Frontend Recipes App`](https://github.com/abubakar-adeni/foodNative)

:rocket: [`Backend Recipes App`](https://github.com/abubakar-adeni/food-recipe-be)

:rocket: [`Release APK`](https://github.com/abubakar-adeni/foodNative/tree/main/release)
