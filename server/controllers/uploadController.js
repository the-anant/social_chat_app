require('dotenv').config();
const { getStorage, ref, uploadBytes, getDownloadURL  } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage, 'Images');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[-:]/g, "").replace(/\.\d+/g, "");
    const filenameWithDate = `${formattedDate}_${file.originalname}`;
    const snapshot = await uploadBytes(ref(storageRef, filenameWithDate), file.buffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    res.json({
      success: true,
      file: {
        url: downloadURL
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
};
