import { useState } from 'react'
import MyNominationsListPage from './MyNominationsListPage'
import NominationRecordViewPage from './NominationRecordViewPage'
import { myNominationRecord, type NominatorRole } from './nominationInboxData'

/* ══════════════════════════════════════════
   Spotlight — `reward-nominations` route
   Owns which of the two screens is showing:
     · the list of every month
     · one nomination, read-only
   Reached from the header's Quick Access drawer.
══════════════════════════════════════════ */

interface Props {
  role: NominatorRole
  /** Send the user to the nomination form (the `spotlight-nominate` route). */
  onNominate: () => void
}

export default function MyNominationsModule({ role, onNominate }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const record = openKey ? myNominationRecord(role, openKey) : null

  if (record) {
    return <NominationRecordViewPage record={record} onBack={() => setOpenKey(null)} />
  }

  return (
    <MyNominationsListPage
      role={role}
      onOpen={setOpenKey}
      onNominate={onNominate}
    />
  )
}
