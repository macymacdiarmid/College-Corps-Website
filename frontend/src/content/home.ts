/**
 * Home page content
 * Edit the values here to update what appears on the site.
 * When we move to a CMS/database this file becomes the fallback.
 */
export const homeContent = {
  hero: {
    eyebrow: 'Cal Poly College Corps',
    headline: 'Learn by Doing.\nServe Your Community.',
    subheadline:
      "College Corps is Cal Poly's AmeriCorps program, connecting students with meaningful service " +
      'opportunities while earning an education award. Join a cohort, make an impact, and grow as a leader.',
    // Drop your hero image into frontend/public/media/hero/
    // and update the filename below
    backgroundImage: 'hero/hero.jpg',
    // Optional: hero video (plays behind the text)
    backgroundVideo: '', // e.g. 'hero/banner.mp4'
  },
  about: {
    heading: 'About the Program',
    body: [
      "Cal Poly College Corps is part of California's statewide AmeriCorps initiative. Students commit to " +
        '300 hours of community service over the academic year and receive a $10,000 education award upon completion.',
      'Members are placed in one of four cohorts aligned with pressing community needs — food insecurity, ' +
        'climate action, healthy futures, and K-12 education. Each cohort is partnered with local nonprofits ' +
        'and community organizations to ensure your service has a real and lasting impact.',
    ],
  },
  stats: [
    { value: '300', label: 'Service Hours per Year' },
    { value: '$10K', label: 'Education Award' },
    { value: '4', label: 'Community Cohorts' },
  ],
  cta: {
    heading: 'Ready to Make a Difference?',
    subheading: 'Applications open every spring for the following academic year.',
    buttonLabel: 'Apply Now',
  },
}
