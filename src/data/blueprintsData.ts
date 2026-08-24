export interface BlueprintStep {
  stepNumber: number;
  title: string;
  action: string;
  tools: string[];
  timeframe: string;
  templateSnippet?: string;
  proTip: string;
}

export interface AutomationBlueprint {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'Speed-to-Lead' | 'Listing & Escrow' | 'Client Retention' | 'Lead Generation' | 'Pinterest & Social';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToDeploy: string;
  roiImpact: string;
  targetCrms: string[];
  summary: string;
  triggerEvent: string;
  steps: BlueprintStep[];
  copyableTemplates: {
    title: string;
    description: string;
    content: string;
    type: 'sms' | 'email' | 'zapier' | 'ai_prompt' | 'checklist';
  }[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const automationBlueprints: AutomationBlueprint[] = [
  {
    id: 'speed-to-lead-5min',
    slug: 'speed-to-lead-5-minute-auto-responder',
    title: 'The 5-Minute Speed-to-Lead Auto-Responder Protocol',
    tagline: 'Connect Zillow, Realtor.com, and Meta ads to instant SMS within 120 seconds.',
    category: 'Speed-to-Lead',
    difficulty: 'Beginner',
    timeToDeploy: '15 Minutes',
    roiImpact: '+391% conversion probability vs 30-minute response',
    targetCrms: ['Follow Up Boss', 'Pipedrive', 'Streak', 'Wise Agent'],
    summary: 'A streamlined webhook automation blueprint that captures incoming portal leads, validates phone numbers, and sends a non-robotic text message to start a real conversation within 2 minutes.',
    triggerEvent: 'New lead submitted on Zillow, Realtor.com, or Meta Lead Ad form.',
    steps: [
      {
        stepNumber: 1,
        title: 'Webhook & Lead Ingestion',
        action: 'Route the portal lead email or webhook directly into your CRM inbox using Zapier or native CRM parsing.',
        tools: ['Zapier / Make', 'CRM Webhook Parser'],
        timeframe: '0 - 30 seconds',
        proTip: 'Ensure lead source tags (e.g. #Zillow-Buyer) are attached automatically to avoid manual segmenting.'
      },
      {
        stepNumber: 2,
        title: 'Instant Casual SMS Trigger',
        action: 'Send an automated text from your actual phone or CRM virtual number asking one simple low-friction question.',
        tools: ['Twilio / Native CRM SMS'],
        timeframe: '60 - 120 seconds',
        templateSnippet: 'Hi {{firstName}}! Just saw you inquired about the property on {{propertyStreet}}. Are you looking to tour this home this weekend or just browsing for now? - {{agentName}}',
        proTip: 'Never use formal corporate jargon. Keep texts under 160 characters and end with a low-friction question.'
      },
      {
        stepNumber: 3,
        title: 'Agent Mobile Push Notification & Call Alert',
        action: 'Send a high-priority push notification to your phone so you can dial the lead if no SMS reply arrives in 5 minutes.',
        tools: ['CRM Mobile App', 'Push Notifications'],
        timeframe: '2 - 5 minutes',
        proTip: 'If the lead opens the SMS, wait 60 seconds before calling to avoid seeming intrusive.'
      },
      {
        stepNumber: 4,
        title: 'Auto-Task Generation & 3-Day Drip',
        action: 'If unanswered, enroll the contact into a 3-step value-first email series featuring recent neighborhood comparables.',
        tools: ['CRM Drip Campaign'],
        timeframe: 'Day 1 to Day 3',
        proTip: 'Always include a 1-click link to view off-market or upcoming listings.'
      }
    ],
    copyableTemplates: [
      {
        title: 'Instant Casual SMS (High Response)',
        description: 'Copy and paste into your CRM auto-responder rule.',
        type: 'sms',
        content: `Hi {{firstName}}! I just received your inquiry about {{propertyStreet}}. Are you looking to walk through the home this week, or are you just exploring the market for now? - {{agentName}}, {{brokerage}}`
      },
      {
        title: '24-Hour Follow-up Email (Neighborhood Comps)',
        description: 'Automated email sent if no reply to initial SMS.',
        type: 'email',
        content: `Subject: Quick question regarding {{propertyStreet}} (and 3 nearby comps)

Hi {{firstName}},

I wanted to make sure you got the full property disclosure and recent sale comps for {{propertyStreet}}. 

Three similar homes in this neighborhood went under contract in the past 14 days, and I put together a quick 1-page summary of what they actually sold for:

👉 [Click here to view the recent neighborhood comps]

Would it be helpful if I sent you upcoming open house times or a video walk-through?

Best regards,
{{agentName}} | {{agentPhone}}
{{brokerage}}`
      },
      {
        title: 'Zapier Webhook JSON Payload Schema',
        description: 'Standard Zapier / Make.com webhook structure for lead routing.',
        type: 'zapier',
        content: `{
  "event": "lead.created",
  "lead_source": "Zillow_Premier",
  "contact": {
    "first_name": "{{1.first_name}}",
    "last_name": "{{1.last_name}}",
    "phone": "{{1.phone_number}}",
    "email": "{{1.email}}",
    "property_address": "{{1.inquired_address}}"
  },
  "automation": {
    "trigger_sms": true,
    "assignee": "Solo_Agent",
    "pipeline_stage": "New Inbound Inquiry"
  }
}`
      }
    ],
    faq: [
      {
        q: 'Will automated texts feel spammy to home buyers?',
        a: 'No. When phrased casually and sent within 2 minutes, buyers appreciate immediate confirmation and respond at a 42% higher rate than static auto-responders.'
      },
      {
        q: 'Which CRM executes this best for solo agents?',
        a: 'Follow Up Boss and Pipedrive (paired with Zapier & Twilio) offer the most reliable sub-120-second webhook triggers.'
      }
    ]
  },
  {
    id: 'kanban-escrow-contingency',
    slug: 'kanban-listing-escrow-contingency-engine',
    title: 'Visual Kanban Escrow & Contingency Pipeline Engine',
    tagline: 'Never miss an earnest money deposit, home inspection, or appraisal contingency deadline.',
    category: 'Listing & Escrow',
    difficulty: 'Beginner',
    timeToDeploy: '20 Minutes',
    roiImpact: 'Eliminates contract fallout and costly escrow dispute penalties',
    targetCrms: ['Pipedrive', 'Streak', 'Copper', 'Zoho CRM'],
    summary: 'A standard 7-stage visual deal board specifically formatted for solo realtors to track property escrows from executed contract to commission disbursement.',
    triggerEvent: 'Purchase agreement executed by buyer and seller.',
    steps: [
      {
        stepNumber: 1,
        title: 'Stage 1: Contract Executed & Earnest Money Verification',
        action: 'Create deal card with MLS #, purchase price, commission split, and earnest deposit due date (within 72 hours).',
        tools: ['CRM Deal Board', 'Calendar Sync'],
        timeframe: 'Hour 1',
        proTip: 'Set a hard deadline alert 24 hours before earnest money is due to title.'
      },
      {
        stepNumber: 2,
        title: 'Stage 2: Inspection & Due Diligence Tracking',
        action: 'Schedule property inspector, radon test, and termite report with automated client email prep checklist.',
        tools: ['Task Templates', 'Automated Email'],
        timeframe: 'Days 1 - 10',
        proTip: 'Send the buyer an automated "What to Expect at Home Inspection" PDF guide.'
      },
      {
        stepNumber: 3,
        title: 'Stage 3: Appraisal & Lender Loan Commitment',
        action: 'Track appraisal order date, report receipt, and mortgage commitment deadline.',
        tools: ['CRM Custom Fields'],
        timeframe: 'Days 10 - 21',
        proTip: 'Include lender and title officer contacts directly inside the deal card sidebar.'
      },
      {
        stepNumber: 4,
        title: 'Stage 4: Clear to Close & Final Walkthrough',
        action: 'Coordinate closing disclosure (CD) signing 3 business days prior to closing and lock final walkthrough.',
        tools: ['CRM Task Checklist'],
        timeframe: 'Days 25 - 30',
        proTip: 'Send the utility transfer checklist to buyer 5 days prior to settlement.'
      }
    ],
    copyableTemplates: [
      {
        title: 'Buyer Escrow Milestones Email',
        description: 'Send immediately after contract mutual execution.',
        type: 'email',
        content: `Subject: 🎉 Congratulations! Next Steps & Important Deadlines for {{propertyAddress}}

Hi {{firstName}},

We are officially under contract! Here is your roadmap and crucial calendar deadlines for the next 30 days:

📅 KEY MILESTONES:
1. Earnest Money Deposit ($ {{earnestAmount}}): Due by {{earnestDate}} to {{titleCompany}}
2. Home Inspection Period: Completed by {{inspectionDeadline}}
3. Appraisal & Financing Commitment: Due by {{loanCommitmentDate}}
4. Final Walkthrough & Closing Day: Scheduled for {{closingDate}} at {{titleCompany}}

Attached is our "Buyer Escrow Checklist" and wiring instructions security advisory.

Let's get this to the finish line!
{{agentName}} | {{agentPhone}}`
      },
      {
        title: 'Pipedrive / Streak Custom Field Schema',
        description: 'Recommended custom fields to create in your CRM deal settings.',
        type: 'checklist',
        content: `[ ] MLS_Number (Text)
[ ] Contract_Price (Monetary Currency)
[ ] Commission_Split_Pct (Percentage, e.g. 2.5%)
[ ] Net_Agent_Commission (Auto-calculated formula)
[ ] Earnest_Money_DueDate (Date)
[ ] Inspection_Contingency_Date (Date)
[ ] Appraisal_Contingency_Date (Date)
[ ] Loan_Commitment_Date (Date)
[ ] Title_Company_Escrow_Officer (Contact Link)
[ ] Co_Broke_Agent_Name_Phone (Text)`
      }
    ],
    faq: [
      {
        q: 'Can I track both buyer and seller deals in one Kanban board?',
        a: 'Yes, use Pipeline filters or color tags (#Buyer vs #Listing) in Pipedrive or Streak to keep them neatly separated.'
      }
    ]
  },
  {
    id: 'pinterest-viral-pin-lead-funnel',
    slug: 'pinterest-viral-pin-traffic-lead-funnel',
    title: 'The Pinterest Viral Real Estate Traffic & Lead Funnel',
    tagline: 'Generate 1,500+ monthly high-intent buyer/seller visitors using 2:3 vertical pins and ROI calculators.',
    category: 'Pinterest & Social',
    difficulty: 'Intermediate',
    timeToDeploy: '30 Minutes',
    roiImpact: 'Zero ad spend inbound organic traffic that converts into newsletter & CRM leads',
    targetCrms: ['All CRMs', 'ConvertKit', 'Mailchimp', 'HubSpot'],
    summary: 'A proven Pinterest SEO blueprint tailored for solo brokers. Learn exact 1000x1500px graphic formatting, keyword clusters, rich pin verification, and lead magnet landing pages.',
    triggerEvent: 'Publishing a new blog post, neighborhood guide, or market review.',
    steps: [
      {
        stepNumber: 1,
        title: 'Design 3 High-Contrast 2:3 Vertical Pins',
        action: 'Create 1000x1500px graphic pins on Canva with bold typography, gold/navy contrast, and problem-solving badges.',
        tools: ['Canva / Photoshop', 'Pinterest Pin Inspector'],
        timeframe: '10 Minutes',
        proTip: 'Always include a floating call-out badge like "Free PDF Checklist" or "Interactive 2026 Calculator".'
      },
      {
        stepNumber: 2,
        title: 'Optimize Title, Alt Text, and Description for Pinterest SEO',
        action: 'Include high-intent long-tail keywords in your Pin title and board description.',
        tools: ['Pinterest Search Bar Trends'],
        timeframe: '5 Minutes',
        proTip: 'Use conversational search queries like "How to organize real estate leads as a solo agent".'
      },
      {
        stepNumber: 3,
        title: 'Connect Direct Intent Landing Page',
        action: 'Link the pin directly to the specific guide or ROI calculator tool rather than a generic homepage.',
        tools: ['CRMsolo Directory', 'Lead Magnet Form'],
        timeframe: 'Immediate',
        proTip: 'Ensure the top H1 headline on the landing page matches the text on the Pinterest graphic pin.'
      },
      {
        stepNumber: 4,
        title: 'Lead Capture & CRM Tagging',
        action: 'When the visitor calculates their ROI or downloads the guide, auto-tag their record with #Pinterest-Inbound.',
        tools: ['Newsletter / CRM Sync'],
        timeframe: 'Automated',
        proTip: 'Send an instant email with the requested blueprint PDF plus a link to book a 15-minute consultation.'
      }
    ],
    copyableTemplates: [
      {
        title: 'Pinterest Pin Title & SEO Description Formula',
        description: 'Optimized copy format to rank in Pinterest search feed.',
        type: 'ai_prompt',
        content: `PIN TITLE:
25 CRM Automation Workflows Every Solo Real Estate Agent Needs in 2026

PIN DESCRIPTION:
Struggling to track buyer leads, open house visitors, and escrow closing deadlines? Discover the 25 essential CRM automation workflows, speed-to-lead scripts, and ROI calculator hacks for independent realtors and solo brokers. Click through to explore the free step-by-step blueprint and compare top realtor CRMs (Pipedrive, Streak, Follow Up Boss). #RealEstateCRM #RealtorTools #RealEstateMarketing #SoloAgent #Pipedrive #FollowUpBoss`
      },
      {
        title: 'Lead Magnet Delivery Email Template',
        description: 'Auto-sent when a Pinterest visitor requests the workflow guide.',
        type: 'email',
        content: `Subject: 📥 Here is your Solo Agent CRM Automation Blueprint (PDF Inside)

Hi {{firstName}},

Thanks for checking out our Real Estate CRM guide on Pinterest! 

As promised, here is your direct access link to the Complete 2026 Solo Agent Blueprint & Checklist:

👉 [Download the 2026 Real Estate CRM Blueprint PDF]

INSIDE THIS BLUEPRINT:
• 5-Minute Speed-to-Lead Webhook setup
• 7-Stage Kanban Escrow & Contingency Pipeline
• Past-Client 365-Day Homeversary Referral Engine
• Free Commission Split & ROI Calculator

If you'd like an unbiased recommendation on which CRM fits your current annual transaction volume, feel free to reply to this email!

To your closing success,
{{authorName}} | CRMsolo Editorial Team`
      }
    ],
    faq: [
      {
        q: 'How long does it take for a Pinterest pin to generate organic traffic?',
        a: 'Unlike Instagram or TikTok where posts expire in 24 hours, Pinterest pins gain compounding organic search momentum over 3 to 6 months and can drive traffic for years.'
      }
    ]
  },
  {
    id: 'homeversary-past-client-referrals',
    slug: '365-day-homeversary-client-referral-engine',
    title: 'The 365-Day Homeversary Client Referral Engine',
    tagline: 'Turn every closed deal into 2 to 3 organic sphere-of-influence referrals without awkward cold calls.',
    category: 'Client Retention',
    difficulty: 'Beginner',
    timeToDeploy: '10 Minutes',
    roiImpact: 'Generates 70%+ of solo agent repeat & referral transaction volume',
    targetCrms: ['Pipedrive', 'Follow Up Boss', 'Streak', 'Wise Agent', 'Copper'],
    summary: 'An automated past-client appreciation loop that schedules anniversary check-ins, local market equity reports, and handwritten card reminders 365 days after settlement.',
    triggerEvent: 'Deal moved to "Closed / Won" in CRM pipeline.',
    steps: [
      {
        stepNumber: 1,
        title: 'Record Closing Date & Client Preferences',
        action: 'Log exact closing date, favorite local restaurant/coffee shop, and pet names in CRM custom fields.',
        tools: ['CRM Custom Fields'],
        timeframe: 'Closing Day',
        proTip: 'Store photo of buyers in front of their new home in the CRM contact files.'
      },
      {
        stepNumber: 2,
        title: 'Automate 30-Day Settling-In Check-in',
        action: 'Trigger a warm personal SMS asking if they need recommendations for local contractors or handymen.',
        tools: ['Automated SMS'],
        timeframe: 'Day 30',
        proTip: 'Keep a curated PDF list of trusted local vendors ready to share.'
      },
      {
        stepNumber: 3,
        title: 'Mid-Year Home Equity & Assessment Review',
        action: 'Send a personalized 6-month neighborhood value estimate.',
        tools: ['CRM Email / CMA Tool'],
        timeframe: 'Day 180',
        proTip: 'Show appreciation by highlighting home appreciation in their specific subdivision.'
      },
      {
        stepNumber: 4,
        title: '365-Day Homeversary Gift & Referral Invite',
        action: 'Auto-create an agent reminder task 7 days prior to purchase anniversary to drop off a gift basket or gift card.',
        tools: ['Task Automation', 'Calendar Alert'],
        timeframe: 'Day 358 - 365',
        proTip: 'Handwritten cards yield 5x higher emotional connection than generic bulk email blasts.'
      }
    ],
    copyableTemplates: [
      {
        title: '30-Day "Settling In" Text Message',
        description: 'Low-pressure helpful touchpoint for new homeowners.',
        type: 'sms',
        content: `Hi {{firstName}}! Happy 1-month in your new home on {{streetName}}! Hope unpacking has gone smoothly. If you ever need recommendations for painters, electricians, or landscapers, just let me know. Enjoy your weekend! - {{agentName}}`
      },
      {
        title: '1-Year "Homeversary" Email with Value Update',
        description: 'Sent on the 365th day following settlement.',
        type: 'email',
        content: `Subject: 🏡 Happy 1-Year Homeversary at {{propertyAddress}}!

Hi {{firstName}},

I can't believe it has already been a full year since you got the keys to {{propertyAddress}}!

I put together a quick neighborhood equity report for your property today. Over the past 12 months, average home values in your neighborhood have increased by approximately {{equityGrowthPct}}%.

I'd love to drop by this week with a little anniversary treat to say hello. Will you be around this Thursday or Friday afternoon?

Thank you again for trusting me with your purchase, and congratulations on 1 year of homeownership!

Warmly,
{{agentName}} | {{brokerage}}
{{agentPhone}}`
      }
    ],
    faq: [
      {
        q: 'How many past clients can a solo agent maintain with this system?',
        a: 'With automated CRM task triggers, one solo agent can effortlessly maintain 200+ past client relationships with zero assistant overhead.'
      }
    ]
  },
  {
    id: 'open-house-qr-capture',
    slug: 'open-house-qr-lead-capture-segmentation',
    title: 'Open House QR Lead Capture & Rapid Segmentation',
    tagline: 'Replace paper sign-in sheets with instant digital QR registration and weekend drip segmentation.',
    category: 'Lead Generation',
    difficulty: 'Beginner',
    timeToDeploy: '10 Minutes',
    roiImpact: 'Captures 100% verified phone numbers with zero unreadable handwriting',
    targetCrms: ['Pipedrive', 'Follow Up Boss', 'Streak', 'Zoho CRM'],
    summary: 'A complete tablet/QR sign-in workflow that checks in weekend open house visitors and automatically segments them into "Active Pre-Approved Buyers" vs "Neighbor Browsers".',
    triggerEvent: 'Visitor scans QR code or completes tablet sign-in form at open house entry.',
    steps: [
      {
        stepNumber: 1,
        title: 'Frame QR Code Entry Display at Front Door',
        action: 'Display an acrylic framed QR code linked to a mobile-friendly digital sign-in page with property feature sheet PDF incentive.',
        tools: ['Canva Flyer / QR Generator'],
        timeframe: 'Open House Setup',
        proTip: 'Incentivize sign-in with: "Scan for instant floor plans and unbranded property disclosure PDF".'
      },
      {
        stepNumber: 2,
        title: 'Capture 3 Essential Qualifying Fields',
        action: 'Ask: 1) Name & Phone, 2) Are you currently represented by an agent? 3) Desired move-in timeline.',
        tools: ['CRM Form / Google Form / Typeform'],
        timeframe: 'Sign-in',
        proTip: 'Keep the form strictly under 4 total input fields to maximize completion rate.'
      },
      {
        stepNumber: 3,
        title: 'Sunday Evening Automated Follow-Up SMS',
        action: 'Send an automated text at 6:00 PM thanking them for visiting and asking for their candid feedback on price/layout.',
        tools: ['CRM SMS Campaign'],
        timeframe: 'Sunday 6:00 PM',
        proTip: 'Asking for advice on price makes buyers feel like experts and triggers instant replies.'
      }
    ],
    copyableTemplates: [
      {
        title: 'Sunday Evening Open House Feedback Text',
        description: 'Sent at 6:00 PM the day of the open house.',
        type: 'sms',
        content: `Hi {{firstName}}, thank you for stopping by the open house on {{propertyStreet}} today! We're reviewing feedback for the seller—how did the price and floor plan feel compared to other homes you've seen? - {{agentName}}`
      },
      {
        title: 'Digital Sign-In Form Schema',
        description: 'Optimal form fields for high conversion.',
        type: 'checklist',
        content: `[ ] Full Name (Required)
[ ] Cell Phone (Required for SMS delivery of floor plan)
[ ] Email Address (Required for disclosures)
[ ] Are you currently working with a dedicated buyer's agent? (Yes / No / Just started looking)
[ ] Target Move-In Timeline (0-30 days / 1-3 months / 6+ months / I live in the neighborhood)`
      }
    ],
    faq: [
      {
        q: 'What if an attendee refuses to scan the QR code?',
        a: 'Keep an iPad or tablet on the kitchen island with the sign-in web form pre-opened so they can type it in 5 seconds.'
      }
    ]
  },
  {
    id: 'ai-prompt-lead-nurture',
    slug: 'ai-prompt-formula-listing-descriptions-client-nurture',
    title: 'The Solo Realtor AI Prompt & Follow-Up Formula',
    tagline: 'High-converting Claude & Gemini prompts for MLS descriptions, objection handling, and cold buyer re-engagement.',
    category: 'Lead Generation',
    difficulty: 'Beginner',
    timeToDeploy: '5 Minutes',
    roiImpact: 'Saves 5+ weekly hours of copywriting and drafting emails',
    targetCrms: ['All CRMs', 'Gemini', 'Claude', 'ChatGPT'],
    summary: 'A curated library of structured AI prompting formulas engineered for independent realtors to write emotional MLS property descriptions, objection rebuttals, and cold lead wake-up emails.',
    triggerEvent: 'Drafting new listing marketing or reviving cold database leads.',
    steps: [
      {
        stepNumber: 1,
        title: 'Input Architectural Features & Target Buyer Persona',
        action: 'Paste home specs into our structured Master Real Estate Persona Prompt.',
        tools: ['Gemini / Claude / ChatGPT'],
        timeframe: '2 Minutes',
        proTip: 'Specify target buyer archetype (e.g. "upsizing young family with dogs" or "downsizing retiree").'
      },
      {
        stepNumber: 2,
        title: 'Generate 3 Headline & Description Variations',
        action: 'Output 1 MLS character-compliant description, 1 Instagram caption, and 1 email newsletter blurb.',
        tools: ['AI Copy Engine'],
        timeframe: '60 Seconds',
        proTip: 'Instruct the AI to ban real estate clichés like "boasts", "nestled", and "rare gem".'
      }
    ],
    copyableTemplates: [
      {
        title: 'Master MLS Listing Description Prompt',
        description: 'Copy and paste directly into Gemini / Claude / ChatGPT.',
        type: 'ai_prompt',
        content: `You are an elite luxury real estate copywriter. Write a compelling, emotion-driven MLS listing description for the following property.

PROPERTY DETAILS:
- Address / City: [Insert Address / Neighborhood]
- Price: $[Insert Price]
- Beds / Baths / SqFt: [X Beds, Y Baths, Z SqFt]
- Key Standout Features: [e.g., quartz waterfall island, screened cedar porch, finished daylight basement, primary suite on main]
- Target Buyer: [e.g., Young family needing fenced backyard, close to top elementary schools]

CONSTRAINTS:
1. Limit to under 1,000 characters for MLS compatibility.
2. BANNED CLICHÉS: Do NOT use "boasts", "nestled", "rare gem", "oasis", "must-see", or "pride of ownership".
3. Write in an active, sensory voice focusing on how daily life feels in this home.
4. Include an inviting closing call-to-action.`
      },
      {
        title: 'The 9-Word Cold Lead Wake-Up Email',
        description: 'Dean Jackson proven formula to revive leads who went silent 60+ days ago.',
        type: 'email',
        content: `Subject: {{firstName}}?

Hi {{firstName}},

Are you still looking for a home in {{cityOrNeighborhood}}?

Best,
{{agentName}}
{{agentPhone}}`
      }
    ],
    faq: [
      {
        q: 'Why does the 9-word email work so well?',
        a: 'Because it looks like a personal one-to-one message sent from a phone rather than a marketing blast. Response rates regularly exceed 50% on dormant lists.'
      }
    ]
  }
];
