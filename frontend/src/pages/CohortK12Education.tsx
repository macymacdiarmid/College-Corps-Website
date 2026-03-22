import CohortPage from '../components/CohortPage'

export default function CohortK12Education() {
  return (
    <CohortPage
      icon="📚"
      title="K-12 Education"
      tagline="Closing the opportunity gap one student at a time."
      description="The K-12 Education cohort places College Corps members in local schools and after-school
        programs to provide tutoring, mentorship, and enrichment activities. Members build relationships with
        students, support teachers, and help create environments where every child can thrive academically
        and personally. This cohort is for students passionate about education equity and youth development."
      goals={[
        { text: 'Improve literacy and math proficiency for K-12 students facing academic challenges.' },
        { text: 'Expand access to enrichment programs for low-income students.' },
        { text: 'Build mentorship relationships that inspire students toward higher education.' },
        { text: 'Support teachers with additional capacity in under-resourced classrooms.' },
        { text: 'Foster social-emotional learning and resilience in young learners.' },
      ]}
      partners={[
        { name: 'San Luis Coastal Unified School District', description: 'K-12 schools serving students across San Luis Obispo.' },
        { name: 'Boys & Girls Clubs of the Central Coast', description: 'After-school programs focused on academic and personal growth.' },
        { name: 'RISE', description: 'Literacy and tutoring programs for elementary-age students.' },
        { name: 'Big Brothers Big Sisters', description: 'Mentorship matching program for youth in SLO County.' },
      ]}
    />
  )
}
