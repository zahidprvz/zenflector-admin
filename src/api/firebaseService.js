// src/api/firebaseService.js
import { db, storage } from '../../firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseService = {
    getGenres: async () => {
        const genresCol = collection(db, 'genres');
        const genreSnapshot = await getDocs(genresCol);
        const genreList = genreSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return genreList;
    },

    addGenre: async (genre) => {
        const newGenreRef = doc(collection(db, "genres"), genre.id); // Explicitly set the document ID
        await setDoc(newGenreRef, genre); // Use setDoc when you provide the ID
    },

    uploadGenreImage: async (file) => {
        if (!file) return null;

        try {
            // CORRECTED PATH: Include 'audio/' prefix
            const storageRef = ref(storage, `audio/genre_images/${uuidv4()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.error("Error uploading image:", error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (urlError) {
                            reject(urlError);
                        }
                    });
            });

        } catch (error) {
            console.error("Error in uploadGenreImage: ", error);
            throw error;
        }
    },


  uploadAudioFile: async (file, genreId) => {
        if (!file) return null;
        try {
            // Corrected to remove genreId
            const storageRef = ref(storage, `audio/${uuidv4()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
              uploadTask.on('state_changed',
                (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                },
                (error) => { //Error Handling
                  console.error("Error uploading audio:", error);
                  reject(error); // Reject the promise on error
                },
                async () => { // On Complete
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL); // Resolve with the download URL
                    } catch (urlError) {
                        reject(urlError); // Reject if getDownloadURL fails.
                    }

                });
            });
        } catch(error) {
            console.error("Error in uploadAudioFile: ", error);
            throw error; // Re-throw for handling in calling function.
        }

    },

    addAudio: async (audio) => {
        const newAudioRef = doc(collection(db, 'audio'), audio.id)
        await setDoc(newAudioRef, audio); // Use setDoc with a specific ID
    },
};

export default firebaseService;