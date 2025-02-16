import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography,
    Alert, CircularProgress, IconButton, Grid
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import firebaseService from '../api/firebaseService';

const AudioForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [audioFileName, setAudioFileName] = useState('');
    const [audioPreview, setAudioPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const fetchedGenres = await firebaseService.getGenres();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setSubmitError("Failed to load genres: " + error.message);
            }
        };
        fetchGenres();
    }, []);

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setAudioFileName(file.name);

            const audioURL = URL.createObjectURL(file);
            setAudioPreview(audioURL);
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
        setAudioFileName('');
        setAudioPreview(null);
    };

    const clearImageSelection = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const onSubmitForm = async (data) => {
        setSubmitError(null);
        if (!audioFile) {
            alert("Please select an audio file.");
            return;
        }
        if (!selectedGenre) {
            alert("Please select a genre.");
            return;
        }
        if (!minutes || !seconds) {
            alert("Please enter the duration in minutes and seconds.");
            return;
        }

        const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);

        const audioData = {
            id: uuidv4(),
            title: data.title,
            artist: data.artist,
            genreId: selectedGenre,
            description: data.description, // New: Audio Description
            duration: totalSeconds, // Converted from minutes and seconds
            imageUrl: null,
            fileUrl: null,
        };

        try {
            setIsUploading(true);
            await onSubmit(audioData, audioFile, imageFile);
            reset();
            setMinutes('');
            setSeconds('');
            clearAudioSelection();
            clearImageSelection();
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitError(error.message || "An unexpected error occurred.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ mt: 2 }} noValidate>
            {/* Title */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Audio Title"
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
            />

            {/* Artist */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="artist"
                label="Artist"
                {...register("artist", { required: "Artist is required" })}
                error={!!errors.artist}
                helperText={errors.artist?.message}
            />

            {/* Genre */}
            <FormControl fullWidth margin="normal" required>
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    error={!selectedGenre}
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
                {!selectedGenre && (
                    <Typography color="error">Genre is required</Typography>
                )}
            </FormControl>

            {/* Audio Description */}
            <TextField
                margin="normal"
                fullWidth
                multiline
                rows={4}
                id="description"
                label="Audio Description"
                {...register("description")}
            />

            {/* Duration Input */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="minutes"
                        label="Minutes"
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        inputProps={{ min: 0 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="seconds"
                        label="Seconds"
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        inputProps={{ min: 0, max: 59 }}
                    />
                </Grid>
            </Grid>

            {/* Audio File Upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Button variant="contained" component="label">
                    Select Audio File
                    <input hidden accept="audio/*" type="file" onChange={handleAudioChange} />
                </Button>
                {audioFileName && (
                    <>
                        <Typography variant="body2">{audioFileName}</Typography>
                        <IconButton onClick={clearAudioSelection} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Audio Preview */}
            {audioPreview && (
                <Box sx={{ mt: 2 }}>
                    <audio controls src={audioPreview} />
                </Box>
            )}

            {/* Image File Upload */}
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

            {/* Image Preview */}
            {imagePreview && (
                <Box sx={{ mt: 2 }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </Box>
            )}

            {/* Submit Button */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isUploading}>
                {isUploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload Audio"}
            </Button>

            {/* Error Message */}
            {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {submitError}
                </Alert>
            )}
        </Box>
    );
};

export default AudioForm;
