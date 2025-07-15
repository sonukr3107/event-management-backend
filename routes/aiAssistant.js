const express = require('express');
const router = express.Router();

// Initialize OpenAI if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI API initialized successfully');
  } catch (error) {
    console.error('❌ OpenAI initialization failed:', error.message);
  }
}

// Enhanced AI Assistant with OpenAI integration
const aiResponses = {
  wedding: {
    keywords: ['wedding', 'marriage', 'shadi', 'vivah', 'bride', 'groom', 'shaadi'],
    responses: [
      "For weddings in Patna, I recommend Royal Palace Banquet on Fraser Road (₹35,000) or Diamond Marriage Garden in Danapur (₹45,000). Both offer excellent facilities for 300-800 guests with traditional setups.",
      "Wedding venues in Patna typically cost between ₹20,000-₹50,000 per day. Popular areas include Boring Road, Kankarbagh, Bailey Road, and Fraser Road with full catering and decoration services.",
      "Heritage Wedding Venue in Rajendra Nagar (₹38,000) is perfect for traditional ceremonies. They specialize in cultural weddings and can accommodate 400-900 guests with mandap setup."
    ]
  },
  hotel: {
    keywords: ['hotel', 'resort', 'accommodation', 'stay'],
    responses: [
      "Top hotels with event facilities in Patna: Hotel Maurya Patna (₹22,000), Hotel Chanakya on Boring Road (₹18,000), and Lemon Tree Hotel (₹20,000). All offer excellent banquet halls.",
      "Hotel Patliputra Continental offers great event spaces for ₹19,000 per day. The Panache Hotel in Kankarbagh is also excellent for ₹21,000 with modern amenities.",
      "For luxury hotel events, I recommend Hotel Maurya Patna near Gandhi Maidan. They have multiple halls and can accommodate 150-400 guests with premium services."
    ]
  },
  corporate: {
    keywords: ['corporate', 'business', 'meeting', 'conference', 'office', 'seminar', 'workshop'],
    responses: [
      "For corporate events, Business Hub Conference Center on Boring Road (₹12,000) is excellent with modern AV equipment for 50-200 people. Executive Meeting Hall on Fraser Road (₹10,000) is also great.",
      "Corporate venues in Patna range from ₹8,000-₹15,000 per day. Corporate Plaza in Kankarbagh (₹15,000) offers professional setups for larger conferences up to 300 people.",
      "Professional Conference Room on Bailey Road (₹8,000) is perfect for smaller meetings (25-100 people) with all modern amenities including projectors and high-speed WiFi."
    ]
  },
  general: {
    keywords: ['help', 'suggest', 'recommend', 'find', 'book', 'venue', 'location'],
    responses: [
      "I can help you find the perfect venue! What type of event are you planning? Wedding, corporate, birthday, hotel event, or something else? I have venues across Patna, Delhi, Mumbai, Kolkata, and Lucknow.",
      "Tell me about your event - how many guests, what type of function, your budget range, and preferred city? I'll suggest the best options with AI-powered recommendations.",
      "I'm here to help you discover amazing venues! We have marriage halls, hotels, corporate spaces, party venues, and cultural centers across multiple cities. What are you looking for?"
    ]
  }
};

