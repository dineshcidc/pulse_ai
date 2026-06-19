# Asset Management

## Overview

**Asset Management** is a self-service module for Employees and Managers in the Concert IDC workforce management platform.

- **Purpose:** Employees request and track company-issued assets (laptops, phones, furniture, etc.)
- **Scope:** View current assigned assets and submit new asset requests
- **Approvals:** All requests go to Admin for approval and allocation

Both Employee and Manager roles have **identical permissions** — no hierarchical approval. All approvals flow to **Admin only**.

---

## Module Structure

```
employee/
├── assets/
│   └── AssetManagementPage.tsx    → Single page with 2 tabs
```

**Routes:**
- Employee: `/employee/assets`
- Manager: `/manager/assets`

---

## Page Structure

**Single Page: Asset Management**

**File:** `AssetManagementPage.tsx`

### Layout:

```
┌─────────────────────────────────────────────────────┐
│ [← Back] Asset Management                           │
│ Request and track your company assets               │
│                        [+ Request Asset] ────────── │
├─────────────────────────────────────────────────────┤
│  Tab 1: My Current Assets │ Tab 2: Request Asset   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Tab Content Below]                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## TAB 1: My Current Assets

**Purpose:** View all assets currently assigned to the employee

### Table Display:

**Columns:**
```
Asset Code | Category | Asset Description | Date From | Action
```

**Sample Data:**
```
┌────────────────────────────────────────────────────────────┐
│ LT-2024-0042 │ Laptop │ MacBook Pro 14" M2 │ 15/01/2024 │ View │
│ MN-2024-0089 │ Monitor │ Dell 27" 4K Ultra HD │ 15/01/2024 │ View │
└────────────────────────────────────────────────────────────┘
```

**Column Details:**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Asset Code | Text | Unique asset identifier | LT-2024-0042 |
| Category | Text | Type of asset | Laptop, Monitor, Phone, Chair |
| Asset Description | Text | Full asset details | MacBook Pro 14" M2, Dell 27" 4K |
| Date From | Date | When asset was assigned | 15/01/2024 |
| Action | Button | View details | "View" link |

### Empty State:

```
┌─────────────────────────────────┐
│ No assets assigned yet          │
│                                 │
│ Click "Request Asset" to get one│
└─────────────────────────────────┘
```

### Styling:
- Clean table with light borders
- Row hover effect (light gray background)
- "View" button as simple link
- Max 10 rows per page with pagination

---

## TAB 2: Request Asset

**Purpose:** Create a new asset request with justification

### Form Layout:

**Section 1: Asset Information**

```
┌─ Asset Category * (Dropdown - Required) ──────────┐
│ Select asset type...                              │
│  • Laptop                                         │
│  • Desktop Computer                               │
│  • Monitor                                        │
│  • Phone                                          │
│  • Tablet                                         │
│  • Keyboard & Mouse                               │
│  • Office Chair                                   │
│  • Desk                                           │
│  • Keys                                           │
│  • Other                                          │
│                                                   │
│ Selected: [Show selection]                        │
└───────────────────────────────────────────────────┘

┌─ Asset Description * (Text Input - Required) ────┐
│ What exactly do you need?                         │
│ e.g., "14-inch Laptop with 16GB RAM, SSD"       │
│                                                   │
│ [Text input field]                                │
│ (This helps Admin understand your requirement)   │
└───────────────────────────────────────────────────┘
```

**Section 2: Request Details**

```
┌─ Request Type * (Radio Buttons - Required) ──────┐
│ ⦿ New Request (First time asset)                │
│ ○ Replacement (Current asset damaged/old)       │
│ ○ Additional (New project requirement)          │
└───────────────────────────────────────────────────┘

┌─ Business Justification * (Textarea - Required) ┐
│ Why do you need this asset?                      │
│ (Minimum 100 characters)                         │
│                                                  │
│ Example: "Need laptop for on-site client work.  │
│  Current device is 4 years old and slow for     │
│  video calls. Will use for travel to Mumbai     │
│  office."                                        │
│                                                  │
│ Character count: 145 / 300                       │
└───────────────────────────────────────────────────┘
```

**Section 3: Urgency (Optional)**

```
┌─ When do you need this? (Dropdown - Optional) ──┐
│ Select urgency...                                │
│  • Not Urgent (Anytime)                         │
│  • Needed Soon (Within 2 weeks)                 │
│  • Urgent (Within 1 week)                       │
│                                                  │
│ (If Urgent, provide reason in justification)    │
└───────────────────────────────────────────────────┘
```

### Form Validation Rules:

- ✓ Asset Category is **required**
- ✓ Asset Description is **required**
- ✓ Request Type is **required**
- ✓ Business Justification is **required** (minimum 100 characters, max 300)
- ✓ Urgency is optional
- ✓ Submit button disabled until all required fields are filled

### Action Buttons:

```
[Cancel]  [Submit Request]
```

**Button Behavior:**
- **Cancel:** Clear form and close, ask for confirmation if data entered
- **Submit:** Validate form, show success message, disable button (prevent double-submit)

### Success Message:

```
✓ Asset Request Submitted Successfully!

