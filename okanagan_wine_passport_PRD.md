# Okanagan Wine Passport — Full Product Requirements Document
**Version 1.0 | Ready for Design & Development**

---

## 1. Product Overview

### What It Is
Okanagan Wine Passport is a two-sided platform built around a physical iPad kiosk tool sold or leased to Okanagan wineries. It serves as an immersive, interactive wine discovery experience at the point of tasting — and automatically converts every visitor into a mobile app user by the end of their session.

### The Core Loop
1. Winery purchases/leases the iPad kiosk tool
2. Staff hands iPad to visitor at the tasting bar or booth
3. Visitor swipes through an immersive wine lookbook
4. Visitor rates, checks off, and favourites wines they tried
5. At the end, visitor scans a QR or NFC tap to transfer their session to their phone
6. They download the Okanagan Wine Passport mobile app — their tasting data is already there
7. App recommends their next winery based on preferences
8. Cycle repeats across every winery in the Okanagan

### Why It Works
- The iPad sells itself — wineries want a premium experience tool
- Visitor adoption is frictionless — they already have a reason to download
- Data compounds — every tasting session feeds a better recommender
- Network effect — more wineries = more reason to use the app

---

## 2. Product Surfaces

| Surface | Who Uses It | Purpose |
|---|---|---|
| iPad Kiosk App | Winery visitors | Tasting experience at the bar/booth |
| Mobile App (iOS + Android) | Visitors post-session | Personal passport, recommendations, history |
| Winery Dashboard (Web) | Winery staff/owners | Analytics, wine management, QR/NFC tools |
| Admin Portal (Web) | Founder/team | Onboard wineries, manage platform |

---

## 3. iPad Kiosk App — Full Specification

### 3.1 Overview
This is the hero product. It is what you sell. Every design and UX decision here must feel premium, immersive, and effortless for a visitor who has never seen it before. It runs in guided access mode (iPad locked to this app only). No back button. No home button. No distractions.

### 3.2 Aesthetic Direction

**Theme:** Luxury wine editorial — think high-end wine magazine meets Apple product demo
**Colours:**
- Background: `#1A0D0A` (near-black espresso) — makes wine imagery pop
- Primary text: `#F5ECD7` (warm cream)
- Accent: `#C4773B` (oak amber) — CTAs, highlights, active states
- Secondary accent: `#8B2035` (deep burgundy) — borders, dividers
- Muted text: `#A89880` (warm taupe)

**Typography:**
- Display / Wine names: `Playfair Display` (serif, elegant, editorial)
- Body / Descriptions: `Lato` (clean, readable at all sizes)
- UI labels / Buttons: `Lato` uppercase, tracked at 0.1em

**Feel:** Dark, warm, cinematic. Full-bleed photography. Smooth transitions between wines. The visitor should feel like they're holding a premium object, not using a utility tool.

**Animations:**
- Horizontal swipe between wines — native iOS feel
- Fade + slide-up on wine detail reveal
- Gentle pulse on the "Scan to save" CTA at the end
- Star rating fills with amber glow on tap

### 3.3 App Flow — Screen by Screen

#### Screen 0: Attract / Idle Screen
- Displays when no one is using the kiosk
- Full-bleed looping video or slow Ken Burns photo of vineyard/wine
- Centred text: "Tap to begin your tasting" in Playfair Display
- Winery logo top-right
- Auto-resets to this screen after 3 minutes of inactivity

#### Screen 1: Welcome Screen
- Winery name and logo large and centred
- Tagline (customisable by winery)
- "Today's Tasting Menu" with count of wines — e.g. "6 wines to explore"
- Large CTA button: "Start Tasting →"
- Optional: Staff can enter visitor name for personalisation (first name only)

#### Screen 2: Wine Lookbook (Core Experience)
This is the main screen. Each wine gets its own full-screen card. Visitor swipes left/right to navigate.

**Each wine card contains:**

*Top half — Visual:*
- Full-bleed wine bottle photo OR vineyard/label lifestyle image
- Wine name in Playfair Display, large, overlaid on bottom of image with gradient fade
- Vintage year and grape variety as a small pill badge (e.g. "2021 · Pinot Noir")

*Bottom half — Details panel (scrollable):*
- Origin: Region, sub-region, specific block if known
- Tasting notes: 3–5 flavour descriptors displayed as pill tags (e.g. "Dark cherry", "Vanilla", "Smooth finish")
- Winemaker's note: 2–3 sentence personal quote from the winemaker
- Food pairing: Icon + short text (e.g. "🥩 Grilled lamb, aged cheese")
- Price: Displayed clearly
- Awards/ratings if applicable (medal icons)

*Bottom fixed bar:*
- Progress dots showing position in lineup (e.g. ●●○○○○)
- Heart icon to favourite this wine (taps amber on selection)
- Checkbox "I tried this" — taps with satisfying animation
- Star rating (1–5 stars) — appears after "I tried this" is checked

*Swipe hint:* First card only shows animated swipe gesture to teach navigation

