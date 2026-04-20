# 🎬 CineBook - System Flow Diagrams

## 1. Complete User Journey

```
┌─────────────┐
│   START     │
│  (User)     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  HOME PAGE                  │
│  - Browse Movies            │
│  - Search Movies            │
│  - View Now Showing         │
│  - View Coming Soon         │
└──────┬──────────────────────┘
       │ Click Movie
       ▼
┌─────────────────────────────┐
│  MOVIE DETAILS PAGE         │
│  - View Movie Info          │
│  - See Cast & Crew          │
│  - Select Date              │
│  - View Show Timings        │
└──────┬──────────────────────┘
       │ Select Show
       ▼
┌─────────────────────────────┐
│  SEAT SELECTION PAGE        │
│  - View Seat Map            │
│  - Select Seats             │
│  - See Price Breakdown      │
│  - 10-min Timer Starts      │
└──────┬──────────────────────┘
       │ Proceed to Payment
       ▼
┌─────────────────────────────┐
│  CONFIRMATION PAGE          │
│  - View Ticket              │
│  - See Booking ID           │
│  - Download/Share Options   │
│  - Confetti Animation       │
└──────┬──────────────────────┘
       │ View All Bookings
       ▼
┌─────────────────────────────┐
│  BOOKING HISTORY PAGE       │
│  - View All Bookings        │
│  - Filter by Status         │
│  - Cancel Bookings          │
│  - Search by ID             │
└─────────────────────────────┘
```

---

## 2. Seat Booking Transaction Flow

```
┌──────────────┐
│ User Selects │
│    Seats     │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Frontend: Lock Seats API Call      │
│  POST /api/bookings/seats/lock      │
│  {                                   │
│    showId: "...",                    │
│    seatNumbers: ["A1", "A2"],        │
│    sessionId: "SESSION-..."          │
│  }                                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend: Start Transaction         │
│  - Begin MongoDB Transaction        │
│  - Set Isolation Level              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Check Seat Availability            │
│  - Query Show Document              │
│  - Check bookedSeats array          │
│  - Check lockedSeats array          │
└──────┬──────────────────────────────┘
       │
       ├─── Seats Available ───┐
       │                        │
       │                        ▼
       │              ┌─────────────────────┐
       │              │  Lock Seats         │
       │              │  - Add to lockedSeats│
       │              │  - Set expiry time  │
       │              │  - Increment version│
       │              └──────┬──────────────┘
       │                     │
       │                     ▼
       │              ┌─────────────────────┐
       │              │  Commit Transaction │
       │              └──────┬──────────────┘
       │                     │
       │                     ▼
       │              ┌─────────────────────┐
       │              │  Return Success     │
       │              │  - Locked seats     │
       │              │  - Expiry time      │
       │              └─────────────────────┘
       │
       └─── Seats Unavailable ───┐
                                  │
                                  ▼
                        ┌─────────────────────┐
                        │  Rollback Transaction│
                        └──────┬──────────────┘
                               │
                               ▼
                        ┌─────────────────────┐
                        │  Return Error       │
                        │  "Seat already      │
                        │   booked/locked"    │
                        └─────────────────────┘
```

---

## 3. Complete Booking Flow

```
┌──────────────────┐
│  Seats Locked    │
│  (10 min timer)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  User Clicks "Proceed to Payment"│
└────────┬─────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: Create Booking API Call  │
│  POST /api/bookings?sessionId=...   │
│  {                                   │
│    userId: "...",                    │
│    showId: "...",                    │
│    selectedSeats: ["A1", "A2"],      │
│    seatCategory: "GOLD"              │
│  }                                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: Start Transaction         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Verify Seat Locks                  │
│  - Check locks belong to session    │
│  - Check locks not expired          │
└────────┬────────────────────────────┘
         │
         ├─── Valid ───┐
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Generate Booking ID    │
         │    │  Format: BK-2024-XXXXX  │
         │    └────────┬────────────────┘
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Calculate Price        │
         │    │  - Base price           │
         │    │  - Weekend surcharge    │
         │    │  - First show surcharge │
         │    │  - GST                  │
         │    └────────┬────────────────┘
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Create Booking Record  │
         │    │  - Save to DB           │
         │    │  - Status: CONFIRMED    │
         │    └────────┬────────────────┘
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Update Show            │
         │    │  - Remove locks         │
         │    │  - Add to bookedSeats   │
         │    │  - Decrease available   │
         │    └────────┬────────────────┘
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Commit Transaction     │
         │    └────────┬────────────────┘
         │             │
         │             ▼
         │    ┌─────────────────────────┐
         │    │  Return Booking         │
         │    │  - Booking ID           │
         │    │  - Ticket details       │
         │    └─────────────────────────┘
         │
         └─── Invalid ───┐
                         │
                         ▼
                ┌─────────────────────┐
                │  Rollback Transaction│
                └────────┬────────────┘
                         │
                         ▼
                ┌─────────────────────┐
                │  Return Error       │
                │  "Lock expired or   │
                │   invalid"          │
                └─────────────────────┘
```

