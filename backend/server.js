require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES UTILISATEURS / KEYCLOAK SYNC ---

app.post('/api/users/sync', async (req, res) => {
  const { id, username, email } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing User ID' });

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { username, email },
      create: { id, username, email },
    });
    res.json(user);
  } catch (err) {
    console.error("Erreur Sync User:", err);
    res.status(500).json({ error: 'Erreur Sync' });
  }
});

// --- ROUTES MUSIQUES ---

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await prisma.song.findMany();
    res.json(songs);
  } catch (err) {
    console.error("Erreur Prisma :", err);
    res.status(500).json({ error: 'Erreur Serveur' });
  }
});

app.post('/api/songs', async (req, res) => {
  const { title, artistName, audioKey, coverKey } = req.body;
  if (!title || !artistName || !audioKey) {
    return res.status(400).json({ error: 'Champs obligatoires manquants: title, artistName, audioKey' });
  }
  try {
    const song = await prisma.song.create({
      data: { title, artistName, audioKey, coverKey: coverKey || null },
    });
    res.status(201).json(song);
  } catch (err) {
    console.error("Erreur création song:", err);
    res.status(500).json({ error: 'Erreur Serveur' });
  }
});

// --- ROUTES FAVORIS (1-à-1) ---

app.get('/api/users/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorite: { include: { songs: true } } }
    });
    res.json(user?.favorite?.songs || []);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/users/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { songId } = req.body;
  try {
    // Upsert the single favorite record for this user
    await prisma.favorite.upsert({
      where: { userId },
      create: { 
        userId,
        songs: { connect: { id: songId } } 
      },
      update: {
        songs: { connect: { id: songId } }
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ error: 'Failed' });
  }
});

app.delete('/api/users/:userId/favorites/:songId', async (req, res) => {
  const { userId, songId } = req.params;
  try {
    await prisma.favorite.update({
      where: { userId },
      data: {
        songs: { disconnect: { id: songId } }
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ error: 'Failed' });
  }
});

// --- ROUTES PLAYLIST (1-à-1) ---

app.get('/api/users/:userId/playlist', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { playlist: { include: { songs: true } } }
    });
    res.json(user?.playlist?.songs || []);
  } catch (err) {
    console.error("Error fetching playlist:", err);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/users/:userId/playlist', async (req, res) => {
  const { userId } = req.params;
  const { songId } = req.body;
  try {
    await prisma.playlist.upsert({
      where: { userId },
      create: { 
        userId, 
        name: "Ma Playlist",
        songs: { connect: { id: songId } }  
      },
      update: {
        songs: { connect: { id: songId } }
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding to playlist:", err);
    res.status(500).json({ error: 'Failed' });
  }
});

app.delete('/api/users/:userId/playlist/:songId', async (req, res) => {
  const { userId, songId } = req.params;
  try {
    await prisma.playlist.update({
      where: { userId },
      data: {
        songs: { disconnect: { id: songId } }
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error removing from playlist:", err);
    res.status(500).json({ error: 'Failed' });
  }
});



app.listen(port, () => {
  console.log(`🚀 Backend démarré sur le port ${port}`);
});