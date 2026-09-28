import React, { useState } from 'react';
import { Star, ArrowUpRight, SlidersHorizontal } from 'lucide-react';

/**
 * Replaces the previous "realtor video walkthrough" carousel, which paired
 * invented agent names and transcripts with Google sample video clips and stock
 * photography. Every value below comes from CRMSolo's published reviews, so the
 * section now presents verifiable pricing and scoring instead of fabricated
 * customer video.
 */
interface ComparisonRow {
  id: string;
  name: string;
  slug: string;
  score: number;
  startingPrice: number;
  priceLabel: string;
  bestFor: string;
  freeTier: boolean;
  googleWorkspaceNative: boolean;
  builtForRealEstate: boolean;
  strengths: string[];
  tradeOffs: string[];
}

const ROWS: ComparisonRow[] = [
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    slug: 'pipedrive-for-real-estate-agents',
    score: 9.2,
    startingPrice: 14,
    priceLabel: '$14/mo',
    bestFor: 'Visual pipelines & habit-forming deal management',
    freeTier: false,
    googleWorkspaceNative: false,
    builtForRealEstate: false,
    strengths: [
      'The clean, visual layout maps perfectly to real estate pipeline stages (e.g. Active Listing, Under Contract, Closing).',
      'The mobile app is blazing fast — upload photo showing notes or schedule next check-in while sitting in your car.',
      'Extremely custom-field-friendly: we added fields for listing date, contract expiration, and loan contingency deadlines in under 2 minutes.',
      'No clunky legacy enterprise bloat. It gets out of your way.'
    ],
    tradeOffs: [
      'There is no permanent free tier — after the 14-day trial, you must subscribe.',
      'To get automated email follow-up templates, you must pay for the Advanced plan ($29/mo).',
      'No native client-portal options, meaning you cannot share a direct deal checklist with your buyer.'
    ]
  },
  {
    id: 'streak',
    name: 'Streak',
    slug: 'streak-for-real-estate-agents',
    score: 9.0,
    startingPrice: 0,
    priceLabel: 'Free tier',
    bestFor: 'Gmail-native workflow and zero-friction inbox organization',
    freeTier: true,
    googleWorkspaceNative: true,
    builtForRealEstate: false,
    strengths: [
      'No separate web browser tab required — it lives entirely inside your standard Gmail inbox layout.',
      'Unmatched ease of use: looks and feels like a beautiful spreadsheet layered on top of your email threads.',
      'The Free tier is highly capable, letting you track unlimited deals and log emails with zero friction.',
      'Excellent email open tracking tells you exactly who is reading your property sheets and when.'
    ],
    tradeOffs: [
      'Completely dependent on Google Workspace ecosystem — if you use Outlook, Safari Mail, or Apple Mail, Streak is unusable.',
      'Does not have a robust built-in meeting scheduler link, requiring you to use third-party tools like Calendly.',
      "The mobile app relies on Gmail's native UI, which can feel less robust for advanced on-the-road CRM features."
    ]
  },
  {
    id: 'followupboss',
    name: 'Follow Up Boss',
    slug: 'followupboss-for-real-estate-agents',
    score: 9.5,
    startingPrice: 69,
    priceLabel: '$69/mo',
    bestFor: 'Active lead conversion & high-volume lead follow-up',
    freeTier: false,
    googleWorkspaceNative: false,
    builtForRealEstate: true,
    strengths: [
      'Highly specialized for real estate out-of-the-box — hooks into Zillow, Realtor.com, and local MLS instantly with zero setup.',
      'Action Plans are the best automated follow-up sequences in the industry, letting you nurture incoming leads on day one.',
      'The mobile app is a powerhouse: dial contacts, send texts, log call recordings, and view listings in real-time.',
      'Exceptional customer support team that understands the real estate transaction cycle inside and out.'
    ],
    tradeOffs: [
      'No free tier — after the 14-day trial, the entry price is $69/mo, which is high for brand new agents on a strict budget.',
      'Pricing can escalate quickly if you add assistants or want the built-in dialer plan.',
      "Does not have a strict, visual stage-change checklist enforcement tool like Pipedrive's deal-stage locks."
    ]
  },
  {
    id: 'wise-agent',
    name: 'Wise Agent',
    slug: 'wise-agent-crm-for-real-estate',
    score: 8.9,
    startingPrice: 49,
    priceLabel: '$49/mo',
    bestFor: 'Transaction checklists & built-in marketing tools at a flat price',
    freeTier: false,
    googleWorkspaceNative: false,
    builtForRealEstate: true,
    strengths: [
      'Flat pricing ($49/mo) includes transaction management, lead automation, and landing page creation with no hidden upcharges.',
      'Native real estate date calculators automatically calculate closing deadlines and commission splits.',
      'All-in-one scope means fewer separate subscriptions for a solo agent to manage.'
    ],
    tradeOffs: [
      'The user interface feels slightly dated compared to modern sleek SaaS tools like Pipedrive.',
      'The mobile app is functional but lacks the fluid animations and polished swipe gestures of Follow Up Boss.'
    ]
  },
  {
    id: 'copper',
    name: 'Copper CRM',
    slug: 'copper-crm-for-real-estate-agents',
    score: 9.1,
    startingPrice: 29,
    priceLabel: '$29/mo',
    bestFor: 'Google Workspace power users & automated contact scraping',
    freeTier: false,
    googleWorkspaceNative: true,
    builtForRealEstate: false,
    strengths: [
      'Officially endorsed by Google: integrates so deeply into Gmail that you never have to leave your inbox to manage buyers.',
      'Scrapes contact phone numbers, email addresses, and company details automatically, eliminating manual data entry.'
    ],
    tradeOffs: [
      'Completely useless if your brokerage uses Microsoft Outlook or Office 365.',
      'Starting price of $29/mo is higher than Streak, and the Starter tier limits you to 2,500 contacts.'
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    slug: 'hubspot-crm-for-solo-real-estate',
    score: 8.7,
    startingPrice: 0,
    priceLabel: 'Free tier',
    bestFor: 'Generous free contact database & meeting scheduling links',
    freeTier: true,
    googleWorkspaceNative: false,
    builtForRealEstate: false,
    strengths: [
      'The most generous free tier in the software industry: store up to 1,000,000 contacts with zero expiration.',
      'Includes a built-in meeting scheduler link that syncs with Google Calendar and Outlook.'
    ],
    tradeOffs: [
      'Paid upgrade tiers escalate dramatically (Pro plans can exceed $400-$500/month).',
      'Generic corporate SaaS terminology (e.g. "Deals", "Companies") rather than real estate terms (e.g. "Listings").'
    ]
  }
];

