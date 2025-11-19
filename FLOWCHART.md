# Flowchart Alur Pembuatan Dynamic Form Application

## 1. Flowchart Proses Pengembangan

```mermaid
flowchart TD
    Start([Mulai Proyek]) --> Setup[Setup Proyek]
    
    Setup --> SetupFE[Setup Frontend<br/>React + TypeScript + Vite]
    Setup --> SetupBE[Setup Backend<br/>Node.js + Express]
    
    SetupFE --> InstallFE[Install Dependencies<br/>React Router, TailwindCSS,<br/>Shadcn UI Components]
    SetupBE --> InstallBE[Install Dependencies<br/>Express, Mongoose,<br/>CORS, dotenv, JWT]
    
    InstallFE --> ConfigFE[Konfigurasi Frontend<br/>- Routing App.tsx<br/>- Theme Provider Component<br/>- API Service Setup]
    InstallBE --> ConfigBE[Konfigurasi Backend<br/>- Database Connection<br/>- Environment Variables<br/>- Server Setup]
    
    ConfigBE --> DBSetup[Setup Database<br/>MongoDB Connection<br/>config/database.js]
    
    DBSetup --> ModelForm[Create FormConfig Model<br/>models/FormConfig.model.js<br/>- id, title, description<br/>- fields array<br/>- isPrimary, isArchived<br/>- createdAt, updatedAt]
    DBSetup --> ModelResponse[Create Response Model<br/>models/Response.model.js<br/>- formId, data, email<br/>- submittedAt]
    
    ModelForm --> BackendAPI[Develop Backend API]
    ModelResponse --> BackendAPI
    
    BackendAPI --> StorageService[Create Storage Service<br/>services/storage.service.js<br/>- CRUD Operations<br/>- Primary Form Logic<br/>- Form Management Functions]
    
    StorageService --> Controllers[Create Controllers<br/>controllers/form.controller.js<br/>controllers/response.controller.js<br/>controllers/admin.controller.js<br/>- Use Storage Service<br/>- Handle Business Logic]
    
    Controllers --> Middleware[Create Middleware<br/>middleware/auth.middleware.js<br/>- JWT Authentication<br/>- Session Management<br/>- Token Verification]
    
    Middleware --> APIForm[Form API Routes<br/>routes/form.routes.js<br/>GET /api/form/primary<br/>GET /api/form/all<br/>POST /api/form/new<br/>PUT /api/form/:id<br/>DELETE /api/form/:id]
    Middleware --> APIResponse[Response API Routes<br/>routes/response.routes.js<br/>GET /api/responses<br/>POST /api/responses<br/>DELETE /api/responses/:id]
    Middleware --> APIAdmin[Admin API Routes<br/>routes/admin.routes.js<br/>POST /api/admin/login<br/>POST /api/admin/logout<br/>GET /api/admin/verify]
    
    Controllers --> APIForm
    Controllers --> APIResponse
    Controllers --> APIAdmin
    
    APIForm --> ServerSetup[Setup Express Server<br/>server.js<br/>- Connect Routes<br/>- Configure CORS<br/>- JSON Parser<br/>- Error Handling<br/>- Health Check Endpoint]
    APIResponse --> ServerSetup
    APIAdmin --> ServerSetup
    
    ConfigFE --> FrontendPages[Develop Frontend Pages<br/>pages/Home.tsx<br/>pages/AdminPage.tsx<br/>pages/SuccessPage.tsx<br/>pages/AdminLink.tsx]
    
    FrontendPages --> PageHome[Home Page<br/>- Load primary form<br/>- Display DynamicForm<br/>- Handle archived forms]
    FrontendPages --> PageAdmin[Admin Page<br/>- Session Check<br/>- AdminLogin<br/>- AdminDashboard]
    FrontendPages --> PageSuccess[Success Page<br/>- Confirmation message]
    
    ConfigFE --> ComponentTheme[Develop ThemeProvider Component<br/>components/theme-provider.tsx<br/>- Dark/Light Mode<br/>- System Theme Support]
    
    ComponentTheme --> FrontendPages
    
    PageHome --> ComponentForm[Develop DynamicForm Component<br/>components/dynamic-form.tsx<br/>- Render fields dynamically<br/>- Validation<br/>- Data cleaning<br/>- Submit handler]
    PageAdmin --> ComponentLogin[Develop AdminLogin Component<br/>components/admin-login.tsx<br/>- Authentication form<br/>- Password validation]
    PageAdmin --> ComponentDashboard[Develop AdminDashboard Component<br/>components/admin-dashboard.tsx<br/>- Tab Navigation<br/>- Form Management<br/>- Form Editor<br/>- Responses Table<br/>- Analytics<br/>- Users List]
    
    ComponentForm --> ComponentTable[Develop ResponsesTable Component<br/>components/responses-table.tsx<br/>- Display all responses<br/>- Format data<br/>- Delete responses<br/>- Form mapping]
    ComponentDashboard --> ComponentEditor[Develop FormEditor Component<br/>components/form-editor.tsx<br/>- Add/Edit/Delete fields<br/>- Field configuration<br/>- Save config]
    ComponentDashboard --> ComponentManagement[Develop FormManagement Component<br/>components/form-management.tsx<br/>- Create/Edit Forms<br/>- Set Primary<br/>- Archive Forms<br/>- Delete Forms]
    ComponentDashboard --> ComponentAnalytics[Develop ResponsesAnalytics Component<br/>components/responses-analytics.tsx<br/>- Statistics<br/>- Charts<br/>- Data visualization]
    ComponentDashboard --> ComponentUsers[Develop UsersList Component<br/>components/users-list.tsx<br/>- Extract emails<br/>- User data display]
    
    ComponentForm --> Services[Create API Services & Utilities<br/>services/api.ts - API Client<br/>lib/storage.ts - Storage Helpers<br/>lib/auth.ts - Auth Utilities<br/>lib/utils.ts - Utility Functions]
    ComponentTable --> Services
    ComponentEditor --> Services
    ComponentManagement --> Services
    ComponentAnalytics --> Services
    ComponentUsers --> Services
    ComponentLogin --> Services
    
    Services --> Integration[Integration Testing<br/>- Frontend ↔ Backend<br/>- API Endpoints<br/>- Database Operations]
    
    Integration --> Testing[Testing<br/>- Form Submission<br/>- Multi-Form Management<br/>- Admin Functions<br/>- Error Handling]
    
    Testing --> Deploy[Deployment<br/>- Build Frontend<br/>- Deploy Backend<br/>- Configure Environment]
    
    Deploy --> End([Selesai])
    
    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style SetupFE fill:#fff3e0
    style SetupBE fill:#fff3e0
    style BackendAPI fill:#f3e5f5
    style FrontendPages fill:#f3e5f5
    style Integration fill:#e8f5e9
    style Testing fill:#e8f5e9
```

