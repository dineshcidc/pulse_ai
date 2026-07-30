import { useState, useRef, useEffect } from 'react'
import {
  Search, X, ChevronLeft, ChevronRight, FileSpreadsheet,
  ClipboardList, Users, Briefcase,
  CalendarDays, Clock, Download, Eye, ArrowLeft,
} from 'lucide-react'
import DateRangePicker from '../../../components/reports/DateRangePicker'

/* ── Constants ── */
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }
const MONTH_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function weekdaysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + 'T00:00:00'), b = new Date(toIso + 'T00:00:00')
  if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return 0
  let n = 0; const d = new Date(a)
  while (d <= b) { const wd = d.getDay(); if (wd !== 0 && wd !== 6) n++; d.setDate(d.getDate() + 1) }
  return n
}
function fmtNice(iso: string) { const dt = new Date(iso + 'T00:00:00'); return `${String(dt.getDate()).padStart(2, '0')} ${MONTH_SHORT[dt.getMonth()]} ${dt.getFullYear()}` }
const MONTH_DAYS   = [31,28,28,31,30,31,30,31,31,30,31,30]
const WORKING_PER_MONTH = [22,20,21,22,22,21,23,21,22,23,20,23]

/* ── Types ── */
type Status = 'Approved' | 'Pending' | 'Rejected'

interface Employee  { empId: string; name: string; avatar: number; department: string; role: string }
interface Project   { id: string; name: string; empIds: string[] }
interface MonthOption { label: string; value: string; working: number; range: string }

interface Entry {
  id: number
  employee: string; avatar: number; empId: string; department: string
  project: string; manager: string
  date: string; task: string; taskType: string
  hours: number; status: Status
}

interface EmployeeSummary {
  employee: string; avatar: number; empId: string
  department: string; project: string; manager: string; role: string
  entries: Entry[]; totalHours: number
  dateFrom: string; dateTo: string
  approvedCount: number; pendingCount: number; rejectedCount: number
  approvedHours: number; pendingHours: number; rejectedHours: number
  taskTypeBreakdown: { type: string; hours: number }[]
  reportMonth: string; reportRange: string
}

/* ── Style configs ── */
const STATUS_CFG: Record<Status, { color: string; bg: string; border: string; dot: string }> = {
  Approved: { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.20)', dot: '#16A34A' },
  Pending:  { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)', dot: '#F59E0B' },
  Rejected: { color: '#E84855', bg: 'rgba(232,72,85,0.08)',  border: 'rgba(232,72,85,0.20)',  dot: '#E84855' },
}