export default function AgentCrmComparison() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section
      id="agent-crm-comparison"
      className="bg-white border-y border-gray-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            At-a-glance comparison
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter">
            SOLO AGENT CRM COMPARISON
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Pricing, scores, and fit taken from our published reviews. Select any row to see the documented strengths
            and trade-offs for that platform.
          </p>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xs">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <caption className="sr-only">Comparison of real estate CRM platforms reviewed by CRMSolo</caption>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Platform</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Editorial score</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Starting price</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Free tier</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Gmail-native</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500">Built for real estate</th>
                <th scope="col" className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest font-black text-gray-500"><span className="sr-only">Review link</span></th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const isOpen = expandedId === row.id;
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setExpandedId(isOpen ? null : row.id)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <th scope="row" className="py-3 px-4 text-sm font-black text-primary">
                        {row.name}
                        <span className="block text-[10px] font-normal text-gray-400 font-sans max-w-[220px] leading-snug">
                          {row.bestFor}
                        </span>
                      </th>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-white" />
                          {row.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 font-medium">{row.priceLabel}</td>
                      <td className="py-3 px-4 text-sm">{row.freeTier ? 'Yes' : 'No'}</td>
                      <td className="py-3 px-4 text-sm">{row.googleWorkspaceNative ? 'Yes' : 'No'}</td>
                      <td className="py-3 px-4 text-sm">{row.builtForRealEstate ? 'Yes' : 'No'}</td>
                      <td className="py-3 px-4">
                        <a
                          href={`/reviews/${row.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-black text-primary hover:text-accent transition"
                        >
                          Review
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={7} className="py-4 px-4">
                          <div className="grid sm:grid-cols-2 gap-5 text-left">
                            <div>
                              <h4 className="text-[10px] font-mono uppercase tracking-widest font-black text-emerald-700 mb-2">
                                What works
                              </h4>
                              <ul className="space-y-1.5">
                                {row.strengths.map((item, i) => (
                                  <li key={i} className="text-sm text-primary leading-snug flex gap-2">
                                    <span className="text-emerald-600 shrink-0 font-bold">+</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-700 mb-2">
                                Trade-offs
                              </h4>
                              <ul className="space-y-1.5">
                                {row.tradeOffs.map((item, i) => (
                                  <li key={i} className="text-sm text-gray-600 leading-snug flex gap-2">
                                    <span className="text-amber-600 shrink-0 font-bold">&minus;</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Scores are CRMSolo editorial assessments, not aggregated customer ratings. See our{' '}
          <a href="/methodology" className="underline hover:text-gray-600">methodology</a>.
        </p>
      </div>
    </section>
  );
}
