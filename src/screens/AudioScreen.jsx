import React, { useState, useEffect } from 'react';
import firebaseService from '../api/firebaseService';
import AudioForm from '../components/AudioForm';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Alert from '@mui/material/Alert';

const AudioScreen = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAudio = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming you have a method to fetch all audio files
                //  (you might need to add getAllAudio() to firebaseService)
                // const fetchedAudio = await firebaseService.getAllAudio();
                const fetchedAudio = []; // Replace with actual fetch. For now use [].
                setAudioFiles(fetchedAudio);
            } catch (error) {
                console.error("Error fetching audio:", error);
                setError('Failed to fetch audio files. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAudio();
    }, []);

    const handleAudioSubmit = async (audioData, audioFile, imageFile) => {
      setLoading(true);
      setError(null);

      try{
        let imageUrl = audioData.imageUrl;
        //upload image
        if(imageFile){
          imageUrl = await firebaseService.uploadGenreImage(imageFile); // Using the same function as genre image upload.
          if(!imageUrl){
            throw new Error("Image upload failed");
          }
        }
        //upload audio
        const fileUrl = await firebaseService.uploadAudioFile(audioFile, audioData.genreId);

        if (!fileUrl) {
          throw new Error("Audio upload failed."); // Throw error to be caught below
        }
        const finalAudioData = { ...audioData, fileUrl: fileUrl, imageUrl: imageUrl};
        await firebaseService.addAudio(finalAudioData);

        // Instead of fetching all data again, we'll just add the new audio
        // to the local state.  This is more efficient. For a real app with
        // multiple admins, you *might* want to re-fetch.
        setAudioFiles([...audioFiles, finalAudioData]);
        setLoading(false);

      } catch(error){
        setError(error.message);
        setLoading(false)
      }
    };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Audio
      </Typography>
      <AudioForm onSubmit={handleAudioSubmit} />
      <Divider sx={{ my: 2 }} />
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h5" gutterBottom>
        Existing Audio Files
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>

          <CircularProgress />
        </Box>
      ) : (
        <List>
          {audioFiles.map((audio) => (
            <ListItem key={audio.id}>
              <ListItemAvatar>
                <Avatar>
                  <MusicNoteIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={audio.title}
                secondary={`${audio.artist} - ${audio.genreId}`}
              />
              {/* Add delete/edit functionality here later */}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AudioScreen;