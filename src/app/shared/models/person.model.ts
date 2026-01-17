export interface Person {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  isPublic: boolean;
  createdBy?: string;
  validatedBy?: string;
  metadata?: string;
}

export interface PersonCreate {
  nom: string;
  prenom: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  metadata?: string;
}
