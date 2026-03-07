const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  console.log("Navigating to localhost:5173...");
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  console.log("Scrolling to projects...");
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  
  console.log("Clicking a project...");
  const cards = await page.$$('.project-card');
  if (cards.length > 0) {
    await cards[1].click();
    console.log("Clicked second project card.");
  } else {
    console.log("No project cards found!");
  }
  
  await page.waitForTimeout(2000);
  
  // Dump z-indices and interactions
  const info = await page.evaluate(() => {
    const detail = document.querySelector('.fixed.inset-0');
    if (!detail) return "ProjectDetail portal not found";
    const closeBtn = detail.querySelector('button');
    if (!closeBtn) return "Close button not found";
    
    return {
      detailClasses: detail.className,
      closeBtnClasses: closeBtn.className,
      hasImages: detail.querySelectorAll('img').length,
    };
  });
  console.log("DOM INFO:", info);
  
  await page.screenshot({ path: 'debug_project.png' });
  const html = await page.content();
  fs.writeFileSync('debug_project.html', html);
  
  console.log("Clicking close button...");
  try {
     const detail = await page.$('.fixed.inset-0 button');
     if (detail) {
         await detail.click({ timeout: 2000 });
         console.log("Close button clicked successfully.");
     }
  } catch(e) {
      console.log("FAILED to click close:", e.message);
  }
  
  await browser.close();
})();
