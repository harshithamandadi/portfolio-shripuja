/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FAQItem, 
  ServiceItem, 
  PodcastEpisode, 
  ClassItem, 
  Testimonial, 
  ClinicSettings, 
  FutureBlogItem
} from '../types';

export const clinicSettings: ClinicSettings = {
  clinicName: "Calm Mind Wellness",
  doctorName: "Dr. Shripuja Siddamsetty",
  credentials: "Ph.D. in Clinical Psychology, M.Phil, CBT Certified",
  title: "Clinical Psychologist, Psychotherapist, and Mental Health Advocate",
  phone: "+1 (555) 321-9876",
  email: "dr.shripuja@calmmindwellness.com",
  whatsapp: "+15553219876",
  address: "Suite 410, Green Meadows Wellness Center, 88 Serenity Boulevard, Metro City",
  workingHours: {
    weekdays: "Monday – Friday: 9:00 AM – 7:00 PM",
    saturdays: "Saturday: 10:00 AM – 4:00 PM",
    sundays: "Sunday: Closed (Emergency Support Available)"
  },
  socialLinks: {
    instagram: "https://instagram.com/calmmindwellness",
    linkedin: "https://linkedin.com/in/dr-shripuja-siddamsetty",
    youtube: "https://youtube.com/calmmindwellness",
    spotify: "https://open.spotify.com/show/calmmindpodcast"
  },
  emergencyNotice: "Emergency Notice: If you are experiencing an immediate mental health crisis, suicidal thoughts, or any emergency, please call your local emergency services (911 or equivalent) or contact the 24/7 Suicide & Crisis Lifeline by dialing 988. Calm Mind Wellness is not an emergency response service."
};