#### Screen 3: Summary Screen
Appears after visitor has swiped through all wines (or taps "See my picks" at any point)

**Layout:**
- Header: "Your tasting tonight" with visitor name if entered
- List of all wines with:
  - Small wine image thumbnail (left)
  - Wine name and grape
  - Their star rating (or "Not tried" greyed out)
  - Heart icon filled if favourited
- Ability to go back and edit any rating
- Total count: "You tried 4 of 6 wines · 2 favourited"

#### Screen 4: Save & Transfer Screen
This is the conversion moment. Design it beautifully.

**Layout:**
- Large headline: "Take your tasting with you"
- Subtext: "Scan to save your picks, get personalised recommendations, and build your Okanagan passport"
- **Two options side by side:**

  **Option A — QR Code (primary)**
  - Large, clean QR code generated uniquely for this session
  - Underneath: "Scan with your camera — no app needed yet"
  - When scanned: opens web page with their session summary + download prompt for full app

  **Option B — NFC Tap (secondary, if hardware supports)**
  - NFC icon with "Or tap your phone here"
  - Same destination as QR

- Below both options: "Or enter your email" text field as fallback
- Small print: "Your data is only yours. We never share it."
- After scan/tap confirmation: Screen shows "✓ Saved! Check your phone" with warm animation
- Auto-reset to Screen 0 after 30 seconds

#### Screen 5: Reset / Staff View (Hidden)
- Accessible via 5-tap on corner logo (staff only knows this)
- Shows: today's session count, wines tried most, quick winery settings
- "Reset for next visitor" button — clears session, returns to Screen 0

---

## 4. Mobile App — Full Specification

### 4.1 Purpose
The personal companion to the kiosk experience. Every visitor who scans at Screen 4 lands here. This is where the product becomes sticky and drives repeat winery visits.

### 4.2 Aesthetic Direction
Same colour palette as kiosk but adapted for mobile:
- Light mode available (cream background, dark text) — more readable in daylight outdoor settings
- Dark mode matches kiosk aesthetic exactly
- Bottom tab navigation
- Card-based layout throughout

### 4.3 Core Screens

#### Tab 1: My Passport
- Visual stamp collection — grid of winery logos/stamps for each visited winery
- Each stamp shows visit date and number of wines tried
- Progress bar: "X of 40 Okanagan wineries visited"
- Shareable graphic: "My Okanagan Passport" image for Instagram stories
- Milestones: badges unlocked at 5, 10, 20, all wineries

#### Tab 2: My Tastings
- Chronological log of every tasting session
- Filterable by winery, grape, rating, date
- Each entry: wine name, winery, their rating, their notes, bottle image
- "Buy again" link if winery has online store

#### Tab 3: Discover
- Map of all Okanagan wineries
- Filter by: grape variety, open now, distance, visitor rating
- Each winery card: photo, name, top-rated wine, distance, hours
- "Recommended for you" section — AI picks based on their tasting history
- Upcoming winery events

#### Tab 4: Profile
- Name, visit stats, favourite grape varieties
- Top 3 wineries
- Taste profile visualisation (radar chart of flavour preferences — bold, fruity, dry, sweet, etc.)
- Settings, notifications, account

### 4.4 First Launch Flow (Post-Scan)
1. App opens to "Welcome, [name]" screen
2. Shows their tasting session already loaded: "Here's what you tried at [Winery Name] tonight"
3. Prompt to confirm/edit ratings
4. Passport stamp awarded for that winery
5. "Based on your picks, you'd love these 3 wineries next" — recommendation cards
6. Prompt to allow notifications for winery deals and events

---

## 5. Winery Dashboard — Full Specification

### 5.1 Purpose
This is what you charge the monthly subscription for. It gives wineries data and tools they've never had before.

### 5.2 Aesthetic Direction
Clean, professional web app. Light mode default. Same amber accent colour. Feels like a premium SaaS tool, not a winery website.

### 5.3 Core Sections

#### Overview Dashboard
- Today's sessions count
- Total visitors this month
- Most favourited wine this week
- Average rating across all wines
- New app downloads attributed to their kiosk

#### Wine Management
- Add/edit/remove wines from kiosk lineup
- Upload bottle photos, lifestyle images
- Write/edit tasting notes, winemaker quotes, food pairings
- Set pricing
- Toggle wines active/inactive for seasonal lineup changes
- Preview exactly how wine appears on iPad kiosk

#### Visitor Analytics
- Total unique visitors (app users who checked in)
- Repeat visitor rate
- Top rated wines with breakdown
- Taste preference heatmap of their visitors (aggregate, anonymised)
- Peak visit times by day/hour
- Conversion: visitors → app downloads

#### Marketing Tools
- Push notification composer: send offers to past visitors
- Event creation: publish tasting events to Discover tab
- Featured placement: boost winery in app search (paid upgrade)
- Export visitor email list (opted-in only, CASL compliant)

