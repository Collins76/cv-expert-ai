/* ========================================
   CV EXPERT AI - CV PARSER & BUILDER
   File parsing, CV generation,
   and template rendering
   ======================================== */

const CVParser = (() => {
  // ==========================================
  // FILE READER
  // ==========================================
  async function readFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'txt') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }

    if (ext === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      return extractPDFText(arrayBuffer);
    }

    if (ext === 'docx' || ext === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      return extractDocxText(arrayBuffer);
    }

    throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT.');
  }

  // ==========================================
  // PDF TEXT EXTRACTION (using PDF.js)
  // ==========================================
  async function extractPDFText(arrayBuffer) {
    // Check if PDF.js is available
    if (typeof pdfjsLib === 'undefined') {
      throw new Error('PDF.js library not loaded. Please refresh the page and try again.');
    }

    // Set the worker source for PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    try {
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const totalPages = pdf.numPages;
      const textParts = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Build text from items, preserving line breaks
        let lastY = null;
        let lineText = '';

        textContent.items.forEach(item => {
          const currentY = Math.round(item.transform[5]);

          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            // New line detected (Y position changed significantly)
            textParts.push(lineText.trim());
            lineText = '';
          }

          // Add space between items on same line if there's a gap
          if (lineText && !lineText.endsWith(' ') && !item.str.startsWith(' ')) {
            const prevEnd = lineText.length > 0;
            if (prevEnd && item.str.length > 0) {
              lineText += ' ';
            }
          }

          lineText += item.str;
          lastY = currentY;
        });

        // Push last line
        if (lineText.trim()) {
          textParts.push(lineText.trim());
        }

        // Add page separator for multi-page docs
        if (pageNum < totalPages) {
          textParts.push('');
        }
      }

      const fullText = textParts
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')  // Remove excessive blank lines
        .trim();

      if (fullText.length < 20) {
        throw new Error('Could not extract readable text from this PDF. It may be image-based or scanned.');
      }

      return fullText;
    } catch (error) {
      if (error.message && error.message.includes('Could not extract')) {
        throw error;
      }
      throw new Error(
        'Failed to parse this PDF file. The file may be corrupted, password-protected, or image-based. ' +
        'Please try copying and pasting the text content directly.'
      );
    }
  }

  // ==========================================
  // DOCX TEXT EXTRACTION (using JSZip)
  // ==========================================
  async function extractDocxText(arrayBuffer) {
    // Check if JSZip is available
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip library not loaded. Please refresh the page and try again.');
    }

    try {
      const zip = await JSZip.loadAsync(arrayBuffer);

      // DOCX stores content in word/document.xml
      const documentXml = zip.file('word/document.xml');
      if (!documentXml) {
        throw new Error('Invalid DOCX file: missing document.xml');
      }

      const xmlContent = await documentXml.async('string');

      // Parse the XML to extract text
      const textParts = [];

      // Split by paragraph tags <w:p>
      const paragraphs = xmlContent.split(/<w:p[\s>]/);

      paragraphs.forEach(para => {
        // Extract text from <w:t> tags within each paragraph
        const textMatches = para.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
        if (textMatches) {
          const lineText = textMatches
            .map(match => {
              const content = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
              return content;
            })
            .join('');

          if (lineText.trim()) {
            textParts.push(lineText.trim());
          }
        } else {
          // Empty paragraph = line break
          if (textParts.length > 0 && textParts[textParts.length - 1] !== '') {
            textParts.push('');
          }
        }
      });

      const fullText = textParts
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (fullText.length < 20) {
        throw new Error('Could not extract readable text from this DOCX file.');
      }

      return fullText;
    } catch (error) {
      if (error.message && error.message.includes('Could not extract')) {
        throw error;
      }
      if (error.message && error.message.includes('Invalid DOCX')) {
        throw error;
      }
      throw new Error(
        'Failed to parse this DOCX file. Please try copying and pasting the text content directly.'
      );
    }
  }

  // ==========================================
  // SAMPLE CV DATA
  // ==========================================
  function getSampleCV() {
    return `COLLINS ANYANWU
GIS Coordinator / Geospatial Data Manager
Email: collins.anyanwu@email.com | Phone: +234 800 000 0000
Location: Lagos, Nigeria | LinkedIn: linkedin.com/in/collinsanyanwu

PROFESSIONAL SUMMARY
Results-driven Geospatial Data Manager with 19+ years of experience in GIS analysis, spatial data management, and full-stack web development. Proven track record of leading cross-functional teams to deliver innovative geospatial solutions that improved operational efficiency by 40%. Expert in ArcGIS, QGIS, Python scripting, and enterprise database management. Currently serving as GIS Coordinator at Ikeja Electric, where I spearheaded the digital transformation of the company's geospatial infrastructure.

CORE COMPETENCIES
- Spatial Analysis & Mapping
- GIS Database Management
- Python & ArcPy Scripting
- Full-Stack Web Development
- Project Management
- Team Leadership & Mentoring
- Data Visualization
- Remote Sensing & LiDAR
- SQL & PostGIS
- Cloud GIS Solutions

PROFESSIONAL EXPERIENCE

GIS Coordinator | Ikeja Electric, Lagos
January 2020 - Present
- Spearheaded the implementation of enterprise GIS solutions, improving asset management efficiency by 35%
- Orchestrated the migration of legacy spatial databases to modern cloud-based architecture, reducing data retrieval time by 60%
- Developed automated Python scripts for geospatial data processing, saving 20+ hours per week
- Led a team of 8 GIS analysts in mapping over 500,000 electrical network assets
- Implemented real-time monitoring dashboards using web mapping technologies
- Collaborated with cross-functional teams to integrate GIS with billing and customer management systems

Senior GIS Analyst | Previous Company, Lagos
March 2015 - December 2019
- Managed comprehensive GIS database with 200,000+ spatial records
- Designed and developed web-based mapping applications using JavaScript, Leaflet, and ArcGIS API
- Conducted spatial analysis for network planning, reducing infrastructure costs by 25%
- Trained 15+ team members on GIS best practices and data management standards
- Automated reporting workflows using Python and FME, improving data accuracy by 90%

GIS Analyst | Earlier Company
June 2010 - February 2015
- Performed terrain analysis and environmental impact assessments using ArcGIS
- Created detailed cartographic products for urban planning projects
- Managed GPS field data collection campaigns across multiple regions
- Developed geodatabases and maintained data quality standards

EDUCATION
Bachelor of Science in Geography & Regional Planning
University of Lagos, Nigeria | 2004

TECHNICAL SKILLS
- GIS: ArcGIS Pro, ArcGIS Online, QGIS, Google Earth Engine, PostGIS
- Programming: Python, JavaScript, TypeScript, SQL, HTML/CSS
- Web Development: React, Node.js, Express, REST APIs
- Databases: PostgreSQL, PostGIS, MongoDB, Oracle Spatial
- Cloud: AWS, Azure, GCP
- Tools: FME, ERDAS IMAGINE, AutoCAD, Power BI, Git

CERTIFICATIONS
- Esri ArcGIS Desktop Professional Certification
- AWS Certified Cloud Practitioner
- Project Management Professional (PMP)
- Full-Stack Web Development Certificate`;
  }

  // ==========================================
  // CV BUILDER - TEMPLATE RENDERING
  // ==========================================
  function renderCVPreview(data, template = 'modern') {
    const templates = {
      modern: renderModernTemplate,
      classic: renderClassicTemplate,
      creative: renderCreativeTemplate,
      minimal: renderMinimalTemplate,
      executive: renderExecutiveTemplate
    };

    const renderer = templates[template] || templates.modern;
    return renderer(data);
  }

  function renderModernTemplate(data) {
    return `
      <div style="font-family: 'Inter', Calibri, sans-serif; color: #1a1a2e; line-height: 1.6;">
        <div style="border-bottom: 3px solid #00d4ff; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 28px; margin: 0; color: #1a1a2e; font-weight: 800;">${data.fullName || 'Your Name'}</h1>
          <p style="font-size: 16px; color: #555; margin: 4px 0;">${data.title || 'Professional Title'}</p>
          <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #666; margin-top: 8px;">
            ${data.email ? `<span>&#x2709; ${data.email}</span>` : ''}
            ${data.phone ? `<span>&#x260E; ${data.phone}</span>` : ''}
            ${data.location ? `<span>&#x1F4CD; ${data.location}</span>` : ''}
            ${data.linkedIn ? `<span>&#x1F517; ${data.linkedIn}</span>` : ''}
          </div>
        </div>

        ${data.summary ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px;">Professional Summary</h2>
            <p style="font-size: 14px; color: #444;">${data.summary}</p>
          </div>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 12px;">Professional Experience</h2>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
                  <h3 style="font-size: 15px; margin: 0; font-weight: 700;">${exp.title}</h3>
                  <span style="font-size: 12px; color: #888;">${exp.startDate} - ${exp.endDate || 'Present'}</span>
                </div>
                <p style="font-size: 13px; color: #00d4ff; margin: 2px 0;">${exp.company}${exp.location ? `, ${exp.location}` : ''}</p>
                ${exp.description ? `<p style="font-size: 13px; color: #555; margin-top: 6px; white-space: pre-line;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.education && data.education.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 12px;">Education</h2>
            ${data.education.map(edu => `
              <div style="margin-bottom: 10px;">
                <h3 style="font-size: 15px; margin: 0; font-weight: 700;">${edu.degree}</h3>
                <p style="font-size: 13px; color: #555;">${edu.institution}${edu.year ? ` | ${edu.year}` : ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${(data.technicalSkills && data.technicalSkills.length > 0) || (data.softSkills && data.softSkills.length > 0) ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${(data.technicalSkills || []).map(s => `<span style="background: #e8f4fd; color: #0077b6; padding: 3px 10px; border-radius: 12px; font-size: 12px;">${s}</span>`).join('')}
              ${(data.softSkills || []).map(s => `<span style="background: #f0e8fd; color: #7b2cbf; padding: 3px 10px; border-radius: 12px; font-size: 12px;">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
          <div>
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px;">Certifications</h2>
            <ul style="padding-left: 18px; margin: 0;">
              ${data.certifications.map(c => `<li style="font-size: 13px; color: #444; margin: 4px 0;">${c.name}${c.year ? ` (${c.year})` : ''}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderClassicTemplate(data) {
    return `
      <div style="font-family: 'Georgia', 'Times New Roman', serif; color: #333; line-height: 1.7;">
        <div style="text-align: center; border-bottom: 2px solid #1F3864; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 26px; margin: 0; color: #1F3864; font-weight: 700; letter-spacing: 1px;">${data.fullName || 'Your Name'}</h1>
          <p style="font-size: 15px; color: #555; margin: 4px 0; font-style: italic;">${data.title || 'Professional Title'}</p>
          <div style="font-size: 12px; color: #777; margin-top: 8px;">
            ${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}
          </div>
        </div>
        ${data.summary ? `<div style="margin-bottom: 18px;"><h2 style="font-size: 15px; color: #1F3864; border-bottom: 1px solid #ccc; padding-bottom: 4px;">PROFESSIONAL SUMMARY</h2><p style="font-size: 13px;">${data.summary}</p></div>` : ''}
        ${data.experience?.length ? `<div style="margin-bottom: 18px;"><h2 style="font-size: 15px; color: #1F3864; border-bottom: 1px solid #ccc; padding-bottom: 4px;">EXPERIENCE</h2>${data.experience.map(e => `<div style="margin-bottom: 12px;"><strong>${e.title}</strong> - ${e.company}<br><em style="font-size: 12px; color: #888;">${e.startDate} - ${e.endDate || 'Present'}</em>${e.description ? `<p style="font-size: 13px; white-space: pre-line;">${e.description}</p>` : ''}</div>`).join('')}</div>` : ''}
        ${data.education?.length ? `<div style="margin-bottom: 18px;"><h2 style="font-size: 15px; color: #1F3864; border-bottom: 1px solid #ccc; padding-bottom: 4px;">EDUCATION</h2>${data.education.map(e => `<p><strong>${e.degree}</strong><br>${e.institution} ${e.year ? `(${e.year})` : ''}</p>`).join('')}</div>` : ''}
        ${data.technicalSkills?.length ? `<div><h2 style="font-size: 15px; color: #1F3864; border-bottom: 1px solid #ccc; padding-bottom: 4px;">SKILLS</h2><p style="font-size: 13px;">${data.technicalSkills.join(', ')}</p></div>` : ''}
      </div>
    `;
  }

  function renderCreativeTemplate(data) {
    return `
      <div style="font-family: 'Inter', sans-serif; display: flex; min-height: 400px;">
        <div style="width: 200px; background: #1a1a2e; color: white; padding: 24px; border-radius: 8px 0 0 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #00d4ff, #a855f7); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800;">${(data.fullName || 'YN').split(' ').map(n => n[0]).join('')}</div>
            <h2 style="font-size: 14px; margin: 0;">${data.fullName || 'Your Name'}</h2>
            <p style="font-size: 11px; color: #aaa;">${data.title || ''}</p>
          </div>
          <div style="margin-bottom: 16px;"><h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 6px;">Contact</h3><p style="font-size: 11px; color: #ccc; line-height: 1.8;">${data.email || ''}<br>${data.phone || ''}<br>${data.location || ''}</p></div>
          ${data.technicalSkills?.length ? `<div><h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d4ff; margin-bottom: 6px;">Skills</h3>${data.technicalSkills.map(s => `<span style="display: inline-block; background: rgba(0,212,255,0.2); color: #00d4ff; padding: 2px 8px; border-radius: 10px; font-size: 10px; margin: 2px;">${s}</span>`).join('')}</div>` : ''}
        </div>
        <div style="flex: 1; padding: 24px;">
          ${data.summary ? `<div style="margin-bottom: 16px;"><h2 style="font-size: 14px; color: #00d4ff; border-bottom: 2px solid #00d4ff; display: inline-block; padding-bottom: 2px;">ABOUT ME</h2><p style="font-size: 13px; color: #555; margin-top: 8px;">${data.summary}</p></div>` : ''}
          ${data.experience?.length ? `<div style="margin-bottom: 16px;"><h2 style="font-size: 14px; color: #00d4ff; border-bottom: 2px solid #00d4ff; display: inline-block; padding-bottom: 2px;">EXPERIENCE</h2>${data.experience.map(e => `<div style="margin: 12px 0;"><strong style="font-size: 14px;">${e.title}</strong><br><span style="color: #00d4ff; font-size: 12px;">${e.company}</span> | <span style="font-size: 11px; color: #999;">${e.startDate} - ${e.endDate || 'Present'}</span>${e.description ? `<p style="font-size: 12px; color: #666; white-space: pre-line;">${e.description}</p>` : ''}</div>`).join('')}</div>` : ''}
          ${data.education?.length ? `<div><h2 style="font-size: 14px; color: #00d4ff; border-bottom: 2px solid #00d4ff; display: inline-block; padding-bottom: 2px;">EDUCATION</h2>${data.education.map(e => `<p style="margin: 8px 0;"><strong>${e.degree}</strong><br><span style="font-size: 12px; color: #777;">${e.institution} ${e.year ? `(${e.year})` : ''}</span></p>`).join('')}</div>` : ''}
        </div>
      </div>
    `;
  }

  function renderMinimalTemplate(data) {
    return renderModernTemplate(data).replace(/#00d4ff/g, '#333').replace(/border-bottom: 3px solid #333/, 'border-bottom: 1px solid #ddd');
  }

  function renderExecutiveTemplate(data) {
    return `
      <div style="font-family: 'Inter', sans-serif; color: #222;">
        <div style="background: #0a0a1a; color: white; padding: 28px; margin: -40px -40px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="font-size: 30px; margin: 0; font-weight: 900;">${data.fullName || 'Your Name'}</h1>
          <p style="font-size: 16px; color: #00d4ff; margin: 4px 0;">${data.title || ''}</p>
          <div style="font-size: 12px; color: #aaa; margin-top: 8px;">${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}</div>
        </div>
        ${data.summary ? `<div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-left: 4px solid #0a0a1a; border-radius: 4px;"><p style="font-size: 14px; color: #444; margin: 0; font-style: italic;">${data.summary}</p></div>` : ''}
        ${data.experience?.length ? `<div style="margin-bottom: 20px;"><h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #0a0a1a; margin-bottom: 12px; font-weight: 800;">Experience</h2>${data.experience.map(e => `<div style="margin-bottom: 14px; padding-left: 16px; border-left: 2px solid #ddd;"><h3 style="margin: 0; font-size: 15px;">${e.title}</h3><p style="margin: 2px 0; font-size: 13px; color: #0a0a1a; font-weight: 600;">${e.company}</p><p style="margin: 0; font-size: 11px; color: #999;">${e.startDate} - ${e.endDate || 'Present'}</p>${e.description ? `<p style="font-size: 13px; color: #555; margin-top: 6px; white-space: pre-line;">${e.description}</p>` : ''}</div>`).join('')}</div>` : ''}
        ${data.education?.length ? `<div style="margin-bottom: 20px;"><h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #0a0a1a; margin-bottom: 12px; font-weight: 800;">Education</h2>${data.education.map(e => `<p><strong>${e.degree}</strong> - ${e.institution} ${e.year ? `(${e.year})` : ''}</p>`).join('')}</div>` : ''}
        ${data.technicalSkills?.length ? `<div><h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: #0a0a1a; margin-bottom: 8px; font-weight: 800;">Skills</h2><div style="display: flex; flex-wrap: wrap; gap: 6px;">${data.technicalSkills.map(s => `<span style="background: #0a0a1a; color: white; padding: 4px 12px; border-radius: 4px; font-size: 11px;">${s}</span>`).join('')}</div></div>` : ''}
      </div>
    `;
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  return {
    readFile,
    getSampleCV,
    renderCVPreview
  };
})();
