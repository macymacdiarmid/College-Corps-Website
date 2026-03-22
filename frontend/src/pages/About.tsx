import { Link } from 'react-router-dom'

function CommunityIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      {/* Globe */}
      <circle cx="12" cy="11" r="4" />
      <path d="M12 7 Q10 9 12 11 Q14 9 12 7z" />
      <path d="M8 11 Q10 10 12 11 Q14 10 16 11" />
      {/* Hand beneath globe */}
      <path d="M6 15 Q5 14 6 13 Q8 12 12 13 Q16 12 18 13 Q19 14 18 15 L16 20 Q14 22 12 22 Q10 22 8 20 Z" />
      {/* People above globe */}
      <circle cx="12" cy="3" r="1.2" />
      <circle cx="7" cy="5" r="1" />
      <circle cx="17" cy="5" r="1" />
      <path d="M10 5 Q11 4 12 4.2 Q13 4 14 5" />
      <path d="M6 7 Q6.5 6 7 6.2" />
      <path d="M17 6.2 Q17.5 6 18 7" />
    </svg>
  )
}

function GraduationGroupIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      {/* Center graduation cap */}
      <path d="M12 4 L18 7 L12 10 L6 7 Z" />
      <path d="M18 7 L18 12" />
      <path d="M9 10.5 L9 14 Q9 16 12 16 Q15 16 15 14 L15 10.5" />
      {/* Left person */}
      <circle cx="5" cy="14" r="1.5" />
      <path d="M2.5 20 Q2.5 17 5 17 Q7.5 17 7.5 20" />
      {/* Center person */}
      <circle cx="12" cy="17" r="1.5" />
      <path d="M9.5 23 Q9.5 20 12 20 Q14.5 20 14.5 23" />
      {/* Right person */}
      <circle cx="19" cy="14" r="1.5" />
      <path d="M16.5 20 Q16.5 17 19 17 Q21.5 17 21.5 20" />
    </svg>
  )
}

function HandshakeHeartIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
      {/* Heart outline */}
      <path d="M12 21 C12 21 3 15 3 9 A4.5 4.5 0 0 1 12 7.5 A4.5 4.5 0 0 1 21 9 C21 15 12 21 12 21Z" />
      {/* Handshake inside */}
      <path d="M8 12 L10 11 L12 12 L14 11 L16 12" />
      <path d="M9 13.5 Q9 15 12 15 Q15 15 15 13.5" />
      <path d="M10 11 L10 9.5" />
      <path d="M14 11 L14 9.5" />
    </svg>
  )
}

const goals = [
  {
    number: '01',
    Icon: CommunityIcon,
    color: 'text-cc-blue',
    title: 'Engage & Lead',
    description: 'Engage college students in meaningful service to build leadership and civic responsibility.',
  },
  {
    number: '02',
    Icon: GraduationGroupIcon,
    color: 'text-cc-blue',
    title: 'Promote Success',
    description: 'Promote academic success and economic well being with students from diverse backgrounds.',
  },
  {
    number: '03',
    Icon: HandshakeHeartIcon,
    color: 'text-cc-orange',
    title: 'Support Communities',
    description: 'Support the work of community based organizations in key local priorities: K-12 Education, Climate Action, and Food Insecurity.',
  },
]

