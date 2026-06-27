import { useState, useRef, useEffect } from 'react'
import {
  Bell, HelpCircle, ChevronDown, PanelLeftClose, PanelLeftOpen,
  LayoutGrid, User, Lock, LogOut, Eye, EyeOff, X,
  CalendarCheck, FileText, TicketCheck, TrendingUp, Megaphone,
  Paperclip, Download, Search, Image, Link as LinkIcon,
} from 'lucide-react'
import RecognitionBadge from '../RecognitionBadge'

interface HeaderProps {
  isSidebarOpen:    boolean
  onToggleSidebar:  () => void
  onNavigate?:      (id: string) => void
  onLogout?:        () => void
  userRole?:        string
}

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  muted:  '#8B90A7',
  border: '#E4E6EF',
  hover:  '#F0F2F8',
  icon:   '#F7F8FA',
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44,
  paddingLeft: 14, paddingRight: 44,
  border: '1px solid #E8EAF2', borderRadius: 11,
  fontSize: 13.5, fontWeight: 500, color: '#1C2035',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'DM Sans', system-ui, sans-serif",
}

function PwdInput({
  label, value, show, onChange, onToggle, placeholder,
}: {
  label: string; value: string; show: boolean
  onChange: (v: string) => void; onToggle: () => void; placeholder?: string
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: '#8B90A7', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? label}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: '#8B90A7', padding: 0,
          }}
        >
          {show ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  )
}

function strengthLevel(pwd: string) {
  if (!pwd) return null
  if (pwd.length < 6)  return { label: 'Weak',   color: '#E84855', pct: 30 }
  if (pwd.length < 10) return { label: 'Medium', color: '#D97706', pct: 65 }
  return                      { label: 'Strong',  color: '#0EA86A', pct: 100 }
}

const NOTIFICATIONS = [
  { id: 1, unread: true, Icon: CalendarCheck, iconColor: '#0EA86A', iconBg: 'rgba(14,168,106,0.10)', title: 'Leave Request Approved', desc: 'Your 2-day annual leave (May 26–27) has been approved by HR.', time: '2 min ago' },
  { id: 2, unread: true, Icon: FileText, iconColor: '#0D9488', iconBg: 'rgba(13,148,136,0.10)', title: 'Payslip Ready', desc: 'Your salary slip for April 2025 is now available to download.', time: '1 hr ago' },
  { id: 3, unread: true, Icon: TicketCheck, iconColor: '#D97706', iconBg: 'rgba(217,119,6,0.10)', title: 'Ticket #TK-0042 Resolved', desc: 'Your IT support request has been resolved. Please verify and close.', time: '3 hrs ago' },
  { id: 4, unread: false, Icon: TrendingUp, iconColor: '#7C3AED', iconBg: 'rgba(124,58,237,0.10)', title: 'Increment Processed', desc: 'Your annual increment of 12% has been processed effective May 1.', time: 'Yesterday' },
] as const

