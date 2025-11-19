# Flowchart Alur Pembuatan Dynamic Form Application

## 1. Flowchart Proses Pengembangan

```mermaid
flowchart TD
    Start([Mulai Proyek]) --> Setup[Setup Proyek]
    
    Setup --> SetupFE[Setup Frontend<br/>React + TypeScript + Vite]
    Setup --> SetupBE[Setup Backend<br/>Node.js + Express]
    
    SetupFE --> InstallFE[Install Dependencies<br/>React Router, TailwindCSS,<br/>Shadcn UI Components]
    SetupBE --> InstallBE[Install Dependencies<br/>Express, Mongoose,<br/>CORS, dotenv, JWT]
    
    InstallFE --> ConfigFE[Konfigurasi Frontend<br/>- Routing<br/>- Theme Provider<br/>- API Service]
    InstallBE --> ConfigBE[Konfigurasi Backend<br/>- Database Connection<br/>- Middleware<br/>- Routes]
    
    ConfigBE --> DBSetup[Setup Database<br/>MongoDB Connection<br/>Create Models]
    
    DBSetup --> ModelForm[Create FormConfig Model<br/>- id, title, description<br/>- fields array]
    DBSetup --> ModelResponse[Create Response Model<br/>- formId, data, email<br/>- submittedAt]
    
    ModelForm --> BackendAPI[Develop Backend API]
    ModelResponse --> BackendAPI
    
    BackendAPI --> APIForm[Form API Routes<br/>GET /api/form<br/>PUT /api/form<br/>POST /api/form/initialize]
    BackendAPI --> APIResponse[Response API Routes<br/>GET /api/responses<br/>POST /api/responses<br/>DELETE /api/responses/:id]
    BackendAPI --> APIAdmin[Admin API Routes<br/>POST /api/admin/login<br/>GET /api/admin/verify]
    
    APIForm --> Controllers[Create Controllers<br/>- form.controller.js<br/>- response.controller.js<br/>- admin.controller.js]
    APIResponse --> Controllers
    APIAdmin --> Controllers
    
    Controllers --> Middleware[Create Middleware<br/>- auth.middleware.js<br/>JWT Authentication]
    
    ConfigFE --> FrontendPages[Develop Frontend Pages]
    
    FrontendPages --> PageHome[Home Page<br/>- Load form config<br/>- Display DynamicForm]
    FrontendPages --> PageAdmin[Admin Page<br/>- Login<br/>- Dashboard]
    FrontendPages --> PageSuccess[Success Page<br/>- Confirmation message]
    
    PageHome --> ComponentForm[Develop DynamicForm Component<br/>- Render fields dynamically<br/>- Validation<br/>- Submit handler]
    PageAdmin --> ComponentLogin[Develop AdminLogin Component<br/>- Authentication form]
    PageAdmin --> ComponentDashboard[Develop AdminDashboard<br/>- Form Editor<br/>- Responses Table<br/>- Analytics]
    
    ComponentForm --> ComponentTable[Develop ResponsesTable Component<br/>- Display all responses<br/>- Format data]
    ComponentDashboard --> ComponentEditor[Develop FormEditor Component<br/>- Add/Edit/Delete fields<br/>- Save config]
    
    ComponentForm --> Services[Create API Services<br/>- api.ts<br/>- storage.ts<br/>- auth.ts]
    ComponentTable --> Services
    ComponentEditor --> Services
    
    Services --> Integration[Integration Testing<br/>- Frontend ↔ Backend<br/>- API Endpoints<br/>- Database Operations]
    
    Integration --> Testing[Testing<br/>- Form Submission<br/>- Admin Functions<br/>- Error Handling]
    
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
        ReactApp[React Application<br/>TypeScript + Vite]
    end
    
    subgraph Frontend["Frontend Layer"]
        Pages[Pages<br/>- Home<br/>- AdminPage<br/>- SuccessPage]
        Components[Components<br/>- DynamicForm<br/>- AdminDashboard<br/>- ResponsesTable<br/>- FormEditor]
        Services[Services<br/>- API Client<br/>- Storage<br/>- Auth]
    end
    
    subgraph Backend["Backend Layer"]
        ExpressServer[Express Server<br/>Port 3001]
        Routes[Routes<br/>- /api/form<br/>- /api/responses<br/>- /api/admin]
        Controllers[Controllers<br/>- Form Controller<br/>- Response Controller<br/>- Admin Controller]
        Middleware[Middleware<br/>- CORS<br/>- JSON Parser<br/>- Auth JWT]
    end
    
    subgraph Database["Database Layer"]
        MongoDB[(MongoDB)]
        FormConfigCollection[(FormConfig Collection)]
        ResponseCollection[(Response Collection)]
    end
    
    User -->|Access| ReactApp
    ReactApp --> Pages
    Pages --> Components
    Components --> Services
    Services -->|HTTP Requests| ExpressServer
    ExpressServer --> Middleware
    Middleware --> Routes
    Routes --> Controllers
    Controllers -->|Query| MongoDB
    MongoDB --> FormConfigCollection
    MongoDB --> ResponseCollection
    Controllers -->|Response| Services
    Services -->|Update UI| Components
    
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
    participant DF as DynamicForm
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    U->>H: Access Home Page (/)
    H->>API: GET /api/form
    API->>BE: Request Form Config
    BE->>DB: Query FormConfig
    DB-->>BE: Return Config
    BE-->>API: JSON Response
    API-->>H: FormConfig Data
    H->>DF: Render DynamicForm
    DF-->>U: Display Form
    
    U->>DF: Fill Form Fields
    U->>DF: Click Submit
    
    DF->>DF: Validate Fields
    alt Validation Failed
        DF-->>U: Show Error Messages
    else Validation Success
        DF->>API: POST /api/responses
        API->>BE: Submit Response
        BE->>DB: Save Response
        DB-->>BE: Response Saved
        BE-->>API: Success Response
        API-->>DF: Success
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
    participant FE as FormEditor
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    A->>AP: Access /admin-7x8k9m2q
    AP->>AL: Check Authentication
    AL->>A: Show Login Form
    
    A->>AL: Enter Credentials
    AL->>API: POST /api/admin/login
    API->>BE: Authenticate
    BE->>BE: Verify Credentials
    BE-->>API: JWT Token
    API-->>AL: Store Token
    AL->>AP: Login Success
    AP->>AD: Show Dashboard
    
    AD->>API: GET /api/form
    API->>BE: Request Config
    BE->>DB: Query FormConfig
    DB-->>BE: Config Data
    BE-->>API: Response
    API-->>AD: FormConfig
    AD->>FE: Load Form Editor
    
    A->>FE: Edit Form Fields
    A->>FE: Save Changes
    FE->>API: PUT /api/form
    API->>BE: Update Config
    BE->>DB: Update FormConfig
    DB-->>BE: Updated
    BE-->>API: Success
    API-->>FE: Success
    FE-->>A: Show Success Message
```

