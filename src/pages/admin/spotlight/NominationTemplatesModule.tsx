import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import NominationTemplatesPage from './NominationTemplatesPage'
import NominationTemplateBuilderPage from './NominationTemplateBuilderPage'
import {
  C, SEED_TEMPLATES, newBlankTemplate,
  type NominationTemplate,
} from './nominationTemplatesData'

type BuilderState = { mode: 'create' | 'edit'; template: NominationTemplate } | null

export default function NominationTemplatesModule() {
  const [templates, setTemplates] = useState<NominationTemplate[]>(SEED_TEMPLATES)
  const [builder, setBuilder]     = useState<BuilderState>(null)
  const [toast, setToast]         = useState<string | null>(null)

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  function handleCreate() {
    setBuilder({ mode: 'create', template: newBlankTemplate() })
  }
  function handleEdit(t: NominationTemplate) {
    setBuilder({ mode: 'edit', template: t })
  }
  function handleDuplicate(t: NominationTemplate) {
    const copy: NominationTemplate = {
      ...t,
      id: `tpl-${Date.now()}`,
      name: `${t.name} (Copy)`,
      status: 'Draft',
      updated: 'Just now',
      fields: t.fields.map((f, i) => ({ ...f, id: `f-${Date.now()}-${i}` })),
    }
    setTemplates(prev => [copy, ...prev])
    notify(`Duplicated “${t.name}”`)
  }
  function handleDelete(id: string) {
    const removed = templates.find(t => t.id === id)
    setTemplates(prev => prev.filter(t => t.id !== id))
    if (removed) notify(`Deleted “${removed.name}”`)
  }

  function handleSave(saved: NominationTemplate) {
    setTemplates(prev => {
      const exists = prev.some(t => t.id === saved.id)
      return exists ? prev.map(t => t.id === saved.id ? saved : t) : [saved, ...prev]
    })
    const wasCreate = builder?.mode === 'create'
    setBuilder(null)
    notify(wasCreate ? `Created “${saved.name}”` : `Saved “${saved.name}”`)
  }

  /* ── Builder ── */
  if (builder) {
    return (
      <NominationTemplateBuilderPage
        mode={builder.mode}
        template={builder.template}
        onBack={() => setBuilder(null)}
        onSave={handleSave}
      />
    )
  }

  return (
    <>
      <NominationTemplatesPage
        templates={templates}
        onCreate={handleCreate}
        onView={handleEdit}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

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
