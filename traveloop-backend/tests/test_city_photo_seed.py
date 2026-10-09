import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
import models.user,models.trip,models.city,models.activity,models.stop,models.budget,models.checklist,models.note,models.community
from models.city import City
from seed.cities_seed import CITIES_DATA,seed_cities
from seed.activities_seed import seed_activities
from seed.city_photos import CITY_PHOTOS
engine=create_engine('sqlite:///:memory:');Base.metadata.create_all(engine);db=sessionmaker(bind=engine)()
seed_cities(db);seed_activities(db)
assert db.query(City).count()==105
ids={c.name:c.id for c in db.query(City).all()}
for city in db.query(City).all():assert city.image_url==CITY_PHOTOS[city.name]['image_url']
paris=db.query(City).filter_by(name='Paris').one();paris.image_url=CITY_PHOTOS['Paris']['legacy_urls'][0]
tokyo=db.query(City).filter_by(name='Tokyo').one();tokyo.image_url='https://example.invalid/my-own-tokyo-photo.jpg';db.commit()
seed_cities(db);assert paris.image_url==CITY_PHOTOS['Paris']['image_url'];assert tokyo.image_url=='https://example.invalid/my-own-tokyo-photo.jpg';assert ids=={c.name:c.id for c in db.query(City).all()}
seed_cities(db);assert db.query(City).count()==105
from models.activity import Activity
print('PASS: 105 cities; activities',db.query(Activity).count(),'; legacy image refresh; custom image preservation; ID preservation; repeat seed idempotence')
assert len(set(x['image_url'] for x in CITY_PHOTOS.values()))==105
assert all(x['image_url'].startswith('https://images.unsplash.com/') for x in CITY_PHOTOS.values())
print('PASS: 105 unique Unsplash photos')
