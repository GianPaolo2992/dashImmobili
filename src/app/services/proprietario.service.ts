import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProprietarioModel } from '../models/proprietario.model';
import {BehaviorSubject, Observable, tap} from 'rxjs';
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

  getAllProprietarioById(proprietario:ProprietarioModel): Observable<ProprietarioModel> {
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

}

