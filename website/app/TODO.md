# TODO - Midnight Cobalt restyle

## Step 1: Palette + tokens
- [x] Update `src/index.css` dark theme CSS variables to:
  - background #07090F
  - card/surface #0F1320
  - border/dividers #1E2440
  - text primary #F0F4FF
  - text muted #6B7A99
- [x] Update/extend `tailwind.config.js` boxShadow colors to cobalt glow (#3355EE at ~0.30-0.40)
- [x] Add shared helper classes in `src/index.css` for gradients/texture/heading gradient/masks



## Step 2: Hero styling
- [x] Update `src/sections/HeroSection.tsx` to add radial gradient background + 3% dot/noise overlay
- [x] Apply heading gradient class to section headings where applicable


## Step 3: Navbar styling
- [x] Update `src/components/Navbar.tsx` to match navbar rules (bg #07090F, blur(12px), border-bottom #1E2440)


## Step 4: Footer styling
- [ ] Update `src/components/Footer.tsx` to match footer rules (bg #0A0D18)
- [ ] Replace harsh white text/panels with theme tokens

## Step 5: Mascot halo
- [ ] Locate mascot/character components and wrap mascot images with cobalt halo effect class

## Step 6: Build/test
- [ ] Run `npm run build` and fix any CSS/TS issues
- [ ] Spot-check key pages (Home/About/Booking/Contact/Packages)

