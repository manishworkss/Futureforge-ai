import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, Cookie, BookOpen, Users2, Newspaper } from 'lucide-react'

type ModalType = 'privacy' | 'terms' | 'cookies' | 'docs' | 'blog' | 'community' | null;

export const Footer = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const location = useLocation();

  const getHref = (hash: string) => {
    return location.pathname === '/' ? hash : `/${hash}`;
  };

  const modalContent: Record<string, { title: string; icon: React.ReactNode; body: React.ReactNode }> = {
    privacy: {
      title: "Privacy & Data Protection Policy",
      icon: <ShieldCheck className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            At FutureForge AI, we respect your privacy and enforce rigorous data isolation standards. We collect resume data, educational background, and technical diagnostic results solely to construct your personalized career roadmaps and train contextual mentor interactions.
          </p>
          <h4 className="font-semibold text-slate-900">1. Data Storage & Encryption</h4>
          <p>
            All candidate profiles, career assessments, and neural memory embeddings are encrypted in transit via TLS 1.3 and at rest with AES-256 encryption. We never sell, lease, or distribute your resume or contact details to third-party ad networks.
          </p>
          <h4 className="font-semibold text-slate-900">2. AI Inference Isolation</h4>
          <p>
            LLM requests processed through Groq Cloud (GPT OSS 120B) are zero-retention API calls. Your code submissions, resume text, and prompt histories are not retained by foundational model providers for public training.
          </p>
          <h4 className="font-semibold text-slate-900">3. User Rights</h4>
          <p>
            You may request complete erasure of your profile, assessments, and chat histories at any time by updating your account settings or emailing privacy@futureforge.ai.
          </p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            By accessing or using FutureForge AI, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h4 className="font-semibold text-slate-900">1. Educational & Guidance Platform</h4>
          <p>
            FutureForge AI provides data-driven career pathing recommendations, milestone estimations, and diagnostic evaluations. While our AI recommendations are grounded in current hiring benchmarks, employment outcomes remain dependent on individual performance.
          </p>
          <h4 className="font-semibold text-slate-900">2. Responsible Usage</h4>
          <p>
            You agree not to reverse engineer, submit malicious prompt injections, or automate scraping of our proprietary assessment rubrics, compiler services, or roadmap curriculums.
          </p>
        </div>
      )
    },
    cookies: {
      title: "Cookie & Local Storage Policy",
      icon: <Cookie className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            FutureForge AI utilizes secure HTTP-only cookies and local session storage strictly for JWT authentication tokens, UI theme preferences, and active chat session continuity.
          </p>
          <p>
            We do NOT deploy invasive cross-site tracking cookies or advertising pixels. All stored tokens expire automatically upon logout or credential invalidation.
          </p>
        </div>
      )
    },
    docs: {
      title: "Platform Documentation & Architecture",
      icon: <BookOpen className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            FutureForge AI is built on a modern enterprise stack: Spring Boot 3.3 backend with Java 21, React 18/19 with Vite and Tailwind CSS, Groq Cloud GPT OSS 120B inference engine, and iText 8 enterprise PDF document generation.
          </p>
          <h4 className="font-semibold text-slate-900">Core Workflow:</h4>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>Neural Profile:</strong> PDFBox parses candidate resumes into structured skill vectors.</li>
            <li><strong>Domain Recommendation:</strong> Machine learning scoring matches candidate profiles against market demand curves.</li>
            <li><strong>Skill Gap Analysis:</strong> 4-pillar evaluation across strengths, weaknesses, missing skills, and actionable priorities.</li>
            <li><strong>Tamper-Proof Assessment:</strong> HMAC-SHA256 signed diagnostic testing with automated Big-O complexity analysis.</li>
            <li><strong>Oracle AI Mentor:</strong> Staff engineer mentor persona with persistent contextual session history.</li>
          </ol>
        </div>
      )
    },
    blog: {
      title: "FutureForge Engineering & Career Blog",
      icon: <Newspaper className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Latest Article</span>
            <h4 className="text-base font-bold text-slate-900 mt-1">Bridging the Gap Between Junior Dev and Staff Engineer in 2026</h4>
            <p className="text-xs text-slate-500 mt-1">Published by FutureForge AI Research Team</p>
            <p className="mt-3 text-sm text-slate-700">
              Why memorizing LeetCode is no longer enough: Modern enterprise hiring focuses on distributed system trade-offs, observability, and practical architectural design.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Career Insights</span>
            <h4 className="text-base font-bold text-slate-900 mt-1">How AI Diagnostic Roadmaps Eliminate Career Transition Paralysis</h4>
            <p className="mt-2 text-sm text-slate-700">
              A deep dive into how structured exit criteria and milestone-based code evaluation accelerate skill mastery.
            </p>
          </div>
        </div>
      )
    },
    community: {
      title: "Developer Community & Mentorship Network",
      icon: <Users2 className="w-6 h-6 text-cyan-600" />,
      body: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Connect with thousands of software engineers, cloud architects, and data scientists actively advancing their careers on FutureForge AI.
          </p>
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
            <h4 className="font-bold text-cyan-950">Join Our Weekly Engineering AMAs</h4>
            <p className="text-xs text-cyan-800 mt-1">
              Participate in live system design reviews, resume teardowns, and mock technical interviews with verified Staff Engineers from leading product companies.
            </p>
            <Button className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-9">
              Request Community Access
            </Button>
          </div>
        </div>
      )
    }
  };

  return (
    <>
      <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <img 
                  src="/logo-brand.png" 
                  alt="FutureForge AI" 
                  className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
                />
              </Link>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Enterprise AI-driven career pathing, skill gap analysis, and mentor guidance for modern software engineers.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href={getHref('#features')} className="hover:text-cyan-600 transition-colors">Features</a></li>
                <li><a href={getHref('#how-it-works')} className="hover:text-cyan-600 transition-colors">How it Works</a></li>
                <li><a href={getHref('#testimonials')} className="hover:text-cyan-600 transition-colors">Testimonials</a></li>
                <li><Link to="/auth/register" className="hover:text-cyan-600 transition-colors">Sign Up</Link></li>
                <li><Link to="/auth/login" className="hover:text-cyan-600 transition-colors">Log In</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href={getHref('#faq')} className="hover:text-cyan-600 transition-colors">FAQ</a></li>
                <li>
                  <button onClick={() => setActiveModal('blog')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Engineering Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('community')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Community & AMAs
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('docs')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Documentation
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal & Trust</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('terms')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('cookies')} className="hover:text-cyan-600 transition-colors text-left cursor-pointer">
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} FutureForge AI. All rights reserved.</p>
            <p className="text-xs text-slate-400">Enterprise AI Career Engineering Platform</p>
          </div>
        </div>
      </footer>

      {/* Information Modals */}
      <Sheet open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6 bg-white border-slate-200 overflow-y-auto">
          {activeModal && modalContent[activeModal] && (
            <>
              <SheetHeader className="border-b border-slate-100 pb-4 mb-6">
                <SheetTitle className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
                  {modalContent[activeModal].icon}
                  {modalContent[activeModal].title}
                </SheetTitle>
              </SheetHeader>
              <div className="py-2">
                {modalContent[activeModal].body}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Footer;
