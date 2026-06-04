import {
  Building2, MapPin, Phone, Globe,
  Shield, Briefcase,
  Clock, Edit3, CheckCircle2, Mail,
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

const OFFICES = [
  {
    type:    'Registered Office',
    badge:   { label: 'Primary', color: '#0A8A58', bg: 'rgba(14,168,106,0.09)', border: 'rgba(14,168,106,0.20)' },
    name:    'Concert IDC — Head Office',
    street:  '#45, 2nd Floor, Prestige Tech Park, Kadubeesanahalli, Outer Ring Road',
    city:    'Bangalore',
    state:   'Karnataka',
    country: 'India',
    pin:     '560 103',
    phone:   '+91 80 4567 8900',
    email:   'contact@concertidc.com',
    color:   '#6366F1',
  },
  {
    type:    'Branch Office',
    badge:   { label: 'Branch', color: '#5B5FDE', bg: 'rgba(99,102,241,0.09)', border: 'rgba(99,102,241,0.20)' },
    name:    'Concert IDC — Mumbai Branch',
    street:  '301, WeWork, Bandra Kurla Complex, BKC Road',
    city:    'Mumbai',
    state:   'Maharashtra',
    country: 'India',
    pin:     '400 051',
    phone:   '+91 22 6789 1234',
    email:   'mumbai@concertidc.com',
    color:   '#F59E0B',
  },
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

        {/* Office Locations — full width */}
        <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(245,158,11,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={15} style={{ color: '#D97706' }} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Office Locations</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: '3px 10px' }}>
              {OFFICES.length} offices
            </span>
          </div>

          {/* Address cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, padding: '20px 22px' }}>
            {OFFICES.map(office => (
              <div key={office.name} style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', background: C.surface }}>
                {/* Card top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${office.color}, ${office.color}88)` }} />

                <div style={{ padding: '18px 20px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${office.color}12`, border: `1px solid ${office.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Building2 size={17} style={{ color: office.color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, lineHeight: 1.3 }}>{office.name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{office.type}</div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: office.badge.bg, color: office.badge.color, border: `1px solid ${office.badge.border}`, flexShrink: 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: office.badge.color, display: 'inline-block' }} />
                      {office.badge.label}
                    </span>
                  </div>

                  {/* Address block */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, padding: '12px 14px', background: '#fff', borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <MapPin size={14} style={{ color: C.muted, flexShrink: 0, marginTop: 2 }} strokeWidth={1.8} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#3D4266', lineHeight: 1.65 }}>
                        {office.street}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 3 }}>
                        {office.city}, {office.state} – {office.pin}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{office.country}</div>
                    </div>
                  </div>

                  {/* Contact strip */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${office.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Phone size={11} style={{ color: office.color }} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#3D4266' }}>{office.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${office.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Mail size={11} style={{ color: office.color }} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#3D4266' }}>{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Configuration */}
        <SectionCard title="Platform Configuration" icon={Clock} accent="#E84855" accentBg="rgba(232,72,85,0.09)">
          {PLATFORM.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === PLATFORM.length - 1} />)}
        </SectionCard>

      </div>
    </div>
  )
}