---

## 4. Price Calculation Flow

```
┌──────────────────┐
│  Selected Seats  │
│  Category: GOLD  │
│  Count: 2        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Calculate Base Price           │
│  ₹250 × 2 = ₹500                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Check Show Date                │
│  Is it Weekend? (Fri/Sat/Sun)   │
└────────┬────────────────────────┘
         │
         ├─── Yes ───┐
         │           │
         │           ▼
         │  ┌─────────────────────┐
         │  │  Weekend Surcharge  │
         │  │  ₹500 × 20% = ₹100  │
         │  └────────┬────────────┘
         │           │
         └─── No ────┤
                     │
                     ▼
         ┌─────────────────────────┐
         │  Check Show Time        │
         │  Is it before 12 PM?    │
         └────────┬────────────────┘
                  │
                  ├─── Yes ───┐
                  │           │
                  │           ▼
                  │  ┌──────────────────────┐
                  │  │  First Show Surcharge│
                  │  │  ₹500 × 30% = ₹150   │
                  │  └────────┬─────────────┘
                  │           │
                  └─── No ────┤
                              │
                              ▼
                  ┌─────────────────────────┐
                  │  Calculate Subtotal     │
                  │  Base + Surcharges      │
                  │  ₹500 + ₹100 + ₹150     │
                  │  = ₹750                 │
                  └────────┬────────────────┘
                           │
                           ▼
                  ┌─────────────────────────┐
                  │  Calculate GST (18%)    │
                  │  ₹750 × 18% = ₹135      │
                  └────────┬────────────────┘
                           │
                           ▼
                  ┌─────────────────────────┐
                  │  Calculate Total        │
                  │  ₹750 + ₹135 = ₹885     │
                  └────────┬────────────────┘
                           │
                           ▼
                  ┌─────────────────────────┐
                  │  Return Price Breakdown │
                  │  {                      │
                  │    basePrice: 500,      │
                  │    weekendSurcharge: 100│
                  │    firstShowSurcharge:  │
                  │      150,                │
                  │    subtotal: 750,       │
                  │    gst: 135,            │
                  │    total: 885           │
                  │  }                      │
                  └─────────────────────────┘
```

---

## 5. Seat Lock Expiration Flow

```
┌──────────────────┐
│  Scheduled Task  │
│  (Every 1 min)   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────┐
│  Get All Shows              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  For Each Show              │
│  Check lockedSeats array    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  For Each Locked Seat       │
│  Check expiresAt timestamp  │
└────────┬────────────────────┘
         │
         ├─── Expired ───┐
         │               │
         │               ▼
         │      ┌─────────────────────┐
         │      │  Remove Lock        │
         │      │  - Delete from array│
         │      └────────┬────────────┘
         │               │
         │               ▼
         │      ┌─────────────────────┐
         │      │  Update Show        │
         │      │  - Save to DB       │
         │      └────────┬────────────┘
         │               │
         │               ▼
         │      ┌─────────────────────┐
         │      │  Log Cleanup        │
         │      │  "Cleaned expired   │
         │      │   locks for show"   │
         │      └─────────────────────┘
         │
         └─── Not Expired ───┐
                             │
                             ▼
                    ┌─────────────────┐
                    │  Keep Lock      │
                    │  Continue       │
                    └─────────────────┘
```

---

## 6. Cancel Booking Flow

