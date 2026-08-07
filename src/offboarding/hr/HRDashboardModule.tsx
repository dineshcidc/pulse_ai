import { useState } from 'react'
import HRDashboardPage from './HRDashboardPage'
import HRCaseCockpitPage from './HRCaseCockpitPage'
import { HR_CASES } from './hrData'

/*
 * HR Dashboard — holds the H1 (dashboard) ↔ H2/H3 (case cockpit) switch.
 * Mounted by OffboardingModule for the `hr-cases` sidebar item (the single HR
 * entry). A row's Open action drills into the shared Case Cockpit.
 */
export default function HRDashboardModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const selected = openId ? HR_CASES.find(c => c.id === openId) ?? null : null

  if (selected) {
    return <HRCaseCockpitPage c={selected} onBack={() => setOpenId(null)} backLabel="Offboarding Cases" />
  }
  return <HRDashboardPage onOpen={setOpenId} />
}
