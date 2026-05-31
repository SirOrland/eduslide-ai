"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "High School Biology Teacher",
    avatar: "SC",
    rating: 5,
    content: "EduSlide AI saved me hours of work. I uploaded my lesson plan and got a complete 20-slide presentation in under a minute. The speaker notes are incredibly detailed!",
  },
  {
    name: "Dr. Michael Torres",
    role: "University Professor",
    avatar: "MT",
    rating: 5,
    content: "The AI understands academic content really well. It correctly identified my research sections and created appropriate slide structures. The quiz generation feature is a game changer.",
  },
  {
    name: "Aisha Johnson",
    role: "Corporate Trainer",
    avatar: "AJ",
    rating: 5,
    content: "I use this for all my training materials now. The professional theme looks polished and the export quality is excellent. My colleagues thought I spent hours on the slides!",
  },
  {
    name: "Priya Patel",
    role: "eLearning Designer",
    avatar: "PP",
    rating: 4,
    content: "The multi-language support is exactly what I needed for our global team. The ability to regenerate individual slides is also very useful for fine-tuning.",
  },
  {
    name: "James Wilson",
    role: "Elementary School Teacher",
    avatar: "JW",
    rating: 5,
    content: "So easy to use! I'm not tech-savvy but I had my first presentation ready in 5 minutes. The educational theme is perfect for my classroom presentations.",
  },
  {
    name: "Linda Park",
    role: "Content Creator",
    avatar: "LP",
    rating: 5,
    content: "The discussion questions AI generates are thought-provoking and save me so much brainstorming time. This tool is essential for anyone creating educational content.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Loved by Educators Worldwide
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of teachers, trainers, and content creators.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
