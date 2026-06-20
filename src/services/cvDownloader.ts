import { jsPDF } from 'jspdf';
import { PERSONAL_INFO, EXPERIENCE, SKILLS } from '../constants';

interface StructuredCV {
  themeTitle: string;
  philosophyStatement: string;
  technicalSkills?: { title: string; category: string; competency: string }[];
  gridManifesto?: { nodeId: string; label: string; value: string; accentColor: string }[];
}

// 1. DYNAMIC PDF GENERATOR (Using English/Romanized diacritics replacement to prevent Helvetica symbols glitches)
export const generateCustomPDF = (cvData: StructuredCV, style: 'baudgrid' | 'indusmin' | 'cyberswiss', injectCody: boolean) => {
  const doc = new jsPDF();
  const black = '#1C1B1B';
  const red = '#FF0000';
  const blue = '#0000FF';
  const yellow = '#FFFF00';

  // Strip Vietnamese accents for PDF compatibility inside jsPDF built-in helvetica
  const removeAccents = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const drawBauhausRect = (x: number, y: number, w: number, h: number, color: string) => {
    doc.setFillColor(color);
    doc.rect(x, y, w, h, 'F');
  };

  const drawBorder = (x: number, y: number, w: number, h: number, thickness: number = 0.5) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(thickness);
    doc.rect(x, y, w, h, 'S');
  };

  let currentY = 15;

  // Render Header Section
  if (style === 'cyberswiss') {
    // Cyber Swiss Left Yellow Sidebar Graphic
    drawBauhausRect(0, 0, 8, 297, yellow);
    drawBauhausRect(8, 0, 2, 297, '#000000');
  }

  const startX = style === 'cyberswiss' ? 18 : 15;

  // Title block
  doc.setTextColor(black);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  const nameToPrint = injectCody ? removeAccents(PERSONAL_INFO.fullName) : 'BESPOKE WORK PROFILE';
  doc.text(nameToPrint.toUpperCase(), startX, currentY + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(red);
  const subtitle = removeAccents(cvData.themeTitle).toUpperCase();
  doc.text(subtitle, startX, currentY + 16);

  currentY += 24;

  // Contact Info Row
  if (injectCody) {
    drawBauhausRect(startX, currentY, 180, 8, black);
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${PERSONAL_INFO.email}   |   ${PERSONAL_INFO.phone}   |   HO CHI MINH CITY`, startX + 5, currentY + 5);
    currentY += 14;
  } else {
    drawBauhausRect(startX, currentY, 180, 2, black);
    currentY += 8;
  }

  // Philosophy Statement
  doc.setTextColor(black);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const philosophyText = removeAccents(cvData.philosophyStatement);
  const philLines = doc.splitTextToSize(philosophyText.toUpperCase(), 175);
  doc.text(philLines, startX, currentY);
  currentY += (philLines.length * 5) + 6;

  // Dividing Line
  drawBauhausRect(startX, currentY, 180, 1, blue);
  currentY += 8;

  // 1. Bespoke Focus Technical Skills Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(black);
  doc.text('GENERATED FOCUS TECHNICAL SPECIFICATION', startX, currentY);
  currentY += 4;
  drawBauhausRect(startX, currentY, 60, 1.5, yellow);
  currentY += 8;

  if (cvData.technicalSkills && cvData.technicalSkills.length > 0) {
    cvData.technicalSkills.forEach((skill) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(removeAccents(skill.title).toUpperCase(), startX, currentY);
      doc.setTextColor(blue);
      doc.text(removeAccents(skill.category).toUpperCase(), startX + 110, currentY);
      doc.setTextColor(black);
      doc.text(skill.competency, startX + 160, currentY);
      
      currentY += 3;
      drawBauhausRect(startX, currentY, 180, 0.2, '#CCCCCC');
      currentY += 5;
    });
  }

  // 2. Personal Resume/Workspace Grid Manifesto
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(black);
  doc.text('SYSTEM INTEGRITY & MANIFESTO_NODES', startX, currentY);
  currentY += 4;
  drawBauhausRect(startX, currentY, 60, 1.5, red);
  currentY += 8;

  if (cvData.gridManifesto && cvData.gridManifesto.length > 0) {
    cvData.gridManifesto.forEach((item) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#777777');
      doc.text(`[NODE: ${item.nodeId}]`, startX, currentY);

      doc.setFontSize(10);
      doc.setTextColor(black);
      currentY += 4;
      doc.text(removeAccents(item.label).toUpperCase(), startX, currentY);
      
      currentY += 4;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(removeAccents(item.value), 170);
      doc.text(descLines, startX, currentY);
      currentY += (descLines.length * 4) + 6;
    });
  }

  // 3. Optional Experience Section (Injected dynamically)
  if (injectCody) {
    if (currentY > 160) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(black);
    doc.text('CORE WORKFORCE PIPELINE / RELEVANT EXPERIENCES', startX, currentY);
    currentY += 4;
    drawBauhausRect(startX, currentY, 60, 1.5, blue);
    currentY += 8;

    // Output top 4 experiences
    const topExp = EXPERIENCE.slice(0, 4);
    topExp.forEach((exp) => {
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(black);
      doc.text(removeAccents(exp.role).toUpperCase(), startX, currentY);
      
      doc.setFontSize(9);
      doc.setTextColor(red);
      doc.text(removeAccents(exp.company).toUpperCase(), startX + 100, currentY);
      
      doc.setTextColor('#777777');
      doc.text(exp.period, startX + 150, currentY);

      currentY += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(black);
      const expLines = doc.splitTextToSize(removeAccents(exp.description), 175);
      doc.text(expLines, startX, currentY);
      
      currentY += (expLines.length * 4) + 6;
    });
  }

  // Page numbering and stamp footer (Classic Bauhaus standard)
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#999999');
    doc.text(`BAUHAUS VDB SPEC SYSTEM V3.12 // PAGE ${i} OF ${totalPages}`, startX, 290);
    doc.text('VERIFIED BY NEURAL GRAPHICS ENGINE', 145, 290);
  }

  doc.save(`${removeAccents(nameToPrint).replace(/\s+/g, '_')}_BAUHAUS_RESUME.pdf`);
};

