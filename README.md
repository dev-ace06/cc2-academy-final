# CC2 Academy Stats

A modern responsive website for managing and displaying stats of 2 Clash of Clans clans. Built with React, Node.js, and integrated with the official Clash of Clans API.

## Features

### 🏰 Clan Overview
- Side-by-side comparison of both clans
- Real-time clan statistics (level, trophies, members, etc.)
- Clan badges and detailed information
- Auto-refresh capabilities

### 👥 Member Management
- Searchable and sortable member table
- Advanced filtering by clan, role, and town hall level
- Real-time member statistics
- Auto-refresh every 30 seconds (optional)
- Member search with suggestions

### 🏆 CWL & Promotion/Demotion Tables
- Auto-populated from Clash of Clans API
- Inspector role for editing custom points and remarks
- Bulk update capabilities
- Promotion/demotion tracking
- Season-based organization

### 🔐 User Authentication
- Email-based registration and login
- Role-based access control (Leader, Co-Leader, Elder, Member, Inspector)
- Special Inspector login (inspector/inspector911)
- JWT-based authentication
- Protected routes

### 📅 Events & Media
- War schedule and CWL information
- Event history tracking
- Media gallery for clan achievements
- Upload and share capabilities

### 🎨 Modern UI/UX
- Clash of Clans inspired design
- Dark mode support
- Fully responsive design
- Gaming dashboard aesthetic
- Smooth animations and transitions

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Axios** - HTTP client for API calls

### External APIs
- **Clash of Clans Official API** - Clan and member data

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Clash of Clans API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cc2-academy-stats
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup

#### Server Environment
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cc2-academy-stats

# JWT Secret
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

#### Getting Clash of Clans API Key
1. Visit [Clash of Clans API](https://developer.clashofclans.com)
2. Create an account and request an API key
3. Replace `your-clash-of-clans-api-key-here` with your actual API key
4. Replace clan tags with your actual clan tags (include the # symbol)

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (if installed locally)
mongod
```

### 5. Run the Application

#### Development Mode (Recommended)
```bash
# Run both server and client concurrently
npm run dev
```

#### Manual Setup
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Usage

### First Time Setup
1. **Register an Account**: Create your account with email and clan information
2. **Sync Clan Data**: Use the "Sync Data" button to fetch latest clan information
3. **Inspector Access**: Use `inspector/inspector911` for CWL table management

### Key Features Usage

#### Clan Overview
- View side-by-side comparison of both clans
- Click "Sync Data" to update clan information
- Compare statistics and performance metrics

#### Member Management
- Use search to find specific members
- Apply filters by clan, role, or town hall level
- Sort by any column (trophies, donations, etc.)
- Enable auto-refresh for real-time updates

#### CWL Management (Inspector Only)
- Login with inspector credentials
- Edit member points and ranks
- Add custom remarks
- Mark promotions/demotions
- Bulk update multiple records

#### Events & Media
- View upcoming wars and CWL schedules
- Check event history
- Upload and share clan achievements
- Browse media gallery

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/inspector-login` - Inspector login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Clans
- `GET /api/clans` - Get all clans
- `GET /api/clans/overview` - Get clan overview
- `POST /api/clans/sync` - Sync clan data
- `GET /api/clans/:tag` - Get specific clan
- `GET /api/clans/:tag/members` - Get clan members

### Members
- `GET /api/members` - Get all members with filters
- `GET /api/members/stats` - Get member statistics
- `GET /api/members/top` - Get top members
- `GET /api/members/:tag` - Get specific member

### CWL Records
- `GET /api/cwl/records` - Get CWL records
- `POST /api/cwl/records` - Create CWL record (Inspector)
- `PUT /api/cwl/records/:id` - Update CWL record (Inspector)
- `DELETE /api/cwl/records/:id` - Delete CWL record (Inspector)

### Events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/war-schedule` - Get war schedule
- `GET /api/events/cwl-schedule` - Get CWL schedule
- `GET /api/events/history` - Get event history

## Customization

### Adding New Features
1. **Backend**: Add routes in `server/routes/`
2. **Frontend**: Add pages in `client/src/pages/`
3. **Database**: Create models in `server/models/`

### Styling
- Modify `client/tailwind.config.js` for theme customization
- Update `client/src/index.css` for global styles
- Use TailwindCSS classes for component styling

### Clan Configuration
- Update clan tags in environment variables
- Modify clan comparison logic in `client/src/pages/Clans.js`
- Adjust member filtering in `client/src/pages/Members.js`

## Deployment

### Production Build
```bash
# Build the client
npm run build

# Start production server
cd server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Set secure JWT secret
- Configure CORS for your domain

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, DigitalOcean, or AWS EC2
- **Database**: MongoDB Atlas

## Troubleshooting

### Common Issues

#### API Key Issues
- Ensure your Clash of Clans API key is valid
- Check if the API key has proper permissions
- Verify clan tags are correctly formatted

#### Database Connection
- Ensure MongoDB is running
- Check connection string in environment variables
- Verify database permissions

#### CORS Issues
- Update CORS configuration in `server/index.js`
- Ensure frontend URL is whitelisted

#### Build Issues
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## Acknowledgments

- Clash of Clans API for providing the data
- TailwindCSS for the styling framework
- React community for excellent documentation
- All contributors and testers

---

**Happy Clashing! 🏰⚔️**








