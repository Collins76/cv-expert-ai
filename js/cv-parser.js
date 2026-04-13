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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'txt') {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      } else if (ext === 'pdf') {
        // For PDF, we'll extract text as best we can
        reader.onload = async (e) => {
          try {
            const text = await extractPDFText(e.target.result);
            resolve(text);
          } catch {
            resolve('[PDF parsing requires server-side processing. Please paste the text content instead.]');
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      } else if (ext === 'docx' || ext === 'doc') {
        reader.onload = async (e) => {
          try {
            const text = await extractDocxText(e.target.result);
            resolve(text);
          } catch {
            resolve('[DOCX parsing requires additional libraries. Please paste the text content instead.]');
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file format'));
      }
    });
  }

  // Simple PDF text extraction (basic)
  async function extractPDFText(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';

    // Basic text extraction from PDF streams
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(uint8Array);

    // Extract text between BT and ET markers
    const textBlocks = content.match(/BT[\s\S]*?ET/g) || [];
    textBlocks.forEach(block => {
      const textItems = block.match(/\((.*?)\)/g) || [];
      textItems.forEach(item => {
        text += item.slice(1, -1) + ' ';
      });
      text += '\n';
    });

    if (text.trim().length < 50) {
      return 'PDF text extraction is limited in the browser. For best results, please copy and paste your CV text directly into the text area.';
    }

    return text.trim();
  }

  // Simple DOCX text extraction
  async function extractDocxText(arrayBuffer) {
    // DOCX is a ZIP file containing XML
    // We'll attempt basic extraction
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(uint8Array);

      // Extract text from XML tags
      let text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      if (text.length < 50) {
        return 'DOCX text extraction is limited in the browser. For best results, please copy and paste your CV text directly.';
      }

      return text;
    } catch {
      return 'Please paste your CV text directly for analysis.';
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
