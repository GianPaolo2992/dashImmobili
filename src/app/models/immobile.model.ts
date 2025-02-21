import {ProprietarioModel} from './proprietario.model';
import {AnnessoModel} from './annesso.model';


export interface ImmobileModel {
  id?:number;
  tipo:string;
  vani:number;
  costo:number ;
  superfice:number;
  anno:number ;
  proprietariDTO:ProprietarioModel;
  listaAnnessiDTO:AnnessoModel[];
}
