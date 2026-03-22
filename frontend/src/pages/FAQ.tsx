import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const generalFAQs: FAQItem[] = [
  {
    question: 'What is the day to day life of a College Corps Fellow?',
    answer: 'A day in the life of a college corps fellow varies by site assignment. Some examples are leading after-school sports programs for K-12 students, gardening and tending farm animals, stocking and organizing food pantry supplies, tabling and promoting sustainability projects, designing marketing materials, and so much more.',
  },
  {
    question: 'Can current College Corps fellows re-apply?',
    answer: 'Yes, current College Corps fellows can reapply as long as they meet two requirements: they are enrolled as full-time students for the entire academic year in good academic standing and are in good standing with the College Corps Program.',
  },
  {
    question: 'Do I need a car?',
    answer: 'You don\'t have to have a car to be eligible for this program. Please take into consideration the different sites and transportation needs when making your site preferences.',
  },
  {
    question: 'Is there transportation assistance?',
    answer: 'College Corps utilizes various means of transportation for fellows and will work with fellows to come up with the best plan.',
  },
  {
    question: 'What kind of a commitment will my site require?',
    answer: 'This fellowship requires 12-15 hours of service each week, with scheduled shifts that depend on the site and its operating hours.',
  },
]

const programFAQs: FAQItem[] = [
  {
    question: 'How many hours do I need to complete?',
    answer: 'The requirement for the service term is 450 hours, and with proactive time management skills and plenty of support, you can successfully complete it!',
  },
  {
    question: 'How many hours a week should I serve?',
    answer: 'Fellows are encouraged to serve a minimum of 12-15 hours a week. We recognize this may look different quarter by quarter. You will be able to connect with your site supervisor each quarter regarding any changes to your schedule.',
  },
  {
    question: 'How many units do I need to be enrolled in?',
    answer: 'You need to be a full-time student each quarter to remain eligible for this program. Students in blended master\'s programs are not eligible for College Corps.',
  },
  {
    question: 'What is the College Corps Course requirement?',
    answer: 'As a member of College Corps, you will be enrolled in a 1 Unit Course each quarter next year.',
  },
  {
    question: 'What if I have a senior project coming up next year?',
    answer: 'Have a senior project next year? Strategize with your professor how you can align this with your service site\'s needs. Example, material engineering senior project on sustainable medical waste, Strategic Business models for climate action NGO\'s etc.',
  },
  {
    question: 'Can this count as an internship?',
    answer: 'Fellows in the past have been able to get internship credit for their fellowship. Work with your advisor if you would like to explore this option.',
  },
]

function AccordionItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-cc-blue pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-cc-orange flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cc-blue-dark text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">Got Questions?</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-cc-blue-light text-lg">Everything you need to know about the College Corps program.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">

        {/* General FAQs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-cc-orange rounded-full" />
            <h2 className="text-2xl font-bold text-cc-blue">General FAQs</h2>
          </div>
          <div className="space-y-3">
            {generalFAQs.map((faq, i) => (
              <AccordionItem key={i} {...faq} />
            ))}
          </div>
        </section>

        {/* Program FAQs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-cc-orange rounded-full" />
            <h2 className="text-2xl font-bold text-cc-blue">Program FAQs</h2>
          </div>
          <div className="space-y-3">
            {programFAQs.map((faq, i) => (
              <AccordionItem key={i} {...faq} />
            ))}
          </div>
        </section>

        {/* Still have questions CTA */}
        <section className="bg-cc-blue rounded-xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
          <p className="text-cc-blue-light mb-6">Reach out to us directly and we'll get back to you.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-cc-orange text-white font-semibold rounded-lg hover:bg-cc-orange-medium transition-colors"
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  )
}
