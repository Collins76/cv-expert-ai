import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    HRFlowable, Flowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Register Calibri fonts ──
pdfmetrics.registerFont(TTFont('Calibri', 'C:/Windows/Fonts/calibri.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-Bold', 'C:/Windows/Fonts/calibrib.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-Italic', 'C:/Windows/Fonts/calibrii.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-BoldItalic', 'C:/Windows/Fonts/calibriz.ttf'))
registerFontFamily('Calibri', normal='Calibri', bold='Calibri-Bold',
                    italic='Calibri-Italic', boldItalic='Calibri-BoldItalic')

# ── Colors ──
NAVY = HexColor('#1F3864')
BLACK = HexColor('#000000')
GRAY = HexColor('#555555')

# ── Page setup ──
WIDTH, HEIGHT = A4
ML, MR = 0.75 * inch, 0.75 * inch
MT, MB = 0.5 * inch, 0.5 * inch
CW = WIDTH - ML - MR  # content width ~487pt


# ── Custom Flowables ──
class SectionHeading(Flowable):
    """Section heading with navy underline."""
    def __init__(self, text, width=CW):
        Flowable.__init__(self)
        self.text = text.upper()
        self._width = width
        self.height = 20

    def wrap(self, aW, aH):
        return (self._width, self.height)

    def draw(self):
        c = self.canv
        c.setFont('Calibri-Bold', 11)
        c.setFillColor(NAVY)
        c.drawString(0, 6, self.text)
        c.setStrokeColor(NAVY)
        c.setLineWidth(0.75)
        c.line(0, 0, self._width, 0)


class JobHeader(Flowable):
    """Job title (left) with date range (right-aligned)."""
    def __init__(self, title, date_range, width=CW):
        Flowable.__init__(self)
        self.title = title
        self.date_range = date_range
        self._width = width
        self.height = 14

    def wrap(self, aW, aH):
        return (self._width, self.height)

    def draw(self):
        c = self.canv
        c.setFont('Calibri-Bold', 10.5)
        c.setFillColor(BLACK)
        c.drawString(0, 2, self.title)
        c.setFont('Calibri', 10)
        c.setFillColor(GRAY)
        c.drawRightString(self._width, 2, self.date_range)


# ── Styles ──
nameStyle = ParagraphStyle('Name', fontName='Calibri-Bold', fontSize=22,
    textColor=NAVY, alignment=TA_CENTER, spaceAfter=2, leading=26)
titleStyle = ParagraphStyle('Title', fontName='Calibri', fontSize=11,
    textColor=GRAY, alignment=TA_CENTER, spaceAfter=4, leading=14)
contactStyle = ParagraphStyle('Contact', fontName='Calibri', fontSize=9.5,
    textColor=BLACK, alignment=TA_CENTER, spaceAfter=1, leading=12)
bodyStyle = ParagraphStyle('Body', fontName='Calibri', fontSize=10,
    textColor=BLACK, spaceAfter=4, leading=12)
companyStyle = ParagraphStyle('Company', fontName='Calibri-Italic', fontSize=10,
    textColor=GRAY, spaceAfter=3, spaceBefore=1, leading=12)
bulletStyle = ParagraphStyle('Bullet', fontName='Calibri', fontSize=10,
    textColor=BLACK, leftIndent=18, bulletIndent=0,
    spaceAfter=1, spaceBefore=1, leading=12)
eduDegreeStyle = ParagraphStyle('EduDeg', fontName='Calibri-Bold', fontSize=10.5,
    textColor=BLACK, spaceBefore=4, spaceAfter=0, leading=13)
eduSchoolStyle = ParagraphStyle('EduSch', fontName='Calibri-Italic', fontSize=10,
    textColor=GRAY, spaceAfter=2, leading=12)
skillStyle = ParagraphStyle('Skill', fontName='Calibri', fontSize=10,
    textColor=BLACK, spaceAfter=1, leading=12)


# ── Helpers ──
def bul(text):
    return Paragraph(text, bulletStyle, bulletText="\u2022")

def skill_line(cat, skills):
    return Paragraph(f'<b>{cat}:</b> {skills}', skillStyle)

def cert(text):
    return Paragraph(text, bulletStyle, bulletText="\u2022")


# ── Build story ──
story = []

# ═══ HEADER ═══
story.append(Paragraph("COLLINS ANYANWU", nameStyle))
story.append(Paragraph("Geospatial Data Manager  |  GIS Coordinator", titleStyle))
story.append(Paragraph(
    '+234 806 217 2134  |  '
    '<a href="mailto:collins.tochi@gmail.com" color="#0563C1">collins.tochi@gmail.com</a>'
    '  |  Lagos, Nigeria',
    contactStyle))