const timeline = [
  { year: '2021', event: 'Governor Newsom launches #CaliforniansForAll College Corps statewide initiative.' },
  { year: '2022', event: 'Cal Poly joins as one of the first universities in the program, welcoming its inaugural cohort of fellows.' },
  { year: '2023', event: 'Program expands to four cohorts — Food Insecurity, Climate Action, Healthy Futures, and K-12 Education.' },
  { year: '2024', event: 'Cal Poly College Corps members collectively surpass 10,000 hours of community service.' },
  { year: '2025', event: 'Program grows with new community partners and continues to deepen its impact across San Luis Obispo County.' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cc-blue-dark text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">#CaliforniansForAll</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">About College Corps</h1>
          <p className="text-cc-blue-light text-lg leading-relaxed">
            A statewide AmeriCorps initiative connecting California college students with communities that need them most.
          </p>
        </div>
      </section>

      {/* What is College Corps */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-cc-blue mb-5">What is College Corps?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cal Poly College Corps is part of Governor Newsom's <span className="font-semibold text-cc-blue">#CaliforniansForAll</span> initiative — a statewide AmeriCorps program that places college students in high-need communities to deliver direct service while earning an education award.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Fellows commit to <span className="font-semibold">450 hours of service</span> over the academic year — roughly 12-15 hours per week — working alongside nonprofit partners in four focus areas: Food Insecurity, Climate Action, Healthy Futures, and K-12 Education.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Upon successful completion, fellows receive a <span className="font-semibold text-cc-blue">$10,000 education award</span> that can be applied toward tuition, student loans, or future educational expenses.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 space-y-5">
            {[
              { label: 'Service Hours', value: '450', sub: 'per academic year' },
              { label: 'Education Award', value: '$10K', sub: 'upon completion' },
              { label: 'Hours Per Week', value: '12–15', sub: 'flexible scheduling' },
              { label: 'Community Cohorts', value: '4', sub: 'focus areas' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-5">
                <div className="text-3xl font-bold text-cc-orange w-20 flex-shrink-0">{stat.value}</div>
                <div>
                  <p className="font-semibold text-cc-blue">{stat.label}</p>
                  <p className="text-sm text-gray-500">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-2">#CaliforniansForAll</p>
            <h2 className="text-3xl font-bold text-cc-blue">College Corps Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {goals.map((g) => (
              <div key={g.number} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className={`flex justify-center mb-5 ${g.color}`}>
                  <g.Icon className="w-20 h-20" />
                </div>
                <p className="text-cc-orange font-bold text-sm uppercase tracking-widest mb-1">Goal #{g.number.replace('0', '')}</p>
                <h3 className="text-xl font-bold text-cc-blue mb-3">{g.title}</h3>
                <p className="text-gray-600 leading-relaxed">{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-cc-blue mb-8">Who Can Apply?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: 'Enrolled Full-Time', body: 'You must be enrolled as a full-time Cal Poly student for the entire academic year.' },
            { title: 'Good Academic Standing', body: 'Applicants must be in good academic standing at the time of application and throughout the program.' },
            { title: 'Any Major Welcome', body: 'College Corps is open to students from all majors and disciplines — your passion matters more than your degree.' },
            { title: 'Commitment to Service', body: 'Fellows must be able to commit 12-15 hours per week to their service site and attend required program meetings.' },
          ].map((item) => (
            <div key={item.title} className="border-l-4 border-cc-orange bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-cc-blue mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cc-blue-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 text-right">
                  <span className="text-cc-orange font-bold text-sm">{item.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-cc-orange mt-0.5" />
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-cc-blue-medium mt-1 flex-1 min-h-6" />}
                </div>
                <p className="text-cc-blue-light leading-relaxed pb-4">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-cc-blue mb-4">Ready to Join?</h2>
        <p className="text-gray-600 mb-8 text-lg max-w-xl mx-auto">
          Applications open every spring for the following academic year. Have questions? Check our FAQ or reach out directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=2wING578lUSVNx03nMoq522akEAKp5lJh4gZBmFwCk1UOU9LWldKUkdaNDlTUkZTVkRCQkFRVlMwQS4u"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-cc-orange text-white font-bold text-lg rounded-lg hover:bg-cc-orange-medium transition-colors"
          >
            Apply Now
          </a>
          <Link
            to="/faq"
            className="px-8 py-4 border-2 border-cc-blue text-cc-blue font-bold text-lg rounded-lg hover:bg-cc-blue hover:text-white transition-colors"
          >
            View FAQs
          </Link>
        </div>
      </section>
    </div>
  )
}
