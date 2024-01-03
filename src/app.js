const express = require('express');
const httpStatus = require('http-status');
const ApiError = require('./utils/ApiError');
const fileWorks = require('./utils/fileWorks');
const redditApi = require('./utils/redditApi');
const puppeteer = require('puppeteer');

const app = express();

// if (config.env !== 'test') {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// const filePath = '/Users/sharonowolabi/Desktop/web_automation_IG/src/accounts.txt';

// // Read file content
// const fileContent = fileWorks.readFile(filePath);

// if (fileContent) {
//   // Get lines from file content
//   const lines = fileWorks.getLines(fileContent);
//   console.log(lines);

//   // Get accounts from file
//   const accounts = fileWorks.getAccountsFromFile(filePath);
//   console.log(accounts);
// }

///reddit 
// const subreddit = 'memes'; // You can change this to any subreddit of your choice
//   console.log("i work");
//   redditApi.getRandomMemeWithTopComment(subreddit).then(({ memeUrl, topComment }) => {
//     console.log("i work 2");
//     if (memeUrl) {
//       console.log("i work3");
//     console.log('Download your meme:', memeUrl);
//     console.log('Top Comment:', topComment);
//     // Implement the logic to download and save the meme to your laptop
//   } else {
//     console.log('Failed to fetch meme with top comment.');
//   }
// });
app.get('/', async (req, res) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  // Create a new page
  const page = await browser.newPage();

  // Replace these with your actual credentials and login URL
  const username = 'your_username';
  const password = 'your_password';
  const loginUrl = 'https://www.instagram.com/';
  try {
    // Navigate to the login page
    await page.goto(loginUrl);
    await page.waitForSelector('input[name=username]');
    
    await page.type('input[name=username]', username); 
    await page.type('input[name=password]', password); 
    await page.click('button[type=submit]'); 
   
    
    await page.waitForSelector('svg[aria-label="New post"]'); 
    
    console.log('Successfully logged in!');

    // You can add further actions after login if needed

    // Send a response to the client
    res.send('Successfully logged in!');

  } finally {
    // Close the browser
    await browser.close();
  }
});

const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('server is up '+ port);
})
