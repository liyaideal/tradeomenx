

## Analysis

You raise a great point. The current "Connected Wallets" module has several issues:

1. **Confusion with wallet-based login** - Users who logged in via wallet authorization may think this is the same thing
2. **Central exchange wallets can't "connect"** - Users depositing from Binance/OKX etc. can't use MetaMask/Rainbow connect flow
3. **The real need is an address book** - Users want to save frequently-used addresses for deposit/withdraw convenience

## Proposed Change: "Connected Wallets" → "Saved Addresses" (Address Book)

### What changes

**Concept shift**: From "connecting a Web3 wallet" to "saving withdrawal/deposit addresses with labels"

**Data model** - Update the existing `wallets` table or repurpose it:
- Keep: `address`, `full_address`, `network`, `is_primary`
- Add: `label` (user-defined nickname, e.g. "My Binance", "Cold Wallet", "Friend's wallet")
- Remove/deprecate: `wallet_type`, `icon` (no longer relevant since we're not "connecting" wallets)
- The `icon` field can be auto-derived from network type instead

**UI changes across 3 locations:**

### 1. Wallet Page (both mobile & desktop)
- **Title**: "Connected Wallets" → "Saved Addresses"
- **Empty state**: "Connect a wallet to deposit and withdraw funds" → "Save addresses for quick deposits and withdrawals"
- **Add button**: "+ Connect New Wallet" → "+ Add Address"
- **Add flow**: Replace the MetaMask/Rainbow/WalletConnect selection dialog with a simple form:
  - `Label` (text input, e.g. "My Binance Hot Wallet")
  - `Address` (text input, paste full address)
  - `Network` (select: Ethereum / Tron / etc.)
- **Card display**: Show label as primary name, address below, network tag
- **Actions**: "Disconnect" → "Delete", keep "Set Primary" and "Copy"

### 2. Settings Page
- Update `WalletsCard` title from "Connected Wallets" to "Saved Addresses"
- Update description text accordingly

### 3. Withdraw Address Select
- `WithdrawAddressSelect` and `WithdrawAddressSelectDialog` already pull from `useWallets()` - they will automatically show saved addresses with labels instead of wallet types

### 4. Database Migration
- Add `label` column (text, nullable, default null) to `wallets` table
- Existing data continues to work; `wallet_type` can serve as a fallback label

### Technical Details

**Files to modify:**
- `supabase migration`: Add `label` column to `wallets` table
- `src/hooks/useWallets.ts`: Add `label` to Wallet interface, update `addWallet` to accept label, transform accordingly
- `src/pages/Wallet.tsx`: Replace Connected Wallets section (both mobile `WalletList` component and desktop card) with Saved Addresses UI; replace wallet connection dialog with "Add Address" form
- `src/pages/Settings.tsx`: Update `WalletsCard` title/text
- `src/components/withdraw/WithdrawAddressSelect.tsx`: Show `label` as primary text instead of `walletType`
- `src/components/withdraw/WithdrawAddressSelectDialog.tsx`: Same label update

**What gets removed:**
- MetaMask/Rainbow/WalletConnect connection flow (the multi-step dialog with simulated connecting animation)
- `walletStep` state machine (`select` → `connecting` → `success`)

**What stays:**
- Primary address concept (default address for withdrawals)
- Copy address functionality
- Delete address with confirmation
- The `wallets` database table (repurposed)

