import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { MessageSquarePlus, Star, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

export const FeedbackModule = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.post('/api/feedback', { rating, comments: comment });
      
      setIsSubmitted(true);
      toast.success('Thank you for your feedback!');
      
      // Reset after a delay
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setRating(0);
          setComment('');
        }, 300);
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button 
            variant="default" 
            size="icon" 
            className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 z-50 hover:scale-105 transition-transform"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] border-slate-200 dark:border-slate-800 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-blue-600" />
            Product Feedback
          </SheetTitle>
          <SheetDescription>
            Help us improve FutureForge AI. Your feedback goes directly to our product team.
          </SheetDescription>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit} 
              className="mt-8 space-y-8 flex-1"
            >
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  Tell us more about your experience (Optional)
                </label>
                <Textarea 
                  placeholder="What did you love? What could we improve?" 
                  className="min-h-[150px] resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Send Feedback</>}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-4 mt-8"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-green-600 dark:text-green-500 fill-green-600 dark:fill-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Feedback Received!</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-[250px]">
                Thank you for helping us make FutureForge AI better for everyone.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
