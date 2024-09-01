// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };