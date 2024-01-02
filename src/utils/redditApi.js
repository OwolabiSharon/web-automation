const snoowrap = require('snoowrap');

const reddit = new snoowrap({
  userAgent: 'web automation',
  clientId: 'ZIXBt3edvbW1bgNK8TJ5_g',
  clientSecret: 'NhOZhcOuz_6pIS3TAerhporB_2bqSg',
  username: 'Ubeus---',
  password: '@#Phone123',
});

async function getRandomMemeWithTopComment(subreddit) {
    try {
        console.log("i work here");
        const posts = await reddit.getSubreddit(subreddit).getTop({ time: 'month', limit: 10 });
        console.log("i work here 2");
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    console.log(randomPost);
    // Get the top comment for the selected post
    const comments = await randomPost.comments.fetchAll({ limit: 1 });
    const topComment = comments.length > 0 ? comments[0].body : 'No comments available';
    console.log("i work here 4");
    return { memeUrl: randomPost.url, topComment };
  } catch (error) {
    console.error('Error fetching meme with top comment:', error.message);
    return null;
  }
}

module.exports = { getRandomMemeWithTopComment };
