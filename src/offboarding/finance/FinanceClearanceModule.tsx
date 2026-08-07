import { useState } from 'react'
import FinanceClearancePage, { MOCK_FIN } from './FinanceClearancePage'
import FinanceClearanceDetailPage from './FinanceClearanceDetailPage'

/*
 * Finance Clearance — holds the F1 (queue) ↔ F2 (detail + settlement) switch.
 * Mounted by OffboardingModule for the `fin-clearance` sidebar item.
 */
export default function FinanceClearanceModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const selected = openId ? MOCK_FIN.find(r => r.id === openId) ?? null : null

  if (selected) {
    return <FinanceClearanceDetailPage c={selected} onBack={() => setOpenId(null)} />
  }
  return <FinanceClearancePage onOpen={setOpenId} />
}