story.append(Paragraph(
    '<a href="https://www.linkedin.com/in/collinsanyanwu/" color="#0563C1">linkedin.com/in/collinsanyanwu</a>'
    '  |  '
    '<a href="https://github.com/Collins76" color="#0563C1">github.com/Collins76</a>'
    '  |  '
    '<a href="https://portfolio-collins-anyanwu.vercel.app" color="#0563C1">portfolio-collins-anyanwu.vercel.app</a>',
    contactStyle))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1.5, color=NAVY, spaceBefore=2, spaceAfter=6))

# ═══ PROFESSIONAL SUMMARY ═══
story.append(SectionHeading("Professional Summary"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Results-driven Geospatial Data Manager with 19+ years of progressive experience in GIS data engineering, "
    "spatial analysis, and geospatial database management across utility, oil &amp; gas, and technology sectors. "
    "Expert in ArcGIS Enterprise, QGIS, PostgreSQL/PostGIS, Python automation, and cloud-based spatial data "
    "infrastructure. Proven track record of building interactive dashboards, automating ETL pipelines, and "
    "translating spatial data into executive-level insight. Adept at leading cross-functional teams and delivering "
    "full-stack geospatial web applications using React, Next.js, TypeScript, and Supabase.",
    bodyStyle))

# ═══ CORE COMPETENCIES ═══
story.append(SectionHeading("Core Competencies"))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Geospatial Data Management  \u2022  GIS Data Engineering  \u2022  Spatial Analysis &amp; Modeling  \u2022  "
    "ETL Pipeline Automation  \u2022  Database Administration (PostGIS, Oracle Spatial)  \u2022  "
    "Cloud Infrastructure (AWS)  \u2022  Dashboard Development (ArcGIS, Power BI, Tableau)  \u2022  "
    "Python Scripting &amp; Automation  \u2022  Full-Stack Web Development (React, Next.js, TypeScript)  \u2022  "
    "Team Leadership &amp; Training  \u2022  Remote Sensing &amp; LiDAR  \u2022  "
    "Field Data Collection (Survey123, GPS/GNSS)",
    bodyStyle))

# ═══ PROFESSIONAL EXPERIENCE ═══
story.append(SectionHeading("Professional Experience"))
story.append(Spacer(1, 4))

# ── Ikeja Electric ──
story.append(JobHeader("GIS Coordinator", "November 2017 \u2013 Present"))
story.append(Spacer(1, 1))
story.append(Paragraph("Ikeja Electric, Lagos, Nigeria", companyStyle))
story.append(bul("Manage and maintain geospatial data for a 3,800+ km electricity distribution network serving over 1 million customers across the Lagos metropolitan area"))
story.append(bul("Engineered Python automation scripts using ArcPy and GeoPandas, reducing manual GIS workflows by 35% and accelerating data processing turnaround"))
story.append(bul("Deployed Esri Survey123 for digital field data capture, improving collection speed by 45% and eliminating paper-based errors across field teams"))
story.append(bul("Designed and launched ArcGIS Dashboards for real-time outage monitoring, enabling 40% faster incident response and executive decision-making"))
story.append(bul("Built automated ETL pipelines integrating multiple data sources, cutting manual data processing effort by 67%"))
story.append(bul("Developed the IE Asset Dashboard and led its Next.js/TypeScript rewrite, monitoring 20,641+ distribution assets across 23 geospatial data layers with role-based access control"))
story.append(bul("Created Power BI dashboards for transformer vandalization tracking and 8,513+ upriser field inspections with geographic mapping and performance analytics"))
story.append(bul("Built GIS KPIs Dashboard (Next.js, Firebase, TypeScript) enabling real-time tracking of team performance metrics and operational KPIs"))

# ── PoloSoft ──
story.append(Spacer(1, 2))
story.append(JobHeader("GIS / Data Engineer Manager", "September 2016 \u2013 October 2017"))
story.append(Spacer(1, 1))
story.append(Paragraph("PoloSoft Technologies, Lagos, Nigeria", companyStyle))
story.append(bul("Led a team of 8 GIS professionals, coordinating project delivery for utility and infrastructure clients across multiple concurrent engagements"))
story.append(bul("Architected BI integrations with Tableau and Power BI, enabling stakeholders to visualize spatial data alongside operational metrics"))
story.append(bul("Designed and implemented cloud-based ETL pipelines for large-scale geospatial data processing and warehousing"))
story.append(bul("Developed and delivered technical training programs, upskilling team members in GIS technologies and database management"))

# ═══ PAGE BREAK ═══
story.append(PageBreak())

