import CohortPage from '../components/CohortPage'
import { cohorts } from '../content/cohorts'

export default function CohortFoodInsecurity() {
  return <CohortPage cohort={cohorts.find((c) => c.id === 'food')!} />
}
