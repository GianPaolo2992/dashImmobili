import {ImmobileModel} from './immobile.model';



export interface AnnessoModel {
  id?:number;
  tipo:string ;
  superficie:number ;
  immobileDTO?:ImmobileModel ;
}
