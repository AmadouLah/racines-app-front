export enum RelationshipType {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  SIBLING = 'SIBLING',
  SPOUSE = 'SPOUSE',
  GRANDPARENT = 'GRANDPARENT',
  GRANDCHILD = 'GRANDCHILD',
  UNCLE_AUNT = 'UNCLE_AUNT',
  NEPHEW_NIECE = 'NEPHEW_NIECE',
  COUSIN = 'COUSIN'
}

export enum Side {
  PATERNAL = 'PATERNAL',
  MATERNAL = 'MATERNAL',
  UNKNOWN = 'UNKNOWN'
}

export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  relationshipType: RelationshipType;
  side: Side;
  createdBy?: string;
}
