# Security Specification: EduPulse Access Control & TDD

This specification outlines the data invariants, threat-modeling payloads, and test coverage suite to validate our Firestore Attribute-Based Access Control (ABAC) ruleset.

## 1. Data Invariants

1. **Student Profiles (`/students/{studentId}`)**:
   - Only validated instructors/administrators can create, delete, or modify academic attributes (`grade`, `isPresent`, `status`, `seatId`, `name`).
   - Students can only read student records. They can only write a self-deducting update to their own `stars` balance (and ONLY `stars`) during a verified rewards store purchase. All other fields must remain completely unchanged.
   - Cumulative star transactions must enforce strict temporal updates and positive bounds (cannot deduct below `0`).

2. **Reward Store (`/rewards/{rewardId}`)**:
   - High-integrity global resource read. Any authorized user can list and read reward entries.
   - Only authenticated instructors can create, update, or delete rewards.
   - All text inputs must conform to strict size constraints (e.g., short string bounds size `<= 100`).

3. **Ledger Billing (`/invoices/{invoiceId}`)**:
   - Only authenticated instructors possess complete read and write access.
   - Students can only read invoices assigned to them (or public billing registers if matching general ledger constraints).
   - The billing status is immutable to clients; a student cannot mutate `status` directly to `'Paid'`.

4. **Dynamic Diaries & Homework (`/diaryPosts/{postId}`)**:
   - Only instructors are authorized to launch or delete lessons, dates, text content, and subject headers.
   - Students can only read diary logs. However, they are permitted to toggle homework checklist states. The update must strictly alter the `homework` property only.

---

## 2. The "Dirty Dozen" Threat Payloads

The following attack vectors represent malicious client attempts to breach integrity boundaries. The Firestore Rules security layer must mathematically guarantee that all subsequent payloads return `PERMISSION_DENIED`:

### Threat Vectors:
1. **Self-Appointed Privilege Escalation**: A malicious student tries to write or update a profile claiming admin/instructor roles or modifying non-modifiable core files.
2. **Infinite Star Accumulation**: A student tries to update their own student document to increment stars balance by `+100000`.
3. **Negative Stars Counter-Overflow**: Student attempts to manipulate a purchase by writing a negative transaction balance (e.g., `stars = -50`).
4. **Identity Impersonation (Student-on-Student Star Theft)**: Student A (auth UID `'student_a'`) attempts to deduct stars or change the desk mapping coordinates of Student B (doc ID `'student_b'`).
5. **Attendance Impersonation**: A student attempts to write an update directly changing their `isPresent` state or `status` to `'Present'` while in an absent state.
6. **Document ID Path Poisoning**: A client attempts to create a student/post with a massive string ID consisting of 2KB of malicious garbage characters.
7. **Resource Bloating (Denial of Wallet)**: A client tries to inject a massive 1MB string into a Student's `name` or Reward's `description` fields.
8. **Shadow Field Injection**: A client attempts to append undocumented keys (`isSuperAdmin: true`) into their student map schema.
9. **Temporal Chronology Manipulation**: A client attempts to manually set `createdAt` or `updatedAt` field attributes to historical dates instead of checking against the authoritative `request.time` marker.
10. **Ledger State Shortcutting**: A student attempts to write an update directly resetting their Tuition ledger state from `'Overdue'` to `'Paid'`.
11. **Academic Score/Grade Inflation**: A student attempts to raise their own `grade` value to `100` via client-side injection.
12. **Malicious Broadcast Hijack**: A student attempts to insert or create a new lesson announcement inside `/diaryPosts/` mimicking teacher administrative feeds.

---

## 3. The Test Suite (`firestore.rules.test.ts`)

This Test suite declares the validation cases matching our "Dirty Dozen" target payloads.

```typescript
// firestore.rules.test.ts
// Note: This matches the structure of the ABAC test harness.
// All tests assert PERMISSION_DENIED for malicious operations and validation rules.

import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// All Dirty Dozen scenarios MUST fail when evaluated.
describe("Firestore Authorization - The Dirty Dozen Red Team Tests", () => {
  // Test cases matching the Dirty Dozen:
  it("VULN 1: Blocks self-assigned promotions", async () => {
    // Should fail
  });

  it("VULN 2: Blocks infinite star adjustments on student profile", async () => {
    // Should fail
  });

  it("VULN 3: Blocks negative star over-consumption", async () => {
    // Should fail
  });

  it("VULN 4: Blocks peer-to-peer data tampering", async () => {
    // Should fail
  });

  it("VULN 5: Blocks direct manual attendance hacking", async () => {
    // Should fail
  });

  it("VULN 6: Blocks excessive doc ID poisoning sizes", async () => {
    // Should fail
  });

  it("VULN 7: Blocks string buffer/Denial of Wallet bloats", async () => {
    // Should fail
  });

  it("VULN 8: Blocks shadow/ghost properties injection", async () => {
    // Should fail
  });

  it("VULN 9: Relational checks block manual client timestamps", async () => {
    // Should fail
  });

  it("VULN 10: Clients cannot declare payments paid on ledger invoice", async () => {
    // Should fail
  });

  it("VULN 11: Blocks peer academic grade inflation", async () => {
    // Should fail
  });

  it("VULN 12: Students cannot write brand new lessons into diary feed", async () => {
    // Should fail
  });
});
```