const ANNOUNCEMENTS = [
  { id: 1, title: 'Q3 Performance Reviews', subtext: 'Review cycle begins June 20th', description: 'The Q3 performance review cycle begins on June 20th, 2026. All employees will receive individual review schedules via email. Please ensure your profile is up-to-date with recent achievements and projects.', attachments: [{ type: 'file', name: 'Q3_Guidelines.pdf', size: '2.4 MB' }], senderName: 'Priya Mehta', senderRole: 'Manager', senderDate: 'Jun 15, 2026', priority: 'Important' },
  { id: 2, title: 'Company Town Hall - June 22nd', subtext: 'Quarterly meeting at 3:00 PM IST', description: 'You\'re cordially invited to our Q2 Town Hall meeting! Join us on June 22nd at 3:00 PM IST for an update on company performance, strategic initiatives, and Q&A session with the leadership team.', attachments: [{ type: 'file', name: 'Zoom_Link.pdf', size: '0.8 MB' }], senderName: 'Rajesh Kumar', senderRole: 'Admin', senderDate: 'Jun 14, 2026', priority: 'Urgent' },
  { id: 3, title: 'Updated Work From Home Policy', subtext: 'New flexible policy effective July 1st', description: 'Effective July 1st, 2026, we are introducing an enhanced flexible work policy. Employees can now choose between 3 models: Full Remote (5 days), Hybrid (3 days office), or Office-Based (5 days).', attachments: [], senderName: 'Sarah Johnson', senderRole: 'Manager', senderDate: 'Jun 12, 2026', priority: 'Normal' },
  { id: 4, title: 'Summer Campus Recruitment', subtext: 'Apply by June 30th for internships', description: 'We are excited to announce our Summer 2026 Campus Recruitment Drive. We are hiring talented students for internship programs across Engineering, Product, Design, and Business roles.', attachments: [{ type: 'file', name: 'Application_Form.pdf', size: '3.2 MB' }, { type: 'file', name: 'Roles.docx', size: '1.5 MB' }], senderName: 'Ankit Singh', senderRole: 'Manager', senderDate: 'Jun 10, 2026', priority: 'Important' },
  { id: 5, title: 'Product Launch: Pulse.AI v2.0', subtext: 'New features and improvements', description: 'Introducing Pulse.AI v2.0 with groundbreaking AI-powered features, enhanced performance, and an improved user experience. Check out our product launch video and download the technical documentation.', attachments: [{ type: 'image', name: 'Product_Launch_Banner', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop' }, { type: 'link', name: 'Watch Product Demo', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }], senderName: 'Alex Chen', senderRole: 'Manager', senderDate: 'Jun 18, 2026', priority: 'Important' },
  { id: 6, title: 'Team Outing - Adventure Sports Day', subtext: 'Fun activities and team bonding', description: 'Join us for an exciting day of adventure sports and team building activities! We\'ll have rock climbing, zip-lining, obstacle course, and lots of fun games. Food and beverages will be provided throughout the day.', attachments: [{ type: 'image', name: 'Outing_Photos', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop' }, { type: 'link', name: 'Register Here', url: 'https://forms.google.com/team-outing-2026' }], senderName: 'Neha Desai', senderRole: 'Manager', senderDate: 'Jun 17, 2026', priority: 'Normal' },
] as const

// Sample recognition data - in real app, this would come from API
const CURRENT_RECOGNITION = {
  id: 1,
  tagName: 'Explore the Spotlight',
  title: 'Congratulations to our Rising Stars!',
  description: 'Recognition for outstanding performance in June 2026. You have been recognized for your exceptional contributions, dedication, and outstanding performance that exceeded expectations. Your commitment to excellence and teamwork has made a significant impact on our organization.',
  recipients: 42,
  date: 'Jun 15, 2026',
}

export default function Header({ isSidebarOpen, onToggleSidebar, onNavigate, onLogout, userRole = 'Employee' }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [announcOpen, setAnnouncOpen] = useState(false)
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<number>>(new Set())
  const [announcSearch, setAnnouncSearch] = useState('')
  const [announcFilter, setAnnouncFilter] = useState<string | null>(null)
  const [readAnnouncements, setReadAnnouncements] = useState<Set<number>>(new Set())
  const [announcTab, setAnnouncTab] = useState<'unread' | 'read'>('unread')
  const [profileOpen, setProfileOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [showChangePwd, setShowChangePwd] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdSuccess, setPwdSuccess] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  const toggleExpandAnnouncement = (id: number) => {
    setExpandedAnnouncements(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredAnnouncements = ANNOUNCEMENTS.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(announcSearch.toLowerCase()) || ann.subtext.toLowerCase().includes(announcSearch.toLowerCase())
    const matchesFilter = !announcFilter || ann.priority === announcFilter
    const isRead = readAnnouncements.has(ann.id)
    const matchesTab = announcTab === 'unread' ? !isRead : isRead
    return matchesSearch && matchesFilter && matchesTab
  })

  async function handleConfirmLogout() {
    setLogoutLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLogoutLoading(false)
    setShowLogout(false)
    onLogout?.()
  }

  async function handleSavePassword() {
    setPwdError('')
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError('Please fill in all fields.')
      return
    }
    if (newPwd.length < 6) {
      setPwdError('New password must be at least 6 characters.')
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New password and confirm password do not match.')
      return
    }
    setPwdLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setPwdLoading(false)
    setPwdSuccess(true)
    await new Promise(r => setTimeout(r, 1800))
    resetChangePwd()
  }

  function resetChangePwd() {
    setShowChangePwd(false)
    setPwdSuccess(false)
    setPwdError('')
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
    setShowCur(false); setShowNew(false); setShowConf(false)
  }

  const strength = strengthLevel(newPwd)

  return (
    <>
    <header style={{ height: 68, background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 32px', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <button onClick={onToggleSidebar} style={{ width: 36, height: 36, borderRadius: 11, background: C.icon, color: C.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = C.icon; e.currentTarget.style.color = C.muted }}>{isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button>

      {/* Center: Recognition Badge */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <RecognitionBadge recognition={CURRENT_RECOGNITION} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ width: 36, height: 36, borderRadius: 11, background: C.icon, color: C.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = C.icon; e.currentTarget.style.color = C.muted }}><LayoutGrid size={17} /></button>
        <button style={{ width: 36, height: 36, borderRadius: 11, background: C.icon, color: C.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = C.icon; e.currentTarget.style.color = C.muted }}><HelpCircle size={17} /></button>

        <button onClick={() => setNotifOpen(p => !p)} style={{ width: 36, height: 36, borderRadius: 11, background: notifOpen ? C.hover : C.icon, color: notifOpen ? C.navy : C.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = notifOpen ? C.hover : C.icon; e.currentTarget.style.color = notifOpen ? C.navy : C.muted }}>
          <Bell size={17} />
          {unreadCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#E84855', borderRadius: '50%', border: '1.5px solid #fff' }} />}
        </button>

        <button onClick={() => setAnnouncOpen(p => !p)} style={{ width: 36, height: 36, borderRadius: 11, background: announcOpen ? C.hover : C.icon, color: announcOpen ? C.navy : C.muted, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = announcOpen ? C.hover : C.icon; e.currentTarget.style.color = announcOpen ? C.navy : C.muted }}>
          <Megaphone size={17} />
          <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 20, height: 20, background: '#3B82F6', border: '2px solid #fff', borderRadius: '50%', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
            3
          </span>
        </button>

        <div style={{ width: 1, height: 30, background: C.border }} />

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 11, background: profileOpen ? C.hover : 'transparent', border: 'none', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover }} onMouseLeave={e => { e.currentTarget.style.background = profileOpen ? C.hover : 'transparent' }}>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="JD" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}` }} onError={e => { (e.currentTarget as any).style.display = 'none' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>John Doe</div>
              <div style={{ fontSize: 11, color: C.muted }}>{ userRole}</div>
            </div>
            <ChevronDown size={13} style={{ color: C.muted, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {profileOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 230, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: '0 8px 32px rgba(28,32,53,0.13)', zIndex: 1000, overflow: 'hidden' }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="JD" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}` }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>John Doe</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>EMP-2024-0042 · {userRole}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: 6 }}>
                <button onClick={() => { setProfileOpen(false); onNavigate?.('my-profile') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={15} style={{ color: C.muted }} /></div>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>My Profile</div><div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>View your profile</div></div>
                </button>
                <button onClick={() => { setProfileOpen(false); setShowChangePwd(true) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }} onMouseEnter={e => { e.currentTarget.style.background = C.hover }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={15} style={{ color: C.muted }} /></div>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Change Password</div><div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Update your password</div></div>
                </button>
                <div style={{ height: 1, background: C.border, margin: '4px 8px' }} />
                <button onClick={() => { setProfileOpen(false); setShowLogout(true) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.07)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(232,72,85,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={15} style={{ color: '#E84855' }} /></div>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: '#E84855' }}>Logout</div><div style={{ fontSize: 11, color: 'rgba(232,72,85,0.65)', marginTop: 1 }}>Sign out of your account</div></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {notifOpen && (
      <>
        <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(10,12,28,0.25)' }} />
        <div ref={notifRef} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, zIndex: 8001, background: '#fff', borderLeft: `1px solid ${C.border}`, boxShadow: '-8px 0 40px rgba(28,32,53,0.13)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '22px 24px 18px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Notifications</div><p style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Stay updated</p></div>
              <button onClick={() => setNotifOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: C.icon, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
            {NOTIFICATIONS.map(n => { const Icon = n.Icon; return (
              <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, background: '#fff', borderRadius: 14, marginBottom: 12, cursor: 'pointer', position: 'relative', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: n.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={18} style={{ color: n.iconColor }} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#5C6080', lineHeight: 1.6, margin: 0 }}>{n.desc}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      </>
    )}

    {showLogout && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }} onClick={e => { if (e.target === e.currentTarget) setShowLogout(false) }}>
        <div style={{ background: '#fff', borderRadius: 22, padding: '36px 32px 28px', width: 360, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <LogOut size={26} strokeWidth={1.8} style={{ color: '#E84855' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2035', marginBottom: 8 }}>Confirm Logout</div>
          <p style={{ fontSize: 13.5, color: '#8B90A7', lineHeight: 1.65, marginBottom: 28 }}>Are you sure you want to logout?<br />You'll need to sign in again to access your workspace.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowLogout(false)} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: '#8B90A7', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = '#1C2035' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = '#8B90A7' }}>Cancel</button>
            <button onClick={handleConfirmLogout} disabled={logoutLoading} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: logoutLoading ? '#F87171' : '#E84855', color: '#fff', fontSize: 14, fontWeight: 600, cursor: logoutLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {logoutLoading ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'hdrSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Logging out...</>) : 'Yes, Logout'}
            </button>
          </div>
        </div>
        <style>{`@keyframes hdrSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )}

    {showChangePwd && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }} onClick={e => { if (e.target === e.currentTarget) resetChangePwd() }}>
        <div style={{ background: '#fff', borderRadius: 22, padding: '36px 32px 28px', width: 420, boxShadow: '0 24px 64px rgba(10,12,28,0.22)' }}>
          {pwdSuccess ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1C2035', marginBottom: 8 }}>Password Updated</div>
              <p style={{ fontSize: 13.5, color: '#8B90A7', lineHeight: 1.65 }}>Your password has been changed successfully.</p>
            </div>
          ) : (
            <>
              <PwdInput label="Current Password" value={currentPwd} show={showCur} onChange={setCurrentPwd} onToggle={() => setShowCur(p => !p)} />
              <PwdInput label="New Password" value={newPwd} show={showNew} onChange={setNewPwd} onToggle={() => setShowNew(p => !p)} />
              {newPwd && strength && (
                <div style={{ marginTop: -10, marginBottom: 16 }}>
                  <div style={{ height: 4, borderRadius: 4, background: '#E8EAF2', marginBottom: 5 }}><div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: 4 }} /></div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: strength.color }}>{strength.label} password</div>
                </div>
              )}
              <PwdInput label="Confirm Password" value={confirmPwd} show={showConf} onChange={setConfirmPwd} onToggle={() => setShowConf(p => !p)} />
              {pwdError && <div style={{ padding: 12, background: 'rgba(232,72,85,0.10)', border: '1px solid rgba(232,72,85,0.20)', borderRadius: 10, marginBottom: 20, fontSize: 12.5, fontWeight: 600, color: '#E84855' }}>{pwdError}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={resetChangePwd} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid #E8EAF2`, background: '#fff', color: '#8B90A7', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSavePassword} disabled={pwdLoading} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: pwdLoading ? '#A78BFA' : '#7C3AED', color: '#fff', fontSize: 14, fontWeight: 600, cursor: pwdLoading ? 'not-allowed' : 'pointer' }}>Save Changes</button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {announcOpen && (
      <>
        <div onClick={() => setAnnouncOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(10,12,28,0.25)' }} />
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '35%', zIndex: 8001, background: '#fff', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, boxShadow: '-8px 0 40px rgba(28,32,53,0.13)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 24px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(14,168,106,0.04) 100%)' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Announcements</div>
              <p style={{ fontSize: 12.5, color: C.muted, marginTop: 4, margin: '4px 0 0 0' }}>Stay informed</p>
            </div>
            <button onClick={() => setAnnouncOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: C.icon, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = C.icon; e.currentTarget.style.color = C.muted }}>
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {/* Row 1: Full width search bar */}
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={announcSearch}
                onChange={e => setAnnouncSearch(e.target.value)}
                style={{ width: '100%', height: 32, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 11, fontWeight: 500, color: C.navy, background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', system-ui, sans-serif" }}
              />
            </div>

            {/* Row 2: Priority badges (Left) | Unread/Read tabs (Right) with space-between */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              {/* Left side: Priority filter badges */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => setAnnouncFilter(null)} title="All" style={{ padding: '4px 10px', borderRadius: 15, border: `1px solid ${announcFilter === null ? '#3B82F6' : C.border}`, background: announcFilter === null ? 'rgba(59,130,246,0.12)' : '#fff', color: announcFilter === null ? '#3B82F6' : C.muted, fontSize: 9.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { if (announcFilter !== null) { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)' } }} onMouseLeave={e => { if (announcFilter !== null) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  All
                </button>
                <button onClick={() => setAnnouncFilter('Normal')} title="Normal" style={{ padding: '4px 10px', borderRadius: 15, border: `1px solid ${announcFilter === 'Normal' ? '#6C757D' : C.border}`, background: announcFilter === 'Normal' ? 'rgba(108,117,125,0.12)' : '#fff', color: announcFilter === 'Normal' ? '#6C757D' : C.muted, fontSize: 9.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { if (announcFilter !== 'Normal') { e.currentTarget.style.borderColor = '#6C757D'; e.currentTarget.style.background = 'rgba(108,117,125,0.06)' } }} onMouseLeave={e => { if (announcFilter !== 'Normal') { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  Normal
                </button>
                <button onClick={() => setAnnouncFilter('Important')} title="High" style={{ padding: '4px 10px', borderRadius: 15, border: `1px solid ${announcFilter === 'Important' ? '#D97706' : C.border}`, background: announcFilter === 'Important' ? 'rgba(217,119,6,0.12)' : '#fff', color: announcFilter === 'Important' ? '#D97706' : C.muted, fontSize: 9.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { if (announcFilter !== 'Important') { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.background = 'rgba(217,119,6,0.06)' } }} onMouseLeave={e => { if (announcFilter !== 'Important') { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  High
                </button>
                <button onClick={() => setAnnouncFilter('Urgent')} style={{ padding: '4px 10px', borderRadius: 15, border: `1px solid ${announcFilter === 'Urgent' ? '#E84855' : C.border}`, background: announcFilter === 'Urgent' ? 'rgba(232,72,85,0.12)' : '#fff', color: announcFilter === 'Urgent' ? '#E84855' : C.muted, fontSize: 9.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { if (announcFilter !== 'Urgent') { e.currentTarget.style.borderColor = '#E84855'; e.currentTarget.style.background = 'rgba(232,72,85,0.06)' } }} onMouseLeave={e => { if (announcFilter !== 'Urgent') { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  Urgent
                </button>
              </div>

              {/* Right side: Unread/Read tabs */}
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => setAnnouncTab('unread')} style={{ padding: '4px 11px', borderRadius: 6, border: `1px solid ${announcTab === 'unread' ? '#6366F1' : C.border}`, background: announcTab === 'unread' ? 'rgba(99,102,241,0.12)' : '#fff', color: announcTab === 'unread' ? '#6366F1' : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }} onMouseEnter={e => { if (announcTab !== 'unread') { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)' } }} onMouseLeave={e => { if (announcTab !== 'unread') { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  Unread ({ANNOUNCEMENTS.filter(a => !readAnnouncements.has(a.id)).length})
                </button>
                <button onClick={() => setAnnouncTab('read')} style={{ padding: '4px 11px', borderRadius: 6, border: `1px solid ${announcTab === 'read' ? '#6366F1' : C.border}`, background: announcTab === 'read' ? 'rgba(99,102,241,0.12)' : '#fff', color: announcTab === 'read' ? '#6366F1' : C.muted, fontSize: 10, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }} onMouseEnter={e => { if (announcTab !== 'read') { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)' } }} onMouseLeave={e => { if (announcTab !== 'read') { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' } }}>
                  Read ({readAnnouncements.size})
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {filteredAnnouncements.map(ann => {
              const isExpanded = expandedAnnouncements.has(ann.id)
              return (
                <div key={ann.id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '14px', background: isExpanded ? '#F7F8FA' : '#fff', cursor: 'pointer' }} onClick={() => toggleExpandAnnouncement(ann.id)} onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#F7F8FA' }} onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = '#fff' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
                          {ann.title}
                        </div>
                        {readAnnouncements.has(ann.id) && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#0EA86A', background: 'rgba(14,168,106,0.12)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>Read</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 8 }}>
                        {ann.subtext}
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: ann.priority === 'Urgent' ? 'rgba(232,72,85,0.10)' : ann.priority === 'Important' ? 'rgba(217,119,6,0.10)' : 'rgba(108,117,125,0.10)',
                        color: ann.priority === 'Urgent' ? '#E84855' : ann.priority === 'Important' ? '#D97706' : '#6C757D',
                      }}>
                        {ann.priority}
                      </span>
                    </div>
                    {/* Icons: Eye (view) and Checkmark (mark as read) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 2 }}>
                      <Eye size={16} style={{ color: '#6366F1', cursor: 'pointer' }} />
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (readAnnouncements.has(ann.id)) {
                            setReadAnnouncements(p => {
                              const next = new Set(p)
                              next.delete(ann.id)
                              return next
                            })
                          } else {
                            setReadAnnouncements(p => new Set(p).add(ann.id))
                          }
                        }}
                        title={readAnnouncements.has(ann.id) ? 'Mark as unread' : 'Mark as read'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={readAnnouncements.has(ann.id) ? '#0EA86A' : 'none'} stroke={readAnnouncements.has(ann.id) ? '#0EA86A' : '#D0D5E0'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '14px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 12, color: C.navy, lineHeight: 1.6, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                        {ann.description}
                      </div>

                      {/* Mark as Read / Marked Button */}
                      <div style={{ marginBottom: 12 }}>
                        <button
                          onClick={() => {
                            if (readAnnouncements.has(ann.id)) {
                              setReadAnnouncements(p => {
                                const next = new Set(p)
                                next.delete(ann.id)
                                return next
                              })
                            } else {
                              setReadAnnouncements(p => new Set(p).add(ann.id))
                            }
                          }}
                          style={{
                            padding: '6px 14px', borderRadius: 8,
                            background: readAnnouncements.has(ann.id) ? 'rgba(14,168,106,0.12)' : 'rgba(99,102,241,0.12)',
                            border: readAnnouncements.has(ann.id) ? '1px solid rgba(14,168,106,0.22)' : '1px solid rgba(99,102,241,0.22)',
                            color: readAnnouncements.has(ann.id) ? '#0EA86A' : '#6366F1',
                            fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}
                          onMouseEnter={e => {
                            if (readAnnouncements.has(ann.id)) {
                              e.currentTarget.style.background = 'rgba(14,168,106,0.18)'
                            } else {
                              e.currentTarget.style.background = 'rgba(99,102,241,0.18)'
                            }
                          }}
                          onMouseLeave={e => {
                            if (readAnnouncements.has(ann.id)) {
                              e.currentTarget.style.background = 'rgba(14,168,106,0.12)'
                            } else {
                              e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
                            }
                          }}
                        >
                          {readAnnouncements.has(ann.id) ? '✓ Marked as Read' : 'Mark as Read'}
                        </button>
                      </div>

                      {ann.attachments.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                            Attachments
                          </div>
                          {ann.attachments.map((attachment: any, idx) => (
                            <div key={idx}>
                              {attachment.type === 'file' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: idx < ann.attachments.length - 1 ? 8 : 0, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#5B5FDE' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
                                  <Paperclip size={14} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                                      {attachment.name}
                                    </div>
                                    <div style={{ fontSize: 10, color: C.muted }}>
                                      {attachment.size}
                                    </div>
                                  </div>
                                  <Download size={14} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                                </div>
                              )}
                              {attachment.type === 'image' && (
                                <div style={{ overflow: 'hidden', borderRadius: 8, marginBottom: idx < ann.attachments.length - 1 ? 8 : 0, cursor: 'pointer', border: `1px solid ${C.border}` }} onMouseEnter={e => { (e.currentTarget.querySelector('img') as any).style.transform = 'scale(1.05)'; (e.currentTarget.querySelector('div') as any).style.opacity = '1' }} onMouseLeave={e => { (e.currentTarget.querySelector('img') as any).style.transform = 'scale(1)'; (e.currentTarget.querySelector('div') as any).style.opacity = '0' }}>
                                  <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: C.hover }}>
                                    <img src={attachment.url} alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,32,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
                                      <Image size={32} style={{ color: '#fff' }} />
                                    </div>
                                  </div>
                                  <div style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: C.navy, background: '#fff' }}>
                                    {attachment.name}
                                  </div>
                                </div>
                              )}
                              {attachment.type === 'link' && (
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: idx < ann.attachments.length - 1 ? 8 : 0, cursor: 'pointer', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#5B5FDE' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
                                  <LinkIcon size={14} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#5B5FDE' }}>
                                      {attachment.name}
                                    </div>
                                    <div style={{ fontSize: 10, color: C.muted }}>
                                      External link
                                    </div>
                                  </div>
                                  <ChevronDown size={14} style={{ color: '#5B5FDE', flexShrink: 0, transform: 'rotate(-90deg)' }} />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                          Sent By
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                                {ann.senderName}
                              </div>
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: ann.senderRole === 'Admin' ? 'rgba(124,58,237,0.10)' : 'rgba(59,130,246,0.10)', color: ann.senderRole === 'Admin' ? '#7C3AED' : '#3B82F6' }}>
                                {ann.senderRole}
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, textAlign: 'right' }}>
                            {ann.senderDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )}
    </>
  )
}
