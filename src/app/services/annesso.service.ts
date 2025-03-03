import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
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
private search= `${this.baseUrl}/search`;
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
  searchAnnessi(keyword: string): Observable<AnnessoModel[]> {
    return this.http.get<AnnessoModel[]>(`${this.baseUrl}/search?keyword=${keyword}`)
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
