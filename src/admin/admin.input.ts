export interface AdminInterfaceInput {
  firstname: string;
  password: string;
  sexe: string;
  contact: string;
}

export interface ServiceInput {
  title: string;
  price: string;
}
export interface FactureInput {
  serviceId: string;
  professionalId: string;
}

export interface ProfessionelInput {
  name: string;
  contact: string;
}