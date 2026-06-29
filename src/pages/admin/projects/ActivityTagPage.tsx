import { useState } from 'react'
import { Plus, Trash2, Edit2, Search, X, ChevronDown } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

const ROLE_CATEGORIES = {
  Common: { count: 18, color: '#6366F1' },
  Designer: { count: 24, color: '#F59E0B' },
  Developer: { count: 35, color: '#10B981' },
  Manager: { count: 16, color: '#8B5CF6' },
  Tester: { count: 22, color: '#EF4444' },
  QA: { count: 14, color: '#EC4899' },
  DevOps: { count: 12, color: '#06B6D4' },
}

const ACTIVITY_TAGS: Record<string, Array<{ id: string; name: string; chargeCode: string }>> = {
  Common: [
    { id: 'c1', name: 'Meeting', chargeCode: 'MTG-001' },
    { id: 'c2', name: 'Town Hall', chargeCode: 'THM-001' },
    { id: 'c3', name: 'Training', chargeCode: 'TRN-001' },
    { id: 'c4', name: 'Admin Work', chargeCode: 'ADM-001' },
    { id: 'c5', name: 'One-on-One', chargeCode: 'O2O-001' },
    { id: 'c6', name: 'Break', chargeCode: 'BRK-001' },
    { id: 'c7', name: 'Review', chargeCode: 'REV-001' },
    { id: 'c8', name: 'Planning', chargeCode: 'PLN-001' },
  ],
  Designer: [
    { id: 'd1', name: 'Design', chargeCode: 'DSN-001' },
    { id: 'd2', name: 'Wireframing', chargeCode: 'WRF-001' },
    { id: 'd3', name: 'Prototyping', chargeCode: 'PRT-001' },
    { id: 'd4', name: 'User Research', chargeCode: 'URS-001' },
    { id: 'd5', name: 'UI Implementation', chargeCode: 'UII-001' },
    { id: 'd6', name: 'Design Review', chargeCode: 'DRV-001' },
  ],
  Developer: [
    { id: 'dev1', name: 'Coding', chargeCode: 'COD-001' },
    { id: 'dev2', name: 'Testing', chargeCode: 'TST-001' },
    { id: 'dev3', name: 'Code Review', chargeCode: 'CRV-001' },
    { id: 'dev4', name: 'Debugging', chargeCode: 'DBG-001' },
    { id: 'dev5', name: 'Documentation', chargeCode: 'DOC-001' },
    { id: 'dev6', name: 'Deployment', chargeCode: 'DEP-001' },
  ],
  Manager: [
    { id: 'm1', name: 'Team Management', chargeCode: 'TMG-001' },
    { id: 'm2', name: 'Performance Review', chargeCode: 'PRF-001' },
    { id: 'm3', name: 'Recruitment', chargeCode: 'REC-001' },
    { id: 'm4', name: 'Strategic Planning', chargeCode: 'STP-001' },
  ],
  Tester: [
    { id: 't1', name: 'Manual Testing', chargeCode: 'MNT-001' },
    { id: 't2', name: 'Automation Testing', chargeCode: 'AUT-001' },
    { id: 't3', name: 'QA Review', chargeCode: 'QAR-001' },
    { id: 't4', name: 'Bug Reporting', chargeCode: 'BUG-001' },
    { id: 't5', name: 'Regression Testing', chargeCode: 'RGT-001' },
    { id: 't6', name: 'Performance Testing', chargeCode: 'PFT-001' },
  ],
  QA: [
    { id: 'qa1', name: 'Test Planning', chargeCode: 'TP-001' },
    { id: 'qa2', name: 'Test Case Creation', chargeCode: 'TCC-001' },
    { id: 'qa3', name: 'Test Execution', chargeCode: 'TE-001' },
    { id: 'qa4', name: 'Defect Tracking', chargeCode: 'DT-001' },
    { id: 'qa5', name: 'Quality Assurance Review', chargeCode: 'QAR-001' },
  ],
  DevOps: [
    { id: 'dops1', name: 'Deployment', chargeCode: 'DEP-001' },
    { id: 'dops2', name: 'Infrastructure Setup', chargeCode: 'INF-001' },
    { id: 'dops3', name: 'Monitoring', chargeCode: 'MON-001' },
    { id: 'dops4', name: 'CI/CD Pipeline', chargeCode: 'CIP-001' },
  ],
}

