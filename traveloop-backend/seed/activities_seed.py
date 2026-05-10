from sqlalchemy.orm import Session
from models.activity import Activity
from models.city import City

ACTIVITIES = [
    # Paris (1)
    (1, "Eiffel Tower Visit", "SIGHTSEEING", 25, 3, "Iconic iron lattice tower"),
    (1, "Louvre Museum", "CULTURE", 17, 4, "World's largest art museum"),
    (1, "Seine River Cruise", "SIGHTSEEING", 15, 1.5, "Scenic boat ride"),
    (1, "Croissant Tasting Tour", "FOOD", 40, 3, "Best bakeries in Paris"),
    (1, "Montmartre Walk", "SIGHTSEEING", 0, 2, "Artistic hilltop neighborhood"),
    (1, "Palace of Versailles", "CULTURE", 20, 5, "Royal palace day trip"),
    # Tokyo (2)
    (2, "Senso-ji Temple", "CULTURE", 0, 2, "Ancient Buddhist temple in Asakusa"),
    (2, "Tsukiji Outer Market", "FOOD", 30, 3, "Fresh sushi and street food"),
    (2, "Shibuya Crossing Experience", "SIGHTSEEING", 0, 1, "World's busiest pedestrian crossing"),
    (2, "Robot Restaurant Show", "NIGHTLIFE", 80, 2, "Wild robot cabaret show"),
    (2, "Mount Fuji Day Trip", "NATURE", 50, 8, "Iconic volcanic mountain"),
    (2, "Akihabara Electronics Tour", "SHOPPING", 0, 3, "Tech and anime district"),
    # New York (3)
    (3, "Statue of Liberty", "SIGHTSEEING", 24, 4, "Iconic symbol of freedom"),
    (3, "Central Park Bike Tour", "NATURE", 15, 3, "Cycling through Manhattan's park"),
    (3, "Broadway Show", "CULTURE", 120, 3, "World-class theater"),
    (3, "Brooklyn Bridge Walk", "SIGHTSEEING", 0, 1.5, "Iconic bridge walk with skyline views"),
    (3, "Top of the Rock", "SIGHTSEEING", 40, 1.5, "Panoramic NYC views"),
    (3, "Pizza Tour Little Italy", "FOOD", 45, 3, "Best NYC pizza spots"),
    # London (4)
    (4, "Tower of London", "CULTURE", 30, 3, "Historic castle and fortress"),
    (4, "British Museum", "CULTURE", 0, 4, "World-class free museum"),
    (4, "London Eye", "SIGHTSEEING", 35, 1, "Giant Ferris wheel on the Thames"),
    (4, "Camden Market Food Tour", "FOOD", 25, 3, "Eclectic street food market"),
    (4, "Harry Potter Studio Tour", "CULTURE", 55, 4, "Behind-the-scenes movie magic"),
    # Dubai (5)
    (5, "Burj Khalifa Observation", "SIGHTSEEING", 40, 2, "World's tallest building"),
    (5, "Desert Safari", "ADVENTURE", 60, 6, "Dune bashing and camel rides"),
    (5, "Dubai Mall & Fountain Show", "SHOPPING", 0, 3, "World's largest mall"),
    (5, "Dhow Cruise Dinner", "FOOD", 55, 3, "Traditional boat dinner cruise"),
    # Bali (6)
    (6, "Ubud Rice Terraces", "NATURE", 5, 3, "Stunning green terraces"),
    (6, "Temple Tour", "CULTURE", 10, 4, "Ancient Hindu temples"),
    (6, "Surfing in Kuta", "ADVENTURE", 25, 3, "Beginner-friendly waves"),
    (6, "Balinese Cooking Class", "FOOD", 35, 4, "Traditional cuisine workshop"),
    (6, "Sunrise Mt Batur Trek", "ADVENTURE", 45, 6, "Volcanic sunrise hike"),
    # Rome (7)
    (7, "Colosseum Tour", "CULTURE", 18, 3, "Ancient Roman amphitheater"),
    (7, "Vatican Museums", "CULTURE", 20, 4, "Sistine Chapel and St Peter's"),
    (7, "Roman Food Tour", "FOOD", 50, 3.5, "Pasta, gelato, espresso"),
    (7, "Trevi Fountain Visit", "SIGHTSEEING", 0, 0.5, "Iconic Baroque fountain"),
    # Barcelona (8)
    (8, "Sagrada Familia", "CULTURE", 26, 2, "Gaudi's unfinished masterpiece"),
    (8, "Park Güell", "SIGHTSEEING", 10, 2, "Colorful mosaic park"),
    (8, "La Boqueria Market", "FOOD", 20, 2, "Vibrant food market on La Rambla"),
    (8, "Flamenco Show", "CULTURE", 40, 2, "Traditional Spanish dance"),
    # Sydney (9)
    (9, "Sydney Opera House Tour", "CULTURE", 40, 1.5, "Architectural icon"),
    (9, "Bondi to Coogee Walk", "NATURE", 0, 3, "Stunning coastal trail"),
    (9, "Harbour Bridge Climb", "ADVENTURE", 180, 3.5, "Climb the iconic bridge"),
    # Bangkok (10)
    (10, "Grand Palace & Wat Phra Kaew", "CULTURE", 15, 3, "Royal palace complex"),
    (10, "Street Food Tour", "FOOD", 20, 3, "Pad Thai, mango sticky rice"),
    (10, "Floating Market Trip", "SIGHTSEEING", 25, 4, "Traditional canal market"),
    (10, "Thai Boxing Show", "CULTURE", 30, 2, "Muay Thai live event"),
    # Istanbul (11)
    (11, "Hagia Sophia", "CULTURE", 15, 2, "Byzantine cathedral turned mosque"),
    (11, "Grand Bazaar Shopping", "SHOPPING", 0, 3, "Historic covered market"),
    (11, "Bosphorus Cruise", "SIGHTSEEING", 20, 2, "Cruise between continents"),
    (11, "Turkish Bath Experience", "WELLNESS", 40, 2, "Traditional hamam spa"),
    # Cape Town (12)
    (12, "Table Mountain Hike", "ADVENTURE", 15, 4, "Iconic flat-topped mountain"),
    (12, "Cape Point Drive", "NATURE", 20, 6, "Scenic coastal drive"),
    (12, "Wine Tasting Stellenbosch", "FOOD", 30, 5, "South African wine country"),
    (12, "Penguin Colony Visit", "NATURE", 10, 2, "African penguins at Boulders Beach"),
    # Santorini (14)
    (14, "Sunset in Oia", "SIGHTSEEING", 0, 2, "World-famous caldera sunset"),
    (14, "Wine Tasting Tour", "FOOD", 35, 3, "Volcanic wine varieties"),
    (14, "Red Beach Visit", "NATURE", 0, 2, "Unique red volcanic beach"),
    # Kyoto (15)
    (15, "Fushimi Inari Shrine", "CULTURE", 0, 3, "Thousands of vermillion torii gates"),
    (15, "Arashiyama Bamboo Grove", "NATURE", 0, 2, "Ethereal bamboo forest walk"),
    (15, "Traditional Tea Ceremony", "CULTURE", 30, 1.5, "Authentic matcha experience"),
    (15, "Geisha District Walk", "CULTURE", 0, 2, "Gion evening stroll"),
    # Cusco (16)
    (16, "Machu Picchu Day Trip", "ADVENTURE", 80, 12, "Ancient Incan citadel"),
    (16, "Sacred Valley Tour", "CULTURE", 40, 8, "Inca ruins and markets"),
    # Amsterdam (18)
    (18, "Anne Frank House", "CULTURE", 16, 1.5, "WWII historic house museum"),
    (18, "Canal Cruise", "SIGHTSEEING", 15, 1, "Scenic waterway tour"),
    (18, "Van Gogh Museum", "CULTURE", 20, 2.5, "World's largest Van Gogh collection"),
    (18, "Heineken Experience", "FOOD", 21, 2, "Beer brewery tour"),
    # Singapore (19)
    (19, "Gardens by the Bay", "NATURE", 20, 3, "Futuristic garden park"),
    (19, "Hawker Center Food Tour", "FOOD", 15, 2.5, "Michelin-star street food"),
    (19, "Marina Bay Sands SkyPark", "SIGHTSEEING", 26, 1.5, "Infinity pool skyline views"),
    (19, "Sentosa Island", "ADVENTURE", 30, 5, "Beach resort island"),
    # Rio de Janeiro (20)
    (20, "Christ the Redeemer", "SIGHTSEEING", 15, 3, "Iconic hilltop statue"),
    (20, "Copacabana Beach", "NATURE", 0, 3, "Famous crescent beach"),
    (20, "Sugarloaf Mountain Cable Car", "SIGHTSEEING", 25, 2, "Panoramic views"),
    (20, "Samba Dance Class", "CULTURE", 20, 2, "Learn Brazilian dance"),
    # Prague (21)
    (21, "Charles Bridge Walk", "SIGHTSEEING", 0, 1, "Gothic stone bridge with statues"),
    (21, "Prague Castle Tour", "CULTURE", 15, 3, "Largest ancient castle complex"),
    (21, "Beer Tasting Tour", "FOOD", 25, 3, "Czech craft beer experience"),
    # Lisbon (22)
    (22, "Tram 28 Ride", "SIGHTSEEING", 3, 1, "Iconic yellow tram through old town"),
    (22, "Pastéis de Belém", "FOOD", 5, 1, "Famous custard tarts"),
    (22, "Fado Music Night", "CULTURE", 25, 2, "Traditional Portuguese music"),
    # Seoul (23)
    (23, "Gyeongbokgung Palace", "CULTURE", 3, 2, "Grand Joseon Dynasty palace"),
    (23, "Myeongdong Shopping", "SHOPPING", 0, 3, "K-beauty and street food"),
    (23, "Korean BBQ Experience", "FOOD", 25, 2, "Authentic grilled meats"),
    # Vienna (24)
    (24, "Schönbrunn Palace", "CULTURE", 22, 3, "Imperial summer residence"),
    (24, "Coffee House Tour", "FOOD", 15, 2, "Viennese café culture"),
    (24, "Vienna State Opera", "CULTURE", 50, 3, "World-class opera performance"),
    # Buenos Aires (25)
    (25, "Tango Show in San Telmo", "CULTURE", 35, 3, "Authentic Argentine tango"),
    (25, "Steak Dinner Parrilla", "FOOD", 30, 2, "World-famous beef"),
    (25, "La Boca Walking Tour", "SIGHTSEEING", 0, 2, "Colorful neighborhood"),
    # Maldives (26)
    (26, "Snorkeling Coral Reef", "ADVENTURE", 40, 3, "Tropical marine life"),
    (26, "Overwater Villa Sunset", "NATURE", 0, 2, "Indian Ocean views"),
    # Jaipur (27)
    (27, "Amber Fort Visit", "CULTURE", 8, 3, "Hilltop Rajput fortress"),
    (27, "Hawa Mahal Photo Stop", "SIGHTSEEING", 2, 1, "Palace of Winds"),
    (27, "Bazaar Shopping", "SHOPPING", 0, 3, "Colorful textile markets"),
    # Cairo (29)
    (29, "Pyramids of Giza Tour", "CULTURE", 20, 4, "Ancient wonder of the world"),
    (29, "Nile Felucca Ride", "SIGHTSEEING", 10, 2, "Traditional sailboat cruise"),
    (29, "Khan el-Khalili Bazaar", "SHOPPING", 0, 3, "Medieval souk experience"),
    # Vancouver (30)
    (30, "Stanley Park Cycling", "NATURE", 10, 3, "Seawall bike path"),
    (30, "Granville Island Market", "FOOD", 0, 2, "Artisan food market"),
    (30, "Capilano Suspension Bridge", "ADVENTURE", 45, 3, "Treetop walk"),
    # Dubrovnik (31)
    (31, "City Walls Walk", "SIGHTSEEING", 25, 2, "Medieval fortress walls"),
    (31, "Kayaking to Lokrum", "ADVENTURE", 30, 3, "Sea kayak to island"),
    # Florence (35)
    (35, "Uffizi Gallery", "CULTURE", 20, 3, "Renaissance masterpieces"),
    (35, "Duomo Climb", "SIGHTSEEING", 18, 2, "Brunelleschi's dome"),
    (35, "Tuscan Cooking Class", "FOOD", 65, 4, "Pasta and wine making"),
    # Chiang Mai (37)
    (37, "Doi Suthep Temple", "CULTURE", 2, 3, "Mountain-top golden temple"),
    (37, "Night Bazaar Shopping", "SHOPPING", 0, 3, "Handcrafts and street food"),
    (37, "Elephant Sanctuary Visit", "NATURE", 50, 5, "Ethical elephant experience"),
    # Maui (39)
    (39, "Road to Hana Drive", "NATURE", 0, 8, "Scenic coastal highway"),
    (39, "Snorkeling Molokini", "ADVENTURE", 60, 5, "Volcanic crater reef"),
    # Edinburgh (42)
    (42, "Edinburgh Castle", "CULTURE", 20, 3, "Historic hilltop fortress"),
    (42, "Arthur's Seat Hike", "NATURE", 0, 3, "Extinct volcano climb"),
    (42, "Whisky Tasting Tour", "FOOD", 30, 2, "Scotch whisky experience"),
    # San Francisco (44)
    (44, "Golden Gate Bridge Walk", "SIGHTSEEING", 0, 2, "Iconic suspension bridge"),
    (44, "Alcatraz Island Tour", "CULTURE", 40, 4, "Former federal prison"),
    (44, "Fisherman's Wharf", "FOOD", 20, 2, "Clam chowder in bread bowls"),
    # Berlin (51)
    (51, "Brandenburg Gate", "SIGHTSEEING", 0, 1, "Symbol of German reunification"),
    (51, "Berlin Wall Memorial", "CULTURE", 0, 2, "Cold War history"),
    (51, "Street Food Market", "FOOD", 15, 2, "Currywurst and döner"),
    (51, "Techno Club Night", "NIGHTLIFE", 20, 6, "World-famous nightlife"),
    # Budapest (57)
    (57, "Széchenyi Thermal Bath", "WELLNESS", 22, 3, "Outdoor thermal baths"),
    (57, "Ruin Bar Crawl", "NIGHTLIFE", 15, 4, "Unique bar scene"),
    (57, "Parliament Building Tour", "CULTURE", 12, 2, "Gothic Revival masterpiece"),
    # Porto (60)
    (60, "Port Wine Cellars Tour", "FOOD", 15, 2, "Douro Valley tastings"),
    (60, "Ribeira District Walk", "SIGHTSEEING", 0, 2, "Colorful riverside"),
    # Hong Kong (70)
    (70, "Victoria Peak Tram", "SIGHTSEEING", 10, 2, "Skyline panorama"),
    (70, "Dim Sum Brunch", "FOOD", 20, 2, "Traditional Cantonese"),
    (70, "Star Ferry Harbour Cruise", "SIGHTSEEING", 1, 0.5, "Iconic harbor crossing"),
    # Mumbai (67)
    (67, "Gateway of India Visit", "SIGHTSEEING", 0, 1, "Colonial-era arch monument"),
    (67, "Street Food Trail", "FOOD", 10, 3, "Vada pav and pani puri"),
    (67, "Dharavi Tour", "CULTURE", 15, 3, "Asia's largest slum economy"),
    # Delhi (68)
    (68, "Red Fort Tour", "CULTURE", 5, 2, "Mughal era fortress"),
    (68, "Chandni Chowk Food Walk", "FOOD", 10, 3, "Old Delhi street food"),
    (68, "Qutub Minar Visit", "SIGHTSEEING", 5, 2, "Medieval victory tower"),
    # Melbourne (97)
    (97, "Street Art Laneways", "CULTURE", 0, 2, "Hosier Lane graffiti"),
    (97, "Great Ocean Road Day Trip", "NATURE", 80, 10, "Twelve Apostles coastline"),
    (97, "Coffee Culture Tour", "FOOD", 25, 2, "Specialty coffee scene"),
    # Osaka (74)
    (74, "Dotonbori Night Walk", "SIGHTSEEING", 0, 2, "Neon-lit food street"),
    (74, "Osaka Castle", "CULTURE", 8, 2, "Samurai fortress"),
    (74, "Takoyaki Tasting", "FOOD", 5, 1, "Octopus ball street food"),
    # Siem Reap (75)
    (75, "Angkor Wat Sunrise", "CULTURE", 37, 6, "Largest religious monument"),
    (75, "Floating Village Tour", "SIGHTSEEING", 20, 3, "Tonle Sap lake villages"),
    # Zanzibar (77)
    (77, "Spice Farm Tour", "FOOD", 15, 3, "Clove and vanilla plantations"),
    (77, "Stone Town Walk", "CULTURE", 0, 2, "UNESCO heritage old town"),
    # Lima (81)
    (81, "Ceviche Cooking Class", "FOOD", 40, 3, "Fresh seafood preparation"),
    (81, "Miraflores Cliffs Walk", "NATURE", 0, 2, "Pacific coast paragliding views"),
    # Cancún (96)
    (96, "Chichén Itzá Day Trip", "CULTURE", 60, 10, "Mayan pyramid wonder"),
    (96, "Cenote Swimming", "ADVENTURE", 25, 3, "Natural sinkhole pools"),
    (96, "Isla Mujeres Ferry", "NATURE", 15, 5, "Caribbean island escape"),
    # Tel Aviv (99)
    (99, "Old Jaffa Walk", "CULTURE", 0, 2, "Ancient port city"),
    (99, "Beach Volleyball", "ADVENTURE", 0, 2, "Mediterranean shore sports"),
    (99, "Carmel Market Food Tour", "FOOD", 20, 2, "Middle Eastern flavors"),
    # Marrakech (13)
    (13, "Jemaa el-Fnaa Square", "CULTURE", 0, 2, "Bustling market square"),
    (13, "Majorelle Garden", "NATURE", 8, 1.5, "Yves Saint Laurent's garden"),
    (13, "Hammam Spa Experience", "WELLNESS", 30, 2, "Traditional Moroccan bath"),
    # Reykjavik (17)
    (17, "Northern Lights Tour", "NATURE", 70, 4, "Aurora borealis hunting"),
    (17, "Blue Lagoon Soak", "WELLNESS", 60, 3, "Geothermal spa"),
    (17, "Golden Circle Drive", "NATURE", 80, 8, "Geysers and waterfalls"),
    # Petra (32)
    (32, "Treasury Walk", "CULTURE", 50, 5, "Rose-red carved monument"),
    (32, "Petra by Night", "SIGHTSEEING", 17, 2, "Candlelit Treasury experience"),
    # Queenstown (33)
    (33, "Bungee Jumping", "ADVENTURE", 150, 2, "AJ Hackett original site"),
    (33, "Milford Sound Cruise", "NATURE", 70, 8, "Fiord cruise day trip"),
    # Hanoi (34)
    (34, "Old Quarter Walking Tour", "CULTURE", 0, 3, "36 ancient streets"),
    (34, "Pho Tasting Tour", "FOOD", 10, 2, "Vietnam's national dish"),
    (34, "Ha Long Bay Cruise", "NATURE", 80, 10, "Limestone karst seascape"),
]


def seed_activities(db: Session):
    if db.query(Activity).count() > 0:
        return
    for city_id, name, atype, cost, duration, desc in ACTIVITIES:
        city = db.query(City).filter(City.id == city_id).first()
        if city:
            db.add(Activity(city_id=city_id, name=name, type=atype,
                           estimated_cost=cost, duration_hours=duration, description=desc))
    db.commit()
