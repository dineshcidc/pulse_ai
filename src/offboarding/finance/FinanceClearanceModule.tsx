import { useState } from 'react'
import FinanceClearancePage, { MOCK_FIN } from './FinanceClearancePage'
import FinanceClearanceDetailPage from './FinanceClearanceDetailPage'
import { effStatus } from '../offboardingFlags'

/*
 * Finance Clearance — holds the F1 (queue) ↔ F2 (detail + settlement) switch.
 * Mounted by OffboardingModule for the `fin-clearance` sidebar item.
 */
export default function FinanceClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const found = openId ? MOCK_FIN.find(r => r.id === openId) ?? null : null
  // Hide on-hold: present any on-hold case to the detail page as pending.
  const selected = found ? { ...found, status: effStatus(found.status) } : null

  if (selected) {
    return <FinanceClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <FinanceClearancePage onOpen={setOpenId} />
}
