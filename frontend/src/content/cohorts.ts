/**
 * Cohort page content
 * Add your images/videos to frontend/public/media/cohorts/
 * and reference them by filename in the `media` field below.
 */
export interface CohortContent {
  id: 'food' | 'climate' | 'health' | 'k12'
  path: string
  icon: string
  title: string
  tagline: string
  description: string
  media: {
    // Drop files in frontend/public/media/cohorts/ and set the filename
    heroImage: string       // e.g. 'food-hero.jpg'
    heroVideo?: string      // e.g. 'food-overview.mp4'  (optional)
    galleryImages?: string[] // e.g. ['food-1.jpg', 'food-2.jpg']
  }
  goals: string[]
  partners: { name: string; description: string }[]
}

export const cohorts: CohortContent[] = [
  {
    id: 'food',
    path: '/cohorts/food',
    icon: '🍎',
    title: 'Food Insecurity',
    tagline: 'Fighting hunger in San Luis Obispo County one meal at a time.',
    description:
      'The Food Insecurity cohort places College Corps members with local food banks, community ' +
      'pantries, and nutrition-assistance programs. Members help distribute meals, organize food drives, ' +
      'assist with SNAP outreach, and build lasting systems that ensure no community member goes hungry.',
    media: {
      heroImage: 'cohorts/food-hero.jpg',
      heroVideo: '',
      galleryImages: [],
    },
    goals: [
      'Increase access to nutritious food for low-income families and individuals.',
      'Support local food banks with volunteer capacity and outreach.',
      'Reduce food waste through gleaning programs and community fridges.',
      'Educate community members on nutrition, cooking, and available resources.',
      'Advocate for systemic change in food access policy.',
    ],
    partners: [
      { name: 'SLO Food Bank', description: 'Distributing millions of pounds of food annually to families in need.' },
      { name: 'Cal Poly GROW', description: 'Student-led urban farm producing fresh produce for campus and community.' },
      { name: 'El Camino Homeless Organization', description: 'Providing meals and support services to unhoused residents.' },
      { name: 'Transitions-Mental Health Association', description: 'Integrated food and mental health support programs.' },
    ],
  },
  {
    id: 'climate',
    path: '/cohorts/climate',
    icon: '🌱',
    title: 'Climate Action',
    tagline: 'Building a more sustainable Central Coast for future generations.',
    description:
      'The Climate Action cohort partners with environmental nonprofits, government agencies, and ' +
      'community organizations to address the climate crisis at a local level. Members lead habitat ' +
      'restoration projects, deliver sustainability workshops, support renewable-energy initiatives, ' +
      'and help communities adapt to a changing environment.',
    media: {
      heroImage: 'cohorts/climate-hero.jpg',
      heroVideo: '',
      galleryImages: [],
    },
    goals: [
      'Restore native habitats and protect local biodiversity.',
      'Reduce carbon emissions through community education and action.',
      'Support sustainable agriculture and land management practices.',
      'Increase environmental literacy in underserved communities.',
      'Advance climate adaptation planning in local municipalities.',
    ],
    partners: [
      { name: 'Land Conservancy of San Luis Obispo County', description: 'Protecting open space and natural resources across the Central Coast.' },
      { name: 'SLO Climate Coalition', description: 'Mobilizing community action on local and state climate policy.' },
      { name: 'RCD of San Luis Obispo County', description: 'Resource conservation and sustainable land use programs.' },
      { name: 'Cal Poly Sustainability', description: 'Campus-wide initiatives to reduce environmental footprint.' },
    ],
  },
  {
    id: 'health',
    path: '/cohorts/health',
    icon: '💊',
    title: 'Healthy Futures',
    tagline: 'Improving health equity and wellness across our community.',
    description:
      'The Healthy Futures cohort works at the intersection of public health, wellness, and ' +
      'community care. Members are placed with clinics, nonprofits, and public health departments to ' +
      'deliver health education, assist with screenings, provide mental health outreach, and connect ' +
      'residents to social services.',
    media: {
      heroImage: 'cohorts/health-hero.jpg',
      heroVideo: '',
      galleryImages: [],
    },
    goals: [
      'Expand access to preventive health services for underserved populations.',
      'Reduce barriers to mental health care through community outreach.',
      'Promote healthy behaviors and wellness education in schools and community centers.',
      'Support navigation of healthcare systems for low-income residents.',
      'Strengthen the pipeline of diverse healthcare professionals.',
    ],
    partners: [
      { name: 'Community Health Centers of the Central Coast', description: 'Federally qualified health centers providing affordable care to all.' },
      { name: 'CAPSLO', description: 'Community Action Partnership offering wraparound health and social services.' },
      { name: 'SLO County Public Health', description: 'County programs focused on disease prevention and health promotion.' },
      { name: 'Lumina Alliance', description: 'Support services for survivors of domestic violence and sexual assault.' },
    ],
  },
  {
    id: 'k12',
    path: '/cohorts/k12',
    icon: '📚',
    title: 'K-12 Education',
    tagline: 'Closing the opportunity gap one student at a time.',
    description:
      'The K-12 Education cohort places College Corps members in local schools and after-school ' +
      'programs to provide tutoring, mentorship, and enrichment activities. Members build relationships ' +
      'with students, support teachers, and help create environments where every child can thrive ' +
      'academically and personally.',
    media: {
      heroImage: 'cohorts/k12-hero.jpg',
      heroVideo: '',
      galleryImages: [],
    },
    goals: [
      'Improve literacy and math proficiency for K-12 students facing academic challenges.',
      'Expand access to enrichment programs for low-income students.',
      'Build mentorship relationships that inspire students toward higher education.',
      'Support teachers with additional capacity in under-resourced classrooms.',
      'Foster social-emotional learning and resilience in young learners.',
    ],
    partners: [
      { name: 'San Luis Coastal Unified School District', description: 'K-12 schools serving students across San Luis Obispo.' },
      { name: 'Boys & Girls Clubs of the Central Coast', description: 'After-school programs focused on academic and personal growth.' },
      { name: 'RISE', description: 'Literacy and tutoring programs for elementary-age students.' },
      { name: 'Big Brothers Big Sisters', description: 'Mentorship matching program for youth in SLO County.' },
    ],
  },
]
