import React, { useEffect, useState } from 'react';

const sampleBooks = [
  { id: 1, title: 'The Way of Kings', authors: ['Brandon Sanderson'], runtime: '45h 12m' },
  { id: 2, title: 'Dune', authors: ['Frank Herbert'], runtime: '21h 43m' },
];

function Sidebar({ onNav, active }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'library', label: 'Library' },
    { key: 'discover', label: 'Discover' },
    { key: 'downloads', label: 'Downloads' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'settings', label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <div className="text-2xl">🎧</div>
        <div>
          <div className="font-bold">Audiarr</div>
          <div className="text-xs text-gray-400">Manage audiobooks</div>
        </div>
      </div>
      <nav className="p-4">
        {items.map(it => (
          <button
            key={it.key}
            onClick={() => onNav(it.key)}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 mb-1 transition-colors ${active === it.key ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <span className="w-4">{/* icon placeholder */}</span>
            <span className="truncate">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 text-xs text-gray-500">v0.1 • Docker</div>
    </aside>
  );
}

function Topbar({ onSearch, onOpenSettings }) {
  const [q, setQ] = useState('');
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold text-white">Audiarr</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search audiobooks, authors..."
            className="px-3 py-2 rounded bg-gray-700 text-gray-100 w-80"
          />
          <button onClick={() => onSearch(q)} className="absolute right-1 top-1 text-gray-300">🔍</button>
        </div>
        <button onClick={onOpenSettings} className="px-3 py-2 bg-gray-700 rounded text-gray-200">Settings</button>
      </div>
    </header>
  );
}

function Dashboard({ recent }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-white mb-2">Recently Added</h3>
          <ul className="space-y-3 text-gray-200">
            {recent.map(b => (
              <li key={b.id} className="flex items-center gap-4">
                <div className="w-12 h-16 bg-gray-600 rounded-sm flex items-center justify-center">📘</div>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-gray-400">{b.authors.join(', ')} • {b.runtime}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Active Downloads</h3>
          <div className="text-gray-200">No active downloads</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Library Overview</h3>
        <div className="grid grid-cols-4 gap-4">
          {sampleBooks.map(b => (
            <div key={b.id} className="bg-gray-900 rounded-lg p-3">
              <div className="w-full h-40 bg-gray-700 rounded mb-3 flex items-center justify-center">📗</div>
              <div className="font-semibold text-white">{b.title}</div>
              <div className="text-sm text-gray-400">{b.authors.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Library({ books }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Library</h2>
        <div className="text-sm text-gray-400">{books.length} items</div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {books.map(b => (
          <article key={b.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="h-56 bg-gray-700 flex items-center justify-center">📙</div>
            <div className="p-3">
              <div className="font-semibold text-white truncate">{b.title}</div>
              <div className="text-sm text-gray-400">{b.authors.join(', ')}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Downloads({ jobs }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Downloads</h2>
      <div className="bg-gray-900 rounded-lg p-4">
        {jobs.length === 0 ? (
          <div className="text-gray-400">No active downloads</div>
        ) : (
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="text-sm text-gray-400">
                <th>Title</th>
                <th>Progress</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="border-t border-gray-800">
                  <td className="py-2">{j.title}</td>
                  <td>{j.progress}%</td>
                  <td>{j.eta}</td>
                  <td>{j.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [settings, setSettings] = useState(null);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5080';

  useEffect(() => {
    setBooks(sampleBooks);
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(()=>setSettings(null));
    // load library
    fetch(`${API}/api/audiobooks`).then(r=>r.json()).then(setBooks).catch(()=>{});
  }, []);

  function handleSearch(q) {
    setSearchTerm(q);
    if (!q) return;
    fetch(`${API}/api/audiobooks/search?term=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(setSearchResults)
      .catch(() => setSearchResults([]));
  }

  async function downloadTo(client, title, url) {
    await fetch(`${API}/api/audiobooks/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, client })
    });
    alert(`${title} queued to ${client}`);
  }

  async function saveSettings(next) {
    await fetch(`${API}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    });
    setSettings(next);
    alert('Settings saved');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <Sidebar onNav={setView} active={view} />
      <div className="flex-1 flex flex-col">
        <Topbar onSearch={handleSearch} onOpenSettings={() => setView('settings')} />
        <main className="flex-1 overflow-auto">
          {view === 'dashboard' && <Dashboard recent={books.slice(0, 3)} />}
          {view === 'library' && <Library books={books} />}
          {view === 'discover' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Discover</h2>
              <div className="mb-4">
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search AudiobookBay or indexers" className="px-3 py-2 rounded bg-gray-800 w-1/2" />
                <button onClick={() => handleSearch(searchTerm)} className="ml-2 px-3 py-2 bg-blue-600 rounded">Search</button>
              </div>
              <div>
                {searchResults.length === 0 ? (
                  <div className="text-gray-400">No results</div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {searchResults.map((r, idx) => (
                      <div key={idx} className="bg-gray-900 p-3 rounded">
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-sm text-gray-400">{r.source}</div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => downloadTo('deluge', r.title, r.magnet ?? r.url)} className="px-2 py-1 bg-blue-600 rounded">Deluge</button>
                          <button onClick={() => downloadTo('nzbget', r.title, r.url)} className="px-2 py-1 bg-green-600 rounded">NZBGet</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {view === 'downloads' && <Downloads jobs={downloads} />}
          {view === 'integrations' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Integrations</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="font-semibold text-white">Prowlarr</div>
                  <div className="text-sm text-gray-400 mt-2">{settings?.ProwlarrUrl ?? 'not set'}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="font-semibold text-white">AudiobookBay</div>
                  <div className="text-sm text-gray-400 mt-2">{settings?.AudiobookBayUrl ?? 'not set'}</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="font-semibold text-white">Deluge</div>
                  <div className="text-sm text-gray-400 mt-2">{settings?.DelugeUrl ?? 'not set'}</div>
                </div>
              </div>
            </div>
          )}
          {view === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Prowlarr URL</label>
                    <input defaultValue={settings?.ProwlarrUrl ?? 'http://localhost:9789'} onChange={(e)=>setSettings({...settings, ProwlarrUrl: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Prowlarr API Key</label>
                    <input defaultValue={settings?.ProwlarrApiKey ?? ''} onChange={(e)=>setSettings({...settings, ProwlarrApiKey: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">AudiobookBay URL</label>
                    <input defaultValue={settings?.AudiobookBayUrl ?? 'https://audiobookbay.is'} onChange={(e)=>setSettings({...settings, AudiobookBayUrl: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Deluge RPC URL</label>
                    <input defaultValue={settings?.DelugeUrl ?? ''} onChange={(e)=>setSettings({...settings, DelugeUrl: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Deluge Password</label>
                    <input defaultValue={settings?.DelugePassword ?? ''} onChange={(e)=>setSettings({...settings, DelugePassword: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">NZBGet URL</label>
                    <input defaultValue={settings?.NZBGetUrl ?? ''} onChange={(e)=>setSettings({...settings, NZBGetUrl: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">NZBGet Username</label>
                    <input defaultValue={settings?.NZBGetUsername ?? ''} onChange={(e)=>setSettings({...settings, NZBGetUsername: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">NZBGet Password</label>
                    <input defaultValue={settings?.NZBGetPassword ?? ''} onChange={(e)=>setSettings({...settings, NZBGetPassword: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Downloads Completed Path (container)</label>
                    <input defaultValue={settings?.DownloadsCompletedPath ?? '/data/downloads/completed'} onChange={(e)=>setSettings({...settings, DownloadsCompletedPath: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 rounded text-gray-200" />
                    <div className="text-xs text-gray-500 mt-1">Default is /data/downloads/completed — ensure Deluge/NZBGet write completed files there or bind mount.</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => saveSettings(settings)} className="px-3 py-2 bg-blue-600 rounded">Save</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
