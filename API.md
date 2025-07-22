# API Documentation

This document describes all API endpoints in the project under `/src/app/api`.

---

## Catalog APIs

### 1. Get All Root Categories
- **Path:** `/api/catalog/categories`
- **Method:** GET
- **Params:** None
- **Description:** Returns all root categories (where `parent_id` is null).
- **Response:** Array of categories (id, name, code, photo)

---

### 2. Get Category by ID
- **Path:** `/api/catalog/[categoryId]`
- **Method:** GET
- **Params:**
  - `categoryId` (path param, integer): Category ID
- **Description:** Returns a single category by its ID.
- **Response:** `{ success: true, data: { id, name, code, photo } }` or error

---

### 3. Get Child Categories by Parent ID
- **Path:** `/api/catalog/[categoryId]/categories`
- **Method:** GET
- **Params:**
  - `categoryId` (path param, integer): Parent category ID
- **Description:** Returns all categories where `parent_id = categoryId`.
- **Response:** `{ success: true, data: [ ...categories ] }` or error

---

### 4. Get Services by Category (and its Children)
- **Path:** `/api/catalog/[categoryId]/services`
- **Method:** GET
- **Params:**
  - `categoryId` (path param, integer): Category ID
- **Description:** Returns all services for the given category and its direct children.
- **Response:** `{ success: true, data: [ ...services ], meta: { categoryId, childCategoryCount, totalCategoriesSearched } }` or error

---

### 5. Get Services by Multiple Category IDs
- **Path:** `/api/catalog/services?categoryIds=1,2,3`
- **Method:** GET
- **Query Params:**
  - `categoryIds` (comma-separated integers): List of category IDs
- **Description:** Returns all services for the given list of category IDs.
- **Response:** `{ success: true, data: [ ...services ] }` or error

---

### 6. Get Services by Single Category ID
- **Path:** `/api/catalog/services?tcategories_id=1`
- **Method:** GET
- **Query Params:**
  - `tcategories_id` (integer): Category ID
- **Description:** Returns all services for the given category ID.
- **Response:** `{ success: true, data: [ ...services ] }` or error

---

## Service APIs

### 7. Get Service by ID
- **Path:** `/api/services/[serviceId]`
- **Method:** GET
- **Params:**
  - `serviceId` (path param, integer): Service ID
- **Description:** Returns a single service by its ID.
- **Response:** `{ success: true, data: { ...service fields } }` or error

--- 