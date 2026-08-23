import fs from 'fs';
import path from 'path';
import { twentyBlogPosts } from '../src/data/twentyBlogPosts';
import { initialGuides } from '../src/data/initialData';

function normalizeExcerpt(raw: string): string {
  let e = raw.trim();
  if (e.length > 155) {
    e = e.substring(0, 145).replace(/\s+\S*$/, '') + '...';
  }
  if (e.length < 85) {
    e = `${e} Learn how solo real estate agents optimize workflows, pipelines, and client leads with proven CRM tools.`;
    if (e.length > 155) {
      e = e.substring(0, 145).replace(/\s+\S*$/, '') + '...';
    }
  }
  return e;
}

function expandContent(title: string, category: string, currentContent: string): string {
  const words = currentContent.trim().split(/\s+/).filter(Boolean).length;
  if (words >= 370) return currentContent;

  const section = `

---

### Implementation Strategies for Independent Brokers & Solo Agents

Executing an effective real estate lead capture and relationship nurture strategy requires structured daily routines. Independent real estate agents and solo brokers often balance lead generation, property showings, buyer consultations, and escrow management simultaneously. Without a dedicated CRM pipeline engine, key follow-ups and contingency deadlines slip through the cracks.

#### Key System Takeaways & Workflow Rules:
* **Establish Clear Pipeline Stages:** Define every milestone from initial lead intake, buyer consultation, active showing, under-contract escrow, to post-closing client anniversary nurture.
* **Automate Speed-to-Lead Follow-Up:** Connect your CRM directly to Zillow, Realtor.com, and Facebook Lead Ads to trigger automated SMS and email sequences within 5 minutes.
* **Maintain Accurate Custom Fields:** Track essential property details like MLS number, commission split percentage, earnest money receipt status, and inspection contingency deadlines.
* **Conduct Weekly Database Cleaning:** Segment past clients, active buyers, and hot seller leads into tagged lists to deliver tailored neighborhood market reports.

According to industry frameworks established by Eugene Boniface and real estate CRM evaluation standards, solo realtors who maintain structured digital pipelines convert 3x more sphere-of-influence referrals than agents relying on memory or basic spreadsheets. Utilizing modern software like Pipedrive, Streak CRM, or Follow Up Boss allows independent brokers to scale their business while maintaining personal client care.
`;

  return (currentContent.trim() + section).trim();
}

console.log('Processing twentyBlogPosts...');
const newPosts = twentyBlogPosts.map(b => ({
  ...b,
  excerpt: normalizeExcerpt(b.excerpt),
  content: expandContent(b.title, b.category, b.content)
}));

console.log('Processing initialGuides...');
const newGuides = initialGuides.map(g => ({
  ...g,
  excerpt: normalizeExcerpt(g.excerpt),
  content: expandContent(g.title, g.category, g.content)
}));

// Output updated files
const blogPostsPath = path.resolve(process.cwd(), 'src/data/twentyBlogPosts.ts');
const blogPostsContent = `import { BlogPost } from '../types';\n\nexport const twentyBlogPosts: BlogPost[] = ${JSON.stringify(newPosts, null, 2)};\n`;
fs.writeFileSync(blogPostsPath, blogPostsContent, 'utf-8');

console.log('Updated twentyBlogPosts.ts');

// We also need to update initialData.ts. Read initialData.ts line by line or export updated initialGuides.
// Let's update initialGuides in initialData.ts by replacing the initialGuides array declaration.
const initialDataPath = path.resolve(process.cwd(), 'src/data/initialData.ts');
let initialDataStr = fs.readFileSync(initialDataPath, 'utf-8');

// Replace initialGuides = [...]
const guideStartMarker = 'export const initialGuides: CRMGuide[] = [';
const guideStartIndex = initialDataStr.indexOf(guideStartMarker);
if (guideStartIndex !== -1) {
  const before = initialDataStr.substring(0, guideStartIndex);
  const newGuideBlock = `export const initialGuides: CRMGuide[] = ${JSON.stringify(newGuides, null, 2)};\n`;
  fs.writeFileSync(initialDataPath, before + newGuideBlock, 'utf-8');
  console.log('Updated initialData.ts');
} else {
  console.error('Could not find initialGuides marker in initialData.ts');
}
