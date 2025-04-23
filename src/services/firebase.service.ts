import { config } from '@/config/app';
import { CollectionValue } from '@/config/collections';
import { ref } from 'firebase/database';
import { update } from 'firebase/database';
import {
  documentId,
  QueryConstraint,
  query,
  getCountFromServer,
  doc,
  getDoc,
  getDocs,
  DocumentSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { addDoc, collection, DocumentData, serverTimestamp } from 'firebase/firestore';

/**
 * Exports the documentId function from Firestore
 * Used to create a query constraint that compares the document ID
 */
export const getDocumentId = documentId;

/**
 * Retrieves a document from Firestore by its collection and ID
 *
 * @param _collection - The collection name to get the document from
 * @param _id - The document ID to retrieve
 * @returns A Promise that resolves to the DocumentSnapshot
 */
export async function getDocument(_collection: CollectionValue, _id: string): Promise<DocumentSnapshot> {
  const docRef = doc(config.firebase.db, _collection, _id);
  const docSnap = await getDoc(docRef);

  return docSnap;
}

/**
 * Retrieves multiple documents from a collection based on query constraints
 *
 * @param _collection - The collection name to query
 * @param queryConstraints - The constraints to apply to the query (where, orderBy, limit, etc.)
 * @returns An object containing data array, document snapshots, and the last visible document (for pagination)
 */
export const getDocumentsByCondition = async (_collection: CollectionValue, ...queryConstraints: QueryConstraint[]) => {
  const data: DocumentData[] = [];
  const colRef = collection(config.firebase.db, _collection);
  const q = query(colRef, ...queryConstraints);
  const documentSnapshots = await getDocs(q);

  documentSnapshots.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  // Get the last visible document
  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

  return { data, documentSnapshots, lastVisible };
};

/**
 * Generates a new document ID for a specific collection path
 * Useful when you need an ID before creating the document
 *
 * @param path - The collection path to generate an ID for
 * @returns A new document ID string
 */
export const getNewKey = (path: string) => {
  const colRef = collection(config.firebase.db, path);
  return doc(colRef).id;
};

/**
 * Adds a new document to a collection with auto-generated ID
 * Also adds a createdAt timestamp field
 *
 * @param _collection - The collection to add the document to
 * @param data - The document data to be added
 * @returns A Promise that resolves to the document reference
 */
export const addDocument = async <T extends object>(_collection: CollectionValue, data: T): Promise<DocumentData> => {
  const colRef = collection(config.firebase.db, _collection);

  const result = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });

  return result;
};

/**
 * Counts the number of documents in a collection that match the given query constraints
 *
 * @param _collection - The collection to count documents from
 * @param queryConstraints - The constraints to apply to the query
 * @returns A Promise that resolves to the count number
 */
export const getCount = async (_collection: CollectionValue, ...queryConstraints: QueryConstraint[]) => {
  const colRef = collection(config.firebase.db, _collection);
  const q = query(colRef, ...queryConstraints);
  const snapshot = await getCountFromServer(q);

  return snapshot.data().count;
};

/**
 * Retrieves the data from a document by its collection and ID
 * Returns null if the document doesn't exist
 *
 * @param collection - The collection name
 * @param id - The document ID
 * @returns A Promise that resolves to the document data or null
 */
export async function getData(collection: CollectionValue, id: string): Promise<DocumentData | null> {
  const docRef = doc(config.firebase.db, collection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }

  return null;
}

/**
 * Retrieves documents from a collection based on query constraints
 * Similar to getDocumentsByCondition but with a simpler return format
 *
 * @param path - The collection path
 * @param queryConstraints - The constraints to apply to the query
 * @returns A Promise that resolves to an array of documents with their IDs
 */
export async function getDataByConditions(path: string, ...queryConstraints: QueryConstraint[]) {
  const colRef = collection(config.firebase.db, path);
  const queryRef = query(colRef, ...queryConstraints);
  const querySnapshot = await getDocs(queryRef);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

/**
 * Creates or overwrites a document with a specific ID
 * Unlike addDocument, this requires specifying the document ID
 * Also adds a createdAt timestamp field
 *
 * @param _collection - The collection to set the document in
 * @param id - The document ID to create or overwrite
 * @param data - The document data
 * @returns A Promise that resolves when the operation is complete
 */
export const setDocument = async <T extends object>(_collection: CollectionValue, id: string, data: T) => {
  const docRef = doc(config.firebase.db, _collection, id);

  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

/**
 * Updates multiple paths in the Realtime Database
 * Different from Firestore updates - this is for Firebase Realtime Database
 *
 * @param updates - Object containing the paths to update and their new values
 * @returns A Promise that resolves when the update is complete
 */
export const updateData = async <T extends object>(updates: T) => {
  const dbRef = ref(config.firebase.database);
  await update(dbRef, updates);
};

/**
 * Updates fields in a Firestore document with the provided data
 * Only updates the fields provided in the data object
 *
 * @param _collection - The collection containing the document
 * @param id - The document ID to update
 * @param data - The fields to update and their new values
 * @returns A Promise that resolves when the update is complete
 */
export default async function updateDocument<T extends object>(_collection: CollectionValue, id: string, data: T) {
  const docRef = doc(config.firebase.db, _collection, id);

  await updateDoc(docRef, {
    ...data,
  });
}
