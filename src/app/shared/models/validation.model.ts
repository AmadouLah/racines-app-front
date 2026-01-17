export enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface PendingAddition {
  id: string;
  personId: string;
  requestedBy: string;
  status: ValidationStatus;
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ValidationRequest {
  personId: string;
}
