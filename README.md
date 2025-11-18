# B2B Funnel Tracking SaaS

**The missing analytics layer between anonymous website visitors and closed deals.**

## 🎯 Mission

Most B2B companies are flying blind. They know their website traffic numbers, they know their closed deals, but the journey in between is a black box. **We illuminate that journey.**

Our platform helps B2B sales and marketing teams understand exactly how prospects engage with their brand across every touchpoint—from the first anonymous website visit to the final deal signature. No more guessing. No more lost context. Just clear, actionable intelligence about every prospect in your pipeline.

## 💡 The Problem We Solve

**Marketing's Challenge:** "We drive traffic and generate leads, but sales says they're not qualified. What are these prospects actually doing?"

**Sales' Challenge:** "A lead books a call, but I have no context. What pages did they visit? What content resonated? How engaged are they really?"

**The Revenue Gap:** Without visibility into the full prospect journey, companies waste money on ineffective campaigns and sales reps waste time on cold outreach. **Revenue teams operate on hunches instead of data.**

We fix this by tracking the *complete* customer journey—from anonymous browsing through email engagement to call bookings—and presenting it in a timeline that actually makes sense to sales and marketing teams.

## 🚀 Core Goals

### 1. **Identity Stitching That Actually Works**
Unlike traditional analytics that lose the thread when prospects switch devices or clear cookies, we maintain identity continuity through:
- First-party cookies for anonymous tracking
- Smart session merging when prospects identify themselves
- Email link tracking that works across devices
- Calendar booking integration (Calendly, etc.)

### 2. **Actionable Intelligence for Revenue Teams**
We don't just collect data—we present insights that drive action:
- **For Sales:** "This lead visited your pricing page 3 times, downloaded 2 whitepapers, and spent 15 minutes on case studies. They're ready."
- **For Marketing:** "Prospects from LinkedIn spend 2x more time on product pages than Google traffic. Shift budget accordingly."
- **For RevOps:** "Our best customers engage with these 3 pages before booking. Optimize for this path."

### 3. **Privacy-First, Compliance-Ready**
Built for the post-cookie era:
- No fingerprinting or shady tracking tactics
- First-party cookies only
- GDPR/CCPA compliant by design
- Explicit identity reveal (no guessing)
- Perfect for enterprise buyers who care about privacy

## 💰 Profitability & Business Model

### Revenue Streams

**1. SaaS Subscription (Primary)**
- **Starter**: $99/mo - Up to 10K tracked sessions, 500 identified leads
- **Growth**: $299/mo - Up to 50K sessions, 2,500 leads, multi-workspace
- **Enterprise**: $999/mo - Unlimited tracking, custom integrations, white-label

**Target Market:**
- B2B SaaS companies ($50K+ ACV)
- Agencies managing multiple client funnels
- Enterprise sales teams with long sales cycles
- High-ticket B2B service providers

**Unit Economics:**
- CAC: $500 (content + PLG motion)
- LTV: $4,500 (avg 15-month retention)
- LTV:CAC = 9:1
- Gross margin: 85%+ (infrastructure costs minimal with serverless)

**2. Add-On Revenue**
- Custom integrations: $500-2,000 one-time
- White-label deployment: $5,000-15,000/year
- Premium support: $500/mo
- Data exports & API access: Included in Growth+

### Path to Profitability

**Phase 1 (Months 1-6): MVP + First 50 Customers**
- Focus: Product-market fit with SMB B2B SaaS
- Revenue: $15,000 MRR (50 customers @ $299 avg)
- Costs: $8,000/mo (infra + founder salary subsistence)
- **Break-even by Month 6**

**Phase 2 (Months 7-18): Scale to $100K MRR**
- Focus: Upmarket to Enterprise, add integrations
- Revenue: $100,000 MRR (250 customers @ $400 avg)
- Costs: $45,000/mo (2 engineers, sales, infra)
- **Profitable at Month 12**

**Phase 3 (Year 2+): Scale to $1M ARR**
- Focus: Multi-product (add sales engagement tools)
- Revenue: $1M ARR (600 customers @ $1,400 avg)
- Costs: $500K/yr (10-person team)
- **50% profit margins**

### Why This Works

**Low Infrastructure Costs:**
- Serverless architecture (Vercel + Supabase + Redis)
- Costs scale linearly with usage
- No DevOps overhead

**High Switching Costs:**
- Once installed, becomes system of record for prospect data
- Sales teams build workflows around timeline data
- Historical data creates lock-in

**Viral PLG Motion:**
- Sales reps share prospect timelines → Marketing sees value
- Marketing shares campaign insights → RevOps adopts
- One user becomes team-wide adoption

## 📈 Future Scalability

### Technical Scalability

**Current Architecture:**
- Next.js 14 (Vercel serverless)
- PostgreSQL (Supabase - scales to millions of rows)
- Redis (Upstash - auto-scaling)
- Edge CDN for tracking script delivery

