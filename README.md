# Focus & Grow – Advanced Monthly Habit Tracker

**Focus & Grow** is a professional-grade, minimalistic habit tracker built for individuals who value consistency, aesthetics, and privacy. Unlike bloated productivity apps, it focuses entirely on a clear monthly view, powerful analytics, and instant feedback—all without requiring a login or internet connection.

## 🚀 Key Features

*   **Minimalistic & Distraction-Free**: A clean UI that puts your data front and center.
*   **Sticky Navigation**: The "Habit Name" and "Progress" columns stay fixed while you scroll horizontally through the days of the month.
*   **Color Coding**: Assign unique colors to specific habits (Health, Work, Learning) for faster visual scanning.
*   **Advanced Analytics**:
    *   **Streak Tracking**: Monitors current and best streaks for every habit.
    *   **Trend Chart**: Visualizes your daily consistency across all habits over the month.
    *   **Completion Rates**: Instant percentage feedback.
*   **Privacy First**: **100% Local Storage**. Your data never leaves your device. No servers, no accounts.
*   **Dark Mode**: Fully responsive dark theme that respects system preferences or manual toggling.
*   **Export Functionality**: Download a high-resolution image of your consistency chart to share on social media.
*   **Reset Capability**: Clear monthly progress marks while keeping your habit list intact for the next month.

---

## 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS (with Dark Mode support)
*   **Visualization**: Recharts
*   **Utilities**: html2canvas (for export), LocalStorage API

---

## 💻 How to Run (Web Version)

To run this project locally in a browser environment, you will need Node.js installed. We recommend using **Vite** for the best experience.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/SaamiAbbasKhan/Focus-and-Grow.git
    cd focus-and-grow
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` (default Vite port) to view the app.

4.  **Build for Production**
    ```bash
    npm run build
    ```
    This creates a `dist` folder with optimized static files.

---

## 📦 How to Create a Desktop App (.exe) using Tauri

You can package this web application into a lightweight, native Windows executable (or macOS/Linux binary) using [Tauri](https://tauri.app/).

### Prerequisites
*   **Rust**: Install from [rustup.rs](https://rustup.rs/).
*   **Microsoft Visual Studio C++ Build Tools** (Windows only).

### Steps

1.  **Add Tauri to the Project**
    Inside your project root, run:
    ```bash
    npm install --save-dev @tauri-apps/cli
    ```

2.  **Initialize Tauri**
    ```bash
    npx tauri init
    ```
    Follow the prompts:
    *   **App Name**: FocusAndGrow
    *   **Window Title**: Focus & Grow
    *   **Frontend build command**: `npm run build`
    *   **Url of dev server**: `http://localhost:5173`
    *   **Frontend dist command**: `../dist` (This is crucial: point it to where React builds your files)

3.  **Development Mode (Desktop)**
    Run the app as a native window with hot-reloading:
    ```bash
    npx tauri dev
    ```

4.  **Build the Executable**
    To create the final `.exe` file (Windows) or `.dmg` (Mac):
    ```bash
    npx tauri build
    ```
    
    *   **Output Location**: You will find the installer and executable in `src-tauri/target/release/bundle/nsis/` (on Windows).

---

## 🔮 Future Upgrades

We are actively looking to implement:
*   **Cloud Sync (Optional)**: Opt-in backup to Google Drive or iCloud.
*   **Drag & Drop**: Reorder habits easily.
*   **Yearly Heatmap**: GitHub-style contribution graph for the whole year.
*   **Mobile App**: React Native adaptation for iOS/Android.
*   **Notifications**: Desktop reminders for incomplete habits.

---

## 🤝 Contributing

This is an open-source project, and we love community contributions!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

**Feel free to commit!** Whether it's a typo fix, a new feature, or a UI polish, your input is welcome.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
