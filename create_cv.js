const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  TabStopType, TabStopPosition, ExternalHyperlink,
  LevelFormat, BorderStyle, PageBreak
} = require("docx");

const NAVY = "1F3864";
const BLACK = "000000";
const GRAY = "555555";
const FONT = "Calibri";

// --- Helper functions ---
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 4 } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: FONT, color: NAVY }),
    ],
  });
}

function jobTitle(title, dateRange) {
  return new Paragraph({
    spacing: { before: 120, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: title, bold: true, size: 21, font: FONT, color: BLACK }),
      new TextRun({ text: "\t" + dateRange, size: 20, font: FONT, color: GRAY }),
    ],
  });
}

function companyLine(company, location) {
  return new Paragraph({
    spacing: { before: 20, after: 60 },
    children: [
      new TextRun({ text: company + ", " + location, italics: true, size: 20, font: FONT, color: GRAY }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text, size: 20, font: FONT, color: BLACK }),
    ],
  });
}

function skillLine(category, skills) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: category + ": ", bold: true, size: 20, font: FONT, color: BLACK }),
      new TextRun({ text: skills, size: 20, font: FONT, color: BLACK }),
    ],
  });
}

function certBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 15, after: 15 },
    children: [
      new TextRun({ text, size: 20, font: FONT, color: BLACK }),
    ],
  });
}

function eduEntry(degree, university) {
  return [
    new Paragraph({
      spacing: { before: 80, after: 0 },
      children: [
        new TextRun({ text: degree, bold: true, size: 21, font: FONT, color: BLACK }),
      ],
    }),
    new Paragraph({
      spacing: { before: 20, after: 40 },
      children: [
        new TextRun({ text: university, italics: true, size: 20, font: FONT, color: GRAY }),
      ],
    }),
  ];
}

