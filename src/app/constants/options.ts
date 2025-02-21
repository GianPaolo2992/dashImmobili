export interface Option {
  value: string;
  label: string;
}

export const IMMOBILI_OPTIONS: Option[] = [
  { value: 'appartamento', label: 'Appartamento' },
  { value: 'villa', label: 'Villa' },
  { value: 'casa', label: 'Casa' },
  { value: 'attico', label: 'Attico' },
  { value: 'villetta_a_schiera', label: 'Villetta a Schiera' },
  { value: 'bifamiliare', label: 'Bifamiliare' },
  { value: 'trifamiliare', label: 'Trifamiliare' },
  { value: 'quadrifamiliare', label: 'Quadrifamiliare' },
  { value: 'loft', label: 'Loft' },
  { value: 'monolocale', label: 'Monolocale' },
  { value: 'bilocale', label: 'Bilocale' },
  { value: 'trilocale', label: 'Trilocale' },
  { value: 'attività_commerciale', label: 'Attività Commerciale' },
  { value: 'ufficio', label: 'Ufficio' },
  { value: 'magazzino', label: 'Magazzino' },
  { value: 'box_auto', label: 'Box Auto' },
  { value: 'terreno', label: 'Terreno' },
];

export const ANNESSI_OPTIONS: Option[] = [
  { value: 'garage', label: 'Garage' },
  { value: 'soffitta', label: 'Soffitta' },
  { value: 'cantina', label: 'Cantina' },
  { value: 'giardino', label: 'Giardino' },
  { value: 'terrazzo', label: 'Terrazzo' },
  { value: 'piscina', label: 'Piscina' },
  { value: 'dependance', label: 'Dependance' },
  { value: 'posto_auto', label: 'Posto Auto' },
  { value: 'ripostiglio', label: 'Ripostiglio' },
  { value: 'locale_tecnico', label: 'Locale Tecnico' },
];
