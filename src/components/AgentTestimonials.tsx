import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  crmUsed: 'Pipedrive' | 'Streak' | 'Follow Up Boss';
  activeYears: string;
  bgColor: string;
  textColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: "Sarah Jenkins",
    role: "Solo Listing Agent, Compass",
    location: "Austin, TX",
    quote: "I tried enterprise platforms, but they felt like a full-time job just to update. Pipedrive lets me visualize my listing escrows like simple cards. I save at least 4 hours of administrative busywork every single week.",
    rating: 5,
    crmUsed: "Pipedrive",
    activeYears: "8 years in industry",
    bgColor: "bg-primary/5",
    textColor: "text-primary"
  },
  {
    id: '2',
    name: "Marcus Vance",
    role: "Independent Broker-Owner",
    location: "Miami, FL",
    quote: "As a solo broker, I live in my Gmail inbox. Setting up Streak was a game-changer because I didn't have to learn a new interface. It keeps my buyer pipelines perfectly synced right where I send emails.",
    rating: 5,
    crmUsed: "Streak",
    activeYears: "12 years in industry",
    bgColor: "bg-accent/10",
    textColor: "text-accent"
  },
  {
    id: '3',
    name: "Elena Rostova",
    role: "Residential Sales Associate, RE/MAX",
    location: "Denver, CO",
    quote: "Follow Up Boss is unmatched when it comes to speed-to-lead. If a lead comes in from Zillow or Realtor.com, FUB triggers an automated follow-up sequence instantly. My conversion rate rose by 35% in six months.",
    rating: 5,
    crmUsed: "Follow Up Boss",
    activeYears: "5 years in industry",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800"
  },
  {
    id: '4',
    name: "Devon Carter",
    role: "Luxury Solo Specialist",
    location: "Los Angeles, CA",
    quote: "Clients expect high-touch interaction. Streak keeps my email templates structured so I can send personal, professional escrow milestones with one tap on my phone during active showings.",
    rating: 5,
    crmUsed: "Streak",
    activeYears: "7 years in industry",
    bgColor: "bg-accent/10",
    textColor: "text-accent"
  },
  {
    id: '5',
    name: "Amina Al-Mansoor",
    role: "Independent Realtor",
    location: "Chicago, IL",
    quote: "With Pipedrive's mobile app, I can drag a deal to 'Under Contract' right from the curb of an open house. No lag, no clunky load times. It's the absolute leanest CRM workflow for agents on the go.",
    rating: 4.8,
    crmUsed: "Pipedrive",
    activeYears: "4 years in industry",
    bgColor: "bg-primary/5",
    textColor: "text-primary"
  }
];

export default function AgentTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 6000); // cycle every 6 seconds
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex, isAutoPlaying]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-accent text-accent" />);
      } else {
        // Render half star for fractions, otherwise grey
        stars.push(
          <div key={i} className="relative inline-block shrink-0">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-accent text-accent" />
            </div>
          </div>
        );
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const currentTestimonial = testimonials[currentIndex];

  // Motion Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section 
      id="agent-testimonials"
      className="bg-white border-y border-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            Real Agent Consensus
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter">
            WHAT SOLO AGENTS ARE SAYING
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Real feedback from independent realtors, brokers, and solo facilitators who transitioned from clunky databases to streamlined platforms.
          </p>
        </div>

        {/* Carousel Window */}
        <div className="relative min-h-[340px] md:min-h-[260px] bg-gray-50 border-2 border-primary/10 rounded-xs p-6 sm:p-10 flex flex-col justify-between shadow-xs">
          
          {/* Quote Icon background watermark */}
          <div className="absolute right-6 top-6 text-gray-200 pointer-events-none opacity-40">
            <Quote className="w-24 h-24 stroke-[1px]" />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentTestimonial.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6 select-none relative z-10"
            >
              {/* Stars & CRM Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {renderStars(currentTestimonial.rating)}
                  <span className="text-xs font-mono font-black text-primary">
                    {currentTestimonial.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Verified Setup:</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${currentTestimonial.bgColor} ${currentTestimonial.textColor} border-current/10`}>
                    {currentTestimonial.crmUsed}
                  </span>
                </div>
              </div>

              {/* Quote Block */}
              <blockquote className="text-base sm:text-lg font-sans font-bold text-primary italic leading-relaxed text-left">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                <div className="space-y-0.5">
                  <cite className="not-italic text-sm font-black text-primary uppercase tracking-tight">
                    {currentTestimonial.name}
                  </cite>
                  <p className="text-xs text-gray-500 font-sans">
                    {currentTestimonial.role} &middot; <span className="text-gray-400">{currentTestimonial.location}</span>
                  </p>
                </div>

                <div className="hidden sm:block">
                  <span className="text-[10px] font-mono uppercase font-black text-gray-400 bg-gray-200/50 px-2 py-1 rounded-xs">
                    {currentTestimonial.activeYears}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Overlay */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 right-auto z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 bg-white hover:bg-gray-100 text-primary border border-gray-200 hover:border-gray-400 rounded-full flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 left-auto z-20">
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white hover:bg-gray-100 text-primary border border-gray-200 hover:border-gray-400 rounded-full flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators / Dots & Play State */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex gap-2">
            {testimonials.map((testimonial, idx) => (
              <button
                key={testimonial.id}
                onClick={() => handleDotClick(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-accent' 
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-[10px] font-mono uppercase font-bold text-gray-400 hover:text-gray-600 transition tracking-widest bg-gray-100 px-2 py-0.5 rounded-xs"
          >
            {isAutoPlaying ? '⏸ PAUSE AUTO' : '▶ PLAY AUTO'}
          </button>
        </div>
      </div>
    </section>
  );
}
