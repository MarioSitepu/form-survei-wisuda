# Data Flow Diagram (DFD) - Dynamic Form Application

## Context Diagram (Level 0)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    DYNAMIC FORM APPLICATION                     │
│                                                                 │
│  ┌──────────────┐                                              │
│  │              │                                              │
│  │    USER      │                                              │
│  │              │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 1. Request Form                                      │
│         │ 2. Form Configuration                                │
│         │ 3. Submit Form Data                                  │
│         │ 4. Response Confirmation                             │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              FRONTEND (React Application)                │  │
│  │                                                          │  │
│  │  • Home Page (Dynamic Form)                             │  │
│  │  • Admin Dashboard                                       │  │
│  │  • Form Editor                                           │  │
│  │  • Responses Management                                  │  │
│  │  • Analytics Dashboard                                   │  │
│  │                                                          │  │
│  └──────┬───────────────────────────────────────┬───────────┘  │
│         │                                       │              │
│         │ 5. API Requests                      │              │
│         │ 6. API Responses                     │              │
│         │                                       │              │
│         ▼                                       ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              BACKEND (Express API)                       │  │
│  │                                                          │  │
│  │  • Form Routes                                           │  │
│  │  • Response Routes                                       │  │
│  │  • Admin Routes                                          │  │
│  │  • Authentication Middleware                             │  │
│  │                                                          │  │
│  └──────┬───────────────────────────────────────┬───────────┘  │
│         │                                       │              │
│         │ 7. Read/Write Form Config            │              │
│         │ 8. Read/Write Responses              │              │
│         │                                       │              │
│         ▼                                       ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              MONGODB DATABASE                            │  │
│  │                                                          │  │
│  │  • FormConfigs Collection                                │  │
│  │  • Responses Collection                                  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐                                              │
│  │              │                                              │
│  │   ADMIN      │                                              │
│  │              │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│         │ 9. Login Request                                     │
│         │ 10. JWT Token                                        │
│         │ 11. Manage Forms                                     │
│         │ 12. View Responses                                   │
│         │ 13. View Analytics                                   │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │              ADMIN DASHBOARD                              │  │
│  │                                                          │  │
│  │  • Form Management                                       │  │
│  │  • Form Editor                                           │  │
│  │  • Responses Table                                       │  │
│  │  • Analytics Charts                                      │  │
│  │  • Users List                                            │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### External Entities:
- **USER**: Pengguna yang mengisi form
- **ADMIN**: Administrator yang mengelola form dan melihat responses

### Data Flows:
1. Request Form - User meminta form untuk diisi
2. Form Configuration - Sistem mengirim konfigurasi form ke user
3. Submit Form Data - User mengirim data form yang telah diisi
4. Response Confirmation - Sistem mengirim konfirmasi submission
5. API Requests - Frontend mengirim request ke backend
6. API Responses - Backend mengirim response ke frontend
7. Read/Write Form Config - Backend membaca/menulis konfigurasi form
8. Read/Write Responses - Backend membaca/menulis data responses
9. Login Request - Admin mengirim request login
10. JWT Token - Sistem mengirim token autentikasi
11. Manage Forms - Admin mengelola form (create, update, delete, archive)
12. View Responses - Admin melihat data responses
13. View Analytics - Admin melihat analitik data

---

