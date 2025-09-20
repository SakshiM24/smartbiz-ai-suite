import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI-powered analytics work?",
      answer: "Our AI analyzes your historical business data, customer patterns, and market trends to provide predictive insights, sales forecasting, and intelligent recommendations to help grow your business."
    },
    {
      question: "Is my business data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, secure cloud infrastructure, and comply with industry standards to ensure your business data is completely protected and private."
    },
    {
      question: "Can I integrate with my existing tools?",
      answer: "Yes! Our platform offers integrations with popular business tools, accounting software, and calendar applications. We also provide API access for custom integrations."
    },
    {
      question: "Do I need technical knowledge to use the platform?",
      answer: "Not at all. Our platform is designed with simplicity in mind. The intuitive interface allows any business owner to start managing customers, appointments, and analytics without technical expertise."
    },
    {
      question: "How accurate are the AI predictions?",
      answer: "Our AI models achieve high accuracy rates by analyzing multiple data points and continuously learning from your business patterns. The more data you provide, the more accurate the predictions become."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What kind of customer support do you offer?",
      answer: "We provide comprehensive support including email support for all plans, priority support for Professional plans, and dedicated support for Enterprise customers. We also have extensive documentation and tutorials."
    },
    {
      question: "How does the free trial work?",
      answer: "You get full access to all Professional features for 14 days, no credit card required. You can explore all features and see how our platform can benefit your business before making any commitment."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our AI-powered platform
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;