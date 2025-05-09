# API Documentation

This document provides details about the available API endpoints, their purposes, request bodies, and response bodies.

**Base URL:** `https://redditgrambackend.vercel.app`

---

## Authentication APIs

### 1. `/auth/register`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/auth/register`  
**Purpose:** Registers a new user.  

#### Request Body:
```json
{
  "username": "user_name",
  "email": "user_email",
  "password": "user_password"
}
```

#### Response Body:
```json
{
  "message": "User registered successfully",
  "executed": true
}
```

---

### 2. `/auth/login`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/auth/login`  
**Purpose:** Logs in a user and provides a JWT token.  

#### Request Body:
```json
{
  "username": "user_name",
  "password": "user_password"
}
```

#### Response Body:
```json
{
  "message": "User logged in successfully",
  "token": "jwt_token",
  "user": {
    "username": "user_name",
    "email": "user_email",
    "credits": 100,
    "savedContent": []
  },
  "executed": true
}
```

---

### 3. `/auth/authenticate`
**Method:** GET  
**URL:** `https://redditgrambackend.vercel.app/auth/authenticate`  
**Purpose:** Verifies the validity of the provided JWT token.  

#### Request Headers:
```json
{
  "Authorization": "Bearer jwt_token"
}
```

#### Response Body:
```json
{
  "message": "User authenticated successfully",
  "executed": true
}
```

---

## Feed APIs

### Post Types Explanation
The `type` field in the response data indicates the type of content in the post. Below are the possible values:
- **`text-only`**: The post contains only text content.
- **`image-only`**: The post contains only an image.
- **`text+image`**: The post contains both text and an image.
- **`video-only`**: The post contains only a video.
- **`text+video`**: The post contains both text and a video.
- **`link`**: The post contains a link without any text, image, or video.

---

### Media Field Explanation
The `media` field in the response data provides details about the media content in the post. It is included only if the post contains an image or video. Below are the properties of the `media` field:
- **`url`**: The URL of the media (image or video).
- **`type`**: The type of media, which can be:
  - **`image`**: Indicates the media is an image.
  - **`video`**: Indicates the media is a video.

If the post does not contain any media, the `media` field will be omitted from the response.

---

### 1. `/feed/generalfeed`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/generalfeed`  
**Purpose:** Fetches the general feed from Reddit's popular subreddit.  

#### Request Body:
```json
{}
```

#### Response Body:
```json
{
  "message": "General feed fetched successfully",
  "executed": true,
  "data": [
    {
      "id": "post_id",
      "name": "post_name",
      "title": "post_title",
      "author": "post_author",
      "subreddit": "subreddit_name",
      "subredditId": "subreddit_id",
      "permalink": "post_permalink",
      "score": 123,
      "numComments": 45,
      "createdUtc": 1678901234,
      "type": "text-only", // See explanation above
      "media": {
        "url": "media_url",
        "type": "image" // See explanation above
      },
      "text": "post_text",
      "selftextHtml": "selftext_html",
      "description_html": "description_html"
    }
  ]
}
```

---

### 2. `/feed/specificfeed`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/specificfeed`  
**Purpose:** Fetches the feed for a specific subreddit.  

#### Request Body:
```json
{
  "subreddit": "subreddit_name"
}
```

#### Response Body:
```json
{
  "message": "Specific feed fetched successfully",
  "executed": true,
  "data": [
    {
      "id": "post_id",
      "name": "post_name",
      "title": "post_title",
      "author": "post_author",
      "subreddit": "subreddit_name",
      "subredditId": "subreddit_id",
      "permalink": "post_permalink",
      "score": 123,
      "numComments": 45,
      "createdUtc": 1678901234,
      "type": "image-only", // See explanation above
      "media": {
        "url": "media_url",
        "type": "image" // See explanation above
      },
      "text": "post_text",
      "selftextHtml": "selftext_html",
      "description_html": "description_html"
    }
  ]
}
```

---

### 3. `/feed/specificpost`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/specificpost`  
**Purpose:** Fetches details of a specific post using its ID.  

#### Request Body:
```json
{
  "subredditid": "post_id"
}
```

#### Response Body:
```json
{
  "message": "Specific feed fetched successfully",
  "executed": true,
  "data": {
    "id": "post_id",
    "name": "post_name",
    "title": "post_title",
    "author": "post_author",
    "subreddit": "subreddit_name",
    "subredditId": "subreddit_id",
    "permalink": "post_permalink",
    "score": 123,
    "numComments": 45,
    "createdUtc": 1678901234,
    "type": "text+video", // See explanation above
    "media": {
      "url": "media_url",
      "type": "video" // See explanation above
    },
    "text": "post_text",
    "selftextHtml": "selftext_html",
    "description_html": "description_html"
  }
}
```

---

### 4. `/feed/savepost`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/savepost`  
**Purpose:** Saves a specific post to the user's saved content and increases their credits by 50.  

#### Request Body:
```json
{
  "subredditid": "post_id",
  "title": "post_title",
  "permalink": "post_permalink"
}
```

#### Response Body:
```json
{
  "message": "Post saved successfully and credits increased by 50",
  "executed": true
}
```

---

### 5. `/feed/unsavepost`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/unsavepost`  
**Purpose:** Removes a specific post from the user's saved content.  

#### Request Body:
```json
{
  "subredditid": "post_id"
}
```

#### Response Body:
```json
{
  "message": "Post unsaved successfully",
  "executed": true
}
```

---

### 6. `/feed/getsavedposts`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/getsavedposts`  
**Purpose:** Retrieves all posts saved by the user.  

#### Request Body:
```json
{}
```

#### Response Body:
```json
{
  "message": "Saved posts retrieved successfully",
  "data": [
    {
      "subredditid": "post_id",
      "title": "post_title",
      "permalink": "post_permalink"
    }
  ],
  "executed": true
}
```

---

### 7. `/feed/ifusersavedpost`
**Method:** POST  
**URL:** `https://redditgrambackend.vercel.app/feed/ifusersavedpost`  
**Purpose:** Checks if a specific post is saved by the user.  

#### Request Body:
```json
{
  "subredditid": "post_id"
}
```

#### Response Body:
```json
{
  "message": "Saved posts retrieved successfully",
  "issaved": true,
  "executed": true
}
```

---

### 8. `/feed/fetchcredits`
**Method:** GET  
**URL:** `https://redditgrambackend.vercel.app/feed/fetchcredits`  
**Purpose:** Retrieves the user's current credit balance.  

#### Request Headers:
```json
{
  "Authorization": "Bearer jwt_token"
}
```

#### Response Body:
```json
{
  "message": "credits retrieved successfully",
  "credits": 150,
  "executed": true
}
```

---
