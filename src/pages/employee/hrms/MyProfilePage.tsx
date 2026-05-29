import { Edit2, User2, Briefcase, MapPin, CreditCard, Shield, Users, GraduationCap, Phone, Plus } from 'lucide-react'

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



export default function MyProfilePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>View and manage your personal information</p>
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
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="John Doe"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Online dot */}
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 4 }}>John Doe</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>UI/UX Designer</div>

            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', borderRadius: 20, padding: '4px 12px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Active Employee</span>
            </div>

            {/* Quick info strips */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <Briefcase size={13} />, label: 'Employee Code', val: 'EMP-0042' },
                { icon: <MapPin size={13} />, label: 'Office Location', val: 'Mumbai' },
                { icon: <Users size={13} />, label: 'Department', val: 'Product Design' },
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
              Joined 15 Mar 2022 · Senior Executive
            </div>
          </div>
        </div>

        {/* ── 2. OFFICIAL DETAILS — col 5-12 ── */}
        <div style={{ gridColumn: 'span 8' }}>
          <SectionCard icon={<Briefcase size={16} color="#6366F1" />} title="Official Details" style={{ height: '100%' }}>
            <FieldGrid cols={3} gap={20} rowGap={22}>
              <Field label="Employee Type"         value="Regular" />
              <Field label="Employment Status"     value="Working" />
              <Field label="Employee Code"         value="EMP-0042" />
              <Field label="Manager"               value="David Wilson (EMP-0018)" />
              <Field label="Office Location"       value="Mumbai" />
              <Field label="Department"            value="Product Design" />
              <Field label="Work Location"         value="Hybrid" />
              <Field label="Date of Joining"       value="15/03/2022" />
              <Field label="Designation"           value="UI/UX Designer" />
              <Field label="Level"                 value="Senior Executive" />
              <Field label="Notice Period"         value="60 days" />
              <Field label="Shift"                 value="General" />
              <Field label="Attendance Recording"  value="Mobile + Web" />
              <Field label="Confirmation Date"     value="15/09/2022" />
              <Field label="Work Nature"           value="Full-Time" />
              <Field label="Calendar"              value="Calendar-2026" />
              <Field label="Desk Number"           value="D-204" />
              <Field label="Job Description"       value="UI/UX Designer" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 3. PERSONAL DETAILS — col 1-6 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<User2 size={16} color="#EC4899" />} title="Personal Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Full Name"       value="Mr. John Doe" />
              <Field label="Gender"          value="Male" />
              <Field label="Marital Status"  value="Married" />
              <Field label="Date of Birth"   value="12/06/1995" />
              <Field label="Mobile"          value="91-9876543210 (Active)" />
              <Field label="Email"           value="john.doe@concertidc.com" />
              <Field label="National ID"     value="IND-2024-JD-0042" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 4. ADDITIONAL DETAILS — col 7-12 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<Phone size={16} color="#14B8A6" />} title="Additional Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Alternate Email"           value="johndoe.personal@gmail.com" verified />
              <Field label="Blood Group"               value="B+" />
              <Field label="Phone (Residence)"         value="+91-2234567890" />
              <Field label="Phone (Office)"            value={undefined} />
              <Field label="Emergency Contact Person"  value="Jane Doe" />
              <Field label="Emergency Contact Number"  value="+91-9876501234" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 5. ADDRESSES — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<MapPin size={16} color="#F59E0B" />} title="Addresses" editable>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Present Address</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: C.navy, background: C.bg, borderRadius: 10, padding: '12px 16px' }}>
                  42 Elm Street, Downtown, Andheri West, Mumbai — 400053, Maharashtra, India
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Permanent Address</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: C.navy, background: C.bg, borderRadius: 10, padding: '12px 16px' }}>
                  17 Oak Avenue, Sector 12, Baner Road, Pune — 411045, Maharashtra, India
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 6. BANK ACCOUNTS — col 1-7 ── */}
        <div style={{ gridColumn: 'span 7' }}>
          <SectionCard icon={<CreditCard size={16} color="#2563EB" />} title="Bank Accounts" editable style={{ height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Salary Account */}
              <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Salary Account
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <Field label="Payment Mode"     value="Bank Transfer" />
                  <Field label="Account Number"   value="1234 5678 9012 3456" />
                  <Field label="Bank Name"        value="ICICI BANK" />
                  <Field label="Branch Name"      value="Andheri West" />
                  <Field label="IFSC / Routing"   value="ICIC0001234" />
                </div>
              </div>
              {/* Expense Account */}
              <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Expense Account
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <Field label="Payment Mode"     value="Bank Transfer" />
                  <Field label="Account Number"   value="9876 5432 1098 7654" />
                  <Field label="Bank Name"        value="AXIS BANK" />
                  <Field label="Branch Name"      value="Bandra East" />
                  <Field label="IFSC / Routing"   value="UTIB0001234" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 7. STATUTORY DETAILS — col 8-12 ── */}
        <div style={{ gridColumn: 'span 5' }}>
          <SectionCard icon={<Shield size={16} color="#DC2626" />} title="Statutory Details" style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={14}>
              <Field label="ESI Number"   value={undefined} />
              <Field label="NPR Number"   value={undefined} />
              <Field label="PAN Number"   value="ABCDE1234F" />
              <Field label="PF Number"    value="MH/BAN/12345/001" />
              <Field label="PRAN Number"  value={undefined} />
              <Field label="Tax Option"   value="New regime" />
              <div style={{ gridColumn: 'span 2' }}>
                <Field label="UAN Number" value="100987654321" verified />
              </div>
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 8. FAMILY DETAILS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<Users size={16} color="#7C3AED" />} title="Family Details">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 1fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Name', 'Relation', 'Date of Birth', 'Dependent', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { name: 'Emily Doe',   relation: 'Spouse', dob: '25/08/1997', dep: false },
              { name: 'Robert Doe', relation: 'Father', dob: '10/02/1965', dep: false },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 1fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{row.name}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.relation}</span>
                <span style={{ fontSize: 13, color: C.navy }}>{row.dob}</span>
                <div>
                  <div style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderRadius: 4, background: '#fff' }} />
                </div>
                <div>
                  <button style={{
                    height: 30, padding: '0 14px', borderRadius: 8, border: 'none',
                    background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 34, padding: '0 16px', borderRadius: 9,
                border: `1.5px dashed ${C.border}`, background: '#fff',
                color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Member
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 9. EDUCATION QUALIFICATIONS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<GraduationCap size={16} color="#0EA5E9" />} title="Education Qualifications">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1.5fr 0.6fr 1fr 1fr 0.8fr 0.8fr',
              background: C.bg, borderRadius: 10,
              padding: '10px 16px', marginBottom: 4,
            }}>
              {['Level', 'Institute', 'Degree', 'Specialization', '%', 'From', 'To', 'Docs', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Education row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1.5fr 0.6fr 1fr 1fr 0.8fr 0.8fr',
              padding: '13px 16px', borderBottom: `1px solid ${C.border}`,
              alignItems: 'center',
            }}>
              {/* Level badge */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', borderRadius: 6, padding: '3px 9px' }}>
                  Graduate
                </span>
              </div>
              <span style={{ fontSize: 13, color: C.navy }}>State University of Technology</span>
              <span style={{ fontSize: 13, color: C.navy }}>B.Tech</span>
              <span style={{ fontSize: 13, color: C.navy }}>Information Technology</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>82.00</span>
              <span style={{ fontSize: 13, color: C.muted }}>Jul-2013</span>
              <span style={{ fontSize: 13, color: C.muted }}>May-2017</span>
              <span style={{ fontSize: 12, color: C.muted }}>—</span>
              <button style={{
                height: 30, padding: '0 14px', borderRadius: 8, border: 'none',
                background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}>
                Edit
              </button>
            </div>

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 34, padding: '0 16px', borderRadius: 9,
                border: `1.5px dashed ${C.border}`, background: '#fff',
                color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.color = '#0EA5E9' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add New
              </button>
            </div>
          </SectionCard>
        </div>

      </div>{/* end bento grid */}
    </div>
  )
}