## 2. Flowchart Arsitektur Sistem

```mermaid
flowchart TB
    subgraph Client["Client Browser"]
        User[User/Admin]
        ReactApp[React Application<br/>TypeScript + Vite<br/>Port 5173]
    end
    
    subgraph Frontend["Frontend Layer (form-fe/src)"]
        Pages[Pages<br/>- Home.tsx<br/>- AdminPage.tsx<br/>- SuccessPage.tsx<br/>- AdminLink.tsx]
        Components[Components<br/>- dynamic-form.tsx<br/>- admin-dashboard.tsx<br/>- admin-login.tsx<br/>- form-editor.tsx<br/>- form-management.tsx<br/>- responses-table.tsx<br/>- responses-analytics.tsx<br/>- users-list.tsx<br/>- theme-provider.tsx]
        Services[Services<br/>- services/api.ts<br/>- lib/storage.ts<br/>- lib/auth.ts]
        UI[UI Components<br/>Shadcn UI Components<br/>components/ui/]
    end
    
    subgraph Backend["Backend Layer (form-be/src)"]
        ExpressServer[Express Server<br/>server.js<br/>Port 3001]
        Routes[Routes<br/>- routes/form.routes.js<br/>- routes/response.routes.js<br/>- routes/admin.routes.js]
        Controllers[Controllers<br/>- controllers/form.controller.js<br/>- controllers/response.controller.js<br/>- controllers/admin.controller.js]
        ServicesBE[Services<br/>- services/storage.service.js]
        Middleware[Middleware<br/>- middleware/auth.middleware.js<br/>- CORS<br/>- JSON Parser]
        Config[Config<br/>- config/database.js<br/>- config/config.js]
    end
    
    subgraph Database["Database Layer"]
        MongoDB[(MongoDB)]
        FormConfigCollection[(FormConfig Collection<br/>- id, title, description<br/>- fields array<br/>- isPrimary, isArchived<br/>- timestamps)]
        ResponseCollection[(Response Collection<br/>- formId, data, email<br/>- submittedAt)]
    end
    
    User -->|Access| ReactApp
    ReactApp --> Pages
    Pages --> Components
    Components --> UI
    Components --> Services
    Services -->|HTTP Requests<br/>fetch API| ExpressServer
    ExpressServer --> Middleware
    Middleware --> Routes
    Routes --> Controllers
    Controllers --> ServicesBE
    ServicesBE -->|Mongoose Query| MongoDB
    MongoDB --> FormConfigCollection
    MongoDB --> ResponseCollection
    ServicesBE -->|Response| Controllers
    Controllers -->|JSON Response| Services
    Services -->|Update State| Components
    Components -->|Render UI| Pages
    
    style Client fill:#e3f2fd
    style Frontend fill:#f3e5f5
    style Backend fill:#fff3e0
    style Database fill:#e8f5e9
```

