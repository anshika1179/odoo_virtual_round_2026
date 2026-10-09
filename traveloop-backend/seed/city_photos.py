"""City photos from Unsplash (free to use under the Unsplash License, no attribution required).

legacy_urls lists photos used by earlier versions so existing databases get refreshed;
custom photos set by users are left alone.
"""

CITY_PHOTOS = {
    "Paris": {
        "image_url": "https://images.unsplash.com/photo-1742071327447-5cb04ee7ee0a?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
        ],
    },
    "Tokyo": {
        "image_url": "https://images.unsplash.com/photo-1668392297073-d3dfcd81ae63?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg",
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        ],
    },
    "New York": {
        "image_url": "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/960px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
        ],
    },
    "London": {
        "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg",
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
        ],
    },
    "Dubai": {
        "image_url": "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Marina_Skyline.jpg/960px-Dubai_Marina_Skyline.jpg",
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
        ],
    },
    "Bali": {
        "image_url": "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pura_Bratan_Bali.jpg/960px-Pura_Bratan_Bali.jpg",
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
        ],
    },
    "Rome": {
        "image_url": "https://images.unsplash.com/photo-1688163217379-c331b5faa70c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/960px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
        ],
    },
    "Barcelona": {
        "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Evening_light_over_Barcelona.jpg/960px-Evening_light_over_Barcelona.jpg",
            "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400",
        ],
    },
    "Sydney": {
        "image_url": "https://images.unsplash.com/photo-1741510345561-4ba8df308818?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/960px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400",
        ],
    },
    "Bangkok": {
        "image_url": "https://images.unsplash.com/photo-1583511416766-083ba12de77c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/960px-4Y1A1159_Bangkok_%2833536795515%29.jpg",
            "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=400",
        ],
    },
    "Istanbul": {
        "image_url": "https://images.unsplash.com/photo-1748504801441-5d9ca058323f?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Historical_peninsula_and_modern_skyline_of_Istanbul.jpg/960px-Historical_peninsula_and_modern_skyline_of_Istanbul.jpg",
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400",
        ],
    },
    "Cape Town": {
        "image_url": "https://images.unsplash.com/photo-1529528070131-eda9f3e90919?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Camps_bay_%2853460319478%29_%28cropped%29.jpg/960px-Camps_bay_%2853460319478%29_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400",
        ],
    },
    "Marrakech": {
        "image_url": "https://images.unsplash.com/photo-1677837488142-a85ffbffe408?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Pavillon_Menarag%C3%A4rten.jpg/960px-Pavillon_Menarag%C3%A4rten.jpg",
            "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400",
        ],
    },
    "Santorini": {
        "image_url": "https://images.unsplash.com/photo-1501700072703-15ee3d019f07?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Imerovigli_02.jpg/960px-Imerovigli_02.jpg",
            "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
        ],
    },
    "Kyoto": {
        "image_url": "https://images.unsplash.com/photo-1701778100762-a9278bf2b2e4?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kyoto%2C_Japan_%2849667780482%29.jpg/960px-Kyoto%2C_Japan_%2849667780482%29.jpg",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
        ],
    },
    "Cusco": {
        "image_url": "https://images.unsplash.com/photo-1775854791105-a1420ec87dc3?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Vista_Calle_Suecia.jpg/960px-Vista_Calle_Suecia.jpg",
            "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400",
        ],
    },
    "Reykjavik": {
        "image_url": "https://images.unsplash.com/photo-1632462821168-fc336cd5ed11?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Reykjav%C3%ADk%2C_view_from_Hallgr%C3%ADmskirkja_%282%29.jpg/960px-Reykjav%C3%ADk%2C_view_from_Hallgr%C3%ADmskirkja_%282%29.jpg",
            "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400",
        ],
    },
    "Amsterdam": {
        "image_url": "https://images.unsplash.com/photo-1755589067388-2ed3a2f45e82?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/960px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png",
            "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400",
        ],
    },
    "Singapore": {
        "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Marina_Bay%2C_Financial_District_and_Singapore_River_%2835622190292%29.jpg/960px-Marina_Bay%2C_Financial_District_and_Singapore_River_%2835622190292%29.jpg",
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400",
        ],
    },
    "Rio de Janeiro": {
        "image_url": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/960px-Cidade_Maravilhosa.jpg",
            "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400",
        ],
    },
    "Prague": {
        "image_url": "https://images.unsplash.com/photo-1675703297793-124f5d447918?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Prague_%286365119737%29.jpg/960px-Prague_%286365119737%29.jpg",
            "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400",
        ],
    },
    "Lisbon": {
        "image_url": "https://images.unsplash.com/photo-1750793521272-63b426ab6101?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Lisboa_-_Portugal_%2852597836992%29.jpg/960px-Lisboa_-_Portugal_%2852597836992%29.jpg",
            "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400",
        ],
    },
    "Seoul": {
        "image_url": "https://images.unsplash.com/photo-1651576167746-324a45acf8ba?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/960px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg",
            "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400",
        ],
    },
    "Vienna": {
        "image_url": "https://images.unsplash.com/photo-1662554840834-57a9af9a6430?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Schoenbrunn_philharmoniker_2012.jpg/960px-Schoenbrunn_philharmoniker_2012.jpg",
            "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400",
        ],
    },
    "Buenos Aires": {
        "image_url": "https://images.unsplash.com/photo-1672588371953-2accc9eb0d01?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg/960px-Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400",
        ],
    },
    "Maldives": {
        "image_url": "https://images.unsplash.com/photo-1749741148860-8cd063383ea7?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Landaa_Giraavaru_vue_du_ciel.JPG/960px-Landaa_Giraavaru_vue_du_ciel.JPG",
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400",
        ],
    },
    "Jaipur": {
        "image_url": "https://images.unsplash.com/photo-1648217516771-74a081268aac?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400",
        ],
    },
    "Havana": {
        "image_url": "https://images.unsplash.com/photo-1748646846416-39b01694700d?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/DJI_0197_crp_wiki.jpg/960px-DJI_0197_crp_wiki.jpg",
            "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400",
        ],
    },
    "Cairo": {
        "image_url": "https://images.unsplash.com/photo-1720400995876-506098f4c238?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/960px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg",
            "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400",
        ],
    },
    "Vancouver": {
        "image_url": "https://images.unsplash.com/photo-1754026243526-bf3cceb07b42?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Skyline_of_Vancouver%2C_Canada.jpg/960px-Skyline_of_Vancouver%2C_Canada.jpg",
            "https://images.unsplash.com/photo-1559511260-66a68e7e7840?w=400",
        ],
    },
    "Dubrovnik": {
        "image_url": "https://images.unsplash.com/photo-1742744807117-129ced86fd34?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/The_walls_of_the_fortress_and_View_of_the_old_city._panorama.jpg/960px-The_walls_of_the_fortress_and_View_of_the_old_city._panorama.jpg",
            "https://images.unsplash.com/photo-1555990538-1e15c8bfad20?w=400",
        ],
    },
    "Petra": {
        "image_url": "https://images.unsplash.com/photo-1551171129-8ce1ebb911b3?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Al_Deir_Petra.JPG/960px-Al_Deir_Petra.JPG",
            "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=400",
        ],
    },
    "Queenstown": {
        "image_url": "https://images.unsplash.com/photo-1765114944969-57ba5e7ae5a3?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Queenstown_1_%288168013172%29.jpg/960px-Queenstown_1_%288168013172%29.jpg",
            "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=400",
        ],
    },
    "Hanoi": {
        "image_url": "https://images.unsplash.com/photo-1744822685893-6623f5929d16?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hanoi_skyline_with_Ba_Vi_Mountain.jpg/960px-Hanoi_skyline_with_Ba_Vi_Mountain.jpg",
            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
        ],
    },
    "Florence": {
        "image_url": "https://images.unsplash.com/photo-1759088253105-21b140293a59?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Firenze_-_Piazzale_Michelangelo%2C_Firenze%2C_Italy_-_April_6%2C_2015_02.jpg/960px-Firenze_-_Piazzale_Michelangelo%2C_Firenze%2C_Italy_-_April_6%2C_2015_02.jpg",
            "https://images.unsplash.com/photo-1543429258-c5ca3e1b6d6e?w=400",
        ],
    },
    "Amalfi Coast": {
        "image_url": "https://images.unsplash.com/photo-1761309557902-3bbfedbe67ad?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Amalfi_Coast_%28Italy%2C_October_2020%29_-_75_%2850558355441%29.jpg/960px-Amalfi_Coast_%28Italy%2C_October_2020%29_-_75_%2850558355441%29.jpg",
            "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=400",
        ],
    },
    "Chiang Mai": {
        "image_url": "https://images.unsplash.com/photo-1741245957175-a32972773900?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/0020-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B9%8C%E0%B8%A7%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3.jpg/960px-0020-%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B9%8C%E0%B8%A7%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3.jpg",
            "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400",
        ],
    },
    "Zürich": {
        "image_url": "https://images.unsplash.com/photo-1573137785546-9d19e4f33f87?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Altstadt_Z%C3%BCrich_2015.jpg/960px-Altstadt_Z%C3%BCrich_2015.jpg",
            "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400",
        ],
    },
    "Maui": {
        "image_url": "https://images.unsplash.com/photo-1753731683731-1032f9457b02?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Makena_Beach%2C_Maui_Hawaii_%2845015180584%29.jpg/960px-Makena_Beach%2C_Maui_Hawaii_%2845015180584%29.jpg",
            "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400",
        ],
    },
    "Colombo": {
        "image_url": "https://images.unsplash.com/photo-1546656495-fc838de15e5c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Colombo_city_skyline_at_night.png/960px-Colombo_city_skyline_at_night.png",
            "https://images.unsplash.com/photo-1586613835297-e07e2e42a89c?w=400",
        ],
    },
    "Kathmandu": {
        "image_url": "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg/960px-Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg",
            "https://images.unsplash.com/photo-1558799401-1dcba79834c2?w=400",
        ],
    },
    "Edinburgh": {
        "image_url": "https://images.unsplash.com/photo-1745194807526-e6bd1f1ae2d1?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Skyline_of_Edinburgh.jpg/960px-Skyline_of_Edinburgh.jpg",
            "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400",
        ],
    },
    "Munich": {
        "image_url": "https://images.unsplash.com/photo-1751039531516-caedbb85dfe0?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/960px-Stadtbild_M%C3%BCnchen.jpg",
            "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400",
        ],
    },
    "San Francisco": {
        "image_url": "https://images.unsplash.com/photo-1748904916039-b8119258e23e?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Zeppelin-ride-020100925-195_%285029394846%29.jpg/960px-Zeppelin-ride-020100925-195_%285029394846%29.jpg",
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
        ],
    },
    "Phuket": {
        "image_url": "https://images.unsplash.com/photo-1687269708079-60a84b1e9fec?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Phuket_Aerial.jpg/960px-Phuket_Aerial.jpg",
            "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400",
        ],
    },
    "Cartagena": {
        "image_url": "https://images.unsplash.com/photo-1633627397446-04c7fca71c74?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Museo_Naval_del_Caribe.JPG/960px-Museo_Naval_del_Caribe.JPG",
            "https://images.unsplash.com/photo-1583997052103-b4a1cb974ce5?w=400",
        ],
    },
    "Lhasa": {
        "image_url": "https://images.unsplash.com/photo-1749704492358-08959f2eff60?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lhasa_-_Pot%C3%A1la_-_panoramio.jpg/960px-Lhasa_-_Pot%C3%A1la_-_panoramio.jpg",
            "https://images.unsplash.com/photo-1591011432331-79b95ab4d3b9?w=400",
        ],
    },
    "Nairobi": {
        "image_url": "https://images.unsplash.com/photo-1643913224222-17cc6adb2dfc?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nairobi_skyline_from_Gem_Hotel.jpg/960px-Nairobi_skyline_from_Gem_Hotel.jpg",
            "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400",
        ],
    },
    "Athens": {
        "image_url": "https://images.unsplash.com/photo-1621123733623-8f8debe25752?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Athens_Acropolis_at_Daybreak.jpg/960px-Athens_Acropolis_at_Daybreak.jpg",
            "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400",
        ],
    },
    "Mexico City": {
        "image_url": "https://images.unsplash.com/photo-1718591020072-c9d48a96ee58?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg/960px-Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400",
        ],
    },
    "Berlin": {
        "image_url": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg/960px-Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg",
            "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400",
        ],
    },
    "Copenhagen": {
        "image_url": "https://images.unsplash.com/photo-1579126219016-fbc7f8670d6a?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2018_-_Christiansborg_from_the_Marble_Bridge.jpg/960px-2018_-_Christiansborg_from_the_Marble_Bridge.jpg",
            "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400",
        ],
    },
    "Helsinki": {
        "image_url": "https://images.unsplash.com/photo-1540799051881-f52f8d808bf3?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Suomenlinna_%28cropped%29.jpg/960px-Suomenlinna_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=400",
        ],
    },
    "Oslo": {
        "image_url": "https://images.unsplash.com/photo-1669421632724-3b5b6c1921e7?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Nationaltheatret_evening.jpg/960px-Nationaltheatret_evening.jpg",
            "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
        ],
    },
    "Stockholm": {
        "image_url": "https://images.unsplash.com/photo-1508189860359-777d945909ef?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Royal_Dramatic_Theatre_Stockholm.jpg/960px-Royal_Dramatic_Theatre_Stockholm.jpg",
            "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400",
        ],
    },
    "Bruges": {
        "image_url": "https://images.unsplash.com/photo-1742420999707-e2afe589a07c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Br%C3%BCgge_Blick_vom_Belfried_4.jpg/960px-Br%C3%BCgge_Blick_vom_Belfried_4.jpg",
            "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400",
        ],
    },
    "Budapest": {
        "image_url": "https://images.unsplash.com/photo-1631652670914-cd0f5add8db0?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/View_from_Gell%C3%A9rt_Hill_to_the_Danube%2C_Hungary_-_Budapest_%2828493220635%29.jpg/960px-View_from_Gell%C3%A9rt_Hill_to_the_Danube%2C_Hungary_-_Budapest_%2828493220635%29.jpg",
            "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=400",
        ],
    },
    "Krakow": {
        "image_url": "https://images.unsplash.com/photo-1636903364559-0dfc358abd94?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Krakow_Rynek_Glowny_panorama_2.jpg/960px-Krakow_Rynek_Glowny_panorama_2.jpg",
            "https://images.unsplash.com/photo-1558489580-fac8f8e6e9ce?w=400",
        ],
    },
    "Nice": {
        "image_url": "https://images.unsplash.com/photo-1569701210061-a5d6e18c682b?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Promenade_des_Anglais_Nice_IMG_1255.jpg/960px-Promenade_des_Anglais_Nice_IMG_1255.jpg",
            "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=400",
        ],
    },
    "Porto": {
        "image_url": "https://images.unsplash.com/photo-1635873098036-2e13670b9338?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Puente_Don_Luis_I%2C_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_13.JPG/960px-Puente_Don_Luis_I%2C_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_13.JPG",
            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400",
        ],
    },
    "Seville": {
        "image_url": "https://images.unsplash.com/photo-1567310992100-2e87eab5b692?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Sevilla_Cathedral_-_Southeast.jpg/960px-Sevilla_Cathedral_-_Southeast.jpg",
            "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400",
        ],
    },
    "Split": {
        "image_url": "https://images.unsplash.com/photo-1575540291670-8d3b26f7d327?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Riva_promenade_in_Split%2C_Croatia_%2848693340418%29.jpg/960px-Riva_promenade_in_Split%2C_Croatia_%2848693340418%29.jpg",
            "https://images.unsplash.com/photo-1555990538-1e15c8bfad20?w=400",
        ],
    },
    "Moscow": {
        "image_url": "https://images.unsplash.com/photo-1495542779398-9fec7dc7986c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg/960px-Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg",
            "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400",
        ],
    },
    "Tallinn": {
        "image_url": "https://images.unsplash.com/photo-1640883216713-fae8fd5e7872?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Raekoja_plats_at_night.jpg/960px-Raekoja_plats_at_night.jpg",
            "https://images.unsplash.com/photo-1569949381669-ecf31ae8f613?w=400",
        ],
    },
    "Tbilisi": {
        "image_url": "https://images.unsplash.com/photo-1760566817890-84ef17f3c4e8?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg/960px-View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg",
            "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400",
        ],
    },
    "Kuala Lumpur": {
        "image_url": "https://images.unsplash.com/photo-1691126223660-1b9f40c7a5c1?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bukit_Bintang_junction_in_2024_2.jpg/960px-Bukit_Bintang_junction_in_2024_2.jpg",
            "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400",
        ],
    },
    "Mumbai": {
        "image_url": "https://images.unsplash.com/photo-1708067372301-145e0e0f39d2?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mumbai_Bandra-Worli_Sea_Link.jpg/960px-Mumbai_Bandra-Worli_Sea_Link.jpg",
            "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400",
        ],
    },
    "Delhi": {
        "image_url": "https://images.unsplash.com/photo-1569560346548-488e1f821687?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jama_Masjid_2011.jpg/960px-Jama_Masjid_2011.jpg",
            "https://images.unsplash.com/photo-1597040663342-45b6af3d7489?w=400",
        ],
    },
    "Goa": {
        "image_url": "https://images.unsplash.com/photo-1710952356679-1eff1cb5ba64?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/960px-BeachFun.jpg",
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
        ],
    },
    "Hong Kong": {
        "image_url": "https://images.unsplash.com/photo-1750700206243-52c6e2e87632?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hong_Kong_Skyline_view_from_the_peak_2017.jpg/960px-Hong_Kong_Skyline_view_from_the_peak_2017.jpg",
            "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400",
        ],
    },
    "Shanghai": {
        "image_url": "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg/960px-Huangpu_Park_20124-Shanghai_%2832208802494%29.jpg",
            "https://images.unsplash.com/photo-1537519646099-5e591f4c8ab7?w=400",
        ],
    },
    "Beijing": {
        "image_url": "https://images.unsplash.com/photo-1746242556523-55a066d0e909?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg/960px-Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg",
            "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400",
        ],
    },
    "Taipei": {
        "image_url": "https://images.unsplash.com/photo-1741004419862-5f3600cc7a97?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Taipei_Skyline_2022.06.29.jpg/960px-Taipei_Skyline_2022.06.29.jpg",
            "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=400",
        ],
    },
    "Osaka": {
        "image_url": "https://images.unsplash.com/photo-1718463323643-1fc3227c8e8c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Osaka_Castle_03bs3200.jpg/960px-Osaka_Castle_03bs3200.jpg",
            "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400",
        ],
    },
    "Siem Reap": {
        "image_url": "https://images.unsplash.com/photo-1566706546199-a93ba33ce9f7?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Front_porch_of_Wat_Damnak.jpg/960px-Front_porch_of_Wat_Damnak.jpg",
            "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400",
        ],
    },
    "Luang Prabang": {
        "image_url": "https://images.unsplash.com/photo-1737038616815-945efd57468c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Phou_si_Luang_Prabang_Laos_%E3%83%97%E3%83%BC%E3%82%B7%E3%83%BC%E3%81%AE%E4%B8%98_%E3%83%A9%E3%82%AA%E3%82%B9%E3%83%BB%E3%83%AB%E3%82%A2%E3%83%B3%E3%83%97%E3%83%A9%E3%83%90%E3%83%BC%E3%83%B3_DSCF6777.jpg/960px-Phou_si_Luang_Prabang_Laos_%E3%83%97%E3%83%BC%E3%82%B7%E3%83%BC%E3%81%AE%E4%B8%98_%E3%83%A9%E3%82%AA%E3%82%B9%E3%83%BB%E3%83%AB%E3%82%A2%E3%83%B3%E3%83%97%E3%83%A9%E3%83%90%E3%83%BC%E3%83%B3_DSCF6777.jpg",
            "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400",
        ],
    },
    "Zanzibar": {
        "image_url": "https://images.unsplash.com/photo-1628531895969-df353541bafe?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/c/c3/Zanzibar_Stone_Town02.jpg",
            "https://images.unsplash.com/photo-1586882829491-b81178aa622e?w=400",
        ],
    },
    "Victoria Falls": {
        "image_url": "https://images.unsplash.com/photo-1650470200336-2f02e404976c?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Cataratas_Victoria%2C_Zambia-Zimbabue%2C_2018-07-27%2C_DD_04.jpg/960px-Cataratas_Victoria%2C_Zambia-Zimbabue%2C_2018-07-27%2C_DD_04.jpg",
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400",
        ],
    },
    "Casablanca": {
        "image_url": "https://images.unsplash.com/photo-1693532088390-d278b7cefed0?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Casa_finance_city_6_%28cropped%29.jpg/960px-Casa_finance_city_6_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400",
        ],
    },
    "Accra": {
        "image_url": "https://images.unsplash.com/photo-1744822841053-03d977da3da9?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Acca.jpg/960px-Acca.jpg",
            "https://images.unsplash.com/photo-1580223530509-849e0ad7d3d4?w=400",
        ],
    },
    "Lima": {
        "image_url": "https://images.unsplash.com/photo-1585172162477-d52fa4ad9413?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bas%C3%ADlica_Catedral_Metropolitana_de_Lima_%28cropped%29.jpg/960px-Bas%C3%ADlica_Catedral_Metropolitana_de_Lima_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1531968455001-5c5272a67c71?w=400",
        ],
    },
    "Bogota": {
        "image_url": "https://images.unsplash.com/photo-1568632234170-9adf33c23dd9?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bogota%2C_Colombia_%2836668708290%29.jpg/960px-Bogota%2C_Colombia_%2836668708290%29.jpg",
            "https://images.unsplash.com/photo-1568692269792-f5e6856f7db6?w=400",
        ],
    },
    "Santiago": {
        "image_url": "https://images.unsplash.com/photo-1689850543263-01a52ccc6943?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Palacio_de_La_Moneda_-_miguelreflex.jpg/960px-Palacio_de_La_Moneda_-_miguelreflex.jpg",
            "https://images.unsplash.com/photo-1551717743-49959800-b1fd?w=400",
        ],
    },
    "Quito": {
        "image_url": "https://images.unsplash.com/photo-1593742553188-65c60dcd8737?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg/960px-FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg",
            "https://images.unsplash.com/photo-1510537220005-548a0783a909?w=400",
        ],
    },
    "Medellín": {
        "image_url": "https://images.unsplash.com/photo-1551282643-392c82ebb909?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/El_Poblado_Medell%C3%ADn.jpg/960px-El_Poblado_Medell%C3%ADn.jpg",
            "https://images.unsplash.com/photo-1599421790329-5aaab21fa66a?w=400",
        ],
    },
    "Muscat": {
        "image_url": "https://images.unsplash.com/photo-1725600462847-0317804cc466?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Al_Alam_Palace.jpg/960px-Al_Alam_Palace.jpg",
            "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=400",
        ],
    },
    "Toronto": {
        "image_url": "https://images.unsplash.com/photo-1753567048249-1b3648e87c81?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Toronto_Skyline_from_Snake_Island%2C_September_11_2026_%2801%29.jpg/960px-Toronto_Skyline_from_Snake_Island%2C_September_11_2026_%2801%29.jpg",
            "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400",
        ],
    },
    "Montreal": {
        "image_url": "https://images.unsplash.com/photo-1745868426739-9348a971a3e6?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Montreal%2C_Quebec_skyline.jpg/960px-Montreal%2C_Quebec_skyline.jpg",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400",
        ],
    },
    "Los Angeles": {
        "image_url": "https://images.unsplash.com/photo-1512531123205-560f5974e686?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hollywood_sign_%288485145044%29.jpg/960px-Hollywood_sign_%288485145044%29.jpg",
            "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400",
        ],
    },
    "Miami": {
        "image_url": "https://images.unsplash.com/photo-1690398388394-6a57f7f4fff1?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Villa_Vizcaya_20110228.jpg/960px-Villa_Vizcaya_20110228.jpg",
            "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400",
        ],
    },
    "Chicago": {
        "image_url": "https://images.unsplash.com/photo-1746023841748-4c0eb2f90acc?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicago_River_ferry_b.jpg/960px-Chicago_River_ferry_b.jpg",
            "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400",
        ],
    },
    "Cancún": {
        "image_url": "https://images.unsplash.com/photo-1777501483819-e0b36074eea3?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Cancun_Strand_Luftbild_%2822143397586%29.jpg/960px-Cancun_Strand_Luftbild_%2822143397586%29.jpg",
            "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=400",
        ],
    },
    "Doha": {
        "image_url": "https://images.unsplash.com/photo-1723827942339-a4f4a3d0b290?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/The_Pearl_Marina_in_Nov_2013.jpg/960px-The_Pearl_Marina_in_Nov_2013.jpg",
            "https://images.unsplash.com/photo-1572089400437-7e26b9579e73?w=400",
        ],
    },
    "Abu Dhabi": {
        "image_url": "https://images.unsplash.com/photo-1624317937315-0ced8736c9e9?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Abu_dhabi_skylines_2014.jpg/960px-Abu_dhabi_skylines_2014.jpg",
            "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400",
        ],
    },
    "Tel Aviv": {
        "image_url": "https://images.unsplash.com/photo-1547483036-24bc77c79804?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sarona_CBD_01_%28cropped%29.jpg/960px-Sarona_CBD_01_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400",
        ],
    },
    "Amman": {
        "image_url": "https://images.unsplash.com/photo-1744097436857-9ad66d1adc32?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/New_Abdali_2024.png/960px-New_Abdali_2024.png",
            "https://images.unsplash.com/photo-1563789031959-4c02bcb98b3a?w=400",
        ],
    },
    "Melbourne": {
        "image_url": "https://images.unsplash.com/photo-1742643635715-00c577862b56?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Melbourne_skyline_sor.jpg/960px-Melbourne_skyline_sor.jpg",
            "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400",
        ],
    },
    "Auckland": {
        "image_url": "https://images.unsplash.com/photo-1745550663491-6cec967ce6e9?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Auckland_skyline_-_May_2024_%282%29.jpg/960px-Auckland_skyline_-_May_2024_%282%29.jpg",
            "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400",
        ],
    },
    "Fiji": {
        "image_url": "https://images.unsplash.com/photo-1654180680389-4141e2912ef6?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Mamanuca_island.jpg/960px-Mamanuca_island.jpg",
            "https://images.unsplash.com/photo-1590002581789-5327e3534416?w=400",
        ],
    },
    "Valletta": {
        "image_url": "https://images.unsplash.com/photo-1776707440368-932d9ce4a4cf?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/St_Sebastian_Curtain_%28cropped%29.jpg/960px-St_Sebastian_Curtain_%28cropped%29.jpg",
            "https://images.unsplash.com/photo-1558551649-e44c8f992010?w=400",
        ],
    },
    "Salzburg": {
        "image_url": "https://images.unsplash.com/photo-1751203168722-fdbbf845ba71?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Salzburg_%2848489551981%29.jpg/960px-Salzburg_%2848489551981%29.jpg",
            "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400",
        ],
    },
    "Lucerne": {
        "image_url": "https://images.unsplash.com/photo-1747136789192-7eb98551ee00?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/L%C3%B6wendenkmal_-_panoramio.jpg/960px-L%C3%B6wendenkmal_-_panoramio.jpg",
            "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400",
        ],
    },
    "Varanasi": {
        "image_url": "https://images.unsplash.com/photo-1762513839526-c596f5e99a9a?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/960px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg",
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400",
        ],
    },
    "Ho Chi Minh City": {
        "image_url": "https://images.unsplash.com/photo-1536086845112-89de23aa4772?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ho_Chi_Minh_City%2C_City_Hall%2C_2020-01_CN-03.jpg/960px-Ho_Chi_Minh_City%2C_City_Hall%2C_2020-01_CN-03.jpg",
            "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
        ],
    },
    "Udaipur": {
        "image_url": "https://images.unsplash.com/photo-1651478881270-6c3a0fc883f4?auto=format&fit=crop&w=960&q=80",
        "legacy_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/960px-Evening_view%2C_City_Palace%2C_Udaipur.jpg",
            "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
        ],
    },
}
