import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { ProprietarioModel } from '../models/proprietario.model';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {AnnessoModel} from '../models/annesso.model';
import {ImmobileModel} from '../models/immobile.model';

@Injectable({
  providedIn: 'root'
})
export class ProprietarioService {
  private http = inject(HttpClient);
  private listaProp$ = new BehaviorSubject<ProprietarioModel[]>([]);

  private baseUrl = 'http://localhost:8080/proprietari';
  private getAll = `${this.baseUrl}/getAllProprietari`;
  private getById = `${this.baseUrl}/getProprietariById/`;
  private delete = `${this.baseUrl}/deletePropById`;
  private update = `${this.baseUrl}/updatePropById`;

  private insertProprietario = `${this.baseUrl}/insertProp`;

  constructor() { }

  getAllProprietari(): Observable<ProprietarioModel[]> {
    return this.http.get<ProprietarioModel[]>(this.getAll).pipe(
      tap(data => this.listaProp$.next(data))
    );
  }
  getListaProprietari$(): Observable<ProprietarioModel[]> {
    return this.listaProp$.asObservable();
  }

  getProprietarioById(proprietario:ProprietarioModel): Observable<ProprietarioModel> {
    return this.http.get<ProprietarioModel>(`${this.getById}/${proprietario.id}`);
  }

  insertProp(proprietario:ProprietarioModel): Observable<ProprietarioModel> {
    return this.http.post<ProprietarioModel>(this.insertProprietario, proprietario);
  }
  updateProp(proprietario:ProprietarioModel):Observable<ProprietarioModel>{
    return this.http.put<ProprietarioModel>(`${this.update}/${proprietario.id}`, proprietario)
  }
  deleteProp(proprietarioId:number):Observable<ProprietarioModel> {
    return this.http.delete<ProprietarioModel>(`${this.delete}/${proprietarioId}`)
  }
  searchProp(keyword: string): Observable<ProprietarioModel[]> {
    return this.http.get<ProprietarioModel[]>(`${this.baseUrl}/search?keyword=${keyword}`)
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

