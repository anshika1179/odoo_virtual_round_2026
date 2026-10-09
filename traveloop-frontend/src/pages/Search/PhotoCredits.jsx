import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function PhotoCredits() {
  const [credits, setCredits] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    API.get('/cities/photo-credits').then(r => setCredits(r.data)).catch(() => setError(true));
  }, []);
  return <section className="container" style={{ padding: '48px 24px' }}>
    <h1 className="text-3xl font-bold text-amber-950 mb-4">Destination photo credits</h1>
    <p className="text-amber-900/70 mb-8">Real photos of each destination, from Wikimedia. Photos are displayed with a cover crop; original files, authors and licenses are linked below.</p>
    {error && <p role="alert">Photo credits could not load. Please try again.</p>}
    {!error && !credits.length && <p>Loading photo credits...</p>}
    <div className="grid gap-6 md:grid-cols-2">
      {credits.map(photo => <article key={photo.city} id={photo.city} className="glass p-6 rounded-2xl text-amber-950">
        <h2 className="text-xl font-bold mb-2">{photo.city}</h2>
        <p>{photo.author}</p>
        <p className="mt-2"><a className="underline" href={photo.source_url} target="_blank" rel="noreferrer">Original photo and source</a> · {photo.license_url ? <a className="underline" href={photo.license_url} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license}</p>
        <p className="mt-2 text-sm text-amber-900/70">{photo.title}</p>
      </article>)}
    </div>
  </section>;
}
