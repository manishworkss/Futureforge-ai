import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import { Compass, BookOpen, Target, Sparkles, Code, BrainCircuit, Users, Bot, ArrowRight, CheckCircle2, Star, Quote } from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-400/20 opacity-30 blur-[100px]"></div>
        
        <div className="container relative mx-auto px-4 sm:px-8 text-center max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 mb-6 shadow-sm">
              <Sparkles className="mr-1.5 h-4 w-4" />
              Introducing FutureForge AI 2.0
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
              Navigate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">AI precision</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop guessing your future. Get data-driven domain recommendations, personalized roadmaps, and an AI mentor to guide your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/auth/register">
                <Button size="lg" className="h-12 px-8 text-base bg-cyan-600 hover:bg-cyan-500 text-white w-full sm:w-auto shadow-xl shadow-cyan-600/20">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive suite of tools designed to analyze your skills and map out your perfect career trajectory.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Compass className="h-8 w-8 text-cyan-600" />,
                title: "Domain Discovery",
                description: "AI analyzes your current skills and interests to recommend the most lucrative and suitable tech domains."
              },
              {
                icon: <Target className="h-8 w-8 text-cyan-600" />,
                title: "Personalized Roadmaps",
                description: "Get step-by-step, actionable milestones to transition into your target role with curated resources."
              },
              {
                icon: <Bot className="h-8 w-8 text-cyan-600" />,
                title: "AI Career Mentor",
                description: "Chat with a specialized AI agent that knows your progress and answers your technical or career questions."
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all bg-white">
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How FutureForge Works</h2>
          </motion.div>

          <div className="space-y-12">
            {[
              { step: "01", title: "Take the Assessment", desc: "Share your current skills, educational background, and areas of interest." },
              { step: "02", title: "Review AI Recommendations", desc: "Our engine cross-references your profile against real-world market demands." },
              { step: "03", title: "Follow the Roadmap", desc: "Execute on a structured, milestone-based learning path." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all"
              >
                <div className="text-4xl font-extrabold text-cyan-200">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-slate-50/70 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 mb-4 shadow-xs">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-teal-600 text-teal-600" /> Proven Outcomes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Trusted by Engineers Breaking Into Top Tech
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Real career transitions powered by FutureForge AI's diagnostic gap analysis and verified roadmap execution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ananya Sharma",
                role: "Platform Engineer @ FinTech Unicorn",
                prev: "Junior Full Stack Dev",
                quote: "FutureForge identified that my microservices experience was strong but I lacked production Kubernetes & Terraform. The 6-week roadmap gave me exact hands-on projects that clinched my offer.",
                rating: 5,
                metric: "+65% Compensation Uplift"
              },
              {
                name: "Marcus Vance",
                role: "Machine Learning Engineer @ Scale AI",
                prev: "Data Analyst",
                quote: "The diagnostic skill assessment was brutally honest. Instead of watching random YouTube tutorials, the Oracle AI mentor guided me through implementing real transformer attention layers from scratch.",
                rating: 5,
                metric: "Transitioned in 90 Days"
              },
              {
                name: "Rohit Patel",
                role: "Staff Backend Engineer @ Cloud Enterprise",
                prev: "Senior Java Developer",
                quote: "The system design gap analysis helped me break out of legacy monoliths into distributed event-driven architectures. The PDF export was so thorough my mentor reviewed it directly.",
                rating: 5,
                metric: "Promoted to Staff Level"
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col justify-between p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.metric}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs font-medium text-cyan-600">{t.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Previous: {t.prev}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          </motion.div>

          <Accordion className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-cyan-600">Is FutureForge free to use?</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Yes, the core assessment and domain recommendation features are entirely free for students and early-career professionals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-cyan-600">How accurate is the AI Mentor?</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Our AI is powered by high-performance Groq Cloud GPT OSS 120B models, specifically prompted and contextualized with modern tech industry standards to provide highly accurate, up-to-date career advice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-cyan-600">Can I change my roadmap later?</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Absolutely. Your career path isn't rigid. You can retake the assessment or manually pivot your active roadmap at any time from the dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-8 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of professionals taking the guesswork out of their future.
          </p>
          <Link to="/auth/register">
            <Button size="lg" className="h-14 px-10 text-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-600/20">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