## 5. Flowchart Alur Admin - View Responses

```mermaid
sequenceDiagram
    participant A as Admin
    participant AD as AdminDashboard
    participant RT as ResponsesTable
    participant API as API Service
    participant BE as Backend API
    participant DB as MongoDB
    
    A->>AD: Access Dashboard
    AD->>RT: Load Responses Table
    RT->>API: GET /api/responses
    API->>BE: Request with JWT Token
    BE->>BE: Verify JWT Token
    
    alt Token Invalid
        BE-->>API: 401 Unauthorized
        API-->>RT: Error
        RT-->>A: Show Error
    else Token Valid
        BE->>DB: Query All Responses
        DB-->>BE: Responses Data
        BE->>DB: Query FormConfig (for labels)
        DB-->>BE: FormConfig
        BE-->>API: Combined Data
        API-->>RT: Responses Array
        RT->>RT: Format & Display
        RT-->>A: Show Responses Table
    end
```

## 6. Flowchart Struktur Data Flow

```mermaid
flowchart LR
    subgraph Input["Input Data"]
        FormFields[Form Fields<br/>- text, email, number<br/>- textarea, select<br/>- checkbox, radio]
    end
    
    subgraph Processing["Processing"]
        Validation[Field Validation<br/>- Required check<br/>- Type validation<br/>- Error handling]
        DataCleaning[Data Cleaning<br/>- Extract option text<br/>- Format arrays<br/>- Normalize values]
    end
    
    subgraph Storage["Storage"]
        FormConfig[(FormConfig<br/>MongoDB)]
        Response[(Response<br/>MongoDB)]
    end
    
    subgraph Output["Output"]
        SuccessPage[Success Page]
        ResponsesTable[Responses Table<br/>Admin View]
        Analytics[Analytics Dashboard]
    end
    
    FormFields --> Validation
    Validation -->|Valid| DataCleaning
    Validation -->|Invalid| FormFields
    DataCleaning --> Response
    FormConfig --> FormFields
    Response --> SuccessPage
    Response --> ResponsesTable
    Response --> Analytics
    
    style Input fill:#e3f2fd
    style Processing fill:#fff3e0
    style Storage fill:#e8f5e9
    style Output fill:#f3e5f5
```

## 7. Flowchart Teknologi Stack

```mermaid
mindmap
  root((Dynamic Form<br/>Application))
    Frontend
      React
        TypeScript
        Hooks
        Router
      Vite
        Build Tool
        Dev Server
      TailwindCSS
        Styling
        Responsive
      Shadcn UI
        Components
        Theme
    Backend
      Node.js
        Runtime
      Express
        Framework
        Routes
        Middleware
      MongoDB
        Database
        Mongoose ODM
      JWT
        Authentication
        Security
    Features
      Dynamic Forms
        Field Types
        Validation
        Customization
      Admin Panel
        Login
        Form Editor
        Responses View
      API
        RESTful
        CRUD Operations
        Error Handling
```

## Penjelasan Singkat

### Tahapan Pengembangan:

1. **Setup Proyek**: Membuat struktur proyek frontend dan backend terpisah
2. **Database Setup**: Konfigurasi MongoDB dan pembuatan model data
3. **Backend Development**: 
   - API endpoints untuk form dan responses
   - Authentication middleware
   - Controllers untuk business logic
4. **Frontend Development**:
   - Pages untuk routing
   - Components untuk UI
   - Services untuk API communication
5. **Integration**: Menghubungkan frontend dan backend
6. **Testing & Deployment**: Testing dan deployment aplikasi

### Fitur Utama:

- **Dynamic Form**: Form yang dapat dikonfigurasi dengan berbagai tipe field
- **Admin Panel**: Panel admin untuk mengelola form dan melihat responses
- **Authentication**: JWT-based authentication untuk admin
- **Responsive Design**: UI yang responsif dengan TailwindCSS
- **Real-time Updates**: Update form config langsung mempengaruhi form user

