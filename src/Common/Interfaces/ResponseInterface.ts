export interface ResponseProvider {
  etat: boolean;
  result?: any;
  error?: Error;
}

export interface ResponseProviderFinal {
  etat: boolean;
  result?: any;
  error?: string[] | string;
}
