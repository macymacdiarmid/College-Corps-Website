import CohortPage from '../components/CohortPage'

export default function CohortClimateAction() {
  return (
    <CohortPage
      icon="🌱"
      title="Climate Action"
      tagline="Building a more sustainable Central Coast for future generations."
      description="The Climate Action cohort partners with environmental nonprofits, government agencies, and
        community organizations to address the climate crisis at a local level. Members lead habitat restoration
        projects, deliver sustainability workshops, support renewable-energy initiatives, and help communities
        adapt to a changing environment. This cohort is for students who believe in science-driven solutions
        and hands-on environmental stewardship."
      goals={[
        { text: 'Restore native habitats and protect local biodiversity.' },
        { text: 'Reduce carbon emissions through community education and action.' },
        { text: 'Support sustainable agriculture and land management practices.' },
        { text: 'Increase environmental literacy in underserved communities.' },
        { text: 'Advance climate adaptation planning in local municipalities.' },
      ]}
      partners={[
        { name: 'Land Conservancy of San Luis Obispo County', description: 'Protecting open space and natural resources across the Central Coast.' },
        { name: 'SLO Climate Coalition', description: 'Mobilizing community action on local and state climate policy.' },
        { name: 'RCD of San Luis Obispo County', description: 'Resource conservation and sustainable land use programs.' },
        { name: 'Cal Poly Sustainability', description: 'Campus-wide initiatives to reduce environmental footprint.' },
      ]}
    />
  )
}
