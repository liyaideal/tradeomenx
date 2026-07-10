## Add Position Vouchers entry to both desktop and mobile user menus

Add a new "Position Vouchers" item linking to `/vouchers` in the authenticated user menu that appears in the top-right corner (desktop) and from the mobile bottom-nav "Me" profile drawer (mobile).

### Desktop change
File: `src/components/EventsDesktopHeader.tsx`

Insert a new `DropdownMenuItem` in the "Account & activity" group (right after Referral, before the separator):

```tsx
<DropdownMenuItem onClick={() => navigate("/vouchers")}>
  <Ticket className="mr-2 h-4 w-4 text-primary" />
  Position Vouchers
</DropdownMenuItem>
```

Add `Ticket` to the existing `lucide-react` import.

### Mobile change
File: `src/components/BottomNav.tsx`

Insert a new `MobileDrawerListItem` in the profile drawer menu list, right after the Referral item:

```tsx
<MobileDrawerListItem
  icon={Ticket}
  label="Position Vouchers"
  onClick={() => {
    setProfileSheetOpen(false);
    navigate("/vouchers");
  }}
/>
```

Add `Ticket` to the existing `lucide-react` import.

### Notes
- Label uses Title Case per project convention ("Position Vouchers").
- Icon `Ticket` matches the icon already used on `/vouchers` (VoucherBanner) for consistency.
- Both entries are visible only to authenticated users.
