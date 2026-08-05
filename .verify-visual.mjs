import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  // Collect console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Navigate to chat
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const chatBtn = buttons.find(b => b.textContent.includes('Chat') || b.textContent.includes('信'));
    if (chatBtn) chatBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  // Send a message to trigger thinking + tool
  await page.evaluate(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = '今天看到一朵很美的花';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const sendBtn = buttons.find(b => b.getAttribute('aria-label') === '发送');
    if (sendBtn) sendBtn.click();
  });

  // Wait for tool call to appear
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '.verify-tool.png', fullPage: false });

  // Wait for thinking to appear
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '.verify-thinking.png', fullPage: false });

  // Wait for streaming to complete
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: '.verify-complete.png', fullPage: false });

  // Check states
  const states = await page.evaluate(() => {
    const texts = [...document.querySelectorAll('*')].map(el => el.textContent).join(' ');
    return {
      hasTool: texts.includes('去记忆里翻了翻') || texts.includes('在柜子里找了找') || texts.includes('翻了翻以前的信') || texts.includes('去花园走了走'),
      hasThinking: texts.includes('笔尖停了停') || texts.includes('想了想') || texts.includes('顿了顿') || texts.includes('笔尖悬在空中') || texts.includes('望向窗外'),
      hasLetter: texts.includes('我刚刚在花园里坐了一会儿'),
      toolCompleted: texts.includes('✓') || document.querySelectorAll('svg').length > 0,
    };
  });

  console.log('States:', JSON.stringify(states, null, 2));
  console.log('Errors:', errors.length ? errors : 'none');

  await browser.close();
}

main().catch(console.error);
