/* ========================================
   CV EXPERT AI - MAIN APPLICATION
   Navigation, UI Control, State Management
   ======================================== */

const CVExpert = (() => {
  // ==========================================
  // STATE
  // ==========================================
  let state = {
    currentView: 'dashboard',
    cvText: '',
    analysisResults: null,
    builderStep: 1,
    builderData: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      summary: '',
      experience: [],
      education: [],
      technicalSkills: [],
      softSkills: [],
      certifications: []
    },
    chatOpen: false,
    sidebarCollapsed: false,
    selectedIndustry: 'tech',
    history: []
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    initParticles();
    initLoadingScreen();
    initNavigation();
    initSearch();
    initFileUpload();
    initKeyboardShortcuts();
    initCounters();
    initDashboardGauge(89);
    loadKeywordsForIndustry('tech');

    // Restore state from localStorage
    try {
      const saved = localStorage.getItem('cvExpertState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.history) state.history = parsed.history;
        if (parsed.selectedIndustry) state.selectedIndustry = parsed.selectedIndustry;
      }
    } catch (e) { /* ignore */ }
  }

  // ==========================================
  // PARTICLE BACKGROUND
  // ==========================================
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.loading-progress');
    const percentEl = document.getElementById('loadingPercent');
    const statusEl = document.getElementById('loadingStatus');
    const app = document.getElementById('app');

    const statuses = [
      'Loading neural networks...',
      'Initializing AI models...',
      'Preparing NLP engine...',
      'Loading keyword database...',
      'Configuring ATS analyzer...',
      'Ready!'
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          app.classList.remove('hidden');
          animateDashboard();
        }, 500);
      }
      progressBar.style.width = progress + '%';
      percentEl.textContent = Math.round(progress) + '%';
      statusEl.textContent = statuses[Math.min(Math.floor(progress / 20), statuses.length - 1)];
    }, 200);
  }

  // ==========================================
  // NAVIGATION
  // ==========================================
  function initNavigation() {
    // Sidebar menu items
    document.querySelectorAll('.menu-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(item.dataset.view);
      });
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }

    // Command palette items
    document.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('click', () => {
        navigate(item.dataset.action);
        toggleCommandPalette(false);
      });
    });

    // Notifications btn
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        showToast('No new notifications', 'info');
      });
    }

    // AI Assistant btn
    const aiBtn = document.getElementById('aiAssistantBtn');
    if (aiBtn) {
      aiBtn.addEventListener('click', toggleChat);
    }
  }

  function navigate(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show target view
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
      target.classList.remove('fade-in');
      void target.offsetWidth; // Force reflow
      target.classList.add('fade-in');
    }

    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
      if (item.classList.contains('active')) {
        if (!item.querySelector('.menu-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'menu-indicator';
          item.appendChild(indicator);
        }
      } else {
        const indicator = item.querySelector('.menu-indicator');
        if (indicator) indicator.remove();
      }
    });

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');

    state.currentView = viewName;
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    state.sidebarCollapsed = sidebar.classList.contains('collapsed');
  }

  // ==========================================
  // SEARCH & COMMAND PALETTE
  // ==========================================
  function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('focus', () => toggleCommandPalette(true));
    }

    const commandInput = document.getElementById('commandInput');
    if (commandInput) {
      commandInput.addEventListener('input', (e) => {
        filterCommands(e.target.value);
      });
    }

    // Close command palette on click outside
    const palette = document.getElementById('commandPalette');
    if (palette) {
      palette.addEventListener('click', (e) => {
        if (e.target === palette) toggleCommandPalette(false);
      });
    }
  }

  function toggleCommandPalette(show) {
    const palette = document.getElementById('commandPalette');
    if (show === undefined) {
      palette.classList.toggle('hidden');
    } else {
      palette.classList.toggle('hidden', !show);
    }
    if (!palette.classList.contains('hidden')) {
      setTimeout(() => document.getElementById('commandInput')?.focus(), 100);
    }
  }

  function filterCommands(query) {
    const items = document.querySelectorAll('.command-item');
    const q = query.toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K - Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Escape - Close modals
      if (e.key === 'Escape') {
        toggleCommandPalette(false);
        document.getElementById('modalOverlay')?.classList.add('hidden');
      }
    });
  }

  // ==========================================
  // FILE UPLOAD
  // ==========================================
  function initFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('cvFileInput');

    if (!uploadZone || !fileInput) return;

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    });

    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file);
    });
  }

  async function handleFileUpload(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showToast('File too large. Maximum 10MB allowed.', 'error');
      return;
    }

    const progressSection = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('uploadProgressBar');
    const fileName = document.getElementById('uploadFileName');
    const fileSize = document.getElementById('uploadFileSize');
    const percent = document.getElementById('uploadPercent');

    progressSection.classList.remove('hidden');
    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 90) {
        clearInterval(interval);
        progress = 90;
      }
      progressBar.style.width = progress + '%';
      percent.textContent = Math.round(progress) + '%';
    }, 150);

    try {
      const text = await CVParser.readFile(file);
      clearInterval(interval);
      progressBar.style.width = '100%';
      percent.textContent = '100%';

      if (text && text.length > 50) {
        document.getElementById('cvTextInput').value = text;
        state.cvText = text;
        showToast('File uploaded successfully!', 'success');
        setTimeout(() => analyzeCV(), 500);
      } else {
        showToast('Could not extract text. Please paste your CV content manually.', 'warning');
      }
    } catch (err) {
      clearInterval(interval);
      showToast('Error reading file. Please paste content manually.', 'error');
    }
  }

  // ==========================================
  // CV ANALYSIS
  // ==========================================
  function analyzeCV() {
    const cvText = document.getElementById('cvTextInput')?.value || state.cvText;
    if (!cvText || cvText.trim().length < 50) {
      showToast('Please enter or upload CV content (minimum 50 characters).', 'warning');
      return;
    }

    state.cvText = cvText;
    showToast('AI is analyzing your CV...', 'info');

    // Simulate processing delay for UX
    setTimeout(() => {
      const results = AIEngine.analyzeCV(cvText, state.selectedIndustry);
      state.analysisResults = results;

      // Save to history
      state.history.unshift({
        date: new Date().toISOString(),
        scores: results.scores,
        industry: state.selectedIndustry
      });
      saveState();

      displayAnalysisResults(results);
      showToast('Analysis complete!', 'success');
    }, 1500);
  }

  function displayAnalysisResults(results) {
    const container = document.getElementById('analysisResults');
    container.classList.remove('hidden');

    // Animate score gauges
    animateGauge('overallScoreGauge', results.scores.overall);
    animateGauge('atsScoreGauge', results.scores.ats);
    animateGauge('formatScoreGauge', results.scores.format);
    animateGauge('contentScoreGauge', results.scores.content);
    animateGauge('impactScoreGauge', results.scores.impact);

    // Update ATS Score view too
    animateGauge('atsBigGauge', results.scores.ats);
    updateATSBreakdown(results);

    // Update dashboard gauge
    initDashboardGauge(results.scores.ats);

    // Sections found
    const sectionsEl = document.getElementById('sectionsFound');
    sectionsEl.innerHTML = '';
    results.sections.found.forEach(s => {
      sectionsEl.innerHTML += `<div class="check-item"><i class="fas fa-check-circle found"></i> ${s.name} ${s.required ? '' : '<span style="font-size:0.7rem;color:var(--text-muted)">(Bonus)</span>'}</div>`;
    });
    results.sections.missing.forEach(s => {
      sectionsEl.innerHTML += `<div class="check-item"><i class="fas fa-times-circle missing"></i> ${s.name} <span style="font-size:0.7rem;color:var(--danger)">(Missing)</span></div>`;
    });

    // Keywords detected
    const keywordsEl = document.getElementById('keywordsDetected');
    keywordsEl.innerHTML = results.keywords.detected.map(k => `<span class="tag matched">${k}</span>`).join('');

    // Action verbs
    const verbsEl = document.getElementById('actionVerbs');
    verbsEl.innerHTML = results.actionVerbs.strong.map(v => `<span class="tag">${v.verb} (${v.count})</span>`).join('');
    if (results.actionVerbs.weak.length > 0) {
      verbsEl.innerHTML += '<br><p style="font-size:0.75rem;color:var(--danger);margin-top:8px;width:100%"><i class="fas fa-exclamation-triangle"></i> Weak verbs found: ' + results.actionVerbs.weak.map(v => v.verb).join(', ') + '</p>';
    }

    // Recommendations
    const recsEl = document.getElementById('aiRecommendations');
    recsEl.innerHTML = results.recommendations.map(r => `
      <div class="recommendation-item">
        <i class="fas ${r.icon}"></i>
        <div>
          <strong>${r.title}</strong>
          <p style="margin:4px 0 0;color:var(--text-secondary)">${r.detail}</p>
        </div>
      </div>
    `).join('');

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateATSBreakdown(results) {
    const atsMessage = document.getElementById('atsMessage');
    if (atsMessage) {
      const score = results.scores.ats;
      if (score >= 80) atsMessage.textContent = 'Excellent! Your CV is highly ATS-compatible.';
      else if (score >= 60) atsMessage.textContent = 'Good score, but there\'s room for improvement.';
      else atsMessage.textContent = 'Your CV needs optimization for ATS systems.';
    }

    const breakdownItems = document.querySelectorAll('#atsBreakdown .breakdown-item');
    const scores = [
      results.keywords.density,
      results.scores.format,
      Math.round((results.sections.found.filter(s => s.required).length / 6) * 100),
      results.scores.content,
      results.actionVerbs.score,
      results.metrics.score
    ];

    breakdownItems.forEach((item, i) => {
      const fill = item.querySelector('.breakdown-fill');
      const value = item.querySelector('.breakdown-value');
      const score = scores[i] || 0;
      setTimeout(() => {
        fill.style.width = score + '%';
        value.textContent = score + '%';
        // Color coding
        if (score >= 80) fill.style.background = 'linear-gradient(90deg, #00ff88, #00cc6a)';
        else if (score >= 60) fill.style.background = 'linear-gradient(90deg, #ffbb00, #ff9500)';
        else fill.style.background = 'linear-gradient(90deg, #ff4466, #cc3355)';
      }, i * 150);
    });
  }

  function loadSampleCV() {
    const textarea = document.getElementById('cvTextInput');
    if (textarea) {
      textarea.value = CVParser.getSampleCV();
      showToast('Sample CV loaded! Click "Analyze with AI" to begin.', 'info');
    }
  }

  function exportReport() {
    if (!state.analysisResults) {
      showToast('No analysis results to export.', 'warning');
      return;
    }
    const data = JSON.stringify(state.analysisResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-analysis-report.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report exported!', 'success');
  }

  // ==========================================
  // JOB MATCH
  // ==========================================
  function analyzeJobMatch() {
    const jobDesc = document.getElementById('jobDescription')?.value;
    if (!jobDesc || jobDesc.length < 30) {
      showToast('Please enter a job description (minimum 30 characters).', 'warning');
      return;
    }
    if (!state.cvText) {
      showToast('Please analyze a CV first in the CV Analyzer.', 'warning');
      return;
    }

    showToast('Analyzing job match...', 'info');

    setTimeout(() => {
      const results = AIEngine.analyzeJobMatch(state.cvText, jobDesc);

      document.getElementById('matchResults').classList.remove('hidden');

      // Match percentage gauge
      animateGauge('matchPercentage', results.matchPercent);

      // Matching keywords
      const matchingEl = document.getElementById('matchingKeywords');
      matchingEl.innerHTML = results.matching.map(k => `<span class="tag matched">${k}</span>`).join('');

      // Missing keywords
      const missingEl = document.getElementById('missingKeywords');
      missingEl.innerHTML = results.missing.map(k => `<span class="tag missing">${k}</span>`).join('');

      // Suggestions
      const suggestionsEl = document.getElementById('matchSuggestions');
      suggestionsEl.innerHTML = results.suggestions.map(s => `
        <div class="recommendation-item">
          <i class="fas ${s.icon}"></i>
          <p>${s.text}</p>
        </div>
      `).join('');

      showToast('Job match analysis complete!', 'success');
    }, 1200);
  }

  // ==========================================
  // CV OPTIMIZER
  // ==========================================
  function optimizeCV() {
    const text = document.getElementById('optimizerInput')?.value;
    if (!text || text.length < 50) {
      showToast('Please enter CV content to optimize.', 'warning');
      return;
    }

    const options = {
      ats: document.getElementById('optATS')?.checked,
      keywords: document.getElementById('optKeywords')?.checked,
      verbs: document.getElementById('optVerbs')?.checked,
      metrics: document.getElementById('optMetrics')?.checked,
      industry: document.getElementById('targetIndustry')?.value
    };

    showToast('AI is optimizing your CV...', 'info');

    setTimeout(() => {
      const result = AIEngine.optimizeCV(text, options);

      document.getElementById('optimizerResults').classList.remove('hidden');
      document.getElementById('optimizedContent').textContent = result.optimized;

      const changesEl = document.getElementById('changesList');
      changesEl.innerHTML = result.changes.map(c => `
        <div class="change-item">
          <span class="change-type ${c.type}">${c.type.toUpperCase()}</span>
          <span>${c.text}</span>
        </div>
      `).join('');

      showToast('Optimization complete!', 'success');
    }, 1500);
  }

  function copyOptimized() {
    const content = document.getElementById('optimizedContent')?.textContent;
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        showToast('Copied to clipboard!', 'success');
      });
    }
  }

  // ==========================================
  // KEYWORDS
  // ==========================================
  function selectIndustry(industry) {
    state.selectedIndustry = industry;

    document.querySelectorAll('.industry-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.industry === industry);
    });

    loadKeywordsForIndustry(industry);
    saveState();
  }

  function loadKeywordsForIndustry(industry) {
    const data = AIEngine.getIndustryKeywords(industry);

    const trendingEl = document.getElementById('trendingKeywords');
    const mustHaveEl = document.getElementById('mustHaveKeywords');
    const bonusEl = document.getElementById('bonusKeywords');

    if (trendingEl) trendingEl.innerHTML = data.trending.map(k => `<span class="tag">${k}</span>`).join('');
    if (mustHaveEl) mustHaveEl.innerHTML = data.mustHave.map(k => `<span class="tag matched">${k}</span>`).join('');
    if (bonusEl) bonusEl.innerHTML = data.bonus.map(k => `<span class="tag bonus">${k}</span>`).join('');
  }

  // ==========================================
  // INTERVIEW PREP
  // ==========================================
  function generateInterviewQuestions() {
    const type = document.getElementById('interviewType')?.value || 'mixed';
    const difficulty = document.getElementById('interviewDifficulty')?.value || 'mid';

    const questions = AIEngine.generateInterviewQuestions(state.cvText, type, difficulty);

    const container = document.getElementById('interviewQuestions');
    container.innerHTML = questions.map(q => `
      <div class="question-card glass-card animate-in" style="--delay: ${q.number * 0.1}s">
        <span class="question-type-badge">${q.type}</span>
        <p class="question-number">Question ${q.number}</p>
        <p class="question-text">${q.q}</p>
        <div class="question-tip">
          <i class="fas fa-lightbulb" style="color: var(--accent); margin-right: 6px;"></i>
          <strong>Tip:</strong> ${q.tip}
        </div>
      </div>
    `).join('');

    showToast(`Generated ${questions.length} interview questions!`, 'success');
  }

  // ==========================================
  // CV BUILDER
  // ==========================================
  const Builder = {
    nextStep() {
      if (state.builderStep < 5) {
        state.builderStep++;
        updateBuilderUI();
        if (state.builderStep === 5) this.generatePreview();
      }
    },

    prevStep() {
      if (state.builderStep > 1) {
        state.builderStep--;
        updateBuilderUI();
      }
    },

    addExperience() {
      const list = document.getElementById('experienceList');
      const idx = list.children.length;
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <div class="form-grid">
          <div class="form-group"><label>Job Title</label><input type="text" class="form-input exp-title" placeholder="e.g. Senior Developer"></div>
          <div class="form-group"><label>Company</label><input type="text" class="form-input exp-company" placeholder="Company name"></div>
          <div class="form-group"><label>Start Date</label><input type="text" class="form-input exp-start" placeholder="e.g. Jan 2020"></div>
          <div class="form-group"><label>End Date</label><input type="text" class="form-input exp-end" placeholder="Present"></div>
          <div class="form-group"><label>Location</label><input type="text" class="form-input exp-location" placeholder="City, Country"></div>
          <div class="form-group full-width"><label>Description</label><textarea class="form-input exp-desc" rows="3" placeholder="Key achievements and responsibilities..."></textarea></div>
        </div>
      `;
      list.appendChild(item);
    },

    addEducation() {
      const list = document.getElementById('educationList');
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <div class="form-grid">
          <div class="form-group"><label>Degree</label><input type="text" class="form-input edu-degree" placeholder="e.g. B.Sc. Computer Science"></div>
          <div class="form-group"><label>Institution</label><input type="text" class="form-input edu-inst" placeholder="University name"></div>
          <div class="form-group"><label>Year</label><input type="text" class="form-input edu-year" placeholder="e.g. 2020"></div>
        </div>
      `;
      list.appendChild(item);
    },

    addCertification() {
      const list = document.getElementById('certificationsList');
      const item = document.createElement('div');
      item.className = 'dynamic-item';
      item.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <div class="form-grid">
          <div class="form-group"><label>Certification Name</label><input type="text" class="form-input cert-name" placeholder="e.g. AWS Certified"></div>
          <div class="form-group"><label>Year</label><input type="text" class="form-input cert-year" placeholder="e.g. 2023"></div>
        </div>
      `;
      list.appendChild(item);
    },

    collectData() {
      state.builderData = {
        fullName: document.getElementById('bFullName')?.value || '',
        title: document.getElementById('bTitle')?.value || '',
        email: document.getElementById('bEmail')?.value || '',
        phone: document.getElementById('bPhone')?.value || '',
        location: document.getElementById('bLocation')?.value || '',
        linkedIn: document.getElementById('bLinkedIn')?.value || '',
        summary: document.getElementById('bSummary')?.value || '',
        experience: Array.from(document.querySelectorAll('#experienceList .dynamic-item')).map(item => ({
          title: item.querySelector('.exp-title')?.value || '',
          company: item.querySelector('.exp-company')?.value || '',
          startDate: item.querySelector('.exp-start')?.value || '',
          endDate: item.querySelector('.exp-end')?.value || '',
          location: item.querySelector('.exp-location')?.value || '',
          description: item.querySelector('.exp-desc')?.value || ''
        })),
        education: Array.from(document.querySelectorAll('#educationList .dynamic-item')).map(item => ({
          degree: item.querySelector('.edu-degree')?.value || '',
          institution: item.querySelector('.edu-inst')?.value || '',
          year: item.querySelector('.edu-year')?.value || ''
        })),
        technicalSkills: Array.from(document.querySelectorAll('#technicalSkills .skill-tag')).map(t => t.dataset.skill),
        softSkills: Array.from(document.querySelectorAll('#softSkills .skill-tag')).map(t => t.dataset.skill),
        certifications: Array.from(document.querySelectorAll('#certificationsList .dynamic-item')).map(item => ({
          name: item.querySelector('.cert-name')?.value || '',
          year: item.querySelector('.cert-year')?.value || ''
        }))
      };
      return state.builderData;
    },

    generatePreview() {
      const data = this.collectData();
      const template = document.getElementById('templateSelect')?.value || 'modern';
      const previewEl = document.getElementById('cvPreview');
      if (previewEl) {
        previewEl.innerHTML = CVParser.renderCVPreview(data, template);
      }
    },

    changeTemplate() {
      this.generatePreview();
    },

    generateSummary() {
      const title = document.getElementById('bTitle')?.value;
      if (!title) {
        showToast('Please enter a professional title first.', 'warning');
        return;
      }
      const summary = `Results-driven ${title} with extensive experience delivering high-impact solutions. Proven track record of leading cross-functional teams and driving operational efficiency. Expert in leveraging cutting-edge technologies to solve complex challenges and deliver measurable business outcomes.`;
      document.getElementById('bSummary').value = summary;
      showToast('AI-generated summary created!', 'success');
    },

    suggestSkills(type) {
      const title = document.getElementById('bTitle')?.value?.toLowerCase() || '';
      let suggestions = [];

      if (title.includes('gis') || title.includes('geospatial')) {
        suggestions = ['ArcGIS Pro', 'QGIS', 'Python', 'PostGIS', 'Remote Sensing', 'Spatial Analysis', 'SQL', 'Cartography'];
      } else if (title.includes('developer') || title.includes('engineer')) {
        suggestions = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'REST APIs', 'TypeScript'];
      } else if (title.includes('manager') || title.includes('lead')) {
        suggestions = ['Project Management', 'Team Leadership', 'Strategic Planning', 'Agile/Scrum', 'Stakeholder Management', 'Budgeting'];
      } else {
        suggestions = ['Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Data Analysis', 'Leadership'];
      }

      suggestions.forEach(skill => addSkillTag('technicalSkills', skill));
      showToast(`Added ${suggestions.length} suggested skills!`, 'success');
    },

    downloadCV() {
      const previewContent = document.getElementById('cvPreview')?.innerHTML;
      if (!previewContent) {
        showToast('No CV to download. Complete the builder first.', 'warning');
        return;
      }

      const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>CV - ${state.builderData.fullName || 'Resume'}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>body{margin:40px;font-family:'Inter',sans-serif;}</style></head>
<body>${previewContent}</body></html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.builderData.fullName || 'CV'}_Resume.html`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('CV downloaded! Open in browser and print to PDF.', 'success');
    }
  };

  function updateBuilderUI() {
    // Update steps
    document.querySelectorAll('.builder-steps .step').forEach((step, i) => {
      const stepNum = i + 1;
      step.classList.toggle('active', stepNum === state.builderStep);
      step.classList.toggle('completed', stepNum < state.builderStep);
    });

    // Show current step form
    for (let i = 1; i <= 5; i++) {
      const stepEl = document.getElementById(`builderStep${i}`);
      if (stepEl) stepEl.classList.toggle('active', i === state.builderStep);
    }
  }

  // Skill tags input handler
  function initSkillInputs() {
    ['techSkillInput', 'softSkillInput'].forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            e.preventDefault();
            const containerId = inputId === 'techSkillInput' ? 'technicalSkills' : 'softSkills';
            addSkillTag(containerId, input.value.trim());
            input.value = '';
          }
        });
      }
    });
  }

  function addSkillTag(containerId, skill) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Check for duplicates
    const existing = container.querySelectorAll('.skill-tag');
    for (const tag of existing) {
      if (tag.dataset.skill.toLowerCase() === skill.toLowerCase()) return;
    }

    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.dataset.skill = skill;
    tag.innerHTML = `${skill} <button onclick="this.parentElement.remove()">&times;</button>`;

    const input = container.querySelector('input');
    container.insertBefore(tag, input);
  }

  // ==========================================
  // TEMPLATES
  // ==========================================
  function useTemplate(template) {
    navigate('builder');
    document.getElementById('templateSelect').value = template;
    showToast(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected!`, 'info');
  }

  // ==========================================
  // AI CHAT
  // ==========================================
  function toggleChat() {
    state.chatOpen = !state.chatOpen;
    const widget = document.getElementById('aiChatWidget');
    const floatingBtn = document.getElementById('aiFloatingBtn');

    widget.classList.toggle('hidden', !state.chatOpen);
    floatingBtn.style.display = state.chatOpen ? 'none' : 'flex';
  }

  function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input?.value?.trim();
    if (!msg) return;

    addChatMessage(msg, 'user');
    input.value = '';

    // Simulate typing delay
    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
      typingIndicator.remove();
      const response = AIEngine.generateChatResponse(msg, state.analysisResults);
      addChatMessage(response, 'ai');
    }, 800 + Math.random() * 1000);
  }

  function sendQuickChat(msg) {
    document.getElementById('chatInput').value = msg;
    sendChat();
  }

  function addChatMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `
      <div class="message-avatar"><i class="fas ${sender === 'ai' ? 'fa-robot' : 'fa-user'}"></i></div>
      <div class="message-bubble">${formatChatMessage(text)}</div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function addTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'chat-message ai';
    indicator.innerHTML = `
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-bubble"><em style="color:var(--text-muted)">Thinking...</em></div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
    return indicator;
  }

  function formatChatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n- /g, '</p><li>')
      .replace(/\n(\d+)\. /g, '</p><li>')
      .replace(/\n/g, '<br>');
  }

  function clearChat() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = `
      <div class="chat-message ai">
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-bubble"><p>Chat cleared! How can I help you?</p></div>
      </div>
    `;
  }

  // ==========================================
  // THEME & SETTINGS
  // ==========================================
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    const select = document.getElementById('themeSelect');
    if (select) select.value = theme;
    localStorage.setItem('cvExpertTheme', theme);
  }

  function setAccent(color) {
    document.documentElement.style.setProperty('--accent', color);
    const rgb = hexToRgb(color);
    if (rgb) {
      document.documentElement.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.style.getPropertyValue('--dot-color').trim() === color);
    });
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function toggleAnimations() {
    const enabled = document.getElementById('animationsToggle')?.checked;
    document.documentElement.dataset.animations = enabled ? 'true' : 'false';
  }

  // ==========================================
  // GAUGE ANIMATIONS
  // ==========================================
  function animateGauge(gaugeId, value) {
    const gauge = document.getElementById(gaugeId);
    if (!gauge) return;

    const circle = gauge.querySelector('.gauge-fill');
    const text = gauge.querySelector('.gauge-value, .gauge-value-sm, .gauge-value-lg');
    if (!circle || !text) return;

    const radius = parseFloat(circle.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    // Color based on score
    if (value >= 80) circle.style.stroke = '#00ff88';
    else if (value >= 60) circle.style.stroke = '#ffbb00';
    else circle.style.stroke = '#ff4466';

    // Animate
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;

      // Count up text
      let current = 0;
      const step = value / 30;
      const counter = setInterval(() => {
        current += step;
        if (current >= value) {
          current = value;
          clearInterval(counter);
        }
        text.textContent = Math.round(current);
      }, 30);
    }, 300);
  }

  function initDashboardGauge(score) {
    animateGauge('dashboardGauge', score);
  }

  // ==========================================
  // COUNTERS
  // ==========================================
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el, target) {
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.round(current);
    }, 40);
  }

  function animateDashboard() {
    // Re-trigger animations
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.opacity = '0';
      void el.offsetWidth;
      el.style.opacity = '';
    });
  }

  // ==========================================
  // TOASTS
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // PERSISTENCE
  // ==========================================
  function saveState() {
    try {
      localStorage.setItem('cvExpertState', JSON.stringify({
        history: state.history.slice(0, 20),
        selectedIndustry: state.selectedIndustry
      }));
    } catch (e) { /* ignore */ }
  }

  function exportAllData() {
    const data = JSON.stringify({
      history: state.history,
      builderData: state.builderData,
      settings: { industry: state.selectedIndustry }
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-expert-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!', 'success');
  }

  function clearHistory() {
    state.history = [];
    saveState();
    showToast('History cleared.', 'info');
  }

  // ==========================================
  // INIT ON DOM READY
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initSkillInputs();

    // Restore theme
    const savedTheme = localStorage.getItem('cvExpertTheme') || 'dark';
    setTheme(savedTheme);
  });

  // ==========================================
  // PUBLIC API
  // ==========================================
  return {
    navigate,
    analyzeCV,
    loadSampleCV,
    exportReport,
    analyzeJobMatch,
    optimizeCV,
    copyOptimized,
    selectIndustry,
    generateInterviewQuestions,
    toggleChat,
    sendChat,
    sendQuickChat,
    clearChat,
    setTheme,
    setAccent,
    toggleAnimations,
    useTemplate,
    exportAllData,
    clearHistory,
    Builder,
    showToast
  };
})();
