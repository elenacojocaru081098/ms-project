// Import the functions you need from the SDKs you need
import { firebaseConfig } from '~/../firebase.config'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)

auth.useDeviceLanguage()

export { app, analytics, auth, db }