export const services: ServiceItem[] = [
  {
    id: "adult-therapy",
    title: "Adult Therapy",
    category: "Individual Care",
    iconName: "User",
    shortDescription: "Personalized, evidence-based psychotherapy for anxiety, depression, burnout, and life transitions.",
    fullDescription: "Our adult therapy sessions provide a safe, confidential space where you can explore personal challenges, understand emotional blockages, and build effective coping mechanisms. Using advanced modalities like Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and Mindfulness-Based Cognitive Therapy (MBCT), we work collaboratively to help you cultivate resilience, clarity, and peace.",
    symptoms: [
      "Persistent anxiety, panic attacks, or chronic stress",
      "Overwhelming feelings of sadness, low energy, or hopelessness",
      "Professional burnout and difficulty managing work-life balance",
      "Emotional distress stemming from major life changes or trauma",
      "Low self-esteem, self-criticism, and relationship difficulties"
    ],
    benefits: [
      "Deep understand of root emotional patterns and triggers",
      "Practical tools to manage anxiety and low-mood episodes",
      "Enhanced self-compassion, emotional regulation, and self-esteem",
      "Greater sense of alignment, boundary setting, and life direction",
      "A customized, compassionate framework for long-term psychological wellness"
    ],
    duration: "50-minute individual session",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "What should I expect in our first session?",
        answer: "The initial session is a compassionate intake and assessment. We will discuss what brings you to therapy, look into your emotional history, establish key trust parameters, and collaboratively map out gentle, personalized therapy goals."
      },
      {
        question: "How long will I need to be in therapy?",
        answer: "Every clinical journey is unique. Some individuals benefit immensely from short-term focus therapy (8-12 sessions), while others prefer long-term, exploratory support. We regularly check in on progress to see what feels right for you."
      }
    ]
  },
  {
    id: "child-psychology",
    title: "Child Psychology",
    category: "Pediatric & Family Care",
    iconName: "Baby1",
    shortDescription: "Specialized, warm support for developmental, emotional, and behavioral challenges in young children.",
    fullDescription: "Childhood is a phase of rapid development, and children often communicate their emotional struggles through behavior rather than words. Dr. Shripuja offers specialized play therapy, behavior management, and emotional regulation guidance in a welcoming, low-stimulus environment, collaborating closely with parents to support the child's psychological development.",
    symptoms: [
      "Severe separation anxiety or persistent refusal to attend school",
      "Unusual behavioral regressions (e.g., bedwetting, thumb-sucking)",
      "Frequent, intense emotional meltdowns or sudden aggression",
      "Difficulty processing grief, divorce, or relocation",
      "Withdrawing from family activities or favorite hobbies"
    ],
    benefits: [
      "A safe, playful environment where the child can express non-verbal worries",
      "Improved emotional vocabulary and age-appropriate coping skills",
      "Stronger parent-child attachment, communication, and home harmony",
      "A tailored behavioral map to ease transition and anxiety points",
      "Restored confidence and healthy social interaction habits"
    ],
    duration: "45-minute child session + 15-minute parent debrief",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "How involved are parents in child therapy sessions?",
        answer: "Parental involvement is essential for successful childhood outcomes. We typically structure our sessions to spend time with the child individually, followed by a dedicated feedback and strategy discussion with you."
      },
      {
        question: "How do you explain therapy to a young child?",
        answer: "We recommend framing it as visiting a 'feelings and play coach'—a safe friend who helps kids understand strong emotions, worry-bubbles, and big changes through games, arts, and play."
      }
    ]
  },
  {
    id: "teen-counselling",
    title: "Teen Counselling",
    category: "Youth Support",
    iconName: "Sparkles",
    shortDescription: "Empathetic guidance for teenagers navigating identity, academic pressure, social anxiety, and emotional transitions.",
    fullDescription: "Adolescence is a time of immense neurological and social transition. Teenagers require an empathetic, non-judgmental confidant who understands their world. We address issues of academic stress, self-esteem, digital burnout, peer pressure, and mood swings. By treating teenagers with deep respect, we empower them to understand their minds and build solid emotional foundations.",
    symptoms: [
      "Intense school-related stress, perfectionism, or academic panic",
      "Social isolation, excessive screen-time withdrawal, or bullying issues",
      "Body image concerns, self-doubt, or intense mood fluctuations",
      "Difficulties communicating with parents or authority figures",
      "Struggles with identity, belonging, or low self-worth"
    ],
    benefits: [
      "An authentic, non-judgmental space to vent and unpack stress",
      "Greater self-identity clarity and confidence in dealing with social changes",
      "Healthy stress-management and screen-time boundary tools",
      "Restored lines of communication with family and peers",
      "A sense of self-agency and ownership over their emotional journey"
    ],
    duration: "50-minute adolescent session",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "Will what my teenager shares with you be kept confidential?",
        answer: "Yes. Confidentiality is legally and therapeutically crucial to establishing a teen's trust. However, we explicitly state that we will break confidentiality immediately and involve parents if there are safety concerns or self-harm risks."
      },
      {
        question: "What if my teenager is resistant to attending therapy?",
        answer: "This is very common. We suggest inviting them to try just one 'consultation check-in' with no obligation, ensuring they know they are active decision-makers in their therapy process."
      }
    ]
  },
  {
    id: "marriage-counselling",
    title: "Marriage Counselling",
    category: "Relationship Wellness",
    iconName: "Heart",
    shortDescription: "A constructive, collaborative space for couples to repair communication, rebuild intimacy, and navigate conflicts.",
    fullDescription: "Relationships are living systems that require intentional nurturing. Through research-backed Gottman Method and Emotionally Focused Therapy (EFT), we help couples identify toxic communication patterns (like criticism or stonewalling) and transition into constructive dialogues. We work to uncover underlying needs, foster safety, and restore genuine loving connection.",
    symptoms: [
      "Frequent, repetitive arguments that lead to emotional exhaustion",
      "Loss of intimacy, physical connection, or affectionate communication",
      "Betrayal of trust, infidelity, or emotional distance",
      "Feeling disconnected, lonely, or unheard within the partnership",
      "Disagreements regarding financial management, parenting, or extended family"
    ],
    benefits: [
      "Clear understanding of negative interaction loops and how to halt them",
      "Re-established mutual trust, active listening, and emotional vulnerability",
      "Collaborative techniques to resolve conflict calmly and respectfully",
      "Deepened affection, passion, and shared relational meaning",
      "Healthy boundary setting and aligned long-term relationship expectations"
    ],
    duration: "75-minute couples session",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "What if my partner refuses to join marriage counselling?",
        answer: "If your partner is hesitant, you can start with individual relationship therapy. Working on your own responses and boundaries can still exert a powerful positive influence on your relationship's system."
      },
      {
        question: "How long does relationship counseling typically take?",
        answer: "Couples counseling is highly intensive. Most couples experience significant breakthroughs within 12 to 20 weekly sessions, though we customize frequency based on the relationship's immediate healing trajectory."
      }
    ]
  },
  {
    id: "family-therapy",
    title: "Family Therapy",
    category: "Systemic Care",
    iconName: "Users",
    shortDescription: "Strengthening communication, breaking toxic cycles, and healing together as a unified family unit.",
    fullDescription: "When one person in a family is struggling, the entire family feels the impact. Family therapy addresses systemic relational dynamics, helping parents, siblings, and extended family members understand intergenerational patterns, resolve historical conflicts, establish clear boundaries, and build a supportive environment for collective healing.",
    symptoms: [
      "Chronic tension or severe hostility between family members",
      "Struggles adapting to blended family dynamics or major life shifts",
      "Intergenerational clashes, cultural adjustments, or parenting differences",
      "A family member suffering from a chronic mental or physical illness",
      "Disrupted communication causing a sense of division or loneliness"
    ],
    benefits: [
      "Open, honest, and respectful communication across all generations",
      "A balanced family system where everyone feels heard and valued",
      "Shared coping plans for periods of high stress or collective trauma",
      "Establishment of supportive boundaries and fair family agreements",
      "Healing of historical divisions and deep behavioral cycles"
    ],
    duration: "75-minute family unit session",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "Do all family members have to attend?",
        answer: "Not necessarily. We can begin with those who are willing to attend and adjust the roster as therapy progresses. The presence of key family members is highly beneficial, but systemic positive changes can start with any willing subset."
      },
      {
        question: "How do you manage heated arguments during a family session?",
        answer: "As trained system therapists, we establish firm ground rules of respect before we begin. We act as objective, compassionate mediators, pausing escalations to help participants understand the deeper feelings behind their anger."
      }
    ]
  },
  {
    id: "career-counselling",
    title: "Career Counselling",
    category: "Professional Growth",
    iconName: "Compass",
    shortDescription: "Aligning professional paths with personal values, managing occupational identity, and navigating transition points.",
    fullDescription: "Our professional lives are deeply intertwined with our mental health. Career counseling at Calm Mind Wellness is a psychological exploration of your professional identity. We evaluate your core strengths, personal values, and anxiety triggers to help you navigate executive burnout, tackle imposter syndrome, design career pivots, and establish meaningful boundaries.",
    symptoms: [
      "Extreme dread or anxiety surrounding your daily work life",
      "Chronic executive burnout and feeling empty or detached from achievements",
      "Imposter syndrome undermining your leadership or job success",
      "Feeling deeply stuck, unfulfilled, or confused about career pivots",
      "Severe anxiety surrounding professional transitions, layoffs, or promotions"
    ],
    benefits: [
      "A detailed psychological assessment of your strengths, values, and styles",
      "A personalized mental road map for professional transitions",
      "Evidence-based boundary strategies to protect against executive burnout",
      "Enhanced confidence, emotional resilience, and public speaking ease",
      "Constructive tools to master imposter syndrome and cultivate job alignment"
    ],
    duration: "50-minute vocational clarity session",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "Is this just resume writing and job searching?",
        answer: "No, this is deep identity and psychological alignment work. We focus on the inner mindset, addressing imposter syndrome, burnout, values, and emotional readiness for professional growth and healthy boundary setting."
      },
      {
        question: "Who can benefit from career psychology?",
        answer: "We support early-career professionals feeling lost, mid-career executives experiencing profound burnout, and senior leaders seeking to align their influence with personal meaning and wellness."
      }
    ]
  },
  {
    id: "corporate-wellness",
    title: "Corporate Wellness",
    category: "Institutional Wellness",
    iconName: "Briefcase",
    shortDescription: "Transforming workplace culture through executive coaching, group resilience workshops, and systemic audits.",
    fullDescription: "Healthy organizations are built on healthy people. Dr. Shripuja partners with corporate teams, educational institutions, and healthcare systems to implement comprehensive organizational mental health plans. We deliver expert seminars, mindfulness-in-action retreats, leadership coaching, and post-crisis psychological support to cultivate safety and top-tier resilience.",
    symptoms: [
      "High absenteeism, employee attrition, and low workforce morale",
      "A workplace culture characterized by chronic stress or silent dread",
      "Difficulty managing psychological safety and team conflict",
      "Inadequate support systems for staff during corporate restructuring",
      "Organizational-wide burnout or loss of professional motivation"
    ],
    benefits: [
      "A scientifically grounded, empathetic organizational wellness audit",
      "Reduced employee burnout and enhanced team psychological safety",
      "Interactive, practical stress-management tools for all tiers",
      "Empathetic, values-driven leadership coaching",
      "Demonstrated commitment to a healthy, supportive, and modern workplace"
    ],
    duration: "Tailored institutional programs",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "Do you offer custom tailored packages for companies?",
        answer: "Absolutely. We conduct an initial consultation to audit your organization's unique challenges, designing custom workshops, leadership coaching structures, or regular group support plans."
      },
      {
        question: "Can workshops be delivered remotely?",
        answer: "Yes, we provide fully engaging digital seminars and virtual group mindfulness circles, alongside our premium, highly immersive on-site corporate programs."
      }
    ]
  },
  {
    id: "psychological-assessments",
    title: "Psychological Assessments",
    category: "Diagnostic & Insights",
    iconName: "ClipboardCheck",
    shortDescription: "Comprehensive, scientifically validated diagnostic testing for ADHD, learning differences, personality, and clinical conditions.",
    fullDescription: "A clear diagnosis is often the key to unlocking the right support. We perform structured, highly objective psychological and neurodevelopmental testing for adults and youngsters. Using standardized tools, we evaluate cognitive performance, executive functioning, diagnostic symptoms, and personality architectures to compile comprehensive reports with actionable clinical recommendations.",
    symptoms: [
      "Suspected ADHD or executive function struggles in work/school",
      "Potential learning differences (dyslexia, dyscalculia) in children",
      "Unclear, complicated diagnostic history for emotional issues",
      "Academic accommodation support requests",
      "A deep, personal desire for clinical self-understanding"
    ],
    benefits: [
      "Scientifically verified diagnostic clarity regarding symptoms",
      "A comprehensive, highly detailed assessment report (20-30 pages)",
      "Clear, actionable blueprints for therapeutic or school accommodation",
      "Personalized, warm feedback sessions explaining all metrics simply",
      "A solid basis for coordinating psychiatric or pedagogical support"
    ],
    duration: "Varies (Includes intake, testing, and feedback sessions)",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200",
    faqs: [
      {
        question: "What tests are included in an assessment?",
        answer: "We select tests specifically based on your assessment goals. This typically includes standardized rating scales, cognitive diagnostics (e.g., WAIS), computerized attention tracking, structured personality indexes, and in-depth clinical interviews."
      },
      {
        question: "How long does it take to receive the final diagnostic report?",
        answer: "Following the final testing session, scoring, analysis, and report writing takes approximately 2 to 3 weeks. We then hold an extensive, compassionate 60-minute feedback session to explain all findings and recommendations."
      }
    ]
  }
];

