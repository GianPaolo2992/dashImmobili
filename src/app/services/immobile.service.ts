import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
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

  searchImmobile(keyword: string): Observable<ImmobileModel[]> {
    return this.http.get<ImmobileModel[]>(`${this.baseUrl}/search?keyword=${keyword}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Errore del client
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Errore del server
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
