import { jsPDF } from 'jspdf';
import { CRMReview, CRMGuide, PlanningCategory, PlanningToolItem } from '../types';

export interface ROIPDFData {
  monthlyLeads: number;
  responseTime: string;
  currentCloseRate: number;
  avgCommission: number;
  hourlyValue: number;
  hoursSpentOnAdmin: number;
  currentToolSpend: number;
  totalAnnualGain: number;
  improvedCloseRate: number;
  additionalDealsPerYear: number;
  additionalAnnualRevenue: number;
  hoursSavedPerWeek: number;
  annualValueTimeSaved: number;
  recommendations: Array<{
    crmName: string;
    annualCost: number;
    netRoi: number;
    isBestFit: boolean;
    reason: string;
  }>;
}

/**
 * Adds a standardized header to any CRMsolo PDF document
 */
function addDocHeader(doc: jsPDF, title: string, subtitle?: string): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Dark Bar
  doc.setFillColor(15, 23, 42); // slate-900 / navy
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Gold accent line
  doc.setFillColor(217, 119, 6); // amber-600 / gold
  doc.rect(0, 26, pageWidth, 2, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('CRMSOLO', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Independent Software Benchmark & Intelligence', 50, 15);

  // Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 15, { align: 'right' });

  // Main Page Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, 40);

  let currentY = 46;
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const splitSub = doc.splitTextToSize(subtitle, pageWidth - 28);
    doc.text(splitSub, 14, currentY);
    currentY += splitSub.length * 5 + 4;
  }

  return currentY;
}

/**
 * Adds standard footer with page number
 */
function addDocFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('CRMsolo.com — Verified Software Evaluation Report', 14, pageHeight - 8);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
}

/**
 * Generate and download ROI Calculator PDF Report
 */
