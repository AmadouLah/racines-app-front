export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VALIDATED_USER = 'VALIDATED_USER',
  PENDING_USER = 'PENDING_USER'
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  role: Role;
  personId?: string;
  oauth2ProviderId?: string;
}
