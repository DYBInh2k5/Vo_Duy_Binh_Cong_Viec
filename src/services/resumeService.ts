import { jsPDF } from 'jspdf';
import { PERSONAL_INFO, EXPERIENCE, SKILLS } from '../constants';

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
    doc.text(PERSONAL_INFO.fullName.toUpperCase(), 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('AI ENGINEER // SOFTWARE TECH // CONTENT CREATOR', 15, 33);

    // Contact Info Bar
    bauhausRect(0, 40, 210, 10, primaryColor);
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${PERSONAL_INFO.email}  |  ${PERSONAL_INFO.phone}  |  ${PERSONAL_INFO.location}`, 15, 46);

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
        doc.text(exp.role.toUpperCase(), 15, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(primaryColor);
        doc.text(exp.company.toUpperCase(), 150, y, { align: 'right' });
        
        y += 5;
        doc.setTextColor(black);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(exp.period, 15, y);
        
        y += 5;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(exp.description, 180);
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
    doc.text(SKILLS.ai.join(', '), 45, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('CORE_DEV:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(SKILLS.tech.join(', '), 45, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('CREATIVE:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(SKILLS.creative.join(', '), 45, y);

    // Save
    doc.save(`VO_DUY_BINH_RESUME_${Date.now()}.pdf`);
};
