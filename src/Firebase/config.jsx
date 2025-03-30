import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCbjjrmkeMU8s561cPmUNrvY-QjMYFQWSc",
  authDomain: "e-commerce-76233.firebaseapp.com",
  projectId: "e-commerce-76233",
  storageBucket: "e-commerce-76233.firebasestorage.app",
  messagingSenderId: "663902104023",
  appId: "1:663902104023:web:053e55bba22c94d2390392",
  measurementId: "G-XKL6FJNKVG"
};

export const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
