import { useState } from 'react'
import { FileText, Search, ChevronDown, X, Eye } from 'lucide-react'
import ExpenseClaimPage from './ExpenseClaimPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

// Sample expense data
const SAMPLE_EXPENSES = [
  { id: 1, date: '19/06/2026', category: 'Outstation Travel', claimHead: 'Air Travel', amount: 15000, status: 'Completed' },
  { id: 2, date: '18/06/2026', category: 'Local Conveyance', claimHead: 'Bus Travel', amount: 500, status: 'Pending' },
  { id: 3, date: '17/06/2026', category: 'Miscellaneous', claimHead: 'Hotel Stay', amount: 8500, status: 'Completed' },
  { id: 4, date: '16/06/2026', category: 'Outstation Travel', claimHead: 'Visa Charges', amount: 2500, status: 'Pending' },
  { id: 5, date: '15/06/2026', category: 'Periodic Official', claimHead: 'Lunch/Dinner', amount: 1200, status: 'Completed' },
]

export default function ExpensePage() {
  const [activeView, setActiveView] = useState<'list' | 'claim'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [viewingExpenseId, setViewingExpenseId] = useState<number | null>(null)

  if (activeView === 'claim') {
    return <ExpenseClaimPage onBack={() => setActiveView('list')} />
  }

  // Filter expenses
  const filteredExpenses = SAMPLE_EXPENSES.filter(exp => {
    const matchesSearch = exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.claimHead.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exp.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Expense Claims
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            View and manage all your submitted expense claims
          </p>
        </div>

        <button
          onClick={() => setActiveView('claim')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 42, paddingLeft: 20, paddingRight: 22,
            background: C.navy, border: 'none', borderRadius: 11,
            fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2a304a' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <FileText size={15} strokeWidth={2.2} />
          Add New Expense
        </button>
      </div>

      {/* ── Filter toolbar (Leave Status style) ── */}
      <div
        style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
          padding: '14px 18px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#B0B4C8', pointerEvents: 'none',
          }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by category or claim head..."
            style={{
              width: '100%', height: 38, borderRadius: 9,
              border: `1px solid ${C.border}`,
              background: '#fff',
              padding: '0 12px 0 34px',
              fontSize: 13, color: C.navy, outline: 'none',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              boxSizing: 'border-box',
              transition: 'all 0.15s',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0,
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />

        {/* From Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>From</span>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            style={{
              height: 38, borderRadius: 9, border: `1px solid ${fromDate ? '#6366F1' : C.border}`,
              background: fromDate ? '#F5F6FF' : C.surface,
              padding: '0 10px', fontSize: 13, color: C.navy, outline: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
          />
        </div>

        {/* To Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>To</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            style={{
              height: 38, borderRadius: 9, border: `1px solid ${toDate ? '#6366F1' : C.border}`,
              background: toDate ? '#F5F6FF' : C.surface,
              padding: '0 10px', fontSize: 13, color: C.navy, outline: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>Status</span>
          <div style={{ position: 'relative' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{
                height: 38, paddingLeft: 12, paddingRight: 36,
                border: `1px solid ${statusFilter !== 'all' ? '#6366F1' : C.border}`,
                background: statusFilter !== 'all' ? '#F5F6FF' : C.surface,
                borderRadius: 9, fontSize: 13, color: C.navy, fontFamily: 'inherit',
                outline: 'none', cursor: 'pointer', appearance: 'none',
                transition: 'all 0.15s',
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown
              size={13} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                color: C.muted, pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Clear filters */}
        {(searchQuery || fromDate || toDate || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('')
              setFromDate('')
              setToDate('')
              setStatusFilter('all')
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 38, padding: '0 14px', borderRadius: 9,
              border: '1px solid rgba(232,72,85,0.25)',
              background: 'rgba(232,72,85,0.06)', color: '#E84855',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,72,85,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,72,85,0.06)'}
          >
            <X size={12} strokeWidth={2.5} /> Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 0.8fr 1fr 0.6fr',
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          padding: '14px 20px',
        }}>
          {['Date', 'Category', 'Claim Head', 'Amount', 'Status', 'Action'].map((header) => (
            <div
              key={header}
              style={{
                fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase',
                letterSpacing: '0.05em', textAlign: header === 'Amount' ? 'left' : header === 'Status' ? 'center' : 'left',
              }}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, idx) => (
            <div
              key={expense.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 0.8fr 1fr 0.6fr',
                borderBottom: idx < filteredExpenses.length - 1 ? `1px solid ${C.border}` : 'none',
                padding: '14px 20px', alignItems: 'center',
                background: '#fff',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >
              {/* Date */}
              <div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>
                {expense.date}
              </div>

              {/* Category */}
              <div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>
                {expense.category}
              </div>

              {/* Claim Head */}
              <div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>
                {expense.claimHead}
              </div>

              {/* Amount */}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0EA86A' }}>
                ₹{expense.amount.toLocaleString('en-IN')}
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700,
                  padding: '4px 12px', borderRadius: 99,
                  background: expense.status === 'Completed'
                    ? 'rgba(14,168,106,0.10)'
                    : 'rgba(245,158,11,0.10)',
                  color: expense.status === 'Completed'
                    ? '#0EA86A'
                    : '#D97706',
                  border: expense.status === 'Completed'
                    ? '1px solid rgba(14,168,106,0.22)'
                    : '1px solid rgba(245,158,11,0.22)',
                }}>
                  {expense.status}
                </span>
              </div>

              {/* Action - Eye Icon */}
              <button
                onClick={() => setViewingExpenseId(expense.id)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: '#fff', border: `1px solid ${C.border}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', color: C.muted, padding: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'
                  e.currentTarget.style.color = '#6366F1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.muted
                }}
                title="View details"
              >
                <Eye size={14} strokeWidth={1.8} />
              </button>
            </div>
          ))
        ) : (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.muted, margin: 0 }}>
              No expenses found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* ── DETAIL VIEW MODAL ── */}
      {viewingExpenseId !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(28, 32, 53, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setViewingExpenseId(null) }}
        >
          {(() => {
            const expense = SAMPLE_EXPENSES.find(e => e.id === viewingExpenseId)
            if (!expense) return null

            return (
              <div style={{
                background: '#fff', borderRadius: 20, width: '90%', maxWidth: 600,
                boxShadow: '0 20px 60px rgba(28, 32, 53, 0.22)', overflow: 'hidden',
              }}>
                {/* Modal Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '24px 32px', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div>
                    <h2 style={{
                      fontSize: 18, fontWeight: 800, color: C.navy, margin: 0,
                      letterSpacing: '-0.3px',
                    }}>
                      Expense Details
                    </h2>
                    <p style={{
                      fontSize: 12.5, color: C.muted, margin: '4px 0 0', fontWeight: 500,
                    }}>
                      {expense.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingExpenseId(null)}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
                      background: '#fff', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                  >
                    <X size={16} style={{ color: C.muted }} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{ padding: '28px 32px' }}>
                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: C.muted,
                        textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        Category
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                        {expense.category}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: C.muted,
                        textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        Claim Head
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                        {expense.claimHead}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: C.muted,
                        textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        Amount
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0EA86A' }}>
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: C.muted,
                        textTransform: 'uppercase', marginBottom: 6,
                      }}>
                        Status
                      </div>
                      <span style={{
                        display: 'inline-block', fontSize: 12, fontWeight: 700,
                        padding: '5px 14px', borderRadius: 99,
                        background: expense.status === 'Completed'
                          ? 'rgba(14,168,106,0.10)'
                          : 'rgba(245,158,11,0.10)',
                        color: expense.status === 'Completed'
                          ? '#0EA86A'
                          : '#D97706',
                        border: expense.status === 'Completed'
                          ? '1px solid rgba(14,168,106,0.22)'
                          : '1px solid rgba(245,158,11,0.22)',
                      }}>
                        {expense.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: C.muted,
                      textTransform: 'uppercase', marginBottom: 6,
                    }}>
                      Description
                    </div>
                    <div style={{
                      fontSize: 13, color: C.navy, lineHeight: 1.5,
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '10px 12px',
                    }}>
                      Business travel for client meeting at Mumbai office. Includes flight and accommodation.
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: C.muted,
                      textTransform: 'uppercase', marginBottom: 8,
                    }}>
                      Supporting Documents
                    </div>
                    <div style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <FileText size={16} style={{ color: '#6366F1', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 600, color: C.navy,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          expense_receipt_19062026.pdf
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>245 KB</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
                  padding: '20px 32px', borderTop: `1px solid ${C.border}`,
                  background: C.surface,
                }}>
                  <button
                    onClick={() => setViewingExpenseId(null)}
                    style={{
                      height: 42, paddingLeft: 24, paddingRight: 26,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 600, color: C.muted, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#C8CCE0'
                      e.currentTarget.style.color = C.navy
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = C.border
                      e.currentTarget.style.color = C.muted
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
