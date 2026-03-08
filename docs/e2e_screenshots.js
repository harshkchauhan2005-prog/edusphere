import puppeteer from 'puppeteer';

(async () => {
    console.log('Starting puppeteer tests...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Landing Page
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/d964f213-9244-43cd-9311-2cf9f04a51c7/stitch_landing.webp', type: 'webp' });
    console.log('Captured Landing Page');

    // 2. Login Page
    await page.goto('http://localhost:5174/login');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/d964f213-9244-43cd-9311-2cf9f04a51c7/stitch_login.webp', type: 'webp' });
    console.log('Captured Login Page');

    // 3. Register Page
    await page.goto('http://localhost:5174/register');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/d964f213-9244-43cd-9311-2cf9f04a51c7/stitch_register.webp', type: 'webp' });
    console.log('Captured Register Page');

    // Attempt Admin Login for Dashboard Screenshot
    try {
        await page.goto('http://localhost:5174/login');
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', 'admin1@edusphere.com');
        await page.type('input[type="password"]', 'password123');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/d964f213-9244-43cd-9311-2cf9f04a51c7/stitch_admin_dashboard.webp', type: 'webp' });
        console.log('Captured Admin Dashboard');
    } catch (e) {
        console.log('Could not capture Admin dashboard:', e.message);
    }

    await browser.close();
    console.log('Puppeteer tests completed.');
})();
