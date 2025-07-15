const express = require('express');
const router = express.Router();

// Enhanced locations data with multiple cities
const locationsData = {
  patna: [
    // Marriage Halls in Patna
    { name: 'Shree Ganesh Marriage Hall', type: 'marriage_hall', area: 'Boring Road', capacity: '200-500', rating: 4.5, price: 25000, city: 'Patna', state: 'Bihar' },
    { name: 'Royal Palace Banquet', type: 'marriage_hall', area: 'Fraser Road', capacity: '300-800', rating: 4.7, price: 35000, city: 'Patna', state: 'Bihar' },
    { name: 'Grand Celebration Hall', type: 'marriage_hall', area: 'Kankarbagh', capacity: '150-400', rating: 4.3, price: 20000, city: 'Patna', state: 'Bihar' },
    { name: 'Diamond Marriage Garden', type: 'marriage_hall', area: 'Danapur', capacity: '500-1000', rating: 4.6, price: 45000, city: 'Patna', state: 'Bihar' },
    { name: 'Golden Palace Wedding Hall', type: 'marriage_hall', area: 'Patliputra', capacity: '200-600', rating: 4.4, price: 30000, city: 'Patna', state: 'Bihar' },
    { name: 'Maharaja Banquet Hall', type: 'marriage_hall', area: 'Bailey Road', capacity: '300-700', rating: 4.8, price: 40000, city: 'Patna', state: 'Bihar' },
    { name: 'Crystal Palace Marriage Hall', type: 'marriage_hall', area: 'Ashok Rajpath', capacity: '250-550', rating: 4.2, price: 28000, city: 'Patna', state: 'Bihar' },
    { name: 'Heritage Wedding Venue', type: 'marriage_hall', area: 'Rajendra Nagar', capacity: '400-900', rating: 4.5, price: 38000, city: 'Patna', state: 'Bihar' },
    
    // Hotels in Patna
    { name: 'Hotel Chanakya', type: 'hotel', area: 'Boring Road', capacity: '100-300', rating: 4.4, price: 18000, city: 'Patna', state: 'Bihar' },
    { name: 'Hotel Maurya Patna', type: 'hotel', area: 'South Gandhi Maidan', capacity: '150-400', rating: 4.6, price: 22000, city: 'Patna', state: 'Bihar' },
    { name: 'Lemon Tree Hotel', type: 'hotel', area: 'Dak Bungalow Road', capacity: '80-250', rating: 4.3, price: 20000, city: 'Patna', state: 'Bihar' },
    { name: 'Hotel Patliputra Continental', type: 'hotel', area: 'Patliputra', capacity: '120-350', rating: 4.2, price: 19000, city: 'Patna', state: 'Bihar' },
    { name: 'The Panache Hotel', type: 'hotel', area: 'Kankarbagh', capacity: '100-300', rating: 4.5, price: 21000, city: 'Patna', state: 'Bihar' },
    { name: 'Gargee Grand Hotel', type: 'hotel', area: 'Fraser Road', capacity: '90-280', rating: 4.3, price: 17000, city: 'Patna', state: 'Bihar' },
    { name: 'Hotel Windsor', type: 'hotel', area: 'Bailey Road', capacity: '110-320', rating: 4.4, price: 19500, city: 'Patna', state: 'Bihar' },
    
    // Corporate Venues in Patna
    { name: 'Business Hub Conference Center', type: 'corporate', area: 'Boring Road', capacity: '50-200', rating: 4.6, price: 12000, city: 'Patna', state: 'Bihar' },
    { name: 'Executive Meeting Hall', type: 'corporate', area: 'Fraser Road', capacity: '30-150', rating: 4.4, price: 10000, city: 'Patna', state: 'Bihar' },
    { name: 'Corporate Plaza', type: 'corporate', area: 'Kankarbagh', capacity: '100-300', rating: 4.5, price: 15000, city: 'Patna', state: 'Bihar' },
    { name: 'Professional Conference Room', type: 'corporate', area: 'Bailey Road', capacity: '25-100', rating: 4.3, price: 8000, city: 'Patna', state: 'Bihar' }
  ],
  
  delhi: [
    // Marriage Halls in Delhi
    { name: 'Ashoka Hotel Banquet', type: 'marriage_hall', area: 'Chanakyapuri', capacity: '400-1000', rating: 4.8, price: 80000, city: 'Delhi', state: 'Delhi' },
    { name: 'The Imperial Wedding Hall', type: 'marriage_hall', area: 'Connaught Place', capacity: '300-800', rating: 4.9, price: 120000, city: 'Delhi', state: 'Delhi' },
    { name: 'Radisson Blu Plaza', type: 'marriage_hall', area: 'Mahipalpur', capacity: '500-1200', rating: 4.7, price: 95000, city: 'Delhi', state: 'Delhi' },
    { name: 'Grand Ballroom Delhi', type: 'marriage_hall', area: 'Karol Bagh', capacity: '250-600', rating: 4.5, price: 65000, city: 'Delhi', state: 'Delhi' },
    { name: 'Royal Garden Banquet', type: 'marriage_hall', area: 'Rohini', capacity: '300-700', rating: 4.4, price: 55000, city: 'Delhi', state: 'Delhi' },
    { name: 'Crystal Palace Delhi', type: 'marriage_hall', area: 'Dwarka', capacity: '400-900', rating: 4.6, price: 70000, city: 'Delhi', state: 'Delhi' },
    
    // Hotels in Delhi
    { name: 'The Taj Mahal Hotel', type: 'hotel', area: 'Mansingh Road', capacity: '200-500', rating: 4.9, price: 150000, city: 'Delhi', state: 'Delhi' },
    { name: 'The Oberoi Delhi', type: 'hotel', area: 'Golf Links', capacity: '150-400', rating: 4.8, price: 130000, city: 'Delhi', state: 'Delhi' },
    { name: 'ITC Maurya', type: 'hotel', area: 'Chanakyapuri', capacity: '300-800', rating: 4.7, price: 110000, city: 'Delhi', state: 'Delhi' },
    { name: 'Hyatt Regency Delhi', type: 'hotel', area: 'Bhikaji Cama Place', capacity: '250-600', rating: 4.6, price: 85000, city: 'Delhi', state: 'Delhi' },
    { name: 'Radisson Blu Hotel', type: 'hotel', area: 'Paschim Vihar', capacity: '180-450', rating: 4.5, price: 75000, city: 'Delhi', state: 'Delhi' },
    
    // Corporate Venues in Delhi
    { name: 'India Habitat Centre', type: 'corporate', area: 'Lodhi Road', capacity: '100-500', rating: 4.8, price: 45000, city: 'Delhi', state: 'Delhi' },
    { name: 'FICCI Auditorium', type: 'corporate', area: 'Tansen Marg', capacity: '200-800', rating: 4.7, price: 60000, city: 'Delhi', state: 'Delhi' },
    { name: 'CII Convention Centre', type: 'corporate', area: 'Qutub Institutional Area', capacity: '150-600', rating: 4.6, price: 50000, city: 'Delhi', state: 'Delhi' }
  ],
  
  mumbai: [
    // Marriage Halls in Mumbai
    { name: 'The Taj Palace Mumbai', type: 'marriage_hall', area: 'Colaba', capacity: '300-800', rating: 4.9, price: 200000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Grand Hyatt Mumbai', type: 'marriage_hall', area: 'Santacruz East', capacity: '400-1000', rating: 4.8, price: 180000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'ITC Grand Central', type: 'marriage_hall', area: 'Parel', capacity: '250-600', rating: 4.7, price: 150000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Sahara Star Hotel', type: 'marriage_hall', area: 'Vile Parle East', capacity: '500-1200', rating: 4.6, price: 160000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Royal Palms Resort', type: 'marriage_hall', area: 'Goregaon East', capacity: '300-700', rating: 4.5, price: 120000, city: 'Mumbai', state: 'Maharashtra' },
    
    // Hotels in Mumbai
    { name: 'The Oberoi Mumbai', type: 'hotel', area: 'Nariman Point', capacity: '200-500', rating: 4.9, price: 220000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Trident Nariman Point', type: 'hotel', area: 'Nariman Point', capacity: '150-400', rating: 4.7, price: 180000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'JW Marriott Mumbai', type: 'hotel', area: 'Juhu', capacity: '300-800', rating: 4.8, price: 200000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Novotel Mumbai', type: 'hotel', area: 'Juhu Beach', capacity: '250-600', rating: 4.6, price: 140000, city: 'Mumbai', state: 'Maharashtra' },
    
    // Corporate Venues in Mumbai
    { name: 'Bombay Exhibition Centre', type: 'corporate', area: 'Goregaon East', capacity: '500-2000', rating: 4.7, price: 80000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'World Trade Centre', type: 'corporate', area: 'Cuffe Parade', capacity: '200-800', rating: 4.8, price: 100000, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'NSCI Convention Centre', type: 'corporate', area: 'Worli', capacity: '300-1000', rating: 4.6, price: 75000, city: 'Mumbai', state: 'Maharashtra' }
  ],
  
  kolkata: [
    // Marriage Halls in Kolkata
    { name: 'ITC Sonar Kolkata', type: 'marriage_hall', area: 'Salt Lake', capacity: '400-1000', rating: 4.8, price: 120000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'The Oberoi Grand', type: 'marriage_hall', area: 'Chowringhee', capacity: '300-700', rating: 4.9, price: 150000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Hyatt Regency Kolkata', type: 'marriage_hall', area: 'Salt Lake', capacity: '250-600', rating: 4.7, price: 100000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Taj Bengal Kolkata', type: 'marriage_hall', area: 'Alipore', capacity: '350-800', rating: 4.8, price: 140000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Golden Tulip Kolkata', type: 'marriage_hall', area: 'Rajarhat', capacity: '200-500', rating: 4.5, price: 80000, city: 'Kolkata', state: 'West Bengal' },
    
    // Hotels in Kolkata
    { name: 'The Park Kolkata', type: 'hotel', area: 'Park Street', capacity: '150-400', rating: 4.7, price: 90000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'JW Marriott Kolkata', type: 'hotel', area: 'New Town', capacity: '200-500', rating: 4.8, price: 110000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Swissotel Kolkata', type: 'hotel', area: 'Rajarhat', capacity: '180-450', rating: 4.6, price: 85000, city: 'Kolkata', state: 'West Bengal' },
    
    // Corporate Venues in Kolkata
    { name: 'Science City Auditorium', type: 'corporate', area: 'Salt Lake', capacity: '300-1000', rating: 4.6, price: 40000, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Biswa Bangla Convention Centre', type: 'corporate', area: 'New Town', capacity: '500-1500', rating: 4.7, price: 60000, city: 'Kolkata', state: 'West Bengal' }
  ],
  
  lucknow: [
    // Marriage Halls in Lucknow (Uttar Pradesh)
    { name: 'Taj Mahal Lucknow', type: 'marriage_hall', area: 'Hazratganj', capacity: '300-700', rating: 4.7, price: 85000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Hyatt Regency Lucknow', type: 'marriage_hall', area: 'Gomti Nagar', capacity: '250-600', rating: 4.6, price: 75000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Royal Heritage Banquet', type: 'marriage_hall', area: 'Aliganj', capacity: '400-900', rating: 4.5, price: 65000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Grand Ballroom Lucknow', type: 'marriage_hall', area: 'Indira Nagar', capacity: '200-500', rating: 4.4, price: 55000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Crystal Palace Lucknow', type: 'marriage_hall', area: 'Mahanagar', capacity: '350-800', rating: 4.6, price: 70000, city: 'Lucknow', state: 'Uttar Pradesh' },
    
    // Hotels in Lucknow
    { name: 'Clarks Avadh Hotel', type: 'hotel', area: 'MG Road', capacity: '150-400', rating: 4.5, price: 45000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Renaissance Lucknow', type: 'hotel', area: 'Gomti Nagar', capacity: '200-500', rating: 4.7, price: 60000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Lemon Tree Lucknow', type: 'hotel', area: 'Sector 6 Vikas Nagar', capacity: '120-350', rating: 4.4, price: 40000, city: 'Lucknow', state: 'Uttar Pradesh' },
    
    // Corporate Venues in Lucknow
    { name: 'Indira Gandhi Pratishthan', type: 'corporate', area: 'Gomti Nagar', capacity: '200-800', rating: 4.6, price: 35000, city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Sahara Ganj Convention', type: 'corporate', area: 'Hazratganj', capacity: '150-600', rating: 4.5, price: 30000, city: 'Lucknow', state: 'Uttar Pradesh' }
  ]
};

// Get all locations for a city
const getAllLocations = () => {
  const allLocations = [];
  Object.keys(locationsData).forEach(city => {
    allLocations.push(...locationsData[city]);
  });
  return allLocations;
};

// Enhanced search with city and venue type filtering
router.get('/search', (req, res) => {
  try {
    const { query, type, area, capacity, city } = req.query;
    
    let filteredLocations = getAllLocations();
    
    // Filter by city first
    if (city) {
      const cityLower = city.toLowerCase();
      filteredLocations = filteredLocations.filter(location => 
        location.city.toLowerCase().includes(cityLower)
      );
    }
    
    // Enhanced search query matching
    if (query) {
      const searchTerm = query.toLowerCase();
      
      // Check if query contains city name
      const cityNames = ['patna', 'delhi', 'mumbai', 'kolkata', 'lucknow'];
      const queriedCity = cityNames.find(city => searchTerm.includes(city));
      
      if (queriedCity) {
        // Filter by city
        filteredLocations = filteredLocations.filter(location => 
          location.city.toLowerCase() === queriedCity
        );
        
        // Check for venue type in the same query
        if (searchTerm.includes('marriage') || searchTerm.includes('wedding')) {
          filteredLocations = filteredLocations.filter(location => 
            location.type === 'marriage_hall'
          );
        } else if (searchTerm.includes('hotel')) {
          filteredLocations = filteredLocations.filter(location => 
            location.type === 'hotel'
          );
        } else if (searchTerm.includes('corporate')) {
          filteredLocations = filteredLocations.filter(location => 
            location.type === 'corporate'
          );
        }
      } else {
        // Regular search filtering
        filteredLocations = filteredLocations.filter(location => {
          return (
            location.name.toLowerCase().includes(searchTerm) ||
            location.area.toLowerCase().includes(searchTerm) ||
            location.type.toLowerCase().includes(searchTerm) ||
            location.city.toLowerCase().includes(searchTerm) ||
            // Additional keyword matching
            (searchTerm.includes('hotel') && location.type === 'hotel') ||
            (searchTerm.includes('marriage') && location.type === 'marriage_hall') ||
            (searchTerm.includes('wedding') && location.type === 'marriage_hall') ||
            (searchTerm.includes('corporate') && location.type === 'corporate') ||
            (searchTerm.includes('hall') && location.name.toLowerCase().includes('hall'))
          );
        });
      }
    }
    
    // Filter by specific area
    if (area) {
      filteredLocations = filteredLocations.filter(location => 
        location.area.toLowerCase().includes(area.toLowerCase())
      );
    }
    
    // Filter by type
    if (type && type !== 'all') {
      filteredLocations = filteredLocations.filter(location => 
        location.type === type
      );
    }
    
    // Filter by capacity
    if (capacity) {
      const capacityNum = parseInt(capacity);
      filteredLocations = filteredLocations.filter(location => {
        const [min, max] = location.capacity.split('-').map(c => parseInt(c));
        return capacityNum >= min && capacityNum <= max;
      });
    }
    
    // Sort by rating (highest first)
    filteredLocations.sort((a, b) => b.rating - a.rating);
    
    // Add additional properties for frontend
    const enhancedLocations = filteredLocations.map(location => ({
      ...location,
      id: Math.random().toString(36).substr(2, 9),
      address: `${location.name}, ${location.area}, ${location.city}, ${location.state}`,
      image: `https://images.pexels.com/photos/${1181406 + Math.floor(Math.random() * 100)}/pexels-photo-${1181406 + Math.floor(Math.random() * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      amenities: ['AC', 'Parking', 'Catering', 'Sound System'],
      availability: true
    }));
    
    res.json({
      success: true,
      count: enhancedLocations.length,
      locations: enhancedLocations,
      query: query || '',
      message: enhancedLocations.length > 0 ? 
        `Found ${enhancedLocations.length} venues` : 
        'No venues found for your search'
    });
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching locations',
      locations: [],
      count: 0
    });
  }
});

// Get location suggestions with better city and venue type matching
router.get('/suggestions', (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const searchTerm = query.toLowerCase();
    const suggestions = [];
    const allLocations = getAllLocations();
    
    // Add city suggestions
    const cities = ['Patna', 'Delhi', 'Mumbai', 'Kolkata', 'Lucknow'];
    cities.forEach(city => {
      if (city.toLowerCase().includes(searchTerm)) {
        const cityLocations = allLocations.filter(loc => loc.city === city);
        suggestions.push({
          type: 'city',
          text: city,
          subtitle: `${cityLocations.length} venues available`
        });
      }
    });
    
    // Add venue name suggestions
    allLocations.forEach(location => {
      if (location.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'venue',
          text: location.name,
          subtitle: `${location.area}, ${location.city} • ₹${location.price.toLocaleString()}`
        });
      }
    });
    
    // Add area suggestions
    const areas = [...new Set(allLocations.map(loc => `${loc.area}, ${loc.city}`))];
    areas.forEach(area => {
      if (area.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'area',
          text: area,
          subtitle: 'Area'
        });
      }
    });
    
    // Add venue type suggestions
    const typeMapping = {
      'hotel': 'Hotels',
      'marriage_hall': 'Marriage Halls',
      'corporate': 'Corporate Venues'
    };
    
    Object.entries(typeMapping).forEach(([key, label]) => {
      if (label.toLowerCase().includes(searchTerm) || key.includes(searchTerm)) {
        const count = allLocations.filter(loc => loc.type === key).length;
        suggestions.push({
          type: 'venue_type',
          text: label,
          subtitle: `${count} venues available`
        });
      }
    });
    
    res.json({
      suggestions: suggestions.slice(0, 8) // Limit to 8 suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ suggestions: [] });
  }
});

// Get popular locations across all cities
router.get('/popular', (req, res) => {
  try {
    const allLocations = getAllLocations();
    const popularLocations = allLocations
      .filter(loc => loc.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12)
      .map(location => ({
        ...location,
        id: Math.random().toString(36).substr(2, 9),
        address: `${location.name}, ${location.area}, ${location.city}, ${location.state}`,
        image: `https://images.pexels.com/photos/${1181406 + Math.floor(Math.random() * 100)}/pexels-photo-${1181406 + Math.floor(Math.random() * 100)}.jpeg?auto=compress&cs=tinysrgb&w=400`
      }));
    
    res.json({
      success: true,
      locations: popularLocations
    });
  } catch (error) {
    console.error('Popular locations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching popular locations' 
    });
  }
});

module.exports = router;