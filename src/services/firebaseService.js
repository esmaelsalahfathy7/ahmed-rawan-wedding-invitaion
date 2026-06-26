import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const saveMessage = async (name, messageText, drawingDataUrl) => {
  try {
    console.log("Adding message...");
    const docRef = await addDoc(collection(db, "messages"), {
      name: name || "Anonymous",
      text: messageText || "",
      drawing: drawingDataUrl || "",
      timestamp: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (e) {
    console.error("Error adding message: ", e);
    return { success: false, error: e };
  }
};

export const getMessages = async () => {
  try {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: messages };
  } catch (e) {
    console.error("Error fetching messages: ", e);
    return { success: false, error: e, data: [] };
  }
};

export const saveRSVP = async (name, attending, additionalMessage) => {
  try {
    const docRef = await addDoc(collection(db, "rsvp"), {
      name,
      attending,
      message: additionalMessage || "",
      timestamp: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (e) {
    console.error("Error saving RSVP: ", e);
    return { success: false, error: e };
  }
};

export const getRSVPs = async () => {
  try {
    const q = query(collection(db, "rsvp"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const rsvps = [];
    querySnapshot.forEach((doc) => {
      rsvps.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: rsvps };
  } catch (e) {
    console.error("Error fetching RSVPs: ", e);
    return { success: false, error: e, data: [] };
  }
};

// export const uploadFile = async (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject("No file provided");
//       return;
//     }
//     const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // can track progress if needed
//       },
//       (error) => {
//         console.error("Upload failed:", error);
//         reject(error);
//       },
//       async () => {
//         try {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           // Save metadata to firestore
//           await addDoc(collection(db, "files"), {
//             name: file.name,
//             url: downloadURL,
//             timestamp: serverTimestamp(),
//           });
//           resolve({ success: true, url: downloadURL, name: file.name });
//         } catch (e) {
//           reject(e);
//         }
//       }
//     );
//   });
// };

export const uploadFile = async (file) => {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "wedding-invitation"); // اسم البريسيت
    formData.append("cloud_name", "dbuokdib9");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dbuokdib9/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || "Upload failed",
      };
    }

    return {
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      name: file.name,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};