import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {ImmobileModel} from "../models/immobile.model";

@Injectable({
  providedIn: 'root'
})
export class ImmobileService {
  private http = inject(HttpClient);
  private baseUrl= 'http://localhost:8080/immobile';
  private getAll = `${this.baseUrl}/getAllImmobili`;
  private getByID = `${this.baseUrl}/getImmobileById`;
  private insert=`${this.baseUrl}/insertImmobile`;
  private update=`${this.baseUrl}/updateImmobile`;
  private delete=`${this.baseUrl}/deleteImmobileById`;
  listaImmobili$ = new BehaviorSubject<ImmobileModel[]>([]);
  constructor() { }

  getAllImmobili(): Observable<ImmobileModel[]>{
    return this.http.get<ImmobileModel[]>(this.getAll).pipe(
        tap(data => this.listaImmobili$.next(data))
    );
  }

  getListaImmobili$(): Observable<ImmobileModel[]> {
    return this.listaImmobili$.asObservable();
  }

  getImmobileById(immobile:ImmobileModel):Observable<ImmobileModel>{
    return this.http.get<ImmobileModel>(`${this.getByID}/${immobile.id}`);
  }

  insertImmobile(immobile:ImmobileModel):Observable<ImmobileModel>{
    return  this.http.post<ImmobileModel>(this.insert, immobile);
  }
 updateImmobile(immobile:ImmobileModel):Observable<ImmobileModel>{
    return  this.http.put<ImmobileModel>(`${this.update}/${immobile.id}`, immobile);
  }
 deleteImmobile(id:number):Observable<ImmobileModel>{
    return  this.http.delete<ImmobileModel>(`${this.delete}/${id}`);
  }


}