Request ID: REQ-2024-0158
Status: Pending Admin Review

Admin will review and contact you within 2-3 business days.

[View My Requests]  [Close]
```

---

## Data Model

### Asset Record (My Current Assets Tab):

```javascript
{
  assetCode: "LT-2024-0042",           // Unique ID
  category: "Laptop",                   // Asset type
  description: "MacBook Pro 14\" M2",  // Full details
  dateFrom: "2024-01-15",               // Assignment date
}
```

### Asset Request Record (Request Asset Tab):

```javascript
{
  requestId: "REQ-2024-0158",            // Auto-generated
  assetCategory: "Laptop",               // Selected category
  assetDescription: "14-inch with 16GB", // User input
  requestType: "New Request",            // One of: New, Replacement, Additional
  businessJustification: "...",          // User's reason
  urgency: "Needed Soon",                // Optional: Not Urgent, Needed Soon, Urgent
  submittedDate: "2024-06-26",           // Auto-filled
  submittedTime: "14:32:00",             // Auto-filled
  status: "Pending",                     // Initial status
  requestedBy: "EMP-0042",               // Current user ID
  requestedByName: "John Doe",           // Current user name
}
```

---

## Design Language & Styling

**Colors:**
- Navy: `#1C2035` (headers, text)
- Muted: `#8B90A7` (secondary text)
- Background: `#F0F2F8` (page)
- Card/Surface: `#FFFFFF` (white)
- Border: `#E4E6EF` (light gray)
- Primary Action: `#6366F1` (indigo - for buttons)
- Success: `#22C55E` (green)
- Error: `#E84855` (red)

**Typography:**
- Font Family: "DM Sans", system-ui, sans-serif
- Header (H1): 20px, fontWeight 800, color navy
- Label: 12px, fontWeight 700, uppercase
- Body: 13px-14px, fontWeight 500
- Helper Text: 12px, color muted

**Components:**
- Border Radius: 10-12px for inputs, 18px for cards
- Spacing: 18px-24px between sections
- Input Height: 44px
- Button Height: 44px
- Textarea Rows: 4-5

---

## User Flow

### Flow 1: View Current Assets

```
1. User navigates to Asset Management
2. Lands on "My Current Assets" tab (default)
3. Sees table of assigned assets (max 2-3 rows typically)
4. Can click "View" to see asset details (if detail page exists)
5. Or click "+ Request Asset" to create new request
```

### Flow 2: Request New Asset

```
1. Click "+ Request Asset" button (top right or in tab)
2. Switch to "Request Asset" tab
3. Fill Form:
   a. Select Asset Category
   b. Enter Asset Description
   c. Select Request Type
   d. Write Business Justification
   e. (Optional) Select Urgency
4. Click "Submit Request"
5. See success message with Request ID
6. Admin receives notification for review
```

### Flow 3: After Submission

```
1. Request stored in database with "Pending" status
2. Employee can:
   - Submit another request
   - Go back to "My Current Assets" to view existing assets
   - Navigate away (request is saved)
3. Admin will:
   - Review the request
   - Approve or Reject
   - Contact employee if needed
   - Allocate asset when approved
```

---

## Future Enhancements (Phase 2)

- **Request History Tab:** View all submitted requests (Pending, Approved, Rejected)
- **Asset Detail Page:** Full details of individual assets
- **Edit Request:** Ability to edit pending requests
- **Cancel Request:** Cancel pending requests with confirmation
- **Admin Dashboard:** For Admin to review and allocate assets

---

## Implementation Notes

### Required State Variables (React Hooks):

```javascript
// Tab state
const [activeTab, setActiveTab] = useState('current'); // 'current' or 'request'

// My Current Assets
const [assets, setAssets] = useState([]); // List of assigned assets

// Request Asset Form
const [formData, setFormData] = useState({
  assetCategory: '',
  assetDescription: '',
  requestType: 'New Request',
  businessJustification: '',
  urgency: 'Not Urgent',
});

const [submitted, setSubmitted] = useState(false);
const [requestId, setRequestId] = useState('');
```

### API Endpoints Needed:

```
GET /api/employee/assets                    // Get my current assets
POST /api/employee/assets/request           // Submit new request
GET /api/employee/assets/requests           // Get request history (Phase 2)
```

### Form Validation:

```javascript
const isFormValid = () => {
  return (
    formData.assetCategory !== '' &&
    formData.assetDescription.trim() !== '' &&
    formData.requestType !== '' &&
    formData.businessJustification.length >= 100
  );
};
```

---

## File Structure

```
employee/
├── assets/
│   └── AssetManagementPage.tsx    ← Main component (both tabs)
│
└── assets.md                       ← This file (documentation)
```

---

This is the simplified, easy-to-implement Asset Management flow! Ready to start building the React component? 🚀