## 3. Flowchart Alur User - Form Submission

```mermaid
sequenceDiagram
    participant U as User
    participant H as Home Page
    participant ST as Storage Service
    participant DF as DynamicForm
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    U->>H: Access Home Page (/)
    H->>ST: getPrimaryFormConfig()
    ST->>API: formAPI.getPrimaryForm()
    API->>BE: GET /api/form/primary
    BE->>DB: Query FormConfig<br/>{isPrimary: true, isArchived: false}
    
    alt Primary Form Not Found
        DB-->>BE: null
        BE->>DB: Query default-form
        alt Default Form Not Found
            DB-->>BE: null
            BE-->>API: 404 Error
            API-->>ST: null
            ST->>API: formAPI.initializeConfig()
            API->>BE: POST /api/form/initialize
            BE->>DB: Create Default FormConfig
            DB-->>BE: Created Config
        end
    end
    
    DB-->>BE: Return Primary Config
    BE-->>API: JSON Response
    API-->>ST: FormConfig Data
    ST-->>H: FormConfig
    
    alt Form is Archived
        H-->>U: Show Error: Form Archived
    else Form is Active
        H->>DF: Render DynamicForm<br/>with config
        DF-->>U: Display Form
    end
    
    U->>DF: Fill Form Fields
    U->>DF: Click Submit
    
    DF->>DF: Validate All Fields<br/>(Required, Type, etc.)
    alt Validation Failed
        DF-->>U: Show Error Messages<br/>Scroll to First Error
    else Validation Success
        DF->>DF: Clean Data<br/>(Extract option text<br/>from "option|||index")
        DF->>ST: addFormResponse()
        ST->>API: responseAPI.create()
        API->>BE: POST /api/responses<br/>{formId, data, email}
        BE->>DB: Save Response Document
        DB-->>BE: Response Saved<br/>{id, formId, data, email, submittedAt}
        BE-->>API: Success Response
        API-->>ST: Response Object
        ST-->>DF: Success
        DF->>H: Navigate to /success
        H-->>U: Show Success Page
    end
```

