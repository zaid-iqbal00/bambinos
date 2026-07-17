(function () {
  'use strict';

  const STORAGE_KEY = 'aiAdventureProgressV2';
  const TOTAL_CHALLENGES = 5;

  const challengeBank = [
    {
      title: 'Improve a broad science prompt',
      type: 'Challenge 1: Prompt improvement',
      description: 'Rewrite the prompt so an AI gives a useful, accurate answer for a middle school learner.',
      originalPrompt: 'Tell me about space.',
      placeholder: 'Example direction: Explain three parts of space for a Grade 7 student using simple language...',
      keywords: ['space', 'planet', 'star', 'galaxy', 'solar', 'grade', 'student'],
    },
    {
      title: 'Improve a creative writing prompt',
      type: 'Challenge 2: Prompt improvement',
      description: 'Add enough detail for the AI to write a focused, age-appropriate story.',
      originalPrompt: 'Write a story.',
      placeholder: 'Example direction: Write a 500-word mystery story for Grade 6 students with...',
      keywords: ['story', 'character', 'setting', 'genre', 'conflict', 'ending', 'tone'],
    },
    {
      title: 'Create a homework timetable prompt',
      type: 'Challenge 3: Prompt creation',
      description: 'Create a prompt that asks AI to build a practical homework timetable.',
      originalPrompt: 'Create a prompt that generates a homework timetable.',
      placeholder: 'Ask for a weekly timetable with subjects, time blocks, breaks, and a table format...',
      keywords: ['homework', 'timetable', 'schedule', 'subject', 'time', 'break', 'table'],
    },
    {
      title: 'Create an image generation prompt',
      type: 'Challenge 4: Prompt creation',
      description: 'Describe a dragon clearly enough for an image model to create it.',
      originalPrompt: 'Create an image generation prompt describing a dragon.',
      placeholder: 'Describe the dragon, setting, composition, lighting, style, and details to avoid...',
      keywords: ['dragon', 'image', 'visual', 'style', 'setting', 'lighting', 'composition'],
    },
    {
      title: 'Design a real-world problem prompt',
      type: 'Final Challenge: Responsible AI use',
      description: 'Write a prompt that helps solve a real problem at home, school, or in the community.',
      originalPrompt: 'Design your own prompt for solving a real-world problem.',
      placeholder: 'Describe the problem, audience, constraints, safe boundaries, and requested action plan...',
      keywords: ['problem', 'solution', 'plan', 'community', 'school', 'responsible', 'steps'],
    },
  ];

  const defaultState = {
    screen: 'landing',
    currentChallenge: 0,
    studentName: '',
    startedAt: null,
    completedAt: null,
    soundEnabled: false,
    theme: 'light',
    results: [],
  };

  const state = { ...defaultState };
  const elements = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheElements();
    restoreState();
    bindEvents();
    applyTheme();
    renderResumeButton();
    renderDashboard();

    if (state.screen === 'challengeScreen') {
      renderChallenge();
    }

    if (state.screen === 'completion') {
      renderCompletion();
    }

    showScreen(state.screen || 'landing', { persist: false });
    window.setTimeout(() => elements.loadingScreen.classList.add('hidden'), 450);
    window.setInterval(renderDashboard, 1000);
  }

  function cacheElements() {
    const ids = [
      'loadingScreen', 'homeButton', 'teacherToggle', 'soundToggle', 'themeToggle', 'teacherDashboard',
      'closeTeacher', 'dashScore', 'dashTime', 'dashAverage', 'dashChallenges', 'mainContent',
      'startButton', 'resumeButton', 'typingStory', 'studentName', 'beginButton', 'introBackButton',
      'challengeCounter', 'progressPercent', 'progressBar', 'challengeTitle', 'challengeType',
      'challengeDescription', 'originalPrompt', 'promptInput', 'evaluateButton', 'nextButton',
      'scoreCard', 'finalScore', 'strengthsList', 'improvementsList', 'certificateButton',
      'restartButton', 'certificateName', 'certificateDate', 'printButton', 'backCompletion',
      'confettiCanvas',
    ];

    ids.forEach((id) => {
      elements[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    elements.homeButton.addEventListener('click', () => showScreen('landing'));
    elements.startButton.addEventListener('click', startIntro);
    elements.resumeButton.addEventListener('click', resumeActivity);
    elements.beginButton.addEventListener('click', beginMission);
    elements.introBackButton.addEventListener('click', () => showScreen('landing'));
    elements.evaluateButton.addEventListener('click', evaluatePrompt);
    elements.nextButton.addEventListener('click', goToNextChallenge);
    elements.certificateButton.addEventListener('click', showCertificate);
    elements.restartButton.addEventListener('click', restartActivity);
    elements.printButton.addEventListener('click', () => window.print());
    elements.backCompletion.addEventListener('click', () => showScreen('completion'));
    elements.teacherToggle.addEventListener('click', openTeacherDashboard);
    elements.closeTeacher.addEventListener('click', closeTeacherDashboard);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.soundToggle.addEventListener('click', toggleSound);

    elements.promptInput.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        evaluatePrompt();
      }
    });
  }

  function startIntro() {
    showScreen('intro');
    playTypingAnimation();
  }

  function resumeActivity() {
    if (state.currentChallenge >= TOTAL_CHALLENGES || state.screen === 'completion') {
      renderCompletion();
      showScreen('completion');
      return;
    }

    renderChallenge();
    showScreen('challengeScreen');
  }

  function beginMission() {
    state.studentName = elements.studentName.value.trim();
    state.startedAt = state.startedAt || Date.now();
    state.currentChallenge = 0;
    state.results = [];
    renderChallenge();
    showScreen('challengeScreen');
    persistState();
  }

  function renderChallenge() {
    const challenge = challengeBank[state.currentChallenge];
    const result = state.results[state.currentChallenge];
    const progress = Math.round(((state.currentChallenge + 1) / TOTAL_CHALLENGES) * 100);

    elements.challengeType.textContent = challenge.type;
    elements.challengeTitle.textContent = challenge.title;
    elements.challengeDescription.textContent = challenge.description;
    elements.originalPrompt.textContent = challenge.originalPrompt;
    elements.promptInput.placeholder = challenge.placeholder;
    elements.promptInput.value = result ? result.prompt : '';
    elements.challengeCounter.textContent = `Challenge ${state.currentChallenge + 1} of ${TOTAL_CHALLENGES}`;
    elements.progressPercent.textContent = `${progress}%`;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressBar.parentElement.setAttribute('aria-valuenow', String(progress));

    elements.scoreCard.hidden = !result;
    elements.nextButton.disabled = !result;

    if (result) {
      renderScoreCard(result);
    } else {
      elements.scoreCard.replaceChildren();
    }
  }

  function evaluatePrompt() {
    const prompt = elements.promptInput.value.trim();

    if (!prompt) {
      showInputHint('Please write a prompt before evaluating it.');
      elements.promptInput.focus();
      return;
    }

    const challenge = challengeBank[state.currentChallenge];
    const scores = calculateScores(prompt, challenge);
    const feedback = buildFeedback(scores, prompt, challenge);
    const average = Math.round((scores.clarity + scores.context + scores.specificity + scores.creativity) / 4);

    state.results[state.currentChallenge] = {
      prompt,
      scores,
      feedback,
      average,
      completedAt: Date.now(),
    };

    renderScoreCard(state.results[state.currentChallenge]);
    elements.scoreCard.hidden = false;
    elements.nextButton.disabled = false;
    playSuccessTone();
    renderDashboard();
    persistState();
  }

  function calculateScores(prompt, challenge) {
    const text = prompt.toLowerCase();
    const words = countWords(prompt);
    const keywordMatches = challenge.keywords.filter((keyword) => text.includes(keyword)).length;

    const clarity = clampScore(
      3 +
      (hasActionVerb(text) ? 2 : 0) +
      (words >= 18 ? 2 : words >= 10 ? 1 : 0) +
      (/[?.]$/.test(prompt) ? 1 : 0) +
      (hasAudience(text) ? 2 : 0)
    );

    const context = clampScore(
      2 +
      (hasAudience(text) ? 2 : 0) +
      (hasPurpose(text) ? 2 : 0) +
      Math.min(3, keywordMatches) +
      (containsAny(text, ['background', 'context', 'scenario', 'real-world']) ? 1 : 0)
    );

    const specificity = clampScore(
      2 +
      (words >= 25 ? 2 : words >= 16 ? 1 : 0) +
      (hasFormat(text) ? 2 : 0) +
      (hasConstraint(text) ? 2 : 0) +
      (/\d/.test(text) ? 1 : 0) +
      (keywordMatches >= 2 ? 1 : 0)
    );

    const creativity = clampScore(
      3 +
      (containsAny(text, ['style', 'tone', 'creative', 'visual', 'imagine', 'original']) ? 2 : 0) +
      (containsAny(text, ['example', 'character', 'setting', 'scenario', 'solution']) ? 2 : 0) +
      (words >= 30 ? 1 : 0) +
      (containsAny(text, ['responsible', 'safe', 'ethical', 'accurate', 'avoid']) ? 2 : 0)
    );

    return { clarity, context, specificity, creativity };
  }

  function buildFeedback(scores, prompt, challenge) {
    const text = prompt.toLowerCase();
    const feedback = [];

    if (scores.clarity >= 8) {
      feedback.push('Strong clarity: the task is easy to understand and act on.');
    } else {
      feedback.push('Make the main instruction clearer with a direct action verb such as explain, create, compare, or design.');
    }

    if (scores.context >= 8) {
      feedback.push('Excellent use of context: the AI has enough background to tailor its response.');
    } else {
      feedback.push('Try adding the audience, situation, goal, or background information.');
    }

    if (scores.specificity >= 8) {
      feedback.push('Strong specificity: your constraints and output expectations are clear.');
    } else {
      feedback.push('Add constraints such as length, time, must-have details, or what the AI should avoid.');
    }

    if (hasFormat(text)) {
      feedback.push('Good format guidance: this helps the AI produce classroom-ready output.');
    } else {
      feedback.push('Specify the format, such as a table, bullet list, steps, paragraph, or checklist.');
    }

    if (challenge.type.includes('Final') && !containsAny(text, ['responsible', 'safe', 'ethical', 'verify', 'accurate'])) {
      feedback.push('For real-world problems, add a responsible-use reminder such as checking facts or avoiding unsafe advice.');
    }

    return feedback;
  }

  function renderScoreCard(result) {
    const cardTitle = document.createElement('h2');
    cardTitle.textContent = 'Score card';

    const metricGrid = document.createElement('div');
    metricGrid.className = 'metric-grid';

    Object.entries(result.scores).forEach(([label, value]) => {
      const metric = document.createElement('div');
      metric.className = 'metric';
      metric.innerHTML = `<span>${capitalize(label)}</span><strong>${value}/10</strong>`;
      metricGrid.append(metric);
    });

    const feedbackTitle = document.createElement('h3');
    feedbackTitle.textContent = 'Feedback';

    const feedbackList = document.createElement('ul');
    feedbackList.className = 'feedback-list';
    result.feedback.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      feedbackList.append(listItem);
    });

    elements.scoreCard.replaceChildren(cardTitle, metricGrid, feedbackTitle, feedbackList);
  }

  function goToNextChallenge() {
    if (state.currentChallenge < TOTAL_CHALLENGES - 1) {
      state.currentChallenge += 1;
      renderChallenge();
      showScreen('challengeScreen');
      elements.promptInput.focus();
    } else {
      state.completedAt = Date.now();
      renderCompletion();
      showScreen('completion');
      launchConfetti();
    }

    persistState();
  }

  function renderCompletion() {
    const percentage = getOverallPercentage();
    elements.finalScore.textContent = `${percentage}%`;
    elements.strengthsList.replaceChildren(...buildStrengths().map(createListItem));
    elements.improvementsList.replaceChildren(...buildImprovements().map(createListItem));
  }

  function showCertificate() {
    const name = elements.studentName.value.trim() || state.studentName || 'Student';
    state.studentName = name;
    elements.certificateName.textContent = name;
    elements.certificateDate.textContent = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    showScreen('certificate');
    persistState();
  }

  function openTeacherDashboard() {
    elements.teacherDashboard.hidden = false;
    elements.teacherToggle.setAttribute('aria-expanded', 'true');
    renderDashboard();
  }

  function closeTeacherDashboard() {
    elements.teacherDashboard.hidden = true;
    elements.teacherToggle.setAttribute('aria-expanded', 'false');
    elements.teacherToggle.focus();
  }

  function renderDashboard() {
    const elapsedSeconds = state.startedAt ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
    const completedResults = state.results.filter(Boolean);
    const averagePromptQuality = completedResults.length
      ? Math.round(completedResults.reduce((sum, result) => sum + result.average, 0) / completedResults.length)
      : 0;

    elements.dashScore.textContent = `${getOverallPercentage()}%`;
    elements.dashTime.textContent = formatTime(elapsedSeconds);
    elements.dashAverage.textContent = `${averagePromptQuality}/10`;

    const challengeRows = challengeBank.map((challenge, index) => {
      const result = state.results[index];
      const row = document.createElement('div');
      row.innerHTML = `<strong>${index + 1}. ${challenge.title}</strong><br>${result ? `${result.average}/10` : 'Not completed'}`;
      return row;
    });

    elements.dashChallenges.replaceChildren(...challengeRows);
  }

  function showScreen(screenId, options = {}) {
    document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    state.screen = screenId;

    if (options.persist !== false) {
      persistState();
    }

    elements.mainContent.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    persistState();
  }

  function applyTheme() {
    document.body.classList.toggle('dark', state.theme === 'dark');
    elements.themeToggle.textContent = state.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    elements.themeToggle.setAttribute('aria-pressed', String(state.theme === 'dark'));
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    elements.soundToggle.textContent = state.soundEnabled ? 'Sound On' : 'Sound Off';
    elements.soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
    persistState();
  }

  function restartActivity() {
    clearStoredState();
    Object.assign(state, { ...defaultState, results: [] });
    elements.studentName.value = '';
    renderResumeButton();
    renderDashboard();
    showScreen('landing', { persist: false });
  }

  function playTypingAnimation() {
    const message = 'The student enters a virtual AI training environment. To complete the mission, they must solve prompt engineering challenges with clear, specific, responsible instructions.';
    let index = 0;
    elements.typingStory.textContent = '';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      elements.typingStory.textContent = message;
      return;
    }

    const timer = window.setInterval(() => {
      elements.typingStory.textContent = message.slice(0, index);
      index += 1;

      if (index > message.length) {
        window.clearInterval(timer);
      }
    }, 18);
  }

  function launchConfetti() {
    const canvas = elements.confettiCanvas;
    const context = canvas.getContext('2d');
    const pieces = [];
    const pieceCount = 100;
    let frame = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let index = 0; index < pieceCount; index += 1) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        size: 4 + Math.random() * 6,
        speed: 2 + Math.random() * 4,
        rotation: Math.random() * Math.PI,
      });
    }

    function drawFrame() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#000000';

      pieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += Math.sin((piece.y + piece.size) / 24);
        piece.rotation += 0.06;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        context.restore();
      });

      frame += 1;
      if (frame < 160) {
        window.requestAnimationFrame(drawFrame);
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    drawFrame();
  }

  function playSuccessTone() {
    if (!state.soundEnabled || !window.AudioContext) {
      return;
    }

    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 520;
    gain.gain.value = 0.04;
    oscillator.start();

    window.setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 120);
  }

  function restoreState() {
    const storedState = readStoredState();
    Object.assign(state, defaultState, storedState || {});
    state.results = Array.isArray(state.results) ? state.results : [];
    state.currentChallenge = Math.min(Math.max(Number(state.currentChallenge) || 0, 0), TOTAL_CHALLENGES - 1);

    if (state.studentName) {
      elements.studentName.value = state.studentName;
    }

    elements.soundToggle.textContent = state.soundEnabled ? 'Sound On' : 'Sound Off';
    elements.soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
  }

  function persistState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderResumeButton();
    } catch (error) {
      // The app still works when opened in restrictive local-file environments where storage is unavailable.
      console.warn('Progress could not be saved locally.', error);
    }
  }

  function readStoredState() {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (error) {
      console.warn('Saved progress could not be read.', error);
      return null;
    }
  }

  function clearStoredState() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Saved progress could not be cleared.', error);
    }
  }

  function renderResumeButton() {
    const hasProgress = Boolean(state.startedAt || state.results.some(Boolean));
    elements.resumeButton.hidden = !hasProgress;
  }

  function getOverallPercentage() {
    const totalScore = state.results.reduce((sum, result) => sum + (result ? result.average : 0), 0);
    return Math.round((totalScore / (TOTAL_CHALLENGES * 10)) * 100);
  }

  function buildStrengths() {
    const averages = averageByMetric();
    const strengths = [];

    if (averages.clarity >= 7) strengths.push('You wrote clear instructions that an AI can follow.');
    if (averages.context >= 7) strengths.push('You added helpful context for the audience and purpose.');
    if (averages.specificity >= 7) strengths.push('You used constraints and formats to guide better outputs.');
    if (averages.creativity >= 7) strengths.push('You used imaginative details and thoughtful scenarios.');

    return strengths.length ? strengths : ['You completed every challenge and practiced improving prompts step by step.'];
  }

  function buildImprovements() {
    const averages = averageByMetric();
    const improvements = [];

    if (averages.context < 8) improvements.push('Keep adding audience, background, and purpose to each prompt.');
    if (averages.specificity < 8) improvements.push('Add more measurable constraints such as time, length, format, or required details.');
    if (averages.clarity < 8) improvements.push('Start prompts with a precise action verb and a clear outcome.');
    if (averages.creativity < 8) improvements.push('Use tone, style, examples, or scenarios to make prompts richer.');

    return improvements.length ? improvements : ['Continue checking AI outputs for accuracy, safety, and responsible use.'];
  }

  function averageByMetric() {
    const completedResults = state.results.filter(Boolean);
    const totals = { clarity: 0, context: 0, specificity: 0, creativity: 0 };

    completedResults.forEach((result) => {
      Object.keys(totals).forEach((metric) => {
        totals[metric] += result.scores[metric];
      });
    });

    Object.keys(totals).forEach((metric) => {
      totals[metric] = completedResults.length ? totals[metric] / completedResults.length : 0;
    });

    return totals;
  }

  function showInputHint(message) {
    elements.scoreCard.hidden = false;
    const title = document.createElement('h2');
    title.textContent = 'Before scoring';
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    paragraph.style.color = 'var(--error)';
    elements.scoreCard.replaceChildren(title, paragraph);
  }

  function countWords(value) {
    return value.trim().split(/\s+/).filter(Boolean).length;
  }

  function containsAny(text, terms) {
    return terms.some((term) => text.includes(term));
  }

  function hasActionVerb(text) {
    return containsAny(text, ['explain', 'write', 'create', 'design', 'generate', 'compare', 'make', 'describe', 'plan', 'summarize']);
  }

  function hasAudience(text) {
    return containsAny(text, ['grade', 'student', 'class', 'audience', 'teacher', 'middle school', 'children', 'learner']);
  }

  function hasPurpose(text) {
    return containsAny(text, ['goal', 'purpose', 'so that', 'to help', 'because', 'for a', 'need']);
  }

  function hasFormat(text) {
    return containsAny(text, ['table', 'bullet', 'list', 'steps', 'paragraph', 'checklist', 'format', 'schedule']);
  }

  function hasConstraint(text) {
    return containsAny(text, ['include', 'avoid', 'must', 'limit', 'under', 'at least', 'no more', 'use simple', 'age-appropriate']);
  }

  function clampScore(value) {
    return Math.max(1, Math.min(10, Math.round(value)));
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function createListItem(text) {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
})();
