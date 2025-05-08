const fetch = require("node-fetch");
const btoa = require("btoa");
const dotenv = require("dotenv");
const { storeAccessToken, retrieveAccessToken } = require("../utils/getAccessToken"); // Import utility
const Content = require('../models/contentModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Assuming user model exists
const { addCredits } = require('./creditService'); // Import addCredits function
dotenv.config();

const RedditLogin = async () => {
  const auth = btoa(`${process.env.CLIENT_ID}:${process.env.SECRET_KEY}`);
  const data = new URLSearchParams({
    grant_type: "password",
    username: process.env.RedditUserName,
    password: process.env.RedditPassword,
  });

  const headers = {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "MyAPI/0.0.1",
  };

  try {
    let response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: headers,
      body: data,
    });

    let json = await response.json();

    if (response.ok && json.access_token) {
      // Store the access_token using the utility
      await storeAccessToken(json.access_token);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during Reddit login:", error);
    return false;
  }
};

async function canLoginToRedditByToken(accessToken) {
  try {
    const response = await fetch('https://oauth.reddit.com/api/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'node:reddit-check:v1.0 (by /u/your_username)'
      }
    });

    return response.ok; // true if 2xx, false otherwise
  } catch (error) {
    return false;
  }
}

const checkToken_or_Update = async () => {
  const accessToken = retrieveAccessToken(); 
  if (!accessToken) {
    console.log("No access token found, logging in to Reddit...");
    const loggedIn = await RedditLogin(); 
    console.log("Logged in to Reddit:", loggedIn); // Log the login status
    return loggedIn;
  }
  else
  {
    console.log("Access token found, checking validity...");
    const isValid = await canLoginToRedditByToken(accessToken); 
    if (!isValid) {
      console.log("Access token is invalid, logging in to Reddit...");
      const loggedIn = await RedditLogin(); 
      return loggedIn;
    } else {
      console.log("Access token is valid.");
      return true;
    }
  }
  }

  function normalizePost(post) {
    const d = post.data;
  
    // Detect content types
    const hasVideo = Boolean(d.is_video || d.secure_media?.reddit_video);
    const hasImage = d.post_hint === 'image' || (Array.isArray(d.preview?.images) && d.preview.images.length > 0);
    const hasText  = d.is_self && Boolean(d.selftext);
  
    // Determine media URL and type
    let mediaUrl = null;
    let mediaType = null;
    if (hasVideo) {
      mediaUrl  = d.secure_media.reddit_video.fallback_url;
      mediaType = 'video';
    } else if (hasImage) {
      mediaUrl  = d.preview.images[0].source.url.replace(/&amp;/g, '&');
      mediaType = 'image';
    }
  
    return {
      id:           d.id,
      name:         d.name,
      title:        d.title,
      author:       d.author,
      subreddit:    d.subreddit,
      subredditId:  d.subreddit_id || d.name,
      permalink:    `https://reddit.com${d.permalink}`,
      score:        d.ups,
      numComments:  d.num_comments,
      createdUtc:   d.created_utc,
      type:         hasVideo
                      ? (hasText ? 'text+video' : 'video-only')
                      : hasImage
                        ? (hasText ? 'text+image' : 'image-only')
                        : (hasText ? 'text-only' : 'link'),
      media:        mediaUrl ? { url: mediaUrl, type: mediaType } : undefined,
      text:         hasText ? d.selftext : undefined,
      selftextHtml: d.selftext_html || undefined,
      description_html: d.description_html || undefined,
    };
  }
  
  // Express handler
  const fetchGeneralFeed = async (req, res) => {
    try {
      // Ensure token is valid or refreshed
      const ok = await checkToken_or_Update();
      if (!ok) {
        return res.status(401).json({ message: "Reddit login failed", executed: false });
      }
  
      // Fetch the feed
      console.log("Fetching general feed...");
      const accessToken = retrieveAccessToken();
      const response = await fetch('https://oauth.reddit.com/r/popular', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'web:vertxai-assignment:v1.0 (by /u/your_actual_username)'
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching Reddit feed:", response.status, response.statusText, errorText);
        return res.status(response.status).json({ message: "Error fetching general feed", error: errorText });
      }
  
      console.log("Response is OK, parsing JSON...");
      const json = await response.json();
      const children = json.data.children || [];
  
      // Normalize
      const normalized = children.map(normalizePost);
  
      return res.status(200).json({ message: "General feed fetched successfully", executed: true, data: normalized });
  
    } catch (error) {
      console.error("Error fetching general feed:", error);
      return res.status(500).json({ message: "Error fetching general feed", executed: false });
    }
  };

