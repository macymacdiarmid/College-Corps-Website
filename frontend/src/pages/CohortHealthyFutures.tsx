import CohortPage from '../components/CohortPage'

export default function CohortHealthyFutures() {
  return (
    <CohortPage
      icon="💊"
      title="Healthy Futures"
      tagline="Improving health equity and wellness across our community."
      description="The Healthy Futures cohort works at the intersection of public health, wellness, and
        community care. Members are placed with clinics, nonprofits, and public health departments to
        deliver health education, assist with screenings, provide mental health outreach, and connect
        residents to social services. This cohort is for students committed to health equity and eliminating
        disparities in care."
      goals={[
        { text: 'Expand access to preventive health services for underserved populations.' },
        { text: 'Reduce barriers to mental health care through community outreach.' },
        { text: 'Promote healthy behaviors and wellness education in schools and community centers.' },
        { text: 'Support navigation of healthcare systems for low-income residents.' },
        { text: 'Strengthen the pipeline of diverse healthcare professionals.' },
      ]}
      partners={[
        { name: 'Community Health Centers of the Central Coast', description: 'Federally qualified health centers providing affordable care to all.' },
        { name: 'CAPSLO', description: 'Community Action Partnership offering wraparound health and social services.' },
        { name: 'SLO County Public Health', description: 'County programs focused on disease prevention and health promotion.' },
        { name: 'Lumina Alliance', description: 'Support services for survivors of domestic violence and sexual assault.' },
      ]}
    />
  )
}
