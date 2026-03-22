import CohortPage from '../components/CohortPage'
import { cohorts } from '../content/cohorts'

export default function CohortClimateAction() {
  return <CohortPage cohort={cohorts.find((c) => c.id === 'climate')!} />
}