## 4. Flowchart Alur Admin - Form Management

```mermaid
sequenceDiagram
    participant A as Admin
    participant AP as AdminPage
    participant AL as AdminLogin
    participant AD as AdminDashboard
    participant FM as FormManagement
    participant FE as FormEditor
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    A->>AP: Access /admin-7x8k9m2q
    AP->>AP: Check Session<br/>getAdminSession()
    AP->>API: adminAPI.verify()
    API->>BE: GET /api/admin/verify<br/>with JWT Token
    BE->>BE: authenticateAdmin Middleware<br/>Verify JWT & Session
    
    alt Session Invalid
        BE-->>API: 401 Unauthorized
        API-->>AP: Error
        AP->>AL: Show Login Form
        A->>AL: Enter Password
        AL->>API: adminAPI.login(password)
        API->>BE: POST /api/admin/login
        BE->>BE: Verify Password<br/>Check ADMIN_PASSWORD
        BE->>BE: Generate JWT Token<br/>Add to activeSessions
        BE-->>API: {token, expiresIn: '7d'}
        API-->>AL: Store Token in localStorage
        AL->>AP: Login Success
    end
    
    AP->>AD: Show Dashboard
    
    AD->>API: formAPI.getAllForms()
    API->>BE: GET /api/form/all<br/>with JWT Token
    BE->>BE: authenticateAdmin Middleware
    BE->>DB: Query All FormConfig<br/>Sort by createdAt
    DB-->>BE: Forms Array
    BE-->>API: Forms Data
    API-->>AD: All Forms
    
    AD->>FM: Load FormManagement<br/>with allForms
    AD->>FE: Load FormEditor<br/>with selectedForm
    
    A->>FM: Select Form / Create New
    alt Create New Form
        A->>FM: Click Create Form
        FM->>API: formAPI.createForm(formData)
        API->>BE: POST /api/form/new<br/>with JWT Token
        BE->>DB: Create New FormConfig<br/>Generate unique ID
        DB-->>BE: Created Form
        BE-->>API: Success
        API-->>FM: New Form
        FM->>AD: Refresh Forms List
    else Edit Existing Form
        A->>FE: Edit Form Fields<br/>Add/Edit/Delete Fields
        A->>FE: Save Changes
        FE->>API: formAPI.updateForm(id, formData)
        API->>BE: PUT /api/form/:id<br/>with JWT Token
        BE->>DB: Update FormConfig<br/>Update updatedAt
        DB-->>BE: Updated Form
        BE-->>API: Success
        API-->>FE: Success
        FE-->>A: Show Success Message
    else Set Primary Form
        A->>FM: Click Set Primary
        FM->>API: formAPI.setPrimaryForm(id)
        API->>BE: PUT /api/form/:id/set-primary<br/>with JWT Token
        BE->>DB: Unset All Primary<br/>Set Selected as Primary<br/>Unarchive Automatically
        DB-->>BE: Updated
        BE-->>API: Success
        API-->>FM: Success
        FM->>AD: Refresh Forms List
    else Archive Form
        A->>FM: Click Archive
        FM->>API: formAPI.archiveForm(id, true)
        API->>BE: PUT /api/form/:id/archive<br/>with JWT Token
        BE->>DB: Set isArchived = true
        DB-->>BE: Updated
        BE-->>API: Success
        API-->>FM: Success
        FM->>AD: Refresh Forms List
    else Delete Form
        A->>FM: Click Delete
        FM->>API: formAPI.deleteForm(id)
        API->>BE: DELETE /api/form/:id<br/>with JWT Token
        BE->>DB: Delete FormConfig
        DB-->>BE: Deleted
        BE-->>API: Success
        API-->>FM: Success
        FM->>AD: Refresh Forms List
    end
```

## 5. Flowchart Alur Admin - View Responses