## DFD Level 1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        DYNAMIC FORM APPLICATION                             │
│                                                                             │
│  ┌──────────────┐                                                          │
│  │              │                                                          │
│  │    USER      │                                                          │
│  │              │                                                          │
│  └──────┬───────┘                                                          │
│         │                                                                   │
│         │ D1: Form Request                                                 │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  1.0 LOAD PRIMARY FORM                                               │  │
│  │                                                                      │  │
│  │  Input:  D1 (Form Request)                                          │  │
│  │  Output: D2 (Form Configuration)                                    │  │
│  │  Process:                                                            │  │
│  │    - Request primary form from API                                  │  │
│  │    - Handle form initialization if needed                           │  │
│  │    - Display form to user                                           │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D2: Form Configuration                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  2.0 RENDER DYNAMIC FORM                                             │  │
│  │                                                                      │  │
│  │  Input:  D2 (Form Configuration)                                    │  │
│  │  Output: D3 (Rendered Form UI)                                      │  │
│  │  Process:                                                            │  │
│  │    - Parse form configuration                                        │  │
│  │    - Render fields based on type                                     │  │
│  │    - Apply validation rules                                          │  │
│  │    - Display form to user                                            │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D3: Rendered Form UI                                             │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  3.0 FILL FORM                                                       │  │
│  │                                                                      │  │
│  │  Input:  D3 (Rendered Form UI)                                      │  │
│  │  Output: D4 (Form Data)                                             │  │
│  │  Process:                                                            │  │
│  │    - User fills form fields                                          │  │
│  │    - Client-side validation                                          │  │
│  │    - Data cleaning and normalization                                 │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D4: Form Data                                                    │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  4.0 SUBMIT FORM                                                     │  │
│  │                                                                      │  │
│  │  Input:  D4 (Form Data)                                             │  │
│  │  Output: D5 (Submission Confirmation)                               │  │
│  │  Process:                                                            │  │
│  │    - Validate all required fields                                    │  │
│  │    - Clean data (extract option text, normalize)                     │  │
│  │    - Send to API                                                     │  │
│  │    - Show success message                                            │  │
│  │    - Redirect to success page                                        │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D5: Submission Confirmation                                      │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │              │                                                          │
│  │    USER      │                                                          │
│  │              │                                                          │
│  └──────────────┘                                                          │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  5.0 API CLIENT                                                      │  │
│  │                                                                      │  │
│  │  Input:  D4 (Form Data), D6 (Form Config Request), etc.            │  │
│  │  Output: D7 (API Response), D2 (Form Configuration)                 │  │
│  │  Process:                                                            │  │
│  │    - Format API requests                                             │  │
│  │    - Add authentication headers (JWT)                                │  │
│  │    - Handle errors                                                   │  │
│  │    - Parse responses                                                 │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────┬───────────────────────┘  │
│         │                                       │                          │
│         │ D8: HTTP Request                      │ D9: HTTP Response        │
│         │                                       │                          │
│         ▼                                       ▼                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  6.0 BACKEND API SERVER                                              │  │
│  │                                                                      │  │
│  │  Input:  D8 (HTTP Request)                                          │  │
│  │  Output: D9 (HTTP Response)                                         │  │
│  │  Process:                                                            │  │
│  │    - Route requests to appropriate handlers                          │  │
│  │    - Authenticate admin requests                                     │  │
│  │    - Validate input data                                             │  │
│  │    - Process business logic                                          │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────┬───────────────────────┘  │
│         │                                       │                          │
│         │ D10: Form Config Query                │ D11: Form Config Data    │
│         │ D12: Response Data                    │ D13: Response Query      │
│         │                                       │                          │
│         ▼                                       ▼                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  7.0 STORAGE SERVICE                                                 │  │
│  │                                                                      │  │
│  │  Input:  D10 (Form Config Query), D12 (Response Data)              │  │
│  │  Output: D11 (Form Config Data), D13 (Response Query)              │  │
│  │  Process:                                                            │  │
│  │    - CRUD operations for FormConfig                                  │  │
│  │    - CRUD operations for Response                                    │  │
│  │    - Primary form management                                         │  │
│  │    - Archive/unarchive forms                                         │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────┬───────────────────────┘  │
│         │                                       │                          │
│         │ D14: Database Query                   │ D15: Database Result     │
│         │                                       │                          │
│         ▼                                       ▼                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  8.0 MONGODB DATABASE                                                │  │
│  │                                                                      │  │
│  │  Collections:                                                         │  │
│  │    - FormConfigs (id, title, description, fields, isPrimary,        │  │
│  │                   isArchived, createdAt, updatedAt)                  │  │
│  │    - Responses (_id, formId, data, email, submittedAt)              │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┐                                                          │
│  │              │                                                          │
│  │   ADMIN      │                                                          │
│  │              │                                                          │
│  └──────┬───────┘                                                          │
│         │                                                                   │
│         │ D16: Login Credentials                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  9.0 ADMIN AUTHENTICATION                                            │  │
│  │                                                                      │  │
│  │  Input:  D16 (Login Credentials)                                    │  │
│  │  Output: D17 (JWT Token)                                            │  │
│  │  Process:                                                            │  │
│  │    - Verify password                                                 │  │
│  │    - Generate JWT token                                              │  │
│  │    - Store active session                                            │  │
│  │    - Return token to frontend                                        │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D17: JWT Token                                                   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  10.0 ADMIN DASHBOARD                                                │  │
│  │                                                                      │  │
│  │  Input:  D17 (JWT Token)                                            │  │
│  │  Output: D18 (Dashboard UI)                                         │  │
│  │  Process:                                                            │  │
│  │    - Verify session                                                  │  │
│  │    - Load all forms                                                  │  │
│  │    - Load all responses                                              │  │
│  │    - Display dashboard                                               │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D18: Dashboard UI                                                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  11.0 FORM MANAGEMENT                                                │  │
│  │                                                                      │  │
│  │  Input:  D19 (Form Management Actions)                              │  │
│  │  Output: D20 (Form Management Results)                              │  │
│  │  Process:                                                            │  │
│  │    - Create new form                                                 │  │
│  │    - Edit existing form                                              │  │
│  │    - Delete form                                                     │  │
│  │    - Set form as primary                                             │  │
│  │    - Archive/unarchive form                                          │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D19: Form Management Actions                                     │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  12.0 FORM EDITOR                                                    │  │
│  │                                                                      │  │
│  │  Input:  D21 (Form Edit Actions)                                    │  │
│  │  Output: D22 (Updated Form Config)                                  │  │
│  │  Process:                                                            │  │
│  │    - Edit form title and description                                 │  │
│  │    - Add/remove/edit fields                                          │  │
│  │    - Configure field properties                                      │  │
│  │    - Save form configuration                                         │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D21: Form Edit Actions                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  13.0 RESPONSES VIEWER                                               │  │
│  │                                                                      │  │
│  │  Input:  D23 (Response Query)                                       │  │
│  │  Output: D24 (Response Data Display)                                │  │
│  │  Process:                                                            │  │
│  │    - Load all responses                                              │  │
│  │    - Filter by form                                                  │  │
│  │    - Display in table format                                         │  │
│  │    - Export to CSV/Excel                                             │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D23: Response Query                                              │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  14.0 ANALYTICS GENERATOR                                            │  │
│  │                                                                      │  │
│  │  Input:  D25 (Analytics Query)                                      │  │
│  │  Output: D26 (Analytics Charts)                                     │  │
│  │  Process:                                                            │  │
│  │    - Aggregate response data                                         │  │
│  │    - Generate statistics                                             │  │
│  │    - Create charts (bar, pie, line)                                 │  │
│  │    - Display analytics dashboard                                     │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D25: Analytics Query                                             │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │  15.0 USERS LIST                                                     │  │
│  │                                                                      │  │
│  │  Input:  D27 (User Query)                                           │  │
│  │  Output: D28 (Users List)                                           │  │
│  │  Process:                                                            │  │
│  │    - Extract unique emails from responses                            │  │
│  │    - Display users list                                              │  │
│  │                                                                      │  │
│  └──────┬───────────────────────────────────────────────────────────────┘  │
│         │                                                                   │
│         │ D28: Users List                                                  │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────┐                                                          │
│  │              │                                                          │
│  │   ADMIN      │                                                          │
│  │              │                                                          │
│  └──────────────┘                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Process Descriptions:

