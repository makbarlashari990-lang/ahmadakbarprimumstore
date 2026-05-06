# Security Specification for Ahmad Akbar Premium Store

## 1. Data Invariants
- Products can only be created/updated by admins.
- Reviews can only be created by signed-in users and they must own the review (userId matches auth.uid).
- Orders can only be created by signed-in users.
- Users can only read their own orders.
- Admins can read all orders and products.

## 2. The Dirty Dozen Payloads (Rejection Tests)
1. Creating a product as a non-admin user.
2. Updating a product's price as a non-admin.
3. Injecting a 2MB string into a product name.
4. Creating a review with a spoofed `userId` (not matching requester).
5. Updating another user's review.
6. Deleting a product as a non-admin.
7. Creating an order as an anonymous user (if not allowed).
8. Reading another user's order details.
9. Injecting a "ghost field" `isAdmin: true` into a user profile (if one existed).
10. Setting a product `stock` to a negative number.
11. Bypassing the `isValidId` check by using special characters in IDs.
12. Updating an order status to 'Delivered' as a regular user.

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these constraints using the Firebase Rules Emulator. (Implementation omitted for brevity but logic follows these assertions).