```mermaid
sequenceDiagram
    participant A as Admin
    participant AD as AdminDashboard
    participant RT as ResponsesTable
    participant RA as ResponsesAnalytics
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    A->>AD: Access Dashboard<br/>Tab: Responses
    AD->>RT: Load ResponsesTable Component
    RT->>API: responseAPI.getAll()
    API->>BE: GET /api/responses<br/>with JWT Token
    BE->>BE: authenticateAdmin Middleware<br/>Verify JWT & Session
    
    alt Token Invalid
        BE-->>API: 401 Unauthorized
        API-->>RT: Error
        RT-->>AD: Show Error
        AD-->>A: Redirect to Login
    else Token Valid
        BE->>DB: Query All Responses<br/>Sort by submittedAt DESC
        DB-->>BE: Responses Array<br/>[{id, formId, data, email, submittedAt}]
        BE-->>API: Responses Data
        API-->>RT: Responses Array
        
        RT->>API: formAPI.getAllForms()
        API->>BE: GET /api/form/all<br/>with JWT Token
        BE->>DB: Query All FormConfig
        DB-->>BE: Forms Array
        BE-->>API: Forms Data
        API-->>RT: Forms Array
        
        RT->>RT: Format & Display<br/>- Map formId to form title<br/>- Format submittedAt date<br/>- Display data fields<br/>- Show email if available
        RT-->>A: Show Responses Table<br/>with Delete Actions
        
        A->>AD: Switch to Analytics Tab
        AD->>RA: Load ResponsesAnalytics Component
        RA->>RT: Use Responses Data
        RA->>RA: Calculate Statistics<br/>- Total Responses<br/>- Responses per Form<br/>- Chart Data
        RA-->>A: Show Analytics Dashboard
    end
    
    A->>RT: Click Delete Response
    RT->>API: responseAPI.delete(id)
    API->>BE: DELETE /api/responses/:id<br/>with JWT Token
    BE->>BE: authenticateAdmin Middleware
    BE->>DB: Delete Response by ID
    DB-->>BE: Deleted
    BE-->>API: Success
    API-->>RT: Success
    RT->>RT: Refresh Responses List
    RT-->>A: Updated Table
```

## 6. Flowchart Struktur Data Flow

```mermaid
flowchart LR
    subgraph Input["Input Data"]
        FormFields[Form Fields<br/>- text, email, number<br/>- textarea, select<br/>- checkbox, radio]
        FormConfigInput[Form Config Input<br/>Admin creates/edits<br/>form structure]
    end
    
    subgraph Processing["Processing"]
        Validation[Field Validation<br/>- Required check<br/>- Type validation<br/>- Error handling<br/>- Scroll to first error]
        DataCleaning[Data Cleaning<br/>- Extract option text<br/>from "option|||index"<br/>- Format arrays<br/>- Normalize values]
        FormProcessing[Form Processing<br/>- Generate unique IDs<br/>- Set primary flag<br/>- Archive/unarchive<br/>- Timestamp updates]
    end
    
    subgraph Storage["Storage (MongoDB)"]
        FormConfig[(FormConfig Collection<br/>- id (unique)<br/>- title, description<br/>- fields array<br/>- isPrimary (boolean)<br/>- isArchived (boolean)<br/>- createdAt, updatedAt)]
        Response[(Response Collection<br/>- _id (MongoDB)<br/>- formId (indexed)<br/>- data (Mixed type)<br/>- email (optional)<br/>- submittedAt (indexed))]
    end
    
    subgraph Output["Output"]
        SuccessPage[Success Page<br/>Confirmation message]
        ResponsesTable[Responses Table<br/>Admin View<br/>- All responses<br/>- Form mapping<br/>- Delete actions]
        Analytics[Analytics Dashboard<br/>- Total responses<br/>- Per form stats<br/>- Charts]
        UsersList[Users List<br/>- Email extraction<br/>- User data]
    end
    
    FormFields --> Validation
    Validation -->|Valid| DataCleaning
    Validation -->|Invalid| FormFields
    DataCleaning --> Response
    FormConfigInput --> FormProcessing
    FormProcessing --> FormConfig
    FormConfig --> FormFields
    Response --> SuccessPage
    Response --> ResponsesTable
    Response --> Analytics
    Response --> UsersList
    
    style Input fill:#e3f2fd
    style Processing fill:#fff3e0
    style Storage fill:#e8f5e9
    style Output fill:#f3e5f5
```