```
┌──────────────────┐
│  User Clicks     │
│  "Cancel Booking"│
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend: Confirm Dialog       │
│  "Are you sure?"                │
└────────┬────────────────────────┘
         │
         ├─── Yes ───┐
         │           │
         │           ▼
         │  ┌─────────────────────────┐
         │  │  API Call               │
         │  │  PUT /api/bookings/     │
         │  │    {bookingId}/cancel   │
         │  └────────┬────────────────┘
         │           │
         │           ▼
         │  ┌─────────────────────────┐
         │  │  Backend: Get Booking   │
         │  └────────┬────────────────┘
         │           │
         │           ▼
         │  ┌─────────────────────────┐
         │  │  Check Show Date        │
         │  │  Is it in the future?   │
         │  └────────┬────────────────┘
         │           │
         │           ├─── Yes ───┐
         │           │           │
         │           │           ▼
         │           │  ┌──────────────────┐
         │           │  │  Start Transaction│
         │           │  └────────┬─────────┘
         │           │           │
         │           │           ▼
         │           │  ┌──────────────────┐
         │           │  │  Update Booking  │
         │           │  │  Status:CANCELLED│
         │           │  │  Payment:REFUNDED│
         │           │  └────────┬─────────┘
         │           │           │
         │           │           ▼
         │           │  ┌──────────────────┐
         │           │  │  Update Show     │
         │           │  │  - Remove seats  │
         │           │  │    from booked   │
         │           │  │  - Increase      │
         │           │  │    available     │
         │           │  └────────┬─────────┘
         │           │           │
         │           │           ▼
         │           │  ┌──────────────────┐
         │           │  │  Commit          │
         │           │  └────────┬─────────┘
         │           │           │
         │           │           ▼
         │           │  ┌──────────────────┐
         │           │  │  Return Success  │
         │           │  └──────────────────┘
         │           │
         │           └─── No (Past) ───┐
         │                             │
         │                             ▼
         │                    ┌─────────────────┐
         │                    │  Return Error   │
         │                    │  "Cannot cancel │
         │                    │   past show"    │
         │                    └─────────────────┘
         │
         └─── No (User Cancelled) ───┐
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Do Nothing     │
                            └─────────────────┘
```

---

## 7. Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  HTML    │  │   CSS    │  │    JS    │     │
│  │  Pages   │  │  Styles  │  │  Logic   │     │
│  └────┬─────┘  └──────────┘  └────┬─────┘     │
│       │                            │           │
│       └────────────┬───────────────┘           │
│                    │                            │
└────────────────────┼────────────────────────────┘
                     │
                     │ HTTP/JSON
                     │
┌────────────────────▼────────────────────────────┐
│                  BACKEND                        │
│  ┌──────────────────────────────────────────┐  │
│  │         REST Controllers                 │  │
│  │  - MovieController                       │  │
│  │  - ShowController                        │  │
│  │  - BookingController                     │  │
│  │  - UserController                        │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │         Service Layer                    │  │
│  │  - MovieService                          │  │
│  │  - ShowService                           │  │
│  │  - BookingService                        │  │
│  │  - SeatService (Transactions)            │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │         Repository Layer                 │  │
│  │  - MovieRepository                       │  │
│  │  - ShowRepository                        │  │
│  │  - BookingRepository                     │  │
│  │  - TheaterRepository                     │  │
│  │  - UserRepository                        │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
└───────────────────┼─────────────────────────────┘
                    │
                    │ MongoDB Driver
                    │
┌───────────────────▼─────────────────────────────┐
│              MONGODB DATABASE                   │
│  ┌──────────────────────────────────────────┐  │
│  │  Collections:                            │  │
│  │  - movies                                │  │
│  │  - theaters                              │  │
│  │  - shows                                 │  │
│  │  - bookings                              │  │
│  │  - users                                 │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 8. Concurrent Booking Scenario

```
User A                    User B                    Database
  │                         │                          │
  │ Select Seat A1          │                          │
  ├────────────────────────────────────────────────────>
  │                         │                          │
  │                         │ Select Seat A1           │
  │                         ├─────────────────────────>│
  │                         │                          │
  │ Lock Request            │                          │
  ├────────────────────────────────────────────────────>
  │                         │                          │
  │                         │ Lock Request             │
  │                         ├─────────────────────────>│
  │                         │                          │
  │ Transaction Start       │                          │
  │ Check: Available ✓      │                          │
  │ Lock Seat A1            │                          │
  │ Version: 1 → 2          │                          │
  │ Commit ✓                │                          │
  <────────────────────────────────────────────────────┤
  │                         │                          │
  │ Success: Seat Locked    │                          │
  │                         │                          │
  │                         │ Transaction Start        │
  │                         │ Check: Locked ✗          │
  │                         │ Rollback                 │
  │                         <─────────────────────────┤
  │                         │                          │
  │                         │ Error: Seat Already      │
  │                         │        Locked            │
  │                         │                          │
```

---

**These diagrams illustrate the complete system flow and interactions in CineBook!** 🎬
