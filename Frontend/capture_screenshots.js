import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const outputDir = path.resolve(__dirname, '../docs/images');

const sampleProducts = [
  {
    _id: 'p1',
    name: 'Dâu Tây Đà Lạt Cao Cấp',
    price: 165000,
    category: 'fruits',
    images: [{ url: '/src/assets/images/strawberry.jpg' }],
    rating: 5,
    stock: 25,
    discount: 10,
    description: 'Dâu tây đỏ mọng chuẩn VietGAP từ nông trại Đà Lạt.'
  },
  {
    _id: 'p2',
    name: 'Nho Đen Không Hạt Mỹ',
    price: 125000,
    category: 'fruits',
    images: [{ url: '/src/assets/images/nhodenkohat.jpg' }],
    rating: 4.9,
    stock: 40,
    discount: 15,
    description: 'Nho đen giòn ngọt, giàu chất chống oxy hoá.'
  },
  {
    _id: 'p3',
    name: 'Cam Sành Tiền Giang',
    price: 65000,
    category: 'fruits',
    images: [{ url: '/src/assets/images/camtiengiang.jpg' }],
    rating: 4.8,
    stock: 50,
    discount: 0,
    description: 'Cam sành mọng nước, vị ngọt thanh tự nhiên.'
  },
  {
    _id: 'p4',
    name: 'Bông Cải Xanh Đà Lạt',
    price: 38000,
    category: 'vegetables',
    images: [{ url: '/src/assets/images/bongcaixanh.png' }],
    rating: 5,
    stock: 30,
    discount: 5,
    description: 'Súp lơ xanh tươi giòn, giàu vitamin C và khoáng chất.'
  },
  {
    _id: 'p5',
    name: 'Cá Hồi Na Uy Tươi Phi Lê',
    price: 285000,
    category: 'meat',
    images: [{ url: '/src/assets/images/cahoinauy.png' }],
    rating: 5,
    stock: 15,
    discount: 20,
    description: 'Cá hồi nhập khẩu tươi sống, hàm lượng Omega-3 cao.'
  },
  {
    _id: 'p6',
    name: 'Bánh Mì Sandwich Lúa Mạch',
    price: 35000,
    category: 'bread',
    images: [{ url: '/src/assets/images/banhmisandwich.png' }],
    rating: 4.9,
    stock: 60,
    discount: 0,
    description: 'Bánh mì ngũ cốc nướng tươi mỗi ngày, tốt cho sức khoẻ.'
  }
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 800);
        }
      }, 60);
    });
  });
}

async function capture() {
  console.log('Launching browser with:', executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url().includes('/api/products')) {
      req.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(sampleProducts)
      });
    } else {
      req.continue();
    }
  });

  // 1. Home
  console.log('Capturing Home...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await autoScroll(page);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-home.png'), fullPage: true });
  console.log('✅ Saved screenshot-home.png');

  // 2. Shop
  console.log('Capturing Shop...');
  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1500));
  await autoScroll(page);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-shop.png'), fullPage: true });
  console.log('✅ Saved screenshot-shop.png');

  // 3. Cart
  console.log('Capturing Cart...');
  await page.goto('http://localhost:3000/cart', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await autoScroll(page);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-cart.png'), fullPage: true });
  console.log('✅ Saved screenshot-cart.png');

  // 4. About
  console.log('Capturing About...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await autoScroll(page);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-about.png'), fullPage: true });
  console.log('✅ Saved screenshot-about.png');

  // 5. Login
  console.log('Capturing Login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-login.png'), fullPage: false });
  console.log('✅ Saved screenshot-login.png');

  // 6. Admin Dashboard (Logged in)
  console.log('Capturing Admin Dashboard...');
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        displayName: 'Admin Hoa',
        email: 'admin001@gmail.com',
        role: 'admin',
        token: 'mock-jwt-token'
      })
    );
  });
  await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outputDir, 'screenshot-admin.png'), fullPage: true });
  console.log('✅ Saved screenshot-admin.png');

  await browser.close();
  console.log('🎉 All full-feature screenshots updated successfully!');
}

capture().catch(console.error);
