import { jsPDF } from 'jspdf';
import { PERSONAL_INFO, EXPERIENCE, SKILLS } from '../constants';

// Strip Vietnamese accents for PDF compatibility inside jsPDF built-in helvetica
const removeAccents = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

export const generateResumePDF = () => {
    const doc = new jsPDF();
    const primaryColor = '#D02020'; // Bauhaus Red
    const secondaryColor = '#2850CE'; // Bauhaus Blue
    const black = '#1C1B1B';

    // Helper for Bauhaus Style
    const bauhausRect = (x: number, y: number, w: number, h: number, color: string) => {
        doc.setFillColor(color);
        doc.rect(x, y, w, h, 'F');
    };

    // Header
    bauhausRect(0, 0, 210, 40, black);
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text(removeAccents(PERSONAL_INFO.fullName).toUpperCase(), 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('AI ENGINEER // SOFTWARE TECH // CONTENT CREATOR', 15, 33);

    // Contact Info Bar
    bauhausRect(0, 40, 210, 10, primaryColor);
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    // Ensure all contact texts are stripped of special accented characters
    const contactText = removeAccents(`${PERSONAL_INFO.email}  |  ${PERSONAL_INFO.phone}  |  ${PERSONAL_INFO.location}`);
    doc.text(contactText, 15, 46);

    // Main Content
    let y = 60;
    doc.setTextColor(black);

    // Work Experience
    doc.setFontSize(14);
    doc.text('RELEVANT_INFRASTRUCTURE', 15, y);
    bauhausRect(15, y + 2, 50, 1, secondaryColor);
    y += 15;

    EXPERIENCE.forEach((exp) => {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(removeAccents(exp.role).toUpperCase(), 15, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(primaryColor);
        doc.text(removeAccents(exp.company).toUpperCase(), 195, y, { align: 'right' }); // Increased X to 195 or 150 according to alignment boundaries
        
        y += 5;
        doc.setTextColor(black);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(exp.period, 15, y);
        
        y += 5;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(removeAccents(exp.description), 180);
        doc.text(lines, 15, y);
        y += (lines.length * 4) + 10;
    });

    // Skills
    if (y > 230) {
        doc.addPage();
        y = 20;
    }
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TECH_SPECIFICATIONS', 15, y);
    bauhausRect(15, y + 2, 50, 1, primaryColor);
    y += 15;

    doc.setFontSize(9);
    doc.text('AI & ML:', 15, y);
    doc.setFont('helvetica', 'normal');
    const aiSkills = removeAccents(SKILLS.ai.join(', '));
    const aiLines = doc.splitTextToSize(aiSkills, 150);
    doc.text(aiLines, 45, y);
    y += (aiLines.length * 4.5) + 4;

    doc.setFont('helvetica', 'bold');
    doc.text('CORE_DEV:', 15, y);
    doc.setFont('helvetica', 'normal');
    const techSkills = removeAccents(SKILLS.tech.join(', '));
    const techLines = doc.splitTextToSize(techSkills, 150);
    doc.text(techLines, 45, y);
    y += (techLines.length * 4.5) + 4;

    doc.setFont('helvetica', 'bold');
    doc.text('CREATIVE:', 15, y);
    doc.setFont('helvetica', 'normal');
    const creativeSkills = removeAccents(SKILLS.creative.join(', '));
    const creativeLines = doc.splitTextToSize(creativeSkills, 150);
    doc.text(creativeLines, 45, y);

    // Save
    doc.save(`VO_DUY_BINH_RESUME_${Date.now()}.pdf`);
};
