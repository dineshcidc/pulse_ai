/*
 * Offboarding feature flags.
 *
 * BA correction (2026-08-17): HIDE these flows for now — do NOT delete the code.
 * Flip a flag back to `true` to re-enable the flow; all underlying UI/logic is
 * intact behind these switches.
 */

// Employee "Rejected" request state + CTO "Reject" decision (and rejected rows/filter).
export const SHOW_REJECT_FLOW = false

// Manager / System Admin / Finance clearance "On Hold" option.
export const SHOW_ON_HOLD_FLOW = false

/*
 * Effective clearance status.
 * While the On-Hold flow is hidden, any 'on-hold' case is shown as 'pending'
 * (on-hold cases are resumable, so pending is the natural fallback). This keeps
 * the "On Hold" pill / filter / resume-banner out of the UI without deleting the
 * underlying data or code. Flip SHOW_ON_HOLD_FLOW to restore it verbatim.
 */
type ClearanceLikeStatus = 'awaiting-cto' | 'pending' | 'cleared' | 'on-hold'
export function effStatus<S extends ClearanceLikeStatus>(status: S): S {
  return (!SHOW_ON_HOLD_FLOW && status === 'on-hold' ? 'pending' : status) as S
}
