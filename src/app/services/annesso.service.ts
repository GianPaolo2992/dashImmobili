import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {AnnessoModel} from '../models/annesso.model';

@Injectable({
  providedIn: 'root'
})
export class AnnessoService {
  private http = inject(HttpClient);
private baseUrl= 'http://localhost:8080/annessi';
private getAll=`${this.baseUrl}/getAllAnnessi`;
private insert= `${this.baseUrl}/insertAnnessi`;
private update= `${this.baseUrl}/updateAnnessi`;
private delete= `${this.baseUrl}/deleteAnnessi`;
 listaAnnessi$ = new BehaviorSubject<AnnessoModel[]>([]);
  constructor() { }

  getAllAnnessi():Observable<AnnessoModel[]>{
   return this.http.get<AnnessoModel[]>(this.getAll).pipe(
        tap(data => this.listaAnnessi$.next(data))
    );
  }


  getListaAnnessi$(): Observable<AnnessoModel[]> {
    return this.listaAnnessi$.asObservable();
  }


  insertAnnesso(annesso:AnnessoModel):Observable<AnnessoModel>{
    return this.http.post<AnnessoModel>(this.insert, annesso)
  }
  updateAnnesso(annesso:AnnessoModel):Observable<AnnessoModel>{
    return this.http.put<AnnessoModel>(`${this.update}/${annesso.id}`, annesso)
  }
  deleteAnnesso(annessoId:number):Observable<AnnessoModel> {
    return this.http.delete<AnnessoModel>(`${this.delete}/${annessoId}`)
  }
}