// Enhanced chat function with OpenAI integration
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const userMessage = message.toLowerCase();
    let response = "";
    let suggestions = [];
    
    // Try OpenAI first if available
    if (openai) {
      try {
        const systemPrompt = `You are an AI assistant for EventHub, a venue booking platform in India. You help users find venues for events like weddings, corporate meetings, parties, etc. 

Available cities: Patna (Bihar), Delhi, Mumbai (Maharashtra), Kolkata (West Bengal), Lucknow (Uttar Pradesh)

Popular venues in Patna:
- Royal Palace Banquet (₹35,000) - Wedding venue on Fraser Road
- Hotel Maurya Patna (₹22,000) - Hotel with banquet facilities
- Business Hub Conference Center (₹12,000) - Corporate venue on Boring Road
- Diamond Marriage Garden (₹45,000) - Large wedding garden in Danapur

Provide helpful, specific recommendations with pricing and locations. Keep responses concise and friendly. Always mention specific venue names and prices when relevant.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        response = completion.choices[0].message.content;

        // Add relevant suggestions based on the response
        if (userMessage.includes('wedding') || userMessage.includes('marriage')) {
          suggestions = [
            { text: "Show me wedding venues in Patna", action: "search_venues", params: { type: "wedding", city: "patna" } },
            { text: "Wedding venues in Delhi", action: "search_venues", params: { type: "wedding", city: "delhi" } },
            { text: "Budget wedding venues under ₹30,000", action: "budget_filter", params: { max: 30000, type: "wedding" } }
          ];
        } else if (userMessage.includes('hotel')) {
          suggestions = [
            { text: "Hotels in Patna", action: "search_venues", params: { type: "hotel", city: "patna" } },
            { text: "Luxury hotels in Mumbai", action: "search_venues", params: { type: "hotel", city: "mumbai" } },
            { text: "Hotel banquet halls", action: "search_venues", params: { type: "hotel" } }
          ];
        } else if (userMessage.includes('corporate') || userMessage.includes('business')) {
          suggestions = [
            { text: "Corporate venues in Delhi", action: "search_venues", params: { type: "corporate", city: "delhi" } },
            { text: "Conference halls in Patna", action: "search_venues", params: { type: "corporate", city: "patna" } },
            { text: "Meeting rooms for 50 people", action: "search_venues", params: { type: "corporate", capacity: "50" } }
          ];
        } else {
          suggestions = [
            { text: "Find wedding venues", action: "search_venues", params: { type: "wedding" } },
            { text: "Corporate meeting halls", action: "search_venues", params: { type: "corporate" } },
            { text: "Hotels with event spaces", action: "search_venues", params: { type: "hotel" } }
          ];
        }

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fallback to rule-based responses
        response = getFallbackResponse(userMessage);
        suggestions = getFallbackSuggestions(userMessage);
      }
    } else {
      // Use rule-based responses if OpenAI is not available
      response = getFallbackResponse(userMessage);
      suggestions = getFallbackSuggestions(userMessage);
    }
    
    res.json({
      response,
      suggestions,
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString(),
      powered_by: openai ? 'OpenAI GPT-3.5' : 'Rule-based AI'
    });
    
  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      response: "I'm having trouble right now. Please try asking your question again!",
      powered_by: 'Error fallback'
    });
  }
});

// Fallback response function
function getFallbackResponse(userMessage) {
  for (const [category, data] of Object.entries(aiResponses)) {
    if (data.keywords.some(keyword => userMessage.includes(keyword))) {
      return data.responses[Math.floor(Math.random() * data.responses.length)];
    }
  }
  return "I can help you find the perfect venue! What type of event are you planning? Wedding, corporate, birthday, or something else? I have venues across Patna, Delhi, Mumbai, Kolkata, and Lucknow.";
}

// Fallback suggestions function
function getFallbackSuggestions(userMessage) {
  if (userMessage.includes('wedding') || userMessage.includes('marriage')) {
    return [
      { text: "Wedding venues in Patna", action: "search_venues", params: { type: "wedding", city: "patna" } },
      { text: "Marriage halls in Delhi", action: "search_venues", params: { type: "marriage_hall", city: "delhi" } },
      { text: "Budget wedding venues", action: "budget_filter", params: { max: 30000, type: "wedding" } }
    ];
  } else if (userMessage.includes('hotel')) {
    return [
      { text: "Hotels in Patna", action: "search_venues", params: { type: "hotel", city: "patna" } },
      { text: "Luxury hotels in Mumbai", action: "search_venues", params: { type: "hotel", city: "mumbai" } },
      { text: "Hotel banquet halls", action: "search_venues", params: { type: "hotel" } }
    ];
  } else if (userMessage.includes('corporate')) {
    return [
      { text: "Corporate venues", action: "search_venues", params: { type: "corporate" } },
      { text: "Conference halls", action: "search_venues", params: { type: "corporate" } },
      { text: "Meeting rooms", action: "search_venues", params: { type: "corporate" } }
    ];
  }
  
  return [
    { text: "Find wedding venues", action: "search_venues", params: { type: "wedding" } },
    { text: "Corporate meeting halls", action: "search_venues", params: { type: "corporate" } },
    { text: "Hotels with events", action: "search_venues", params: { type: "hotel" } }
  ];
}

// Get AI recommendations with OpenAI enhancement
router.post('/recommendations', async (req, res) => {
  try {
    const { eventType, guestCount, budget, preferences } = req.body;
    
    let recommendations = [];
    
    // Try OpenAI for enhanced recommendations
    if (openai) {
      try {
        const prompt = `Recommend 3 venues for a ${eventType} event with ${guestCount} guests and budget around ₹${budget} in ${preferences?.location || 'Patna'}. 

Available venues:
- Royal Palace Banquet (₹35,000) - Wedding venue, 300-800 capacity
- Hotel Maurya Patna (₹22,000) - Hotel banquet, 150-400 capacity  
- Business Hub Conference Center (₹12,000) - Corporate venue, 50-200 capacity
- Diamond Marriage Garden (₹45,000) - Wedding garden, 500-1000 capacity
- Corporate Plaza (₹15,000) - Corporate venue, 100-300 capacity

Format as JSON array with venue, reason, match percentage, area, capacity, price, rating.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        });

        try {
          const aiRecommendations = JSON.parse(completion.choices[0].message.content);
          recommendations = aiRecommendations;
        } catch (parseError) {
          // Fallback to rule-based if JSON parsing fails
          recommendations = getFallbackRecommendations(eventType, guestCount, budget);
        }

      } catch (openaiError) {
        console.error('OpenAI recommendations error:', openaiError);
        recommendations = getFallbackRecommendations(eventType, guestCount, budget);
      }
    } else {
      recommendations = getFallbackRecommendations(eventType, guestCount, budget);
    }
    
    // Filter by budget and capacity
    if (budget) {
      recommendations = recommendations.filter(rec => {
        const price = typeof rec.price === 'string' ? 
          parseInt(rec.price.replace(/[₹,]/g, '')) : rec.price;
        return price <= budget;
      });
    }
    
    if (guestCount) {
      recommendations = recommendations.filter(rec => {
        if (typeof rec.capacity === 'string' && rec.capacity.includes('-')) {
          const [min, max] = rec.capacity.split('-').map(c => parseInt(c));
          return guestCount >= min && guestCount <= max;
        }
        return true;
      });
    }
    
    res.json({
      recommendations,
      totalFound: recommendations.length,
      criteria: { eventType, guestCount, budget },
      message: recommendations.length > 0 ? 
        `Found ${recommendations.length} AI-powered recommendations for your ${eventType} event` :
        'No venues match your criteria. Try adjusting your requirements.',
      powered_by: openai ? 'OpenAI GPT-3.5' : 'Rule-based AI'
    });
    
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      error: 'Error generating recommendations',
      recommendations: [],
      totalFound: 0
    });
  }
});

