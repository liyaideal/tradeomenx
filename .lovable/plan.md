

## Settings Page Card Consistency & Platform Logos

### Problem
1. **Card title icon inconsistency**: The "Connected Accounts" card has a `Link2` icon in its title, while Username, Email Address, and Linked Account cards have no title icons. The majority pattern (no icons) should be the standard.
2. **Platform logos**: Polymarket and Kalshi use emoji placeholders (`🔮` and `📊`) instead of real brand logos.

### Plan

#### 1. Standardize Settings Card Titles — Remove Icon from Connected Accounts
Remove the `Link2` icon from the Connected Accounts card title in `ConnectedAccountsCard.tsx` to match the other cards (Username, Email, Linked Account) which use plain text titles without icons.

**File**: `src/components/settings/ConnectedAccountsCard.tsx`
- Remove `Link2` from the import and from the `<h3>` element
- Title becomes plain `Connected Accounts` text, consistent with other cards

#### 2. Add Real Platform Logos
Download official Polymarket and Kalshi logos as SVGs and place them in `public/chain-logos/` (or `public/platform-logos/`). Update the `PLATFORMS` array in `ConnectedAccountsCard.tsx` to use `<img>` tags with real logos instead of emoji.

**Files**:
- Create `public/platform-logos/polymarket.svg` and `public/platform-logos/kalshi.svg`
- Update `PLATFORMS` in `ConnectedAccountsCard.tsx`: replace `icon: "🔮"` / `icon: "📊"` with logo image paths

#### 3. Add Settings Card Spec to Style Guide
Add a "Settings Card" subsection to `CommonUISection.tsx` documenting the standard pattern:
- Uses `trading-card` class with `p-4 md:p-6`
- Title: `<h3 className="font-semibold mb-1">` — plain text, no icon
- Subtitle: `<p className="text-xs text-muted-foreground">`
- Action button aligned top-right via `flex items-start justify-between`

