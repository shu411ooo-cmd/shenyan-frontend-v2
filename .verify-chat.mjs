import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Take screenshot of current state
  await page.screenshot({ path: '.verify-initial.png' });

  // Check what buttons exist
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll('button')].map(b => ({
      text: b.textContent.trim().slice(0, 30),
      aria: b.getAttribute('aria-label'),
    }))
  );
  console.log('Buttons:', JSON.stringify(buttons, null, 2));

  // Try to find and click chat navigation
  const chatClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const chatBtn = btns.find(b =>
      b.textContent.includes('Chat') ||
      b.textContent.includes('信') ||
      b.getAttribute('aria-label')?.includes('chat')
    );
    if (chatBtn) {
      chatBtn.click();
      return chatBtn.textContent.trim();
    }
    return null;
  });
  console.log('Chat button clicked:', chatClicked);

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: '.verify-after-nav.png' });

  // Check if we're in chat by looking for textarea or specific elements
  const inChat = await page.evaluate(() => {
    return {
      hasTextarea: !!document.querySelector('textarea'),
      hasHeader: !!document.querySelector('header'),
      headerText: document.querySelector('header')?.textContent?.slice(0, 50),
    };
  });
  console.log('In chat:', JSON.stringify(inChat, null, 2));

  // If in chat, send message
  if (inChat.hasTextarea) {
    await page.type('textarea', '今天看到一朵很美的花');
    await new Promise(r => setTimeout(r, 500));

    const sendClicked = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const sendBtn = btns.find(b => b.getAttribute('aria-label') === '发送');
      if (sendBtn) { sendBtn.click(); return true; }
      return false;
    });
    console.log('Send clicked:', sendClicked);

    // Wait and screenshot at different stages
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: '.verify-stage1.png' });

    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '.verify-stage2.png' });

    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: '.verify-stage3.png' });

    // Check final DOM
    const final = await page.evaluate(() => {
      const allText = document.body.innerText;
      return {
        hasToolText: allText.includes('去记忆里翻了翻') || allText.includes('在柜子里找了找') || allText.includes('翻了翻以前的信') || allText.includes('去花园走了走'),
        hasThinkingText: allText.includes('笔尖停了停') || allText.includes('想了想') || allText.includes('顿了顿'),
        hasMessage: allText.includes('今天看到一朵很美的花'),
        messageCount: document.querySelectorAll('[class*="paper-texture"], [style*="warm-white"], [style*="oatmeal"]').length,
      };
    });
    console.log('Final state:', JSON.stringify(final, null, 2));
  }

  await browser.close();
}

main().catch(console.error);
