import { useState } from 'react'
import CTOApprovalsPage, { MOCK_REQUESTS } from './CTOApprovalsPage'
import CTORequestDetailPage from './CTORequestDetailPage'

/*
 * CTO Offboarding Approvals — holds the C1 (queue) ↔ C2 (detail + decision) switch.
 * Mounted by OffboardingModule for the `cto-approvals` sidebar item.
 */
export default function CTOApprovalsModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const selected = openId ? MOCK_REQUESTS.find(r => r.id === openId) ?? null : null

  if (selected) {
    return <CTORequestDetailPage request={selected} onBack={() => setOpenId(null)} />
  }
  return <CTOApprovalsPage onOpen={setOpenId} />
}
