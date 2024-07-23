const puppeteer = require('puppeteer');

/**
 * 根据 URL 获取页面标题
 * @param {string} url - 要访问的 URL
 * 跳转地址格式
 * 快手格式：https://www.kuaishou.com/profile/3x8cyn9yphz3g5e
 * 抖音格式：https://www.douyin.com/user/MS4wLjABAAAA5bdY0LAPCBXMpgd9fqAOyqXfUtlYNgVozWx67Po1blo
 * 小红书格式：https://www.xiaohongshu.com/user/profile/5b74187d4f7b300001da9b6f
 */
const getPageTitle = async (url) => {
    const browser = await puppeteer.launch({
        executablePath: '/home/www/.cache/puppeteer/chrome/linux-119.0.6045.105/chrome-linux64/chrome', // 替换为实际的 Chrome 浏览器路径
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    if (url.includes('kuaishou.com')) {
        await page.setCookie(
            { name: 'kpf', value: 'PC_WEB', domain: 'www.kuaishou.com' },
            { name: 'clientid', value: '3', domain: 'www.kuaishou.com' },
            { name: 'did', value: 'web_34a157d6f55be2918e0f1901f79a32b2', domain: 'www.kuaishou.com' },
            { name: 'kpn', value: 'KUAISHOU_VISION', domain: 'www.kuaishou.com' }
        );
    }

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    if (url.includes('douyin.com')) {
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000))); // 等待 2 秒以确保 JavaScript 加载完成
    }

    const pageTitle = await page.title();
    await browser.close();

    return pageTitle;
};

const url = process.argv[2];
if (!url) {
    console.error('请提供要访问的 URL 作为命令行参数。');
    process.exit(1);
}

getPageTitle(url)
    .then(title => console.log(title))
    .catch(error => {
        console.error('获取页面标题时发生错误:', error);
        process.exit(1);
    });