// --- Build Document ---
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: 20, color: BLACK } },
    },
    characterStyles: [
      {
        id: "Hyperlink",
        name: "Hyperlink",
        run: { color: "0563C1", underline: { type: "single" } },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 540, hanging: 270 } },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
        },
      },
      children: [
        // ============================================================
        // HEADER
        // ============================================================
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "COLLINS ANYANWU", bold: true, size: 44, font: FONT, color: NAVY }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Geospatial Data Manager  |  GIS Coordinator", size: 22, font: FONT, color: GRAY }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 20 },
          children: [
            new TextRun({ text: "+234 806 217 2134  |  ", size: 19, font: FONT, color: BLACK }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "collins.tochi@gmail.com", style: "Hyperlink", size: 19, font: FONT })],
              link: "mailto:collins.tochi@gmail.com",
            }),
            new TextRun({ text: "  |  Lagos, Nigeria", size: 19, font: FONT, color: BLACK }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new ExternalHyperlink({
              children: [new TextRun({ text: "linkedin.com/in/collinsanyanwu", style: "Hyperlink", size: 19, font: FONT })],
              link: "https://www.linkedin.com/in/collinsanyanwu/",
            }),
            new TextRun({ text: "  |  ", size: 19, font: FONT, color: BLACK }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "github.com/Collins76", style: "Hyperlink", size: 19, font: FONT })],
              link: "https://github.com/Collins76",
            }),
            new TextRun({ text: "  |  ", size: 19, font: FONT, color: BLACK }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "portfolio-collins-anyanwu.vercel.app", style: "Hyperlink", size: 19, font: FONT })],
              link: "https://portfolio-collins-anyanwu.vercel.app",
            }),
          ],
        }),
        // Divider
        new Paragraph({
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 4 } },
          children: [],
        }),

        // ============================================================
        // PROFESSIONAL SUMMARY
        // ============================================================
        sectionHeading("Professional Summary"),
        new Paragraph({
          spacing: { before: 60, after: 80 },
          children: [
            new TextRun({
              text: "Results-driven Geospatial Data Manager with 19+ years of progressive experience in GIS data engineering, spatial analysis, and geospatial database management across utility, oil & gas, and technology sectors. Expert in ArcGIS Enterprise, QGIS, PostgreSQL/PostGIS, Python automation, and cloud-based spatial data infrastructure. Proven track record of building interactive dashboards, automating ETL pipelines, and translating spatial data into executive-level insight. Adept at leading cross-functional teams and delivering full-stack geospatial web applications using React, Next.js, TypeScript, and Supabase.",
              size: 20, font: FONT, color: BLACK,
            }),
          ],
        }),

        // ============================================================
        // CORE COMPETENCIES
        // ============================================================
        sectionHeading("Core Competencies"),
        new Paragraph({
          spacing: { before: 60, after: 80 },
          children: [
            new TextRun({
              text: "Geospatial Data Management  \u2022  GIS Data Engineering  \u2022  Spatial Analysis & Modeling  \u2022  ETL Pipeline Automation  \u2022  Database Administration (PostGIS, Oracle Spatial)  \u2022  Cloud Infrastructure (AWS)  \u2022  Dashboard Development (ArcGIS, Power BI, Tableau)  \u2022  Python Scripting & Automation  \u2022  Full-Stack Web Development (React, Next.js, TypeScript)  \u2022  Team Leadership & Training  \u2022  Remote Sensing & LiDAR  \u2022  Field Data Collection (Survey123, GPS/GNSS)",
              size: 20, font: FONT, color: BLACK,
            }),
          ],
        }),

        // ============================================================
        // PROFESSIONAL EXPERIENCE
        // ============================================================
        sectionHeading("Professional Experience"),

        // --- Ikeja Electric ---
        jobTitle("GIS Coordinator", "November 2017 \u2013 Present"),
        companyLine("Ikeja Electric", "Lagos, Nigeria"),
        bullet("Manage and maintain geospatial data for a 3,800+ km electricity distribution network serving over 1 million customers across the Lagos metropolitan area"),
        bullet("Engineered Python automation scripts using ArcPy and GeoPandas, reducing manual GIS workflows by 35% and accelerating data processing turnaround"),
        bullet("Deployed Esri Survey123 for digital field data capture, improving collection speed by 45% and eliminating paper-based errors across field teams"),
        bullet("Designed and launched ArcGIS Dashboards for real-time outage monitoring, enabling 40% faster incident response and executive decision-making"),
        bullet("Built automated ETL pipelines integrating multiple data sources, cutting manual data processing effort by 67%"),
        bullet("Developed the IE Asset Dashboard and led its Next.js/TypeScript rewrite, monitoring 20,641+ distribution assets across 23 geospatial data layers with role-based access control"),
        bullet("Created Power BI dashboards for transformer vandalization tracking and 8,513+ upriser field inspections with geographic mapping and performance analytics"),
        bullet("Built GIS KPIs Dashboard (Next.js, Firebase, TypeScript) enabling real-time tracking of team performance metrics and operational KPIs"),

        // --- PoloSoft ---
        jobTitle("GIS / Data Engineer Manager", "September 2016 \u2013 October 2017"),
        companyLine("PoloSoft Technologies", "Lagos, Nigeria"),
        bullet("Led a team of 8 GIS professionals, coordinating project delivery for utility and infrastructure clients across multiple concurrent engagements"),
        bullet("Architected BI integrations with Tableau and Power BI, enabling stakeholders to visualize spatial data alongside operational metrics"),
        bullet("Designed and implemented cloud-based ETL pipelines for large-scale geospatial data processing and warehousing"),
        bullet("Developed and delivered technical training programs, upskilling team members in GIS technologies and database management"),

        // ============================================================
        // PAGE BREAK
        // ============================================================
        new Paragraph({ children: [new PageBreak()] }),

        // --- SpatialMatrix ---
        jobTitle("GIS / Database Specialist", "October 2012 \u2013 August 2016"),
        companyLine("SpatialMatrix Ltd", "Lagos, Nigeria"),
        bullet("Managed PostgreSQL/PostGIS database migrations and administration, maintaining 99.9% uptime across production environments"),
        bullet("Optimized spatial SQL queries, achieving 50% improvement in database performance for complex geospatial operations"),
        bullet("Designed and delivered interactive dashboards and spatial analytics solutions for oil & gas, NGO, and infrastructure clients"),
        bullet("Provided end-to-end GIS services including spatial analysis, cartographic production, and database architecture design"),

        // --- Earth-Source ---
        jobTitle("Geologist", "June 2010 \u2013 August 2012"),
        companyLine("Earth-Source Hydrocarbon", "Nigeria"),
        bullet("Conducted field geological surveys and GPS-based data collection for hydrocarbon exploration and resource estimation"),
        bullet("Integrated geological field data with GIS platforms for spatial analysis and mapping of prospective zones"),

        // --- Spatial Technologies ---
        jobTitle("GIS Technician", "January 2005 \u2013 May 2010"),
        companyLine("Spatial Technologies Limited", "Nigeria"),
        bullet("Built and maintained ETL pipelines for spatial data ingestion, transformation, and quality assurance"),
        bullet("Performed network analysis, proximity analysis, and spatial modeling for infrastructure planning projects"),
        bullet("Managed GPS/GNSS field data collection campaigns and post-processing workflows for large-scale mapping"),

        // ============================================================
        // EDUCATION
        // ============================================================
        sectionHeading("Education"),
        ...eduEntry("Master of Science, Geographic Information Systems", "University of Lagos, Lagos, Nigeria"),
        ...eduEntry("Bachelor of Technology, Geology & Earth Sciences", "Federal University of Technology, Owerri, Nigeria"),

        // ============================================================
        // TECHNICAL SKILLS
        // ============================================================
        sectionHeading("Technical Skills"),
        skillLine("GIS Platforms", "ArcGIS Enterprise, ArcGIS Pro, ArcGIS Online, QGIS, Survey123, ArcGIS Dashboards, Google Earth Engine"),
        skillLine("Programming", "Python (ArcPy, GeoPandas, Shapely, PyQGIS), SQL, R, JavaScript, TypeScript"),
        skillLine("Databases", "PostgreSQL/PostGIS, Oracle Spatial, SQL Server, Supabase, Firebase"),
        skillLine("Visualization", "Tableau, Power BI, Power Query, Plotly.js, Recharts, Leaflet.js, Matplotlib, Seaborn"),
        skillLine("Web Development", "React, Next.js, Tailwind CSS, Vercel, HTML/CSS"),
        skillLine("Cloud & DevOps", "AWS (S3, EC2, RDS), Git/GitHub, Docker"),
        skillLine("Geospatial", "LiDAR, Remote Sensing, GPS/GNSS"),

        // ============================================================
        // CERTIFICATIONS
        // ============================================================
        sectionHeading("Certifications"),
        certBullet("Big Data Analysis, Power Query, Power Pivot & VBA \u2014 UrBizEdge, 2022"),
        certBullet("Python & SQL for Data Science \u2014 Edureka, 2024"),
        certBullet("Deep Learning Specialization \u2014 Edureka, 2024"),
        certBullet("Tableau for Data Visualization \u2014 Edureka, 2024"),
        certBullet("Data Science & Machine Learning Programs \u2014 Edureka, 2024"),
        certBullet("GISP Certification \u2014 In Progress (GISCI)"),
      ],
    },
  ],
});

// --- Generate file ---
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("C:/Users/Collins Anyanwu/Documents/CV Expert/Collins_Anyanwu_CV.docx", buffer);
  console.log("DOCX created successfully: Collins_Anyanwu_CV.docx");
  console.log("File size: " + (buffer.length / 1024).toFixed(1) + " KB");
});
