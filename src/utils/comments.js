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



//main former endpoint

// const browser = await puppeteer.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     headless: false
//   });
//   // Create a new page
//   const page = await browser.newPage();

//   // Replace these with your actual credentials and login URL
//   const loginUrl = 'https://www.example.com/';
//   try {

//     // Navigate to the login page
//     await page.goto(loginUrl);
//     console.log("i work");
//     await page.waitForSelector('input[name=username]');
//     console.log("i work");
//     await page.type('input[name=username]', username); 
//     await page.type('input[name=password]', password); 
//     await page.click('button[type=submit]'); 
   
    
//     await page.waitForSelector('svg[aria-label="New post"]'); 
    
//     console.log('Successfully logged in!');

//     // You can add further actions after login if needed

//     // Send a response to the client
//     res.send('Successfully logged in!');

//   } finally {
//     // Close the browser
//     await browser.close();
//   }


// const browser = await puppeteer.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     headless: false
//   });
// const page = await browser.newPage();

// await page.goto('https://uppy.io/examples/', { "waitUntil": 'networkidle2' })
// await page.waitForSelector('.uppy-u-reset.uppy-c-btn.uppy-Dashboard-browse');
// console.log("found it");
// // await page.click('.uppy-u-reset uppy-c-btn uppy-Dashboard-browse');
// // const elementHandle = await page.$("button[class='button']");
// // await elementHandle.uploadFile('downloaded-file.jpg');
// //
// const [fileChooser] = await Promise.all([
//   page.waitForFileChooser(),
//   page.click('.uppy-u-reset.uppy-c-btn.uppy-Dashboard-browse'), // some button that triggers file selection
// ]);

// await fileChooser.accept(['downloaded-file.jpg'])
// await page.click('.uppy-u-reset.uppy-c-btn.uppy-StatusBar-actionBtn.uppy-StatusBar-actionBtn--upload.uppy-c-btn-primary');