// Fallback recommendations function
function getFallbackRecommendations(eventType, guestCount, budget) {
  if (eventType === 'wedding' || eventType === 'marriage') {
    return [
      {
        venue: "Royal Palace Banquet",
        reason: "Perfect for weddings with excellent catering and traditional decoration services",
        match: 95,
        area: "Fraser Road",
        capacity: "300-800",
        price: 35000,
        rating: 4.7,
        amenities: ["AC", "Catering", "Decoration", "Parking"]
      },
      {
        venue: "Diamond Marriage Garden",
        reason: "Large outdoor space ideal for traditional ceremonies with garden setting",
        match: 92,
        area: "Danapur",
        capacity: "500-1000",
        price: 45000,
        rating: 4.6,
        amenities: ["Garden", "Mandap Setup", "Catering Kitchen", "Guest Rooms"]
      }
    ];
  } else if (eventType === 'corporate' || eventType === 'business') {
    return [
      {
        venue: "Business Hub Conference Center",
        reason: "Modern facilities with latest AV equipment and professional setup",
        match: 94,
        area: "Boring Road",
        capacity: "50-200",
        price: 12000,
        rating: 4.6,
        amenities: ["Projector", "WiFi", "AC", "Coffee Service"]
      },
      {
        venue: "Corporate Plaza",
        reason: "Large conference facility perfect for seminars and workshops",
        match: 90,
        area: "Kankarbagh",
        capacity: "100-300",
        price: 15000,
        rating: 4.5,
        amenities: ["Multiple Halls", "Parking", "Catering"]
      }
    ];
  } else if (eventType === 'hotel') {
    return [
      {
        venue: "Hotel Maurya Patna",
        reason: "Premium hotel with excellent banquet facilities and luxury services",
        match: 93,
        area: "South Gandhi Maidan",
        capacity: "150-400",
        price: 22000,
        rating: 4.6,
        amenities: ["Luxury Setup", "Premium Catering", "Valet Parking"]
      }
    ];
  }
  
  return [
    {
      venue: "Royal Palace Banquet",
      reason: "Versatile venue suitable for all types of events",
      match: 90,
      area: "Fraser Road",
      capacity: "300-800",
      price: 35000,
      rating: 4.7,
      amenities: ["AC", "Catering", "Sound System", "Parking"]
    }
  ];
}

module.exports = router;