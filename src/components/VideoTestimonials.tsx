import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, X, Star, CheckCircle, Award, Video, Sparkles, 
  Filter, Clock, Quote, ArrowUpRight, Mic, RotateCcw, 
  Volume2, VolumeX, Tv, Radio, Activity, Volume1, ChevronRight, MessageSquareText
} from 'lucide-react';

export interface VideoTestimonial {
  id: string;
  agentName: string;
  role: string;
  brokerage: string;
  location: string;
  avatarUrl: string;
  thumbnailUrl: string;
  videoUrl: string;
  youtubeId: string;
  videoDuration: string;
  crmUsed: 'Pipedrive' | 'Streak' | 'Follow Up Boss';
  crmLogoText: string;
  crmColor: string;
  keyMetric: string;
  title: string;
  quote: string;
  transcript: string;
  videoAspect: string;
  rating: number;
}

const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'vid-pipedrive-1',
    agentName: "Rachel Torres",
    role: "Solo Residential Specialist",
    brokerage: "eXp Realty",
    location: "Austin, TX",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    youtubeId: "LXb3EKWsInQ",
    videoDuration: "1:45",
    crmUsed: "Pipedrive",
    crmLogoText: "Pipedrive",
    crmColor: "bg-emerald-600 text-white",
    keyMetric: "+40% Lead Response Speed",
    title: "How I Closed 18 Deals as a Solo Agent Using Pipedrive Pipelines",
    quote: "Pipedrive's visual drag-and-drop deal board turned my listing chaotic pipeline into predictable closed commission checks. I know exactly where every buyer stands.",
    transcript: "Hey everyone, I'm Rachel Torres out of Austin. When I went independent 2 years ago, my biggest fear was losing track of prospective sellers during busy weekends. I tested 4 different systems before sticking with Pipedrive. The mobile app lets me move escrows along right from my car after showings. Having custom real estate stages—like Inspection Period, Appraisal Contingency, and Clear to Close—keeps me 100% accountable. If you're a solo agent who wants simplicity without bloated code, Pipedrive is my absolute #1 recommendation.",
    videoAspect: "aspect-video",
    rating: 5.0
  },
  {
    id: 'vid-streak-1',
    agentName: "David Vance",
    role: "Independent Broker-Owner",
    brokerage: "Vance Coastal Properties",
    location: "Miami, FL",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    thumbnailUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    youtubeId: "M7lc1UVf-VE",
    videoDuration: "2:10",
    crmUsed: "Streak",
    crmLogoText: "Streak for Gmail",
    crmColor: "bg-amber-500 text-slate-950",
    keyMetric: "Saved 6 Hours/Week in Email",
    title: "Why I Never Leave My Gmail Inbox: Streak CRM Breakdown",
    quote: "Streak lives directly inside Google Workspace. I don't need a secondary tab open. Email snippets, deal pipelines, and client logs are right where my emails land.",
    transcript: "What's up realtors! David Vance here. For years I paid $150/month for a giant CRM platform that I only used for email logging. When I found Streak, it was like a lightbulb went off. Because it builds pipelines directly into Gmail on Chrome, every email thread with lenders, title companies, and clients gets categorized automatically. Snippets save me at least an hour every day answering repetitive buyer questions. For solo agents who love Google Workspace, it's unbeatable.",
    videoAspect: "aspect-video",
    rating: 5.0
  },
  {
    id: 'vid-fub-1',
    agentName: "Jessica Lin",
    role: "High-Volume Buyer Facilitator",
    brokerage: "Keller Williams Premier",
    location: "Denver, CO",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    thumbnailUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    youtubeId: "dQw4w9WgXcQ",
    videoDuration: "1:58",
    crmUsed: "Follow Up Boss",
    crmLogoText: "Follow Up Boss",
    crmColor: "bg-blue-600 text-white",
    keyMetric: "35% Increase in Zillow Conversion",
    title: "Instant Speed-to-Lead: Follow Up Boss Lead Routing Video Case Study",
    quote: "If a lead registers on Zillow or Realtor.com at 9 PM, Follow Up Boss texts them back instantly with a personalized greeting before competitors even wake up.",
    transcript: "Hi guys, Jessica Lin here. In real estate, the first agent to respond wins 70% of the time. Before Follow Up Boss, I was manually checking my email for portal notifications and losing hot leads. FUB aggregates all my incoming lead sources into one central dashboard and kicks off automated SMS/email sequences immediately. My lead-to-appointment conversion skyrocketed by 35% in my first quarter. It pays for itself tenfold every month.",
    videoAspect: "aspect-video",
    rating: 4.9
  },
  {
    id: 'vid-pipedrive-2',
    agentName: "Marcus Sterling",
    role: "Luxury Property Advisor",
    brokerage: "Sotheby's International Realty",
    location: "Los Angeles, CA",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    thumbnailUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoywatches.mp4",
    youtubeId: "tgbNymZ7vqY",
    videoDuration: "2:30",
    crmUsed: "Pipedrive",
    crmLogoText: "Pipedrive Luxury",
    crmColor: "bg-emerald-600 text-white",
    keyMetric: "$14M Closed Production in 2025",
    title: "Managing High-Net-Worth Seller Relationships with Zero Friction",
    quote: "Pipedrive allows me to set high-priority activity reminders so I never miss a anniversary check-in or VIP seller follow-up.",
    transcript: "Greetings luxury colleagues! Marcus Sterling here from LA. In high-end real estate, relationships are everything. High-net-worth clients demand white-glove communication. With Pipedrive's activity scheduler and custom data fields, I track client preferences, past property sales, and specific buyer criteria seamlessly. The interface is clean, elegant, and lightning-fast.",
    videoAspect: "aspect-video",
    rating: 5.0
  }
];

