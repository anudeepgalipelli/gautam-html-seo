const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'https://anudeepgalipelli.github.io/gautam-html-seo/';
const OUTPUT_DIR = path.join(__dirname, 'test-report');

// Viewport configurations
const viewports = [
  { name: 'mobile-375', width: 375, height: 812, deviceScaleFactor: 2 },
  { name: 'mobile-390', width: 390, height: 844, deviceScaleFactor: 3 },
  { name: 'mobile-414', width: 414, height: 896, deviceScaleFactor: 3 },
  { name: 'tablet-768', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, deviceScaleFactor: 1 },
];

// Sections to test with their scroll targets
const sections = [
  { name: 'hero', selector: '#hero' },
  { name: 'about', selector: '#about' },
  { name: 'specialties', selector: '#specialties' },
  { name: 'services', selector: '#services' },
  { name: 'affiliations', selector: '#affiliations' },
  { name: 'testimonials', selector: '#testimonials' },
  { name: 'faq', selector: '#faq' },
  { name: 'contact', selector: '#contact' },
  { name: 'footer', selector: '.footer' },
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureSection(page, section, viewportName) {
  try {
    const el = await page.$(section.selector);
    if (!el) {
      console.log(`  ⚠️  Section ${section.name} not found`);
      return null;
    }
    
    // Scroll to section
    await el.scrollIntoViewIfNeeded();
    await delay(800); // Wait for animations
    
    // Take full-page screenshot of just this section area
    const bbox = await el.boundingBox();
    if (!bbox) {
      console.log(`  ⚠️  Section ${section.name} has no bounding box`);
      return null;
    }
    
    const screenshotPath = path.join(OUTPUT_DIR, `${viewportName}-${section.name}.png`);
    
    // For contact section on mobile, also take a wider crop to see overflow
    if (section.name === 'contact') {
      await page.screenshot({ 
        path: screenshotPath,
        clip: {
          x: 0,
          y: Math.max(0, bbox.y - 20),
          width: page.viewportSize().width,
          height: Math.min(bbox.height + 40, 2000)
        }
      });
    } else {
      await page.screenshot({ 
        path: screenshotPath,
        clip: {
          x: 0,
          y: Math.max(0, bbox.y - 20),
          width: page.viewportSize().width,
          height: Math.min(bbox.height + 40, 2000)
        }
      });
    }
    
    console.log(`  ✅ ${section.name}`);
    return screenshotPath;
  } catch (e) {
    console.log(`  ❌ ${section.name}: ${e.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting website test...');
  console.log(`📍 URL: ${URL}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  
  for (const viewport of viewports) {
    console.log(`\n📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log('─'.repeat(50));
    
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
      await delay(2000); // Wait for preloader and initial animations
      
      // Test each section
      for (const section of sections) {
        const screenshotPath = await captureSection(page, section, viewport.name);
        if (screenshotPath) {
          results.push({
            viewport: viewport.name,
            section: section.name,
            path: screenshotPath,
            width: viewport.width,
            height: viewport.height,
          });
        }
      }
      
      // Special test: Contact section horizontal scroll on mobile
      if (viewport.width <= 414) {
        console.log(`  🔍 Testing contact horizontal scroll...`);
        const contactSection = await page.$('#contact');
        if (contactSection) {
          await contactSection.scrollIntoViewIfNeeded();
          await delay(500);
          
          // Scroll the location cards horizontally
          const locationsContainer = await page.$('.contact-locations');
          if (locationsContainer) {
            await locationsContainer.evaluate(el => {
              el.scrollLeft = el.scrollWidth / 2;
            });
            await delay(500);
            
            const scrollPath = path.join(OUTPUT_DIR, `${viewport.name}-contact-scrolled.png`);
            await page.screenshot({ 
              path: scrollPath,
              clip: {
                x: 0,
                y: (await contactSection.boundingBox()).y - 20,
                width: viewport.width,
                height: 600
              }
            });
            results.push({
              viewport: viewport.name,
              section: 'contact-scrolled',
              path: scrollPath,
              width: viewport.width,
              height: viewport.height,
            });
            console.log(`  ✅ contact-scrolled`);
          }
        }
      }
      
      // Check for horizontal overflow
      console.log(`  🔍 Checking for horizontal overflow...`);
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          documentWidth: docWidth,
          windowWidth: winWidth,
          overflow: docWidth > winWidth,
          overflowAmount: docWidth - winWidth,
          overflowingElements: Array.from(document.querySelectorAll('*'))
            .filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.right > winWidth + 1 || rect.left < -1;
            })
            .map(el => ({
              tag: el.tagName,
              class: el.className,
              id: el.id,
              right: el.getBoundingClientRect().right,
              left: el.getBoundingClientRect().left,
            }))
            .slice(0, 10)
        };
      });
      
      console.log(`     Document: ${overflow.documentWidth}px, Window: ${overflow.windowWidth}px`);
      if (overflow.overflow) {
        console.log(`     ⚠️  OVERFLOW DETECTED: +${overflow.overflowAmount}px`);
        overflow.overflowingElements.forEach(el => {
          console.log(`        → ${el.tag}.${el.class}#${el.id} (right: ${el.right.toFixed(1)})`);
        });
      } else {
        console.log(`     ✅ No horizontal overflow`);
      }
      
      results.push({
        viewport: viewport.name,
        overflow: overflow,
      });
      
    } catch (e) {
      console.log(`  ❌ Error: ${e.message}`);
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // Generate HTML report
  generateReport(results, OUTPUT_DIR);
  
  console.log(`\n✅ Testing complete! Report saved to: ${OUTPUT_DIR}/report.html`);
}

function generateReport(results, outputDir) {
  const screenshots = results.filter(r => r.path);
  const overflowData = results.filter(r => r.overflow);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Test Report - Dr. Gautam Gorityala</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #10b981; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; }
    .timestamp { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    .section { margin-bottom: 3rem; }
    .section-title { font-size: 1.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #10b981; }
    .viewport-group { margin-bottom: 2rem; }
    .viewport-title { font-size: 1.125rem; color: #38bdf8; margin-bottom: 1rem; }
    .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .screenshot-card { background: #1e293b; border-radius: 0.5rem; overflow: hidden; border: 1px solid #334155; }
    .screenshot-card img { width: 100%; height: auto; display: block; }
    .screenshot-label { padding: 0.75rem; font-size: 0.875rem; color: #94a3b8; }
    .overflow-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .overflow-table th, .overflow-table td { padding: 0.75rem; text-align: left; border: 1px solid #334155; }
    .overflow-table th { background: #1e293b; color: #10b981; }
    .overflow-table td { background: #0f172a; }
    .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; }
    .badge-success { background: rgba(16,185,129,0.2); color: #10b981; }
    .badge-warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .badge-error { background: rgba(239,68,68,0.2); color: #ef4444; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .summary-card { background: #1e293b; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #334155; }
    .summary-card .number { font-size: 2rem; font-weight: 700; color: #10b981; }
    .summary-card .label { color: #94a3b8; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Website Test Report</h1>
    <p class="subtitle">Dr. Gautam Gorityala - Responsive Design Testing</p>
    <p class="timestamp">Generated: ${new Date().toISOString()}</p>
    <p class="timestamp">URL: ${URL}</p>
    
    <div class="summary-grid">
      <div class="summary-card">
        <div class="number">${viewports.length}</div>
        <div class="label">Viewports Tested</div>
      </div>
      <div class="summary-card">
        <div class="number">${screenshots.length}</div>
        <div class="label">Screenshots Captured</div>
      </div>
      <div class="summary-card">
        <div class="number">${overflowData.filter(d => d.overflow.overflow).length}</div>
        <div class="label">Overflow Issues Found</div>
      </div>
      <div class="summary-card">
        <div class="number">${sections.length}</div>
        <div class="label">Sections Tested</div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📊 Horizontal Overflow Analysis</h2>
      <table class="overflow-table">
        <tr>
          <th>Viewport</th>
          <th>Window Width</th>
          <th>Document Width</th>
          <th>Status</th>
          <th>Overflow</th>
        </tr>
        ${overflowData.map(d => `
        <tr>
          <td>${d.viewport}</td>
          <td>${d.overflow.windowWidth}px</td>
          <td>${d.overflow.documentWidth}px</td>
          <td>${d.overflow.overflow 
            ? '<span class="badge badge-error">OVERFLOW</span>' 
            : '<span class="badge badge-success">OK</span>'}</td>
          <td>${d.overflow.overflow ? `+${d.overflow.overflowAmount}px` : 'None'}</td>
        </tr>
        `).join('')}
      </table>
      ${overflowData.filter(d => d.overflow.overflow).length > 0 ? `
      <h3 style="margin-top: 1.5rem; color: #f59e0b;">⚠️ Overflowing Elements</h3>
      ${overflowData.filter(d => d.overflow.overflow).map(d => `
        <h4 style="margin-top: 1rem; color: #38bdf8;">${d.viewport}</h4>
        <ul style="margin-left: 1.5rem; color: #94a3b8;">
          ${d.overflow.overflowingElements.map(el => `<li>&lt;${el.tag}&gt; ${el.class ? '.' + el.class.split(' ').join('.') : ''} ${el.id ? '#' + el.id : ''} (right: ${el.right.toFixed(1)}px)</li>`).join('')}
        </ul>
      `).join('')}
      ` : ''}
    </div>
    
    ${viewports.map(vp => {
      const vpScreenshots = screenshots.filter(s => s.viewport === vp.name);
      return vpScreenshots.length > 0 ? `
    <div class="section">
      <h2 class="section-title">📱 ${vp.name} (${vp.width}x${vp.height})</h2>
      <div class="screenshot-grid">
        ${vpScreenshots.map(s => `
        <div class="screenshot-card">
          <img src="${path.basename(s.path)}" alt="${s.section}" loading="lazy">
          <div class="screenshot-label">${s.section}</div>
        </div>
        `).join('')}
      </div>
    </div>
      ` : '';
    }).join('')}
  </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(outputDir, 'report.html'), html);
}

runTests().catch(console.error);
