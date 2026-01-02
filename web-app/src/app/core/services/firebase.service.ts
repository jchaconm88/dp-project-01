import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, Firestore, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
const defaulPassword = 'D36@us3r_'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService<T extends { id?: string }> {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  private collection(path: string) {
    return collection(this.firestore, path) as CollectionReference<T>;
  }

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

    return from(addDoc(this.collection(collectionName), payload));
  }

  async addBatch(collectionName: string, dataList: any[]) {
    const batch = writeBatch(this.firestore);
    for (var data of dataList) {
      data.createBy = this.getCurrentUser()?.email
      data.createAt = new Date()
      batch.set(doc(this.collection(collectionName)), data);
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

  deleteMany(path: string, items: T[]): Observable<void> {
    if (!items.length) {
      return of(void 0);
    }

    if (items.length > 500) {
      return throwError(() => new Error('Máximo 500 documentos por batch'));
    }
    const batch = writeBatch(this.firestore);

    items.forEach(item => {
      if (!item.id) return;
      const ref = doc(this.firestore, `${path}/${item.id}`);
      batch.delete(ref);
    });

    return from(batch.commit());
  }

  async getCollectionWithFilter(collectionName: string, filter: string, value: unknown) {
    const response: any[] = []

    const restaurantRef = this.collection(collectionName);
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

    const restaurantRef = this.collection(collectionName);
    const q = query(restaurantRef, ...filterQuery);
    return collectionData(q, { idField: 'id' })
  }

  getCollection(collectionName: string): Observable<T[]> {
    return runInInjectionContext(this.injector, () => {
      const restaurantRef = this.collection(collectionName);
      const q = query(restaurantRef);
      return collectionData(q, { idField: 'id' })
    })
  }

  getFirst(collectionName: string, filter: string, value: unknown): Promise<any | null> {
    return runInInjectionContext(this.injector, async () => {
      const restaurantRef = this.collection(collectionName);
      const q = query(restaurantRef, where(filter, '==', value), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    })
  }
}
