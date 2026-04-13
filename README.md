# CV Expert AI

**AI-Powered Resume Analyzer, Builder & Career Optimizer**

An intelligent web application that helps job seekers create ATS-optimized resumes, analyze their CVs with AI-powered scoring, match against job descriptions, and prepare for interviews - all wrapped in a stunning animated dark theme.

![CV Expert AI](https://img.shields.io/badge/CV%20Expert-AI%20Powered-00d4ff?style=for-the-badge&logo=robot&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.0-purple?style=for-the-badge)

---

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Career command center with animated stats, ATS gauge, AI insights feed, and quick actions |
| **CV Analyzer** | Drag-and-drop upload or paste text for deep AI analysis across 5 scoring dimensions |
| **CV Builder** | 5-step wizard with AI-generated summaries, skill suggestions, and 5 professional templates |
| **ATS Score** | Detailed Applicant Tracking System compatibility report with 6-category breakdown |
| **Job Match** | Compare your CV against any job description with keyword matching and gap analysis |
| **AI Optimizer** | Automatically enhance your CV with stronger action verbs, keywords, and metrics |
| **Keyword Intelligence** | Industry-specific keyword databases for 8 industries with trending/must-have/bonus categories |
| **Interview Prep** | AI-generated behavioral, technical, and situational questions with coaching tips |
| **Templates** | 6 ATS-optimized professional templates (Modern, Classic, Creative, Minimal, Executive, Tech) |
| **AI Chat Assistant** | Context-aware conversational AI that references your actual analysis results |

### AI Capabilities

- **Multi-Factor ATS Scoring** - Analyzes keyword match, format compliance, section structure, content quality, action verbs, and quantifiable results
- **Smart Keyword Engine** - 8 industry databases (Tech, GIS, Finance, Engineering, Healthcare, Marketing, Energy, Data Science)
- **Action Verb Analyzer** - Detects 60+ strong verbs, flags weak ones, suggests replacements
- **Metrics Detector** - Identifies percentages, currencies, team sizes, and years of experience
- **Intelligent Recommendations** - Prioritized, actionable improvement suggestions
- **Job Description Parser** - Extracts and ranks keywords from any job posting
- **CV Content Optimizer** - Replaces weak verbs, suggests missing keywords, adds impact

### Design & UX

- Animated dark theme with glassmorphism UI
- Particle background with connecting network lines
- Animated loading screen with neural network initialization
- Glowing neon accents with 6 customizable accent colors
- 30+ CSS keyframe animations (fade, slide, pulse, glow, glitch, typewriter)
- Fully responsive design (Desktop, Tablet, Mobile)
- Command palette with `Ctrl+K` keyboard shortcut
- Dark / Light / Midnight Blue theme modes
- Toast notifications and smooth page transitions

---

## Tech Stack

| Technology | Usage |
|-----------|-------|
| **HTML5** | Semantic markup, accessibility |
| **CSS3** | Custom properties, Grid, Flexbox, glassmorphism, animations |
| **Vanilla JavaScript** | Zero-dependency application logic |
| **Font Awesome 6** | 40+ icons throughout the UI |
| **Google Fonts** | Inter (UI) + JetBrains Mono (code) |
| **Canvas API** | Particle background animation |
| **SVG** | Animated score gauges |
| **LocalStorage** | State persistence and history |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+ (for local dev server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/Collins76/cv-expert-ai.git

# Navigate to the project
cd cv-expert-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### No-Install Option

Since this is a static web app, you can also simply open `index.html` directly in your browser - no server needed for basic functionality.

---

## Project Structure

```
cv-expert-ai/
├── index.html              # Main SPA entry point (all 10 views)
├── css/
│   ├── styles.css          # Core styles, dark theme, glassmorphism (1300+ lines)
│   └── animations.css      # 30+ keyframe animations
├── js/
│   ├── app.js              # Main application controller & state management
│   ├── ai-engine.js        # AI scoring, keywords, recommendations engine
│   └── cv-parser.js        # File parser & 5 CV template renderers
├── package.json            # Project configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## Usage Guide

### 1. Analyze a CV
- Navigate to **CV Analyzer** from the sidebar
- Upload a PDF/DOCX/TXT file or paste CV text
- Click **"Analyze with AI"** for comprehensive scoring
- Review scores across Overall, ATS, Format, Content, and Impact

### 2. Build a CV
- Go to **CV Builder** and follow the 5-step wizard
- Use **"AI Generate"** buttons for smart content suggestions
- Preview with different templates
- Download as HTML (print to PDF)

### 3. Match Against Jobs
- Analyze your CV first, then go to **Job Match**
- Paste any job description
- Get match percentage, matching/missing keywords, and improvement suggestions

### 4. Get Industry Keywords
- Visit **Keyword Intelligence**
- Select from 8 industries
- Browse Trending, Must-Have, and Bonus keyword categories

### 5. Prepare for Interviews
- Go to **Interview Prep**
- Select type (Behavioral/Technical/Situational/Mixed) and difficulty
- Generate AI-powered questions with coaching tips

---

## Supported Industries

| Industry | Keywords | Specialization |
|----------|----------|----------------|
| Technology & IT | 50+ | Full-stack, Cloud, DevOps, AI/ML |
| GIS & Geospatial | 40+ | ArcGIS, Remote Sensing, Spatial Analysis |
| Finance & Banking | 40+ | FinTech, Risk, Compliance |
| Engineering | 35+ | CAD, IoT, Industry 4.0 |
| Healthcare | 35+ | Digital Health, Clinical, Informatics |
| Marketing & Sales | 35+ | SEO, Social Media, Analytics |
| Energy & Utilities | 35+ | Renewables, Smart Grid, SCADA |
| Data Science | 40+ | ML, Deep Learning, Big Data |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open command palette |
| `Escape` | Close modals / command palette |
| `Enter` | Send chat message |

---

## Customization

### Themes
- **Dark** (default) - Deep black with neon accents
- **Light** - Clean white with colored accents
- **Midnight Blue** - Deep blue variant

### Accent Colors
Choose from 6 preset colors: Cyan, Green, Orange, Purple, Rose, Yellow

### Animations
Toggle all animations on/off for accessibility or performance

---

## Deployment

### GitHub Pages
This project is deployed on GitHub Pages at:
`https://collins76.github.io/cv-expert-ai/`

### Vercel
Also deployed on Vercel for maximum performance.

---

## Author

**Collins Anyanwu**
- GIS Coordinator at Ikeja Electric, Lagos
- 19+ years of GIS expertise
- Full-Stack Web Developer

---

## License

This project is licensed under the ISC License.

---

**Built with AI-powered intelligence for the modern job seeker.**
