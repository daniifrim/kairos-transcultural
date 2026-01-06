# Kairos Transcultural - Website Specification

## Project Overview
Landing page and admin dashboard for Kairos Transcultural, a 2-week mission experience in Uganda combining the Kairos course with a transcultural experience in the Batwa tribes.

**Domain:** kairostranscultural.ifrim.tech  
**Deployment:** Dokploy on VPS  
**Language:** Romanian only

---

## Tech Stack
- **Frontend:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth)
- **State Management:** TanStack Query (React Query)
- **Template:** Vercel Next.js + Supabase Starter

---

## 1. Landing Page (Public)

### Sections
| Section | Content |
|---------|---------|
| Hero | Background image + "Kairos Transcultural 2025" + description |
| Counter | "Locuri ocupate: X/30" (only confirmed status participants) |
| CTAs | Two WhatsApp buttons |
| Video | YouTube embed (Kairos Transcultural Promo) |
| Image Carousel | Photos from past events (admin-provided) |
| Cursul Kairos | Theory section - 9 interactive sessions |
| Experiență transculturală | Practice section - Batwa tribes experience |
| Impactul cursului | Impact/benefits section |
| FAQ | Expandable questions |
| Footer | Partner logos |

### WhatsApp Contacts
- **Florin Bucur:** +44 7463 913927
- **Ionuț Bălan:** +40 755 673 079

### Capacity Behavior
- Max capacity: 30 confirmed participants per cohort
- When full: Hide CTAs, show "Locuri epuizate" message

---

## 2. Participant Flow

```
1. Visitor sees landing page
         ↓
2. Contacts admin via WhatsApp
         ↓
3. Admin adds to system → Status: "EXPRESSED INTEREST"
         ↓
4. Counter does NOT include this person yet
         ↓
5. Participant confirms (buys ticket)
         ↓
6. Participant fills Tally form with full details
         ↓
7. System auto-matches Tally submission using AI fuzzy match on name
         ↓
8. form_completed = true
         ↓
9. Admin changes status to "CONFIRMED"
         ↓
10. Counter NOW includes this person
```

### Participant Statuses
- `expressed_interest` - Initial status when admin adds them
- `confirmed` - Bought ticket, counted in capacity
- `denied` - Rejected/cancelled

---

## 3. Admin Dashboard (Protected)

### Authentication
- Google OAuth login
- New admins must be approved by main admin
- Main admin: Dani Ifrim
- Additional admin: 1 other person

### Dashboard Features
- [ ] List all participants with filters (by status, form completion)
- [ ] Add new participant (Name, Contact) - auto-fills "Added By"
- [ ] Edit participant details
- [ ] Change status dropdown
- [ ] View form completion status (✓/✗)
- [ ] View Tally form data for each participant
- [ ] Export to CSV/Excel
- [ ] Cohort management (create, switch active)

---

## 4. Cohort Management

- Create cohorts by name: "Kairos 2025", "Kairos 2026", etc.
- One cohort is "active" at a time
- Landing page shows counter for active cohort only
- Each cohort has its own participant list
- Default capacity: 30 per cohort

---

## 5. Database Schema

### Tables

#### `cohorts`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | e.g., "Kairos 2025" |
| is_active | boolean | Only one active at a time |
| capacity | integer | Default 30 |
| created_at | timestamptz | Auto-generated |

#### `participants`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| cohort_id | uuid | Foreign key to cohorts |
| name | text | Full name |
| contact | text | Phone or email |
| status | enum | expressed_interest, confirmed, denied |
| form_completed | boolean | Has filled Tally form |
| tally_data | jsonb | Full Tally form response |
| added_by | uuid | Foreign key to admins |
| created_at | timestamptz | Auto-generated |
| updated_at | timestamptz | Auto-updated |

#### `admins`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Google email |
| name | text | Display name |
| is_approved | boolean | Approved by main admin |
| is_main_admin | boolean | Has approval powers |
| created_at | timestamptz | Auto-generated |

### Enums
- `participant_status`: 'expressed_interest', 'confirmed', 'denied'

---

## 6. Tally Integration

### Existing Tally Form Fields
- Nume și Prenume (Name) *
- Vârstă (Age) *
- Sex (Gender) *
- Număr de Telefon (Phone) *
- Email *
- Număr de pașaport (Passport) *
- Biletul de avion (Plane ticket file upload)
- Biserica din care faci parte (Church) *
- Țara de proveniență (Country) *
- Ai mai parcurs cursul Kairos? (Previous experience) - Yes/No
- Alergii (Allergies)
- Alte informații (Other info)

### Integration Flow
1. Tally form submits via webhook to Supabase Edge Function
2. Edge Function uses AI to fuzzy match "Nume și Prenume" to existing participant
3. If match found: Update participant with `form_completed = true` and store `tally_data`
4. If no match: Create new record or flag for manual review

---

## 7. Not Included in v1
- Email notifications
- Multi-language support
- Data migration from existing system
- Payment processing

---

## 8. Design Guidelines
- Clean, modern design
- Consistent with mission/religious theme
- Orange/sunset color palette (matching current hero image)
- Mobile-responsive
- Accessible (WCAG compliant)

---

## Approval
- [ ] Spec approved by stakeholder
- [ ] Ready for development

*Last updated: December 30, 2025*
