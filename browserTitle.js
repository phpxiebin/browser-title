const puppeteer = require('puppeteer');
/**
 * 跳转地址格式
 * 快手格式：https://www.kuaishou.com/profile/3x8cyn9yphz3g5e
 * 抖音格式：https://www.douyin.com/user/MS4wLjABAAAA5bdY0LAPCBXMpgd9fqAOyqXfUtlYNgVozWx67Po1blo
 * 小红书格式：https://www.xiaohongshu.com/user/profile/5b74187d4f7b300001da9b6f
 */
// 从命令行参数中读取 URL
const url = process.argv[2];
if (!url) {
  console.error('请提供要访问的 URL 作为命令行参数。');
  process.exit(1);
}
(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    // 如果 URL 包含 "kuaishou.com"，则设置 cookies
    if (url.includes('kuaishou.com')) {
        await page.setCookie(
            { name: 'kpf', value: 'PC_WEB', domain: 'www.kuaishou.com' },
            { name: 'clientid', value: '3', domain: 'www.kuaishou.com' },
            { name: 'did', value: 'web_34a157d6f55be2918e0f1901f79a32b2', domain: 'www.kuaishou.com' },
            { name: 'kpn', value: 'KUAISHOU_VISION', domain: 'www.kuaishou.com' }
        );
    }
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    // 如果是抖音则延迟1秒，加载完js再获取标题
    if (url.includes('douyin.com')) {
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    }
    const pageTitle = await page.title();
    console.log(pageTitle);
    await browser.close();
})();
