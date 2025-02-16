// src/api/firebaseService.js
import { db, storage } from '../../firebase';
import { 
    collection, getDocs, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
    ref, uploadBytesResumable, getDownloadURL, deleteObject 
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseService = {

    getAllAudioFiles: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "audio"));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching audio:", error);
            throw error;
        }
    },

    getAudioFileById: async (id) => {
        try {
            const docRef = doc(db, "audio", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching audio file:", error);
            throw error;
        }
    },

    updateAudioFile: async (id, updatedData, newAudioFile = null, newImageFile = null) => {
        try {
            const audioRef = doc(db, "audio", id);
            let { fileUrl, imageUrl } = updatedData; // Keep existing URLs if no new file is provided
    
            if (newAudioFile) {
                const audioStorageRef = ref(storage, `audio/${id}.mp3`); // Use the same path
                const uploadTask = uploadBytesResumable(audioStorageRef, newAudioFile);
                await uploadTask;
                fileUrl = await getDownloadURL(audioStorageRef);
            }
    
            if (newImageFile) {
                // Delete old image if it exists
                if (imageUrl) {
                    try {
                        const oldImageRef = ref(storage, imageUrl);
                        await deleteObject(oldImageRef);
                    } catch (error) {
                        console.warn("Error deleting old image:", error);
                    }
                }
    
                // Upload new image to the same location
                const imageStorageRef = ref(storage, `audio_images/${id}.jpg`);
                const uploadTask = uploadBytesResumable(imageStorageRef, newImageFile);
                await uploadTask;
                imageUrl = await getDownloadURL(imageStorageRef);
            }
    
            await updateDoc(audioRef, { 
                ...updatedData, 
                fileUrl, 
                imageUrl 
            });
    
            return true;
        } catch (error) {
            console.error("Error updating audio:", error);
            throw error;
        }
    },
    
    deleteAudioFile: async (id, fileUrl = null, imageUrl = null) => {
        try {
            await deleteDoc(doc(db, "audio", id));

            if (fileUrl) {
                try {
                    const audioRef = ref(storage, fileUrl);
                    await deleteObject(audioRef);
                } catch (error) {
                    console.warn("Error deleting audio file from storage:", error);
                }
            }

            if (imageUrl) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.warn("Error deleting image file from storage:", error);
                }
            }

            return true;
        } catch (error) {
            console.error("Error deleting audio file:", error);
            throw error;
        }
    },

    getGenres: async () => {
        try {
            const genresCol = collection(db, 'genres');
            const genreSnapshot = await getDocs(genresCol);
            return genreSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching genres:", error);
            throw error;
        }
    },

    addGenre: async (genre) => {
        try {
            const newGenreRef = doc(collection(db, "genres"), genre.id);
            await setDoc(newGenreRef, genre);
        } catch (error) {
            console.error("Error adding genre:", error);
            throw error;
        }
    },

    uploadGenreImage: async (file) => {
        if (!file) return null;
        try {
            const storageRef = ref(storage, `audio/genre_images/${uuidv4()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        console.log(`Upload is ${Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}% done`);
                    },
                    (error) => {
                        console.error("Error uploading genre image:", error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (urlError) {
                            reject(urlError);
                        }
                    }
                );
            });

        } catch (error) {
            console.error("Error in uploadGenreImage: ", error);
            throw error;
        }
    },

    uploadAudioFile: async (file) => {
        if (!file) return null;
        try {
            const storageRef = ref(storage, `audio/${uuidv4()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        console.log(`Upload is ${Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}% done`);
                    },
                    (error) => {
                        console.error("Error uploading audio:", error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (urlError) {
                            reject(urlError);
                        }
                    }
                );
            });

        } catch (error) {
            console.error("Error in uploadAudioFile: ", error);
            throw error;
        }
    },

    addAudio: async (audio) => {
        try {
            const newAudioRef = doc(collection(db, 'audio'), audio.id);
            await setDoc(newAudioRef, audio);
        } catch (error) {
            console.error("Error adding audio:", error);
            throw error;
        }
    },
};

export default firebaseService;
