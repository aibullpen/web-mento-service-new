# Initial Prompt Restoration (Updated)

Based on your feedback and the current codebase (`mento-service`), here is the reconstructed prompt.

## Project: Mento Agent Service

**Goal:** Develop a web application for a mentoring service ("Mento Agent").

**Tech Stack:**
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **Backend/Auth:** Firebase

**Key Requirements:**
1.  **Authentication:**
    *   **Google Login ONLY:** Users must sign up and sign in using their Google account only.
    *   **No Email/Password:** Do not implement traditional email/password registration or login.
    *   Use Firebase Authentication for handling Google Sign-In.

2.  **Admin Dashboard:**
    *   Implement a dashboard accessible only to specific admin users.
    *   Features likely include viewing registered users and their login activity (based on `AdminDashboard.tsx`).

3.  **UI/UX:**
    *   Clean, modern interface (Snow/White theme observed in `Login.tsx`).
    *   "Mento Agent" branding.
