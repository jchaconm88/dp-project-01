import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
const defaulPassword = 'D36@us3r_'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  // getCurrentUser(){
  //     return this.auth.currentUser;
  // }

  // createUser(email: string) {  
  //   return createUserWithEmailAndPassword(this.auth, email, defaulPassword)
  // }

  // async getDocument(collectionName: string, id: string) {
  //   let response: any

  //   const docRef = doc(this.firestore, collectionName, id);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     response = docSnap.data();
  //     response.id = docSnap.id
  //   } else {
  //     throw "No se encontró el registro"
  //   }

  //   return response
  // }

  // getLogData(collectionName: string, data: any, event: string) {
  //   let logData = {} as any
  //   logData.collection = collectionName
  //   logData.event = event
  //   logData.data = data
  //   logData.createBy = this.getCurrentUser()?.email
  //   logData.createAt = new Date()

  //   return logData
  // }

  // async addLog(collectionName: string, data: any, event: string){
  //   await addDoc(collection(this.firestore, 'app-logs'), this.getLogData(collectionName, data, event));
  // }

  // async addDocument(collectionName: string, data: any){
  //   data.createBy = this.getCurrentUser()?.email
  //   data.createAt = new Date()
  //   const docRef = await addDoc(collection(this.firestore, collectionName), data);
  //   await this.addLog(collectionName, data, 'add')
  //   return docRef.id
  // }

  // async addBatch(collectionName: string, dataList: any[]){
  //   const batch = writeBatch(this.firestore);
  //   for (var data of dataList) {
  //     data.createBy = this.getCurrentUser()?.email
  //     data.createAt = new Date()
  //     batch.set(doc(collection(this.firestore, collectionName)), data);      
  //     batch.set(doc(collection(this.firestore, 'app-logs')), this.getLogData(collectionName, data, 'batch'));
  //   }
  //   await batch.commit();
  // }

  // async updateDocument(collectionName: string, documentId: string, data: any) {
  //   data.updateBy = this.getCurrentUser()?.email
  //   data.updateAt = new Date()
  //   const docRef = doc(this.firestore, collectionName, documentId);
  //   await updateDoc(docRef, data);
  //   await this.addLog(collectionName, data, 'update')
  //   return docRef.id
  // }

  // async replaceDocument(collectionName: string, documentId: string, data: any) {
  //   const docRef = doc(this.firestore, collectionName, documentId);
  //   await setDoc(docRef, data);
  // }

  // async deleteDocument (collectionName: string, data: any) {
  //   await deleteDoc(doc(this.firestore, collectionName, data.id));
  //   await this.addLog(collectionName, data, 'delete')
  // }

  // async getCollectionWithFilter(collectionName: string, filter: string, value: unknown) {
  //     const response: any[] = []
      
  //     const restaurantRef = collection(this.firestore, collectionName);
  //     const q = query(restaurantRef, where(filter, '==', value));
  //     const querySnapshot = await getDocs(q);
  
  //     querySnapshot.forEach((doc) => {
  //         const item: any = doc.data()
  //         item.id = doc.id
  //         response.push(item)
  //     })    
  //     return response     
  // }

  // async getCollectionWithMultiFilter(collectionName: string, filterArray: any[]) {
  //     const response: any[] = []

  //     let filterQuery: any[] = []
  //     filterArray.forEach(element => {
  //       filterQuery.push(where(element.filter, element.operator, element.value))
  //     });
      
  //     const restaurantRef = collection(this.firestore, collectionName);
  //     const q = query(restaurantRef, ...filterQuery);
  //     const querySnapshot = await getDocs(q);
  
  //     querySnapshot.forEach((doc) => {
  //         const item: any = doc.data()
  //         item.id = doc.id
  //         response.push(item)
  //     })    
  //     return response     
  // }

  getCollection(collectionName: string) {
    return runInInjectionContext(this.injector, () => {
    const restaurantRef = collection(this.firestore, collectionName);
    const q = query(restaurantRef, orderBy("createAt", "desc"));
    return collectionData(q, { idField: 'id' })
    })
  }
}
