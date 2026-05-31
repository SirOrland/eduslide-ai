"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "5 presentations/month",
      "Up to 10 slides per presentation",
      "PDF & DOCX upload",
      "3 color themes",
      "PPTX download",
      "Basic speaker notes",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For teachers and content creators",
    features: [
      "50 presentations/month",
      "Up to 30 slides per presentation",
      "All file formats",
      "All themes & color schemes",
      "PPTX + PDF download",
      "AI speaker notes & quiz questions",
      "Discussion questions",
      "Priority AI generation",
      "Presentation history",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For schools and organizations",
    features: [
      "Unlimited presentations",
      "Unlimited slides",
      "All Pro features",
      "Multi-language support",
      "Team collaboration",
      "Custom branding",
      "Priority support",
      "API access",
    ],
    cta: "Contact Sales",
    href: "/register?plan=team",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start free, upgrade when you need more power.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl scale-105"
                  : "bg-card border-border"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-primary-foreground" : ""}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-green-500"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${plan.highlighted ? "bg-white text-primary hover:bg-white/90" : ""}`}
                variant={plan.highlighted ? "outline" : "default"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
