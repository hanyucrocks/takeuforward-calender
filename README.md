# Dynamic Interactive Calendar Widget

A high-fidelity, premium React calendar widget designed to simulate physical wall-calendar mechanics while leveraging beautiful digital theming to create an engaging user experience.

## Premium Features

- **3D Page Flips:** Navigating between months triggers a spatial 3D CSS `rotateX` animation. The calendar seamlessly folds up and flips back down just like turning the page of a physical wall calendar.
- **Dynamic Contextual Theming:** The widget has native situational awareness. Every month loads a customized, high-quality Unsplash hero image matched with a precisely calculated Tailwind CSS color palette (e.g., Spring Florals + Violet for May; Beaches + Ocean Blue for June) that trickles down to buttons, highlights, and borders.
- **Robust Data Persistence:** Completely frontend-centric data synchronization. Memos, daily notes, and range notes trigger an automated sync with browser `localStorage`. Notes are completely preserved across tabs and sessions.
- **Intelligent Mini-Badges:** Date-cells automatically calculate if they fall uniquely under a single saved note, or within a highlighted saved date range, popping up a beautifully formatted brand-colored indicator dot so you immediately see your data without having to search.
- **Indian National Holidays:** Tracks major Indian secular holidays (Republic Day, Independence Day, Gandhi Jayanti). The widget renders a bright red `H` badge beneath the specific date and implements an interactive hover-tooltip detailing the holiday name.
- **Jump to Today:** An instantaneous anchor point button that smoothly 3D-flips the user out of any month and straight back to the present day, dropping an assertive dark ring styling explicitly over the actual current date limit.

## Engineering Design Choices

- **Tailwind CSS v4 + Vanilla CSS Interop:** Tailwind manages layout and standard component styling to maintain an agile utility-first environment, while heavy spatial logic (`clip-path` hero waves, `@keyframe` physics) are extracted to standardized Vanilla CSS variables to ensure the complex layout avoids overwhelming JSX line pollution.
- **Date-FNS over Complex Date Libraries:** Relied purely on `date-fns` for immutable, straightforward date mathematics ensuring rendering logic evaluates quickly without inflating the final Vite build bundle size.
- **Client-Side First:** Strict adherence to frontend domain architecture. LocalStorage intercepts state data precisely during the `useEffect` reactive cycle to completely negate the latency and structural setup of a full database loop.

## How to Run Locally

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/hanyucrocks/takeuforward-calender.git
cd takeuforward-calendar
npm install
```

### 2. Start the Development Server
Execute the start script to boot the local environment up:
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your local browser.

### 3. Sharing your Local Work remotely (LAN and WAN)
* **Local Wi-Fi Network**: You can share the preview server with anyone on your local network natively via Vite:
  ```bash
  npm run dev -- --host
  ```
  *Copy the IP output provided and hand it to a device on your network.*
* **Over the Internet**: To temporarily expose your local process to the broader internet via a secure tunnel, run:
  ```bash
  npx localtunnel --port 5173
  ```
  *This requires no configuration and gives you a fully functional public HTTPS URL!*
