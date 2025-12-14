# Vialytics - Post-Hackathon MVP+ Plans

## Vision: From MVP to MRR (Minimum Recurring Revenue)

### Current State (Hackathon MVP)
- ✅ Wallet analytics for end users
- ✅ AI chat companion (Via)
- ✅ Transaction indexing
- ✅ Basic dashboard

---

## 🚀 Founder Mode (Business Intelligence for Builders)

### Concept
A specialized mode for Solana program developers/founders to analyze their own program's performance and user interactions.

### Value Proposition
**For founders building on Solana:** Get actionable business intelligence about your program without building custom analytics infrastructure.

### Key Features

#### 1. Program Account Indexing
- Index all interactions with a specific program account
- Track who's using the program (user wallet addresses)
- Monitor program state changes over time
- Identify power users vs casual users

#### 2. Founder Dashboard
- **User Acquisition Metrics**
  - New wallets interacting with program over time
  - Retention rate (repeat users)
  - User segmentation by activity level
  
- **Program Activity Analytics**
  - Instruction call frequency
  - Most popular program endpoints
  - Transaction success/failure rates
  - Gas fees paid by users
  
- **Revenue Tracking** (if applicable)
  - Fees collected by program
  - Transaction volume
  - TVL (Total Value Locked) trends

#### 3. AI-Powered Insights
Via can answer questions like:
- "How many unique users interacted with my program this week?"
- "What's my user retention rate?"
- "Which program instructions are most popular?"
- "Show me my power users"
- "What's the average transaction size?"

### Technical Implementation

#### Phase 1: Data Collection
```
[ ] Modify vialytics-core indexer to support program account indexing
[ ] Add program_interactions table to schema
[ ] Track: wallet, instruction, timestamp, success, fee, data
```

#### Phase 2: Analytics Engine
```
[ ] Build aggregation queries for program metrics
[ ] Implement cohort analysis (daily/weekly/monthly active users)
[ ] Create user segmentation logic
```

#### Phase 3: Founder Dashboard UI
```
[ ] New "Founder Mode" toggle in UI
[ ] Program account input (instead of wallet address)
[ ] Specialized visualizations:
    - User growth chart
    - Instruction popularity pie chart
    - Retention cohort table
    - Power user leaderboard
```

#### Phase 4: Premium Features
```
[ ] Export data to CSV
[ ] Custom date ranges
[ ] Webhook alerts (e.g., "new user milestone reached")
[ ] Competitive analysis (compare with similar programs)
```

---

## 💰 Monetization Strategy (MRR Focus)

### Shift from MVP to MRR
**Old Thinking:** Build cool demo → hope people use it  
**New Meta:** Build something people will PAY for → validate revenue → scale

### Pricing Tiers

#### Free Tier (User Mode)
- Analyze your own wallet
- Basic Via chat
- Limited to 100 transactions
- **Goal:** User acquisition, viral growth

#### Pro Tier - $29/month (Power User Mode)
- Unlimited wallet analytics
- Advanced Via chat with deeper insights
- Portfolio tracking across multiple wallets
- Export data
- **Target:** Crypto traders, DeFi users

#### Founder Tier - $99/month (Founder Mode)
- All Pro features
- Program account analytics
- User acquisition metrics
- Custom dashboards
- API access
- **Target:** Solana program developers, protocol teams

#### Enterprise - Custom pricing
- White-label solution
- Multiple programs
- Team collaboration
- Dedicated support
- **Target:** DAOs, larger protocols

### Revenue Milestones
- **Week 1:** 10 paying users = $290 MRR
- **Month 1:** 50 paying users = $1,450 MRR
- **Month 3:** 200 paying users = $5,800 MRR
- **Month 6:** 500 paying users = $14,500 MRR

### Growth Hacks
1. **Freemium virality:** Free tier users share analytics on Twitter
2. **Founder outreach:** Direct message Solana program devs
3. **Content marketing:** "How we analyzed [popular program]" case studies
4. **Integration partnerships:** Partner with program frameworks (Anchor, etc.)
5. **Hackathon sponsors:** Sponsor Solana hackathons, offer free Founder tier

---

## Implementation Priority (Post-Hackathon)

### Week 1: Polish & Launch
```
[ ] Fix all bugs from hackathon
[ ] Add payment integration (Stripe)
[ ] Create landing page with pricing
[ ] Set up user authentication
```

### Week 2-3: Build Founder Mode MVP
```
[ ] Program indexing (core feature)
[ ] Basic founder dashboard
[ ] User segmentation
```

### Week 4: Go-to-Market
```
[ ] Launch on Twitter/Product Hunt
[ ] Direct outreach to 100 Solana founders
[ ] First 10 paying customers
```

### Month 2-3: Scale
```
[ ] Add requested features
[ ] Build API for enterprise
[ ] Expand marketing
[ ] Hire first team member if MRR > $5k
```

---

## Key Differentiators

1. **AI-First:** Via makes data accessible to non-technical users
2. **Solana-Native:** Deep integration with Solana ecosystem
3. **Dual Mode:** Serves both end users AND founders
4. **Real-Time:** Live indexing, not stale data
5. **Actionable:** Not just charts, but insights you can act on

---

## Notes
- This plan assumes hackathon MVP is solid
- Focus on revenue validation before feature bloat
- Founder Mode is the REAL business opportunity
- User Mode is the growth engine
