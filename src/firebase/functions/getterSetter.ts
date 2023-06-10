/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { db } from "../config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  CRUD_PATH_PROPERTIES,
  CrudMapOperationToParams,
  CrudMapPathToParams,
  CrudReturnType,
} from "../types";

export async function getAllDataFromPath(group: string) {
  const querySnapshot = await getDocs(collection(db, group));

  const data: any[] = [];
  querySnapshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return data;
}

export async function getDataFromPath(group: string, id: string) {
  const docRef = doc(db, group, id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists()
    ? {
        id,
        ...docSnap.data(),
      }
    : undefined;
}

export async function setDataToPath(group: string, data: object) {
  return addDoc(collection(db, group), data);
}

export async function updateDataToPath(
  group: string,
  data: object,
  id: string
) {
  const docRef = doc(db, group, id);

  return await updateDoc(docRef, data);
}

export async function crudData<K extends keyof CrudMapPathToParams>(
  path: K,
  params: CrudMapPathToParams[K]
) {
  const { type, collection, group = false } = CRUD_PATH_PROPERTIES[path];

  switch (type) {
    case "create":
      const { data: setData } =
        params as CrudMapOperationToParams<any>[typeof type];
      const dataRef = await setDataToPath(collection, setData);
      return {
        id: dataRef.id,
      } as CrudReturnType<K>;
    case "read":
      let readResult: any = undefined;
      const { id: readId } =
        params as CrudMapOperationToParams<any>[typeof type];
      if (group) {
        readResult = await getAllDataFromPath(collection);
      } else if (readId) {
        readResult = await getDataFromPath(collection, readId);
      }
      return readResult as CrudReturnType<K>;
    case "update":
      const { data: updateData, id: updateId } =
        params as CrudMapOperationToParams<any>[typeof type];

      delete updateData.id;

      await updateDataToPath(collection, updateData, updateId);
      break;
  }
  return null;
}
