import CohortPage from '../components/CohortPage'
import { cohorts } from '../content/cohorts'

export default function CohortK12Education() {
  return <CohortPage cohort={cohorts.find((c) => c.id === 'k12')!} />
}
