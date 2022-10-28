import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';



import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA6oTXybveQ2C2qZstB9wnO-JbUD6mEtvk",
  authDomain: "chats-app-c03b5.firebaseapp.com",
  projectId: "chats-app-c03b5",
  storageBucket: "chats-app-c03b5.appspot.com",
  messagingSenderId: "10589190782",
  appId: "1:10589190782:web:c2193dd27ad74ee387b62f"

})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();




function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
    <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }

  return (
    <button onClick ={signInWithGoogle }>Sign in with Google</button>
  )


}

function SignOut() {
  return auth.currentUser && (
    <button onClick={ () => auth.signOut ()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('message');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)} 

      <div ref={dummy}> </div>
      
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Hello" />

      <button type="submit" disabled={!formValue}> </button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
    <div className={`message ${messageClass}`}>
      {/* <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} /> */}
      <p>{text}</p>
    </div>

  </>
  )
}




export default App;




