The user is confused because the API key creation flow calls the credential "secret", while the list calls it "key". Both refer to the same API credential (full value at creation vs. truncated prefix in the list). We will unify all user-facing copy to "API key".

### Plan

1. **Update creation flow labels (`src/components/api/CreateKeySteps.tsx`)**
   - Change Step 4 warning title from "Save this secret now." to "Save this API key now.".
   - Change label "Your API secret" to "Your API key".
   - Change button copy from "Copy secret" / "Copied to clipboard" to "Copy API key" / "Copied".
   - Keep the "it will never be shown again" warning intact.

2. **Update creation flow container (`src/components/api/CreateKeyFlow.tsx`)**
   - Change step 4 description from "Copy the secret now..." to "Copy your API key now...".
   - Update toast message from "Secret copied" to "API key copied".

3. **Update list/table labels (`src/components/api/KeysTable.tsx`)**
   - Change desktop header "Key" to "API key".
   - Change tooltip label "Key prefix" to "API key prefix".
   - Change button aria-label from "Copy key prefix" to "Copy API key prefix".
   - Keep mobile card header and button text unchanged (they already use "key" naturally).

4. **Verify consistency**
   - Search for remaining "secret" occurrences in `/settings/api` UI components.
   - Run TypeScript check and build.
   - Verify desktop and mobile screenshots in `/style-guide` if applicable.

### Scope
- Only presentation copy changes; no data model or security behavior changes.
- Does not alter the `key_prefix` truncation logic or the one-time-secret creation flow.