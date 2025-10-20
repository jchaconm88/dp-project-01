// src/app/shared/firestore.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { computed, Signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService<T extends DocumentData> {
  private firestore = inject(Firestore);

  private _data = signal<T[]>([]);
  public data = computed(() => this._data());

  constructor() {}

  getCollection(ref: string): CollectionReference<T> {
    return collection(this.firestore, ref) as CollectionReference<T>;
  }

  loadAll(ref: string) {
    const col = this.getCollection(ref);
    collectionData(col, { idField: 'id' }).subscribe((items) => this._data.set(items as T[]));
  }

  search(ref: string, field: keyof T, value: any) {
    const col = this.getCollection(ref);
    const q = query(col, where(field as string, '==', value));
    collectionData(q, { idField: 'id' }).subscribe((items) => this._data.set(items as T[]));
  }

  add(ref: string, item: T): Promise<void> {
    const col = this.getCollection(ref);
    return addDoc(col, item).then(() => {});
  }
}
