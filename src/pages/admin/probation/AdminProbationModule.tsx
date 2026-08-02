/* ─────────────────────────────────────────────────────────────────────────────
 * Stage 4 — Admin: Probation module (entry)
 *
 * The Admin's probation cockpit — a list of ALL probation cases across the org,
 * opening into a decision detail where the Admin sees both the employee's
 * self-assessment and the manager's assessment, then makes the final decision:
 * Confirm · Extend · Terminate.
 *
 * Container that switches between the Probation Cases list and the decision detail.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import AdminProbationPage from './AdminProbationPage'
import AdminDecisionPage from './AdminDecisionPage'
import { MOCK_ALL_CASES } from '../../employee/probation/probationShared'

export default function AdminProbationModule() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openCase = openId ? MOCK_ALL_CASES.find(c => c.id === openId) : null

  if (openCase) return <AdminDecisionPage c={openCase} onBack={() => setOpenId(null)} />
  return <AdminProbationPage onOpenCase={setOpenId} />
}