const TASK_TYPE_CFG: Record<string, { color: string; bg: string }> = {
  'Development':   { color: '#4B4ECC', bg: 'rgba(75,78,204,0.08)'   },
  'Design':        { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)'  },
  'Testing':       { color: '#D97706', bg: 'rgba(245,158,11,0.08)'  },
  'Meeting':       { color: '#0EA86A', bg: 'rgba(14,168,106,0.08)'  },
  'Review':        { color: '#0891B2', bg: 'rgba(8,145,178,0.08)'   },
  'Documentation': { color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
  'DevOps':        { color: '#059669', bg: 'rgba(5,150,105,0.08)'   },
  'Analysis':      { color: '#DB2777', bg: 'rgba(219,39,119,0.08)'  },
}

/* ── Static data ── */
const ALL_EMPLOYEES: Employee[] = [
  { empId:'EMP-0047', name:'Sarah Johnson',    avatar:47, department:'Engineering',  role:'Senior Engineer'    },
  { empId:'EMP-0033', name:'Mike Chen',        avatar:33, department:'QA & Testing', role:'QA Manager'         },
  { empId:'EMP-0044', name:'Emma Wilson',      avatar:44, department:'Design',       role:'UI/UX Designer'     },
  { empId:'EMP-0052', name:'Arjun Patel',      avatar:52, department:'QA & Testing', role:'QA Engineer'        },
  { empId:'EMP-0036', name:'Anjali Singh',     avatar:36, department:'Product',      role:'Product Analyst'    },
  { empId:'EMP-0060', name:'James Wilson',     avatar:12, department:'Engineering',  role:'Backend Engineer'   },
  { empId:'EMP-0041', name:'Fatima Al-Zahra',  avatar:41, department:'Design',       role:'Design Lead'        },
  { empId:'EMP-0056', name:'Karthik Nair',     avatar:15, department:'Engineering',  role:'Full Stack Dev'     },
  { empId:'EMP-0008', name:'David Brown',      avatar:8,  department:'Engineering',  role:'Platform Engineer'  },
  { empId:'EMP-0025', name:'Lisa Garcia',      avatar:25, department:'QA & Testing', role:'QA Lead'            },
  { empId:'EMP-0031', name:'Priya Sharma',     avatar:31, department:'Product',      role:'Product Manager'    },
]

const ALL_PROJECTS: Project[] = [
  { id:'p1', name:'Pulse.AI v2',   empIds:['EMP-0047','EMP-0044','EMP-0060'] },
  { id:'p2', name:'HDFC Portal',   empIds:['EMP-0033','EMP-0036','EMP-0041'] },
  { id:'p3', name:'TechCorp ERP',  empIds:['EMP-0052','EMP-0056']            },
  { id:'p4', name:'Retail CRM',    empIds:['EMP-0008','EMP-0025']            },
  { id:'p5', name:'FinTrack App',  empIds:['EMP-0031','EMP-0047']            },
  { id:'p6', name:'CloudSync Pro', empIds:['EMP-0056','EMP-0044']            },
  { id:'p7', name:'MediLink HMS',  empIds:['EMP-0052','EMP-0041']            },
]

const EMP_PRIMARY_PROJECT: Record<string, string> = {
  'EMP-0047':'Pulse.AI v2', 'EMP-0033':'HDFC Portal',  'EMP-0044':'Pulse.AI v2',
  'EMP-0052':'TechCorp ERP','EMP-0036':'HDFC Portal',  'EMP-0060':'Pulse.AI v2',
  'EMP-0041':'HDFC Portal', 'EMP-0056':'TechCorp ERP', 'EMP-0008':'Retail CRM',
  'EMP-0025':'Retail CRM',  'EMP-0031':'FinTrack App',
}

const DATA: Entry[] = [
  { id:  1, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-26', taskType:'Development',   task:'Frontend API Integration',               hours:8.0, status:'Approved' },
  { id:  2, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-25', taskType:'Development',   task:'UI Component Development',               hours:7.5, status:'Approved' },
  { id:  3, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-24', taskType:'Review',        task:'Code Review & Testing',                  hours:6.0, status:'Pending'  },
  { id:  4, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-23', taskType:'Meeting',       task:'Sprint Planning Meeting',                hours:3.0, status:'Approved' },
  { id:  5, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-22', taskType:'Development',   task:'Bug Fix — Dashboard Module',             hours:8.0, status:'Approved' },
  { id:  6, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-26', taskType:'Testing',       task:'Backend API Testing',                    hours:7.0, status:'Pending'  },
  { id:  7, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-25', taskType:'Development',   task:'Database Query Optimization',            hours:8.0, status:'Approved' },
  { id:  8, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-23', taskType:'Documentation', task:'API Documentation',                      hours:5.5, status:'Approved' },
  { id:  9, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-22', taskType:'Testing',       task:'Unit Test Coverage',                     hours:7.0, status:'Approved' },
  { id: 10, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-21', taskType:'Testing',       task:'Integration Testing',                    hours:6.0, status:'Rejected' },
  { id: 11, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-26', taskType:'Design',        task:'Design System — Component Library',      hours:6.0, status:'Pending'  },
  { id: 12, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-24', taskType:'Design',        task:'Figma Prototype — Dashboard',            hours:7.5, status:'Approved' },
  { id: 13, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-23', taskType:'Review',        task:'UX Review & Feedback Session',           hours:4.0, status:'Approved' },
  { id: 14, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-22', taskType:'Design',        task:'Mobile Responsive Design',               hours:7.0, status:'Approved' },
  { id: 15, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-26', taskType:'Development',   task:'ERP Module — Payroll Integration',        hours:8.0, status:'Approved' },
  { id: 16, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-25', taskType:'Testing',       task:'Performance Testing Suite',              hours:6.5, status:'Approved' },
  { id: 17, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-24', taskType:'Development',   task:'Database Schema Migration',              hours:7.0, status:'Pending'  },
  { id: 18, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-23', taskType:'Analysis',      task:'Requirements Walkthrough',               hours:3.5, status:'Approved' },
  { id: 19, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-21', taskType:'Testing',       task:'Integration Test Cases',                 hours:6.0, status:'Approved' },
  { id: 20, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-26', taskType:'Analysis',      task:'Product Roadmap Review',                 hours:4.0, status:'Approved' },
  { id: 21, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-25', taskType:'Meeting',       task:'Stakeholder Sync Meeting',               hours:3.0, status:'Approved' },
  { id: 22, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-24', taskType:'Analysis',      task:'Feature Specification — Loans Module',   hours:7.0, status:'Pending'  },
  { id: 23, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-23', taskType:'Analysis',      task:'User Story Grooming',                    hours:5.5, status:'Approved' },
  { id: 24, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-22', taskType:'Meeting',       task:'Sprint Review Preparation',              hours:4.5, status:'Approved' },
  { id: 25, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-26', taskType:'DevOps',        task:'DevOps Pipeline Setup',                  hours:7.0, status:'Pending'  },
  { id: 26, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-25', taskType:'Review',        task:'Server Infrastructure Review',           hours:5.5, status:'Approved' },
  { id: 27, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-24', taskType:'Development',   task:'Backend Service Optimization',           hours:8.0, status:'Approved' },
  { id: 28, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-22', taskType:'Review',        task:'Security Audit Implementation',          hours:6.0, status:'Approved' },
  { id: 29, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-26', taskType:'Design',        task:'Portal Redesign — Home Page',            hours:7.5, status:'Pending'  },
  { id: 30, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-25', taskType:'Analysis',      task:'User Research Analysis',                 hours:5.0, status:'Approved' },
  { id: 31, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-23', taskType:'Review',        task:'Wireframe Review Session',               hours:4.0, status:'Approved' },
  { id: 32, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-22', taskType:'Design',        task:'Design Handoff — Dev Team',              hours:6.5, status:'Approved' },
  { id: 33, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-26', taskType:'DevOps',        task:'API Gateway Configuration',              hours:8.0, status:'Approved' },
  { id: 34, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-25', taskType:'Testing',       task:'Module Testing & Validation',            hours:6.5, status:'Approved' },
  { id: 35, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-24', taskType:'Review',        task:'Code Review Session',                    hours:4.0, status:'Approved' },
  { id: 36, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-23', taskType:'Development',   task:'ERP Core Module Development',            hours:8.0, status:'Pending'  },
  { id: 37, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-21', taskType:'Meeting',       task:'Sprint Planning — Q2',                   hours:3.0, status:'Approved' },
  { id: 38, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-26', taskType:'Development',   task:'CRM Dashboard Development',              hours:7.5, status:'Approved' },
  { id: 39, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-25', taskType:'Development',   task:'Customer Profile Module',                hours:6.0, status:'Approved' },
  { id: 40, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-23', taskType:'Development',   task:'Lead Management Integration',            hours:5.5, status:'Pending'  },
  { id: 41, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-26', taskType:'Testing',       task:'CRM Regression Test Suite',              hours:6.5, status:'Pending'  },
  { id: 42, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-24', taskType:'Testing',       task:'End-to-End Flow Testing',                hours:7.0, status:'Approved' },
  { id: 43, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-22', taskType:'Testing',       task:'Bug Report & Triage Session',            hours:4.5, status:'Approved' },
  { id: 44, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-26', taskType:'Analysis',      task:'Finance Module Specification',           hours:5.0, status:'Approved' },
  { id: 45, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-24', taskType:'Review',        task:'Budget Tracker UI Review',               hours:6.5, status:'Approved' },
  { id: 46, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-22', taskType:'Design',        task:'Expense Report Flow Design',             hours:7.0, status:'Pending'  },
  { id: 47, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'FinTrack App',  manager:'David Brown',  date:'2026-05-21', taskType:'Development',   task:'API Integration — Payment Gateway',       hours:8.0, status:'Approved' },
  { id: 54, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-27', taskType:'Design',        task:'Dashboard Redesign — New Components',    hours:7.5, status:'Approved' },
  { id: 55, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-27', taskType:'Testing',       task:'Load Testing — Payment Flow',            hours:7.0, status:'Approved' },
  { id: 56, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-27', taskType:'Review',        task:'Icon Set Design — Final Review',         hours:5.5, status:'Approved' },
  { id: 57, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-27', taskType:'Development',   task:'ERP Billing Module — Integration',        hours:8.0, status:'Approved' },
  { id: 58, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-27', taskType:'Meeting',       task:'Backlog Refinement Session',             hours:3.5, status:'Approved' },
  { id: 59, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-27', taskType:'DevOps',        task:'CI/CD Pipeline Optimization',            hours:7.0, status:'Approved' },
  { id: 60, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-27', taskType:'Review',        task:'Accessibility Audit — Portal',           hours:6.0, status:'Approved' },
  { id: 61, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-27', taskType:'DevOps',        task:'API Rate Limiting Implementation',        hours:7.5, status:'Approved' },
  { id: 62, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-27', taskType:'Development',   task:'CRM Reports Module Development',         hours:7.0, status:'Approved' },
  { id: 63, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-27', taskType:'Testing',       task:'Automation Test Scripts',                hours:7.0, status:'Approved' },
  { id: 64, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-27', taskType:'Analysis',      task:'Investment Portfolio Module Review',      hours:6.0, status:'Approved' },
  { id: 65, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-28', taskType:'Development',   task:'Performance Optimization — React Query',  hours:6.0, status:'Approved' },
  { id: 66, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-28', taskType:'Development',   task:'Bug Fixes — Portal Login Module',         hours:6.5, status:'Approved' },
  { id: 67, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-28', taskType:'Design',        task:'Responsive Layout — Mobile Views',        hours:7.0, status:'Approved' },
  { id: 68, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-28', taskType:'Testing',       task:'Data Migration Script Testing',          hours:6.0, status:'Approved' },
  { id: 69, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-28', taskType:'Meeting',       task:'Feature Demo Preparation',               hours:5.5, status:'Approved' },
  { id: 70, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-28', taskType:'DevOps',        task:'Server Monitoring Setup',                hours:6.0, status:'Approved' },
  { id: 71, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-28', taskType:'Design',        task:'Component Library Update',               hours:5.5, status:'Approved' },
  { id: 72, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-28', taskType:'DevOps',        task:'Load Balancer Configuration',            hours:6.0, status:'Approved' },
  { id: 73, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-28', taskType:'Development',   task:'Email Campaign Integration',             hours:6.5, status:'Approved' },
  { id: 74, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-28', taskType:'Testing',       task:'Regression Testing Round 2',             hours:6.0, status:'Approved' },
  { id: 75, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-28', taskType:'Review',        task:'Tax Calculation Feature Review',         hours:5.5, status:'Approved' },
  { id: 76, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Meeting',       task:'Sprint Review Preparation',              hours:4.0, status:'Pending'  },
  { id: 77, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-29', taskType:'Documentation', task:'QA Sign-off Report',                     hours:5.0, status:'Pending'  },
  { id: 78, employee:'Emma Wilson',      avatar:44, empId:'EMP-0044', department:'Design',       project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Review',        task:'Design QA Session',                      hours:3.5, status:'Pending'  },
  { id: 79, employee:'Arjun Patel',      avatar:52, empId:'EMP-0052', department:'QA & Testing', project:'TechCorp ERP',  manager:'Priya Sharma', date:'2026-05-29', taskType:'Testing',       task:'UAT Session Preparation',                hours:4.5, status:'Pending'  },
  { id: 80, employee:'Anjali Singh',     avatar:36, empId:'EMP-0036', department:'Product',      project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-29', taskType:'Analysis',      task:'Stakeholder Update Deck',                hours:4.0, status:'Pending'  },
  { id: 81, employee:'James Wilson',     avatar:12, empId:'EMP-0060', department:'Engineering',  project:'Pulse.AI v2',   manager:'David Brown',  date:'2026-05-29', taskType:'Review',        task:'Deploy Script Review',                   hours:3.0, status:'Pending'  },
  { id: 82, employee:'Fatima Al-Zahra',  avatar:41, empId:'EMP-0041', department:'Design',       project:'HDFC Portal',   manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Meeting',       task:'Design Review Meeting',                  hours:3.0, status:'Pending'  },
  { id: 83, employee:'Karthik Nair',     avatar:15, empId:'EMP-0056', department:'Engineering',  project:'TechCorp ERP',  manager:'David Brown',  date:'2026-05-29', taskType:'DevOps',        task:'Production Deployment Prep',             hours:4.0, status:'Pending'  },
  { id: 84, employee:'David Brown',      avatar:8,  empId:'EMP-0008', department:'Engineering',  project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Meeting',       task:'Sprint Planning Session',                hours:3.5, status:'Pending'  },
  { id: 85, employee:'Lisa Garcia',      avatar:25, empId:'EMP-0025', department:'QA & Testing', project:'Retail CRM',    manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Documentation', task:'Test Coverage Report',                   hours:3.5, status:'Pending'  },
  { id: 86, employee:'Priya Sharma',     avatar:31, empId:'EMP-0031', department:'Product',      project:'FinTrack App',  manager:'David Brown',  date:'2026-05-29', taskType:'Meeting',       task:'Product Backlog Grooming',               hours:4.0, status:'Pending'  },
  { id: 87, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Development',   task:'API Error Handling Fix',                 hours:2.5, status:'Pending'  },
  { id: 88, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-29', taskType:'Meeting',       task:'Daily Standup & Sprint Sync',            hours:0.5, status:'Approved' },
  { id: 96, employee:'Sarah Johnson',    avatar:47, empId:'EMP-0047', department:'Engineering',  project:'Pulse.AI v2',   manager:'Rohan Mehta',  date:'2026-05-24', taskType:'Development',   task:'Hotfix — Login Session Timeout',         hours:2.5, status:'Approved' },
  { id: 98, employee:'Mike Chen',        avatar:33, empId:'EMP-0033', department:'QA & Testing', project:'HDFC Portal',   manager:'Priya Sharma', date:'2026-05-29', taskType:'Testing',       task:'Performance Regression Tests',           hours:2.0, status:'Pending'  },
]

/* ── Helpers ── */
function fmtFull(d: string) {
  const dt = new Date(d + 'T00:00:00')
  const wd = dt.toLocaleDateString('en-US', { weekday: 'short' })
  return `${wd}, ${String(dt.getDate()).padStart(2,'0')} ${dt.toLocaleDateString('en-US',{month:'short'})} ${dt.getFullYear()}`
}
function getMonthOption(month: number, year: number): MonthOption {
  const name = MONTH_NAMES[month], short = MONTH_SHORT[month], days = MONTH_DAYS[month]
  return { label:`${name} ${year}`, value:`${year}-${String(month+1).padStart(2,'0')}`, working:WORKING_PER_MONTH[month], range:`01 ${short} – ${days} ${short} ${year}` }
}
function getYearOption(months: number[], year: number): MonthOption {
  const sorted=[...months].sort((a,b)=>a-b), working=sorted.reduce((s,m)=>s+WORKING_PER_MONTH[m],0), isFull=sorted.length===12
  const f=MONTH_SHORT[sorted[0]], l=MONTH_SHORT[sorted[sorted.length-1]], ld=MONTH_DAYS[sorted[sorted.length-1]]
  return { label:isFull?`Full ${year}`:`${f}–${l} ${year}`, value:`${year}-year`, working, range:isFull?`01 Jan – 31 Dec ${year}`:`01 ${f} – ${ld} ${l} ${year}` }
}
function buildSummary(emp: Employee, entries: Entry[], mo: MonthOption, projName: string): EmployeeSummary {
  const totalHours    = entries.reduce((s,e)=>s+e.hours,0)
  const approvedHours = entries.filter(e=>e.status==='Approved').reduce((s,e)=>s+e.hours,0)
  const pendingHours  = entries.filter(e=>e.status==='Pending').reduce((s,e)=>s+e.hours,0)
  const rejectedHours = entries.filter(e=>e.status==='Rejected').reduce((s,e)=>s+e.hours,0)
  const typeMap = new Map<string,number>()
  entries.forEach(e => typeMap.set(e.taskType,(typeMap.get(e.taskType)??0)+e.hours))
  const taskTypeBreakdown = [...typeMap.entries()].map(([type,hours])=>({type,hours})).sort((a,b)=>b.hours-a.hours)
  const dates = entries.map(e=>e.date).sort()
  return {
    employee:emp.name, avatar:emp.avatar, empId:emp.empId,
    department:emp.department, project:projName, manager:entries[0]?.manager??'—', role:emp.role,
    entries, totalHours, dateFrom:dates[0]??'', dateTo:dates[dates.length-1]??'',
    approvedCount:entries.filter(e=>e.status==='Approved').length,
    pendingCount:entries.filter(e=>e.status==='Pending').length,
    rejectedCount:entries.filter(e=>e.status==='Rejected').length,
    approvedHours, pendingHours, rejectedHours, taskTypeBreakdown,
    reportMonth:mo.label, reportRange:mo.range,
  }
}

/* ── EmpChip ── */
function EmpChip({ emp, onRemove }: { emp: Employee; onRemove: () => void }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, height:30, padding:'0 8px 0 4px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
      <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
      <span style={{ fontSize:12, fontWeight:600, color:'#3730A3', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{emp.name}</span>
      <button onClick={onRemove} style={{ width:16, height:16, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
        <X size={9} style={{ color:'#4338CA' }} />
      </button>
    </div>
  )
}

/* ── MonthPicker ── */
function MonthPicker({ month, year, setMonth, setYear, mode, setMode, yearMonths, setYearMonths, from, to, setFrom, setTo }: {
  month:number; year:number; setMonth:(m:number)=>void; setYear:(y:number)=>void
  mode:'month'|'year'; setMode:(m:'month'|'year')=>void
  yearMonths:number[]; setYearMonths:(ms:number[])=>void
  from:string; to:string; setFrom:(v:string)=>void; setTo:(v:string)=>void
}) {
  function prevMo() { if(month===0){setMonth(11);setYear(year-1)}else setMonth(month-1) }
  function nextMo() { if(month===11){setMonth(0);setYear(year+1)}else setMonth(month+1) }
  function toggleMonth(m:number) { if(yearMonths.includes(m)){ if(yearMonths.length>1) setYearMonths(yearMonths.filter(x=>x!==m)) } else setYearMonths([...yearMonths,m].sort((a,b)=>a-b)) }
  const navBtn = (onClick:()=>void, icon:React.ReactNode, extra?:React.CSSProperties) => (
    <button onClick={onClick} style={{ width:34, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0, ...extra }}
      onMouseEnter={e=>{e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>{icon}</button>
  )
  const allYearSelected = yearMonths.length===12
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${C.border}` }}>
        {(['month','year'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{ height:34, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:600, transition:'all 0.15s', background:mode===m?'#EEF2FF':C.surface, color:mode===m?'#3730A3':C.muted, borderRight:m==='month'?`1px solid ${C.border}`:'none' }}>
            {m==='month'?'Monthly':'Full Year'}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', height:36, background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        {navBtn(()=>setYear(year-1),<ChevronLeft size={12} style={{color:C.muted}}/>,{borderRight:`1px solid ${C.border}`})}
        <span style={{ flex:1, textAlign:'center', fontSize:13, fontWeight:700, color:C.navy, letterSpacing:'0.02em' }}>{year}</span>
        {navBtn(()=>setYear(year+1),<ChevronRight size={12} style={{color:C.muted}}/>,{borderLeft:`1px solid ${C.border}`})}
      </div>
      {mode==='month' && (
        <div style={{ display:'flex', alignItems:'center', height:44 }}>
          {navBtn(prevMo,<ChevronLeft size={15} style={{color:C.navy}}/>,{borderRight:`1px solid ${C.border}`})}
          <span style={{ flex:1, textAlign:'center', fontSize:14, fontWeight:700, color:C.navy }}>{MONTH_NAMES[month]}</span>
          {navBtn(nextMo,<ChevronRight size={15} style={{color:C.navy}}/>,{borderLeft:`1px solid ${C.border}`})}
        </div>
      )}
      {mode==='month' && <DateRangePicker from={from} to={to} setFrom={setFrom} setTo={setTo} />}
      {mode==='year' && (
        <div style={{ padding:'14px 14px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:11.5, fontWeight:600, color:C.muted }}>
              {allYearSelected?<span style={{color:'#4338CA',fontWeight:700}}>Full {year} selected</span>:<span>{yearMonths.length} month{yearMonths.length!==1?'s':''} selected</span>}
            </span>
            <button onClick={()=>setYearMonths(allYearSelected?[4]:Array.from({length:12},(_,i)=>i))}
              style={{ fontSize:11.5, fontWeight:600, color:allYearSelected?'#E84855':'#4338CA', background:'none', border:'none', cursor:'pointer', padding:0 }}>
              {allYearSelected?'Clear':'Select All'}
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
            {MONTH_SHORT.map((name,idx)=>{
              const active=yearMonths.includes(idx)
              return (
                <button key={idx} onClick={()=>toggleMonth(idx)} style={{ height:32, border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:600, transition:'all 0.15s', background:active?'#ECEEF5':C.surface, color:active?C.navy:C.muted }}
                  onMouseEnter={e=>{if(!active){e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.navy}}}
                  onMouseLeave={e=>{if(!active){e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.muted}}}>
                  {name}
                </button>
              )
            })}
          </div>
          {!allYearSelected && yearMonths.length>0 && (
            <div style={{ marginTop:10, padding:'6px 10px', background:'#EEF2FF', borderRadius:7, border:'1px solid #C7D2FE' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#4338CA' }}>{yearMonths.map(m=>MONTH_SHORT[m]).join(', ')} {year}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ── */
function sk(w:number|string,h:number,r:number|string):React.CSSProperties {
  return { width:w, height:h, borderRadius:r, background:'linear-gradient(90deg,#F0F2F8 25%,#E4E6EF 50%,#F0F2F8 75%)', backgroundSize:'1000px 100%', animation:'shimmer 1.4s infinite linear', flexShrink:0 }
}
function SkeletonCard() {
  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:14 }}>
        <div style={sk(44,44,'50%')} />
        <div style={{flex:1}}>
          <div style={{...sk(160,14,6),marginBottom:8}} />
          <div style={sk(220,11,5)} />
        </div>
        <div style={sk(140,28,99)} />
        <div style={sk(32,32,8)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ padding:'16px 20px', borderRight:i<3?`1px solid ${C.border}`:'none' }}>
            <div style={{...sk(18,18,'50%'),marginBottom:8}} />
            <div style={{...sk(40,20,5),marginBottom:6}} />
            <div style={sk(70,11,4)} />
          </div>
        ))}
      </div>
      <div style={{ padding:'12px 20px', display:'flex', gap:6 }}>
        {[0,1,2].map(i=><div key={i} style={sk(70,24,99)} />)}
      </div>
      <div style={{ padding:'10px 20px', background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between' }}>
        <div style={sk(90,11,5)} /><div style={sk(120,11,5)} />
      </div>
    </div>
  )
}

/* ── Timesheet result card (compact row) ── */
function TimesheetCardView({ summary, delay=0, onView }: { summary: EmployeeSummary; delay?:number; onView:()=>void }) {
  const overallStatus: Status = summary.pendingCount > 0 ? 'Pending' : summary.rejectedCount > 0 ? 'Rejected' : 'Approved'
  const sc = STATUS_CFG[overallStatus]

  function fmtS(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }

  const dateLabel = summary.dateFrom && summary.dateTo
    ? summary.dateFrom === summary.dateTo
      ? fmtS(summary.dateFrom)
      : `${fmtS(summary.dateFrom)} — ${fmtS(summary.dateTo)}`
    : summary.reportMonth

  return (
    <div
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, transition: 'box-shadow 0.15s', animation: 'cardIn 0.36s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${delay}ms` }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(28,32,53,0.09)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <img src={`https://i.pravatar.cc/150?img=${((summary.avatar-1)%70)+1}`} alt={summary.employee}
        style={{ width:46, height:46, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{summary.employee}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{summary.department} · {summary.project}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{dateLabel}</div>
      </div>

      <div style={{ textAlign:'center', flexShrink:0, marginRight:4 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#4B4ECC', letterSpacing:'-0.5px', lineHeight:1 }}>{summary.totalHours.toFixed(1)}h</div>
        <div style={{ fontSize:11.5, color:C.muted, marginTop:3 }}>logged</div>
      </div>

      <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:9, fontSize:12.5, fontWeight:700, color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, flexShrink:0 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:sc.dot, flexShrink:0 }} />
        {overallStatus}
      </span>

      <button
        onClick={onView}
        style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.borderColor = C.navy; (e.currentTarget.querySelector('svg') as SVGElement|null)?.setAttribute('stroke','#fff') }}
        onMouseLeave={e => { e.currentTarget.style.background = C.bg;   e.currentTarget.style.borderColor = C.border; (e.currentTarget.querySelector('svg') as SVGElement|null)?.setAttribute('stroke',C.navy) }}
      >
        <Eye size={15} style={{ color: C.navy }} strokeWidth={1.8} />
      </button>
    </div>
  )
}

/* ── EmployeeDateListView (drill-down) ── */
function EmployeeDateListView({ summary, onBack }: { summary: EmployeeSummary; onBack: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleDate(date: string) {
    setExpanded(prev => { const next=new Set(prev); next.has(date)?next.delete(date):next.add(date); return next })
  }

  const dateMap = new Map<string, Entry[]>()
  summary.entries.forEach(e => { if(!dateMap.has(e.date)) dateMap.set(e.date,[]); dateMap.get(e.date)!.push(e) })
  const sortedDates = [...dateMap.keys()].sort((a,b)=>b.localeCompare(a))

  const statBadges = [
    { label:'Total Hours', value:`${summary.totalHours.toFixed(1)}h`, color:'#4B4ECC', bg:'rgba(75,78,204,0.08)', border:'rgba(75,78,204,0.18)' },
    { label:'Approved',    value:summary.approvedCount,               color:'#0A8A58', bg:'rgba(14,168,106,0.08)', border:'rgba(14,168,106,0.20)' },
    { label:'Pending',     value:summary.pendingCount,                color:'#D97706', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.22)' },
  ]

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <button onClick={onBack}
        style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer', color:C.navy, fontSize:12.5, fontWeight:600, padding:'6px 14px', marginBottom:20, transition:'all 0.15s' }}
        onMouseEnter={e=>{e.currentTarget.style.background='#E4E6EF';e.currentTarget.style.borderColor='#D1D4E4'}}
        onMouseLeave={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.borderColor=C.border}}>
        <ArrowLeft size={14} /> Back to Results
      </button>

      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 26px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, minWidth:0 }}>
          <img src={`https://i.pravatar.cc/54?img=${summary.avatar}`} alt={summary.employee}
            style={{ width:54, height:54, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${C.border}` }} />
          <div>
            <p style={{ margin:0, fontSize:16, fontWeight:800, color:C.navy }}>{summary.employee}</p>
            <p style={{ margin:'2px 0 8px', fontSize:12.5, color:C.muted }}>{summary.empId}</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[summary.department, summary.project, `Manager: ${summary.manager}`].map(t=>(
                <span key={t} style={{ padding:'2px 9px', borderRadius:5, fontSize:11.5, fontWeight:600, color:C.navy, background:C.surface, border:`1px solid ${C.border}` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12, flexShrink:0 }}>
          <div style={{ display:'flex', gap:10 }}>
            {statBadges.map(s=>(
              <div key={s.label} style={{ padding:'10px 18px', borderRadius:10, textAlign:'center' as const, background:s.bg, border:`1px solid ${s.border}`, minWidth:76 }}>
                <p style={{ margin:0, fontSize:20, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</p>
                <p style={{ margin:'4px 0 0', fontSize:10, fontWeight:700, color:s.color, opacity:0.75, textTransform:'uppercase' as const, letterSpacing:'0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:6, height:34, padding:'0 16px', borderRadius:8, border:'1px solid rgba(21,128,61,0.30)', background:'rgba(21,128,61,0.08)', color:'#15803D', fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',system-ui,sans-serif", transition:'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(21,128,61,0.15)';e.currentTarget.style.borderColor='rgba(21,128,61,0.50)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(21,128,61,0.08)';e.currentTarget.style.borderColor='rgba(21,128,61,0.30)'}}>
            <Download size={13} strokeWidth={2.2} /> Download Excel
          </button>
        </div>
      </div>

      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 22px', borderBottom:`1px solid ${C.border}`, background:C.surface, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.navy }}>Timesheet by Date</p>
          <span style={{ fontSize:12, color:C.muted }}>{summary.reportMonth} · {summary.reportRange}</span>
        </div>

        {sortedDates.map((date, di) => {
          const entries    = dateMap.get(date)!
          const dayHours   = entries.reduce((s,e)=>s+e.hours,0)
          const hasPending = entries.some(e=>e.status==='Pending')
          const hasReject  = entries.some(e=>e.status==='Rejected')
          const dayStatus: Status = hasPending?'Pending':hasReject?'Rejected':'Approved'
          const dsc   = STATUS_CFG[dayStatus]
          const isOpen= expanded.has(date)
          const isLast= di===sortedDates.length-1

          return (
            <div key={date}>
              <div style={{ display:'flex', alignItems:'center', padding:'14px 22px', gap:14, background:isOpen?'rgba(99,102,241,0.04)':'#fff', borderBottom:`1px solid ${C.border}`, transition:'background 0.15s', cursor:'default' }}
                onMouseEnter={e=>{if(!isOpen)e.currentTarget.style.background=C.surface}}
                onMouseLeave={e=>{if(!isOpen)e.currentTarget.style.background='#fff'}}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:13.5, fontWeight:500, color:C.navy }}>{fmtFull(date)}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                    <Clock size={11} style={{color:C.muted}} />
                    <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{dayHours.toFixed(1)}h logged</span>
                    <span style={{ fontSize:11, color:C.border }}>·</span>
                    <span style={{ fontSize:11.5, color:C.muted }}>{entries.length} {entries.length===1?'entry':'entries'}</span>
                  </div>
                </div>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, flexShrink:0, padding:'4px 11px', borderRadius:6, fontSize:11.5, fontWeight:700, color:dsc.color, background:dsc.bg, border:`1px solid ${dsc.border}` }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:dsc.dot, flexShrink:0 }} />
                  {dayStatus}
                </span>
                <button onClick={()=>toggleDate(date)}
                  style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:isOpen?C.navy:C.bg, border:`1px solid ${isOpen?C.navy:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e=>{if(!isOpen){e.currentTarget.style.background='#E4E6EF';e.currentTarget.style.borderColor='#D1D4E4'}}}
                  onMouseLeave={e=>{if(!isOpen){e.currentTarget.style.background=C.bg;e.currentTarget.style.borderColor=C.border}}}>
                  <Eye size={14} color={isOpen?'#fff':C.navy} />
                </button>
              </div>

              {isOpen && (
                <div style={{ padding:'16px 22px 18px', background:'rgba(247,248,252,0.6)', borderBottom:isLast?'none':`1px solid ${C.border}` }}>
                  {entries.map((entry, ei) => {
                    const esc=STATUS_CFG[entry.status]
                    const ttc=TASK_TYPE_CFG[entry.taskType]??{color:C.muted,bg:C.surface}
                    const isLastEntry=ei===entries.length-1
                    return (
                      <div key={entry.id} style={{ display:'flex', gap:0 }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:22, flexShrink:0, paddingTop:5 }}>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:esc.dot, border:'2px solid #fff', boxShadow:`0 0 0 2px ${esc.dot}`, flexShrink:0, zIndex:1 }} />
                          {!isLastEntry && <div style={{ width:2, flex:1, background:C.border, minHeight:22, marginTop:2 }} />}
                        </div>
                        <div style={{ flex:1, paddingBottom:isLastEntry?0:12, paddingLeft:12 }}>
                          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                              <span style={{ fontSize:11.5, fontWeight:700, color:'#3D4266' }}>{entry.project}</span>
                              <div style={{ width:1, height:12, background:C.border, flexShrink:0 }} />
                              <span style={{ fontSize:11, fontWeight:700, padding:'2px 7px', borderRadius:5, color:ttc.color, background:ttc.bg }}>{entry.taskType}</span>
                              <div style={{ width:1, height:12, background:C.border, flexShrink:0 }} />
                              <span style={{ fontSize:11.5, fontWeight:700, color:C.navy, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:'1px 8px' }}>{entry.hours.toFixed(1)}h</span>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                              <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.navy, flex:1 }}>{entry.task}</p>
                              <span style={{ display:'inline-flex', alignItems:'center', gap:4, flexShrink:0, padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:700, color:esc.color, background:esc.bg, border:`1px solid ${esc.border}` }}>
                                <span style={{ width:4, height:4, borderRadius:'50%', background:esc.dot }} />
                                {entry.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
        <div style={{ height:0 }} />
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function AllTimesheetsPage() {
  const [tab,             setTab]             = useState<'employee'|'project'>('employee')
  const [empSearch,       setEmpSearch]       = useState('')
  const [showSuggest,     setShowSuggest]     = useState(false)
  const [selectedEmps,    setSelectedEmps]    = useState<Employee[]>([])
  const [allSelected,     setAllSelected]     = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project|null>(null)
  const [projectEmps,     setProjectEmps]     = useState<Employee[]>([])
  const [selMonth,        setSelMonth]        = useState(4)
  const [selYear,         setSelYear]         = useState(2026)
  const [fromDate,        setFromDate]        = useState('')
  const [toDate,          setToDate]          = useState('')
  const [pickerMode,      setPickerMode]      = useState<'month'|'year'>('month')

  const setMonthReset = (m:number) => { setSelMonth(m); setFromDate(''); setToDate('') }
  const setYearReset  = (y:number) => { setSelYear(y); setFromDate(''); setToDate('') }
  const setModeReset  = (m:'month'|'year') => { setPickerMode(m); setFromDate(''); setToDate('') }
  const [yearMonths,      setYearMonths]      = useState<number[]>(Array.from({length:12},(_,i)=>i))
  const [state,           setState]           = useState<'idle'|'loading'|'done'>('idle')
  const [summaries,       setSummaries]       = useState<EmployeeSummary[]>([])
  const [viewEmployee,    setViewEmployee]    = useState<EmployeeSummary|null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    function handle(e:MouseEvent){ if(searchRef.current&&!searchRef.current.contains(e.target as Node)) setShowSuggest(false) }
    document.addEventListener('mousedown',handle); return()=>document.removeEventListener('mousedown',handle)
  },[])

  const suggestions = ALL_EMPLOYEES.filter(e=>
    (e.name.toLowerCase().includes(empSearch.toLowerCase())||e.empId.toLowerCase().includes(empSearch.toLowerCase())) &&
    !selectedEmps.find(s=>s.empId===e.empId)
  )

  function addEmp(emp:Employee)     { setSelectedEmps(p=>[...p,emp]); setEmpSearch(''); setShowSuggest(false) }
  function removeEmp(empId:string)  { setAllSelected(false); setSelectedEmps(p=>p.filter(e=>e.empId!==empId)) }
  function addAll()                 { setAllSelected(true); setSelectedEmps(ALL_EMPLOYEES); setEmpSearch(''); setShowSuggest(false) }
  function clearAll()               { setAllSelected(false); setSelectedEmps([]) }
  function selectProject(proj:Project) { setSelectedProject(proj); setProjectEmps(proj.empIds.map(id=>ALL_EMPLOYEES.find(e=>e.empId===id)!).filter(Boolean)) }

  function handleGenerate() {
    const emps = tab==='employee' ? (allSelected?ALL_EMPLOYEES:selectedEmps) : projectEmps
    if(emps.length===0) return
    setState('loading'); setSummaries([])
    setTimeout(()=>{
      const useRange = pickerMode==='month' && fromDate!=='' && toDate!==''
      const mo = pickerMode==='year'
        ? getYearOption(yearMonths,selYear)
        : useRange
          ? { label:`${fmtNice(fromDate)} – ${fmtNice(toDate)}`, value:`${fromDate}_${toDate}`, working:weekdaysBetween(fromDate,toDate), range:`${weekdaysBetween(fromDate,toDate)} working days` }
          : getMonthOption(selMonth,selYear)
      const result = emps.map(emp=>{
        let entries = DATA.filter(e=>e.employee===emp.name)
        if (useRange) entries = entries.filter(e=>e.date>=fromDate && e.date<=toDate)
        const projName = tab==='project'&&selectedProject ? selectedProject.name : (EMP_PRIMARY_PROJECT[emp.empId]??'No Project')
        return buildSummary(emp, entries, mo, projName)
      }).filter(s=>s.entries.length>0)
      setSummaries(result); setState('done')
    },1300)
  }

  const canGenerate = (pickerMode==='year'?yearMonths.length>0:true) &&
    (tab==='employee'?(allSelected||selectedEmps.length>0):projectEmps.length>0)

  const currentMo = pickerMode==='month' ? getMonthOption(selMonth,selYear) : getYearOption(yearMonths,selYear)
  const rangeActive = pickerMode==='month' && fromDate!=='' && toDate!==''
  const ctxLabel = rangeActive ? `${fmtNice(fromDate)} – ${fmtNice(toDate)}` : currentMo.label
  const ctxRange = rangeActive ? `${weekdaysBetween(fromDate, toDate)} working days` : currentMo.range

  if (viewEmployee) {
    return <EmployeeDateListView summary={viewEmployee} onBack={()=>setViewEmployee(null)} />
  }

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:C.navy, margin:'0 0 4px' }}>Timesheet Report</h1>
        <p style={{ fontSize:13.5, color:C.muted, margin:0 }}>Generate timesheet reports by employee or project — monthly or full year</p>
      </div>

      {/* 3 / 9 grid */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 9fr', gap:20, alignItems:'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position:'sticky', top:0 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>

            {/* Tabs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${C.border}` }}>
              {(['employee','project'] as const).map(t=>(
                <button key={t} onClick={()=>{ setTab(t); setState('idle'); setSummaries([]); setAllSelected(false); setSelectedEmps([]) }}
                  style={{ height:46, border:'none', background:'transparent', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', color:tab===t?C.navy:C.muted, borderBottom:tab===t?`2px solid ${C.navy}`:'2px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  {t==='employee'?<Users size={14} strokeWidth={1.8}/>:<Briefcase size={14} strokeWidth={1.8}/>}
                  {t==='employee'?'Employee':'Project'}
                </button>
              ))}
            </div>

            <div style={{ padding:'20px 20px 24px' }}>

              {/* Employee tab */}
              {tab==='employee' && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Search Employees</label>
                    <div ref={searchRef} style={{ position:'relative' }}>
                      <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }} />
                      <input value={empSearch} onChange={e=>{setEmpSearch(e.target.value);setShowSuggest(true)}} onFocus={()=>setShowSuggest(true)} onKeyDown={e=>{if(e.key==='Escape')setShowSuggest(false)}} placeholder="Search by name or ID…"
                        style={{ width:'100%', height:40, paddingLeft:32, paddingRight:12, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.navy, background:'#fff', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s' }} />
                      {showSuggest && (empSearch.length>0||suggestions.length>0) && (
                        <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:50, background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, marginTop:4, overflow:'hidden', boxShadow:'0 8px 24px rgba(28,32,53,0.10)', maxHeight:220, overflowY:'auto' }}>
                          {suggestions.length===0 ? (
                            <div style={{ padding:'12px 14px', fontSize:12.5, color:C.muted, textAlign:'center' }}>No employees found</div>
                          ) : (
                            <>
                              {empSearch==='' && !allSelected && (
                                <button onMouseDown={e=>{e.preventDefault();addAll()}} style={{ width:'100%', padding:'10px 14px', border:'none', borderBottom:`1px solid ${C.border}`, background:'#F5F7FF', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:600, color:'#4338CA', textAlign:'left', display:'flex', alignItems:'center', gap:6 }}>
                                  <Users size={12} strokeWidth={2}/> Add all {suggestions.length} employees
                                </button>
                              )}
                              {suggestions.slice(0,8).map(emp=>(
                                <button key={emp.empId} onMouseDown={e=>{e.preventDefault();addEmp(emp)}} style={{ width:'100%', padding:'9px 14px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'inherit', transition:'background 0.1s', borderBottom:`1px solid ${C.border}` }}
                                  onMouseEnter={e=>{e.currentTarget.style.background=C.surface}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                                  <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                                  <div style={{ textAlign:'left', minWidth:0 }}>
                                    <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{emp.name}</div>
                                    <div style={{ fontSize:11, color:C.muted }}>{emp.empId} · {emp.department}</div>
                                  </div>
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {(allSelected||selectedEmps.length>0) && (
                    <div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <label style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                          Selected ({allSelected?ALL_EMPLOYEES.length:selectedEmps.length})
                        </label>
                        <button onClick={clearAll} style={{ fontSize:11.5, fontWeight:600, color:'#E84855', background:'none', border:'none', cursor:'pointer', padding:0 }}>Clear all</button>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'2px 0' }}>
                        {allSelected ? (
                          <div style={{ display:'inline-flex', alignItems:'center', gap:7, height:30, padding:'0 8px 0 10px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
                            <Users size={12} style={{color:'#4338CA',flexShrink:0}} strokeWidth={2}/>
                            <span style={{ fontSize:12, fontWeight:600, color:'#3730A3' }}>All {ALL_EMPLOYEES.length} Employees</span>
                            <button onClick={clearAll} style={{ width:16, height:16, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                              <X size={9} style={{color:'#4338CA'}}/>
                            </button>
                          </div>
                        ) : (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6, maxHeight:130, overflowY:'auto', width:'100%' }}>
                            {selectedEmps.map(e=><EmpChip key={e.empId} emp={e} onRemove={()=>removeEmp(e.empId)}/>)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Period</label>
                    <MonthPicker month={selMonth} year={selYear} setMonth={setMonthReset} setYear={setYearReset} mode={pickerMode} setMode={setModeReset} yearMonths={yearMonths} setYearMonths={setYearMonths} from={fromDate} to={toDate} setFrom={setFromDate} setTo={setToDate}/>
                  </div>
                </div>
              )}

              {/* Project tab */}
              {tab==='project' && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Select Project</label>
                    <div style={{ position:'relative' }}>
                      <select value={selectedProject?.id??''} onChange={e=>{const p=ALL_PROJECTS.find(x=>x.id===e.target.value)??null;if(p)selectProject(p);else{setSelectedProject(null);setProjectEmps([])}}}
                        style={{ width:'100%', height:40, padding:'0 36px 0 12px', border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:selectedProject?C.navy:C.muted, background:selectedProject?'#F0F4FF':'#fff', outline:'none', cursor:'pointer', fontFamily:'inherit', appearance:'none' }}
                        onFocus={e=>{e.currentTarget.style.borderColor='#6366F1'}} onBlur={e=>{e.currentTarget.style.borderColor=C.border}}>
                        <option value="">Choose a project…</option>
                        {ALL_PROJECTS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <ChevronRight size={13} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%) rotate(90deg)', color:C.muted, pointerEvents:'none' }}/>
                    </div>
                  </div>
                  {selectedProject && projectEmps.length>0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 13px', background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.16)', borderRadius:9 }}>
                      <Users size={13} strokeWidth={2} style={{ color:'#5B5FDE', flexShrink:0 }} />
                      <span style={{ fontSize:12.5, fontWeight:600, color:'#5B5FDE' }}>{projectEmps.length} employee{projectEmps.length!==1?'s':''} in this project</span>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Period</label>
                    <MonthPicker month={selMonth} year={selYear} setMonth={setMonthReset} setYear={setYearReset} mode={pickerMode} setMode={setModeReset} yearMonths={yearMonths} setYearMonths={setYearMonths} from={fromDate} to={toDate} setFrom={setFromDate} setTo={setToDate}/>
                  </div>
                </div>
              )}

              {/* Generate */}
              <button onClick={handleGenerate} disabled={!canGenerate}
                style={{ width:'100%', height:44, borderRadius:12, border:'none', background:canGenerate?C.navy:'#D0D3E4', fontSize:14, fontWeight:700, color:canGenerate?'#fff':'#A0A4BC', cursor:canGenerate?'pointer':'not-allowed', fontFamily:'inherit', marginTop:20, transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>{if(canGenerate)e.currentTarget.style.background='#2A3050'}}
                onMouseLeave={e=>{if(canGenerate)e.currentTarget.style.background=C.navy}}>
                <ClipboardList size={16} strokeWidth={2}/> Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>

          {/* Idle */}
          {state==='idle' && (
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, minHeight:480, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:48 }}>
              <div style={{ width:64, height:64, borderRadius:20, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ClipboardList size={28} strokeWidth={1.3} style={{color:'#C0C4D8'}}/>
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:16, fontWeight:700, color:C.navy, margin:'0 0 6px' }}>No Report Generated Yet</p>
                <p style={{ fontSize:13.5, color:C.muted, margin:0, maxWidth:320, lineHeight:1.6 }}>
                  Select employees or a project on the left, choose a period, and click <strong>Generate Report</strong> to view timesheet data.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {state==='loading' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[0,1,2].map(i=><SkeletonCard key={i}/>)}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2.5px solid ${C.border}`, borderTopColor:C.navy, animation:'spin 0.75s linear infinite' }}/>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <span style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Generating timesheet report…</span>
              </div>
            </div>
          )}

          {/* Done */}
          {state==='done' && summaries.length>=0 && (
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:'20px' }}>

              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>{summaries.length} Report{summaries.length!==1?'s':''}</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:26, padding:'0 10px', background:'#ECEEF5', border:`1px solid ${C.border}`, borderRadius:99, fontSize:11.5, fontWeight:600, color:C.muted }}>
                    <CalendarDays size={11} strokeWidth={2}/> {ctxLabel} · {ctxRange}
                  </span>
                </div>
                <button style={{ display:'flex', alignItems:'center', gap:7, height:36, padding:'0 16px', borderRadius:9, border:'1px solid #16A34A40', background:'#F0FDF4', fontSize:12.5, fontWeight:600, color:'#15803D', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#DCFCE7';e.currentTarget.style.borderColor='#16A34A80'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}>
                  <FileSpreadsheet size={14} strokeWidth={2}/> Download All Reports
                </button>
              </div>

              {/* Project summary card — month/year aggregates only (not for a date range) */}
              {tab==='project' && selectedProject && summaries.length>0 && !rangeActive && (()=>{
                const totalH = summaries.reduce((s,c)=>s+c.totalHours,0)
                const avgH   = +(totalH/summaries.length).toFixed(1)
                const pendH  = summaries.reduce((s,c)=>s+c.pendingHours,0)
                const appH   = summaries.reduce((s,c)=>s+c.approvedHours,0)
                return (
                  <div style={{ border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', marginBottom:16, animation:'cardIn 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
                    <div style={{ height:3, background:'linear-gradient(90deg,#4B4ECC,#818CF8)' }} />
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(75,78,204,0.08)', border:'1px solid rgba(75,78,204,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Briefcase size={18} style={{color:'#4B4ECC'}} strokeWidth={1.7}/>
                        </div>
                        <div>
                          <div style={{ fontSize:14.5, fontWeight:800, color:C.navy }}>{selectedProject.name}</div>
                          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{summaries.length} employee{summaries.length!==1?'s':''} · {currentMo.label}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'center', background:'rgba(75,78,204,0.09)', borderRadius:12, padding:'10px 20px', flexShrink:0 }}>
                        <div style={{ fontSize:20, fontWeight:800, color:'#4B4ECC', lineHeight:1 }}>{totalH.toFixed(1)}h</div>
                        <div style={{ fontSize:10, fontWeight:700, color:'#4B4ECC', marginTop:4, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>Total Hours</div>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:`1px solid ${C.border}`, background:C.surface }}>
                      {[
                        { label:'Avg Hrs / Employee', val:`${avgH}h`,             color:'#4B4ECC' },
                        { label:'Approved Hours',     val:`${appH.toFixed(1)}h`,  color:'#0EA86A' },
                        { label:'Pending Hours',      val:`${pendH.toFixed(1)}h`, color:'#D97706' },
                        { label:'Total Employees',    val:summaries.length,       color:'#7C3AED' },
                      ].map((s,i,arr)=>(
                        <div key={s.label} style={{ padding:'12px 16px', borderRight:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
                          <div style={{ fontSize:13.5, fontWeight:700, color:s.color, lineHeight:1 }}>{s.val}</div>
                          <div style={{ fontSize:11, color:C.muted, marginTop:4, fontWeight:500 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* User cards */}
              {summaries.length===0 ? (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                  <p style={{ fontSize:14, fontWeight:600, color:C.navy, margin:'0 0 6px' }}>No timesheet data found</p>
                  <p style={{ fontSize:13, color:C.muted, margin:0 }}>No entries found for the selected employees in this period.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {summaries.map((s, i) => (
                    <div key={s.empId} style={{ borderBottom: i < summaries.length - 1 ? `1px solid ${C.border}` : 'none', paddingBottom: i < summaries.length - 1 ? 10 : 0, paddingTop: i > 0 ? 10 : 0 }}>
                      <TimesheetCardView summary={s} delay={i*55} onView={()=>setViewEmployee(s)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
