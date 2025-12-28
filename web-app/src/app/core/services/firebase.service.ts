import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, map, Observable, switchMap } from 'rxjs';
const defaulPassword = 'D36@us3r_'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService<T extends { id?: string }> {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  getCurrentUser() {
    return this.auth.currentUser;
  }

  createUser(email: string) {
    return createUserWithEmailAndPassword(this.auth, email, defaulPassword)
  }

  getDocument(collectionName: string, id: string): Observable<T> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `${collectionName}/${id}`);
      return docData(docRef, { idField: 'id' }) as Observable<T>
    })
  }

  addDocument(collectionName: string, data: T): Observable<any> {
    const payload = {
      ...data,
      createdBy: this.getCurrentUser()?.email,
      createdAt: new Date(),
    };

    return from(addDoc(collection(this.firestore, collectionName), payload));
  }

  async addBatch(collectionName: string, dataList: any[]) {
    const batch = writeBatch(this.firestore);
    for (var data of dataList) {
      data.createBy = this.getCurrentUser()?.email
      data.createAt = new Date()
      batch.set(doc(collection(this.firestore, collectionName)), data);
    }
    await batch.commit();
  }

  updateDocument(collectionName: string, documentId: string, data: Partial<T>): Observable<void> {
    const payload = {
      ...data,
      updateBy: this.getCurrentUser()?.email,
      updateAt: new Date(),
    };
    const docRef = doc(this.firestore, collectionName, documentId);
    return from(updateDoc(docRef, payload))
  }

  replaceDocument(collectionName: string, documentId: string, data: T): Observable<void> {
    const docRef = doc(this.firestore, collectionName, documentId);
    return from(setDoc(docRef, data))
  }

  deleteDocument(collectionName: string, data: any) {
    return from(deleteDoc(doc(this.firestore, collectionName, data.id)))
  }

  async getCollectionWithFilter(collectionName: string, filter: string, value: unknown) {
    const response: any[] = []

    const restaurantRef = collection(this.firestore, collectionName);
    const q = query(restaurantRef, where(filter, '==', value));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const item: any = doc.data()
      item.id = doc.id
      response.push(item)
    })
    return response
  }

  getCollectionWithMultiFilter(collectionName: string, filterArray: any[]) {
    let filterQuery: any[] = []
    filterArray.forEach(element => {
      filterQuery.push(where(element.filter, element.operator, element.value))
    });

    const restaurantRef = collection(this.firestore, collectionName);
    const q = query(restaurantRef, ...filterQuery);
    return collectionData(q, { idField: 'id' })
  }

  getCollection(collectionName: string) {
    return runInInjectionContext(this.injector, () => {
      const restaurantRef = collection(this.firestore, collectionName);
      const q = query(restaurantRef);
      return collectionData(q, { idField: 'id' })
    })
  }

  getFirst(collectionName: string, filter: string, value: unknown): Promise<any | null> {
    return runInInjectionContext(this.injector, async () => {
      const restaurantRef = collection(this.firestore, collectionName);
      const q = query(restaurantRef, where(filter, '==', value), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    })
  }
}
