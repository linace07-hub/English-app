# Security Specification for Linguae

## Data Invariants
1. A user can only access their own profile.
2. A user can only access their own lesson progress.
3. XP and streak should be non-negative.
4. Energy has a max limit (e.g. 5).

## The Dirty Dozen Payloads
1. Unauthorized profile read (User A tries to read User B's profile).
2. Unauthorized profile update (User A tries to update User B's XP).
3. Privilege escalation (User A tries to set themselves as an admin - though not implemented yet).
4. Invalid energy value (User sets energy to 999).
5. Invalid XP value (User sets XP to -100).
6. Unauthorized lesson progress write (User A writes a completed lesson to User B's collection).
7. ID Poisoning (Long junk string as userId).
8. Ghost field injection (Adding `isAdmin: true` to a profile).
9. Missing required field (Creating a profile without `xp`).
10. Immutable field update (Trying to change `uid` once set).
11. Future timestamp (Trying to set `lastEnergyUpdate` to the future - though hard to check exactly with request.time, I'll use equality if possible).
12. Bulk deletion (Trying to delete the entire users collection).

## Test Runner (Draft)
A `firestore.rules.test.ts` would be needed, but I'll focus on the rules first as per instructions "UNTIL NO VULNERABILITIES ARE FOUND, TREAT THE FIRESTORE RULES AS INCOMPLETE AND INSECURE, AND WRITE THEM TO A FILE NAMED DRAFT_firestore.rules".
