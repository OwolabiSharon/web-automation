const snoowrap = require('snoowrap');
const fs = require('fs');
const axios = require('axios');
const got = require('got');
const { log } = require('console');
const path = require('path');

const reddit = new snoowrap({
  userAgent: 'web automation',
  clientId: 'ZIXBt3edvbW1bgNK8TJ5_g',
  clientSecret: 'NhOZhcOuz_6pIS3TAerhporB_2bqSg',
  username: 'Ubeus---',
  password: '@#Phone123',
});

const subredditList = ['blursed_videos', 'memes']; //switch to memes to test photos

// Function to select a random item from the list
function getRandomItem(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

// Select a random item from the list
const randomItem = getRandomItem(subredditList);

async function getRandomMemeWithTopComment() {
    try {
        console.log("getting meme");
      const posts = await reddit.getSubreddit(randomItem).getTop({ time: 'month', limit: 20 });
      const filteredPosts = posts.filter(post => !post.url.endsWith('.gif'));
      const postUrls = filteredPosts.map(post => post.url);

// Log the URLs
      console.log('Post URLs in meme options:', postUrls );
      if (filteredPosts.length > 0) {
        let videoUrl = null
        const randomPost = filteredPosts[Math.floor(Math.random() * filteredPosts.length)];
        console.log(randomPost.url, "post url", " number of valid memes", filteredPosts.length );

        const comments = await randomPost.comments.fetchAll({ limit: 1 });
        const topComment = comments.length > 0 ? comments[0].body : 'No comments available';
        if (randomPost.is_video) {
          console.log("meme is a video");
          videoUrl = randomPost.media.reddit_video.fallback_url
        }
        return { memeUrl: randomPost.url,videoUrl, topComment, title: randomPost.title };
      } else {
        return { memeUrl: "https://i.redd.it/x38c1c8mxlv21.jpg", topComment: "404 for real", title: "404 for real" };
      }
    
  } catch (error) {
    console.error('Error fetching meme with top comment:', error.message);
    return null;
  }
}

const downloadAndUploadFile = async (url, destinationPath) => {
    // Use axios to make a GET request to the specified URL with responseType set to 'stream'
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    console.log("downlord works");
    // Create a writable stream to the specified destinationPath
    const writer = fs.createWriteStream(destinationPath);
    console.log("downlord work");
    // Return a Promise that resolves when the file has finished writing
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
  
      // The 'finish' event is emitted when writing is complete
      writer.on('finish', resolve);
  
      // The 'error' event is emitted if there is an issue with the writing process
      writer.on('error', reject);
    });
  };
  

module.exports = { getRandomMemeWithTopComment, downloadAndUploadFile };
