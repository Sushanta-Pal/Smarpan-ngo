# SAMARPAN NGO - React Website

A modern, fully-featured React website for SAMARPAN NGO with beautiful animations, responsive design, and Supabase integration.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS and Framer Motion animations
- **Responsive Design** - Works seamlessly on all devices
- **React Router** - Multi-page routing
- **Supabase Integration** - Real-time database and file storage
- **SEO Friendly** - Optimized structure and metadata
- **Performance** - Vite for fast builds and development

## 📦 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🛠️ Installation

### Prerequisites

- Node.js 16+ and npm/yarn installed
- A Supabase account (free at [supabase.com](https://supabase.com))

### Setup Steps

1. **Clone/Extract the project**

   ```bash
   cd samarpan-ngo-react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Update `.env.local` with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Create Supabase Tables** (if not already created)
   - `events` - Store event information
   - `gallery` - Store gallery images metadata
   - `team_members` - Store team member details
   - `alumni` - Store alumni success stories
   - `contact_submissions` - Store contact form submissions

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   The site will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── animated/        # Reusable animated components
│   │   └── index.js     # Hero, Card, Section components
│   └── shared/
│       ├── Navbar.jsx   # Navigation component
│       └── Footer.jsx   # Footer component
├── pages/
│   ├── Home.jsx         # Homepage
│   ├── About.jsx        # About page
│   ├── Events.jsx       # Events listing
│   ├── Gallery.jsx      # Photo gallery with lightbox
│   ├── Team.jsx         # Team members showcase
│   ├── Alumni.jsx       # Alumni success stories
│   ├── Contact.jsx      # Contact form
│   └── Donate.jsx       # Donation page
├── lib/
│   ├── supabase.js      # Supabase client & API functions
│   └── hooks.js         # Custom React hooks
├── App.jsx              # Root component with routing
└── main.jsx             # Entry point
```

## 🎨 Pages Overview

### 1. **Home**

- Hero section with mission statement
- Feature highlights
- Impact statistics
- Featured events carousel

### 2. **About**

- Organization story
- Core values
- Journey timeline with milestones

### 3. **Events**

- Filterable events listing
- Event details with dates and locations
- Newsletter subscription

### 4. **Gallery**

- Photo gallery with category filters
- Lightbox modal for full-size viewing

### 5. **Team**

- Team member profiles with roles
- Social media links
- Team testimonials

### 6. **Alumni**

- Alumni success stories
- Career achievements
- Alumni network statistics
- Alumni programs

### 7. **Contact**

- Contact form with validation
- Contact information
- FAQ section

### 8. **Donate**

- Flexible donation options
- Preset and custom amounts
- Fund allocation breakdown
- Impact stories

## 🔧 Customization

### Colors

Edit Tailwind colors in `tailwind.config.js` or modify color classes in components.

### Content

- Update text in page components
- Modify mockData in components for testing without database

### Animations

- Adjust animation duration/delay in components
- Modify Framer Motion variants in `src/components/animated/index.js`

## 📡 Supabase Integration

### Database Functions

- `fetchEvents()` - Get all events
- `fetchGalleryImages()` - Get gallery images
- `fetchTeamMembers()` - Get team members
- `fetchAlumni()` - Get alumni
- `submitContactForm(formData)` - Submit contact form
- `uploadImage(bucket, file, path)` - Upload images
- `getImageUrl(bucket, path)` - Get public image URL

### Custom Hooks

- `useEvents()` - Events data with loading state
- `useGallery()` - Gallery images with loading state
- `useTeamMembers()` - Team members with loading state
- `useAlumni()` - Alumni with loading state

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Deploy Options

- **Vercel** (Recommended)
  ```bash
  npm install -g vercel
  vercel
  ```
- **Netlify** - Connect GitHub repo to Netlify
- **GitHub Pages** - Configure in `vite.config.js`
- **Traditional Hosting** - Use the `dist` folder

## 📝 Environment Variables

Create `.env.local` with:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🐛 Troubleshooting

### Dependencies not installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use

```bash
npm run dev -- --port 3000
```

### Supabase connection issues

- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure RLS (Row Level Security) allows reads

## 📚 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase Docs](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:

1. Check existing documentation
2. Review component props and usage
3. Consult the resource links above
4. Contact the development team

---

Built with ❤️ for SAMARPAN NGO
