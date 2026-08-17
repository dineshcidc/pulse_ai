import { useState } from 'react'
import ITClearancePage, { MOCK_IT } from './ITClearancePage'
import ITClearanceDetailPage from './ITClearanceDetailPage'
import { effStatus } from '../offboardingFlags'

/*
 * System Admin IT Clearance — holds the S1 (queue) ↔ S2 (detail + clearance) switch.
 * Mounted by OffboardingModule for the `it-clearance` sidebar item.
 */
export default function ITClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const found = openId ? MOCK_IT.find(r => r.id === openId) ?? null : null
  // Hide on-hold: present any on-hold case to the detail page as pending.
  const selected = found ? { ...found, status: effStatus(found.status) } : null

  if (selected) {
    return <ITClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <ITClearancePage onOpen={setOpenId} />
}