**1.0 LOAD PRIMARY FORM**
- Menerima request form dari user
- Memanggil API untuk mendapatkan primary form
- Jika tidak ada, initialize default form
- Mengembalikan form configuration

**2.0 RENDER DYNAMIC FORM**
- Menerima form configuration
- Parse fields berdasarkan type (text, email, number, textarea, select, checkbox, radio)
- Render UI components sesuai type
- Apply validation rules

**3.0 FILL FORM**
- User mengisi form fields
- Client-side validation real-time
- Data cleaning dan normalization

**4.0 SUBMIT FORM**
- Validate semua required fields
- Clean data (extract option text, normalize values)
- Send data ke API
- Show success message dan redirect

**5.0 API CLIENT**
- Format HTTP requests
- Add JWT token untuk admin requests
- Handle errors dan retries
- Parse JSON responses

**6.0 BACKEND API SERVER**
- Route requests ke appropriate handlers
- Authenticate admin requests dengan JWT middleware
- Validate input data
- Process business logic

**7.0 STORAGE SERVICE**
- CRUD operations untuk FormConfig
- CRUD operations untuk Response
- Primary form management (ensure only one primary)
- Archive/unarchive forms

**8.0 MONGODB DATABASE**
- Store FormConfigs collection
- Store Responses collection
- Indexes untuk performance

