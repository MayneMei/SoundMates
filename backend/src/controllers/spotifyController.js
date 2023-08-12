const axios = require("axios");
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

class SpotifyController {
  async getTop(type, term, accessToken) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}?limit=5&time_range=${term}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.items;
    } catch (error) {
      throw new Error(`Error fetching top ${type}: ` + error.message);
    }
  }

  async getTopTracks(accessToken) {
    return this.getTop("tracks", "long_term", accessToken);
  }

  async getTopArtists(accessToken) {
    return this.getTop("artists", "long_term", accessToken);
  }
  async getRecentMostPlays(accessToken) {
    return this.getTop("artists", "short_term", accessToken);
  }

  async getTopGenres(accessToken) {
    try {
      const recentPlays = await this.getRecentPlays(accessToken);
      const artistIds = [
        ...new Set(recentPlays.map((track) => track.artists[0].id)),
      ]; // Get unique artist IDs

      const artistGenres = await Promise.all(
        artistIds.map((id) => this.getArtist(id, accessToken))
      );
      const genresCounts = {};

      artistGenres.forEach((artist) => {
        artist.genres.forEach((genre) => {
          genresCounts[genre] = (genresCounts[genre] || 0) + 1;
        });
      });

      const topGenres = Object.entries(genresCounts)
        .sort(([, aCount], [, bCount]) => bCount - aCount)
        .slice(0, 5)
        .map(([genre]) => genre);

      return topGenres;
    } catch (error) {
      throw new Error("Error fetching top genres: " + error.message);
    }
  }

  // Additional helper function to get artist by ID
  async getArtist(artistId, accessToken) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching artist data: ` + error.message);
    }
  }

  async getTopAlbums(accessToken) {
    try {
      const recentPlays = await this.getRecentPlays(accessToken);
      const albumCounts = {};

      recentPlays.forEach((track) => {
        const albumName = track.album.name;
        const albumId = track.album.id;
        const artistName = track.album.artists[0].name;
        if (albumCounts[albumName]) {
          albumCounts[albumName].count += 1;
        } else {
          albumCounts[albumName] = {
            name: albumName,
            id: albumId,
            artist: artistName,
            count: 1,
          };
        }
      });

      const topAlbums = Object.values(albumCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((album) => ({
          name: album.name,
          id: album.id,
          artist: album.artist,
        }));

      return topAlbums;
    } catch (error) {
      throw new Error("Error fetching top albums: " + error.message);
    }
  }

  async getRecentPlays(accessToken) {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.items.map((item) => item.track);
    } catch (error) {
      throw new Error("Error fetching recent plays: " + error.message);
    }
  }
}

module.exports = SpotifyController;