export const podcasts: PodcastEpisode[] = [
  {
    id: "pod-1",
    title: "Understanding High-Functioning Anxiety",
    episodeNumber: "Episode 42",
    duration: "34 mins",
    date: "July 2, 2026",
    category: "Anxiety",
    description: "In this episode, Dr. Shripuja Siddamsetty breaks down the silent struggle of high-functioning anxiety. Learn why high achievers are prone to this, how to spot the signs beneath professional success, and evidence-based self-regulation techniques to find calm without sacrificing your drive.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder1",
    youtubeUrl: "https://youtube.com/watch?v=placeholder1",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder1",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pod-2",
    title: "The Art of Constructive Boundaries",
    episodeNumber: "Episode 41",
    duration: "28 mins",
    date: "June 18, 2026",
    category: "Relationships",
    description: "Setting boundaries is often associated with pushing people away. Dr. Shripuja redefines boundaries as emotional invitations to healthy intimacy. She discusses parent-adult child boundaries, romantic guidelines, and how to assertively say 'no' without consuming guilt.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder2",
    youtubeUrl: "https://youtube.com/watch?v=placeholder2",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder2",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pod-3",
    title: "Neuroplasticity and Healing from Burnout",
    episodeNumber: "Episode 40",
    duration: "42 mins",
    date: "June 4, 2026",
    category: "Neuroscience",
    description: "Chronic stress physically alters the brain's pathways. The good news? Our brains remain highly neuroplastic throughout our lives. Discover the exact neuroscience behind executive burnout and the daily, five-minute cognitive habits that trigger structural brain healing and restoration.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder3",
    youtubeUrl: "https://youtube.com/watch?v=placeholder3",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder3",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pod-4",
    title: "Empathetic Parenting in a Digital Era",
    episodeNumber: "Episode 39",
    duration: "31 mins",
    date: "May 21, 2026",
    category: "Parenting",
    description: "How does high screen exposure affect a child's emotional regulation? Dr. Shripuja shares practical parenting insights for dealing with digital overload. Learn how to foster genuine emotional connection, establish healthy device limits, and model digital wellness at home.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder4",
    youtubeUrl: "https://youtube.com/watch?v=placeholder4",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder4",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pod-5",
    title: "Overcoming the Imposter Within",
    episodeNumber: "Episode 38",
    duration: "25 mins",
    date: "May 7, 2026",
    category: "Self-Growth",
    description: "Even highly successful CEOs and doctors frequently feel like frauds. In this deep dive, Dr. Shripuja examines the social and psychological roots of Imposter Syndrome, providing a 4-step mindfulness checklist to dismantle negative self-narratives.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder5",
    youtubeUrl: "https://youtube.com/watch?v=placeholder5",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder5",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "pod-6",
    title: "The Emotional Toll of Career Pivots",
    episodeNumber: "Episode 37",
    duration: "37 mins",
    date: "April 23, 2026",
    category: "Self-Growth",
    description: "Changing industries or starting a business can trigger intense existential doubt and panic. Dr. Shripuja details how to separate your human identity from your professional title, navigating career pivots with self-compassion and psychological stability.",
    spotifyUrl: "https://open.spotify.com/episode/placeholder6",
    youtubeUrl: "https://youtube.com/watch?v=placeholder6",
    appleUrl: "https://podcasts.apple.com/us/podcast/placeholder6",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"
  }
];

