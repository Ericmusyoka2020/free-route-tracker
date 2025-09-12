# GPS Tracker & Route Planner

A professional React web application for real-time GPS tracking and route planning with no API keys required.

![GPS Tracker Preview](https://via.placeholder.com/800x400/1f2937/3b82f6?text=GPS+Tracker+%26+Route+Planner)

## Features

### ✅ Core GPS Tracking
- **Real-time location tracking** using browser Geolocation API
- **Live moving marker** on OpenStreetMap
- **Traveled path visualization** with blue polyline
- **Continuous position updates** with high accuracy

### ✅ Speed & Distance Calculations
- **Current speed display** in km/h
- **Average speed calculation** for entire route
- **Total distance tracking** using Haversine formula
- **Real-time metrics updates**

### ✅ Route Planning & Search
- **Place search** using Nominatim API (no API key needed)
- **Route calculation** via OSRM public server
- **Planned route visualization** with purple dashed line
- **Distance and time estimates** for planned routes

### ✅ Control Features
- **Start/Stop/Pause tracking** with large mobile-friendly buttons
- **Clear route** functionality
- **Route history** with local storage
- **Load saved routes** from previous sessions

### ✅ Export Capabilities
- **GPX export** for GPS devices and mapping software
- **GeoJSON export** for web mapping applications
- **Route metadata** including timestamps and statistics
- **One-click download** with proper file formatting

### ✅ Mobile-Optimized UI
- **Responsive design** for all screen sizes
- **Dark theme optimized** for navigation use
- **Large touch-friendly controls**
- **Professional GPS interface** with real-time metrics

### ✅ Error Handling
- **Location permission management**
- **GPS signal error handling**
- **Offline capability** with cached maps
- **User-friendly error messages**

## Technology Stack

- **React 18** with TypeScript
- **Leaflet** for interactive maps
- **OpenStreetMap** tiles (no API key)
- **Nominatim API** for place search (no API key)
- **OSRM API** for route calculation (no API key)
- **Tailwind CSS** with custom GPS theme
- **Local Storage** for route persistence

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with GPS support
- HTTPS connection (required for Geolocation API)

### Quick Start

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open browser** to `http://localhost:8080`
5. **Allow location access** when prompted

### Build for Production

```bash
npm run build
```

## How to Use

### 1. Getting Started
1. Open the app in your browser
2. Grant location permissions when prompted
3. Wait for GPS to acquire your location (blue marker appears)

### 2. Basic Tracking
1. Click **"Start"** to begin GPS tracking
2. Move around to see your path drawn in blue
3. View real-time speed and distance metrics
4. Use **"Pause"** to temporarily stop tracking
5. Click **"Stop"** to end and save the route

### 3. Route Planning
1. Use the **search bar** to find destinations
2. Select a place from the search results
3. View the planned route in purple dashed line
4. See distance and estimated travel time

### 4. Managing Routes
1. Access **"History"** to view saved routes
2. Click any saved route to reload it on the map
3. Use **"Clear"** to remove current route
4. **Export** routes in GPX or GeoJSON format

### 5. Mobile Usage
- All controls are optimized for touch
- Metrics panel shows key information at a glance
- Map automatically follows your location
- Portrait and landscape orientations supported

## Browser Compatibility

### Required Features
- **Geolocation API** (all modern browsers)
- **HTTPS connection** (required for location access)
- **JavaScript enabled**
- **Local Storage** support

### Tested Browsers
- ✅ Chrome 80+ (recommended)
- ✅ Firefox 70+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Security

- **No user data** is sent to external servers
- **Routes stored locally** in browser only
- **Location data never transmitted** except to free mapping APIs
- **No tracking or analytics**
- **No API keys or accounts required**

## API Services Used

All APIs are **free and public**:

1. **OpenStreetMap** - Map tiles and base mapping data
2. **Nominatim** - Place search and geocoding
3. **OSRM** - Route calculation and directions

No registration, API keys, or rate limiting for normal usage.

## File Structure

```
src/
├── components/
│   ├── GPSTracker.tsx      # Main GPS tracking component
│   ├── GPSMap.tsx          # Custom Leaflet map wrapper
│   ├── GPSControlPanel.tsx # Control buttons and history
│   ├── GPSMetrics.tsx      # Speed/distance display
│   ├── SearchBar.tsx       # Place search functionality
│   ├── RouteExporter.tsx   # GPX/GeoJSON export
│   └── ui/                 # Reusable UI components
├── utils/
│   └── gpsUtils.ts         # GPS calculations (Haversine, etc.)
├── hooks/
│   └── use-toast.ts        # Toast notification system
└── pages/
    └── Index.tsx           # Main application page
```

## Troubleshooting

### Location Not Working
- Ensure HTTPS connection (required for GPS)
- Check browser location permissions
- Try refreshing the page
- Verify GPS is enabled on device

### Poor GPS Accuracy
- Use outdoors for better signal
- Wait for GPS to fully acquire location
- Check device location settings
- Try restarting the tracking

### Route Planning Issues
- Ensure internet connection for routing
- Try different search terms
- Check that destination is accessible by road
- Verify current location is available

### Performance Issues
- Clear browser cache and reload
- Close other browser tabs
- Check available device memory
- Try refreshing the page

## Advanced Usage

### Custom Map Styles
The app uses a dark theme optimized for navigation. You can customize colors in `src/index.css`.

### Extending Functionality
- Add new export formats in `RouteExporter.tsx`
- Modify GPS calculation accuracy in `gpsUtils.ts`
- Add new map layers in `GPSMap.tsx`

### Integration
- Export routes to popular GPS apps
- Import GPX files from other tracking devices
- Use GeoJSON exports in web mapping applications

## Support

This is a standalone application with no external dependencies on paid services. For technical issues:

1. Check browser console for errors
2. Verify all required browser features
3. Test with different browsers/devices
4. Check network connectivity

## License

This project is built using only free and open-source technologies. No proprietary APIs or paid services required.

---

**Ready to track your adventures?** Just run `npm start` and start exploring! 🗺️📍