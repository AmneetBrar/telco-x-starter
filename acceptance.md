
All projects
Group 5 Project
Created by Jo
·
Shared with your org

Claude Fable 5 is currently unavailable.
Learn more(opens in new tab)


How can I help you today?


Your chats are private until shared
Start a chat to keep conversations organized and re-use project knowledge.
Instructions
All project users
Add instructions to tailor Claude’s responses

Files
All project users
68% of project capacity used
Search mode

telco-x-acceptance-criteria.md
129 lines

md



Telco X Home.html
307 lines

html



TelcoX_PM_Brief.docx
60 lines

docx



Telco_X_Challenge_Brief_NBNCo.docx
156 lines

docx


telco-x-acceptance-criteria.md


Telco X — Acceptance Criteria
Given / When / Then format · All decisions recorded · Last updated: 2026-06-23

Page 1 — Home & Search
AC-01 · Known address search
Given the user is on the Home page, When they type or select a known address from the 10 in Tool 1, Then the app navigates to the Address Result page displaying that address and its map pin coordinates from Tool 1.

AC-02 · Unknown address error
Given the user is on the Home page, When they submit an address that does not match any of the 10 in Tool 1, Then the app displays a helpful inline error message and does not navigate away from the Home page.

AC-03 · All 10 addresses selectable
Given the user is on the Home page, When they open the address picker/dropdown, Then all 10 addresses from Tool 1 are listed and each one navigates correctly to Page 2.

Page 2 — Address Result (Active branch)
AC-04 · Active address — subscriber info displayed
Given the selected address has status active in Tool 1, When Page 2 loads, Then the subscriber's current product, connection date, and upgrade eligibility from Tool 4 are displayed.

AC-05 · Active address — network RAG displayed
Given the selected address has status active, When Page 2 loads, Then the network status (RAG), sync speeds, and last outage from Tool 5 are displayed, labelled as Network Health.

AC-06 · Active address — service RAG displayed
Given the selected address has status active, When Page 2 loads, Then the open tickets, appointments, and service health (RAG) from Tool 6 are displayed, labelled as Service Health.

AC-07 · Upgrade card shown when eligible
Given the selected address is active and upgrade_eligible is true in Tool 4, When Page 2 loads, Then an upgrade card is visible and interactive on the page.

AC-08 · Upgrade card shown as disabled when not eligible
Given the selected address is active and upgrade_eligible is false in Tool 4, When Page 2 loads, Then the upgrade card is visible but rendered in a disabled/greyed state, and is non-interactive (no click target or navigation).

🔴 Human Decision recorded: Team resolved the [UNDEFINED RULE] — show a disabled/greyed card when upgrade_eligible = false. Update CLAUDE.md and the relevant GitHub Issue before build.

Page 2 — Address Result (Non-active branch)
AC-09 · Previous/never address — product options displayed
Given the selected address has status previous or never in Tool 1, When Page 2 loads, Then valid product options from Tool 3 are displayed, filtered to the access technology for that address from Tool 2.

AC-10 · No subscriber data exposed for non-active
Given the selected address has status previous or never, When Page 2 loads, Then no subscriber info (Tool 4), network records (Tool 5), or service records (Tool 6) are shown anywhere on the page.

AC-11 · Map pin shown for all statuses
Given any address is selected, When Page 2 loads, Then a map pin is rendered using the coordinates from Tool 1, regardless of connection status.

Page 3a — Full Subscriber Detail (Active only)
AC-12 · Subscriber detail opens from Page 2
Given the user is on Page 2 for an active address, When they select the action to view full subscriber detail, Then Page 3a loads showing the complete subscriber record from Tool 4.

AC-13 · Non-active address requesting subscriber detail returns error state
Given the selected address has status previous or never, When a request is made for the subscriber detail view (Page 3a), Then the app renders an error state — no subscriber data is displayed, and a clear message informs the user that subscriber detail is unavailable for this address.

🔴 Human Decision recorded: Team resolved the [UNDEFINED RULE] — non-active → Page 3a returns an error state (not a redirect, not a 404 page). Confirm with the engineer whether this is a client-side guard or a mock API response, and document the choice in the GitHub Issue.

Page 3b — Provider List (Non-active only)
AC-14 · Provider list opens from selected product
Given the user is on Page 2 for a previous or never address and selects a product, When they navigate to Page 3b, Then the provider list displayed matches the providers from Tool 7 filtered by the access technology from Tool 2.

AC-15 · Provider names and count are exact
Given the user is on Page 3b, When the provider list is rendered, Then every provider name matches Tool 7 exactly, and the count shown equals the number of records in Tool 7 for that technology — no more, no less.

Cross-cutting — Navigation & Layout
AC-16 · Back navigation preserves address
Given the user has navigated from Page 2 to Page 3 (either mode), When they use the back control, Then they return to Page 2 with the same address still selected and no data reset.

AC-17 · Mobile layout
Given the app is viewed on a mobile viewport, When any of the three pages loads, Then all content is readable, all interactive elements are tappable, and no content is clipped or hidden.

AC-18 · Accessibility labels
Given any page is rendered, When inspected for accessibility, Then every interactive element has a clear visible label and the RAG status indicators include a text label (not colour alone).

Notes
RAG labels on AC-05, AC-06, and AC-18 refer to operational status (network/service health 🔴🟡🟢). Keep these clearly distinct from the Three-Tier framework labels — same colours, different meaning.
Both [UNDEFINED RULE] decisions are now resolved and recorded above (AC-08, AC-13). Ensure CLAUDE.md is updated before handing Issues to the engineer.
