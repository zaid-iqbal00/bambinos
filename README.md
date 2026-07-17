# AI Adventure – Prompt Engineering Interactive Classroom Activity

AI Adventure is a production-quality, offline-friendly educational web application for Grades 6–8. It teaches prompt engineering through a guided interactive text adventure where students improve weak prompts, create new prompts, receive scoring feedback, and finish with a printable certificate.

This project was built for the Bambinos.live curriculum developer assessment using only HTML5, CSS3, and vanilla JavaScript.

## Features

- Premium black-and-white classroom interface inspired by modern educational and productivity products.
- Landing page with grade level, duration, activity description, and learning objectives.
- Introduction screen with a typing animation and clear student instructions.
- Five challenge screens:
  1. Improve: `Tell me about space.`
  2. Improve: `Write a story.`
  3. Create a homework timetable prompt.
  4. Create an image generation prompt describing a dragon.
  5. Design a prompt for solving a real-world problem.
- Prompt scoring heuristics for clarity, context, specificity, and creativity, each out of 10.
- Actionable feedback that guides improvement instead of simply marking answers correct or incorrect.
- Top progress indicator with challenge number, percentage, and animated progress bar.
- Completion page with final score, strengths, areas to improve, and learning outcomes.
- Printable certificate with student name, date, activity name, and instructor: Bambinos.live.
- Hidden teacher dashboard with student score, time taken, challenge performance, and average prompt quality.
- Dark mode toggle, muted-by-default sound toggle, restart flow, loading screen, local storage progress saving, and pure JavaScript confetti.
- Responsive layout, keyboard-friendly controls, semantic HTML, ARIA labels, and high-contrast colors.

## Folder structure

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
```

## How to run locally

Open `index.html` directly in a modern browser. The activity has no JavaScript framework, package manager, or build step.

For an optional local server, run:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open:

```text
http://127.0.0.1:4173/
```

## How to deploy on Netlify

1. Push the project folder to a GitHub repository.
2. In Netlify, select **Add new site** and import the repository.
3. Keep the build command blank.
4. Set the publish directory to the project root.
5. Deploy the site.

## Accessibility and classroom notes

- The interface uses semantic sections, labels, live regions, keyboard focus states, and sufficient contrast.
- The scoring is heuristic-based and designed for learning conversations, not high-stakes grading.
- The teacher dashboard is frontend-only and stores progress locally in the browser.
