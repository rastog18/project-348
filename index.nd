# Index Documentation

This document describes the indexes defined on the **User** collection in MongoDB, the queries they support, where in the code those queries are used, and the DB-access methods that leverage them.

---

## DB-Access Methods

This project uses two distinct approaches for database operations, each accounting for at least 20% of the code:

1. **ORM (Mongoose)** (~20% of DB code)
   - **Usage**: CRUD operations (`createUser`, `getUsers`, `getUser`, `updateUser`, `deleteUser`) and simple lookups for validation in `generateReport` (`User.exists`, `User.findOne`).
   - **Files**: `controllers/user.controller.js` (all CRUD controllers).

2. **Prepared‑statement–like Aggregation** (~80% of DB code)
   - **Usage**: Dynamic `matchStage` built from request parameters, then passed into:
     - `User.aggregate([...])` for computing stats
     - `User.find(matchStage).lean()` for listing filtered users
   - **File**: `controllers/user.controller.js` in the `generateReport` function.

---

## 1. `_id` (Default) Index
- **Definition**: Every MongoDB document has a default unique index on `_id`.
- **Purpose**: Fast lookup by document _id.
- **Benefiting Queries**:
  - `User.findById(id).lean()`
    - **Used in**: `getUser`, `updateUser`, `deleteUser` in **`controllers/user.controller.js`**.

---

## 2. `puid` Unique Index
- **Definition**: `{ puid: 1 }` with `unique: true`.
- **Purpose**: Enforce uniqueness of PUID and speed up future PUID lookups.
- **Benefiting Queries**:
  - Duplicate-key enforcement on creation.
  - Potential future lookups by `puid`.
  - **Defined in**: **`models/user.model.js`**.

---

## 3. `dormName` Single-Field Index
- **Definition**: `{ dormName: 1 }`.
- **Purpose**: Speed up queries filtering by dorm name.
- **Benefiting Queries**:
  - `User.exists({ dormName })` & `User.findOne({ dormName }).select('dormCapacity')`
    - **Used in**: validation and capacity fetch in `generateReport`.
  - `User.aggregate([{ $match: matchStage }])` and `User.find(matchStage).lean()` when `matchStage.dormName` is set.
    - **Used in**: `generateReport` pipeline and user listing.

---

## 4. `dob` Single-Field Index
- **Definition**: `{ dob: 1 }`.
- **Purpose**: Speed up date-of-birth range queries.
- **Benefiting Queries**:
  - `$match: { dob: { $gte, $lte } }` in aggregation.
  - `User.find(matchStage).lean()` when `matchStage.dob` is set.

---

## 5. `collegeYear` Single-Field Index
- **Definition**: `{ collegeYear: 1 }`.
- **Purpose**: Speed up queries filtering by college year.
- **Benefiting Queries**:
  - `$match: { collegeYear }` in aggregation.
  - `User.find(matchStage).lean()` when `matchStage.collegeYear` is set.

---

## 6. Compound Index on `{ dormName, collegeYear }`
- **Definition**: `UserSchema.index({ dormName: 1, collegeYear: 1 })`.
- **Purpose**: Optimize queries filtering by both dorm and year.
- **Benefiting Queries**:
  - Aggregation and `find` in `generateReport` when filtering on both `dormName` and `collegeYear` together.

---

### Summary
By combining these indexes with two complementary DB-access methods (ORM for simple CRUD and validation, and prepared-statement–like aggregation for complex reporting), the application ensures efficient query performance and clear separation of concerns in data access.

