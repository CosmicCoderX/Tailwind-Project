# WebToApp Landing Page (Tailwind Project)

A modern, responsive landing page for "WebToApp" - a service that transforms web applications into cross-platform desktop apps. This project demonstrates a premium UI design using Tailwind CSS with animations and interactive elements.

## 🚀 Features

- **Modern UI/UX**: Built with a focus on visual excellence using gradients, glassmorphism, and smooth transitions.
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop devices.
- **Animations**:
  - Scroll-based animations using [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/).
  - Custom floating animations for hero elements.
  - Infinite scrolling logo marquee.
- **Tailwind CSS**: Utilizes Tailwind's utility-first approach for rapid and custom styling.
- **Interactive Elements**: Custom cursor, hover effects, and mobile navigation.

## 🛠️ Tech Stack

- **HTML5**: Semantic markup structure.
- **Tailwind CSS**: Core styling framework.
- **JavaScript**: Handling mobile menu toggles and specialized interactions.
- **AOS**: Library for scroll animations.
- **Font Awesome**: Iconography.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/CosmicCoderX/Tailwind-Project.git
    cd Tailwind-Project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 📜 Usage Scripts

This project uses Tailwind CLI for building CSS. The following scripts are available in `package.json`:

- **Build CSS:** One-time build of the Tailwind CSS output.
    ```bash
    npm run build
    ```
    *Command:* `tailwindcss -i ./input.css -o ./output.css`

- **Watch Mode:** Watch for changes in files and rebuild CSS automatically during development.
    ```bash
    npm run watch
    ```
    *Command:* `tailwindcss -i ./input.css -o ./output.css --watch`

## 📂 Project Structure

```
Tailwind-Project/
├── assets/             # Images and static assets
├── node_modules/       # Node.js dependencies (excluded from git)
├── index.html          # Main HTML entry point
├── input.css           # Tailwind CSS input directives
├── output.css          # Compiled CSS output (generated)
├── script.js           # Custom JavaScript logic
├── style.css           # Additional custom styles
├── tailwind.config.js  # Tailwind configuration file
└── package.json        # Project metadata and scripts
```

## 📄 License

This project is licensed under the ISC License.