#### QR & NFC Management
- Download print-ready QR codes (PDF, sized for various placements)
- Table tent template with QR embedded (ready to print)
- NFC tag programming instructions
- Session QR — regenerates automatically each day

---

## 6. Hardware & Physical Product

### iPad Kiosk Package
This is what you physically sell or lease to wineries.

**Hardware:**
- iPad (10th gen or newer) — sourced by you or bundled
- Heavy-duty wine bar stand — low-profile, weighted base, premium aluminium finish
- Kiosk enclosure — locks iPad in place, covers home button, hides cables
- Power cable management — clean single cable to back

**Setup:**
- Guided Access Mode configured (iPad locked to app)
- Auto-brightness on
- Auto-sleep disabled during winery hours
- Auto-reset timer: 3 minutes inactivity → Screen 0

**Pricing model options:**
- Option A: Lease the full hardware kit + app subscription ($X/month)
- Option B: Winery provides iPad, you provide app subscription ($X/month)
- Option C: One-time hardware purchase + annual software license

### Physical Collateral (included in package)
- Table tent card with winery QR for kiosk-free check-in
- "Scan to save your tasting" counter sign (matches app aesthetic)
- Staff quick-start card (one page, laminated)

---

## 7. Technical Architecture

### iPad Kiosk App
- **Platform:** React Native (iOS focus, iPad optimised)
- **Offline-first:** All wine content cached locally — works without WiFi during session
- **Session data:** Stored locally, synced on transfer event (QR scan / NFC)
- **QR generation:** Dynamic per-session, expires after 24 hours
- **NFC:** Core NFC framework (iOS 13+)

### Mobile App
- **Platform:** React Native (iOS + Android)
- **Auth:** Email / Apple Sign-In / Google Sign-In
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Push notifications:** Expo Notifications
- **Maps:** Mapbox (more customisable than Google Maps)

### Winery Dashboard
- **Platform:** React web app
- **Hosting:** Vercel
- **Backend:** Same Supabase instance

### Data Model (simplified)
- `wineries` — id, name, location, logo, subscription_tier
- `wines` — id, winery_id, name, grape, vintage, tasting_notes, images, price
- `sessions` — id, winery_id, visitor_name, created_at, transfer_token
- `tastings` — id, session_id, wine_id, tried (bool), rating (1-5), favourited (bool)
- `users` — id, email, name, app_download_at
- `user_tastings` — linked from session on transfer

---

## 8. Go-To-Market

### Phase 1 — Kelowna Pilot (Months 1–3)
- Target 5–8 wineries in Kelowna / West Kelowna corridor
- Offer first 3 wineries free hardware + 3 months free subscription in exchange for feedback
- Personally visit, demo the iPad kiosk in a live tasting
- Collect data, iterate on wine card design and transfer flow

### Phase 2 — Full Okanagan (Months 4–8)
- Expand to Naramata Bench, Penticton, Oliver, Osoyoos
- Launch public mobile app (App Store + Google Play)
- Begin charging subscription to new wineries
- Apply to Tourism Kelowna and BC Wine Institute as official partner

### Phase 3 — Scale to Other Regions
- Niagara Peninsula (Ontario)
- Similkameen Valley (BC)
- International: Napa, Sonoma, Marlborough NZ

### Pricing (proposed)
| Tier | Price | Includes |
|---|---|---|
| Starter | $99/month | App subscription, dashboard, QR tools |
| Pro | $199/month | + Push notifications, analytics, featured listing |
| Hardware Bundle | $499 upfront + $99/month | iPad stand + kiosk enclosure + Starter plan |

---

## 9. Design Deliverables Needed

For handoff to designer, the following screens need to be designed:

**iPad Kiosk App (8 screens):**
- [ ] Screen 0: Attract/Idle
- [ ] Screen 1: Welcome
- [ ] Screen 2: Wine Card (1 wine, full detail)
- [ ] Screen 2b: Wine Card (swiped state, next wine)
- [ ] Screen 3: Summary
- [ ] Screen 4: Save & Transfer (QR + NFC)
- [ ] Screen 4b: Confirmed / Success state
- [ ] Screen 5: Staff reset view

**Mobile App (6 screens):**
- [ ] Onboarding / first launch post-scan
- [ ] My Passport (stamp grid)
- [ ] My Tastings (log)
- [ ] Discover (map + recommendations)
- [ ] Wine detail page
- [ ] Profile / taste profile

**Winery Dashboard (4 screens):**
- [ ] Overview dashboard
- [ ] Wine management (edit wine)
- [ ] Visitor analytics
- [ ] QR code management

---

## 10. Success Metrics

| Metric | Target (End of Year 1) |
|---|---|
| Wineries on platform | 20+ |
| App downloads | 5,000+ |
| Tasting sessions logged | 25,000+ |
| Average session rating | 4.2+ stars |
| Kiosk → App conversion | >40% |
| Monthly recurring revenue | $3,000+ |

---

*Document prepared for: Design handoff, development briefing, and Venture Founder application*
*Last updated: May 2026*
