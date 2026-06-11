import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'screenshots');
const PDF_PATH = path.join(ROOT, 'Riyada-Website-Design-Review.pdf');

const baseUrl = process.env.BASE_URL || 'http://localhost:4173';

const pages = [
  {
    key: 'home-page',
    url: '/',
    title: 'Home Page',
    description: 'Landing page hero, brand message, highlights, and key navigation sections.'
  },
  {
    key: 'about-page',
    url: '/about',
    title: 'About Us',
    description: 'Vision, mission, values, and team overview.'
  },
  {
    key: 'services-page',
    url: '/services/speech-language-therapy',
    title: 'Services',
    description: 'Speech-language therapy service overview, process, and FAQs.'
  },
  {
    key: 'team-section',
    url: '/about',
    title: 'Team',
    description: 'Team section presentation (captured from the About page team area).' 
  },
  {
    key: 'booking-page',
    url: '/booking',
    title: 'Booking Page',
    description: 'Multi-step booking flow for selecting service, date, and time.'
  },
  {
    key: 'contact-page',
    url: '/contact',
    title: 'Contact / Visit Our Center',
    description: 'Contact form and center visit information.'
  }
];

const mobilePages = [
  { key: 'mobile-views', title: 'Mobile Responsive Views', description: 'Key pages captured at mobile viewport sizes.' }
];

const ensureDir = (p) => {
  fs.mkdirSync(p, { recursive: true });
};

const formatDate = (d = new Date()) => {
  // e.g. 2026-06-11
  return d.toISOString().slice(0, 10);
};

