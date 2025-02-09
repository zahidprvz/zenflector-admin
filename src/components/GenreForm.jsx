import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Import Box
import Typography from '@mui/material/Typography'; //For Errors
import Alert from '@mui/material/Alert'; // Import Alert.
import { v4 as uuidv4 } from 'uuid';

const GenreForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState(null); // State for submission errors


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
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
    setSubmitError(null); // Reset error before submitting
    const genreData = {
        id: uuidv4(), // Generate a unique ID
        name: data.name,
        imageUrl: null, // Initialize as null
    };

    try {
        await onSubmit(genreData, imageFile);  //Now passes file.
        setImageFile(null);
        setImagePreview(null); //Also reset the preview
    } catch (error) {
      console.error("Error submitting form:", error); // Log the error.
      setSubmitError(error.message || "An unexpected error occurred."); // Set the error state.

    }

  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ mt: 2 }} noValidate>
        <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Genre Name"
            {...register("name", { required: "Genre name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
        />

        <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleImageChange}
        />
        <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" sx={{ mt: 1, mb: 2 }}>
            Upload Image
            </Button>
        </label>
        {imagePreview && (
            <Box sx={{ mt: 2, mb: 2 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </Box>
        )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Add Genre
      </Button>
      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}
    </Box>
  );
};

export default GenreForm;