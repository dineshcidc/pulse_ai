import { useState } from 'react'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  User, Users, Building2,
  CheckCircle2,
} from 'lucide-react'

type Role = 'employee' | 'manager' | 'admin'

interface RoleConfig {
  label: string
  shortLabel: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  greeting: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any
  features: string[]
  accentLight: string
  accentText: string
}

const ROLES: Record<Role, RoleConfig> = {
  employee: {
    label: 'Employee',
    shortLabel: 'Employee',
    description: 'Access your workspace, tasks, and timesheets',
    emailLabel: 'Work Email',
    emailPlaceholder: 'you@company.com',
    greeting: 'Welcome back',
    Icon: User,
    features: ['Daily Task Management', 'Timesheet Tracking', 'Team Collaboration'],
    accentLight: 'bg-blue-50',
    accentText: 'text-blue-600',
  },
  manager: {
    label: 'Project Manager',
    shortLabel: 'Manager',
    description: 'Manage your teams, projects, and delivery pipelines',
    emailLabel: 'Manager Email',
    emailPlaceholder: 'manager@company.com',
    greeting: 'Good to see you',
    Icon: Users,
    features: ['Project Oversight', 'Resource Planning', 'Team Analytics'],
    accentLight: 'bg-amber-50',
    accentText: 'text-amber-600',
  },
  admin: {
    label: 'Company Admin',
    shortLabel: 'Admin',
    description: 'Full organizational control and workforce insights',
    emailLabel: 'Admin Email',
    emailPlaceholder: 'admin@yourcompany.com',
    greeting: 'Admin Access',
    Icon: Building2,
    features: ['Workforce Analytics', 'Role Management', 'Company Settings'],
    accentLight: 'bg-violet-50',
    accentText: 'text-violet-600',
  },
}

const ROLE_ORDER: Role[] = ['employee', 'manager', 'admin']

const BRAND = {
  navy: '#1C2035',
  navyLight: '#252C45',
  gold: '#F2D000',
  coral: '#E84855',
  amber: '#F5A623',
  surface: '#F0F2F8',
  card: '#FFFFFF',
  border: '#E4E6EF',
  muted: '#8B90A7',
  placeholder: '#C1C4D0',
  input: '#F8F9FC',
}