const fetchSpecificFeed = async (req, res) => {
  try {
    // Ensure token is valid or refreshed
    const ok = await checkToken_or_Update();
    if (!ok) {
      return res.status(401).json({ message: "Reddit login failed", executed: false });
    }

    // Fetch the specific subreddit feed
    const accessToken = retrieveAccessToken();
    const subreddit = req.body.subreddit; // Get subreddit from request body
    console.log(`Fetching feed for subreddit: ${subreddit}...`);
    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'web:vertxai-assignment:v1.0 (by /u/your_actual_username)'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching subreddit feed:", response.status, response.statusText, errorText);
      return res.status(response.status).json({ message: "Error fetching specific feed", error: errorText });
    }

    console.log("Response is OK, parsing JSON...");
    const json = await response.json();
    const children = json.data.children || [];

    // Normalize
    const normalized = children.map(normalizePost);

    return res.status(200).json({ message: "Specific feed fetched successfully", executed: true, data: normalized });

  } catch (error) {
    console.error("Error fetching specific feed:", error);
    return res.status(500).json({ message: "Error fetching specific feed", executed: false });
  }
};

const fetchSpecificPost = async (req, res) => {
  try {
    // Ensure token is valid or refreshed
    const ok = await checkToken_or_Update();
    if (!ok) {
      return res.status(401).json({ message: "Reddit login failed", executed: false });
    }

    // Fetch the specific subreddit feed
    const accessToken = retrieveAccessToken();
    const subredditid = req.body.subredditid; // Get subreddit from request body
    console.log(`Fetching feed for subreddit: ${subredditid}...`);
    const response = await fetch(`https://oauth.reddit.com/api/info?id=${subredditid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'web:vertxai-assignment:v1.0 (by /u/your_actual_username)'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching subreddit feed:", response.status, response.statusText, errorText);
      return res.status(response.status).json({ message: "Error fetching specific feed", error: errorText });
    }

    console.log("Response is OK, parsing JSON...");
    const json = await response.json();
    const post = json.data.children[0] || [];

    // // Normalize
    const normalized = normalizePost(post);

    return res.status(200).json({ message: "Specific feed fetched successfully", executed: true, data: normalized });

  } catch (error) {
    console.error("Error fetching specific feed:", error);
    return res.status(500).json({ message: "Error fetching specific feed", executed: false });
  }
};

const savepost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user', executed: false });
    }

    const { subredditid, title, permalink } = req.body;

    // Check if the post already exists in savedContent
    const existingPost = user.savedContent.find(post => post.subredditid === subredditid);
    if (existingPost) {
      return res.status(400).json({ message: 'Post already saved', executed: false });
    }

    // Add the new post to savedContent
    user.savedContent.push({ subredditid, title, permalink });
    user.credits = user.credits || 0; // Ensure credits field exists
    user.credits += 50; // Increase credits by 50
    await user.save();

    // Increase user's credits by 50
   

    return res.status(201).json({ message: 'Post saved successfully and credits increased by 50', executed: true });
  } catch (error) {
    console.error('Error saving post:', error);
    return res.status(500).json({ message: 'Error saving post', error, executed: false });
  }
};

const unsavepost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user', executed: false });
    }

    const { subredditid } = req.body;

    // Remove the post from savedContent
    const initialLength = user.savedContent.length;
    user.savedContent = user.savedContent.filter(post => post.subredditid !== subredditid);

    if (user.savedContent.length === initialLength) {
      return res.status(404).json({ message: 'Post not found', executed: false });
    }

    await user.save();
    return res.status(200).json({ message: 'Post unsaved successfully', executed: true });
  } catch (error) {
    console.error('Error unsaving post:', error);
    return res.status(500).json({ message: 'Error unsaving post', error, executed: false });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user', executed: false });
    }

    return res.status(200).json({ message: 'Saved posts retrieved successfully', data: user.savedContent, executed: true });
  } catch (error) {
    console.error('Error retrieving saved posts:', error);
    return res.status(500).json({ message: 'Error retrieving saved posts', error, executed: false });
  }
};

const ifUserHasSavedPost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user', executed: false });
    }

    const { subredditid } = req.body;
    const hasSavedPost = user.savedContent.some(post => post.subredditid === subredditid);

    return res.status(200).json({ message: 'Saved posts retrieved successfully', issaved: hasSavedPost, executed: true });
  } catch (error) {
    console.error('Error retrieving saved posts:', error);
    return res.status(500).json({ message: 'Error retrieving saved posts', error, executed: false });
  }
};

const fetchcredits = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user', executed: false });
    }

    return res.status(200).json({ message: 'credits retrieved successfully', credits: user.credits, executed: true });
  } catch (error) {
    console.error('Error retrieving credits:', error);
    return res.status(500).json({ message: 'Error retrieving saved posts', error, executed: false });
  }
};

module.exports = { fetchGeneralFeed, fetchSpecificFeed, fetchSpecificPost, savepost, unsavepost, getSavedPosts ,ifUserHasSavedPost,fetchcredits};