export default function VideoTestimonials() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pipedrive' | 'Streak' | 'Follow Up Boss'>('All');
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  
  // Voice Speech Player States
  const [playerTab, setPlayerTab] = useState<'ai-voice' | 'youtube'>('ai-voice');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number>(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const currentWordRef = useRef<HTMLSpanElement | null>(null);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0) {
          // Prefer English voices
          const englishVoice = availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
          setSelectedVoice(englishVoice);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech when modal closes or activeVideo changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordCharIndex(0);
    }
  }, [activeVideo]);

  const filteredTestimonials = VIDEO_TESTIMONIALS.filter(v => {
    if (selectedFilter === 'All') return true;
    return v.crmUsed === selectedFilter;
  });

  const handleOpenModal = (testimonial: VideoTestimonial) => {
    setActiveVideo(testimonial);
    setPlayerTab('ai-voice');
    setCurrentWordCharIndex(0);
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleCloseModal = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveVideo(null);
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Start Speech Narration for Transcript
  const speakTranscript = (fromCharIndex: number = 0) => {
    if (!activeVideo || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const textToSpeak = activeVideo.transcript.slice(fromCharIndex);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const absoluteIndex = fromCharIndex + event.charIndex;
        setCurrentWordCharIndex(absoluteIndex);

        // Auto-scroll transcript container to active word
        if (currentWordRef.current && transcriptContainerRef.current) {
          currentWordRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordCharIndex(activeVideo.transcript.length);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlayPauseSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speakTranscript(0);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordCharIndex(0);
    }
  };

  const handleSeekChar = (charIndex: number) => {
    setCurrentWordCharIndex(charIndex);
    speakTranscript(charIndex);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isSpeaking) {
      // Re-trigger speech at current char index to apply volume change
      speakTranscript(currentWordCharIndex);
    }
  };

  // Helper to render interactive word-highlighted transcript text
  const renderHighlightedTranscript = (transcript: string) => {
    const words = transcript.split(/(\s+)/); // Keep whitespace delimiters
    let charCounter = 0;

    return words.map((word, index) => {
      const startChar = charCounter;
      charCounter += word.length;
      const endChar = charCounter;

      const isSpace = /^\s+$/.test(word);
      if (isSpace) return <span key={index}>{word}</span>;

      const isActive = currentWordCharIndex >= startChar && currentWordCharIndex < endChar;

      return (
        <span
          key={index}
          ref={isActive ? currentWordRef : null}
          onClick={() => handleSeekChar(startChar)}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-200 ${
            isActive
              ? 'bg-accent text-slate-950 font-black shadow-md scale-105 inline-block'
              : startChar < currentWordCharIndex
              ? 'text-white font-medium hover:bg-slate-800'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
          title="Click to jump voice audio to this position"
        >
          {word}
        </span>
      );
    });
  };

  return (
    <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xs">
              <Video className="w-3.5 h-3.5" />
              Verified Agent Video &amp; Voice Reviews
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tighter text-white">
              Watch &amp; Listen to Real Realtors Share Their Workflows
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Listen to AI-narrated transcript speech in real-time or watch unedited video walkthroughs from top solo agents and independent brokers.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter CRM:
            </span>
            {(['All', 'Pipedrive', 'Streak', 'Follow Up Boss'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xs text-xs font-bold transition cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-accent text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800/80 border border-slate-700/80 hover:border-accent/60 rounded-xs overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Thumbnail Container */}
              <div 
                className="relative aspect-video overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => handleOpenModal(testimonial)}
              >
                <img 
                  src={testimonial.thumbnailUrl} 
                  alt={testimonial.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%231e293b"/><text x="50%" y="50%" fill="%2394a3b8" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">CRM Video Review</text></svg>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-slate-950/90 text-white font-mono text-[10px] px-2 py-0.5 rounded-xs border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" /> {testimonial.videoDuration}
                </span>

                {/* CRM Badge */}
                <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs ${testimonial.crmColor}`}>
                  {testimonial.crmUsed}
                </span>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  </div>
                </div>

                {/* Voice Review Indicator */}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs text-accent border border-accent/40 px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold flex items-center gap-1">
                  <Mic className="w-3 h-3 text-accent animate-pulse" /> Voice Review Available
                </div>

                {/* Key Metric Banner */}
                <div className="absolute bottom-3 left-3 right-16">
                  <span className="text-[10px] font-mono font-bold text-accent bg-slate-950/80 px-2 py-0.5 rounded-xs border border-accent/30 inline-block truncate max-w-full">
                    🔥 {testimonial.keyMetric}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent" />
                    ))}
                    <span className="text-[10px] font-mono text-slate-400 ml-1">5.0</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-accent transition">
                    {testimonial.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Agent Profile Footer */}
                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatarUrl} 
                      alt={testimonial.agentName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-600 bg-slate-800" 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%23334155"/><text x="50%" y="50%" fill="%23cbd5e1" font-family="sans-serif" font-size="32" text-anchor="middle" dominant-baseline="middle">👤</text></svg>';
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        {testimonial.agentName}
                        <CheckCircle className="w-3 h-3 text-accent fill-accent/20" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        {testimonial.brokerage} &middot; {testimonial.location}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenModal(testimonial)}
                    className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-accent rounded-xs transition cursor-pointer"
                    aria-label="Watch video"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video & Voice Player Modal */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-xs overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[92vh] my-auto"
              >
                {/* Modal Header */}
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shrink-0 ${activeVideo.crmColor}`}>
                      {activeVideo.crmUsed}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate max-w-md sm:max-w-lg">
                      {activeVideo.title}
                    </h3>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-800 p-1 rounded-xs flex items-center gap-1 border border-slate-700">
                      <button
                        onClick={() => {
                          setPlayerTab('ai-voice');
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-xs transition flex items-center gap-1.5 cursor-pointer ${
                          playerTab === 'ai-voice'
                            ? 'bg-accent text-slate-950 font-black shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Interactive Voice Review</span>
                      </button>

                      <button
                        onClick={() => {
                          handleStopSpeech();
                          setPlayerTab('youtube');
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-xs transition flex items-center gap-1.5 cursor-pointer ${
                          playerTab === 'youtube'
                            ? 'bg-accent text-slate-950 font-black shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>YouTube Stream</span>
                      </button>
                    </div>

                    <button 
                      onClick={handleCloseModal}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xs transition cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Player Screen Area */}
                {playerTab === 'ai-voice' ? (
                  /* AI Voice Studio Player Screen */
                  <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-6 overflow-hidden border-b border-slate-800">
                    {/* Background Agent Photo Glow */}
                    <div className="absolute inset-0 opacity-25 mix-blend-overlay">
                      <img src={activeVideo.thumbnailUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90 pointer-events-none"></div>

                    {/* Top Studio Bar */}
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 rounded-xs border border-slate-700/80 backdrop-blur-md">
                        <div className="relative">
                          <img src={activeVideo.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-accent/40" alt={activeVideo.agentName} referrerPolicy="no-referrer" />
                          {isSpeaking && !isPaused && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping"></span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {activeVideo.agentName}
                            <CheckCircle className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <div className="text-[10px] text-accent font-mono font-bold">
                            {activeVideo.keyMetric} &middot; {activeVideo.brokerage}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-accent/20 border border-accent/40 text-accent font-black px-2.5 py-1 rounded-xs uppercase flex items-center gap-1">
                          <Radio className="w-3 h-3 animate-pulse" />
                          Verified Real-Time Voice Engine
                        </span>
                      </div>
                    </div>

                    {/* Center Voice Avatar & Equalizer Visualizer */}
                    <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-4 py-4">
                      <div className="relative cursor-pointer group" onClick={handleTogglePlayPauseSpeech}>
                        {/* Outer Pulsing Voice Rings */}
                        <div className={`absolute -inset-4 rounded-full bg-accent/20 transition-all duration-500 ${isSpeaking && !isPaused ? 'animate-ping opacity-75' : 'opacity-0'}`}></div>
                        <div className={`absolute -inset-8 rounded-full bg-primary/20 transition-all duration-700 ${isSpeaking && !isPaused ? 'animate-pulse opacity-50' : 'opacity-0'}`}></div>

                        <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-accent text-slate-950 flex items-center justify-center shadow-2xl overflow-hidden relative group-hover:scale-105 transition">
                          <img src={activeVideo.avatarUrl} alt={activeVideo.agentName} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isSpeaking && !isPaused ? (
                              <Pause className="w-8 h-8 fill-accent text-accent" />
                            ) : (
                              <Play className="w-8 h-8 fill-accent text-accent ml-1" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Equalizer Waveform */}
                      <div className="flex items-center gap-1.5 h-6">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-accent rounded-full transition-all duration-200 ${
                              isSpeaking && !isPaused
                                ? 'animate-bounce'
                                : 'h-1.5 opacity-40'
                            }`}
                            style={{
                              height: isSpeaking && !isPaused ? `${Math.floor(Math.sin(i * 0.8) * 12 + 16)}px` : '4px',
                              animationDelay: `${(i % 5) * 0.15}s`
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-xs font-mono text-slate-300">
                        {isSpeaking && !isPaused ? (
                          <span className="text-accent font-bold flex items-center justify-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 animate-spin" /> Speaking Agent Review...
                          </span>
                        ) : isPaused ? (
                          <span className="text-amber-400 font-bold">Speech Paused &middot; Click Play to Resume</span>
                        ) : (
                          <span className="text-slate-400">Click "Play Voice Review" to hear {activeVideo.agentName} speak their transcript</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Floating Control Bar */}
                    <div className="relative z-10 bg-slate-950/90 border border-slate-800 rounded-xs p-3 backdrop-blur-md space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Play/Pause & Stop */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleTogglePlayPauseSpeech}
                            className="px-4 py-2 bg-accent text-slate-950 font-black text-xs uppercase tracking-wider rounded-xs hover:bg-accent/90 transition flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            {isSpeaking && !isPaused ? (
                              <>
                                <Pause className="w-4 h-4 fill-slate-950" /> Pause Speech
                              </>
                            ) : isPaused ? (
                              <>
                                <Play className="w-4 h-4 fill-slate-950" /> Resume Speech
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-slate-950" /> Play Voice Review
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleStopSpeech}
                            disabled={!isSpeaking && currentWordCharIndex === 0}
                            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white rounded-xs transition cursor-pointer"
                            title="Reset Speech"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={handleMuteToggle}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-mono"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-accent" />}
                            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
                          </button>
                        </div>

                        {/* Speech Rate & Voice Selector */}
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 text-[10px] uppercase">Speed:</span>
                            {[0.9, 1.0, 1.25, 1.5].map(rate => (
                              <button
                                key={rate}
                                onClick={() => {
                                  setSpeechRate(rate);
                                  if (isSpeaking) {
                                    speakTranscript(currentWordCharIndex);
                                  }
                                }}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-xs transition cursor-pointer ${
                                  speechRate === rate
                                    ? 'bg-accent text-slate-950 font-black'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>

                          {voices.length > 0 && (
                            <div className="hidden md:flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px] uppercase">Voice:</span>
                              <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                  const found = voices.find(v => v.name === e.target.value);
                                  if (found) {
                                    setSelectedVoice(found);
                                    if (isSpeaking) {
                                      speakTranscript(currentWordCharIndex);
                                    }
                                  }
                                }}
                                className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] py-0.5 px-2 rounded-xs focus:outline-none focus:border-accent"
                              >
                                {voices.filter(v => v.lang.startsWith('en')).slice(0, 8).map(v => (
                                  <option key={v.name} value={v.name}>
                                    {v.name.replace(/Google|Microsoft|Apple/g, '').trim()}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Speech Progress Bar */}
                      <div className="space-y-1">
                        <div 
                          className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const ratio = clickX / rect.width;
                            const targetChar = Math.floor(ratio * activeVideo.transcript.length);
                            handleSeekChar(targetChar);
                          }}
                        >
                          <div 
                            className="bg-accent h-full transition-all duration-150"
                            style={{ width: `${activeVideo.transcript.length ? (currentWordCharIndex / activeVideo.transcript.length) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Click anywhere on progress bar or text to jump voice position</span>
                          <span>{Math.round(activeVideo.transcript.length ? (currentWordCharIndex / activeVideo.transcript.length) * 100 : 0)}% Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* YouTube Stream Tab */
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                )}

                {/* Modal Footer / Dynamic Synchronized Transcript */}
                <div className="p-6 bg-slate-900 overflow-y-auto space-y-4 max-h-72">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquareText className="w-4 h-4 text-accent" />
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase text-accent tracking-wider flex items-center gap-1.5">
                          Verified Transcript &middot; Live Synchronized Text
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {activeVideo.agentName} &middot; {activeVideo.role} ({activeVideo.brokerage}, {activeVideo.location})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSeekChar(0)}
                        className="text-[10px] font-mono text-slate-400 hover:text-accent underline cursor-pointer"
                      >
                        Replay From Start
                      </button>
                      <div className="flex items-center gap-1 text-accent">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-accent" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Highlighted Transcript Box */}
                  <div 
                    ref={transcriptContainerRef}
                    className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-5 rounded-xs border border-slate-800 font-sans tracking-wide max-h-48 overflow-y-auto selection:bg-accent selection:text-slate-950"
                  >
                    "{renderHighlightedTranscript(activeVideo.transcript)}"
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-accent" /> Tip: Click any highlighted word above to jump voice audio to that sentence.
                    </span>
                    <span>CRM: <strong className="text-white">{activeVideo.crmUsed}</strong></span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
