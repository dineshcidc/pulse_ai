import { useState } from 'react'
import ManagerTeamOffboardingPage, { MOCK_TEAM } from './ManagerTeamOffboardingPage'
import ManagerClearanceDetailPage from './ManagerClearanceDetailPage'
import { effStatus } from '../offboardingFlags'

/*
 * Manager Team Offboarding — holds the M1 (queue) ↔ M2 (detail + clearance) switch.
 * Mounted by OffboardingModule for the `mgr-clearance` sidebar item.
 */
export default function ManagerClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const found = openId ? MOCK_TEAM.find(r => r.id === openId) ?? null : null
  // Hide on-hold: present any on-hold case to the detail page as pending.
  const selected = found ? { ...found, status: effStatus(found.status) } : null

  if (selected) {
    return <ManagerClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <ManagerTeamOffboardingPage onOpen={setOpenId} />
}
