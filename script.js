(function () {
  const STORAGE_KEY = 'ai-adventure-state-v1';
  const THEME_KEY = 'ai-adventure-theme-v1';
  const SOUND_KEY = 'ai-adventure-sound-v1';
  const GUIDE_KEY = 'ai-adventure-guide-hidden-v1';
  const TOTAL_CHALLENGES = 5;
  const DEFAULT_NAME = 'Student';

  const challengeData = [
    {
      id: 'space',
      eyebrow: 'Mission 1',
      title: 'Help the AI understand your instructions.',
      subtitle: 'Make the request clearer, more useful, and easier for AI to answer well.',
      mode: 'improve',
      prompt: 'Tell me about space.',
      hint: 'Add the audience, format, and level of detail you want.',
      placeholder: 'Example: Explain space to a Grade 6 student in 3 bullet points. Include one surprising fact and avoid jargon.',
      sample: 'Explain space to a Grade 6 student in 3 bullet points. Include one surprising fact and avoid jargon.',
      illustration: 'assets/illustrations/space.svg',
      focusKeywords: ['grade', 'student', 'bullet', 'facts', 'jargon', 'simple', 'clear']
    },
    {
      id: 'story',
      eyebrow: 'Mission 2',
      title: 'Make the story request more vivid.',
      subtitle: 'Turn a vague request into a prompt that gives the AI direction.',
      mode: 'improve',
      prompt: 'Write a story.',
      hint: 'Consider genre, setting, character, length, and tone.',
      placeholder: 'Example: Write a 250-word mystery story set in a library. Include a curious main character and a surprising ending.',
      sample: 'Write a 250-word mystery story set in a library. Include a curious main character and a surprising ending.',
      illustration: 'assets/illustrations/story.svg',
      focusKeywords: ['story', 'mystery', 'character', 'setting', 'word', 'ending', 'tone']
    },
    {
      id: 'timetable',
      eyebrow: 'Mission 3',
      title: 'Build a homework timetable prompt.',
      subtitle: 'Build a prompt that helps AI generate a structured timetable.',
      mode: 'create',
      prompt: 'Create a prompt that generates a homework timetable.',
      hint: 'Ask for structure, time blocks, subjects, breaks, and a clear output format.',
      placeholder: 'Example: Create a homework timetable for a Grade 7 student from Monday to Friday. Include subjects, 30-minute study blocks, and one short break each day in a table.',
      sample: 'Create a homework timetable for a Grade 7 student from Monday to Friday. Include subjects, 30-minute study blocks, and one short break each day in a table.',
      illustration: 'assets/illustrations/timetable.svg',
      focusKeywords: ['monday', 'friday', 'table', 'subjects', 'break', 'time', 'grade']
    },
    {
      id: 'dragon',
      eyebrow: 'Mission 4',
      title: 'Describe a dragon image with detail.',
      subtitle: 'Describe the image with enough detail for a strong generation result.',
      mode: 'create',
      prompt: 'Create an image generation prompt describing a dragon.',
      hint: 'Add style, lighting, environment, camera angle, and mood.',
      placeholder: 'Example: Create a detailed image of a silver dragon flying above snowy mountains at sunrise, cinematic lighting, realistic style, wide-angle view.',
      sample: 'Create a detailed image of a silver dragon flying above snowy mountains at sunrise, cinematic lighting, realistic style, wide-angle view.',
      illustration: 'assets/illustrations/dragon.svg',
      focusKeywords: ['dragon', 'light', 'style', 'cinematic', 'realistic', 'mountains', 'sunrise']
    },
    {
      id: 'problem',
      eyebrow: 'Final Mission',
      title: 'Solve a real-world problem with a prompt.',
      subtitle: 'Create a prompt that could help solve a real classroom, school, or community problem.',
      mode: 'create',
      prompt: 'Design your own prompt for solving a real-world problem.',
      hint: 'Name the problem, the audience, and the result you want.',
      placeholder: 'Example: Help me design a prompt that asks AI for a plan to reduce waste in our school cafeteria with steps, roles, and success criteria.',
      sample: 'Help me design a prompt that asks AI for a plan to reduce waste in our school cafeteria with steps, roles, and success criteria.',
      illustration: 'assets/illustrations/problem.svg',
      focusKeywords: ['school', 'community', 'steps', 'criteria', 'plan', 'reduce', 'help']
    }
  ];

  const state = {
    stage: 'landing',
    challengeIndex: 0,
    responses: [],
    studentName: DEFAULT_NAME,
    theme: 'light',
    soundEnabled: false,
    guideHidden: false,
    startedAt: null,
    completedAt: null,
    teacherOpen: false,
    loadingComplete: false
  };

  const elements = {};
  let audioContext = null;
  let introTimer = null;

  document.addEventListener('DOMContentLoaded', bootstrap);

  function bootstrap() {
    cacheElements();
    loadPersistedState();
    bindEvents();
    applyTheme();
    applySoundLabel();
    syncStudentNameInputs();
    syncGuideVisibility();
    restoreScreen();
    updateTeacherDashboard();
    revealLoadingScreen();
    if (state.stage === 'intro') {
      startIntroTypewriter();
    }
  }

  function cacheElements() {
    const ids = [
      'loadingScreen', 'appShell', 'themeToggle', 'soundToggle', 'restartButton', 'teacherToggle',
      'studentNameLanding', 'startButton', 'landingScreen', 'introScreen', 'challengeScreen', 'completionScreen',
      'beginButton', 'backToLandingButton', 'introStory', 'challengeCounter', 'progressPercent', 'progressFill',
      'challengeEyebrow', 'challengeTitle', 'challengeSubtitle', 'promptLabel', 'promptText', 'promptHint',
      'promptHelper', 'promptForm', 'promptInput', 'submitButton', 'resultsEmpty', 'resultsContent',
      'overallScore', 'metricList', 'feedbackList', 'retryButton', 'nextButton', 'finalScore', 'timeTaken',
      'averageQuality', 'strengthList', 'improvementList', 'learningList', 'certificateButton',
      'restartFromCompletionButton', 'teacherPanel', 'closeTeacherPanel', 'teacherStudentScore', 'teacherTimeTaken',
      'teacherPerformance', 'teacherAverageQuality', 'certificateModal', 'certificateName', 'certificateDate',
      'printCertificateButton', 'closeCertificateButton', 'confettiLayer', 'guideMessage', 'missionGuide',
      'guideBubbleText', 'guideFloat', 'guideFloatClose', 'xpValue', 'rankLabel', 'badgeStrip', 'completionBadgeStrip', 'badgeCount'
    ];

    ids.forEach((id) => {
      elements[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.soundToggle.addEventListener('click', toggleSound);
    elements.restartButton.addEventListener('click', restartActivity);
    elements.teacherToggle.addEventListener('click', openTeacherPanel);
    elements.closeTeacherPanel.addEventListener('click', closeTeacherPanel);
    elements.startButton.addEventListener('click', beginIntro);
    elements.beginButton.addEventListener('click', beginActivity);
    elements.backToLandingButton.addEventListener('click', goToLanding);
    elements.studentNameLanding.addEventListener('input', handleStudentNameChange);
    elements.promptForm.addEventListener('submit', handlePromptSubmit);
    elements.retryButton.addEventListener('click', resetCurrentChallengeDraft);
    elements.nextButton.addEventListener('click', goToNextChallenge);
    elements.certificateButton.addEventListener('click', openCertificate);
    elements.restartFromCompletionButton.addEventListener('click', restartActivity);
    elements.printCertificateButton.addEventListener('click', printCertificate);
    elements.closeCertificateButton.addEventListener('click', closeCertificate);
    elements.certificateModal.addEventListener('click', handleCertificateBackdrop);
    if (elements.guideFloatClose) {
      elements.guideFloatClose.addEventListener('click', dismissGuideFloat);
    }
    window.addEventListener('keydown', handleGlobalShortcuts);
    window.addEventListener('beforeunload', persistState);
  }

  function revealLoadingScreen() {
    window.setTimeout(() => {
      elements.loadingScreen.classList.add('is-hidden');
      elements.loadingScreen.setAttribute('aria-busy', 'false');
    }, 1100);
  }

  function loadPersistedState() {
    const savedState = readJson(STORAGE_KEY, null);
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedSound = localStorage.getItem(SOUND_KEY);
    const savedGuideHidden = localStorage.getItem(GUIDE_KEY);

    if (savedState) {
      Object.assign(state, savedState);
    }

    if (savedTheme === 'dark' || savedTheme === 'light') {
      state.theme = savedTheme;
    }

    if (savedSound === 'true') {
      state.soundEnabled = true;
    }

    if (savedGuideHidden === 'true') {
      state.guideHidden = true;
    }

    if (!state.studentName) {
      state.studentName = DEFAULT_NAME;
    }
  }

  function persistState() {
    const payload = {
      stage: state.stage,
      challengeIndex: state.challengeIndex,
      responses: state.responses,
      studentName: state.studentName,
      theme: state.theme,
      soundEnabled: state.soundEnabled,
      guideHidden: state.guideHidden,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      teacherOpen: state.teacherOpen
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(THEME_KEY, state.theme);
    localStorage.setItem(SOUND_KEY, String(state.soundEnabled));
    localStorage.setItem(GUIDE_KEY, String(state.guideHidden));
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    elements.themeToggle.setAttribute('aria-pressed', String(state.theme === 'dark'));
    elements.themeToggle.textContent = state.theme === 'dark' ? 'Light mode' : 'Dark mode';
    persistState();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    playSound(state.theme === 'dark' ? 260 : 220, 0.08, 'sine');
  }

  function applySoundLabel() {
    elements.soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
    elements.soundToggle.textContent = state.soundEnabled ? 'Sound on' : 'Sound off';
    persistState();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    applySoundLabel();
    playSound(420, 0.05, 'triangle');
  }

  function syncGuideVisibility() {
    if (elements.guideFloat) {
      elements.guideFloat.hidden = state.guideHidden;
    }
  }

  function dismissGuideFloat() {
    state.guideHidden = true;
    syncGuideVisibility();
    persistState();
  }

  function syncStudentNameInputs() {
    elements.studentNameLanding.value = state.studentName;
    updateCertificateName();
  }

  function handleStudentNameChange(event) {
    state.studentName = sanitizeName(event.target.value) || DEFAULT_NAME;
    if (event.target.value !== state.studentName) {
      event.target.value = state.studentName;
    }
    updateCertificateName();
    persistState();
  }

  function sanitizeName(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 40);
  }

  function restoreScreen() {
    if (state.stage === 'challenge' || state.stage === 'completion' || state.stage === 'intro') {
      renderCurrentStage();
      return;
    }

    showLanding();
  }

  function showLanding() {
    setScreen('landingScreen');
    state.stage = 'landing';
    setGuideMessage('Welcome Explorer! Choose your name and start the adventure.');
    persistState();
  }

  function beginIntro() {
    state.stage = 'intro';
    state.startedAt = state.startedAt || Date.now();
    renderCurrentStage();
    startIntroTypewriter();
    persistState();
    playSound(520, 0.08, 'triangle');
  }

  function beginActivity() {
    state.stage = 'challenge';
    state.challengeIndex = clampChallengeIndex(state.challengeIndex || 0);
    state.startedAt = state.startedAt || Date.now();
    renderCurrentStage();
    persistState();
    playSound(620, 0.08, 'square');
  }

  function goToLanding() {
    state.stage = 'landing';
    renderCurrentStage();
    playSound(200, 0.05, 'sine');
    persistState();
  }

  function renderCurrentStage() {
    clearIntroTimer();
    setScreen(getScreenForStage(state.stage));

    switch (state.stage) {
      case 'landing':
        break;
      case 'intro':
        renderIntro();
        break;
      case 'challenge':
        renderChallenge();
        break;
      case 'completion':
        renderCompletion();
        break;
      default:
        showLanding();
    }

    updateTeacherDashboard();
  }

  function getScreenForStage(stage) {
    if (stage === 'intro') {
      return 'introScreen';
    }
    if (stage === 'challenge') {
      return 'challengeScreen';
    }
    if (stage === 'completion') {
      return 'completionScreen';
    }
    return 'landingScreen';
  }

  function setScreen(screenId) {
    const screens = ['landingScreen', 'introScreen', 'challengeScreen', 'completionScreen'];
    screens.forEach((id) => {
      const element = elements[id];
      const active = id === screenId;
      element.hidden = !active;
      element.classList.toggle('is-active', active);
    });
  }

  function renderIntro() {
    const missionText = `You are entering a virtual AI training environment. To complete the mission, you will solve ${TOTAL_CHALLENGES} prompt engineering challenges and learn how better prompts change AI responses.`;
    elements.introStory.textContent = missionText;
    setGuideMessage('Welcome Explorer! Professor Nova will help you solve each mission.');
  }

  function startIntroTypewriter() {
    const fullText = `You are entering a virtual AI training environment. To complete the mission, you will solve ${TOTAL_CHALLENGES} prompt engineering challenges and learn how better prompts change AI responses.`;
    clearIntroTimer();
    elements.introStory.textContent = '';

    let index = 0;
    introTimer = window.setInterval(() => {
      index += 1;
      elements.introStory.textContent = fullText.slice(0, index);
      if (index >= fullText.length) {
        clearIntroTimer();
      }
    }, 18);
  }

  function clearIntroTimer() {
    if (introTimer) {
      window.clearInterval(introTimer);
      introTimer = null;
    }
  }

  function renderChallenge() {
    const challenge = challengeData[state.challengeIndex];
    if (!challenge) {
      finishAdventure();
      return;
    }

    elements.challengeEyebrow.textContent = challenge.eyebrow;
    elements.challengeTitle.textContent = challenge.title;
    elements.challengeSubtitle.textContent = challenge.subtitle;
    elements.promptLabel.textContent = challenge.mode === 'improve' ? 'Your mission prompt' : 'Your mission prompt';
    elements.promptText.textContent = challenge.prompt;
    elements.promptHint.textContent = challenge.hint;
    elements.promptHelper.textContent = challenge.mode === 'improve'
      ? 'Focus on clarity, context, and specific instructions.'
      : 'Try to include audience, format, constraints, and purpose.';
    elements.promptInput.placeholder = challenge.placeholder;
    elements.promptInput.value = state.responses[state.challengeIndex]?.draft || '';
    elements.challengeCounter.textContent = `Mission ${state.challengeIndex + 1} of ${TOTAL_CHALLENGES}`;
    const percent = Math.round(((state.challengeIndex + 1) / TOTAL_CHALLENGES) * 100);
    elements.progressPercent.textContent = `${percent}%`;
    elements.progressFill.style.width = `${percent}%`;
    updateMissionMap();
    elements.resultsEmpty.hidden = true;
    elements.resultsContent.hidden = !(state.responses[state.challengeIndex] && state.responses[state.challengeIndex].submitted);
    elements.nextButton.disabled = !state.responses[state.challengeIndex] || !state.responses[state.challengeIndex].submitted;
    elements.nextButton.textContent = state.challengeIndex === TOTAL_CHALLENGES - 1 ? 'Complete mission' : 'Next mission';
    setGuideMessage(`Great job, Explorer! Mission ${state.challengeIndex + 1} is ready.`);

    if (state.responses[state.challengeIndex] && state.responses[state.challengeIndex].submitted) {
      showChallengeResults(state.responses[state.challengeIndex].analysis);
    } else {
      resetResultsView();
    }

    elements.challengeScreen.querySelector('.challenge-card--prompt').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetResultsView() {
    elements.resultsEmpty.hidden = false;
    elements.resultsContent.hidden = true;
    elements.metricList.innerHTML = '';
    elements.feedbackList.innerHTML = '';
    elements.badgeStrip.innerHTML = '';
    elements.xpValue.textContent = '+0 XP';
    elements.rankLabel.textContent = 'AI Explorer';
    elements.nextButton.disabled = true;
  }

  function handlePromptSubmit(event) {
    event.preventDefault();
    const prompt = elements.promptInput.value.trim();
    if (!prompt) {
      announceValidation('Write a prompt before scoring it.');
      playSound(160, 0.08, 'square');
      return;
    }

    const challenge = challengeData[state.challengeIndex];
    const analysis = analyzePrompt(prompt, challenge);
    state.responses[state.challengeIndex] = {
      draft: prompt,
      analysis,
      submitted: true,
      timeStamp: Date.now()
    };

    persistState();
    showChallengeResults(analysis);
    elements.resultsEmpty.hidden = true;
    elements.resultsContent.hidden = false;
    elements.nextButton.disabled = false;
    playSound(680, 0.09, 'triangle');
  }

  function announceValidation(message) {
    elements.promptHelper.textContent = message;
    window.clearTimeout(announceValidation.timer);
    announceValidation.timer = window.setTimeout(() => {
      elements.promptHelper.textContent = 'Be specific, clear, and useful.';
    }, 2000);
  }

  function analyzePrompt(prompt, challenge) {
    const text = prompt.toLowerCase();
    const words = prompt.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentenceCount = Math.max(1, (prompt.match(/[.!?]/g) || []).length);
    const hasAudience = /student|teacher|class|kid|kids|middle school|grade|reader|for a/i.test(prompt);
    const hasFormat = /bullet|list|table|steps|paragraph|template|chart|outline|sections|numbered/i.test(prompt);
    const hasConstraints = /limit|avoid|include|must|should|without|exactly|at least|no more than|use/i.test(prompt);
    const hasRole = /as an|act as|you are|pretend|be an expert|be a/i.test(prompt);
    const hasContext = challenge.focusKeywords.some((keyword) => text.includes(keyword));
    const hasProblem = /problem|goal|help|improve|plan|solution|create|design|generate/i.test(prompt);
    const detailScore = Math.min(10, Math.round(wordCount / 4));
    const clarity = clampScore(
      2 + detailScore + (sentenceCount > 1 ? 1 : 0) + (hasRole ? 1 : 0) - (wordCount < 5 ? 2 : 0)
    );
    const context = clampScore(
      2 + (hasAudience ? 3 : 0) + (hasContext ? 3 : 0) + (hasProblem ? 1 : 0) + (hasRole ? 1 : 0)
    );
    const specificity = clampScore(
      2 + (hasFormat ? 3 : 0) + (hasConstraints ? 3 : 0) + Math.min(2, Math.floor(wordCount / 10))
    );
    const creativity = clampScore(
      2 + scoreCreativeLanguage(prompt) + (challenge.id === 'story' && /mystery|adventure|surprise|unexpected/i.test(prompt) ? 2 : 0) +
      (challenge.id === 'dragon' && /cinematic|realistic|mythic|dramatic|snow|fire|sky/i.test(prompt) ? 2 : 0) +
      (challenge.id === 'problem' && /school|community|real world|team|help/i.test(prompt) ? 2 : 0)
    );

    const overall = Math.round((clarity + context + specificity + creativity) / 4);
    const feedback = buildFeedback({ prompt, challenge, clarity, context, specificity, creativity });

    return {
      clarity,
      context,
      specificity,
      creativity,
      overall,
      feedback,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      insights: feedback.insights
    };
  }

  function scoreCreativeLanguage(prompt) {
    const creativeWords = ['surprising', 'creative', 'imaginative', 'cinematic', 'detailed', 'engaging', 'original', 'interesting', 'fresh', 'unique'];
    const lower = prompt.toLowerCase();
    return creativeWords.reduce((score, word) => score + (lower.includes(word) ? 1 : 0), 0);
  }

  function buildFeedback({ prompt, challenge, clarity, context, specificity, creativity }) {
    const strengths = [];
    const improvements = [];
    const insights = [];
    const lower = prompt.toLowerCase();

    if (clarity >= 7) {
      strengths.push('Excellent! Your prompt is easy to understand.');
      insights.push('Clear wording helps the AI focus on the task.');
    } else {
      improvements.push('Try making the wording a little clearer.');
    }

    if (context >= 7) {
      strengths.push('Great use of context.');
      insights.push('Context helps the AI choose the right response level.');
    } else {
      improvements.push('Add the audience so the AI knows who this is for.');
    }

    if (specificity >= 7) {
      strengths.push('Nice work adding useful constraints.');
      insights.push('Specific instructions guide the output format.');
    } else {
      improvements.push('Add a little more detail or a clear constraint.');
    }

    if (creativity >= 7) {
      strengths.push('Your prompt shows creative thinking.');
      insights.push('Creative prompts can produce richer results.');
    } else {
      improvements.push('Try a more original angle or scenario.');
    }

    if (!/format|table|list|bullet|steps|paragraph/i.test(lower)) {
      improvements.push('Specify the format so the output is easier to use.');
    }

    if (challenge.id === 'space' && /space/.test(lower) && /grade|student|kid|child/i.test(lower)) {
      strengths.push('You matched the request to a learner audience.');
    }

    if (challenge.id === 'dragon' && /light|style|angle|cinematic|realistic/i.test(lower)) {
      strengths.push('Excellent visual detail for image generation.');
    }

    if (challenge.id === 'problem' && /school|community|real-world|solve|plan/i.test(lower)) {
      strengths.push('You connected the prompt to a real-world problem.');
    }

    if (challenge.mode === 'improve' && prompt.trim().length <= challenge.prompt.length + 6) {
      improvements.push('Expand the prompt with more detail than the original.');
    }

    return {
      strengths: dedupeMessages(strengths),
      improvements: dedupeMessages(improvements),
      insights: dedupeMessages(insights)
    };
  }

  function dedupeMessages(list) {
    return Array.from(new Set(list));
  }

  function clampScore(value) {
    return Math.max(0, Math.min(10, Math.round(value)));
  }

  function setGuideMessage(message) {
    if (elements.guideMessage) {
      elements.guideMessage.textContent = message;
    }
    if (elements.missionGuide) {
      elements.missionGuide.textContent = message;
    }
    if (elements.guideBubbleText) {
      elements.guideBubbleText.textContent = message;
    }
  }

  function updateMissionMap() {
    const missionNodes = document.querySelectorAll('.mission-node');
    missionNodes.forEach((node, index) => {
      node.classList.toggle('is-complete', index < state.challengeIndex);
      node.classList.toggle('is-current', index === state.challengeIndex && state.stage === 'challenge');
      node.classList.toggle('is-final', index === TOTAL_CHALLENGES - 1);
    });
  }

  function getRankLabel(score) {
    if (score >= 9) {
      return 'Prompt Expert';
    }
    if (score >= 7) {
      return 'Critical Thinker';
    }
    if (score >= 5) {
      return 'AI Explorer';
    }
    return 'Starter Explorer';
  }

  function buildChallengeBadges(analysis) {
    const badges = [];
    if (analysis.context >= 7) badges.push('Context Builder');
    if (analysis.specificity >= 7) badges.push('Detail Driver');
    if (analysis.clarity >= 7) badges.push('Clear Communicator');
    if (analysis.creativity >= 7) badges.push('Creative Spark');
    if (badges.length === 0) badges.push('Growing Prompter');
    return badges.slice(0, 3);
  }

  function buildCompletionBadges(summary) {
    const badges = [];
    const analyses = summary.analyses || [];

    if (summary.averageQuality >= 8) badges.push('Prompt Expert');
    if (summary.averageQuality >= 6) badges.push('Critical Thinker');
    if (analyses.some((analysis) => analysis.context >= 7)) badges.push('Context Builder');
    if (analyses.some((analysis) => analysis.specificity >= 7)) badges.push('Detail Driver');
    if (analyses.some((analysis) => analysis.creativity >= 7)) badges.push('Creative Spark');
    if (badges.length === 0) badges.push('AI Explorer');

    return badges.slice(0, 4);
  }

  function renderBadgeStrip(container, badges) {
    if (!container) {
      return;
    }

    container.innerHTML = badges.map((badge) => `<span class="badge-chip">${badge}</span>`).join('');
  }

  function showChallengeResults(analysis) {
    elements.overallScore.textContent = analysis.overall;
    elements.xpValue.textContent = `+${analysis.overall * 10} XP`;
    elements.rankLabel.textContent = getRankLabel(analysis.overall);
    renderBadgeStrip(elements.badgeStrip, buildChallengeBadges(analysis));
    renderMetricList(analysis);
    renderFeedbackList(analysis.feedback);
    renderTeacherPerformance();
    updateTeacherDashboard();
    pulseResults();
    setGuideMessage(analysis.overall >= 8 ? 'Excellent! Your prompt is getting stronger.' : 'Nice improvement. Add a little more detail to level up.');
  }

  function renderMetricList(analysis) {
    const metrics = [
      ['Clarity', analysis.clarity],
      ['Context', analysis.context],
      ['Specificity', analysis.specificity],
      ['Creativity', analysis.creativity]
    ];

    elements.metricList.innerHTML = metrics.map(([label, score]) => `
      <div class="metric-item">
        <div class="metric-item__top">
          <span>${label}</span>
          <strong>${score}/10</strong>
        </div>
        <div class="metric-item__bar" aria-hidden="true"><span style="width:${score * 10}%"></span></div>
      </div>
    `).join('');
  }

  function renderFeedbackList(feedback) {
    const items = [...feedback.strengths, ...feedback.improvements, ...feedback.insights].slice(0, 5);
    elements.feedbackList.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }

  function pulseResults() {
    elements.resultsContent.animate(
      [{ opacity: 0.65, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 240, easing: 'ease-out' }
    );
  }

  function resetCurrentChallengeDraft() {
    const current = state.responses[state.challengeIndex];
    if (current) {
      state.responses[state.challengeIndex] = {
        ...current,
        draft: ''
      };
    }
    elements.promptInput.value = '';
    resetResultsView();
    persistState();
    playSound(220, 0.05, 'sine');
  }

  function goToNextChallenge() {
    if (state.challengeIndex >= TOTAL_CHALLENGES - 1) {
      finishAdventure();
      return;
    }

    state.challengeIndex += 1;
    state.stage = 'challenge';
    renderChallenge();
    persistState();
    playSound(720, 0.07, 'triangle');
  }

  function finishAdventure() {
    state.stage = 'completion';
    state.completedAt = Date.now();
    renderCurrentStage();
    triggerConfetti();
    playSound(880, 0.1, 'square');
    persistState();
  }

  function renderCompletion() {
    const summary = calculateCompletionSummary();
    const totalXp = summary.finalScore * 10;
    elements.finalScore.textContent = `${totalXp} XP`;
    elements.timeTaken.textContent = formatDuration(summary.timeTakenMs);
    elements.averageQuality.textContent = `${summary.averageQuality}/10`;
    elements.teacherStudentScore.textContent = `${summary.finalScore}/100`;
    elements.teacherTimeTaken.textContent = formatDuration(summary.timeTakenMs);
    elements.teacherAverageQuality.textContent = `${summary.averageQuality}/10`;
    renderCompletionLists(summary);
    renderBadgeStrip(elements.completionBadgeStrip, buildCompletionBadges(summary));
    elements.badgeCount.textContent = String(buildCompletionBadges(summary).length);
    updateTeacherDashboard();
    setGuideMessage('Great job! You earned your AI Adventure Graduate certificate.');
  }

  function calculateCompletionSummary() {
    const analyses = state.responses.map((response) => response && response.analysis).filter(Boolean);
    const finalScore = analyses.length
      ? Math.round(analyses.reduce((total, analysis) => total + analysis.overall, 0) / analyses.length * 10)
      : 0;
    const averageQuality = analyses.length
      ? Math.round(analyses.reduce((total, analysis) => total + analysis.overall, 0) / analyses.length)
      : 0;
    const timeTakenMs = (state.completedAt || Date.now()) - (state.startedAt || Date.now());

    return {
      finalScore,
      averageQuality,
      timeTakenMs,
      analyses
    };
  }

  function renderCompletionLists(summary) {
    const strengths = new Set();
    const improvements = new Set();

    summary.analyses.forEach((analysis) => {
      analysis.strengths.forEach((item) => strengths.add(item));
      analysis.improvements.forEach((item) => improvements.add(item));
    });

    const learningOutcomes = [
      'You learned that strong prompts name the audience.',
      'You learned that constraints make responses more useful.',
      'You learned that structure improves AI output quality.'
    ];

    elements.strengthList.innerHTML = Array.from(strengths).slice(0, 3).map((item) => `<li>${item}</li>`).join('') || '<li>You completed every challenge.</li>';
    elements.improvementList.innerHTML = Array.from(improvements).slice(0, 3).map((item) => `<li>${item}</li>`).join('') || '<li>Keep adding precise details to each prompt.</li>';
    elements.learningList.innerHTML = learningOutcomes.map((item) => `<li>${item}</li>`).join('');
  }

  function calculateAveragePromptScore() {
    const analyses = state.responses.map((response) => response && response.analysis).filter(Boolean);
    if (!analyses.length) {
      return 0;
    }
    return Math.round(analyses.reduce((sum, analysis) => sum + analysis.overall, 0) / analyses.length);
  }

  function formatDuration(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function updateTeacherDashboard() {
    const summary = calculateCompletionSummary();
    const averagePromptScore = calculateAveragePromptScore();
    elements.teacherStudentScore.textContent = summary.finalScore ? `${summary.finalScore}/100` : '0/100';
    elements.teacherTimeTaken.textContent = formatDuration(summary.timeTakenMs || 0);
    elements.teacherAverageQuality.textContent = `${averagePromptScore}/10`;
    renderTeacherPerformance();
  }

  function renderTeacherPerformance() {
    const analyses = state.responses.map((response, index) => response && response.analysis ? { index, analysis: response.analysis } : null).filter(Boolean);
    if (!analyses.length) {
      elements.teacherPerformance.innerHTML = '<p class="helper-text">No challenge data yet.</p>';
      return;
    }

    elements.teacherPerformance.innerHTML = analyses.map(({ index, analysis }) => `
      <div class="teacher-performance__item">
        <div class="metric-item__top">
          <span>Challenge ${index + 1}</span>
          <strong>${analysis.overall}/10</strong>
        </div>
        <div class="teacher-performance__bar" aria-hidden="true"><span style="width:${analysis.overall * 10}%"></span></div>
      </div>
    `).join('');
  }

  function openTeacherPanel() {
    state.teacherOpen = true;
    elements.teacherPanel.hidden = false;
    elements.teacherToggle.setAttribute('aria-expanded', 'true');
    persistState();
    playSound(260, 0.05, 'sine');
  }

  function closeTeacherPanel() {
    state.teacherOpen = false;
    elements.teacherPanel.hidden = true;
    elements.teacherToggle.setAttribute('aria-expanded', 'false');
    persistState();
  }

  function openCertificate() {
    updateCertificateName();
    elements.certificateDate.textContent = `Date: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
    elements.certificateModal.hidden = false;
    elements.certificateModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    playSound(520, 0.08, 'triangle');
  }

  function closeCertificate() {
    elements.certificateModal.hidden = true;
    elements.certificateModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function handleCertificateBackdrop(event) {
    if (event.target.hasAttribute('data-close-certificate')) {
      closeCertificate();
    }
  }

  function updateCertificateName() {
    elements.certificateName.textContent = state.studentName || DEFAULT_NAME;
  }

  function printCertificate() {
    window.print();
  }

  function triggerConfetti() {
    const layer = elements.confettiLayer;
    layer.innerHTML = '';
    const colors = ['#111111', '#4a4a4a', '#888888', '#16a34a'];
    const pieceCount = 120;

    for (let index = 0; index < pieceCount; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${-10 - Math.random() * 20}px`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty('--x', `${Math.random() * 120 - 60}px`);
      piece.style.animationDelay = `${Math.random() * 0.25}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      layer.appendChild(piece);
    }

    window.setTimeout(() => {
      layer.innerHTML = '';
    }, 2200);
  }

  function handleGlobalShortcuts(event) {
    if (event.key === 'Escape') {
      if (!elements.certificateModal.hidden) {
        closeCertificate();
      }
      if (!elements.teacherPanel.hidden) {
        closeTeacherPanel();
      }
    }

    if (event.key.toLowerCase() === 't' && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (elements.teacherPanel.hidden) {
        openTeacherPanel();
      } else {
        closeTeacherPanel();
      }
    }
  }

  function restartActivity() {
    const confirmed = window.confirm('Restart the activity and clear your progress?');
    if (!confirmed) {
      return;
    }

    state.stage = 'landing';
    state.challengeIndex = 0;
    state.responses = [];
    state.startedAt = null;
    state.completedAt = null;
    state.teacherOpen = false;
    elements.teacherPanel.hidden = true;
    elements.teacherToggle.setAttribute('aria-expanded', 'false');
    elements.promptInput.value = '';
    localStorage.removeItem(STORAGE_KEY);
    renderCurrentStage();
    showLanding();
    syncStudentNameInputs();
    closeCertificate();
    persistState();
    playSound(180, 0.05, 'sine');
  }

  function clampChallengeIndex(index) {
    return Math.max(0, Math.min(TOTAL_CHALLENGES - 1, index));
  }

  function playSound(frequency, duration, type) {
    if (!state.soundEnabled) {
      return;
    }

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.0001;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function finishAdventureFromRestore() {
    if (state.completedAt) {
      state.stage = 'completion';
      renderCurrentStage();
    }
  }

  finishAdventureFromRestore();
})();