**Scaling to 100K+ Customers:**
1. **Tracking Script CDN**: Already on Vercel Edge
2. **Event Ingestion**: Horizontally scalable serverless functions
3. **Database**: Supabase auto-scales; partition by workspace_id
4. **Redis**: Upstash auto-scales to 100K+ RPS
5. **Query Performance**: Pre-aggregate daily rollups, partition by date

**Performance Targets:**
- Tracking script load: <20ms (CDN cached)
- Event ingestion: <100ms p99
- Dashboard load: <500ms p99
- Support: 10M events/day without architecture changes

### Product Scalability

**Expansion Vector 1: Integration Ecosystem**
- HubSpot, Salesforce, Pipedrive sync
- Slack notifications for hot leads
- Zapier/Make.com for workflow automation
- **Strategy:** Become the data layer that connects marketing and sales tools

**Expansion Vector 2: Multi-Product**
- **Product 2:** Sales engagement (email sequences, call logging)
  - Upsell existing customers, share same data layer
  - Justify $500/mo price point

- **Product 3:** Revenue attribution
  - Multi-touch attribution across channels
  - Justify $1,000/mo for enterprise

- **Product 4:** Predictive lead scoring
  - ML models on engagement data
  - Premium tier: $1,500/mo

**Expansion Vector 3: Vertical Solutions**
- Pre-built templates for specific industries:
  - SaaS (product-led growth tracking)
  - Agencies (client campaign tracking)
  - High-ticket services (consultation funnel tracking)
- **Strategy:** 10x faster setup = higher conversion

### Market Scalability

**Total Addressable Market (TAM):**
- 50,000+ B2B SaaS companies globally
- 100,000+ B2B service businesses ($1M+ revenue)
- 25,000+ marketing agencies
- **TAM: $7.5B** (175K companies × $43K ACV)

**Go-to-Market Expansion:**
1. **Year 1:** PLG for SMB SaaS (fastest buyers)
2. **Year 2:** Enterprise sales motion (higher ACV)
3. **Year 3:** Agency partnerships (distribution channel)
4. **Year 4:** International expansion (EU, APAC)

**Competitive Moat:**
- **Data network effects:** More events = better insights
- **Integration depth:** Become system of record
- **Privacy positioning:** First-party only = enterprise-safe
- **Identity stitching IP:** Core algorithm is proprietary

## 🏗️ Built With Modern Stack

- **Frontend:** Next.js 14, React 18, TailwindCSS, Framer Motion
- **Backend:** Next.js API Routes, TypeScript
- **Database:** PostgreSQL (Supabase), Redis (Upstash)
- **Deployment:** Vercel Edge Network
- **Tracking:** Custom lightweight JavaScript (~8KB)

## 🚦 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see:
- **Dashboard:** Lead activity timeline with full journey visualization
- **Demo Marketplace:** Fully functional e-commerce site with integrated tracking
- **Analytics:** Real-time event capture and session tracking

## 📊 Key Metrics We Track

1. **Engagement Depth:** Pages viewed, time on site, content downloaded
2. **Intent Signals:** Pricing page views, demo requests, competitor comparisons
3. **Multi-Session Behavior:** Return visits, cross-device engagement
4. **Email Engagement:** Link clicks, campaign attribution
5. **Conversion Triggers:** What actions precede call bookings

## 🎯 Who This Is For

**Perfect for:**
- B2B SaaS companies with $50K+ ACV
- Sales teams with 30+ day sales cycles
- Marketing teams running multi-touch campaigns
- Revenue operations teams optimizing conversion funnels

**Not for:**
- B2C e-commerce (too high volume, different use case)
- Companies selling low-ticket products (<$1K)
- Organizations that don't have a defined sales process

## 🔐 Privacy & Compliance

- ✅ No device fingerprinting
- ✅ First-party cookies only
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ Respects Do Not Track
- ✅ Explicit identity reveal model
- ✅ Data retention controls

## 🌟 Why We'll Win

**1. We Solve a Real Problem**
Revenue teams are desperate for better visibility. We've talked to 50+ companies—this pain is universal.

**2. Timing is Perfect**
Third-party cookies dying + privacy regulations = need for first-party tracking solution.

**3. Better Product**
Existing tools (Mixpanel, Amplitude) are built for product analytics, not B2B sales. HubSpot/Salesforce don't track anonymous visitors. We're purpose-built for this exact use case.

**4. Defensible Moat**
Identity stitching algorithm + integration depth + data network effects = hard to replicate.

**5. Massive Market**
Every B2B company with a sales team needs this. That's a $7.5B+ market.

---

**Ready to understand your prospects like never before?**

This is not just another analytics tool. This is the revenue intelligence platform that modern B2B teams have been waiting for.

Let's build it. 🚀
