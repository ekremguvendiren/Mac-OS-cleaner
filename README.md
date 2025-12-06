# CleanMac 🫧
> **The Modern, Free, and Privacy-Focused macOS Cleaner.**

![CleanMac Dashboard](https://raw.githubusercontent.com/ekremguvendiren/Mac-OS-cleaner/main/public/dashboard-preview.png)

**CleanMac** is a beautifully designed, native-feeling utility to keep your Mac running smoothly. Built with the "Mattr Glas" aesthetic, it combines powerful system tools with a visually stunning interface that feels right at home on macOS Sequoia.

## ✨ Key Features

*   **🗑️ Smart System Junk:** Safely remove cache files, logs, and temporary data to reclaim gigabytes of space.
*   **👯 Secure Duplicate Finder:** Advanced hashing algorithms (MD5) identify true duplicates. Safe removal ensures you never lose important files.
*   **📦 App Uninstaller:** Deep cleaning that finds and removes leftover implementation files, preferences, and caches associated with deleted apps.
*   **🍺 Homebrew Manager:** Visual interface for your Homebrew packages. Update, upgrade, and cleanup outdated formulas with one click.
*   **🔒 Browser Privacy:** Clear cookies, history, and cache from Chrome, Safari, and Firefox to protect your digital footprint.
*   **⚡ RAM Performance:** Free up memory instantly when your system feels sluggish.
*   **🕹️ Arcade Game:** Waiting for a scan? Play the built-in "Clean Snake" game while you wait.
*   **🛡️ Adware Check:** Basic signature-based scanning for common macOS adware agents.

## 🎨 Design Philosophy: "Mattr Glas"

CleanMac isn't just a tool; it's a piece of software craftsmanship.
*   **Glassmorphism:** Heavy use of backdrop-blur and translucency to blend with your wallpaper.
*   **Vibrant & Alive:** High-saturation accent colors and fluid animations make the app feel responsive and modern.
*   **Native Feel:** Rounded corners, correct typography, and familiar layouts that follow Apple's Human Interface Guidelines.

## 🚀 Installation

### Option 1: Download the App (Recommended)
1.  Go to the [Releases](https://github.com/ekremguvendiren/Mac-OS-cleaner/releases) page.
2.  Download the latest `CleanMac-x.x.x-arm64.dmg`.
3.  Open the file and drag **CleanMac** to your Applications folder.

### Option 2: Build from Source
Requirements: Node.js 18+, macOS (Apple Silicon recommended).

```bash
# Clone the repository
git clone https://github.com/ekremguvendiren/Mac-OS-cleaner.git
cd clean-mac-ui

# Install dependencies
npm install

# Run in Development Mode
npm run dev

# Build for Production (Standalone App)
npm run electron:build
```

The compiled `.dmg` will be available in the `dist/` directory.

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Desktop Engine:** [Electron](https://www.electronjs.org/)
*   **Styling:** CSS Modules + "Mattr Glas" Design System
*   **Language:** TypeScript
*   **System Integration:** `systeminformation`, Node.js `fs`/`child_process`

---

*Disclaimer: CleanMac involves file deletion. While we implement safe "Move to Trash" logic, always have a backup of your important data.*

**License**: MIT
