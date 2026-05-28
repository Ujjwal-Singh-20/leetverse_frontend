# LEETVERSE - Frontend

> A competitive DSA practice platform built for KIIT students. Track sessions, climb leaderboards, verify LeetCode submissions - all in a cyberpunk-themed interface.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Authentication](#authentication)
  - [Home Page](#home-page)
  - [Leaderboard](#leaderboard)
  - [Practice Hub](#practice-hub)
  - [Members Directory](#members-directory)
  - [Notes](#notes)
  - [User Dashboard (Profile)](#user-dashboard-profile)
  - [Admin Portal](#admin-portal)
  - [Promo Posters](#promo-posters)
  - [System Status Indicator](#system-status-indicator)
  - [Reminder Banner](#reminder-banner)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Overview

LEETVERSE is a DSA training platform at KIIT. It is structured around **Seasons** and **Levels** - recurring competitive sessions where participants earn points by attending classes, completing assigned questions, and doing extra practice. Admins upload daily score sheets (Excel), and the backend processes them into a live leaderboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Routing | React Router |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| 3D Effects | React Three Fiber + Drei + Three.js |
| Authentication | Firebase Auth (Google Sign-In) |
| HTTP Client | Axios (with Firebase ID Token interceptor) |
| Icons | Lucide React |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── App.jsx                  # Root layout, navigation, routing
├── main.jsx                 # React DOM entry point
├── index.css                # Global styles & Tailwind base
├── App.css                  # App-level styles
├── data.js                  # Static data
│
├── components/
│   ├── Hero.jsx             # Landing page hero section
│   ├── Leaderboard.jsx      # Leaderboard table + tabs
│   ├── Connect.jsx          # Community/social links section
│   ├── ParallaxBackground.jsx   # Scroll-driven parallax layers
│   ├── Particles.jsx        # Ambient floating particle effect
│   ├── ReminderBanner.jsx   # Floating daily reminder strip
│   ├── UserAvatar.jsx       # Avatar component with fallback
│   ├── QuestionCard.jsx     # LeetCode question display card
│   ├── ValidationModal.jsx  # Question completion verification modal
│   └── PromoPosters.jsx     # Reusable page-load promo poster modal
│
├── pages/
│   ├── Dashboard.jsx        # User profile + Admin command centre
│   ├── Practice.jsx         # Practice hub (curriculum + extra)
│   ├── Members.jsx          # Club members directory
│   ├── Notes.jsx            # Study notes/resources page
│   ├── AdminUpload.jsx      # Admin: Excel score upload
│   ├── AdminCurriculum.jsx  # Admin: Curriculum manager
│   ├── AdminProgress.jsx    # Admin: Practice progress tracker
│   └── Unauthorized.jsx     # Access denied page
│
├── context/
│   ├── AuthContext.jsx      # Firebase auth state + user role
│   └── ReminderContext.jsx  # Global reminder/question state
│
├── services/
│   └── api.js               # Axios instance + all API calls
│
├── lib/
│   └── firebase.js          # Firebase app + auth initialization
│
└── assets/                  # Static image assets

public/
├── leetverse logo.jpg
└── posters/                 # Promo poster images go here
```

---

## Features

### Authentication

- **Google Sign-In** via Firebase Auth (`signInWithPopup`).
- On sign-in, a Firebase ID Token is obtained and sent to the backend to register/sync the user.
- The backend validates that the email belongs to `@kiit.ac.in` - non-KIIT emails are redirected to the `/unauthorized` page.
- The auth state drives role-based rendering throughout the app: regular `participant` vs `admin`.
- Every API request automatically attaches the Bearer token via an Axios request interceptor.
- The `useAuth()` hook exposes: `user`, `login()`, `logout()`, `isAdmin`, `loading`, `isUnauthorized`.

---

### Home Page

- **Hero section** - animated landing with call-to-action.
- **Leaderboard preview** - top performers rendered directly on the home page.
- **Connect section** - links to community channels and social profiles.
- **Parallax background** - layered scroll-driven background elements.

---

### Leaderboard

Located at `/#leaderboard` (home page section) and surfaced in `Leaderboard.jsx`.

- Displays **Top 10** participants for the current active Season + Level.
- Fetches from `/leaderboard/top10` and `/leaderboard/cached/top10`.
- Shows rank, roll number, name, and total points.
- Previous season/level winners are available via `/leaderboard/previous`.
- Live daily leaderboard accessible by date.

---

### Practice Hub

Route: `/practice`

A three-column layout for tracking all question activity:

| Column | Description |
|---|---|
| **Class Questions** | Questions covered in that session's class, organised by date |
| **Assigned Tasks** | Homework/assignment questions linked to the curriculum |
| **Extra Practice** | Self-directed questions logged manually by the user |

- Pulls the **Curriculum** from the backend for the selected Season/Level.
- Each question renders as a `QuestionCard` with status: `pending`, `done`, or `reminded`.
- Clicking **Complete** on a question opens the `ValidationModal` to verify LeetCode submission.
- The **Extra Practice** column has an input to log any LeetCode slug. The slug is stored against the user's roll number and today's date.
- Session filter buttons allow switching between Season/Level combinations.
- All the questions are stored for the User to be reminded to reattempt in future, based on the options they select in the ValidationModal.

---

### Members Directory

Route: `/members`

A showcase of all members, split into two tiers:

**Executive**
- The Presidents and Vice-Presidents.

**Domain Grid**
- Members are grouped by **domain**: Web Dev, Design, Marketing & PR, Video Editing, Mentoring.
- Clicking a domain card opens a modal listing all members in that domain.
- Social links: Instagram, LinkedIn, GitHub.

---

### Notes

Route: `/notes`

A dedicated page for study resources and notes shared with members. Embeds or links to externally hosted notes/documents relevant to the current curriculum.

---

### User Dashboard (Profile)

Route: `/profile`

**Participant view:**
- Displays current Season + Level with live status.
- **LeetCode Username Setup Banner** - prompts users who haven't linked their LeetCode account; inline editing with backend update.
- **Stats panel**: Total Points, Global Rank (live fetch), Days Present, Attendance Rate (%).
- **Session History table**: date-by-date log of attendance and points earned.
- **Historical Records**: Switch between past seasons/levels; shows archived rank and score in a read-only modal (`SESSION_ARCHIVE`).
- **Pending Reminders**: Lists daily unsolved questions with quick-complete buttons.
- **Unique Identicon**: Each User has an unique identicon using the roll number as seed value, the inspiration was from Github Identicons, but here DSA themed identicons are used.

**Admin view (`COMMAND_CENTRE`):**
- Summary stats: Total participants, Average points, Total points issued, Admin count.
- Participant table with score, attendance (Present/Absent days), and a drill-down modal per user.
- Administrator table listing all admin emails.
- Quick-access buttons to `Curriculum Manager`, `Practice Progress`, and `Upload Scores`.
- Session selector to switch the dashboard context between seasons/levels.

---

### Promo Posters

A reusable, config-driven modal that displays a promotional poster on page load.

**How it works:**
- Defined in `src/components/PromoPosters.jsx`.
- A `POSTERS` array at the top of the file is the single source of truth.
- Each poster entry supports:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique poster identifier |
| `enabled` | boolean | Toggle the poster on/off instantly |
| `image` | string | Path to the image in `public/posters/` |
| `alt` | string | Accessible alt text |
| `link` | string \| null | Optional click-through URL (e.g. registration form) |
| `expiresAt` | ISO date string \| null | Auto-hides after this date/time |
| `sessionKey` | string | `sessionStorage` key - poster shows once per browser session |

- **Session-based**: Once dismissed, the poster won't reappear until the tab/browser is reopened.
- **Auto-expiry**: Expired posters are silently skipped - no code changes needed after the event.
- Smooth spring entrance animation, backdrop blur overlay, ESC key and outside-click to dismiss.
- Skeleton shimmer while the poster image loads.

**Adding a new poster:**
```js
// In src/components/PromoPosters.jsx - POSTERS array
{
  id: 'my-next-event',
  enabled: true,
  image: '/posters/my-next-event.jpg',   // Place image in public/posters/
  alt: 'My Next Event – Description',
  link: 'https://forms.gle/...',          // null if no link needed
  expiresAt: '2026-07-01T00:00:00+05:30',
  sessionKey: 'promo_seen_my-next-event',
},
```

**Disabling a poster** (without deleting it):
```js
enabled: false,
```

---

### System Status Indicator

Displayed in the top navigation bar. Polls the backend health endpoint (`GET /`) every 30 seconds.

| State | Display |
|---|---|
| Healthy | Green pulse dot + `SYSTEM_LIVE` |
| Waking up (cold start) | Orange pulse dot + `SYSTEM_WAKING_UP...` |
| Syncing | Neutral dot + `SYNCING_CORE...` |

Clicking the indicator when offline manually re-triggers a health check.

---

### Reminder Banner

A global floating strip (`ReminderBanner.jsx`) managed by `ReminderContext`.

- Fetches pending daily questions for the logged-in user from `/reminders`.
- Shows question slugs that are due or overdue.
- Clicking a reminder opens the global `ValidationModal` to mark it as complete.
- Refreshes automatically after a question is verified.

---
