import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import { Compass, BookOpen, Target, Sparkles, Code, BrainCircuit, Users, Bot, ArrowRight, CheckCircle2 } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
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

          <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 px-6 py-2 shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-cyan-600">Is FutureForge free to use?</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Yes, the core assessment and domain recommendation features are entirely free for students and early-career professionals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-cyan-600">How accurate is the AI Mentor?</AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Our AI is powered by the latest Groq Llama 3 models, specifically prompted and contextualized with modern tech industry standards to provide highly accurate, up-to-date career advice.
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
