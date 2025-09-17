# CC2 Academy Stats - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Environment
```bash
npm run setup
```

### 3. Configure Your Settings
Edit `server/.env` file and update:
- `COC_API_KEY` - Your Clash of Clans API key
- `CLAN_TAG_1` - Your first clan tag (e.g., #ABC123)
- `CLAN_TAG_2` - Your second clan tag (e.g., #XYZ789)

### 4. Start the Application
```bash
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
cc2-academy-stats/
├── client/                    # React Frontend
│   ├── public/               # Static files
│   │   ├── index.html        # Main HTML file ✅
│   │   ├── manifest.json     # PWA manifest ✅
│   │   ├── favicon.svg       # App icon ✅
│   │   └── robots.txt        # SEO file ✅
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Main pages
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # TailwindCSS config
├── server/                   # Node.js Backend
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # External API integration
│   ├── middleware/           # Auth middleware
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
├── package.json              # Root package.json
├── setup.js                  # Setup script
└── README.md                 # Documentation
```

## 🔧 Configuration

### Environment Variables
Create `server/.env` with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cc2-academy-stats

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-here

# Clash of Clans API
COC_API_KEY=your-clash-of-clans-api-key-here
COC_API_BASE_URL=https://api.clashofclans.com/v1

# Clan Tags (replace with your actual clan tags)
CLAN_TAG_1=%23YOUR_CLAN_TAG_1
CLAN_TAG_2=%23YOUR_CLAN_TAG_2

# Inspector Login Credentials
INSPECTOR_USERNAME=inspector
INSPECTOR_PASSWORD=inspector911
```

### Getting Clash of Clans API Key
1. Visit [Clash of Clans API](https://developer.clashofclans.com)
2. Create an account and request an API key
3. Replace `your-clash-of-clans-api-key-here` with your actual API key
4. Replace clan tags with your actual clan tags (include the # symbol)

## 🎮 Features

### ✅ Implemented Features
- **Clan Overview**: Side-by-side comparison with real-time stats
- **Member Management**: Searchable, sortable table with auto-refresh
- **CWL Tables**: Inspector-editable with custom points and remarks
- **User Authentication**: Role-based access with special Inspector login
- **Events & Media**: War schedules, CWL info, and media gallery
- **Modern Design**: Clash of Clans theme with dark mode support
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Auto-refresh capabilities

### 🔐 Default Login Credentials
- **Inspector**: `inspector` / `inspector911`
- **Regular Users**: Register through the signup page

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start both server and client
npm run server       # Start only the server
npm run client       # Start only the client
npm run build        # Build for production
npm run install-all  # Install all dependencies
npm run setup        # Run setup script
```

### Database Setup
Make sure MongoDB is running:
```bash
# Start MongoDB (if installed locally)
mongod
```

## 🚀 Deployment

### Production Build
```bash
npm run build
cd server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Set secure JWT secret
- Configure CORS for your domain

## 🐛 Troubleshooting

### Common Issues

#### 1. Missing HTML File
**Problem**: React app won't load
**Solution**: The `client/public/index.html` file is now included ✅

#### 2. API Key Issues
**Problem**: Clan data not loading
**Solution**: 
- Ensure your Clash of Clans API key is valid
- Check if the API key has proper permissions
- Verify clan tags are correctly formatted

#### 3. Database Connection
**Problem**: Server won't start
**Solution**: 
- Ensure MongoDB is running
- Check connection string in environment variables
- Verify database permissions

#### 4. CORS Issues
**Problem**: Frontend can't connect to backend
**Solution**: 
- Update CORS configuration in `server/index.js`
- Ensure frontend URL is whitelisted

## 📱 PWA Features

The app includes Progressive Web App features:
- **Manifest**: App can be installed on mobile devices
- **Service Worker**: Offline capabilities (can be added)
- **Responsive Design**: Works on all screen sizes
- **App-like Experience**: Full-screen mode on mobile

## 🎨 Customization

### Styling
- Modify `client/tailwind.config.js` for theme customization
- Update `client/src/index.css` for global styles
- Use TailwindCSS classes for component styling

### Clan Configuration
- Update clan tags in environment variables
- Modify clan comparison logic in `client/src/pages/Clans.js`
- Adjust member filtering in `client/src/pages/Members.js`

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation in the README
- Create an issue in the repository

---

**🎮 Ready to start clashing! Your CC2 Academy Stats dashboard is now complete with all necessary files.**