## 7. Flowchart Struktur Folder & File

```mermaid
flowchart TD
    Root[dynamic-form-application/] --> FE[form-fe/]
    Root --> BE[form-be/]
    Root --> Docs[FLOWCHART.md<br/>README.md]
    
    FE --> FESrc[src/]
    FE --> FEPublic[public/]
    FE --> FEConfig[tsconfig.json<br/>vite.config.ts<br/>package.json]
    
    FESrc --> FEPages[pages/<br/>- Home.tsx<br/>- AdminPage.tsx<br/>- AdminLink.tsx<br/>- SuccessPage.tsx]
    FESrc --> FEComponents[components/<br/>- dynamic-form.tsx<br/>- admin-dashboard.tsx<br/>- admin-login.tsx<br/>- form-editor.tsx<br/>- form-management.tsx<br/>- responses-table.tsx<br/>- responses-analytics.tsx<br/>- users-list.tsx<br/>- theme-provider.tsx<br/>- ui/ (Shadcn components)]
    FESrc --> FEServices[services/<br/>- api.ts]
    FESrc --> FELib[lib/<br/>- storage.ts<br/>- auth.ts<br/>- utils.ts]
    FESrc --> FEHooks[hooks/<br/>- use-mobile.ts<br/>- use-toast.ts]
    FESrc --> FEApp[App.tsx<br/>main.tsx<br/>index.css]
    
    BE --> BESrc[src/]
    BE --> BEScripts[scripts/<br/>- generate-jwt-secret.js]
    BE --> BEConfig[package.json<br/>README.md]
    
    BESrc --> BEServer[server.js]
    BESrc --> BERoutes[routes/<br/>- form.routes.js<br/>- response.routes.js<br/>- admin.routes.js]
    BESrc --> BEControllers[controllers/<br/>- form.controller.js<br/>- response.controller.js<br/>- admin.controller.js]
    BESrc --> BEModels[models/<br/>- FormConfig.model.js<br/>- Response.model.js]
    BESrc --> BEMiddleware[middleware/<br/>- auth.middleware.js]
    BESrc --> BEServices[services/<br/>- storage.service.js]
    BESrc --> BEConfigDir[config/<br/>- database.js<br/>- config.js]
    
    style Root fill:#e1f5ff
    style FE fill:#f3e5f5
    style BE fill:#fff3e0
    style FESrc fill:#e8f5e9
    style BESrc fill:#e8f5e9
```

## 8. Flowchart Teknologi Stack

```mermaid
mindmap
  root((Dynamic Form<br/>Application))
    Frontend
      React 18
        TypeScript
        Hooks (useState, useEffect)
        React Router v6
      Vite
        Build Tool
        Dev Server (Port 5173)
        HMR
      TailwindCSS
        Utility-first CSS
        Responsive Design
        Dark Mode Support
      Shadcn UI
        50+ Components
        Theme Provider
        Accessible Components
    Backend
      Node.js
        ES Modules
        Runtime Environment
      Express
        RESTful API
        Route Handlers
        Middleware Chain
      MongoDB
        NoSQL Database
        Mongoose ODM
        Indexes (formId, submittedAt)
      JWT
        Token Authentication
        Session Management
        activeSessions Set
    Features
      Dynamic Forms
        7 Field Types
        Client-side Validation
        Multi-Form Support
        Primary Form System
        Archive/Unarchive
      Admin Panel
        JWT Login/Logout
        Form Management
        Form Editor
        Responses Table
        Analytics Dashboard
        Users List
      API
        RESTful Endpoints
        CRUD Operations
        Error Handling
        CORS Configuration
        Health Check Endpoint
```

