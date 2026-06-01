import {
  Building2, MapPin, Phone, Globe,
  Shield, Briefcase,
  Clock, Edit3, CheckCircle2,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

/* ── Static org data ── */
const ORG = {
  name:        'Concert IDC Private Limited',
  shortName:   'Concert IDC',
  industry:    'IT Services & Consulting',
  type:        'Private Limited Company',
  founded:     '2018',
  website:     'www.concertidc.com',
  tagline:     'Building intelligent workforce management solutions for modern enterprises',
  about:       'Concert IDC is a Bangalore-based technology company specialising in enterprise software development, digital transformation consulting, and SaaS workforce management platforms. We serve clients across BFSI, healthcare, and e-commerce sectors.',
  headcount:   78,
  departments: 9,
  activeProj:  12,
}

const CONTACT = [
  { label: 'Primary Contact',  value: 'Kavitha Reddy'           },
  { label: 'Designation',      value: 'HR Manager'               },
  { label: 'Office Email',     value: 'hr@concertidc.com'        },
  { label: 'Support Email',    value: 'support@concertidc.com'   },
  { label: 'Phone',            value: '+91 80 4567 8900'         },
  { label: 'LinkedIn',         value: 'linkedin.com/company/concertidc' },
]

const ADDRESS = [
  { label: 'Registered Office', value: '#45, 2nd Floor, Prestige Tech Park, Kadubeesanahalli, Outer Ring Road, Bangalore – 560103, Karnataka' },
  { label: 'City',              value: 'Bangalore'               },
  { label: 'State',             value: 'Karnataka'               },
  { label: 'Country',           value: 'India'                   },
  { label: 'PIN Code',          value: '560103'                  },
]

const REGISTRATION = [
  { label: 'CIN',               value: 'U72900KA2018PTC112345', mono: true },
  { label: 'PAN',               value: 'AABCC1234D',             mono: true },
  { label: 'GST Number',        value: '29AABCC1234D1Z5',        mono: true },
  { label: 'MSME Registration', value: 'UDYAM-KR-01-0012345',    mono: true },
  { label: 'ISO Certification', value: 'ISO 9001:2015',          mono: false },
]

const PLATFORM = [
  { label: 'Timezone',         value: 'Asia/Kolkata (IST +5:30)' },
  { label: 'Date Format',      value: 'DD / MM / YYYY'            },
  { label: 'Currency',         value: 'Indian Rupee (₹ INR)'      },
  { label: 'Financial Year',   value: 'April – March'             },
  { label: 'Working Days',     value: 'Monday – Friday'           },
  { label: 'Work Hours',       value: '9:00 AM – 6:00 PM'         },
  { label: 'Leave Policy',     value: 'Indian Labour Law Compliant'},
]

/* ── Reusable components ── */
function InfoRow({ label, value, mono = false, last = false }: {
  label: string; value: string; mono?: boolean; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24,
      padding: '14px 0', borderBottom: last ? 'none' : '1px solid #F0F1F7',
    }}>
      <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, flexShrink: 0, minWidth: 148, lineHeight: 1.4 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.navy, fontWeight: 600, textAlign: 'right' as const, lineHeight: 1.5, fontFamily: mono ? "'JetBrains Mono', 'Courier New', monospace" : 'inherit', letterSpacing: mono ? '0.04em' : 'normal' }}>{value}</span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, accent = '#8B90A7', accentBg = C.surface, children }: {
  title: string; icon: React.ElementType; accent?: string; accentBg?: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} style={{ color: accent }} strokeWidth={1.8} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
      </div>
      <div style={{ padding: '4px 22px 8px' }}>{children}</div>
    </div>
  )
}


/* ── Main page ── */
export default function OrgProfilePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Organization Profile</h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>Company information, registration details and platform configuration</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          height: 38, padding: '0 18px', borderRadius: 10,
          border: `1px solid ${C.border}`, background: '#fff',
          fontSize: 13, fontWeight: 600, color: C.navy,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = C.border }}
        >
          <Edit3 size={14} strokeWidth={2} /> Edit Profile
        </button>
      </div>

      {/* ── Hero card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>

        {/* Top accent bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #1C2035 0%, #F2D000 50%, #E84855 100%)' }} />

        <div style={{ padding: '28px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>

            {/* Logo */}
            <div style={{
              width: 80, height: 80, borderRadius: 18, flexShrink: 0, overflow: 'hidden',
              border: `1.5px solid ${C.border}`, background: C.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src="/logo.png" alt="Concert IDC" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            </div>

            {/* Company info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: '-0.3px' }}>{ORG.name}</h2>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                  background: 'rgba(14,168,106,0.09)', color: '#0A8A58', border: '1px solid rgba(14,168,106,0.2)',
                }}>
                  <CheckCircle2 size={10} strokeWidth={2.5} /> Active
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' as const }}>
                {[
                  { icon: Briefcase, text: ORG.industry },
                  { icon: Building2, text: ORG.type     },
                  { icon: MapPin,    text: 'Bangalore, India' },
                  { icon: Globe,     text: ORG.website  },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                    <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.65, margin: 0, maxWidth: 680 }}>
                {ORG.about}
              </p>
            </div>

            {/* Founded badge */}
            <div style={{ flexShrink: 0, textAlign: 'center', padding: '14px 20px', background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1 }}>{ORG.founded}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Established</div>
            </div>
          </div>
        </div>

        <div style={{ height: 28 }} />
      </div>

      {/* ── Info sections — 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Phone} accent="#6366F1" accentBg="rgba(99,102,241,0.09)">
          {CONTACT.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === CONTACT.length - 1} />)}
        </SectionCard>

        {/* Business Registration */}
        <SectionCard title="Business Registration" icon={Shield} accent="#0EA86A" accentBg="rgba(14,168,106,0.09)">
          {REGISTRATION.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} mono={r.mono} last={i === REGISTRATION.length - 1} />)}
        </SectionCard>

        {/* Company Address */}
        <SectionCard title="Registered Address" icon={MapPin} accent="#F59E0B" accentBg="rgba(245,158,11,0.09)">
          {ADDRESS.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === ADDRESS.length - 1} />)}
        </SectionCard>

        {/* Platform Configuration */}
        <SectionCard title="Platform Configuration" icon={Clock} accent="#E84855" accentBg="rgba(232,72,85,0.09)">
          {PLATFORM.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === PLATFORM.length - 1} />)}
        </SectionCard>

      </div>
    </div>
  )
}
