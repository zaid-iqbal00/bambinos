# AI Adventure - Prompt Engineering Interactive Classroom Activity

AI Adventure is a polished, classroom-ready educational web application for Grades 6-8. It teaches prompt engineering through a sequence of interactive text-adventure challenges that help students learn how to write clearer, more specific, and more effective prompts for AI.

## Features

- Landing page with a premium classroom product feel
- Intro story that sets up the virtual AI training environment
- Five interactive prompt engineering challenges
- Heuristic scoring for clarity, context, specificity, and creativity
- Animated progress bar and challenge counter
- Final completion screen with learning outcomes and score summary
- Printable completion certificate
- Hidden teacher dashboard with student score, time taken, challenge performance, and average prompt quality
- Dark mode toggle
- Sound toggle, muted by default
- Typing animation
- Confetti animation using pure JavaScript
- Progress saved in Local Storage
- Mobile-friendly and keyboard-friendly interface
- No external libraries or build tools required

## Folder Structure

```text
/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── logo.svg
    ├── certificate-bg.svg
    └── illustrations/
        ├── dragon.svg
        ├── problem.svg
        ├── space.svg
        ├── story.svg
        └── timetable.svg
```

## How to Run Locally

1. Open the project folder.
2. Open `index.html` directly in a browser.
3. Start the activity and complete the challenges.

No server is required because the project uses only HTML, CSS, and vanilla JavaScript.

## How to Deploy on Netlify

1. Push the folder to GitHub.
2. Sign in to Netlify.
3. Choose **Add new site** and connect the GitHub repository.
4. Set the publish directory to the repository root.
5. Deploy the site.

Because the app is fully static, Netlify can serve it without additional configuration.

## Notes

- The teacher dashboard is hidden by default and can be opened from the top bar.
- Certificate printing uses the browser print dialog.
- The app stores progress locally in the browser so students can resume if they refresh the page.
