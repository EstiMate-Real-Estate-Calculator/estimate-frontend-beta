# Getting Started

Clone the repository, install the dependencies, and run the application

```
git clone ...
cd into root
npm install
```

Create a .env file in the root that has a database url variable:

```
DATABASE_URL="link_to_your_cockroach_db"

```

Run the application
```
npm run dev
```

# Development Assistance:

## Prettier extension installation (used to autoformat when a file is saved)

```
code --install-extension esbenp.prettier-vscode
```

Or it can be run manually

```
npm run format
```

## ESLint (Enforces coding standards and catches errors)

```
npm run lint
```

## Deploying (docker)

```

sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
git clone ...
cd into root
docker-compose up --build -d


```

## API Reference

```
API routes:
/api/reports		GET list of all reports, POST a new report
/api/reports/[id]	GET, PUT, DELETE individual reports
/api/login		    POST user login
/api/signup		    POST user signup

Page Routes:
/			        Splash Page
/dashboard		    Dashboard Page
/report/[id]	    Dynamic Report Page (based on id url parameter)
/sign-in		    Sign-in page
/sign-up		    Sign-up page
/forgot-password    Forgotten password page
```

## File Structure

```
.
├── middleware.js               # Route middleware control file
├── docker-compose.yml          # Docker Config - used to deploy
├── dockerfile                  # Docker Config - used to build image
├── jsconfig.json               # Used to define relative import routes - using @lib instead of deeply nested imports
├── next.config.mjs             # Used to allow 3rd party images
├── package.json                # Defines scripts and dependencies
├── postcss.config.js           # Tailwind Config
├── tailwind.config.js          # Tailwind Config - Defines theme
├── app                         # App Router
│   ├── api                     # API routes
│   │   ├── login
│   │   │   └── route.js        # Login API endpoint
│   │   ├── reports
│   │   │   ├── [id]
│   │   │   │   └── route.js    # Report API endpoint
│   │   │   └── route.js        # Reports API endpoint
│   │   └── signup
│   │       └── route.js        # Sign up API endpoint
│   ├── dashboard
│   │   └── page.js             # Dashboard Webpage
│   ├── forgot-password
│   │   └── page.js             # Forgot Password Webpage
│   ├── layout.js               # HTML config file for Webpages - Metadata is set here
│   ├── page.js                 # Splash/Landing Webpage
│   ├── report
│   │   └── [id]
│   │       └── page.js         # Report Webpage - uses the id URL param
│   ├── sign-in
│   │   └── page.js             # Sign-in Webpage
│   └── sign-up
│       └── page.js             # Sign-up Webpage
├── components
│   ├── PropertyCard.jsx        # Used to display properties within PropertyView
│   ├── PropertyView.jsx        # Used to display action buttons and properties in dashboard
│   ├── ReportHighlight.jsx     # Used to display highlights at the top of reports page.
│   ├── SplashNavBar.js         # Controls Mobile and Desktop Navbar
│   └── SplashSignUpButton.jsx  # Permits redirect to sign-up webpage
├── lib
│   ├── auth
│   │   ├── authHandler.js      # Abstracts login/logout to simple methods.
│   │   ├── authMiddleware.js   # Used to verify user is logged in, otherwise redirects to login.
│   │   ├── jwtHandler.js       # Hanldes the creation, decoding, and validation of JWT
│   │   ├── tokenHandler.js     # CRUD functionality for UserToken Table
│   │   ├── userHandler.js      # CRUD functionality for User Table
│   │   └── validateCookie.js   # Validates authToken for incoming requests
│   ├── chart.js                # Methods for generating reports charts
│   ├── exportClass.js          # Export to CSV/Excel all reports (from dashboard view)
│   ├── formatterClass.js       # Utility class for formatting USD and Percentages
│   ├── prisma.ts               # Prisma client - the DBContext/Interface
│   └── reportsHandler.js       # CRUD functionality for Reports Table
├── prisma
│   └── schema.prisma           # Defines the database schema
├── public
│   ├── favicon.ico             # Icon displayed in the browser tab
│   ├── fonts                   # Fonts
│   ├── icons                   # Icons
│   └── images                  # Images (currently houses the various sized splash screen background images)
├── styles
│   └── globals.css             # Global CSS file, additional tailwind settings configured here
└── tests                       # Testing directory (not yet configured for testing)
    ├── components
    ├── integration
    └── lib
```