// 2. SELF-CONTAINED OFFLINE HTML EXPORT GENERATOR (Maintains beautiful Vietnamese characters)
export const downloadAsHTML = (cvData: StructuredCV, style: 'baudgrid' | 'indusmin' | 'cyberswiss', injectCody: boolean) => {
  const title = cvData.themeTitle;
  const philosophy = cvData.philosophyStatement;
  
  let layoutClasses = '';
  let accentBlockStyle = '';

  if (style === 'baudgrid') {
    layoutClasses = 'border-8 border-black p-8 md:p-12';
    accentBlockStyle = 'border-b-4 border-black';
  } else if (style === 'indusmin') {
    layoutClasses = 'border-2 border-slate-300 p-8 md:p-16 max-w-4xl mx-auto bg-white';
    accentBlockStyle = 'border-b border-stone-300';
  } else if (style === 'cyberswiss') {
    layoutClasses = 'border-l-[16px] border-l-red-600 border-y-8 border-r-8 border-black p-8 md:p-12';
    accentBlockStyle = 'border-b-4 border-black';
  }

  let codyContactSection = '';
  let codyEduSection = '';
  let codyExpSection = '';

  if (injectCody) {
    codyContactSection = `
      <div style="background-color: #000; color: #fff; padding: 15px; margin: 20px 0; font-family: monospace; font-size: 13px; display: flex; flex-wrap: wrap; justify-content: space-between; border: 4px solid #000;">
        <div><b>EMAIL:</b> ${PERSONAL_INFO.email}</div>
        <div><b>ZALO/PHONE:</b> ${PERSONAL_INFO.phone}</div>
        <div><b>BIRTHDAY:</b> ${PERSONAL_INFO.birthday}</div>
        <div><b>LOCATION:</b> HỒ CHÍ MINH, VIỆT NAM</div>
      </div>
      <div style="margin-bottom: 25px; display: flex; gap: 15px; flex-wrap: wrap;">
        <a href="${PERSONAL_INFO.socials.github}" target="_blank" style="font-family: monospace; font-weight: 900; color: #00f; text-decoration: none;">[GITHUB]</a>
        <a href="${PERSONAL_INFO.socials.linkedin}" target="_blank" style="font-family: monospace; font-weight: 900; color: #00f; text-decoration: none;">[LINKEDIN]</a>
        <a href="${PERSONAL_INFO.socials.beacons}" target="_blank" style="font-family: monospace; font-weight: 900; color: #00f; text-decoration: none;">[PORTFOLIO HUB (BEACONS)]</a>
      </div>
    `;

    codyEduSection = `
      <div style="border: 4px solid #000; padding: 20px; background-color: #ffff00; margin-bottom: 25px;">
        <div style="font-family: monospace; font-size: 11px; font-weight: 900;">[EDUCATIONAL_FOUNDATION]</div>
        <h3 style="font-size: 20px; font-weight: 900; margin: 5px 0 0 0; text-transform: uppercase;">🎓 ĐẠI HỌC HOA SEN (HSU)</h3>
        <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">Chuyên ngành Công nghệ phần mềm</p>
        <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 12px;"><b>Ngôn ngữ tích hợp:</b> ${PERSONAL_INFO.languages.join(' / ')}</p>
      </div>
    `;

    codyExpSection = `
      <div style="margin-bottom: 30px;">
        <div style="border-bottom: 4px solid #000; padding-bottom: 5px; margin-bottom: 15px;">
          <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase;">💼 TIẾN TRÌNH KINH NGHIỆM THỰC THI (EXPERIENCES)</h2>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
          ${EXPERIENCE.map(exp => `
            <div style="border: 3px solid #000; padding: 15px; background-color: #fff; box-shadow: 4px 4px 0 #000;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #00f;">${exp.role}</span>
                <span style="font-family: monospace; font-size: 12px; font-weight: 900; background-color: #ff0000; color: #fff; padding: 1px 6px;">${exp.period}</span>
              </div>
              <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; text-transform: uppercase;">${exp.company}</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.4; color: #333;">${exp.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const technicalSkillsHtml = cvData.technicalSkills?.map(s => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding: 10px 0;">
      <div>
        <div style="font-weight: 900; font-size: 14px; text-transform: uppercase;">${s.title}</div>
        <div style="font-family: monospace; font-size: 10px; color: #666; text-transform: uppercase; margin-top: 2px;">${s.category}</div>
      </div>
      <div style="font-weight: 900; color: #0000ff; font-size: 14px;">${s.competency}</div>
    </div>
  `).join('') || '';

  const gridManifestoHtml = cvData.gridManifesto?.map(m => `
    <div style="border: 3px solid #000; padding: 15px; box-shadow: 4px 4px 0px #000; background-color: ${
      m.accentColor === 'bauhaus-red' ? 'rgba(255,0,0,0.08)' :
      m.accentColor === 'bauhaus-blue' ? 'rgba(0,0,128,0.08)' : 'rgba(255,255,0,0.1)'
    }">
      <span style="font-family: monospace; font-size: 9px; font-weight: 900; color: #555;">ID: ${m.nodeId}</span>
      <h4 style="font-size: 13px; font-weight: 900; margin: 4px 0 6px 0; text-transform: uppercase;">${m.label}</h4>
      <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #111;">${m.value}</p>
    </div>
  `).join('') || '';

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${injectCody ? PERSONAL_INFO.fullName : 'Bespoke Work Resume'} - ${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@500;700&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #F5F5F0;
      color: #000;
      margin: 0;
      padding: 40px 20px;
    }
    
    .resume-container {
      max-width: 900px;
      margin: 0 auto;
      background-color: #fff;
    }
    
    h1, h2, h3, h4, h5 {
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .grid-manifesto-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 15px;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    @media (min-width: 768px) {
      .two-column {
        grid-template-columns: 1.2fr 1fr;
      }
    }
    
    /* Print optimizations */
    @media print {
      body {
        background-color: #fff;
        padding: 0;
      }
      .resume-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="no-print" style="max-width: 900px; margin: 0 auto 20px auto; padding: 15px; border: 4px solid #000; background-color: #ffff00; font-family: monospace; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center;">
    <span>⚡ BAUHAUS OFFLINE EXPORT SYSTEM</span>
    <button onclick="window.print()" style="background-color: #000; color: #fff; border: none; padding: 6px 15px; font-weight: 900; font-family: sans-serif; cursor: pointer; border: 2px solid #000;">[PRINT / CHUYỂN PDF]</button>
  </div>

  <div class="resume-container ${layoutClasses}">
    <div class="${accentBlockStyle}" style="padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
      <div>
        <span style="font-family: monospace; font-size: 10px; font-weight: 900; background-color: #ff0000; color: #fff; padding: 2px 7px;">VERIFIED PORTFOLIO RESUME</span>
        <h1 style="font-size: 38px; font-weight: 900; margin: 10px 0 0 0; text-transform: uppercase; letter-spacing: -1px; line-height: 1.0;">
          ${injectCody ? PERSONAL_INFO.fullName : 'BESPOKE RESUME'}
        </h1>
        <h2 style="font-size: 18px; font-weight: 700; margin: 5px 0 0 0; color: #0000ff; text-transform: uppercase;">
          ${title}
        </h2>
      </div>
      <div style="font-family: monospace; font-size: 11px; font-weight: 900; text-align: right; margin-top: 10px;">
        BAUHAUS VDB SPEC V3.12<br/>
        SERIAL_NODE_${Math.floor(Math.random() * 90000 + 10000)}
      </div>
    </div>

    ${codyContactSection}

    <div style="border-left: 6px solid #0000ff; padding-left: 15px; margin: 25px 0; font-style: italic;">
      <div style="font-family: monospace; font-size: 10px; font-weight: 900; color: #555; text-transform: uppercase;">[PHILOSOPHY_STATEMENT]</div>
      <p style="font-size: 15px; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase;">"${philosophy}"</p>
    </div>

    <div class="two-column">
      <!-- Left: Skills Focus -->
      <div>
        <div style="border-bottom: 4px solid #000; padding-bottom: 5px; margin-bottom: 15px;">
          <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase;">🛠️ ĐỊNH HƯỚNG KỸ THUẬT (BESPOKE SKILLS)</h2>
        </div>
        <div style="background-color: #fff; padding: 5px 0;">
          ${technicalSkillsHtml}
        </div>
      </div>

      <!-- Right: Blueprint Manifesto -->
      <div>
        <div style="border-bottom: 4px solid #000; padding-bottom: 5px; margin-bottom: 15px;">
          <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase;">⛓️ MA TRẬN GIAO THỨC (GRID MANIFESTO)</h2>
        </div>
        <div class="grid-manifesto-container">
          ${gridManifestoHtml}
        </div>
      </div>
    </div>

    ${codyEduSection}

    ${codyExpSection}

    <div style="border-top: 4px solid #000; padding-top: 15px; margin-top: 40px; font-family: monospace; font-size: 10px; color: #666; display: flex; justify-content: space-between;">
      <span>FORM FOLLOWS FUNCTION - DESIGN ACCORDING TO SYSTEM INTEGRITY.</span>
      <span>VÕ DUY BÌNH (coDY) // 2026</span>
    </div>
  </div>

</body>
</html>`.trim();

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${injectCody ? 'Vo_Duy_Binh' : 'Bespoke'}_Bauhaus_Resume.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 3. MARKDOWN EXPORT GENERATOR
export const downloadAsMarkdown = (cvData: StructuredCV, injectCody: boolean) => {
  let content = '';

  const titleHeader = injectCody ? `# VÕ DUY BÌNH (coDY) - BAUPROTOCOL RESUME` : `# BESPOKE WORK RESUME`;
  content += `${titleHeader}\n`;
  content += `## Theme: ${cvData.themeTitle}\n\n`;

  if (injectCody) {
    content += `> **Email:** ${PERSONAL_INFO.email}\n`;
    content += `> **Phone/Zalo:** ${PERSONAL_INFO.phone}\n`;
    content += `> **Location:** Ho Chi Minh City, Vietnam\n`;
    content += `> **GitHub:** [${PERSONAL_INFO.socials.github}](${PERSONAL_INFO.socials.github})\n`;
    content += `> **LinkedIn:** [${PERSONAL_INFO.socials.linkedin}](${PERSONAL_INFO.socials.linkedin})\n`;
    content += `> **Portfolio:** [${PERSONAL_INFO.socials.beacons}](${PERSONAL_INFO.socials.beacons})\n\n`;
  }

  content += `### Philosophy Statement\n`;
  content += `_"${cvData.philosophyStatement}"_\n\n`;

  content += `### Core Tech Focus & Technical Skills\n`;
  content += `| Skill Name | Domain / Category | Competency Level |\n`;
  content += `| :--- | :--- | :--- |\n`;
  
  if (cvData.technicalSkills && cvData.technicalSkills.length > 0) {
    cvData.technicalSkills.forEach(s => {
      content += `| **${s.title}** | ${s.category} | ${s.competency} |\n`;
    });
  } else {
    content += `| No skills specified | - | - |\n`;
  }
  content += `\n`;

  content += `### System Manifesto Elements\n`;
  if (cvData.gridManifesto && cvData.gridManifesto.length > 0) {
    cvData.gridManifesto.forEach(m => {
      content += `#### [Node: ${m.nodeId}] - **${m.label.toUpperCase()}**\n`;
      content += `> ${m.value}\n\n`;
    });
  }

  if (injectCody) {
    content += `### Educational Foundation\n`;
    content += `- **Institution:** Hoa Sen University (HSU)\n`;
    content += `- **Degree:** Software Engineering Focus\n`;
    content += `- **Languages:** ${PERSONAL_INFO.languages.join(' / ')}\n\n`;

    content += `### Professional History & Work Timeline\n`;
    EXPERIENCE.forEach(exp => {
      content += `#### **${exp.role}** - ${exp.company}\n`;
      content += `_Period: ${exp.period}_\n\n`;
      content += `${exp.description}\n\n`;
      content += `--- \n\n`;
    });
  }

  content += `\n_Generated with coDY Structural AI Engineering Portfolio Suite_`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${injectCody ? 'Vo_Duy_Binh' : 'Bespoke'}_Bauhaus_Resume.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
