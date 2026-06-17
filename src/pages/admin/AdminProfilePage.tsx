import { User2, Briefcase, Phone, MapPin, Edit2, Trash2 } from 'lucide-react'

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: '#E4E6EF',
  muted:  '#8B90A7',
  bg:     '#F0F2F8',
}

function SectionCard({
  icon, title, editable = false, children, style,
}: {
  icon: React.ReactNode; title: string; editable?: boolean
  children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 24px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
        </div>
        {editable && (
          <button
            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            <Edit2 size={13} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, verified }: { label: string; value?: string | null; verified?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: value ? C.navy : '#C8CCE0', display: 'flex', alignItems: 'center', gap: 5 }}>
        {value || '—'}
        {verified && value && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16A34A" opacity=".12"/><path d="M8 12l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
    </div>
  )
}

function FieldGrid({ cols = 2, children, gap = 18, rowGap }: { cols?: number; children: React.ReactNode; gap?: number; rowGap?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: gap, rowGap: rowGap ?? gap }}>
      {children}
    </div>
  )
}

export default function AdminProfilePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: '#787878', fontWeight: 500 }}>View and manage your admin profile information</p>
      </div>

      {/* ── BENTO GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>

        {/* ── 1. PROFILE HERO — col 1-4 ── */}
        <div style={{ gridColumn: 'span 4', display: 'flex' }}>
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: '28px 24px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            flex: 1,
          }}>
            {/* decorative circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(242,208,0,0.10)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(242,208,0,0.07)' }} />

            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 4px 20px rgba(28,32,53,0.14)',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src="https://randomuser.me/api/portraits/men/42.jpg"
                  alt="Admin User"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Online dot */}
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Sarah Johnson</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>System Administrator</div>

            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', borderRadius: 20, padding: '4px 12px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Active Admin</span>
            </div>

            {/* Quick info strips */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <Briefcase size={13} />, label: 'Role', val: 'Administrator' },
                { icon: <MapPin size={13} />, label: 'Office', val: 'Mumbai HQ' },
                { icon: <Phone size={13} />, label: 'Phone', val: '+91-9876543210' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg, borderRadius: 10, padding: '9px 13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.muted, fontSize: 12 }}>
                    {icon}
                    <span>{label}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Joined */}
            <div style={{ marginTop: 16, fontSize: 11.5, color: C.muted }}>
              Joined 01 Jan 2020 · Senior Admin
            </div>
          </div>
        </div>

        {/* ── 2. OFFICIAL DETAILS — col 5-12 ── */}
        <div style={{ gridColumn: 'span 8' }}>
          <SectionCard icon={<Briefcase size={16} color="#6366F1" />} title="Official Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={3} gap={20} rowGap={22}>
              <Field label="Admin Type"           value="System Administrator" />
              <Field label="Admin Role"           value="Full Access" />
              <Field label="Employee Code"        value="ADM-0001" />
              <Field label="Manager"              value="Executive Director" />
              <Field label="Office Location"      value="Mumbai" />
              <Field label="Department"           value="Administration" />
              <Field label="Work Location"        value="On-Site" />
              <Field label="Date of Joining"      value="01/01/2020" />
              <Field label="Designation"          value="System Administrator" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 3. PERSONAL DETAILS — col 1-6 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<User2 size={16} color="#EC4899" />} title="Personal Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Full Name"       value="Ms. Sarah Johnson" />
              <Field label="Gender"          value="Female" />
              <Field label="Marital Status"  value="Single" />
              <Field label="Date of Birth"   value="15/03/1992" />
              <Field label="Mobile"          value="91-9876543210 (Active)" verified />
              <Field label="Email"           value="sarah.johnson@concertidc.com" verified />
              <Field label="National ID"     value="IND-2024-SJ-0001" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 4. ADDITIONAL DETAILS — col 7-12 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<Phone size={16} color="#14B8A6" />} title="Additional Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Alternate Email"           value="sarah.personal@gmail.com" />
              <Field label="Blood Group"               value="O+" />
              <Field label="Phone (Residence)"         value="+91-2234567890" />
              <Field label="Phone (Office)"            value="+91-2268901234" />
              <Field label="Emergency Contact Person"  value="Michael Johnson" />
              <Field label="Emergency Contact Number"  value="+91-9876501234" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 5. ADDRESSES — col 1-12 ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<MapPin size={16} color="#D97706" />} title="Addresses" editable style={{ height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Current Address */}
              <div style={{ padding: '16px', background: C.bg, borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Address</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.navy, lineHeight: 1.6 }}>
                  Apartment 502, Tower A<br />
                  Prestige North Towers<br />
                  Off. Bannerghatta Road<br />
                  Bangalore, Karnataka 560029<br />
                  India
                </div>
              </div>

              {/* Permanent Address */}
              <div style={{ padding: '16px', background: C.bg, borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permanent Address</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.navy, lineHeight: 1.6 }}>
                  House No. 45, Block C<br />
                  Green Valley Residency<br />
                  Whitefield<br />
                  Bangalore, Karnataka 560066<br />
                  India
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

      </div>{/* end bento grid */}
    </div>
  )
}