interface LoginPageProps {
  onLoginSuccess: (role: Role) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [activeRole, setActiveRole] = useState<Role>('employee')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const config = ROLES[activeRole]
  const roleIndex = ROLE_ORDER.indexOf(activeRole)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(activeRole)
    }, 1800)
  }

  return (
    <div className="min-h-screen flex" style={{ background: BRAND.surface, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex w-[46%] flex-col relative overflow-hidden"
        style={{ background: BRAND.navy }}
      >
        {/* Dot grid + floating glow + moving orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <style>{`
            @keyframes glowDrift {
              0%   { transform: translate(0px, 0px); }
              33%  { transform: translate(30px, -40px); }
              66%  { transform: translate(-20px, 30px); }
              100% { transform: translate(0px, 0px); }
            }
            @keyframes glowDrift2 {
              0%   { transform: translate(0px, 0px); }
              33%  { transform: translate(-35px, 25px); }
              66%  { transform: translate(20px, -30px); }
              100% { transform: translate(0px, 0px); }
            }
            .glow1 { animation: glowDrift 22s ease-in-out infinite; }
            .glow2 { animation: glowDrift2 28s ease-in-out infinite; }
          `}</style>

          {/* Dot grid via SVG pattern */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.04)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Soft gold glow — top left */}
          <div
            className="glow1 absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(242,208,0,0.09) 0%, transparent 65%)' }}
          />

          {/* Soft coral glow — bottom right */}
          <div
            className="glow2 absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,72,85,0.07) 0%, transparent 65%)' }}
          />

        </div>

        {/* Logo */}
        <div className="relative z-10 px-10 pt-12 pb-6">
          <img
            src="/logo.png"
            alt="Concert IDC"
            className="h-9 select-none"
            style={{ filter: 'brightness(1) drop-shadow(0 0 12px rgba(242,208,0,0.15))' }}
          />
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-6">
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6"
              style={{
                background: `${BRAND.gold}15`,
                border: `1px solid ${BRAND.gold}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: BRAND.gold }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: BRAND.gold }}
              >
                Workforce Intelligence
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white mb-4">
              The Platform Your<br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.amber})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Workforce Trusts
              </span>
            </h1>
            <p className="text-base leading-relaxed w-full" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Streamline employee operations, monitor project progress, and manage your organization from one intelligent platform designed for modern teams.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { value: '120+', label: 'Active Employees' },
              { value: '18+',  label: 'Active Projects'  },
              { value: '6',    label: 'Departments'      },
            ].map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Role selector sidebar */}
          <div className="space-y-2">
            {ROLE_ORDER.map((role) => {
              const r = ROLES[role]
              const RoleIcon = r.Icon
              const isActive = role === activeRole
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? `${BRAND.gold}14` : 'transparent',
                    border: `1px solid ${isActive ? `${BRAND.gold}28` : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isActive ? `${BRAND.gold}22` : 'rgba(255,255,255,0.07)',
                    }}
                  >
                    <RoleIcon
                      size={15}
                      style={{ color: isActive ? BRAND.gold : 'rgba(255,255,255,0.35)' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-sm font-medium leading-tight"
                      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}
                    >
                      {r.label}
                    </div>
                    <div
                      className="text-xs mt-0.5 truncate"
                      style={{ color: 'rgba(255,255,255,0.22)' }}
                    >
                      {r.features[0]}
                    </div>
                  </div>
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: BRAND.gold }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 px-10 pb-8">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>
            © 2026 Concert IDC. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[520px]">

          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <img src="/logo.png" alt="Concert IDC" className="h-8" />
          </div>

          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: BRAND.card,
              border: `1px solid ${BRAND.border}`,
            }}
          >
            {/* Tab switcher */}
            <div
              className="relative flex"
              style={{
                background: '#F7F8FA',
                borderBottom: `1px solid ${BRAND.border}`,
              }}
            >
              {/* Sliding bottom indicator */}
              <div
                className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
                style={{
                  width: `${100 / 3}%`,
                  left: `${(roleIndex * 100) / 3}%`,
                  background: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.navyLight})`,
                  borderRadius: '2px 2px 0 0',
                }}
              />
              {ROLE_ORDER.map((role) => {
                const r = ROLES[role]
                const RoleIcon = r.Icon
                const isActive = role === activeRole
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role)
                      setShowPassword(false)
                    }}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 px-2 transition-all duration-200 cursor-pointer border-none bg-transparent"
                    style={{
                      color: isActive ? BRAND.navy : BRAND.placeholder,
                    }}
                  >
                    <RoleIcon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="text-xs font-semibold tracking-tight">{r.shortLabel}</span>
                  </button>
                )
              })}
            </div>

            {/* Form body */}
            <div className="px-8 py-8">

              {/* Role greeting + badge */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: activeRole === 'employee'
                        ? '#EFF6FF'
                        : activeRole === 'manager'
                        ? '#FFFBEB'
                        : '#F5F3FF',
                      color: activeRole === 'employee'
                        ? '#2563EB'
                        : activeRole === 'manager'
                        ? '#D97706'
                        : '#7C3AED',
                    }}
                  >
                    <config.Icon size={11} strokeWidth={2.5} />
                    {config.label}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight" style={{ color: BRAND.navy }}>
                  {config.greeting}
                </h2>
                <p className="text-sm mt-1.5" style={{ color: BRAND.muted }}>
                  {config.description}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email field */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: BRAND.navy }}
                  >
                    {config.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: BRAND.placeholder }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={config.emailPlaceholder}
                      required
                      className="w-full pl-10 pr-4 py-3.5 text-sm rounded-xl transition-all duration-150 outline-none"
                      style={{
                        background: BRAND.input,
                        border: `1px solid ${BRAND.border}`,
                        color: BRAND.navy,
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = BRAND.gold
                        e.target.style.background = '#fff'
                        e.target.style.boxShadow = `0 0 0 3px ${BRAND.gold}22`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = BRAND.border
                        e.target.style.background = BRAND.input
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: BRAND.navy }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: BRAND.placeholder }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-11 py-3.5 text-sm rounded-xl transition-all duration-150 outline-none"
                      style={{
                        background: BRAND.input,
                        border: `1px solid ${BRAND.border}`,
                        color: BRAND.navy,
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = BRAND.gold
                        e.target.style.background = '#fff'
                        e.target.style.boxShadow = `0 0 0 3px ${BRAND.gold}22`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = BRAND.border
                        e.target.style.background = BRAND.input
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
                      style={{ color: BRAND.placeholder }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.navy)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = BRAND.placeholder)}
                    >
                      {showPassword
                        ? <EyeOff size={15} />
                        : <Eye size={15} />
                      }
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
                    style={{ color: BRAND.muted }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.navy)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = BRAND.muted)}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer group"
                  style={{
                    background: isLoading
                      ? `${BRAND.navy}cc`
                      : BRAND.navy,
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.background = BRAND.navyLight
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.background = BRAND.navy
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in as {config.shortLabel}</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-150 group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: BRAND.border }} />
                <span className="text-xs font-medium" style={{ color: BRAND.placeholder }}>or</span>
                <div className="flex-1 h-px" style={{ background: BRAND.border }} />
              </div>

              {/* SSO */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer"
                style={{
                  background: 'transparent',
                  border: `1px solid ${BRAND.border}`,
                  color: '#4A4F66',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${BRAND.navy}30`
                  e.currentTarget.style.background = '#F8F9FC'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BRAND.border
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                Continue with Microsoft
              </button>

              {/* Role-specific features hint */}
              <div
                className="mt-6 rounded-xl px-4 py-3"
                style={{
                  background: activeRole === 'employee'
                    ? '#EFF6FF'
                    : activeRole === 'manager'
                    ? '#FFFBEB'
                    : '#F5F3FF',
                  border: `1px solid ${
                    activeRole === 'employee'
                      ? '#DBEAFE'
                      : activeRole === 'manager'
                      ? '#FDE68A'
                      : '#DDD6FE'
                  }`,
                }}
              >
                <div
                  className="text-xs font-semibold mb-2"
                  style={{
                    color: activeRole === 'employee'
                      ? '#1D4ED8'
                      : activeRole === 'manager'
                      ? '#B45309'
                      : '#6D28D9',
                  }}
                >
                  {config.label} Access Includes
                </div>
                <div className="space-y-1.5">
                  {config.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2
                        size={12}
                        style={{
                          color: activeRole === 'employee'
                            ? '#2563EB'
                            : activeRole === 'manager'
                            ? '#D97706'
                            : '#7C3AED',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: activeRole === 'employee'
                            ? '#1E40AF'
                            : activeRole === 'manager'
                            ? '#92400E'
                            : '#4C1D95',
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-xs mt-6" style={{ color: BRAND.placeholder }}>
                Don&apos;t have access?{' '}
                <button
                  type="button"
                  className="font-semibold transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
                  style={{ color: BRAND.navy }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = BRAND.navy)}
                >
                  Contact your administrator
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