export const classes: ClassItem[] = [
  {
    id: "class-1",
    title: "Mindfulness-Based Stress Reduction (MBSR) Masterclass",
    category: "Mindfulness",
    description: "A transformative 6-week immersive experience. Learn formal sitting meditation, somatic scanning, conscious breathing, and gentle yoga designed to down-regulate the sympathetic nervous system and reduce cortisol production.",
    date: "August 15, 2026",
    time: "6:00 PM – 7:30 PM EST",
    duration: "6 Weeks (Every Saturday)",
    instructor: "Dr. Shripuja Siddamsetty",
    capacity: 25,
    registeredCount: 19,
    fee: "$299 (Includes study workbook, meditation guides, & community forum)",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    countdownTarget: "2026-08-15T18:00:00"
  },
  {
    id: "class-2",
    title: "Empathetic Connection: Modern Parenting Workshop",
    category: "Parenting",
    description: "An intensive weekend workshop for parents of kids and teens. Gain clinical insight into adolescent neurodevelopment, master conflict de-escalation, and acquire active communication blueprints that bridge generational gaps.",
    date: "September 12, 2026",
    time: "10:00 AM – 3:00 PM EST",
    duration: "2-Day Weekend Intensive",
    instructor: "Dr. Shripuja Siddamsetty",
    capacity: 35,
    registeredCount: 31,
    fee: "$180 (Includes parental templates, digital resources & workbook)",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    countdownTarget: "2026-09-12T10:00:00"
  },
  {
    id: "class-3",
    title: "Corporate Resilience & Calm Under Pressure",
    category: "Corporate Training",
    description: "Specifically designed for corporate leaders, executives, and high-pressure professionals. Learn rapid 3-minute biological stress-halting routines, professional boundary framing, and emotional triage for complex workplace conflicts.",
    date: "October 05, 2026",
    time: "9:00 AM – 1:00 PM EST",
    duration: "Half-Day Interactive Workshop",
    instructor: "Dr. Shripuja Siddamsetty",
    capacity: 50,
    registeredCount: 22,
    fee: "$150 per seat (Corporate group booking rates available)",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    countdownTarget: "2026-10-05T09:00:00"
  },
  {
    id: "class-4",
    title: "Overcoming Anxiety & Panic: Somatic & Cognitive Toolkit",
    category: "Stress Management",
    description: "A compassionate, deeply safe group workshop focusing on the physiological engine of anxiety. Acquire somatic grounding protocols to defuse impending panic attacks, combined with cognitive restructuring maps.",
    date: "October 24, 2026",
    time: "4:00 PM – 6:30 PM EST",
    duration: "Single Session (2.5 Hours)",
    instructor: "Dr. Shripuja Siddamsetty",
    capacity: 20,
    registeredCount: 8,
    fee: "$75 (Includes emergency somatic panic cards & journal sheets)",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
    countdownTarget: "2026-10-24T16:00:00"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    quote: "Dr. Shripuja changed my life. I was trapped in an endless loop of severe high-functioning anxiety and corporate burnout. Her clinical depth, combined with her incredibly soothing presence, gave me both the space to heal and the exact tools to reclaim my life.",
    author: "Elena Vasquez",
    role: "Senior VP of Product",
    service: "Adult Therapy & Career Counselling",
    rating: 5
  },
  {
    id: "test-2",
    quote: "Our marriage was on the verge of breakdown. Dr. Shripuja mediated our pain with extraordinary grace. She did not take sides; instead, she helped us understand the relational system we had built and guided us to rebuild genuine trust, safety, and deep affection.",
    author: "Mark & Sarah K.",
    role: "Married Couples",
    service: "Marriage Counselling",
    rating: 5
  },
  {
    id: "test-3",
    quote: "As a parent, seeing your child struggle with intense school anxiety and meltdowns is heartbreaking. Dr. Shripuja's play therapy approach was miraculous. My daughter went from dreading school to expressing her worries calmly. We are forever grateful.",
    author: "Jonathan Mercer",
    role: "Parent of 8-year-old Lily",
    service: "Child Psychology",
    rating: 5
  },
  {
    id: "test-4",
    quote: "The diagnostic assessment was an eye-opener. At age 34, finally understanding my neurodivergence (ADHD) with such detailed, supportive feedback removed years of silent self-blame. The report was incredibly thorough and helped me secure work accommodations.",
    author: "Rohan Nair",
    role: "Software Architect",
    service: "Psychological Assessments",
    rating: 5
  }
];

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do you offer online virtual sessions (Telehealth)?",
    answer: "Yes, we offer fully secure, HIPAA-compliant online psychotherapy video sessions for adults, couples, and organizations. This allows you to receive expert care from the absolute comfort and privacy of your preferred space.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "How do I know if therapy is right for me?",
    answer: "Therapy is beneficial for anyone experiencing distress, seeking deeper self-understanding, navigating transitions, or wanting to break unhealthy life cycles. You don't need a severe diagnosis to seek support—simply wanting to improve your mental well-being is a perfect reason to begin.",
    category: "General"
  },
  {
    id: "faq-3",
    question: "Do you accept health insurance?",
    answer: "We operate as an out-of-network provider. This ensures maximum confidentiality, as we are not required to share your private therapeutic diagnosis with insurance adjusters. We provide detailed clinical super-bills (receipts) which you can easily submit to your insurance company for potential out-of-network reimbursement.",
    category: "Billing"
  },
  {
    id: "faq-4",
    question: "What is your appointment cancellation policy?",
    answer: "We maintain a strict 24-hour cancellation policy. Since appointment slots are dedicated exclusively to you, cancellations or rescheduling requests made with less than 24 hours' notice will incur the full session fee.",
    category: "Booking"
  },
  {
    id: "faq-5",
    question: "Is everything I share in therapy strictly confidential?",
    answer: "Absolutely. Confidentiality is the cornerstone of effective psychological care. Your records and details are protected under legal and ethical medical standards. The only exceptions occur if there is an immediate risk of harm to yourself or others, or under explicit court order, which we discuss in detail during our intake.",
    category: "Privacy"
  }
];