export default function ActivityTagPage() {
  const [selectedRole, setSelectedRole] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalRoles, setAddModalRoles] = useState<string[]>([])
  const [addModalRoleOpen, setAddModalRoleOpen] = useState(false)
  const [tagName, setTagName] = useState('')
  const [chargeCode, setChargeCode] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)

  const handleAddActivity = () => {
    setShowAddModal(true)
    setAddModalRoles([])
    setTagName('')
    setChargeCode('')
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setAddModalRoles([])
    setAddModalRoleOpen(false)
    setTagName('')
    setChargeCode('')
  }

  const handleToggleRole = (role: string) => {
    setAddModalRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const handleRemoveRole = (role: string) => {
    setAddModalRoles(prev => prev.filter(r => r !== role))
  }

  const handleSaveTag = async () => {
    if (addModalRoles.length > 0 && tagName && chargeCode) {
      setSaveLoading(true)
      await new Promise(r => setTimeout(r, 1200))
      setSaveLoading(false)
      handleCloseAddModal()
    }
  }

  const handleEdit = () => {
    // Edit action
  }

  const handleDelete = () => {
    // Delete action
  }

  const tags = selectedRole === 'All'
    ? Object.values(ACTIVITY_TAGS).flat()
    : (ACTIVITY_TAGS[selectedRole] || [])

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4, letterSpacing: '-0.3px' }}>
            Activity Tags
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Manage activity tags by role for timesheet entries
          </p>
        </div>

        <button
          onClick={handleAddActivity}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 42, padding: '0 18px', borderRadius: 11, border: 'none',
            background: '#1C2035', color: '#fff', fontSize: 13.5, fontWeight: 700,
            cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2A3050'}
          onMouseLeave={e => e.currentTarget.style.background = '#1C2035'}
        >
          <Plus size={16} strokeWidth={2.5} /> Add Tag
        </button>
      </div>

      {/* Search and Filter Card */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
        padding: '14px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#B0B4C8', pointerEvents: 'none',
          }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search activity tags..."
            style={{
              width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
              border: `1px solid ${C.border}`, borderRadius: 9,
              fontSize: 13.5, color: C.navy, background: '#fff',
              fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none',
              boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = C.border}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2:10 Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 10fr', gap: 20 }}>

        {/* Left Panel - Role Categories */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 16,
          height: 'fit-content',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 14, textTransform: 'uppercase' }}>
            Role Categories
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* All option */}
            <button
              onClick={() => setSelectedRole('All')}
              style={{
                padding: '12px 14px', borderRadius: 10, border: 'none',
                background: selectedRole === 'All' ? 'rgba(99,102,241,0.10)' : 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                outline: 'none', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
              onMouseEnter={e => {
                if (selectedRole !== 'All') e.currentTarget.style.background = '#F5F6FA'
              }}
              onMouseLeave={e => {
                if (selectedRole !== 'All') e.currentTarget.style.background = 'transparent'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: selectedRole === 'All' ? 700 : 600,
                  color: selectedRole === 'All' ? '#6366F1' : C.navy,
                }}>
                  All
                </div>
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600, color: selectedRole === 'All' ? '#6366F1' : C.muted,
              }}>
                ({Object.values(ACTIVITY_TAGS).reduce((sum, tags) => sum + tags.length, 0)})
              </div>
            </button>

            {Object.entries(ROLE_CATEGORIES).map(([role, data]) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '12px 14px', borderRadius: 10, border: 'none',
                  background: selectedRole === role ? 'rgba(99,102,241,0.10)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  outline: 'none', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
                onMouseEnter={e => {
                  if (selectedRole !== role) e.currentTarget.style.background = '#F5F6FA'
                }}
                onMouseLeave={e => {
                  if (selectedRole !== role) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: selectedRole === role ? 700 : 600,
                    color: selectedRole === role ? '#6366F1' : C.navy,
                  }}>
                    {role}
                  </div>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: selectedRole === role ? '#6366F1' : C.muted,
                }}>
                  ({data.count})
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Activity Tags Table */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 16,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.8fr', gap: 12, marginBottom: 0,
            padding: '12px', borderRadius: '10px 10px 0 0', background: '#F5F6FA',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', textAlign: 'left' }}>
              Activity Name
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', textAlign: 'left' }}>
              Activity Code
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', textAlign: 'center' }}>
              Actions
            </div>
          </div>

          {/* Table Rows */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {tags.length > 0 ? (
              tags.map((tag, idx) => (
                <div
                  key={tag.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.8fr', gap: 12,
                    padding: '12px', borderBottom: idx < tags.length - 1 ? `1px solid ${C.border}` : 'none',
                    alignItems: 'center', borderRadius: 8, transition: 'all 0.12s', cursor: 'pointer',
                    background: '#fff',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F6FA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {/* Tag Name */}
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, textAlign: 'left' }}>
                    {tag.name}
                  </div>

                  {/* Charge Code */}
                  <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, textAlign: 'left' }}>
                    {tag.chargeCode}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit()}
                      title="Edit tag"
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none',
                        background: '#F0F2F8', color: '#8B90A7', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E8EAF2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F0F2F8'}
                    >
                      <Edit2 size={14} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      title="Delete tag"
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none',
                        background: '#F0F2F8', color: '#8B90A7', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E8EAF2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F0F2F8'}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px', textAlign: 'center',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#F0F2F8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B0B4C8" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6m0 3v.01" />
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                  No tags for this role
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  Add a new tag to get started
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Tag Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, maxWidth: 500, width: '100%',
            padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Header with Close Button */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16,
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>
                  Add Activity Tag
                </h2>
                <p style={{ fontSize: 13, color: '#787878', fontWeight: 500, margin: 0 }}>
                  Create a new activity tag for your organization
                </p>
              </div>
              <button
                onClick={handleCloseAddModal}
                style={{
                  width: 28, height: 28, borderRadius: 6, background: C.hover, border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', flexShrink: 0, marginLeft: 12,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8EAF2'}
                onMouseLeave={e => e.currentTarget.style.background = C.hover}
              >
                <X size={14} style={{ color: C.muted }} />
              </button>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px', background: C.border, marginBottom: 20,
            }} />

            {/* Role Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                Select Role(s) *
              </label>
              <div style={{ position: 'relative' }}>
                {addModalRoleOpen && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setAddModalRoleOpen(false)} />
                )}
                <button
                  onClick={() => setAddModalRoleOpen(v => !v)}
                  style={{
                    width: '100%', height: 48, padding: '0 14px', borderRadius: 10,
                    border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer',
                    fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13.5, fontWeight: 600,
                    color: addModalRoles.length > 0 ? C.navy : C.muted, textAlign: 'left', transition: 'all 0.14s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', outline: 'none',
                  }}
                  onMouseEnter={e => { if (!addModalRoleOpen) e.currentTarget.style.background = C.hover }}
                  onMouseLeave={e => { if (!addModalRoleOpen) e.currentTarget.style.background = '#fff' }}
                >
                  {addModalRoles.length > 0 ? `${addModalRoles.length} role(s) selected` : 'Choose role(s)'}
                  <ChevronDown size={13} strokeWidth={2.3} style={{
                    color: C.muted, transition: 'transform 0.18s',
                    transform: addModalRoleOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} />
                </button>

                {addModalRoleOpen && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 7px)', left: 0, right: 0,
                    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
                    boxShadow: '0 10px 36px rgba(28,32,53,0.13)', zIndex: 200, padding: '6px',
                  }}>
                    {Object.keys(ROLE_CATEGORIES).map(role => (
                      <button
                        key={role}
                        onClick={() => handleToggleRole(role)}
                        style={{
                          width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none',
                          background: addModalRoles.includes(role) ? 'rgba(99,102,241,0.08)' : 'transparent',
                          cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                          outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif",
                          fontSize: 13.5, fontWeight: addModalRoles.includes(role) ? 700 : 500,
                          color: addModalRoles.includes(role) ? '#6366F1' : C.navy,
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}
                        onMouseEnter={e => {
                          if (!addModalRoles.includes(role)) e.currentTarget.style.background = '#F5F6FA'
                        }}
                        onMouseLeave={e => {
                          if (!addModalRoles.includes(role)) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <input
                          type="checkbox" checked={addModalRoles.includes(role)}
                          onChange={() => {}}
                          style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Roles Display */}
              {addModalRoles.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {addModalRoles.map(role => (
                    <div
                      key={role}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        paddingLeft: 12, paddingRight: 8, height: 32,
                        borderRadius: 8, background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#6366F1' }}>{role}</span>
                      <button
                        onClick={() => handleRemoveRole(role)}
                        style={{
                          width: 18, height: 18, borderRadius: 4, background: 'rgba(99,102,241,0.15)',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', transition: 'all 0.15s', padding: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                      >
                        <X size={12} style={{ color: '#6366F1' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                Activity Name *
              </label>
              <input
                value={tagName}
                onChange={e => setTagName(e.target.value)}
                placeholder="e.g., Design, Coding, Testing"
                style={{
                  width: '100%', height: 48, padding: '0 12px', borderRadius: 10,
                  border: `1px solid ${C.border}`, fontSize: 13.5, color: C.navy,
                  fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Activity Code */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                Activity Code *
              </label>
              <input
                value={chargeCode}
                onChange={e => setChargeCode(e.target.value)}
                placeholder="e.g., DSN-001"
                style={{
                  width: '100%', height: 48, padding: '0 12px', borderRadius: 10,
                  border: `1px solid ${C.border}`, fontSize: 13.5, color: C.navy,
                  fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box',
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366F1'}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleCloseAddModal}
                style={{
                  flex: 1, height: 48, borderRadius: 10, border: `1px solid ${C.border}`,
                  background: '#fff', color: C.navy, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
                  transition: 'all 0.15s', outline: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.hover }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTag}
                disabled={addModalRoles.length === 0 || !tagName || !chargeCode || saveLoading}
                style={{
                  flex: 1, height: 48, borderRadius: 10, border: 'none',
                  background: (addModalRoles.length === 0 || !tagName || !chargeCode || saveLoading) ? '#C8CCE0' : '#6366F1',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: (addModalRoles.length === 0 || !tagName || !chargeCode || saveLoading) ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s', outline: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
                onMouseEnter={e => {
                  if (!(addModalRoles.length === 0 || !tagName || !chargeCode || saveLoading)) (e.currentTarget.style as any).background = '#5B5FDE'
                }}
                onMouseLeave={e => {
                  if (!(addModalRoles.length === 0 || !tagName || !chargeCode || saveLoading)) (e.currentTarget.style as any).background = '#6366F1'
                }}
              >
                {saveLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Tag'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