# ── SpatialMatrix ──
story.append(JobHeader("GIS / Database Specialist", "October 2012 \u2013 August 2016"))
story.append(Spacer(1, 1))
story.append(Paragraph("SpatialMatrix Ltd, Lagos, Nigeria", companyStyle))
story.append(bul("Managed PostgreSQL/PostGIS database migrations and administration, maintaining 99.9% uptime across production environments"))
story.append(bul("Optimized spatial SQL queries, achieving 50% improvement in database performance for complex geospatial operations"))
story.append(bul("Designed and delivered interactive dashboards and spatial analytics solutions for oil &amp; gas, NGO, and infrastructure clients"))
story.append(bul("Provided end-to-end GIS services including spatial analysis, cartographic production, and database architecture design"))

# ── Earth-Source ──
story.append(Spacer(1, 2))
story.append(JobHeader("Geologist", "June 2010 \u2013 August 2012"))
story.append(Spacer(1, 1))
story.append(Paragraph("Earth-Source Hydrocarbon, Nigeria", companyStyle))
story.append(bul("Conducted field geological surveys and GPS-based data collection for hydrocarbon exploration and resource estimation"))
story.append(bul("Integrated geological field data with GIS platforms for spatial analysis and mapping of prospective zones"))

# ── Spatial Technologies ──
story.append(Spacer(1, 2))
story.append(JobHeader("GIS Technician", "January 2005 \u2013 May 2010"))
story.append(Spacer(1, 1))
story.append(Paragraph("Spatial Technologies Limited, Nigeria", companyStyle))
story.append(bul("Built and maintained ETL pipelines for spatial data ingestion, transformation, and quality assurance"))
story.append(bul("Performed network analysis, proximity analysis, and spatial modeling for infrastructure planning projects"))
story.append(bul("Managed GPS/GNSS field data collection campaigns and post-processing workflows for large-scale mapping"))

# ═══ EDUCATION ═══
story.append(Spacer(1, 2))
story.append(SectionHeading("Education"))
story.append(Spacer(1, 4))
story.append(Paragraph("Master of Science, Geographic Information Systems", eduDegreeStyle))
story.append(Paragraph("University of Lagos, Lagos, Nigeria", eduSchoolStyle))
story.append(Spacer(1, 2))
story.append(Paragraph("Bachelor of Technology, Geology &amp; Earth Sciences", eduDegreeStyle))
story.append(Paragraph("Federal University of Technology, Owerri, Nigeria", eduSchoolStyle))

# ═══ TECHNICAL SKILLS ═══
story.append(Spacer(1, 2))
story.append(SectionHeading("Technical Skills"))
story.append(Spacer(1, 4))
story.append(skill_line("GIS Platforms", "ArcGIS Enterprise, ArcGIS Pro, ArcGIS Online, QGIS, Survey123, ArcGIS Dashboards, Google Earth Engine"))
story.append(skill_line("Programming", "Python (ArcPy, GeoPandas, Shapely, PyQGIS), SQL, R, JavaScript, TypeScript"))
story.append(skill_line("Databases", "PostgreSQL/PostGIS, Oracle Spatial, SQL Server, Supabase, Firebase"))
story.append(skill_line("Visualization", "Tableau, Power BI, Power Query, Plotly.js, Recharts, Leaflet.js, Matplotlib, Seaborn"))
story.append(skill_line("Web Development", "React, Next.js, Tailwind CSS, Vercel, HTML/CSS"))
story.append(skill_line("Cloud &amp; DevOps", "AWS (S3, EC2, RDS), Git/GitHub, Docker"))
story.append(skill_line("Geospatial", "LiDAR, Remote Sensing, GPS/GNSS"))

# ═══ CERTIFICATIONS ═══
story.append(Spacer(1, 2))
story.append(SectionHeading("Certifications"))
story.append(Spacer(1, 4))
story.append(cert("Big Data Analysis, Power Query, Power Pivot &amp; VBA \u2014 UrBizEdge, 2022"))
story.append(cert("Python &amp; SQL for Data Science \u2014 Edureka, 2024"))
story.append(cert("Deep Learning Specialization \u2014 Edureka, 2024"))
story.append(cert("Tableau for Data Visualization \u2014 Edureka, 2024"))
story.append(cert("Data Science &amp; Machine Learning Programs \u2014 Edureka, 2024"))
story.append(cert("GISP Certification \u2014 In Progress (GISCI)"))


# ── Generate PDF ──
doc = SimpleDocTemplate(
    "C:/Users/Collins Anyanwu/Documents/CV Expert/Collins_Anyanwu_CV_v2.pdf",
    pagesize=A4,
    topMargin=MT, bottomMargin=MB,
    leftMargin=ML, rightMargin=MR,
    title="Collins Anyanwu - CV",
    author="Collins Anyanwu",
)
doc.build(story)

fsize = os.path.getsize("C:/Users/Collins Anyanwu/Documents/CV Expert/Collins_Anyanwu_CV_v2.pdf")
print(f"PDF created successfully: Collins_Anyanwu_CV_v2.pdf")
print(f"File size: {fsize / 1024:.1f} KB")
