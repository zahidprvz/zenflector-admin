// src/screens/GenreScreen.js
import React, { useState, useEffect } from 'react';
import firebaseService from '../api/firebaseService';
import GenreForm from '../components/GenreForm';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Alert from '@mui/material/Alert';

const GenreScreen = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedGenres = await firebaseService.getGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError('Failed to fetch genres. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

    const handleGenreSubmit = async (genreData, imageFile) => {
    setLoading(true); // Start loading
    setError(null);   // Clear previous errors
    try {
        let imageUrl = genreData.imageUrl; // Keep existing URL if no new image

        // Only upload if a *new* image is selected
        if (imageFile) {
            imageUrl = await firebaseService.uploadGenreImage(imageFile);
            if (!imageUrl) { // image upload returned null
                throw new Error("Image upload failed.");  // Throw error to be caught in catch block
            }
        }
          const finalGenreData = {...genreData, imageUrl: imageUrl};
          await firebaseService.addGenre(finalGenreData); // Add the genre with new data.
          const updatedGenres = await firebaseService.getGenres(); //Refeteching
          setGenres(updatedGenres);
          setLoading(false);

    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Genres
      </Typography>
      <GenreForm onSubmit={handleGenreSubmit} />
      <Divider sx={{ my: 2 }} />
        {error && <Alert severity="error">{error}</Alert>} {/* Display error */}
      <Typography variant="h5" gutterBottom>
        Existing Genres
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>

      ) : (
        <List>
          {genres.map((genre) => (
            <ListItem key={genre.id}>
              <ListItemAvatar>
                <Avatar src={genre.imageUrl || null}>
                  {!genre.imageUrl && <ImageIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={genre.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default GenreScreen;