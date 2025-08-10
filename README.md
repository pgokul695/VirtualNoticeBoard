# Virtual Notice Board

A modern, responsive web application for managing and displaying notices in an educational institution. This application allows administrators to post, update, and manage notices, while students and faculty can easily view and filter them.

## Features

- **User Authentication**: Secure login and registration system
- **Role-based Access Control**: Different views for admins, faculty, and students
- **Notice Management**: Create, read, update, and delete notices
- **Categorization**: Organize notices by categories (Main, Department, Club) and subcategories
- **Search & Filter**: Easily find notices with advanced filtering options
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Notices are updated in real-time

## Tech Stack

- **Frontend**: React.js, React Router, Tailwind CSS, Headless UI
- **Backend**: FastAPI (separate repository)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Firebase account with a project set up
- Backend server (see backend repository for setup)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-notice-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Backend API Configuration
   REACT_APP_API_BASE_URL=https://code-for-campus-production.up.railway.app

   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id

   # Environment
   NODE_ENV=development
   ```

   Replace the Firebase configuration values with your own from the Firebase Console.

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication related components
│   ├── notices/         # Notice related components
│   └── layout/          # Layout components (Header, Footer, etc.)
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layer
└── App.js               # Main application component
```

## Available Scripts

- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Create a production build
- `npm run eject`: Eject from Create React App (not recommended)

## Backend Integration

This frontend application requires a backend API to function properly. The backend is a separate FastAPI application that provides the necessary endpoints for user authentication and notice management.

### API Endpoints

- Authentication: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Notices: `/api/v1/notices/*`
- Categories: `/api/v1/notices/categories/*`

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `build` folder with the production-ready files.

### Environment Variables

For production, make sure to set the following environment variables:

- `REACT_APP_API_BASE_URL`: The base URL of your backend API

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
