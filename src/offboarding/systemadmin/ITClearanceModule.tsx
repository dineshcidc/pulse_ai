import { useState } from 'react'
import ITClearancePage, { MOCK_IT } from './ITClearancePage'
import ITClearanceDetailPage from './ITClearanceDetailPage'

/*
 * System Admin IT Clearance — holds the S1 (queue) ↔ S2 (detail + clearance) switch.
 * Mounted by OffboardingModule for the `it-clearance` sidebar item.
 */
export default function ITClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const selected = openId ? MOCK_IT.find(r => r.id === openId) ?? null : null

  if (selected) {
    return <ITClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <ITClearancePage onOpen={setOpenId} />
}
