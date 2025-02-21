import {ImmobileModel} from './immobile.model';

export interface ProprietarioModel {
  id?: number;
  nome: string;
  cognome:string;
  listaImmobiliDTO: ImmobileModel[];
}
