const { chromium } = require('playwright-chromium');
const { House, User } = require('../model');
require('dotenv').config();

console.log(process.env.JWT_SECRET);

async function fetchData({ email, password }) {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
  const browser = await chromium.launch({
    headless: false,
    ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
    ignoreHTTPSErrors: true,
    args: [
      '--disable-blink-features',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--start-maximized',
      `--user-agent="${userAgent}"`,
    ],
  });

  const page = await browser.newPage();

  await page.goto('https://login.funda.nl/account/login', {
    waitUntil: 'commit',
  });

  await page.click('#didomi-notice-agree-button');

  await page.fill('input[name="UserName"]', email);
  await page.fill('input[name="Password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL('https://www.funda.nl/');

  console.log('登录成功');

  await page.goto('https://www.funda.nl/zoeken/zoekopdracht/', {
    waitUntil: 'commit',
  });

  await page.click('a[href^="/zoeken/bewaarde-zoekopdracht/"]');

  const originPageReg = /https:\/\/www\.funda\.nl\/zoeken\/koop\/.+/;
  await page.waitForURL(originPageReg);

  let curPage = 1;

  const baseUrl = await page.url();

  const urls = [];

  while (true) {
    const list = await page.$$('[data-test-id="object-image-link"]');

    if (list?.length > 0) {
      for (let index = 0; index < list.length; index += 1) {
        const item = list[index];
        const href = await item.getAttribute('href');
        urls.push(href);
      }

      console.log('cur list length', list.length, 'total', urls.length);
      curPage += 1;
      await page.goto(`${baseUrl}&search_result=${curPage}`);
      await page.waitForURL(originPageReg);
    } else {
      console.log('no more data');
      break;
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getText(xpath, defaultText = '-') {
    let text = defaultText || '-';
    const element = await page.$(xpath);

    if (element) {
      text = await element.innerText();
    }

    return text;
  }

  for (let index = 0; index < urls.length; index += 1) {
    try {
      const url = urls[index];
      await page.goto(url, {
        waitUntil: 'load',
      });

      const headerContainer = await page.$('.object-header__container');
      let title = await page.title();
      let location = '';

      if (headerContainer) {
        const curText = (await headerContainer.innerText()).split('\n');
        title = curText[0];
        location = curText[1];
      }

      const images = await page.$$('img[src^="https://cloud.funda.nl/"]');

      const price = await getText(
        '//span[contains(text(), "€") and contains(text(), "k.k.")]',
      );

      const size = await getText('//dt[text()="Wonen"]/following-sibling::dd');

      const year = await getText(
        '//dt[text()="Bouwjaar"]/following-sibling::dd/span',
      );

      const description = await getText(
        '//div[contains(@class, "listing-description-text")]',
      );

      const vve = await getText(
        '//dt[text()="Bijdrage VvE"]/following-sibling::dd/span',
      );

      const prePrice = await getText(
        '//dt[text()="Vraagprijs per m²"]/following-sibling::dd/span',
      );

      let cover;
      if (images?.length > 0) cover = await images[0].getAttribute('src');

      const publishTime = await getText(
        '//dt[text()="Aangeboden sinds"]/following-sibling::dd/span',
      );

      const status = await getText(
        '//dt[text()="Status"]/following-sibling::dd/span',
      );

      const energy = await getText(
        '//dt[text()="Energielabel"]/following-sibling::dd/div/div/span',
      );

      const rooms = await getText(
        '//dt[text()="Aantal kamers"]/following-sibling::dd/span',
      );

      const type = await getText(
        '//dt[text()="Soort appartement"]/following-sibling::dd/span',
      );

      const watch = await getText(
        '//p[text()="Bekeken"]/preceding-sibling::p/strong',
      );

      const like = await getText(
        '//p[text()="Bewaard"]/preceding-sibling::p/strong',
      );

      const videoLinkElement = await page.$(
        "//a[contains(@href, 'media/video')]",
      );
      let video = '';
      let videoPoster = '';

      if (videoLinkElement) {
        await videoLinkElement.click();
        await sleep(1000);

        const curElement = await page.$('video');

        // console.log(curElement);

        if (curElement) {
          video = await curElement.getAttribute('src');
          videoPoster = await curElement.getAttribute('poster');
        }
      }

      const curItem = {
        url,
        title,
        cover,
        location,
        price,
        size,
        description,
        year,
        vve,
        prePrice,
        publishTime,
        status,
        energy,
        rooms,
        type,
        watch,
        like,
        video,
        videoPoster,
      };
      console.log('curItem', curItem);

      const res = await House.upsert(curItem, { url });
    } catch (err) {
      console.log(err);
    }
  }
}

async function main() {
  const users = await User.findAll();

  for (let index = 0; index < users.length; index += 1) {
    const user = users[index];

    console.log(user.email, user.password, user);

    const decryptedPassword = user.getDecryptedPassword();
    await fetchData({ email: user.email, password: decryptedPassword });
  }

  process.exit(0);
}

main();
