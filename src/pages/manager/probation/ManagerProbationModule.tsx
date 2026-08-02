/* Container that switches between the Team Probation list and the review detail. */

import { useState } from 'react'
import TeamProbationPage from './TeamProbationPage'
import ManagerReviewPage from './ManagerReviewPage'
import { MOCK_TEAM_CASES } from '../../employee/probation/probationShared'

export default function ManagerProbationModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openCase = openId ? MOCK_TEAM_CASES.find(c => c.id === openId) : null

  if (openCase) return <ManagerReviewPage c={openCase} onBack={() => setOpenId(null)} />
  return <TeamProbationPage onOpenCase={setOpenId} />
}
