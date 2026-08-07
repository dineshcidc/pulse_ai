# ▶ CONTINUE HERE — Employee Offboarding (Resume File)

> **Read this first when resuming.** Say *"Let's continue the Employee Offboarding flow"* and this file + memory bring back the full context.
>
> **Last worked:** Friday, 2026-07-31 · **Next session:** Monday, 2026-08-03

---

## 🟢 BUILD PROGRESS LOG (read this first)

**Approach (BA-approved 2026-08-03):** Offboarding is a **separate standalone module** with its own login/shell, sidebar & header, opened in a **new browser tab** from the Employee profile dropdown (`?module=offboarding`). Sidebar is **role-wise** (Employee · CTO · Manager · System Admin · Finance · HR), each a **collapsible accordion**. Code lives in `src/offboarding/`.

**Done so far — Employee phase (as of 2026-08-03):**
- ✅ **Entry point** — "Offboarding" option in Employee header profile dropdown → opens the module in a new tab.
- ✅ **Module shell + role-wise sidebar** (accordion sections; menu names for all 6 roles in workflow order).
- ✅ **E1 — Offboarding Request** (`OffboardingRequestPage.tsx`): form + Confirm/Withdraw modals; Demo·Prototype switcher walks **Form / Pending / Rejected**.
- ✅ **E3+E4+E5 — My Offboarding** (`MyOffboardingPage.tsx`): one hub with a **3/9 vertical-tab** layout — **Overview (tracker) · Exit Interview · Exit Documents**; Interview & Documents are **lock-gated**; Demo switcher walks **Clearances / Exit Interview / Completed**. (Exit Interview & Exit Documents are NO LONGER separate sidebar menus.)
- Whole app typechecks clean (`npx tsc -p tsconfig.app.json` → EXIT 0).

**▶ NEXT (2026-08-04): start Phase 2 — CTO.** Screens **C1 Approval Queue** + **C2 Request Detail & Decision** (Accept + set notice period 30/60/90, or Reject) under sidebar menu `cto-approvals`. Then Manager → System Admin → Finance → HR (last).

---

## ⚡ 30-second status

- We **scrapped the old offboarding flow** (BA + PM said it was wrong) and wrote a **brand-new, finalized workflow** based on how real HR offboarding works.
- Two planning docs are **finalized**; the old two spec files were deleted.
- Old **Offboarding / Team Offboarding sidebar menus are hidden** (build is green).
- **⛔ We have NOT started UI design yet.** The user has **a new navigation approach they still need to explain** before we finalize menus and design.

---

## 📂 The 3 documents (in this folder)

| File | What it is |
|------|-----------|
| **`Employee-Offboarding-Workflow.md`** | ✅ FINAL — the complete business flow (what/who/why), all decisions locked. Source of truth. |
| **`Employee-Offboarding-UI-Scope.md`** | ✅ Draft-final — navigation & design tracker: menus, 14 screens, design order, checklist. **May change once the user explains their new nav approach.** |
| **`_CONTINUE-HERE.md`** | 👈 This file. |

---

## 🔄 The finalized workflow (condensed)

**Flow 1 = employee-initiated.** 6 roles: **Employee · CTO (Delivery Head) · Manager (PM) · System Admin · Finance · HR.**

> Employee raises request → **CTO approves FIRST and sets notice period (30/60/90)** → then **PM, System Admin, Finance** each do their clearance in parallel during the notice period → **HR monitors via a 5-tab cockpit, then does exit interview + relieving/experience letters + final formalities and CLOSES.**

**Status lifecycle:** Submitted → (Rejected) / Approved-Notice Started → Clearance In Progress → Pending HR Closure → Completed/Offboarded. Branches: Withdrawn (pre-approval), On Hold.

**Biggest change vs old flow:** CTO is now the approver (was the Manager). Old single "Admin" splits into CTO + System Admin + Finance + HR. Manager drops to being just one clearance provider.

---

## ✅ Key decisions locked today (were open questions)

1. **HR has 5 tabs:** CTO · PM · System Admin · Finance · HR.
2. **Clearances NOT date hard-locked** — actionable after CTO approval; recommended window + LWD countdown highlighted.
3. **Exit interview** = employee fills the form, HR reviews & closes it.
4. **PM / IT / Finance clearances run fully in parallel** — no forced order.
5. **Blocker = On Hold with a reason** (no send-back routing); resumes when resolved.
6. **Laptop/access kept through notice; IT collects & revokes on/around the Last Working Day.**
7. **Early release** approved by CTO; **shortfall recovered/waived by Finance** in settlement.
8. **Before CTO approval**, departments see the request **read-only ("Awaiting CTO Approval"), not hidden.**

---

## ✅ What's completed today

- [x] Deleted the two old offboarding spec MD files.
- [x] Wrote & finalized `Employee-Offboarding-Workflow.md` (all 8 open questions resolved).
- [x] Wrote `Employee-Offboarding-UI-Scope.md` — 14 screens across 6 roles, in design order, with a tick-box tracker.
- [x] Hid the old **Offboarding** (Employee) and **Team Offboarding** (Manager) sidebar menus in `src/components/layout/Sidebar.tsx` (definitions + `DoorOpen` import commented out; cleaned 2 unused imports in `ManagerClearancePage.tsx`). **Typecheck passes.**

**Note:** the OLD offboarding pages still exist in `src/pages/employee/offboarding/` and `src/pages/manager/offboarding/` — unreachable from the sidebar, kept for reference. They were built on the WRONG old flow, so treat them as reference only, not reusable as-is.

---

## 👉 EXACT next step on Monday

**Do NOT jump into designing screens.** First:

1. **Ask the user to explain their new navigation approach** (they said today: *"I have a different plan for the complete end-to-end Employee Offboarding flow… then we can finalize the navigation and start the UI design."*).
2. **Update `Employee-Offboarding-UI-Scope.md`** to match whatever nav structure the user finalizes.
3. **Only then** start UI design — per the current plan that means **Phase 1, screen E1: the Employee Offboarding Request Form** (unless the user's new approach reorders things).

---

## 🎨 Design system reminder (for when design starts)

Navy `#1C2035` · gold `#F2D000` (sidebar active) · indigo `#6366F1` accent · DM Sans · inline `const C = {}` styles · white cards w/ `#E4E6EF`–`#E8EAF2` borders · pravatar avatars.
**Mock world:** employee John Doe (CC001) · manager Priya Sharma · team Sarah Johnson / Rajesh Kumar / Arjun Menon / Meera Nair / Vikram Singh.