export const futureBlogs: FutureBlogItem[] = [
  {
    id: "blog-1",
    title: "Dismantling Cognitive Distortions: The CBT Guide",
    excerpt: "Learn how to spot and challenge 'mind reading', 'catastrophizing', and other subtle emotional traps our brains construct.",
    content: "Our brains are magnificent storytelling machines. However, during high anxiety or stress, they frequently fall back on defensive, irrational thought cycles known as cognitive distortions. In this post, we explore the most common distortions—such as 'black-and-white thinking' and 'fortune telling'—and outline simple, evidence-based Cognitive Behavioral journaling exercises to challenge these narratives and restore reality-based peace.",
    date: "July 8, 2026",
    author: "Dr. Shripuja Siddamsetty",
    category: "Cognitive Health",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
    readTime: "6 mins read"
  },
  {
    id: "blog-2",
    title: "Somatic Grounding for High-Stress Moments",
    excerpt: "A somatic guide explaining how physical sensory checkpoints can instantly switch off your body's survival response.",
    content: "When anxiety triggers a rapid heartbeat, trying to 'think your way out' is highly ineffective because your cognitive prefrontal cortex is offline. You must communicate safety directly to your brain via your body's nervous system. This somatic guide teaches you the science of the vagus nerve and walks you through five instant physical anchoring strategies—including 4-7-8 box breathing and temperature shock resets—to quiet hyperarousal in under two minutes.",
    date: "June 25, 2026",
    author: "Dr. Shripuja Siddamsetty",
    category: "Somatic Therapy",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    readTime: "5 mins read"
  },
  {
    id: "blog-3",
    title: "Fostering Self-Compassion in High-Pressure Roles",
    excerpt: "Why treating yourself with clinical kindness is the ultimate secret weapon for sustainable high-level achievements.",
    content: "High-pressure professionals often hold a deep-seated belief that self-criticism is the sole driver of their achievements. However, clinical research proves that intense self-criticism triggers the body's threat defense system, increasing cortisol and ultimately degrading cognitive execution. We explore Dr. Kristin Neff's model of Self-Compassion, showing how self-kindness, mindfulness, and a sense of common humanity actually boost professional endurance and leadership resilience.",
    date: "May 14, 2026",
    author: "Dr. Shripuja Siddamsetty",
    category: "Resilience",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600",
    readTime: "8 mins read"
  }
];
