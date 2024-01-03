const express = require('express');
const ApiError = require('./utils/ApiError');
const fileWorks = require('./utils/fileWorks');
const redditApi = require('./utils/redditApi');
const puppeteer = require('puppeteer');

const app = express();

app.use(express.json());

let caption = ""
const numberOfPostPerAccount = 5
let currentIndex = 0; // Index for cycling through accounts
let iterationsCount = 0;
const localFilePath = 'downloaded-file.jpg';

const filePath = 'src/accounts.txt';
const accounts = fileWorks.getAccountsFromFile(filePath);
console.log(accounts);

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

    // // Wait for navigation or any other action after login (replace with specific waiting conditions)
    await page.waitForSelector('svg[aria-label="New post"]',{ timeout: 60000 }); 
    
    console.log('Successfully logged in!');

    const recurringAction = async () => {
        console.log("i work");
        console.log("i work");
        const { memeUrl, topComment, title } = await redditApi.getRandomMemeWithTopComment();
        console.log("i work 2");

        if (memeUrl) {
          console.log(memeUrl, topComment, title);
          await redditApi.downloadAndUploadFile(memeUrl, localFilePath);
          caption = title || topComment;
        } else {
          console.log('Failed to fetch meme with top comment.');
        }
        console.log(caption, "caption before post meme");
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
    await page.click('svg[aria-label="New post"]');
    await page.waitForSelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iorvi4.x150jy0e.xjkvuk6.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1',{ timeout: 60000 }); 

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1iorvi4.x150jy0e.xjkvuk6.x1e558r4.x1n2onr6.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1'), // some button that triggers file selection
    ]);

    await fileChooser.accept(['downloaded-file.jpg'])
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


    await page.waitForSelector(nextSelector,{ timeout: 60000 });
    console.log('Successfully logged in!');
    await page.click(nextSelector);

    await page.waitForTimeout(60000);
    await page.click('.x1i10hfl.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x6s0dn4.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x1ypdohk.x78zum5.xl56j7k.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha.xcdnw81');
  } catch (error) {
    console.log(error);
  }

}



// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

function cycleThroughAccounts() {
  const currentAccount = accounts[currentIndex];
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
