# Security Specification — Craftsquarre Reference Video Hub

## 1. Data Invariants
1. **Admin-Only Writes**: Only the verified owner (`craftsquarrebrands@gmail.com` with `email_verified == true`) or an admin listed in `/admins/{uid}` may create, update, or delete `/decks/{deckId}`, `/decks/{deckId}/videos/{videoId}`, or `/decks/{deckId}/checklist/{itemId}`.
2. **Public Crew Read Access (No PII)**: Crew members with the production app URL can read (`get`, `list`) only documents explicitly marked `isPublic == true` under `/decks/{deckId}`, `/decks/{deckId}/videos/{videoId}`, and `/decks/{deckId}/checklist/{itemId}`. Zero PII (`email`, `phone`, `address`) is stored in these collections.
3. **Parent Integrity (Master Gate)**: A video or checklist item under `/decks/{deckId}` cannot be created unless the parent `/decks/{deckId}` exists (or is created atomically in the same batch via `existsAfter`) and `incoming().deckId == deckId`.
4. **Strict Schema & Size Guards**: Every string field has an explicit `.size()` bound, `tabNames` is bounded to `<= 50` entries, and `keys().hasAll(...) && keys().hasOnly(...)` rejects all unknown/shadow fields.
5. **Immutable Ownership & Timestamps**: `ownerId`, `deckId`, and `createdAt` cannot be modified after creation. `createdAt == request.time` on create; `updatedAt == request.time` on create and update.
6. **Admin Collection Lockdown**: Clients cannot write to `/admins/{userId}` (prevents self-assigned admin escalation).

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated Deck Create**: Anonymous client attempts to create `/decks/main`.
2. **Non-Admin Video Create**: Signed-in non-admin user attempts to create `/decks/main/videos/vid-1`.
3. **Unverified Email Admin Spoof**: Attacker signs in with `email == 'craftsquarrebrands@gmail.com'` and `email_verified == false`.
4. **Shadow Field Injection**: Admin creates a video with an extra ghost key `isSuperAdmin: true`.
5. **Owner Spoofing**: Admin creates `/decks/main` with `ownerId: 'different-uid'`.
6. **ID Poisoning**: Admin attempts to write `/decks/main/videos/bad$id!with/slashes` or a 200-char ID.
7. **Orphaned Subcollection Write**: Admin creates `/decks/nonexistent/videos/vid-1` without parent `/decks/nonexistent`.
8. **Cross-Deck Mismatch**: Admin creates `/decks/main/videos/vid-1` with `deckId: 'other-deck'`.
9. **Timestamp Forgery**: Admin creates `/decks/main` with a client-forged `createdAt` != `request.time`.
10. **Immutable Field Tampering**: Admin updates `/decks/main/videos/vid-1` trying to alter `createdAt` or `ownerId`.
11. **Value Poisoning / Size Exhaustion**: Admin updates `note` with a 5,000-character string (exceeding `maxLength: 2000`) or invalid `status: 'hacked'`.
12. **Self-Assigned Admin Escalation**: Non-admin attempts to create `/admins/{theirUid}` with `{ role: 'admin' }`.
