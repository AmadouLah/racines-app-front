export enum ClaimStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ProfileClaim {
  id: string;
  personId: string;
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  status: ClaimStatus;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ProfileClaimCreate {
  personId: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
}
