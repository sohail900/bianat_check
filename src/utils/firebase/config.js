import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration for the chatbot app
const firebaseConfigChatBot = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_API_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase apps
const appChatBot =
    getApps().find((app) => app.name === 'chatbot') ||
    initializeApp(firebaseConfigChatBot, 'chatbot')

export const authChatBot = getAuth(appChatBot)
export const dbChatBot = getFirestore(appChatBot)
export const storageChatBot = getStorage(appChatBot)
