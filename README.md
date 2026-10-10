# 🛒 বাজার দর (Bazar Dor)

A responsive Bengali-language market price app for checking everyday grocery prices, comparing market rates, and viewing product details.

## 🔗 Links

- **Live Site:** 
- **GitHub Repository:** https://github.com/shahedminhaj/Assignment7_PH.git

## 🛠️ Technologies Used

- **Next.js 16** (App Router) — UI and routing
- **React 19** — Component library
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling and responsiveness
- **Better Auth** — Email/Password + Google + GitHub authentication
- **MongoDB** — Database for user and session data
- **React Hot Toast** — Toast notifications
- **Bazar Dor Products API** — Product and category data

## ✨ Key Features

1. **Responsive Bengali UI** — Works seamlessly on mobile, tablet, and desktop with a Bengali-language interface.
2. **Authentication (Better Auth)** — Sign up / Sign in with Email/Password, Google, and GitHub. Toast notifications on success, error, and logout.
3. **Product Sections on Home** — Top 6 risers (▲), Top 6 fallers (▼), and all products in a responsive grid with Bengali numerals.
4. **Category Page with Sort** — Browse products by category, sort by price (low → high, high → low), skeleton loading, and 404 empty state.
5. **Protected Product Details Page** — Requires login. Shows min/max/average price and market-by-market price summary.
6. **Price Ticker (Marquee)** — Infinite scrolling strip under the navbar with emoji + name + price + change percentage.
7. **Profile Update** — Logged-in users can update their display name via Better Auth's update user API.