import React, { useEffect, useState } from "react";
import { useContext } from "react";
import "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setcurrentUser] = useState();

  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth,(user)=>{
      setcurrentUser(user);
      setLoading(false);
    });
    return unSubscribe;
  }, [])

  // signup function
 async function signup(email,password,username){
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth,email,password);

  // update profile
    await updateProfile(auth.currentUser, {
      displayName: username
    });

    const user = auth.currentUser;
    setcurrentUser({
      ...user,
    })

  }
  // login function
  function login(email,passeord){
    const auth = getAuth();
    return signInWithEmailAndPassword(auth,email,passeord);

  }
  // logout function
  function logout(){
    const auth = getAuth();
    return signOut(auth);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
