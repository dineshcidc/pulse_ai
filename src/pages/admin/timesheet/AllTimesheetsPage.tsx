import { useState } from 'react'
import { Search, Info, Eye, ArrowLeft, Clock, FileText, AlertCircle, Users, X } from 'lucide-react'

type Status = 'Approved' | 'Pending' | 'Rejected'

interface Entry {
  id: number
  employee: string; avatar: number; empId: string; department: string
  project: string; manager: string
  date: string; task: string; taskType: string
  hours: number; status: Status
}

interface EmployeeMeta { name: string; avatar: number; empId: string; email: string }

interface EmployeeSummary {
  employee: string; avatar: number; empId: string
  department: string; project: string; manager: string
  entries: Entry[]; totalHours: number
  dateFrom: string; dateTo: string
  approvedCount: number; pendingCount: number; rejectedCount: number
}

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

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const EMPLOYEE_META: EmployeeMeta[] = [
  { name: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', email: 'sarah.johnson@concertidc.com'   },
  { name: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', email: 'mike.chen@concertidc.com'       },
  { name: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', email: 'emma.wilson@concertidc.com'     },
  { name: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', email: 'arjun.patel@concertidc.com'    },
  { name: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', email: 'anjali.singh@concertidc.com'   },
  { name: 'James Wilson',     avatar: 12, empId: 'EMP-0060', email: 'james.wilson@concertidc.com'   },
  { name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', email: 'fatima.alzahra@concertidc.com' },
  { name: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', email: 'karthik.nair@concertidc.com'   },
  { name: 'David Brown',      avatar: 8,  empId: 'EMP-0008', email: 'david.brown@concertidc.com'    },
  { name: 'Lisa Garcia',      avatar: 25, empId: 'EMP-0025', email: 'lisa.garcia@concertidc.com'    },
  { name: 'Priya Sharma',     avatar: 31, empId: 'EMP-0031', email: 'priya.sharma@concertidc.com'   },
]

const PROJECTS = [
  'Pulse.AI v2',
  'HDFC Portal',
  'TechCorp ERP',
  'Retail CRM',
  'FinTrack App',
  'CloudSync Pro',
  'MediLink HMS',
]

const DATA: Entry[] = [
  { id:  1, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Development',   task: 'Frontend API Integration',               hours: 8.0, status: 'Approved' },
  { id:  2, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Development',   task: 'UI Component Development',               hours: 7.5, status: 'Approved' },
  { id:  3, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-24', taskType: 'Review',        task: 'Code Review & Testing',                  hours: 6.0, status: 'Pending'  },
  { id:  4, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-23', taskType: 'Meeting',       task: 'Sprint Planning Meeting',                hours: 3.0, status: 'Approved' },
  { id:  5, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-22', taskType: 'Development',   task: 'Bug Fix — Dashboard Module',             hours: 8.0, status: 'Approved' },
  { id:  6, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Testing',       task: 'Backend API Testing',                    hours: 7.0, status: 'Pending'  },
  { id:  7, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-25', taskType: 'Development',   task: 'Database Query Optimization',            hours: 8.0, status: 'Approved' },
  { id:  8, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-23', taskType: 'Documentation', task: 'API Documentation',                      hours: 5.5, status: 'Approved' },
  { id:  9, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-22', taskType: 'Testing',       task: 'Unit Test Coverage',                     hours: 7.0, status: 'Approved' },
  { id: 10, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-21', taskType: 'Testing',       task: 'Integration Testing',                    hours: 6.0, status: 'Rejected' },
  { id: 11, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Design',        task: 'Design System — Component Library',      hours: 6.0, status: 'Pending'  },
  { id: 12, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-24', taskType: 'Design',        task: 'Figma Prototype — Dashboard',            hours: 7.5, status: 'Approved' },
  { id: 13, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-23', taskType: 'Review',        task: 'UX Review & Feedback Session',           hours: 4.0, status: 'Approved' },
  { id: 14, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-22', taskType: 'Design',        task: 'Mobile Responsive Design',               hours: 7.0, status: 'Approved' },
  { id: 15, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Development',   task: 'ERP Module — Payroll Integration',        hours: 8.0, status: 'Approved' },
  { id: 16, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-25', taskType: 'Testing',       task: 'Performance Testing Suite',              hours: 6.5, status: 'Approved' },
  { id: 17, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-24', taskType: 'Development',   task: 'Database Schema Migration',              hours: 7.0, status: 'Pending'  },
  { id: 18, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-23', taskType: 'Analysis',      task: 'Requirements Walkthrough',               hours: 3.5, status: 'Approved' },
  { id: 19, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-21', taskType: 'Testing',       task: 'Integration Test Cases',                 hours: 6.0, status: 'Approved' },
  { id: 20, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Analysis',      task: 'Product Roadmap Review',                 hours: 4.0, status: 'Approved' },
  { id: 21, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-25', taskType: 'Meeting',       task: 'Stakeholder Sync Meeting',               hours: 3.0, status: 'Approved' },
  { id: 22, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-24', taskType: 'Analysis',      task: 'Feature Specification — Loans Module',   hours: 7.0, status: 'Pending'  },
  { id: 23, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-23', taskType: 'Analysis',      task: 'User Story Grooming',                    hours: 5.5, status: 'Approved' },
  { id: 24, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-22', taskType: 'Meeting',       task: 'Sprint Review Preparation',              hours: 4.5, status: 'Approved' },
  { id: 25, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-26', taskType: 'DevOps',        task: 'DevOps Pipeline Setup',                  hours: 7.0, status: 'Pending'  },
  { id: 26, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-25', taskType: 'Review',        task: 'Server Infrastructure Review',           hours: 5.5, status: 'Approved' },
  { id: 27, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-24', taskType: 'Development',   task: 'Backend Service Optimization',           hours: 8.0, status: 'Approved' },
  { id: 28, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-22', taskType: 'Review',        task: 'Security Audit Implementation',          hours: 6.0, status: 'Approved' },
  { id: 29, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Design',        task: 'Portal Redesign — Home Page',            hours: 7.5, status: 'Pending'  },
  { id: 30, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Analysis',      task: 'User Research Analysis',                 hours: 5.0, status: 'Approved' },
  { id: 31, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-23', taskType: 'Review',        task: 'Wireframe Review Session',               hours: 4.0, status: 'Approved' },
  { id: 32, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-22', taskType: 'Design',        task: 'Design Handoff — Dev Team',              hours: 6.5, status: 'Approved' },
  { id: 33, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-26', taskType: 'DevOps',        task: 'API Gateway Configuration',              hours: 8.0, status: 'Approved' },
  { id: 34, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-25', taskType: 'Testing',       task: 'Module Testing & Validation',            hours: 6.5, status: 'Approved' },
  { id: 35, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-24', taskType: 'Review',        task: 'Code Review Session',                    hours: 4.0, status: 'Approved' },
  { id: 36, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-23', taskType: 'Development',   task: 'ERP Core Module Development',            hours: 8.0, status: 'Pending'  },
  { id: 37, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-21', taskType: 'Meeting',       task: 'Sprint Planning — Q2',                   hours: 3.0, status: 'Approved' },
  { id: 38, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Development',   task: 'CRM Dashboard Development',              hours: 7.5, status: 'Approved' },
  { id: 39, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Development',   task: 'Customer Profile Module',                hours: 6.0, status: 'Approved' },
  { id: 40, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-23', taskType: 'Development',   task: 'Lead Management Integration',            hours: 5.5, status: 'Pending'  },
  { id: 41, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Testing',       task: 'CRM Regression Test Suite',              hours: 6.5, status: 'Pending'  },
  { id: 42, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-24', taskType: 'Testing',       task: 'End-to-End Flow Testing',                hours: 7.0, status: 'Approved' },
  { id: 43, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-22', taskType: 'Testing',       task: 'Bug Report & Triage Session',            hours: 4.5, status: 'Approved' },
  { id: 44, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-26', taskType: 'Analysis',      task: 'Finance Module Specification',           hours: 5.0, status: 'Approved' },
  { id: 45, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-24', taskType: 'Review',        task: 'Budget Tracker UI Review',               hours: 6.5, status: 'Approved' },
  { id: 46, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-22', taskType: 'Design',        task: 'Expense Report Flow Design',             hours: 7.0, status: 'Pending'  },
  { id: 47, employee: 'Sarah Johnson',   avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-21', taskType: 'Development',   task: 'API Integration — Payment Gateway',       hours: 8.0, status: 'Approved' },
  { id: 48, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'CloudSync Pro', manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'DevOps',        task: 'Cloud Storage API Setup',                hours: 7.0, status: 'Approved' },
  { id: 49, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'CloudSync Pro', manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Development',   task: 'Sync Engine — Conflict Resolution',       hours: 6.0, status: 'Pending'  },
  { id: 50, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'CloudSync Pro', manager: 'Rohan Mehta',  date: '2026-05-23', taskType: 'Design',        task: 'Dashboard Wireframes',                   hours: 5.5, status: 'Approved' },
  { id: 51, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'MediLink HMS',  manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Testing',       task: 'HMS Patient Module Testing',             hours: 8.0, status: 'Approved' },
  { id: 52, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'MediLink HMS',  manager: 'Priya Sharma', date: '2026-05-25', taskType: 'Testing',       task: 'Lab Results Integration QA',             hours: 6.5, status: 'Pending'  },
  { id: 53, employee: 'Fatima Al-Zahra',avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'MediLink HMS',  manager: 'Priya Sharma', date: '2026-05-24', taskType: 'Design',        task: 'Patient Portal UI Design',               hours: 7.0, status: 'Approved' },
  // ── May 27 ──
  { id: 54, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Design',        task: 'Dashboard Redesign — New Components',    hours: 7.5, status: 'Approved' },
  { id: 55, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Testing',       task: 'Load Testing — Payment Flow',            hours: 7.0, status: 'Approved' },
  { id: 56, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Review',        task: 'Icon Set Design — Final Review',         hours: 5.5, status: 'Approved' },
  { id: 57, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Development',   task: 'ERP Billing Module — Integration',        hours: 8.0, status: 'Approved' },
  { id: 58, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Meeting',       task: 'Backlog Refinement Session',             hours: 3.5, status: 'Approved' },
  { id: 59, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-27', taskType: 'DevOps',        task: 'CI/CD Pipeline Optimization',            hours: 7.0, status: 'Approved' },
  { id: 60, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Review',        task: 'Accessibility Audit — Portal',           hours: 6.0, status: 'Approved' },
  { id: 61, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-27', taskType: 'DevOps',        task: 'API Rate Limiting Implementation',        hours: 7.5, status: 'Approved' },
  { id: 62, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Development',   task: 'CRM Reports Module Development',         hours: 7.0, status: 'Approved' },
  { id: 63, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Testing',       task: 'Automation Test Scripts',                hours: 7.0, status: 'Approved' },
  { id: 64, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-27', taskType: 'Analysis',      task: 'Investment Portfolio Module Review',      hours: 6.0, status: 'Approved' },
  // ── May 28 ──
  { id: 65, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Development',   task: 'Performance Optimization — React Query',  hours: 6.0, status: 'Approved' },
  { id: 66, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Development',   task: 'Bug Fixes — Portal Login Module',         hours: 6.5, status: 'Approved' },
  { id: 67, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Design',        task: 'Responsive Layout — Mobile Views',        hours: 7.0, status: 'Approved' },
  { id: 68, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Testing',       task: 'Data Migration Script Testing',          hours: 6.0, status: 'Approved' },
  { id: 69, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Meeting',       task: 'Feature Demo Preparation',               hours: 5.5, status: 'Approved' },
  { id: 70, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-28', taskType: 'DevOps',        task: 'Server Monitoring Setup',                hours: 6.0, status: 'Approved' },
  { id: 71, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Design',        task: 'Component Library Update',               hours: 5.5, status: 'Approved' },
  { id: 72, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-28', taskType: 'DevOps',        task: 'Load Balancer Configuration',            hours: 6.0, status: 'Approved' },
  { id: 73, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Development',   task: 'Email Campaign Integration',             hours: 6.5, status: 'Approved' },
  { id: 74, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Testing',       task: 'Regression Testing Round 2',             hours: 6.0, status: 'Approved' },
  { id: 75, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-28', taskType: 'Review',        task: 'Tax Calculation Feature Review',         hours: 5.5, status: 'Approved' },
  // ── May 29 ──
  { id: 76, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Sprint Review Preparation',              hours: 4.0, status: 'Pending'  },
  { id: 77, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Documentation', task: 'QA Sign-off Report',                     hours: 5.0, status: 'Pending'  },
  { id: 78, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Review',        task: 'Design QA Session',                      hours: 3.5, status: 'Pending'  },
  { id: 79, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Testing',       task: 'UAT Session Preparation',                hours: 4.5, status: 'Pending'  },
  { id: 80, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Analysis',      task: 'Stakeholder Update Deck',                hours: 4.0, status: 'Pending'  },
  { id: 81, employee: 'James Wilson',     avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-29', taskType: 'Review',        task: 'Deploy Script Review',                   hours: 3.0, status: 'Pending'  },
  { id: 82, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Design Review Meeting',                  hours: 3.0, status: 'Pending'  },
  { id: 83, employee: 'Karthik Nair',    avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-29', taskType: 'DevOps',        task: 'Production Deployment Prep',             hours: 4.0, status: 'Pending'  },
  { id: 84, employee: 'David Brown',     avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Sprint Planning Session',                hours: 3.5, status: 'Pending'  },
  { id: 85, employee: 'Lisa Garcia',     avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Documentation', task: 'Test Coverage Report',                   hours: 3.5, status: 'Pending'  },
  { id: 86, employee: 'Priya Sharma',    avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-29', taskType: 'Meeting',       task: 'Product Backlog Grooming',               hours: 4.0, status: 'Pending'  },

  // ── Extra entries — multiple per date (Sarah Johnson) ──
  { id: 87,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Development',   task: 'API Error Handling Fix',                 hours: 2.5, status: 'Pending'  },
  { id: 88,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup & Sprint Sync',            hours: 0.5, status: 'Approved' },
  { id: 89,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Review',        task: 'Peer Code Review Session',               hours: 1.5, status: 'Approved' },
  { id: 90,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 91,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Review',        task: 'PR Review — Feature Branch',             hours: 2.0, status: 'Approved' },
  { id: 92,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 93,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 94,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Review',        task: 'Architecture Review Session',            hours: 1.5, status: 'Approved' },
  { id: 95,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-25', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 96,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-24', taskType: 'Development',   task: 'Hotfix — Login Session Timeout',         hours: 2.5, status: 'Approved' },
  { id: 97,  employee: 'Sarah Johnson',  avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-24', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Mike Chen) ──
  { id: 98,  employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Testing',       task: 'Performance Regression Tests',           hours: 2.0, status: 'Pending'  },
  { id: 99,  employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 100, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Testing',       task: 'Defect Triage Session',                  hours: 1.5, status: 'Approved' },
  { id: 101, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 102, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Review',        task: 'Test Plan Review',                       hours: 1.0, status: 'Approved' },
  { id: 103, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 104, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Documentation', task: 'API Test Report',                        hours: 1.0, status: 'Pending'  },
  { id: 105, employee: 'Mike Chen',      avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Emma Wilson) ──
  { id: 106, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Documentation', task: 'Component Spec Documentation',           hours: 2.0, status: 'Pending'  },
  { id: 107, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Design Standup',                         hours: 0.5, status: 'Approved' },
  { id: 108, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Design',        task: 'Icon Export & Asset Cleanup',            hours: 1.0, status: 'Approved' },
  { id: 109, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 110, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Design',        task: 'Style Guide Update',                     hours: 2.0, status: 'Approved' },
  { id: 111, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Meeting',       task: 'Design Standup',                         hours: 0.5, status: 'Approved' },
  { id: 112, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Review',        task: 'Design System QA Pass',                  hours: 2.0, status: 'Pending'  },
  { id: 113, employee: 'Emma Wilson',    avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',   manager: 'Rohan Mehta',  date: '2026-05-26', taskType: 'Meeting',       task: 'Design Standup',                         hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Arjun Patel) ──
  { id: 114, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Development',   task: 'Bug Fix — ERP Reports Module',           hours: 3.0, status: 'Pending'  },
  { id: 115, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 116, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Documentation', task: 'Test Case Documentation',                hours: 1.5, status: 'Approved' },
  { id: 117, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 118, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Meeting',       task: 'Sprint Ceremony',                        hours: 1.0, status: 'Approved' },
  { id: 119, employee: 'Arjun Patel',    avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP',  manager: 'Priya Sharma', date: '2026-05-26', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (James Wilson) ──
  { id: 120, employee: 'James Wilson',   avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-29', taskType: 'Development',   task: 'Hotfix — Auth Token Expiry',             hours: 2.0, status: 'Pending'  },
  { id: 121, employee: 'James Wilson',   avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 122, employee: 'James Wilson',   avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-28', taskType: 'Review',        task: 'Infrastructure Config Review',           hours: 1.5, status: 'Approved' },
  { id: 123, employee: 'James Wilson',   avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 124, employee: 'James Wilson',   avatar: 12, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',   manager: 'David Brown',  date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Karthik Nair) ──
  { id: 125, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-29', taskType: 'Development',   task: 'Kubernetes Config Update',               hours: 2.5, status: 'Pending'  },
  { id: 126, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 127, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-28', taskType: 'Review',        task: 'Deployment Runbook Review',              hours: 1.0, status: 'Approved' },
  { id: 128, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 129, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 130, employee: 'Karthik Nair',   avatar: 15, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP',  manager: 'David Brown',  date: '2026-05-26', taskType: 'Meeting',       task: 'Team Standup',                           hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (David Brown) ──
  { id: 131, employee: 'David Brown',    avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Review',        task: 'Code Review — CRM Module',               hours: 1.5, status: 'Pending'  },
  { id: 132, employee: 'David Brown',    avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 133, employee: 'David Brown',    avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 134, employee: 'David Brown',    avatar: 8,  empId: 'EMP-0008', department: 'Engineering',  project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Lisa Garcia) ──
  { id: 135, employee: 'Lisa Garcia',    avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Testing',       task: 'Smoke Test — Build v2.4',                hours: 2.0, status: 'Pending'  },
  { id: 136, employee: 'Lisa Garcia',    avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-29', taskType: 'Meeting',       task: 'QA Standup',                             hours: 0.5, status: 'Approved' },
  { id: 137, employee: 'Lisa Garcia',    avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Documentation', task: 'Test Summary Report',                    hours: 1.0, status: 'Approved' },
  { id: 138, employee: 'Lisa Garcia',    avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-28', taskType: 'Meeting',       task: 'QA Standup',                             hours: 0.5, status: 'Approved' },
  { id: 139, employee: 'Lisa Garcia',    avatar: 25, empId: 'EMP-0025', department: 'QA & Testing', project: 'Retail CRM',    manager: 'Rohan Mehta',  date: '2026-05-27', taskType: 'Meeting',       task: 'QA Standup',                             hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Priya Sharma) ──
  { id: 140, employee: 'Priya Sharma',   avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-29', taskType: 'Analysis',      task: 'Backlog Prioritization Session',          hours: 2.0, status: 'Pending'  },
  { id: 141, employee: 'Priya Sharma',   avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 142, employee: 'Priya Sharma',   avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 143, employee: 'Priya Sharma',   avatar: 31, empId: 'EMP-0031', department: 'Product',      project: 'FinTrack App',  manager: 'David Brown',  date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },

  // ── Extra entries — multiple per date (Anjali Singh) ──
  { id: 144, employee: 'Anjali Singh',   avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Documentation', task: 'Sprint Notes Documentation',             hours: 1.5, status: 'Pending'  },
  { id: 145, employee: 'Anjali Singh',   avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-29', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 146, employee: 'Anjali Singh',   avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Analysis',      task: 'Acceptance Criteria Review',             hours: 1.5, status: 'Approved' },
  { id: 147, employee: 'Anjali Singh',   avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-28', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
  { id: 148, employee: 'Anjali Singh',   avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',   manager: 'Priya Sharma', date: '2026-05-27', taskType: 'Meeting',       task: 'Daily Standup',                          hours: 0.5, status: 'Approved' },
]

function fmtShort(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function fmtFull(d: string) {
  const dt  = new Date(d + 'T00:00:00')
  const wd  = dt.toLocaleDateString('en-US', { weekday: 'short' })
  const day = String(dt.getDate()).padStart(2, '0')
  const mon = dt.toLocaleDateString('en-US', { month: 'short' })
  return `${wd}, ${day} ${mon} ${dt.getFullYear()}`
}

const TASK_DESC: Record<string, string> = {
  'Development':   'Implemented the required features as per the sprint task definition, ensuring code quality by following established patterns and adding unit tests for new logic. Submitted pull request for peer review with a detailed description of all changes made. Verified integration with dependent modules and confirmed no regression in existing functionality.',
  'Design':        'Completed high-fidelity design assets and updated the shared component library with the latest approved styles. Collaborated with the development team to clarify interaction patterns, spacing, and responsive breakpoints. All final assets have been exported and uploaded to the project folder for handoff.',
  'Testing':       'Executed the defined test cases covering functional, regression, boundary, and negative scenarios as per the test plan. Identified and logged defects with detailed reproduction steps, expected vs actual results, and severity classification. Updated the test tracker and shared the run summary report with the project manager and QA lead.',
  'Meeting':       'Attended the scheduled team sync and contributed status updates on current sprint progress, blockers, and upcoming deliverables. Action items were captured, documented, and distributed to the respective owners with target dates. Follow-up tasks have been added to the project board for tracking.',
  'Review':        'Conducted a thorough review of the submitted work against acceptance criteria, coding standards, and design specifications. Provided written feedback highlighting specific areas for improvement and confirmed items that met the expected quality bar. Awaiting the author\'s response before marking as approved.',
  'DevOps':        'Completed the required infrastructure changes in the staging environment and verified all deployments are stable and performing within expected thresholds. Monitoring dashboards updated and alert rules configured as per the runbook guidelines. Documentation has been updated to reflect the new configurations and rollback procedures.',
  'Documentation': 'Authored comprehensive documentation covering all new and updated features introduced in this sprint cycle, including endpoint references, sample payloads, and usage notes. Incorporated feedback from the last review cycle to improve clarity and completeness. Document is currently under peer review and will be published to the knowledge base upon approval.',
  'Analysis':      'Gathered and analyzed requirements from stakeholder interviews, existing system data, and backlog grooming sessions. Translated the findings into structured user stories with clear acceptance criteria, dependency notes, and edge case scenarios. Findings were reviewed and approved by the product owner, and the stories are now ready for development planning.',
}

/* ─── Employee date-list + accordion view ─── */
function EmployeeDateListView({ summary, onBack }: { summary: EmployeeSummary; onBack: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleDate(date: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(date) ? next.delete(date) : next.add(date)
      return next
    })
  }

  const dateMap = new Map<string, Entry[]>()
  summary.entries.forEach(e => {
    if (!dateMap.has(e.date)) dateMap.set(e.date, [])
    dateMap.get(e.date)!.push(e)
  })
  const sortedDates = [...dateMap.keys()].sort((a, b) => b.localeCompare(a))

  const statBadges = [
    { label: 'Total Hours', value: `${summary.totalHours.toFixed(1)}h`, color: '#4B4ECC', bg: 'rgba(75,78,204,0.08)', border: 'rgba(75,78,204,0.18)' },
    { label: 'Approved',    value: summary.approvedCount,                color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.20)' },
    { label: 'Pending',     value: summary.pendingCount,                 color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.hover, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: 'pointer', color: C.navy,
          fontSize: 12.5, fontWeight: 600, padding: '6px 14px',
          marginBottom: 20, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.borderColor = '#D1D4E4' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.borderColor = C.border }}
      >
        <ArrowLeft size={14} /> Back to Results
      </button>

      {/* Employee header */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
        padding: '20px 26px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <img src={`https://i.pravatar.cc/54?img=${summary.avatar}`} alt={summary.employee}
            style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.border}` }} />
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.navy }}>{summary.employee}</p>
            <p style={{ margin: '2px 0 8px', fontSize: 12.5, color: C.muted }}>{summary.empId}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[summary.department, summary.project, `Manager: ${summary.manager}`].map(t => (
                <span key={t} style={{ padding: '2px 9px', borderRadius: 5, fontSize: 11.5, fontWeight: 600, color: C.navy, background: C.surface, border: `1px solid ${C.border}` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {statBadges.map(s => (
            <div key={s.label} style={{ padding: '10px 18px', borderRadius: 10, textAlign: 'center' as const, background: s.bg, border: `1px solid ${s.border}`, minWidth: 76 }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 700, color: s.color, opacity: 0.75, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date list card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.navy }}>
            Timesheet by Date
          </p>
          <span style={{ fontSize: 12, color: C.muted }}>
            {summary.dateFrom === summary.dateTo
              ? `${fmtShort(summary.dateFrom)} ${summary.dateFrom.slice(0, 4)}`
              : `${fmtShort(summary.dateFrom)} – ${fmtShort(summary.dateTo)} ${summary.dateTo.slice(0, 4)}`}
          </span>
        </div>

        {sortedDates.map((date, di) => {
          const entries   = dateMap.get(date)!
          const dayHours  = entries.reduce((s, e) => s + e.hours, 0)
          const hasPending  = entries.some(e => e.status === 'Pending')
          const hasRejected = entries.some(e => e.status === 'Rejected')
          const dayStatus: Status = hasPending ? 'Pending' : hasRejected ? 'Rejected' : 'Approved'
          const dsc    = STATUS_CFG[dayStatus]
          const isOpen = expanded.has(date)
          const isLast = di === sortedDates.length - 1

          return (
            <div key={date}>
              {/* Date row */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', padding: '14px 22px', gap: 14,
                  background: isOpen ? 'rgba(99,102,241,0.04)' : '#fff',
                  borderBottom: `1px solid ${C.border}`,
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = '#fff' }}
              >
                {/* Left: date + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: C.navy }}>{fmtFull(date)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <Clock size={11} style={{ color: C.muted }} />
                    <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{dayHours.toFixed(1)}h logged</span>
                    <span style={{ fontSize: 11, color: C.border }}>·</span>
                    <span style={{ fontSize: 11.5, color: C.muted }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
                  </div>
                </div>
                {/* Right: status + eye toggle */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                  padding: '4px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 700,
                  color: dsc.color, background: dsc.bg, border: `1px solid ${dsc.border}`,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: dsc.dot, flexShrink: 0 }} />
                  {dayStatus}
                </span>
                <button
                  onClick={() => toggleDate(date)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? C.navy : C.hover,
                    border: `1px solid ${isOpen ? C.navy : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.borderColor = '#D1D4E4' } }}
                  onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = C.border } }}
                >
                  <Eye size={14} color={isOpen ? '#fff' : C.navy} />
                </button>
              </div>

              {/* Accordion: tree entries */}
              {isOpen && (
                <div style={{
                  padding: '16px 22px 18px 22px',
                  background: 'rgba(247,248,252,0.6)',
                  borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                }}>
                  {entries.map((entry, ei) => {
                    const esc = STATUS_CFG[entry.status]
                    const ttc = TASK_TYPE_CFG[entry.taskType] ?? { color: C.muted, bg: C.surface }
                    const isLastEntry = ei === entries.length - 1
                    return (
                      <div key={entry.id} style={{ display: 'flex', gap: 0 }}>
                        {/* Tree connector */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 22, flexShrink: 0, paddingTop: 5 }}>
                          <div style={{
                            width: 10, height: 10, borderRadius: '50%', background: esc.dot,
                            border: '2px solid #fff', boxShadow: `0 0 0 2px ${esc.dot}`,
                            flexShrink: 0, zIndex: 1,
                          }} />
                          {!isLastEntry && (
                            <div style={{ width: 2, flex: 1, background: C.border, minHeight: 22, marginTop: 2 }} />
                          )}
                        </div>
                        {/* Entry card */}
                        <div style={{ flex: 1, paddingBottom: isLastEntry ? 0 : 12, paddingLeft: 12 }}>
                          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px' }}>
                            {/* Top: project | type | hours */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#3D4266' }}>{entry.project}</span>
                              <div style={{ width: 1, height: 12, background: C.border, flexShrink: 0 }} />
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 5, color: ttc.color, background: ttc.bg }}>{entry.taskType}</span>
                              <div style={{ width: 1, height: 12, background: C.border, flexShrink: 0 }} />
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.navy, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '1px 8px' }}>{entry.hours.toFixed(1)}h</span>
                            </div>
                            {/* Task + status row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy, flex: 1 }}>{entry.task}</p>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
                                padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                color: esc.color, background: esc.bg, border: `1px solid ${esc.border}`,
                              }}>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: esc.dot }} />
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
        {/* Empty bottom border fix */}
        <div style={{ height: 0 }} />
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export default function AllTimesheetsPage() {
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeMeta | null>(null)
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [dateMode,         setDateMode]         = useState<'single' | 'range'>('range')
  const [singleDate,       setSingleDate]       = useState('')
  const [dateFrom,         setDateFrom]         = useState('')
  const [dateTo,           setDateTo]           = useState('')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [isLoading,        setIsLoading]        = useState(false)
  const [hasGenerated,     setHasGenerated]     = useState(false)
  const [results,          setResults]          = useState<EmployeeSummary[]>([])
  const [viewEmployee,     setViewEmployee]     = useState<EmployeeSummary | null>(null)
  const [sFocus,           setSFocus]           = useState(false)

  if (viewEmployee) {
    return <EmployeeDateListView summary={viewEmployee} onBack={() => setViewEmployee(null)} />
  }

  const totalHours   = DATA.reduce((s, e) => s + e.hours, 0)
  const totalPending = DATA.filter(e => e.status === 'Pending').length

  const STATS = [
    { label: 'Total Hours',      value: `${totalHours.toFixed(1)}h`, Icon: Clock,       color: '#4B4ECC' },
    { label: 'Total Entries',    value: DATA.length,                  Icon: FileText,    color: C.navy    },
    { label: 'Pending Approval', value: totalPending,                 Icon: AlertCircle, color: '#D97706' },
    { label: 'Active Employees', value: new Set(DATA.map(e => e.employee)).size, Icon: Users, color: C.navy },
  ]

  const suggestions: EmployeeMeta[] = searchQuery.trim().length >= 1 && !selectedEmployee
    ? EMPLOYEE_META.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.empId.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  function selectEmployee(emp: EmployeeMeta) {
    setSelectedEmployee(emp)
    setSearchQuery(emp.name)
    setShowSuggestions(false)
    setHasGenerated(false)
  }

  function clearEmployee() {
    setSelectedEmployee(null)
    setSearchQuery('')
    setShowSuggestions(false)
    setHasGenerated(false)
  }

  function toggleProject(p: string) {
    setSelectedProjects(prev => {
      const next = new Set(prev); next.has(p) ? next.delete(p) : next.add(p); return next
    })
    setHasGenerated(false)
  }

  function handleGenerate() {
    setIsLoading(true)
    setHasGenerated(false)
    setTimeout(() => {
      const q = selectedEmployee
        ? selectedEmployee.name.toLowerCase()
        : searchQuery.trim().toLowerCase()

      const filtered = DATA.filter(e => {
        const ms = !q || e.employee.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q)
        const mp = selectedProjects.size === 0 || selectedProjects.has(e.project)
        let dateOk = true
        if (dateMode === 'single') {
          dateOk = !singleDate || e.date === singleDate
        } else {
          dateOk = (!dateFrom || e.date >= dateFrom) && (!dateTo || e.date <= dateTo)
        }
        return ms && mp && dateOk
      })

      const empMap = new Map<string, Entry[]>()
      filtered.forEach(e => {
        if (!empMap.has(e.employee)) empMap.set(e.employee, [])
        empMap.get(e.employee)!.push(e)
      })

      const summaries: EmployeeSummary[] = []
      empMap.forEach((entries, employee) => {
        const first = entries[0]
        const dates = entries.map(e => e.date).sort()
        summaries.push({
          employee,
          avatar: first.avatar, empId: first.empId,
          department: first.department, project: first.project, manager: first.manager,
          entries,
          totalHours:    entries.reduce((s, e) => s + e.hours, 0),
          dateFrom:      dates[0],
          dateTo:        dates[dates.length - 1],
          approvedCount: entries.filter(e => e.status === 'Approved').length,
          pendingCount:  entries.filter(e => e.status === 'Pending').length,
          rejectedCount: entries.filter(e => e.status === 'Rejected').length,
        })
      })

      setResults(summaries)
      setIsLoading(false)
      setHasGenerated(true)
    }, 1200)
  }

  const labelStyle: React.CSSProperties = {
    margin: '0 0 8px', fontSize: 11.5, fontWeight: 700,
    color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes ts-spin { to { transform: rotate(360deg) } }
        .ts-eye-btn:hover { background: ${C.navy} !important; border-color: ${C.navy} !important; }
        .ts-eye-btn:hover svg { stroke: #fff !important; }
        .ts-result-card:hover { box-shadow: 0 4px 18px rgba(28,32,53,0.09) !important; }
        .ts-suggestion:hover { background: ${C.hover} !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>All Timesheets</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted }}>
          Filter and review timesheet submissions across employees, projects, and date ranges.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderRadius: 16, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.Icon size={19} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11.5, fontWeight: 500, color: C.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4 / 8 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: 18, alignItems: 'start' }}>

        {/* ── Left panel ── */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 22,
        }}>

          {/* ── Search with suggestions ── */}
          <div>
            <p style={labelStyle}>Search Employee</p>

            {/* Input */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setSelectedEmployee(null)
                  setShowSuggestions(true)
                  setHasGenerated(false)
                }}
                onFocus={() => { setSFocus(true); setShowSuggestions(true) }}
                onBlur={() => { setSFocus(false); setTimeout(() => setShowSuggestions(false), 160) }}
                placeholder="Employee name or ID…"
                style={{
                  width: '100%', height: 38, paddingLeft: 32,
                  paddingRight: selectedEmployee ? 32 : 10,
                  border: `1px solid ${sFocus ? C.navy : C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
              />
              {searchQuery && (
                <button
                  onMouseDown={e => { e.preventDefault(); clearEmployee() }}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: C.muted, display: 'flex', alignItems: 'center' }}
                >
                  <X size={13} />
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                  marginTop: 4, overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(28,32,53,0.10)',
                }}>
                  {suggestions.map((emp, i) => (
                    <div
                      key={emp.empId}
                      className="ts-suggestion"
                      onMouseDown={e => { e.preventDefault(); selectEmployee(emp) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px',
                        borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}` : 'none',
                        cursor: 'pointer', transition: 'background 0.12s',
                        background: '#fff',
                      }}
                    >
                      <img
                        src={`https://i.pravatar.cc/40?img=${emp.avatar}`}
                        alt={emp.name}
                        style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email}</div>
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#4B4ECC', background: 'rgba(75,78,204,0.08)', border: '1px solid rgba(75,78,204,0.16)', borderRadius: 5, padding: '2px 7px', flexShrink: 0 }}>
                        {emp.empId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected employee card */}
            {selectedEmployee && (
              <div style={{
                marginTop: 10, padding: '10px 12px',
                background: 'rgba(75,78,204,0.05)', border: '1px solid rgba(75,78,204,0.18)',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <img
                  src={`https://i.pravatar.cc/40?img=${selectedEmployee.avatar}`}
                  alt={selectedEmployee.name}
                  style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: `1px solid rgba(75,78,204,0.20)` }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{selectedEmployee.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedEmployee.email}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#4B4ECC', marginTop: 2 }}>{selectedEmployee.empId}</div>
                </div>
                <button
                  onClick={clearEmployee}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* ── Date filter ── */}
          <div>
            {/* Mode toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ ...labelStyle, margin: 0 }}>Date Filter</p>
              <div style={{ display: 'flex', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: 3, gap: 2 }}>
                {(['single', 'range'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setDateMode(mode); setHasGenerated(false) }}
                    style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: 'none',
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: dateMode === mode ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color:      dateMode === mode ? '#4B4ECC' : C.muted,
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                  >
                    {mode === 'single' ? 'Single' : 'Range'}
                  </button>
                ))}
              </div>
            </div>

            {/* Single date */}
            {dateMode === 'single' && (
              <input
                type="date" value={singleDate}
                onChange={e => { setSingleDate(e.target.value); setHasGenerated(false) }}
                style={{
                  width: '100%', height: 38, padding: '0 14px',
                  border: `1px solid ${C.border}`, borderRadius: 999,
                  fontSize: 12.5, color: singleDate ? C.navy : C.muted,
                  background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
              />
            )}

            {/* Date range */}
            {dateMode === 'range' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="date" value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setHasGenerated(false) }}
                  style={{
                    flex: 1, height: 38, padding: '0 12px',
                    border: `1px solid ${C.border}`, borderRadius: 999,
                    fontSize: 12.5, color: dateFrom ? C.navy : C.muted,
                    background: C.surface, outline: 'none',
                    fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                  }}
                />
                <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>to</span>
                <input
                  type="date" value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setHasGenerated(false) }}
                  style={{
                    flex: 1, height: 38, padding: '0 12px',
                    border: `1px solid ${C.border}`, borderRadius: 999,
                    fontSize: 12.5, color: dateTo ? C.navy : C.muted,
                    background: C.surface, outline: 'none',
                    fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                  }}
                />
              </div>
            )}
          </div>

          {/* ── Projects ── */}
          <div>
            <p style={labelStyle}>Projects</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROJECTS.map(p => {
                const active = selectedProjects.has(p)
                return (
                  <button key={p} onClick={() => toggleProject(p)}
                    style={{
                      padding: '6px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : C.border}`,
                      background: active ? 'rgba(99,102,241,0.10)' : C.surface,
                      color: active ? '#4B4ECC' : C.navy,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.color = '#4B4ECC' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy } }}
                  >{p}</button>
                )
              })}
            </div>
          </div>

          {/* ── Generate ── */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            style={{
              width: '100%', height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 700,
              background: isLoading ? '#A0A3B1' : C.navy, color: '#fff', border: 'none',
              cursor: isLoading ? 'default' : 'pointer', transition: 'background 0.2s',
              fontFamily: "'DM Sans',system-ui,sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4,
            }}
          >
            {isLoading ? 'Generating…' : 'Generate Report'}
          </button>
        </div>

        {/* ── Right panel ── */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '22px 20px', minHeight: 460,
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Empty state */}
          {!isLoading && !hasGenerated && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={22} color={C.muted} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>No report generated yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.muted, maxWidth: 300, lineHeight: 1.65 }}>
                  Select filters on the left — projects, a date or range — then click Generate Report to view results.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: `3px solid ${C.border}`, borderTopColor: C.navy,
                animation: 'ts-spin 0.75s linear infinite',
              }} />
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Loading timesheets…</p>
            </div>
          )}

          {/* Results */}
          {hasGenerated && !isLoading && (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>
                  {results.length} {results.length === 1 ? 'employee' : 'employees'} found
                </p>
                {selectedProjects.size > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {[...selectedProjects].map(p => (
                      <span key={p} style={{ padding: '2px 9px', borderRadius: 5, fontSize: 11.5, fontWeight: 600, color: C.navy, background: C.surface, border: `1px solid ${C.border}` }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: C.muted }}>No timesheet entries match your selection.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.map(r => {
                    const overallStatus: Status = r.pendingCount > 0 ? 'Pending' : r.rejectedCount > 0 ? 'Rejected' : 'Approved'
                    const sc = STATUS_CFG[overallStatus]
                    return (
                      <div
                        key={r.employee}
                        className="ts-result-card"
                        style={{
                          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                          transition: 'box-shadow 0.15s',
                        }}
                      >
                        <img
                          src={`https://i.pravatar.cc/44?img=${r.avatar}`}
                          alt={r.employee}
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.navy }}>{r.employee}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>{r.department} · {r.project}</p>
                          <p style={{ margin: '3px 0 0', fontSize: 11.5, color: C.muted }}>
                            {r.dateFrom === r.dateTo
                              ? fmtShort(r.dateFrom)
                              : `${fmtShort(r.dateFrom)} — ${fmtShort(r.dateTo)}`}
                          </p>
                        </div>

                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#4B4ECC', lineHeight: 1 }}>{r.totalHours.toFixed(1)}h</p>
                          <p style={{ margin: '3px 0 0', fontSize: 10.5, color: C.muted }}>logged</p>
                        </div>

                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                          padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                          color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                          {overallStatus}
                        </span>

                        <button
                          className="ts-eye-btn"
                          onClick={() => setViewEmployee(r)}
                          style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            background: C.hover, border: `1px solid ${C.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          <Eye size={15} color={C.navy} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
