# Neighborly v2

A scalable local service marketplace connecting people who need household help with trusted local helpers.

**v2 rebuild started December 2025** — learning from every mistake in v1.

### Who uses Neighborly?

| User            | Goal                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Seeker**      | Find a trusted cleaner from nearby current location , book in 2 clicks, pay deposit and balance only after satisfied |
| **Helper**      | Set weekly slots,set location and services , get paid fairly | 
| **Admin (me)**  | Verify helpers, resolve disputes, see earnings, edit prices         | 

### Core User Stories 

| # | As a...                     | I want to...                                                                 | So that...                              |
|---|-----------------------------|------------------------------------------------------------------------------|-----------------------------------------|
| 1 | Seeker                      | Register/login with email or Google                                           | Start booking fast                      |
| 2 | Seeker                      | Choose General or Deep cleaning + BHK → see fixed price                      | No confusion                            |
| 3 | Seeker                      | Book a helper for a specific date + slot → pay deposit                      | Slot is reserved                        |
| 4 | Helper                      | Set weekly availability (morning/afternoon/full-day per service)            | I control my schedule                   |
| 5 | Helper                      | Accept/reject requests within 24 h                                           | I only take jobs I want                 |
| 6 | Both                        | Auto full refund if helper rejects or ignores 24 h                           | Trust                                   |
| 7 | Seeker                      | Mark “Satisfied” → pay balance or “Not satisfied” → full refund + dispute   | I’m protected                           |
| 8 | Helper                      | Get paid only after seeker clicks “Satisfied”                                | No free work                            |
| 9 | Admin                       | Verify helpers, resolve disputes, see earnings, edit prices                 | Platform stays healthy                  |

Future categories (plumbing, driver, tutor, caretaker, mechanic) will use the **exact same flow** — zero code changes needed.

### Why I restarted from scratch

v1 actually worked — users could register, book cleaners, chat, pay, everything.  
But the more I used it, the clearer it became: it was built on quicksand.

The biggest lessons that forced me to delete everything and restart:

- **Helper Availability & booking logic had logical issues**  
  Conflicts happen with booking and availablity. Adding plumbing, driving, tutoring, or caretaking would have broken everything.

- **No proper service catalog**  
  In v1, helpers decided their own price, duration, and slot rules.This could create problems like:Overpricing,Inconsistent duration,Tasks not finishing on time,No standardisation across helpers

- **Race conditions & booking conflicts**  
  Two users could book the same helper at the same time — classic concurrency bug waiting to explode.

- **Zero scalability plan**  
I kept adding categories without designing the database or APIs to support them long-term.I didn’t know what to store, what to send to the frontend, or how availability rules should work.

So I made the painful but right call:  
Deleted the entire repo.  
Started v2 with **one category (Cleaning)** — but designed from day 1 so I can add **handyman, teaching, caretaking** tomorrow with zero breaking changes.

Now every piece is built on real system design:
- Service catalog with `duration_slots` and `slotType`
- Weekly recurring + exception-based availability
- Atomic booking with conflict detection
- Clean architecture, TypeScript strict, proper API contracts

v1 wasn’t a failure.  
It was the most expensive — and best — teacher I ever had.

Now building v2 the way real scalable products are built.


### What I'm building now
- Fixed pricing through a **service catalog** (add 100 categories tomorrow → zero code change)  
- Smart slot blocking: General cleaning = 1 slot, Deep cleaning = full day  
- Weekly availability + exceptions (vacations, holidays)  
- Future-proof for cleaning,handyman,packing help, tutoring, caretaking, mechanics...  
- Clean architecture, TypeScript strict, proper API versioning  
- Real money flow with deposit + balance after job  
- Full admin panel for verification, disputes, earnings  

### Tech Stack
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + Redux Toolkit  
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose  
- **Auth**: JWT + Google OAuth + httpOnly refresh tokens  
- **Payments**: Razorpay  
- **Deployment**: Vercel (frontend) + Render (backend)  


Open to feedback, suggestions, and collaboration!  
Feel free to open issues or PRs.

### Contact
- LinkedIn: [https://www.linkedin.com/in/athira-v-jacob-920487246/]  
- Email: athiravjacob2024@gmail.com  


