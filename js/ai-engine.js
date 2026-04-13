/* ========================================
   CV EXPERT AI - AI ENGINE
   Smart ATS Scoring, Keyword Analysis,
   Gap Detection & Recommendations
   ======================================== */

const AIEngine = (() => {
  // ==========================================
  // INDUSTRY KEYWORD DATABASE
  // ==========================================
  const INDUSTRY_KEYWORDS = {
    tech: {
      trending: ['AI', 'machine learning', 'cloud computing', 'DevOps', 'microservices', 'Kubernetes', 'Docker', 'CI/CD', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Azure', 'GCP', 'REST API', 'GraphQL', 'blockchain', 'cybersecurity', 'data engineering'],
      mustHave: ['JavaScript', 'Python', 'SQL', 'Git', 'agile', 'scrum', 'HTML', 'CSS', 'API', 'database', 'Linux', 'testing', 'debugging', 'version control', 'full-stack', 'front-end', 'back-end', 'responsive design'],
      bonus: ['TensorFlow', 'PyTorch', 'Terraform', 'Ansible', 'Redis', 'MongoDB', 'PostgreSQL', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'serverless', 'edge computing', 'WebAssembly', 'Rust', 'Go']
    },
    gis: {
      trending: ['spatial analysis', 'remote sensing', 'LiDAR', 'GIS automation', 'Python scripting', 'cloud GIS', 'real-time mapping', 'drone mapping', 'digital twin', 'smart city', 'spatial data science', 'GeoAI'],
      mustHave: ['ArcGIS', 'QGIS', 'spatial data', 'cartography', 'GPS', 'coordinate systems', 'geodatabase', 'geospatial', 'mapping', 'survey', 'terrain analysis', 'GIS analysis', 'data visualization', 'SQL', 'Python'],
      bonus: ['ArcPy', 'PostGIS', 'GeoServer', 'Mapbox', 'Leaflet', 'Google Earth Engine', 'ERDAS', 'FME', 'spatial SQL', 'web mapping', 'OGC standards', 'WMS', 'WFS']
    },
    finance: {
      trending: ['fintech', 'blockchain', 'cryptocurrency', 'algorithmic trading', 'RegTech', 'open banking', 'DeFi', 'ESG', 'sustainable finance', 'digital payments'],
      mustHave: ['financial analysis', 'risk management', 'compliance', 'accounting', 'Excel', 'financial modeling', 'budgeting', 'forecasting', 'reporting', 'audit', 'regulatory', 'portfolio management', 'investment', 'valuation'],
      bonus: ['Bloomberg Terminal', 'SAP', 'Oracle', 'Tableau', 'Power BI', 'VBA', 'Python', 'R', 'SQL', 'CFA', 'ACCA', 'IFRS', 'GAAP', 'Basel III']
    },
    engineering: {
      trending: ['IoT', 'Industry 4.0', 'digital twin', 'additive manufacturing', '3D printing', 'sustainable engineering', 'BIM', 'AI in engineering', 'robotics', 'autonomous systems'],
      mustHave: ['CAD', 'project management', 'quality assurance', 'technical drawing', 'testing', 'simulation', 'manufacturing', 'prototyping', 'problem solving', 'technical documentation', 'safety standards'],
      bonus: ['MATLAB', 'AutoCAD', 'SolidWorks', 'Revit', 'ANSYS', 'PLC', 'SCADA', 'lean manufacturing', 'Six Sigma', 'ISO 9001', 'FEA', 'CFD']
    },
    healthcare: {
      trending: ['telemedicine', 'digital health', 'AI diagnostics', 'health informatics', 'precision medicine', 'wearable technology', 'genomics', 'mHealth', 'interoperability'],
      mustHave: ['patient care', 'clinical', 'medical records', 'HIPAA', 'compliance', 'healthcare management', 'diagnosis', 'treatment', 'evidence-based', 'quality improvement', 'safety'],
      bonus: ['EHR', 'EMR', 'Epic', 'Cerner', 'HL7', 'FHIR', 'ICD-10', 'CPT', 'clinical trials', 'research methodology', 'biostatistics']
    },
    marketing: {
      trending: ['AI marketing', 'influencer marketing', 'short-form video', 'conversational marketing', 'zero-party data', 'metaverse marketing', 'social commerce', 'voice search', 'podcast marketing'],
      mustHave: ['SEO', 'SEM', 'content marketing', 'social media', 'analytics', 'branding', 'digital marketing', 'email marketing', 'campaign management', 'market research', 'copywriting', 'CRM'],
      bonus: ['Google Analytics', 'HubSpot', 'Salesforce', 'Mailchimp', 'Hootsuite', 'A/B testing', 'PPC', 'conversion optimization', 'marketing automation', 'Adobe Creative Suite']
    },
    energy: {
      trending: ['renewable energy', 'smart grid', 'energy storage', 'carbon capture', 'hydrogen economy', 'green technology', 'ESG reporting', 'electrification', 'decarbonization'],
      mustHave: ['power systems', 'energy management', 'grid operations', 'safety compliance', 'project management', 'maintenance', 'regulatory compliance', 'SCADA', 'asset management', 'distribution'],
      bonus: ['solar PV', 'wind energy', 'battery storage', 'GIS mapping', 'power BI', 'SAP', 'ISO 14001', 'ISO 50001', 'energy audit', 'load forecasting']
    },
    data: {
      trending: ['generative AI', 'LLMs', 'MLOps', 'feature engineering', 'AutoML', 'federated learning', 'edge AI', 'responsible AI', 'data mesh', 'data fabric'],
      mustHave: ['Python', 'SQL', 'machine learning', 'statistics', 'data analysis', 'data visualization', 'pandas', 'NumPy', 'scikit-learn', 'deep learning', 'ETL', 'big data'],
      bonus: ['TensorFlow', 'PyTorch', 'Spark', 'Hadoop', 'Airflow', 'dbt', 'Snowflake', 'Databricks', 'Tableau', 'Power BI', 'R', 'Julia', 'NLP']
    }
  };

  // ==========================================
  // ACTION VERBS DATABASE
  // ==========================================
  const STRONG_ACTION_VERBS = [
    'achieved', 'administered', 'advanced', 'analyzed', 'architected', 'automated',
    'built', 'championed', 'collaborated', 'consolidated', 'coordinated', 'created',
    'delivered', 'designed', 'developed', 'directed', 'drove', 'eliminated',
    'engineered', 'established', 'executed', 'expanded', 'facilitated', 'generated',
    'guided', 'implemented', 'improved', 'increased', 'initiated', 'innovated',
    'integrated', 'launched', 'led', 'managed', 'maximized', 'mentored',
    'modernized', 'negotiated', 'optimized', 'orchestrated', 'oversaw', 'pioneered',
    'planned', 'produced', 'programmed', 'propelled', 'reduced', 'redesigned',
    'resolved', 'revamped', 'scaled', 'spearheaded', 'streamlined', 'strengthened',
    'supervised', 'surpassed', 'transformed', 'unified', 'upgraded'
  ];

  const WEAK_VERBS = [
    'helped', 'assisted', 'worked', 'did', 'made', 'got', 'went',
    'tried', 'was responsible for', 'participated', 'handled', 'dealt with'
  ];

  // ==========================================
  // CV SECTION DETECTION
  // ==========================================
  const REQUIRED_SECTIONS = [
    { name: 'Contact Information', patterns: ['email', 'phone', 'address', 'linkedin', 'contact', '@', '+'] },
    { name: 'Professional Summary', patterns: ['summary', 'objective', 'profile', 'about me', 'professional summary', 'career objective', 'personal statement'] },
    { name: 'Work Experience', patterns: ['experience', 'employment', 'work history', 'professional experience', 'career history'] },
    { name: 'Education', patterns: ['education', 'academic', 'degree', 'university', 'college', 'school', 'qualification'] },
    { name: 'Skills', patterns: ['skills', 'competencies', 'expertise', 'proficiencies', 'technical skills', 'core competencies'] },
    { name: 'Certifications', patterns: ['certification', 'certificate', 'accreditation', 'license', 'credential'] }
  ];

  const BONUS_SECTIONS = [
    { name: 'Projects', patterns: ['project', 'portfolio'] },
    { name: 'Publications', patterns: ['publication', 'paper', 'journal', 'research'] },
    { name: 'Awards', patterns: ['award', 'honor', 'recognition', 'achievement'] },
    { name: 'Volunteer', patterns: ['volunteer', 'community', 'pro bono'] },
    { name: 'Languages', patterns: ['language', 'fluent', 'proficient'] },
    { name: 'References', patterns: ['reference', 'referees'] }
  ];

  // ==========================================
  // MAIN ANALYSIS FUNCTION
  // ==========================================
  function analyzeCV(cvText, industry = 'tech') {
    const text = cvText.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = cvText.split(/[.!?]+/).filter(s => s.trim());

    const results = {
      scores: {},
      sections: {},
      keywords: {},
      actionVerbs: {},
      recommendations: [],
      metrics: {},
      overall: 0
    };

    // 1. Section Detection
    results.sections = detectSections(text);

    // 2. Keyword Analysis
    results.keywords = analyzeKeywords(text, industry);

    // 3. Action Verb Analysis
    results.actionVerbs = analyzeActionVerbs(text);

    // 4. Quantifiable Metrics Detection
    results.metrics = detectMetrics(cvText);

    // 5. Format Quality
    results.scores.format = calculateFormatScore(cvText, results.sections);

    // 6. Content Quality
    results.scores.content = calculateContentScore(cvText, results);

    // 7. ATS Compatibility
    results.scores.ats = calculateATSScore(results);

    // 8. Impact Score
    results.scores.impact = calculateImpactScore(results);

    // 9. Overall Score
    results.scores.overall = Math.round(
      results.scores.ats * 0.35 +
      results.scores.format * 0.2 +
      results.scores.content * 0.25 +
      results.scores.impact * 0.2
    );

    // 10. Generate Recommendations
    results.recommendations = generateRecommendations(results, industry);

    return results;
  }

  // ==========================================
  // SECTION DETECTION
  // ==========================================
  function detectSections(text) {
    const found = [];
    const missing = [];

    REQUIRED_SECTIONS.forEach(section => {
      const isFound = section.patterns.some(pattern => text.includes(pattern));
      if (isFound) {
        found.push({ name: section.name, required: true });
      } else {
        missing.push({ name: section.name, required: true });
      }
    });

    BONUS_SECTIONS.forEach(section => {
      const isFound = section.patterns.some(pattern => text.includes(pattern));
      if (isFound) {
        found.push({ name: section.name, required: false });
      }
    });

    return { found, missing };
  }

  // ==========================================
  // KEYWORD ANALYSIS
  // ==========================================
  function analyzeKeywords(text, industry) {
    const industryData = INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.tech;
    const detected = [];
    const missing = [];
    const allKeywords = [...industryData.mustHave, ...industryData.trending];

    allKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        detected.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const density = detected.length / allKeywords.length;

    return {
      detected,
      missing: missing.slice(0, 15),
      density: Math.round(density * 100),
      total: allKeywords.length,
      industryData
    };
  }

  // ==========================================
  // ACTION VERB ANALYSIS
  // ==========================================
  function analyzeActionVerbs(text) {
    const found = [];
    const weak = [];

    STRONG_ACTION_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        found.push({ verb, count: matches.length });
      }
    });

    WEAK_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        weak.push({ verb, count: matches.length });
      }
    });

    return {
      strong: found.sort((a, b) => b.count - a.count),
      weak,
      score: Math.min(100, Math.round((found.length / 10) * 100))
    };
  }

  // ==========================================
  // QUANTIFIABLE METRICS DETECTION
  // ==========================================
  function detectMetrics(text) {
    const patterns = {
      percentages: text.match(/\d+(\.\d+)?%/g) || [],
      currency: text.match(/[\$\£\€\₦]\s*[\d,]+(\.\d+)?[KkMmBb]?/g) || [],
      numbers: text.match(/\b\d{1,3}(,\d{3})*\+?\b/g) || [],
      years: text.match(/\d+\+?\s*(years?|yrs?)/gi) || [],
      team: text.match(/team\s*of\s*\d+/gi) || [],
      multipliers: text.match(/\d+x\b/gi) || []
    };

    const totalMetrics = Object.values(patterns).reduce((sum, arr) => sum + arr.length, 0);

    return {
      patterns,
      total: totalMetrics,
      hasQuantifiableResults: totalMetrics >= 3,
      score: Math.min(100, Math.round((totalMetrics / 8) * 100))
    };
  }

  // ==========================================
  // SCORING FUNCTIONS
  // ==========================================
  function calculateFormatScore(text, sections) {
    let score = 50;

    // Section presence (up to 30 points)
    const requiredFound = sections.found.filter(s => s.required).length;
    score += (requiredFound / REQUIRED_SECTIONS.length) * 30;

    // Length check (up to 10 points)
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 1000) score += 10;
    else if (wordCount >= 200 && wordCount <= 1200) score += 6;
    else score += 2;

    // Has email (5 points)
    if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) score += 5;

    // Has phone (5 points)
    if (/[\+]?\d[\d\s\-\(\)]{7,}/.test(text)) score += 5;

    return Math.min(100, Math.round(score));
  }

  function calculateContentScore(text, results) {
    let score = 0;

    // Keyword density (30 points)
    score += (results.keywords.density / 100) * 30;

    // Action verbs (25 points)
    score += (results.actionVerbs.score / 100) * 25;

    // Quantifiable metrics (25 points)
    score += (results.metrics.score / 100) * 25;

    // Sentence variety (10 points)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length >= 10) score += 10;
    else score += (sentences.length / 10) * 10;

    // Bullet point usage (10 points)
    const bulletPoints = (text.match(/[•\-\*\►\→]/g) || []).length;
    if (bulletPoints >= 5) score += 10;
    else score += (bulletPoints / 5) * 10;

    return Math.min(100, Math.round(score));
  }

  function calculateATSScore(results) {
    let score = 0;

    // Keyword match (35%)
    score += (results.keywords.density / 100) * 35;

    // Section structure (25%)
    const sectionScore = results.sections.found.filter(s => s.required).length / REQUIRED_SECTIONS.length;
    score += sectionScore * 25;

    // Format compliance (20%)
    score += (results.scores.format / 100) * 20;

    // Content quality (20%)
    score += (results.scores.content / 100) * 20;

    return Math.min(100, Math.round(score));
  }

  function calculateImpactScore(results) {
    let score = 0;

    // Strong action verbs (30%)
    score += Math.min(30, results.actionVerbs.strong.length * 3);

    // Quantifiable results (30%)
    score += (results.metrics.score / 100) * 30;

    // Keyword strength (20%)
    score += (results.keywords.density / 100) * 20;

    // Low weak verbs penalty (20%)
    const weakCount = results.actionVerbs.weak.reduce((sum, v) => sum + v.count, 0);
    score += Math.max(0, 20 - weakCount * 3);

    return Math.min(100, Math.round(score));
  }

  // ==========================================
  // RECOMMENDATIONS ENGINE
  // ==========================================
  function generateRecommendations(results, industry) {
    const recs = [];

    // Missing sections
    results.sections.missing.forEach(section => {
      recs.push({
        type: 'critical',
        icon: 'fa-exclamation-circle',
        title: `Add ${section.name} section`,
        detail: `Your CV is missing a "${section.name}" section. This is required for ATS systems to properly parse your resume.`,
        impact: 'high'
      });
    });

    // Low keyword density
    if (results.keywords.density < 40) {
      const topMissing = results.keywords.missing.slice(0, 5).join(', ');
      recs.push({
        type: 'important',
        icon: 'fa-key',
        title: 'Add more industry keywords',
        detail: `Your keyword density is ${results.keywords.density}%. Consider adding: ${topMissing}`,
        impact: 'high'
      });
    }

    // Weak action verbs
    if (results.actionVerbs.weak.length > 2) {
      const weakList = results.actionVerbs.weak.map(v => v.verb).join(', ');
      recs.push({
        type: 'suggestion',
        icon: 'fa-bolt',
        title: 'Replace weak action verbs',
        detail: `Replace weak verbs (${weakList}) with strong alternatives like "spearheaded", "orchestrated", "drove", "engineered".`,
        impact: 'medium'
      });
    }

    // Low quantifiable metrics
    if (results.metrics.total < 3) {
      recs.push({
        type: 'important',
        icon: 'fa-chart-line',
        title: 'Add quantifiable achievements',
        detail: 'Add numbers, percentages, and metrics to your achievements. E.g., "Increased efficiency by 40%" or "Managed team of 12".',
        impact: 'high'
      });
    }

    // Few action verbs
    if (results.actionVerbs.strong.length < 5) {
      recs.push({
        type: 'suggestion',
        icon: 'fa-running',
        title: 'Use more action verbs',
        detail: 'Start bullet points with strong action verbs like "Implemented", "Developed", "Streamlined", "Optimized".',
        impact: 'medium'
      });
    }

    // General optimization tips
    if (results.scores.overall < 80) {
      recs.push({
        type: 'tip',
        icon: 'fa-lightbulb',
        title: 'Tailor for each application',
        detail: 'Customize your CV for each job by matching keywords from the job description. This can boost your ATS score by 20-30%.',
        impact: 'medium'
      });
    }

    return recs;
  }

  // ==========================================
  // JOB MATCH ANALYSIS
  // ==========================================
  function analyzeJobMatch(cvText, jobDescription) {
    const cvLower = cvText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Extract keywords from job description
    const jobWords = jobLower.match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'with', 'will', 'have', 'from', 'this', 'that', 'they', 'been', 'said', 'each', 'which', 'their', 'about', 'would', 'make', 'like', 'time', 'just', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'than', 'other', 'very', 'when', 'what', 'also', 'more', 'these', 'must', 'should']);

    const keywordFreq = {};
    jobWords.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        keywordFreq[word] = (keywordFreq[word] || 0) + 1;
      }
    });

    // Sort by frequency and get top keywords
    const topKeywords = Object.entries(keywordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word]) => word);

    const matching = topKeywords.filter(kw => cvLower.includes(kw));
    const missing = topKeywords.filter(kw => !cvLower.includes(kw));

    // Extract multi-word phrases
    const phrases = [];
    const phrasePatterns = jobLower.match(/[a-z]+\s+[a-z]+(?:\s+[a-z]+)?/g) || [];
    phrasePatterns.forEach(phrase => {
      if (phrase.split(' ').every(w => !stopWords.has(w) && w.length > 2)) {
        if (cvLower.includes(phrase)) {
          phrases.push({ phrase, matched: true });
        }
      }
    });

    const matchPercent = Math.round((matching.length / Math.max(topKeywords.length, 1)) * 100);

    const suggestions = [];
    if (missing.length > 0) {
      suggestions.push({
        icon: 'fa-plus-circle',
        text: `Add these missing keywords to your CV: ${missing.slice(0, 8).join(', ')}`
      });
    }
    if (matchPercent < 60) {
      suggestions.push({
        icon: 'fa-exclamation-triangle',
        text: 'Your CV needs significant tailoring for this position. Focus on incorporating the missing keywords naturally.'
      });
    }
    if (matchPercent >= 60 && matchPercent < 80) {
      suggestions.push({
        icon: 'fa-thumbs-up',
        text: 'Good match! Consider adding a few more keywords and tailoring your experience descriptions.'
      });
    }
    if (matchPercent >= 80) {
      suggestions.push({
        icon: 'fa-star',
        text: 'Excellent match! Your CV aligns very well with this job description.'
      });
    }

    return { matchPercent, matching, missing, phrases, suggestions };
  }

  // ==========================================
  // CV OPTIMIZER
  // ==========================================
  function optimizeCV(cvText, options = {}) {
    let optimized = cvText;
    const changes = [];

    // Optimize action verbs
    if (options.verbs !== false) {
      const verbReplacements = {
        'helped': 'facilitated',
        'worked on': 'developed',
        'was responsible for': 'managed',
        'assisted with': 'contributed to',
        'dealt with': 'resolved',
        'handled': 'orchestrated',
        'participated in': 'contributed to',
        'made': 'created',
        'did': 'executed',
        'got': 'achieved',
        'tried to': 'pursued',
        'worked with': 'collaborated with'
      };

      Object.entries(verbReplacements).forEach(([weak, strong]) => {
        const regex = new RegExp(`\\b${weak}\\b`, 'gi');
        if (regex.test(optimized)) {
          optimized = optimized.replace(regex, strong);
          changes.push({
            type: 'improved',
            text: `Replaced "${weak}" with "${strong}" for stronger impact`
          });
        }
      });
    }

    // Add metrics suggestion markers
    if (options.metrics !== false) {
      const lines = optimized.split('\n');
      let metricsAdded = 0;
      const enhancedLines = lines.map(line => {
        if (line.match(/^[\s]*[•\-\*]/) && !line.match(/\d+/) && metricsAdded < 3) {
          metricsAdded++;
          changes.push({
            type: 'added',
            text: `Suggested adding quantifiable metrics to: "${line.trim().substring(0, 50)}..."`
          });
        }
        return line;
      });
      optimized = enhancedLines.join('\n');
    }

    // Keyword enhancement
    if (options.keywords !== false && options.industry) {
      const industryData = INDUSTRY_KEYWORDS[options.industry];
      if (industryData) {
        const cvLower = optimized.toLowerCase();
        const missingMustHave = industryData.mustHave.filter(kw => !cvLower.includes(kw.toLowerCase()));
        if (missingMustHave.length > 0) {
          changes.push({
            type: 'added',
            text: `Consider adding these industry keywords: ${missingMustHave.slice(0, 5).join(', ')}`
          });
        }
      }
    }

    return { optimized, changes };
  }

  // ==========================================
  // INTERVIEW QUESTION GENERATOR
  // ==========================================
  function generateInterviewQuestions(cvText, type = 'mixed', difficulty = 'mid') {
    const questions = [];

    const behavioralQuestions = {
      entry: [
        { q: 'Tell me about a time you had to learn a new skill quickly. How did you approach it?', tip: 'Use the STAR method: Situation, Task, Action, Result. Focus on your learning agility.' },
        { q: 'Describe a situation where you had to work with a difficult team member.', tip: 'Show emotional intelligence and conflict resolution skills. End positively.' },
        { q: 'Give an example of a goal you set and how you achieved it.', tip: 'Be specific about your planning process and the measurable outcome.' },
        { q: 'Tell me about a mistake you made and what you learned from it.', tip: 'Show self-awareness and growth mindset. Focus on the lesson, not the mistake.' }
      ],
      mid: [
        { q: 'Describe a project where you had to manage competing priorities and tight deadlines.', tip: 'Demonstrate your time management, prioritization, and communication skills.' },
        { q: 'Tell me about a time you improved a process or workflow.', tip: 'Quantify the improvement. Use metrics like time saved, efficiency gained, or cost reduced.' },
        { q: 'Give an example of how you\'ve handled a disagreement with your manager.', tip: 'Show respect, professional communication, and problem-solving.' },
        { q: 'Describe a time when you had to make a decision with incomplete information.', tip: 'Show your analytical thinking, risk assessment, and decision-making process.' }
      ],
      senior: [
        { q: 'Tell me about a time you led a major organizational change initiative.', tip: 'Focus on vision, stakeholder management, change management methodology, and results.' },
        { q: 'Describe how you\'ve mentored team members and developed talent.', tip: 'Show your leadership philosophy, specific development strategies, and outcomes.' },
        { q: 'Give an example of a strategic decision that had significant business impact.', tip: 'Quantify the business impact and describe your strategic thinking process.' },
        { q: 'Tell me about navigating a crisis or critical situation.', tip: 'Demonstrate calm under pressure, decisive action, and lessons learned.' }
      ],
      executive: [
        { q: 'How have you built and transformed high-performing teams?', tip: 'Discuss your leadership framework, culture-building, and measurable team outcomes.' },
        { q: 'Describe your approach to driving innovation within an organization.', tip: 'Share specific innovation frameworks, risk tolerance, and business outcomes.' },
        { q: 'How do you balance short-term business pressures with long-term strategic goals?', tip: 'Show strategic thinking, prioritization, and stakeholder alignment.' }
      ]
    };

    const technicalQuestions = [
      { q: 'Walk me through how you would architect a solution for [relevant project from CV].', tip: 'Structure your answer: requirements gathering, design decisions, technology choices, trade-offs.' },
      { q: 'What is your approach to debugging complex issues in production?', tip: 'Show systematic methodology: reproduce, isolate, diagnose, fix, verify, document.' },
      { q: 'How do you stay current with industry trends and emerging technologies?', tip: 'Mention specific resources, communities, conferences, and personal projects.' },
      { q: 'Explain a technically complex concept from your experience to a non-technical stakeholder.', tip: 'Demonstrate communication skills and ability to simplify complex topics.' }
    ];

    const situationalQuestions = [
      { q: 'If you joined our team and found the existing system was poorly documented, what would you do?', tip: 'Show initiative, systematic approach, and team collaboration.' },
      { q: 'How would you handle a situation where your team is consistently missing deadlines?', tip: 'Address root causes, not symptoms. Show analytical and leadership skills.' },
      { q: 'What would you do if you disagreed with the technical direction set by leadership?', tip: 'Show respect for hierarchy while demonstrating your technical voice.' },
      { q: 'If budget cuts reduced your team by 30%, how would you reprioritize?', tip: 'Show strategic thinking, resource optimization, and clear communication.' }
    ];

    // Select questions based on type
    const behavioral = behavioralQuestions[difficulty] || behavioralQuestions.mid;

    if (type === 'behavioral' || type === 'mixed') {
      behavioral.forEach((item, i) => {
        questions.push({ ...item, type: 'Behavioral', number: questions.length + 1 });
      });
    }

    if (type === 'technical' || type === 'mixed') {
      technicalQuestions.forEach((item, i) => {
        questions.push({ ...item, type: 'Technical', number: questions.length + 1 });
      });
    }

    if (type === 'situational' || type === 'mixed') {
      situationalQuestions.forEach((item, i) => {
        questions.push({ ...item, type: 'Situational', number: questions.length + 1 });
      });
    }

    return questions;
  }

  // ==========================================
  // AI CHAT RESPONSE ENGINE
  // ==========================================
  function generateChatResponse(message, cvData = null) {
    const msgLower = message.toLowerCase();

    // Pattern matching for common queries
    if (msgLower.includes('ats') && (msgLower.includes('score') || msgLower.includes('improve'))) {
      return `Here are my top tips to improve your ATS score:\n\n1. **Use standard section headings** - "Work Experience", "Education", "Skills"\n2. **Include relevant keywords** from the job description\n3. **Avoid tables, columns, and graphics** - ATS can't parse them\n4. **Use a clean, standard font** like Calibri or Arial\n5. **Save as PDF or .docx** - these formats parse best\n6. **Add quantifiable achievements** with numbers and percentages\n\n${cvData ? `Your current ATS score is ${cvData.scores?.ats || '--'}. ` : ''}Would you like me to analyze a specific area?`;
    }

    if (msgLower.includes('keyword') || msgLower.includes('key word')) {
      return `Keywords are critical for ATS success! Here's my advice:\n\n1. **Mirror the job description** - use the exact phrases they use\n2. **Include both technical and soft skills** keywords\n3. **Place keywords naturally** in context, don't keyword-stuff\n4. **Use industry-standard terminology** and acronyms\n5. **Add keywords in multiple sections** - summary, experience, and skills\n\nWant me to suggest industry-specific keywords? Tell me your target industry!`;
    }

    if (msgLower.includes('summary') || msgLower.includes('objective')) {
      return `For a powerful professional summary:\n\n1. **Keep it 2-4 sentences** - concise and impactful\n2. **Lead with years of experience** and your expertise\n3. **Include your key achievement** with a metric\n4. **Match the job's requirements** in your summary\n5. **Avoid first person** ("I am...") - use direct statements\n\n**Example format:**\n"Results-driven [Title] with [X]+ years of experience in [industry]. Proven track record of [key achievement with metric]. Expert in [top 3 skills]."`;
    }

    if (msgLower.includes('format') || msgLower.includes('layout') || msgLower.includes('design')) {
      return `For optimal CV format:\n\n1. **One page** for <10 years experience, two pages for 10+\n2. **Standard fonts:** Calibri, Arial, or Helvetica (10-12pt)\n3. **Clear section headings** with consistent formatting\n4. **Reverse chronological order** for experience\n5. **Bullet points** for achievements (3-5 per role)\n6. **White space** - don't cram content\n7. **Consistent date format** throughout\n\nWould you like help with a specific section?`;
    }

    if (msgLower.includes('interview') || msgLower.includes('prepare')) {
      return `Interview preparation tips:\n\n1. **Research the company** thoroughly\n2. **Practice the STAR method** for behavioral questions\n3. **Prepare 5-7 stories** that showcase your key achievements\n4. **Have questions ready** for the interviewer\n5. **Know your CV inside out** - be ready to elaborate on anything\n\nWant me to generate practice questions? Head to the Interview Prep section!`;
    }

    if (msgLower.includes('review') || msgLower.includes('check') || msgLower.includes('analyze')) {
      return `I'd love to review your CV! You can:\n\n1. **Upload your CV** in the CV Analyzer section\n2. **Paste the text** directly for quick analysis\n3. I'll provide scores for ATS compatibility, format, content quality, and impact\n\nClick "CV Analyzer" in the sidebar to get started! I'll give you detailed recommendations for improvement.`;
    }

    if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
      return `Hello! Welcome to CV Expert AI! I'm here to help you create a standout resume. I can:\n\n- **Analyze** your CV for ATS compatibility\n- **Suggest** industry-specific keywords\n- **Generate** interview practice questions\n- **Provide tips** on formatting, content, and more\n\nWhat would you like help with?`;
    }

    // Default response
    return `Great question! Here are some ways I can help:\n\n1. **CV Analysis** - Upload your CV for comprehensive AI analysis\n2. **ATS Optimization** - Get your score and improvement tips\n3. **Keyword Suggestions** - Industry-specific keyword recommendations\n4. **Interview Prep** - AI-generated practice questions\n5. **CV Building** - Create a professional CV from scratch\n\nTry asking about specific topics like "How to improve my ATS score?" or "What keywords should I use for tech roles?"`;
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  return {
    analyzeCV,
    analyzeJobMatch,
    optimizeCV,
    generateInterviewQuestions,
    generateChatResponse,
    getIndustryKeywords: (industry) => INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.tech,
    INDUSTRY_KEYWORDS,
    STRONG_ACTION_VERBS
  };
})();
