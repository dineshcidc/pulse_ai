import { useState } from 'react'
import ManagerTeamOffboardingPage, { MOCK_TEAM } from './ManagerTeamOffboardingPage'
import ManagerClearanceDetailPage from './ManagerClearanceDetailPage'

/*
 * Manager Team Offboarding — holds the M1 (queue) ↔ M2 (detail + clearance) switch.
 * Mounted by OffboardingModule for the `mgr-clearance` sidebar item.
 */
export default function ManagerClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const selected = openId ? MOCK_TEAM.find(r => r.id === openId) ?? null : null

  if (selected) {
    return <ManagerClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <ManagerTeamOffboardingPage onOpen={setOpenId} />
}
