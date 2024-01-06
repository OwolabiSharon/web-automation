const express = require('express');
const ApiError = require('./utils/ApiError');
const fileWorks = require('./utils/fileWorks');
const redditApi = require('./utils/redditApi');
const puppeteer = require('puppeteer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();

app.use(express.json());


let caption = ""
const numberOfPostPerAccount = 5
let currentIndex = 0; // Index for cycling through accounts
let iterationsCount = 0;
let localFilePath = 'downloaded-file.jpg';

const filePath = 'src/accounts.txt';
const accounts = fileWorks.getAccountsFromFile(filePath);
const fileContent = fileWorks.readFile('src/tag-accounts.txt');
const tagAccountsList = fileWorks.getLines(fileContent)
console.log(accounts, tagAccountsList );


async function cancelPopUps(page, selector) {
  try {
    // Wait for the selector with a timeout of 5000 milliseconds (adjust as needed)
    const popUpExit = await page.waitForSelector(selector, { timeout: 5000 });

    if (popUpExit) {
      // Selector exists, click on it
      await popUpExit.click();
    } else {
      console.log('Selector not found. Continuing with the rest of the code.');
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('Selector not found within the specified timeout. Continuing with the rest of the code.');
    } else {
      throw error; // Re-throw other errors
    }
  }

  // Continue with the rest of your code after the try-catch block
  console.log('Code continues here.');
}

async function tagAccounts(page, tagAccount) {
  try {
    // Wait for the selector with a timeout of 5000 milliseconds (adjust as needed)
    const tagButton = await page.waitForSelector('._acan._acao._acas._aj1-._ap30', { timeout: 5000 });

    if (tagButton) {
      // Selector exists, click on it
      await tagButton.click();
      await page.waitForTimeout(5000);
      await page.type('input[type=search]', tagAccount);

      await page.waitForSelector('._acn5');

// Click the button (_acmr) inside the first child div of the parent div
    await page.click('._acn5 > div:first-child > button');
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      //commented out because isntagram is having issues with tags on photos i did it manually and it didnt work
      
      // await page.waitForSelector('._aazm', { timeout: 5000 });
      // await page.click('._aazm');
      
      // await page.waitForTimeout(5000);
      // await page.type('input[type=search]', tagAccount);

      // await page.waitForSelector('._acn5');

      // await page.click('._acn5 > div:first-child > button');
    } else {
      console.log(error);
    }
  }

  // Continue with the rest of your code after the try-catch block
  console.log('Code continues here.');
}


async function performLoginAndRecurringActions(account) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.instagram.com/accounts/login/');

    await page.waitForSelector('input[name=username]',{ timeout: 60000 });

    await page.type('input[name=username]', account.username);
    await page.type('input[name=password]', account.password);
    await page.click('button[type=submit]');
    await cancelPopUps(page, '._a9--._ap36._a9_1')
    // // Wait for navigation or any other action after login (replace with specific waiting conditions)
    await page.waitForSelector('svg[aria-label="New post"]',{ timeout: 60000 }); 
    
    console.log('Successfully logged in!');

    const recurringAction = async () => {
        console.log("i work");
        console.log("i work");
        const { memeUrl, videoUrl, topComment, title } = await redditApi.getRandomMemeWithTopComment();

      if (memeUrl) {
          const fileExtension = path.extname(memeUrl).toLowerCase();
          localFilePath = "downloaded-file" + fileExtension
          console.log(memeUrl, videoUrl, topComment, title, fileExtension + "gextentfile");
        if (videoUrl != null) {
            console.log("im video and i am not null");
            await redditApi.downloadAndUploadFile(videoUrl, "downloaded-file.mp4");
            await new Promise((resolve, reject) => {
              ffmpeg('downloaded-file.mp4')
                .output('downloaded-video.mp4')
                .videoCodec('libx264')
                .audioCodec('aac')
                .size('640x640')
                .outputOptions('-y')
                .on('end', () => {
                  console.log('Conversion finished!');
                  resolve();
                })
                .on('error', (err) => {
                  console.error('Error:', err);
                  reject(err);
                })
                .run();
            });
            localFilePath = "downloaded-video.mp4"
          } else {
            await redditApi.downloadAndUploadFile(memeUrl, localFilePath);
          }
          console.log(localFilePath, "path before posting meme");
          caption = Math.random() < 0.5 ? title : topComment;
        } else {
          console.log('Failed to fetch meme with top comment.');
        }
        postMeme(page, caption)
      iterationsCount++;

      if (iterationsCount >= numberOfPostPerAccount) {
        iterationsCount = 0; // Reset the counter
        currentIndex = (currentIndex + 1) % accounts.length; // Move to the next account

        // Stop recurring actions for the current account
        clearInterval(intervalId);
        console.log(`Stopped recurring actions for account ${account.username}`);
        cycleThroughAccounts()
      }
    };

    recurringAction()
    // Set an interval for the recurring actions (every 30-50 minutes in this example)
    const intervalId = setInterval(recurringAction, 30 * 60000); // Random interval between 30-50 minutes
    
  } finally {
    // Close the browser
    //await browser.close();
  }
}


async function postMeme(page, caption) {
  console.log("caption");
  try {
    const viewportSize = await page.viewport();
    const x = 10;
    const y = viewportSize.height - 10;
    await page.mouse.click(x, y);
    await page.click('svg[aria-label="New post"]');
    await page.waitForSelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iorvi4.x150jy0e.xjkvuk6.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1',{ timeout: 60000 }); 
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iorvi4.x150jy0e.xjkvuk6.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1'), // some button that triggers file selection
    ]);

    await fileChooser.accept([localFilePath])
    await cancelPopUps(page, '._acan._acap._acaq._acas._acav._aj1-._ap30')
    const nextSelector = ".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.xyamay9.x1pi30zi.x1l90r2v.x1swvt13.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1"
    await page.waitForSelector(nextSelector,{ timeout: 60000 }); 
    console.log("got it");
    await page.click(nextSelector);

    await page.waitForSelector(nextSelector,{ timeout: 60000 }); 
    console.log("got it");
    await page.click(nextSelector);

    await page.waitForSelector('div[role=textbox]',{ timeout: 60000 });
    console.log("find it, found");
    await page.type('div[role=textbox]', caption);
    for (const account of tagAccountsList) {
      await tagAccounts(page, account);
    }

    await page.waitForSelector(nextSelector,{ timeout: 60000 });
    console.log('Successfully logged in!');
    await page.click(nextSelector);

    await page.waitForTimeout(2 * 60000);
    console.log(" i work");
    await page.mouse.click(x, y);
  } catch (error) {
    console.log(error);
  }

}



// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

function cycleThroughAccounts() {
  const currentAccount = accounts[currentIndex];
  console.log(currentAccount, "current account");
  performLoginAndRecurringActions(currentAccount);
}


app.get('/', async (req, res) => {
  const currentAccount = accounts[currentIndex];
  performLoginAndRecurringActions(currentAccount);
});

const port = process.env.PORT || 4000


app.listen(port, () => {
  console.log('server is up '+ port);
})
