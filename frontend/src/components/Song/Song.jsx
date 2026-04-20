import React, { useState, useEffect, useRef } from 'react'
import './Song.css'

// Utilisation des variables d'environnement injectées ou fallback localhost
const BACKEND_URL = window._env_?.VITE_BACKEND_URL || 'http://localhost:5000'
const MINIO_URL = window._env_?.VITE_MINIO_URL || 'http://localhost:9000'

function App({ keycloak }) {
  const [songs, setSongs] = useState([])
  const [view, setView] = useState('home') // 'home', 'search', 'favorites', 'playlist'
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [volume, setVolume] = useState(0.8)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  const userId = keycloak?.tokenParsed?.sub;

  // Charger les chansons globales
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/songs`)
      .then(res => res.json())
      .then(data => {
        setSongs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur chargement songs:', err)
        setError('Erreur de connexion serveur')
        setLoading(false)
      })
  }, [])

  // Charger les favoris et playlist depuis la DB
  useEffect(() => {
    if (userId) {
      // Fetch Favorites
      fetch(`${BACKEND_URL}/api/users/${userId}/favorites`)
        .then(res => res.json())
        .then(data => setFavorites(data.map(s => s.id)))
        .catch(err => console.error('Error loading favorites from DB:', err));

      // Fetch Playlist
      fetch(`${BACKEND_URL}/api/users/${userId}/playlist`)
        .then(res => res.json())
        .then(data => setPlaylist(data.map(s => s.id)))
        .catch(err => console.error('Error loading playlist from DB:', err));
    }
  }, [userId]);

  // Filtrage selon la vue et la recherche
  const getFilteredSongs = () => {
    let list = songs
    if (view === 'favorites') {
      list = songs.filter(s => favorites.includes(s.id))
    } else if (view === 'playlist') {
      list = songs.filter(s => playlist.includes(s.id))
    }

    if (searchTerm) {
      list = list.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.artistName || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return list
  }

  const filteredSongs = getFilteredSongs()

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Lecture bloquée:', e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const handleSongSelect = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)
  }

  const toggleFavorite = async (e, songId) => {
    e.stopPropagation()
    const isFav = favorites.includes(songId);

    try {
      if (isFav) {
        // Remove from DB
        const res = await fetch(`${BACKEND_URL}/api/users/${userId}/favorites/${songId}`, { method: 'DELETE' });
        if (res.ok) {
          setFavorites(prev => prev.filter(id => id !== songId));
        } else {
          console.error("Erreur backend lors de la suppression du favori");
        }
      } else {
        // Add to DB
        await fetch(`${BACKEND_URL}/api/users/${userId}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId })
        });
        setFavorites(prev => [...prev, songId]);
      }
    } catch (err) {
      console.error('Failed to update favorite in DB:', err);
    }
  }

  const togglePlaylist = async (e, songId) => {
    e.stopPropagation()
    const isInPlaylist = playlist.includes(songId);

    try {
      if (isInPlaylist) {
        await fetch(`${BACKEND_URL}/api/users/${userId}/playlist/${songId}`, { method: 'DELETE' });
        setPlaylist(prev => prev.filter(id => id !== songId));
      } else {
        await fetch(`${BACKEND_URL}/api/users/${userId}/playlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId })
        });
        setPlaylist(prev => [...prev, songId]);
      }
    } catch (err) {
      console.error('Failed to update playlist in DB:', err);
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(isNaN(pct) ? 0 : pct)
    }
  }

  const handleProgressClick = (e) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = pct * audioRef.current.duration
    }
  }

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  }

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  }

  const audioUrl = currentSong ? `${MINIO_URL}/music-bucket/${currentSong.audioKey}` : null
  const coverUrl = currentSong?.coverKey ? `${MINIO_URL}/music-bucket/${currentSong.coverKey}` : null

  return (
    <div className="app">
      <aside className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`}>

        <nav className="nav">
          <div onClick={() => { setView('home'); setSearchTerm('') }} className={`nav-item ${view === 'home' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z" /></svg> Accueil
          </div>
          <div onClick={() => setView('search')} className={`nav-item ${view === 'search' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg> Recherche
          </div>
        </nav>

        <div className="sidebar-section">
          <h3 onClick={() => setView('playlist')} style={{ cursor: 'pointer' }}>VOS PLAYLISTS</h3>
          <div onClick={() => setView('playlist')} className={`playlist-item ${view === 'playlist' ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={view === 'playlist' ? "var(--primary)" : "#a0a0a0"} style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z" />
            </svg>
            Ma playlist
          </div>
          <div onClick={() => setView('favorites')} className={`playlist-item ${view === 'favorites' ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={view === 'favorites' ? "var(--secondary)" : "#a0a0a0"} style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Favoris
          </div>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <div style={{ color: '#a0a0a0', fontWeight: '500', marginBottom: '10px', padding: '0 12px' }}>
            {keycloak?.tokenParsed?.preferred_username}
          </div>
          <button className="btn-pill" style={{ width: '100%' }} onClick={() => keycloak.logout()}>Déconnexion</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left" style={{ display: 'flex', alignItems: 'center' }}>
            <button className="btn-pill" style={{ marginRight: '15px' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
            </button>
            <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer', marginRight: '30px', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              <span style={{ background: 'linear-gradient(to right, #ffffff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CloudStream</span>
            </div>
            {(view === 'search' || view === 'home') && (
              <div className="search-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#a0a0a0">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Que souhaitez-vous écouter ?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="view-title">
            {view === 'home' && "Votre Musique"}
            {view === 'favorites' && "Titres likés"}
            {view === 'playlist' && "Ma Playlist"}
            {view === 'search' && "Résultats"}
          </h1>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : error ? (
            <div className="error-msg">{error}</div>
          ) : (
            <div className="songs-grid">
              {filteredSongs.map((song) => {
                const songCover = song.coverKey ? `${MINIO_URL}/music-bucket/${song.coverKey}` : null;
                return (
                  <div key={song.id} className={`song-card ${currentSong?.id === song.id ? 'active' : ''}`} onClick={() => handleSongSelect(song)}>
                    <div className="song-cover" style={songCover ? { backgroundImage: `url(${songCover})` } : {}}>
                      {currentSong?.id === song.id && isPlaying && (
                        <div className="playing-bars"><span></span><span></span><span></span><span></span></div>
                      )}
                      {!songCover && currentSong?.id !== song.id && (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      )}
                      <button className="more-btn" onClick={(e) => togglePlaylist(e, song.id)} title={playlist.includes(song.id) ? "Retirer playlist" : "Ajouter playlist"}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={playlist.includes(song.id) ? "var(--primary)" : "#fff"}>
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                      <button className="heart-btn" onClick={(e) => toggleFavorite(e, song.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.includes(song.id) ? "var(--secondary)" : "#fff"}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <div className="play-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="song-info">
                      <p className="song-title">{song.title}</p>
                      <p className="song-artist">{song.artistName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* FLOAT PHONE WRAPPER */}
      {currentSong && (
        <div className="phone-wrapper-container">
          <div className="floating-player">
            <div className="floating-player-header">
              <div className="floating-player-title">
                <div className="vinyl-icon"></div>
                <div className="fp-texts">
                  <h3>Music system</h3>
                  <p>AiLiang UF-F39</p>
                </div>
              </div>
              <button
                onClick={() => { setCurrentSong(null); setIsPlaying(false) }}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="floating-cover-wrapper">
              <div className="floating-cover-half" style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}}></div>
            </div>

            <div className="progress-container">
              <div className="progress-time left">{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}</div>
              <div className="progress-time right">{audioRef.current && audioRef.current.duration ? Math.floor(audioRef.current.duration / 60) + ':' + Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : '0:00'}</div>
              <div className="progress-bar" onClick={handleProgressClick}>
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="floating-meta">
              <div className="meta-texts">
                <p className="song-title-large">{currentSong.title}</p>
                <p className="song-artist-small">{currentSong.artistName}</p>
              </div>
              <div className="floating-controls">
                <button className="ctrl-btn" onClick={handlePrev}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                <button className="ctrl-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
                <button className="ctrl-btn" onClick={handleNext}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {audioUrl && <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} autoPlay={isPlaying} />}
    </div>
  )
}

export default App
