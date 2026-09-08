import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import ResponseFormsPage from './ResponseFormsPage'
import SendNominationFormPage from './SendNominationFormPage'
import CampaignDetailPage from './CampaignDetailPage'
import { C, SEED_TEMPLATES } from './nominationTemplatesData'
import { SEED_CAMPAIGNS, campaignLabel, type Campaign } from './responseFormsData'

type Screen = { name: 'list' } | { name: 'send' } | { name: 'detail'; campaignId: string }

export default function ResponseFormsModule() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS)
  const [screen, setScreen]       = useState<Screen>({ name: 'list' })
  const [toast, setToast]         = useState<string | null>(null)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  function handleSend(created: Campaign) {
    setCampaigns(prev => [created, ...prev])
    setScreen({ name: 'list' })
    notify(`${created.rounds.length} nomination form${created.rounds.length === 1 ? '' : 's'} sent for ${campaignLabel(created)}`)
  }

  const detail = screen.name === 'detail'
    ? campaigns.find(c => c.id === screen.campaignId) ?? null
    : null

  return (
    <>
      {screen.name === 'send' ? (
        <SendNominationFormPage
          templates={SEED_TEMPLATES}
          campaigns={campaigns}
          onBack={() => setScreen({ name: 'list' })}
          onSend={handleSend}
        />
      ) : detail ? (
        <CampaignDetailPage
          campaign={detail}
          onBack={() => setScreen({ name: 'list' })}
          onExport={() => notify(`Exported ${campaignLabel(detail)} nominations (mock)`)}
        />
      ) : (
        <ResponseFormsPage
          campaigns={campaigns}
          onSend={() => setScreen({ name: 'send' })}
          onOpen={c => setScreen({ name: 'detail', campaignId: c.id })}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed flex items-center gap-2.5"
          style={{
            right: 28, bottom: 28, zIndex: 10000,
            background: '#fff', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 12,
            padding: '12px 16px', boxShadow: '0 12px 32px rgba(10,12,28,0.16)',
          }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(14,168,106,0.12)' }}>
            <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: '#0A7040' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{toast}</span>
        </div>
      )}
    </>
  )
}
