import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    CircularProgress,
    Box,
    Typography,
    Alert,
    Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import firebaseService from "../api/firebaseService";

const AudioList = () => {
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    // Fetch all audio files from Firebase
    const fetchAudios = async () => {
        setLoading(true);
        setError(null);
        try {
            const audioFiles = await firebaseService.getAllAudioFiles();
            setAudios(audioFiles);
        } catch (error) {
            console.error("Error fetching audio files:", error);
            setError("Failed to load audio files. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAudios();
    }, []);

    // Handle audio deletion
    const handleDelete = async (id, fileUrl, imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this audio?")) return;

        setDeleting(id);
        try {
            await firebaseService.deleteAudioFile(id, fileUrl, imageUrl);
            setAudios((prevAudios) => prevAudios.filter((audio) => audio.id !== id));
        } catch (error) {
            console.error("Error deleting audio:", error);
            setError("Failed to delete audio. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "auto", mt: 3, p: 2, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                🎵 Audio Files
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ textAlign: "center" }}>
                    <Alert severity="error">{error}</Alert>
                    <Button
                        startIcon={<RefreshIcon />}
                        sx={{ mt: 2 }}
                        variant="outlined"
                        onClick={fetchAudios}
                    >
                        Retry
                    </Button>
                </Box>
            ) : audios.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
                    No audio files found. Start uploading some!
                </Typography>
            ) : (
                <List>
                    {audios.map((audio) => (
                        <ListItem
                            key={audio.id}
                            onClick={() => navigate(`/edit-audio/${audio.id}`)}
                            sx={{
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "#f5f5f5" },
                                transition: "background 0.3s ease",
                            }}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(audio.id, audio.fileUrl, audio.imageUrl);
                                    }}
                                >
                                    {deleting === audio.id ? <CircularProgress size={24} /> : <DeleteIcon />}
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={audio.imageUrl || "/default-audio.png"} variant="rounded" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={audio.title || "Untitled"}
                                secondary={`🎤 Artist: ${audio.artist || "Unknown"} | ⏱ Duration: ${Math.floor(audio.duration / 60)}:${(audio.duration % 60).toString().padStart(2, "0")}s`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default AudioList;
