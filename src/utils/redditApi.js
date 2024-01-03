const snoowrap = require('snoowrap');
const fs = require('fs');
const axios = require('axios');

const reddit = new snoowrap({
  userAgent: 'web automation',
  clientId: 'ZIXBt3edvbW1bgNK8TJ5_g',
  clientSecret: 'NhOZhcOuz_6pIS3TAerhporB_2bqSg',
  username: 'Ubeus---',
  password: '@#Phone123',
});

const subredditList = ['memes'];

// Function to select a random item from the list
function getRandomItem(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

// Select a random item from the list
const randomItem = getRandomItem(subredditList);

async function getRandomMemeWithTopComment() {
    try {
        console.log("i work here");
        const posts = await reddit.getSubreddit(randomItem).getTop({ time: 'month', limit: 20 });
      console.log("i work here 2");
      const jpegPosts = posts.filter(post => post.url.toLowerCase().endsWith('.jpeg') || post.url.toLowerCase().endsWith('.jpg'));
      if (jpegPosts.length > 0) {
        const randomPost = jpegPosts[Math.floor(Math.random() * jpegPosts.length)];
        console.log(randomPost.url, "post url",jpegPosts.length, posts.length );

        const comments = await randomPost.comments.fetchAll({ limit: 1 });
        const topComment = comments.length > 0 ? comments[0].body : 'No comments available';
        console.log("i work here 4");
        return { memeUrl: randomPost.url, topComment, title: randomPost.title };
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
