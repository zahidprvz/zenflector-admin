import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography,
    Alert, CircularProgress, IconButton, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import firebaseService from '../api/firebaseService';

const EditAudio = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [audio, setAudio] = useState(null);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const audioData = await firebaseService.getAudioFileById(id);
                setAudio(audioData);
                setSelectedGenre(audioData.genreId || '');

                setMinutes(Math.floor(audioData.duration / 60).toString());
                setSeconds((audioData.duration % 60).toString());

                if (audioData.fileUrl) setAudioPreview(audioData.fileUrl);
                if (audioData.imageUrl) setImagePreview(audioData.imageUrl);

                const fetchedGenres = await firebaseService.getGenres();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error("Error fetching audio:", error);
                setError("Failed to fetch audio details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setAudioPreview(URL.createObjectURL(file));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const clearAudioSelection = () => {
        setAudioFile(null);
        setAudioPreview(audio?.fileUrl || null);
    };

    const clearImageSelection = () => {
        setImageFile(null);
        setImagePreview(audio?.imageUrl || null);
    };

    const handleUpdate = async () => {
        if (!audio.title || !audio.artist || !selectedGenre || !minutes || !seconds) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
        setUpdating(true);
    
        try {
            let updatedAudio = { 
                ...audio, 
                genreId: selectedGenre, 
                duration: totalSeconds 
            };
    
            await firebaseService.updateAudioFile(id, updatedAudio, audioFile, imageFile);
    
            alert("Audio updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error updating audio:", error);
            setError("Failed to update audio.");
        } finally {
            setUpdating(false);
        }
    };
    
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", mt: 3 }}>
            <Typography variant="h5">Edit Audio</Typography>

            {/* Show updating text and progress indicator */}
            {updating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body1">Updating audio file, please wait...</Typography>
                </Box>
            )}

            {/* Title */}
            <TextField
                fullWidth
                label="Title"
                value={audio.title}
                onChange={(e) => setAudio({ ...audio, title: e.target.value })}
                sx={{ mt: 2 }}
            />

            {/* Artist */}
            <TextField
                fullWidth
                label="Artist"
                value={audio.artist}
                onChange={(e) => setAudio({ ...audio, artist: e.target.value })}
                sx={{ mt: 2 }}
            />

            {/* Genre */}
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Genre</InputLabel>
                <Select value={selectedGenre} onChange={handleGenreChange}>
                    {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Description */}
            <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={audio.description}
                onChange={(e) => setAudio({ ...audio, description: e.target.value })}
                sx={{ mt: 2 }}
            />

            {/* Duration Input */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Minutes"
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        inputProps={{ min: 0 }}
                        sx={{ mt: 2 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Seconds"
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        inputProps={{ min: 0, max: 59 }}
                        sx={{ mt: 2 }}
                    />
                </Grid>
            </Grid>

            {/* Audio Upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button variant="contained" component="label">
                    Select Audio File
                    <input hidden accept="audio/*" type="file" onChange={handleAudioChange} />
                </Button>
                {audioPreview && (
                    <IconButton onClick={clearAudioSelection} color="error">
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>

            {audioPreview && <audio controls src={audioPreview} style={{ marginTop: 10 }} />}

            {/* Image Upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button variant="contained" component="label">
                    Upload Image
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                    <IconButton onClick={clearImageSelection} color="error">
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>

            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, marginTop: 10 }} />}

            {/* Update Button */}
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleUpdate} disabled={updating}>
                {updating ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Audio"}
            </Button>
        </Box>
    );
};

export default EditAudio;