async function captureScreenshots() {
  ensureDir(OUT_DIR);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Wait helper
  const waitForNetworkIdle = async () => {
    try {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch {
      // ignore
    }
    await page.waitForTimeout(800);
  };

  for (const p of pages) {
    const fullUrl = baseUrl + p.url;
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
    await waitForNetworkIdle();

    // Special handling: team-section wants the team area; scroll near it for About page.
    if (p.key === 'team-section') {
      // Scroll to approx team section.
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.55, behavior: 'instant' }));
      await page.waitForTimeout(600);
    }

    const outPng = path.join(OUT_DIR, `${p.key}.png`);
    await page.screenshot({ path: outPng, fullPage: false });
    console.log(`Captured: ${outPng}`);
  }

  // Mobile responsive views: capture a single composite image by iterating mobile viewport across key pages.
  // We'll save one screenshot per key page and also a combined multi-capture by overwriting mobile-views.png from the last one.
  const mobileW = 390;
  const mobileH = 844;
  await page.setViewportSize({ width: mobileW, height: mobileH });
  for (const p of ['/', '/about', '/services/speech-language-therapy', '/booking', '/contact']) {
    await page.goto(baseUrl + p, { waitUntil: 'domcontentloaded' });
    await waitForNetworkIdle();
  }

  // Last loaded page screenshot as 'mobile-views.png'
  const mobileOut = path.join(OUT_DIR, `mobile-views.png`);
  await page.screenshot({ path: mobileOut, fullPage: false });
  console.log(`Captured: ${mobileOut}`);

  await browser.close();
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxCharsPerLine) {
      if (cur.trim()) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

async function buildPdf() {
  const pdfDoc = await PDFDocument.create();

  const pageWidth = 595.28; // A4 points
  const pageHeight = 841.89;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const marginX = 48;
  const top = 60;

  const drawHeaderLine = (docPage) => {
    docPage.drawLine({
      start: { x: marginX, y: pageHeight - 60 },
      end: { x: pageWidth - marginX, y: pageHeight - 60 },
      thickness: 1,
      color: rgb(0.1, 0.2, 0.4),
    });
  };

  const drawCover = async () => {
    const p = pdfDoc.addPage([pageWidth, pageHeight]);

    // Cover background
    p.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: rgb(0.98, 0.99, 1) });

    drawHeaderLine(p);

    // Branding logo if available
    const logoPathCandidates = [
      path.join(ROOT, 'assets', 'logo.png'),
      path.join(ROOT, 'assets', 'Riyada-logo.png'),
      path.join(ROOT, 'screenshots', 'home-page.png'),
    ];

    // Use website assets directly if present
    const websiteLogoCandidates = [
      path.join(ROOT, '..', 'website', 'app', 'public', 'logo', 'Riyada Center Logo Souce-01.png'),
      path.join(ROOT, '..', 'website', 'app', 'public', 'logo', 'Riyada Center Logo Souce-02.png'),
      path.join(ROOT, '..', 'designs', '02Logo', 'Riyada Center Logo Souce-01.png'),
      path.join(ROOT, '..', 'designs', '01BrandManual', 'Riyada Center.pdf'),
    ];

    let logoBytes = null;
    let logoImage = null;
    let logoW = 110;
    let logoH = 110;

    for (const lp of websiteLogoCandidates) {
      if (fs.existsSync(lp) && fs.statSync(lp).isFile()) {
        const ext = path.extname(lp).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
          logoBytes = fs.readFileSync(lp);
          if (ext === '.png') {
            logoImage = await pdfDoc.embedPng(logoBytes);
          } else {
            logoImage = await pdfDoc.embedJpg(logoBytes);
          }
          break;
        }
      }
    }

    const logoX = marginX;
    const logoY = pageHeight - 150;

    if (logoImage) {
      p.drawImage(logoImage, { x: logoX, y: logoY, width: logoW, height: logoH });
    } else {
      // fallback: draw a simple mark
      p.drawCircle({ x: logoX + 55, y: logoY + 55, r: 50, color: rgb(0.2, 0.35, 0.75) });
      p.drawText('R', { x: logoX + 48, y: logoY + 40, size: 36, font: fontBold, color: rgb(1, 1, 1) });
    }

    p.drawText('Client Review Package', { x: marginX + 130, y: pageHeight - 95, size: 18, font: fontBold, color: rgb(0.15, 0.25, 0.45) });

    p.drawText('Riyada Center', { x: marginX + 130, y: pageHeight - 125, size: 30, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    p.drawText('Website Design Review', { x: marginX + 130, y: pageHeight - 155, size: 16, font: fontBold, color: rgb(0.25, 0.3, 0.55) });

    const dateStr = formatDate();
    p.drawText(`Date generated: ${dateStr}`, { x: marginX, y: pageHeight - 220, size: 12, font: fontRegular, color: rgb(0.35, 0.35, 0.35) });

    const info = 'This package includes curated screenshots of key pages/sections and an approval section for feedback.';
    const lines = wrapText(info, 85);
    let y = pageHeight - 260;
    for (const line of lines) {
      p.drawText(line, { x: marginX, y, size: 12, font: fontRegular, color: rgb(0.25, 0.25, 0.25) });
      y -= 16;
    }

    // Page footer
    p.drawLine({ start: { x: marginX, y: 120 }, end: { x: pageWidth - marginX, y: 120 }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
    p.drawText('Riyada Center — Design & UX Review', { x: marginX, y: 80, size: 10, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });

    return p;
  };

  const drawSectionPage = async (title, description, imgPath, notesLabel) => {
    const p = pdfDoc.addPage([pageWidth, pageHeight]);

    p.drawText(title, { x: marginX, y: pageHeight - 60, size: 18, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
    p.drawText(description, { x: marginX, y: pageHeight - 85, size: 11, font: fontRegular, color: rgb(0.35, 0.35, 0.35) });

    drawHeaderLine(p);

    if (imgPath && fs.existsSync(imgPath)) {
      const imgBytes = fs.readFileSync(imgPath);
      let imgEmbed;
      const ext = path.extname(imgPath).toLowerCase();
      if (ext === '.png') imgEmbed = await pdfDoc.embedPng(imgBytes);
      else if (ext === '.jpg' || ext === '.jpeg') imgEmbed = await pdfDoc.embedJpg(imgBytes);

      const maxW = pageWidth - marginX * 2;
      const maxH = 520;
      const { width, height } = imgEmbed.scale(1);
      const scale = Math.min(maxW / width, maxH / height);
      const drawW = width * scale;
      const drawH = height * scale;

      p.drawImage(imgEmbed, {
        x: marginX,
        y: 200,
        width: drawW,
        height: drawH,
      });

      // Simple caption
      p.drawText('Screenshot (reference for feedback)', { x: marginX, y: 185, size: 10, font: fontRegular, color: rgb(0.45, 0.45, 0.45) });
    } else {
      p.drawText('Screenshot not found.', { x: marginX, y: 200, size: 12, font: fontBold, color: rgb(0.8, 0, 0) });
    }

    // Notes area
    p.drawRectangle({ x: marginX, y: 60, width: pageWidth - marginX * 2, height: 120, borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 1 });
    p.drawText(notesLabel, { x: marginX + 10, y: 165, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    p.drawText('Client notes:', { x: marginX + 10, y: 145, size: 10, font: fontRegular, color: rgb(0.25, 0.25, 0.25) });

    // Dotted lines
    const lineYStart = 130;
    for (let i = 0; i < 6; i++) {
      p.drawLine({
        start: { x: marginX + 10, y: lineYStart - i * 16 },
        end: { x: pageWidth - marginX - 10, y: lineYStart - i * 16 },
        thickness: 0.5,
        color: rgb(0.75, 0.75, 0.75),
      });
    }

    return p;
  };

  await drawCover();

  for (const p of pages) {
    const imgPath = path.join(OUT_DIR, `${p.key}.png`);
    await drawSectionPage(p.title, p.description, imgPath, 'Notes & Feedback (for this section)');
  }

  // Mobile views page
  await drawSectionPage(
    mobilePages[0].title,
    mobilePages[0].description,
    path.join(OUT_DIR, 'mobile-views.png'),
    'Notes & Feedback (mobile responsiveness)'
  );

  // Final approval page
  const approval = pdfDoc.addPage([pageWidth, pageHeight]);
  approval.drawText('Final Approval', { x: marginX, y: pageHeight - 60, size: 22, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
  drawHeaderLine(approval);

  approval.drawText('Please select the appropriate option after reviewing the screenshots and notes:', {
    x: marginX,
    y: pageHeight - 90,
    size: 12,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.35),
  });

  const optionsY = pageHeight - 160;
  const boxW = 220;
  const boxH = 50;

  const drawOption = (label, y) => {
    approval.drawRectangle({ x: marginX, y, width: boxW, height: boxH, borderColor: rgb(0.2, 0.2, 0.2), borderWidth: 1 });
    approval.drawText(label, { x: marginX + 14, y: y + 17, size: 14, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
  };

  drawOption('Approved', optionsY);
  drawOption('Requires Changes', optionsY - 65);

  approval.drawRectangle({ x: marginX, y: 95, width: pageWidth - marginX * 2, height: 70, borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 1 });
  approval.drawText('Additional Comments:', { x: marginX + 10, y: 145, size: 12, font: fontBold, color: rgb(0.25, 0.25, 0.25) });
  for (let i = 0; i < 3; i++) {
    approval.drawLine({
      start: { x: marginX + 10, y: 130 - i * 16 },
      end: { x: pageWidth - marginX - 10, y: 130 - i * 16 },
      thickness: 0.5,
      color: rgb(0.75, 0.75, 0.75),
    });
  }

  approval.drawText('Signature (optional): ___________________________', { x: marginX, y: 55, size: 10, font: fontRegular, color: rgb(0.25, 0.25, 0.25) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(PDF_PATH, pdfBytes);
}

async function main() {
  console.log(`BASE_URL: ${baseUrl}`);
  await captureScreenshots();
  await buildPdf();
  console.log(`PDF created at: ${PDF_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