**9.0 ADMIN AUTHENTICATION**
- Verify password
- Generate JWT token
- Store active sessions
- Return token

**10.0 ADMIN DASHBOARD**
- Verify session
- Load all forms dan responses
- Display dashboard dengan tabs

**11.0 FORM MANAGEMENT**
- Create, edit, delete forms
- Set primary form
- Archive/unarchive forms

**12.0 FORM EDITOR**
- Edit form metadata (title, description)
- Add/remove/edit fields
- Configure field properties
- Save configuration

**13.0 RESPONSES VIEWER**
- Load all responses
- Filter by form
- Display in table
- Export to CSV

**14.0 ANALYTICS GENERATOR**
- Aggregate response data
- Generate statistics (avg, min, max)
- Create charts (bar, pie, line)
- Display analytics

**15.0 USERS LIST**
- Extract unique emails from responses
- Display users list

### Data Stores:

**D1-D28**: Data flows antara processes

### External Entities:
- **USER**: Pengguna yang mengisi form
- **ADMIN**: Administrator yang mengelola sistem

---

## Data Dictionary

### Form Configuration
- **id**: String (unique identifier)
- **title**: String (form title)
- **description**: String (form description)
- **fields**: Array of FormField
- **isPrimary**: Boolean (primary form flag)
- **isArchived**: Boolean (archived flag)
- **createdAt**: Number (timestamp)
- **updatedAt**: Number (timestamp)

### Form Field
- **id**: String (field identifier)
- **name**: String (field name)
- **label**: String (field label)
- **type**: Enum (text, email, number, textarea, select, checkbox, radio)
- **required**: Boolean
- **placeholder**: String (optional)
- **options**: Array of String (for select/radio/checkbox)

### Form Response
- **id**: String (response identifier)
- **formId**: String (form identifier)
- **data**: Object (form data)
- **email**: String (user email, optional)
- **submittedAt**: Number (timestamp)

### JWT Token
- **token**: String (JWT token)
- **expiresIn**: String (expiration time)
- **admin**: Boolean (admin flag)

---

## Notes

1. **Authentication Flow**: Admin login menggunakan JWT token yang disimpan di localStorage
2. **Primary Form**: Hanya satu form yang bisa menjadi primary pada satu waktu
3. **Archive System**: Form yang di-archive tidak bisa diisi oleh user
4. **Data Cleaning**: Data dari checkbox/radio di-clean untuk extract option text
5. **Session Management**: Active sessions disimpan di memory (backend) dan localStorage (frontend)

