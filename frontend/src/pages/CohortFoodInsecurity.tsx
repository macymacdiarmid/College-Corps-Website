import CohortPage from '../components/CohortPage'

export default function CohortFoodInsecurity() {
  return (
    <CohortPage
      icon="🌾"
      title="Food Insecurity"
      tagline="Fighting hunger in San Luis Obispo County one meal at a time."
      description="The Food Insecurity cohort places College Corps members with local food banks, community
        pantries, and nutrition-assistance programs. Members help distribute meals, organize food drives,
        assist with SNAP outreach, and build lasting systems that ensure no community member goes hungry.
        This cohort is for students passionate about food justice, public health, and community resilience."
      goals={[
        { text: 'Increase access to nutritious food for low-income families and individuals.' },
        { text: 'Support local food banks with volunteer capacity and outreach.' },
        { text: 'Reduce food waste through gleaning programs and community fridges.' },
        { text: 'Educate community members on nutrition, cooking, and available resources.' },
        { text: 'Advocate for systemic change in food access policy.' },
      ]}
      partners={[
        { name: 'SLO Food Bank', description: 'Distributing millions of pounds of food annually to families in need.' },
        { name: 'Cal Poly GROW', description: 'Student-led urban farm producing fresh produce for campus and community.' },
        { name: 'El Camino Homeless Organization', description: 'Providing meals and support services to unhoused residents.' },
        { name: 'Transitions-Mental Health Association', description: 'Integrated food and mental health support programs.' },
      ]}
    />
  )
}