## 9. Flowchart API Endpoints

```mermaid
flowchart TB
    subgraph Public["Public Endpoints"]
        P1[GET /api/form/primary<br/>Get primary form config]
        P2[GET /api/form<br/>Get form config<br/>(backward compatibility)]
        P3[POST /api/form/initialize<br/>Initialize default form]
        P4[POST /api/responses<br/>Submit form response]
        P5[GET /api/health<br/>Health check]
    end
    
    subgraph Admin["Admin Endpoints (JWT Required)"]
        A1[GET /api/form/all<br/>Get all forms]
        A2[GET /api/form/:id<br/>Get form by ID]
        A3[POST /api/form/new<br/>Create new form]
        A4[PUT /api/form<br/>Update form<br/>(backward compatibility)]
        A5[PUT /api/form/:id<br/>Update form by ID]
        A6[PUT /api/form/:id/set-primary<br/>Set form as primary]
        A7[PUT /api/form/:id/archive<br/>Archive form]
        A8[DELETE /api/form/:id<br/>Delete form]
        A9[GET /api/responses<br/>Get all responses]
        A10[GET /api/responses/:id<br/>Get response by ID]
        A11[DELETE /api/responses/:id<br/>Delete response]
        A12[POST /api/admin/login<br/>Admin login]
        A13[POST /api/admin/logout<br/>Admin logout]
        A14[GET /api/admin/verify<br/>Verify session]
    end
    
    style Public fill:#e8f5e9
    style Admin fill:#fff3e0
```

## Penjelasan Singkat

### Struktur Proyek:

1. **Frontend (form-fe/)**: 
   - React + TypeScript + Vite
   - Pages: Home, AdminPage, SuccessPage, AdminLink
   - Components: DynamicForm, AdminDashboard, FormEditor, FormManagement, ResponsesTable, ResponsesAnalytics, UsersList
   - Services: API client, storage utilities, auth utilities
   - UI: Shadcn UI components dengan theme support

2. **Backend (form-be/)**:
   - Node.js + Express
   - Routes: form.routes.js, response.routes.js, admin.routes.js
   - Controllers: form.controller.js, response.controller.js, admin.controller.js
   - Models: FormConfig.model.js, Response.model.js
   - Services: storage.service.js (MongoDB operations)
   - Middleware: auth.middleware.js (JWT authentication)
   - Config: database.js, config.js

### Fitur Utama:

- **Multi-Form Support**: Sistem dapat mengelola multiple forms dengan primary form system
- **Dynamic Form**: Form yang dapat dikonfigurasi dengan 7 tipe field (text, email, number, textarea, select, checkbox, radio)
- **Form Management**: Admin dapat create, edit, delete, set primary, dan archive forms
- **Admin Panel**: Dashboard lengkap dengan form management, responses table, analytics, dan users list
- **Authentication**: JWT-based authentication dengan session management menggunakan activeSessions Set
- **Data Cleaning**: Automatic cleaning untuk extract option text dari format "option|||index"
- **Archive System**: Forms dapat di-archive dan tidak akan ditampilkan di home page
- **Responsive Design**: UI yang responsif dengan TailwindCSS dan dark mode support
- **Error Handling**: Comprehensive error handling di frontend dan backend

### Alur Data:

1. **User Flow**: Home → Load Primary Form → Fill Form → Validate → Clean Data → Submit → Success Page
2. **Admin Flow**: AdminPage → Login → Dashboard → Manage Forms/View Responses → Logout
3. **Form Management**: Create/Edit Forms → Set Primary → Archive/Delete → Update affects home page immediately
4. **Response Management**: View All Responses → Filter by Form → Delete Responses → View Analytics

