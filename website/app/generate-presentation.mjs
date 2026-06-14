import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '../project-presentation/screenshots');
const PDF_OUT = path.join(__dirname, '../project-presentation/Riyada-Medical-Centre-Presentation.pdf');

const PAGES = [
  { path: '/',                              name: 'Home' },
  { path: '/about',                         name: 'About' },
  { path: '/services',                      name: 'Services-Overview' },
  { path: '/services/assessments',          name: 'Assessments' },
  { path: '/services/aba-therapy',          name: 'ABA-Therapy' },
  { path: '/services/speech-language',      name: 'Speech-Language-Therapy' },
  { path: '/services/occupational-therapy', name: 'Occupational-Therapy' },
  { path: '/packages',                      name: 'Packages' },
  { path: '/booking',                       name: 'Booking' },
  { path: '/contact',                       name: 'Contact' },
];

const MODES = [
  { locale: 'en', theme: 'light', label: 'English — Light Mode' },
  { locale: 'en', theme: 'dark',  label: 'English — Dark Mode'  },
  { locale: 'ar', theme: 'light', label: 'Arabic — Light Mode'  },
  { locale: 'ar', theme: 'dark',  label: 'Arabic — Dark Mode'   },
];

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function setLocaleAndTheme(page, locale, theme) {
  await page.evaluate((loc, thm) => {
    localStorage.setItem('riyada.locale', loc);
    localStorage.setItem('theme-mode', thm);
  }, locale, theme);
}

async function applyThemeClass(page, theme) {
  await page.evaluate((thm) => {
    if (thm === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, theme);
}

async function captureScreenshots() {
  console.log('Launching browser…');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const captured = []; // { file, pageLabel, modeLabel }

  for (const mode of MODES) {
    for (const pg of PAGES) {
      const slug = `${mode.locale}-${mode.theme}-${pg.name}`;
      const file = path.join(SCREENSHOTS_DIR, `${slug}.png`);

      console.log(`  Capturing: ${slug}`);

      // First visit to set localStorage
      await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await setLocaleAndTheme(page, mode.locale, mode.theme);

      // Reload so React re-reads localStorage on mount
      await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });

      // Ensure theme class is correct (ThemeInitializer may not have fired yet)
      await applyThemeClass(page, mode.theme);

      // Wait for animations to settle
      await new Promise(r => setTimeout(r, 1800));

      await page.screenshot({ path: file, fullPage: true });
      captured.push({ file, pageLabel: pg.name.replace(/-/g, ' '), modeLabel: mode.label });
    }
  }

  await browser.close();
  console.log(`\nAll ${captured.length} screenshots saved to project-presentation/screenshots/`);
  return captured;
}

async function buildPDF(captured) {
  console.log('\nBuilding PDF…');

  const doc = new PDFDocument({
    autoFirstPage: false,
    size: [1440, 900],
    margin: 0,
  });

  doc.pipe(fs.createWriteStream(PDF_OUT));

  // ── Cover page ────────────────────────────────────────────────────────────
  doc.addPage({ size: [1440, 900], margin: 0 });
  doc.rect(0, 0, 1440, 900).fill('#3355EE');

  doc.fillColor('#FFFFFF');

  doc
    .font('Helvetica-Bold')
    .fontSize(52)
    .text('Riyada Medical Centre', 0, 280, { align: 'center', width: 1440 });

  doc
    .font('Helvetica')
    .fontSize(32)
    .text('مركز ريادة الطبي', 0, 350, { align: 'center', width: 1440 });

  doc
    .font('Helvetica')
    .fontSize(22)
    .fillColor('rgba(255,255,255,0.75)')
    .text('Full Project Presentation', 0, 420, { align: 'center', width: 1440 });

  doc
    .font('Helvetica')
    .fontSize(18)
    .fillColor('rgba(255,255,255,0.6)')
    .text('Developed by: Mohamed Oufakir', 0, 490, { align: 'center', width: 1440 });

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  doc
    .fontSize(16)
    .fillColor('rgba(255,255,255,0.5)')
    .text(today, 0, 525, { align: 'center', width: 1440 });

  // ── Section divider pages + screenshot pages ───────────────────────────────
  const sections = [
    { prefix: 'en-light', title: 'English — Light Mode' },
    { prefix: 'en-dark',  title: 'English — Dark Mode'  },
    { prefix: 'ar-light', title: 'Arabic — Light Mode'  },
    { prefix: 'ar-dark',  title: 'Arabic — Dark Mode'   },
  ];

  for (const section of sections) {
    // Section divider
    doc.addPage({ size: [1440, 900], margin: 0 });
    doc.rect(0, 0, 1440, 900).fill('#07090F');
    doc
      .fillColor('#3355EE')
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('SECTION', 0, 360, { align: 'center', width: 1440, characterSpacing: 8 });
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(42)
      .text(section.title, 0, 390, { align: 'center', width: 1440 });

    // Screenshots for this section
    const sectionItems = captured.filter(c => path.basename(c.file).startsWith(section.prefix));
    for (const item of sectionItems) {
      if (!fs.existsSync(item.file)) continue;

      doc.addPage({ size: [1440, 900], margin: 0 });

      // Label bar at top
      doc.rect(0, 0, 1440, 36).fill('#111827');
      doc
        .fillColor('#9CA3AF')
        .font('Helvetica')
        .fontSize(13)
        .text(`${item.pageLabel}  ·  ${item.modeLabel}`, 24, 11, { lineBreak: false });

      // Screenshot image below the label bar
      try {
        const imgData = fs.readFileSync(item.file);
        // The screenshot is 2880px wide (1440 × deviceScaleFactor 2); PDFKit scales by pts
        doc.image(imgData, 0, 36, { width: 1440, align: 'center' });
      } catch (e) {
        console.warn(`  Could not embed image: ${item.file}`);
      }
    }
  }

  doc.end();
  console.log(`PDF written to: ${PDF_OUT}`);
}

(async () => {
  try {
    const captured = await captureScreenshots();
    await buildPDF(captured);
    console.log('\nDone. Files in project-presentation/:');
    console.log('  Riyada-Medical-Centre-Presentation.pdf');
    console.log('  screenshots/  (raw PNG files)');
  } catch (err) {
    console.error('\nScript failed:', err.message);
    process.exit(1);
  }
})();
