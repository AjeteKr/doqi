# DoqiSHPK

Doçi Shpk, in partnership with Starflex, brings together years of experience in high-quality furniture and mattress production. With a modern factory, advanced technology, and a passion for design, we deliver products that combine comfort, durability, and style.

## Technologies Used

- **Vite** - Fast build tool and development server
- **React** - User interface library
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **PWA** - Progressive Web App capabilities

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (version 16 or higher).

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AjeteKr/doqi.git
cd doqi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
doqi/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets (images, icons, etc.)
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles with Tailwind directives
├── public/             # Public assets and PWA manifest
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Project dependencies and scripts
```

## PWA Features

This application is configured as a Progressive Web App (PWA) with:
- Offline capability
- App-like experience when installed
- Automatic updates
- Mobile-responsive design

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the ISC License.