export function generateROICalculatorPDF(data: ROIPDFData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = addDocHeader(
    doc,
    'Real Estate CRM ROI & Commission Forecast',
    'Comprehensive return on investment evaluation based on speed-to-lead acceleration and administrative automation.'
  );

  // Big Highlight Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMATED ANNUAL ROI VALUE', 20, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(217, 119, 6); // gold
  doc.text(`$${Math.round(data.totalAnnualGain).toLocaleString()}`, 20, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`+${data.additionalDealsPerYear.toFixed(1)} Extra Closed Escrows/Year`, 100, y + 12);
  doc.text(`$${Math.round(data.additionalAnnualRevenue).toLocaleString()} Extra Commission GCI`, 100, y + 18);
  doc.text(`${data.hoursSavedPerWeek.toFixed(1)} hrs/wk saved ($${Math.round(data.annualValueTimeSaved).toLocaleString()}/yr time value)`, 100, y + 24);

  y += 38;

  // Section 1: Inputs Parameters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Baseline Business Input Parameters', 14, y);
  y += 6;

  const inputsTable = [
    ['Monthly Inbound Leads', `${data.monthlyLeads} leads/mo`, 'Lead Response Speed', data.responseTime],
    ['Current Close Rate', `${data.currentCloseRate}%`, 'Projected Close Rate', `${data.improvedCloseRate.toFixed(1)}%`],
    ['Average Commission (GCI)', `$${data.avgCommission.toLocaleString()}`, 'Agent Hourly Time Value', `$${data.hourlyValue}/hr`],
    ['Weekly Admin Overhead', `${data.hoursSpentOnAdmin} hrs/wk`, 'Current Monthly Tool Spend', `$${data.currentToolSpend}/mo`]
  ];

  doc.setFontSize(9);
  inputsTable.forEach((row, rIdx) => {
    const rowY = y + rIdx * 7;
    doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, rIdx % 2 === 0 ? 255 : 250, rIdx % 2 === 0 ? 255 : 252);
    doc.rect(14, rowY - 4, pageWidth - 28, 7, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 18, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row[1], 70, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(row[2], 110, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(row[3], 165, rowY);
  });

  y += inputsTable.length * 7 + 8;

  // Section 2: Software Recommendations & Net ROI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Software Fit Comparison & Net ROI Rankings', 14, y);
  y += 6;

  data.recommendations.forEach((rec, idx) => {
    const boxHeight = 22;
    doc.setFillColor(rec.isBestFit ? 254 : 255, rec.isBestFit ? 243 : 255, rec.isBestFit ? 199 : 255); // amber-50 if winner
    doc.setDrawColor(rec.isBestFit ? 217 : 226, rec.isBestFit ? 119 : 232, rec.isBestFit ? 6 : 240);
    doc.roundedRect(14, y, pageWidth - 28, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(rec.crmName + (rec.isBestFit ? '  ★ RECOMMENDED BEST FIT' : ''), 20, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const reasonText = doc.splitTextToSize(rec.reason, pageWidth - 80);
    doc.text(reasonText, 20, y + 13);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129); // green
    doc.text(`Net ROI: +$${Math.round(rec.netRoi).toLocaleString()}/yr`, pageWidth - 20, y + 8, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Est. Cost: $${Math.round(rec.annualCost / 12)}/mo`, pageWidth - 20, y + 14, { align: 'right' });

    y += boxHeight + 4;
  });

  y += 4;

  // Section 3: Calculation Methodology
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Calculation Methodology & Benchmark Reference:', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const notes = [
    '• Speed-to-lead multiplier: Inquiries contacted in under 5 minutes qualify at 21x higher rates, delivering up to 2.1x conversion gains.',
    '• Administrative time savings: Automated CRM pipelines eliminate 60% of repetitive data entry, email drafting, and calendar reminders.',
    '• Net ROI Formula: (Additional Commission Revenue + Time Savings Value) - (New Annual CRM License Cost - Existing Tool Spend).'
  ];
  notes.forEach((note) => {
    doc.text(note, 14, y);
    y += 4.5;
  });

  addDocFooter(doc, 1, 1);
  return doc;
}

/**
 * Generate and download Planning Category Software Benchmark PDF (e.g. Project Management 899, Task Management 673)
 */
export function generatePlanningCategoryPDF(category: PlanningCategory, tools?: PlanningToolItem[]): jsPDF {
  const toolsList = tools && tools.length > 0 ? tools : (category.topTools || []);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = addDocHeader(
    doc,
    `${category.name} Software Evaluation (${category.toolCount})`,
    `${category.description} Comprehensive audit of top platforms, pricing tiers, and capabilities.`
  );

  // Category Meta Summary
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Audited Platforms: ${category.toolCount}`, 20, y + 6);
  doc.text(`GEO Focus: ${category.geoFocus.regions.join(', ')}`, 100, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Evaluation Criteria: ${category.evaluationCriteria.join(' • ')}`, 20, y + 11);

  y += 22;

  // Tools Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Top-Rated Platforms in Category`, 14, y);
  y += 5;

  let currentPage = 1;

  toolsList.forEach((tool, idx) => {
    // Check if new page needed
    if (y > pageHeight - 35) {
      addDocFooter(doc, currentPage, 2);
      doc.addPage();
      currentPage++;
      y = 20;
    }

    const cardHeight = 24;
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, cardHeight, 2, 2, 'FD');

    // Tool name & rank
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${tool.name}`, 18, y + 6);

    // Rating badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(217, 119, 6);
    doc.text(`★ ${tool.rating} / 5.0`, 90, y + 6);

    // Pricing & Tier
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text(tool.pricingStarting, pageWidth - 20, y + 6, { align: 'right' });

    // Best for
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const bestForText = `Best for: ${tool.bestFor}`;
    doc.text(doc.splitTextToSize(bestForText, pageWidth - 40), 18, y + 11);

    // Key features
    const feats = `Key Features: ${tool.keyFeatures.slice(0, 3).join(' | ')}`;
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(doc.splitTextToSize(feats, pageWidth - 40), 18, y + 16);

    // Deployment
    doc.text(`Deployment: ${tool.deployment || 'Web / Cloud / Mobile'}  •  Tier: ${tool.pricingTier}`, 18, y + 21);

    y += cardHeight + 3.5;
  });

  addDocFooter(doc, currentPage, currentPage);
  return doc;
}

/**
 * Generate and download Setup Guide / Playbook PDF
 */
export function generateGuidePDF(guide: CRMGuide): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = addDocHeader(
    doc,
    guide.title,
    `Category: ${guide.category} | Author: ${guide.author} | Read Time: ${guide.readTime} | Updated: ${guide.lastUpdated}`
  );

  let currentPage = 1;

  // Clean Markdown content lines
  const lines = guide.content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      y += 2;
      return;
    }

    // Page break check
    if (y > pageHeight - 25) {
      addDocFooter(doc, currentPage, 0); // Will update
      doc.addPage();
      currentPage++;
      y = 20;
    }

    if (trimmed.startsWith('### ')) {
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(trimmed.replace('### ', ''), 14, y);
      y += 6;
    } else if (trimmed.startsWith('## ')) {
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(trimmed.replace('## ', ''), 14, y);
      y += 7;
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const bulletText = doc.splitTextToSize(trimmed, pageWidth - 32);
      doc.text(bulletText, 18, y);
      y += bulletText.length * 4.5;
    } else if (trimmed.startsWith('---')) {
      y += 2;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, pageWidth - 14, y);
      y += 5;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const paraText = doc.splitTextToSize(trimmed.replace(/\*\*(.*?)\*\*/g, '$1'), pageWidth - 28);
      doc.text(paraText, 14, y);
      y += paraText.length * 4.5;
    }
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addDocFooter(doc, i, totalPages);
  }

  return doc;
}

/**
 * Generate and download CRM Review Detail PDF
 */
export function generateReviewPDF(review: CRMReview): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const startingPrice = review.startingPrice ?? (review.pricingTiers[0]?.price ?? 0);
  const features = review.featuresList ?? (review.pricingTiers[0]?.features ?? []);
  const ratingOutOf5 = (review.overallScore / 2).toFixed(1);

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = addDocHeader(
    doc,
    `${review.name} — Real Estate CRM Review`,
    `Score: ${ratingOutOf5}/5.0 (${review.overallScore}/10) | Starting: $${startingPrice}/mo | Best For: ${review.bestFor}`
  );

  // Quick Verdict Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('EXPERT VERDICT', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const verdictText = doc.splitTextToSize(review.verdict, pageWidth - 40);
  doc.text(verdictText, 20, y + 12);

  y += 30;

  // Pros & Cons
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text('Strengths / Pros', 14, y);

  doc.setTextColor(225, 29, 72);
  doc.text('Limitations / Cons', (pageWidth / 2) + 4, y);
  y += 5;

  const maxRows = Math.max(review.pros.length, review.cons.length);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  for (let i = 0; i < maxRows; i++) {
    if (review.pros[i]) {
      doc.setTextColor(51, 65, 85);
      const pText = doc.splitTextToSize(`+ ${review.pros[i]}`, (pageWidth / 2) - 20);
      doc.text(pText, 14, y);
    }
    if (review.cons[i]) {
      doc.setTextColor(51, 65, 85);
      const cText = doc.splitTextToSize(`- ${review.cons[i]}`, (pageWidth / 2) - 20);
      doc.text(cText, (pageWidth / 2) + 4, y);
    }
    y += 7;
  }

  y += 6;

  // Key Features
  if (features.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Key Real Estate Capabilities', 14, y);
    y += 5;

    features.slice(0, 6).forEach((kf) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`• ${kf}`, 16, y);
      y += 5;
    });
  }

  addDocFooter(doc, 1, 1);
  return doc;
}
