import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { v4 as uuidv4 } from 'uuid';
import firebaseService from '../api/firebaseService';

const AudioForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [audioFileName, setAudioFileName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // Upload state

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
        } else {
            setAudioFile(null);
            setAudioFileName('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
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

        const audioData = {
            id: uuidv4(),
            title: data.title,
            artist: data.artist,
            genreId: selectedGenre,
            duration: parseInt(data.duration, 10),
            imageUrl: null,
            fileUrl: null,
        };

        try {
            setIsUploading(true); // Show loading
            await onSubmit(audioData, audioFile, imageFile);
            reset();
            setAudioFile(null);
            setAudioFileName('');
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitError(error.message || "An unexpected error occurred.");
        } finally {
            setIsUploading(false); // Hide loading after completion
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ mt: 2 }} noValidate>
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
            <FormControl fullWidth margin="normal" required>
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre"
                    value={selectedGenre}
                    label="Genre"
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
            <TextField
                margin="normal"
                required
                fullWidth
                id="duration"
                label="Duration (seconds)"
                type="number"
                {...register("duration", {
                    required: "Duration is required",
                    valueAsNumber: true,
                    validate: (value) =>
                        !isNaN(parseFloat(value)) && isFinite(value)
                            ? true
                            : "Must be a valid number",
                })}
                error={!!errors.duration}
                helperText={errors.duration?.message}
            />

            <input accept="audio/*" style={{ display: 'none' }} id="audio-file" type="file" onChange={handleAudioChange} />
            <label htmlFor="audio-file">
                <Button variant="contained" component="span" sx={{ mt: 1, mb: 2 }}>
                    Select Audio File
                </Button>
            </label>
            {audioFileName && (
                <Typography variant="body2">Selected File: {audioFileName}</Typography>
            )}

            <input accept="image/*" style={{ display: 'none' }} id="image-file" type="file" onChange={handleImageChange} />
            <label htmlFor="image-file">
                <Button variant="contained" component="span" sx={{ mt: 1, mb: 2 }}>
                    Upload Image
                </Button>
            </label>
            {imagePreview && (
                <Box sx={{ mt: 2, mb: 2 }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </Box>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isUploading}>
                {isUploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload Audio"}
            </Button>
            {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {submitError}
                </Alert>
            )}
        </Box>
    );
};

export default AudioForm;
