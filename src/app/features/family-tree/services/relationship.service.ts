import { Injectable } from '@angular/core';
import { Relationship, RelationshipType, Side } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {
  getRelationshipLabel(type: RelationshipType): string {
    const labels: Record<RelationshipType, string> = {
      [RelationshipType.PARENT]: 'Parent',
      [RelationshipType.CHILD]: 'Enfant',
      [RelationshipType.SIBLING]: 'Frère/Sœur',
      [RelationshipType.SPOUSE]: 'Conjoint(e)',
      [RelationshipType.GRANDPARENT]: 'Grand-parent',
      [RelationshipType.GRANDCHILD]: 'Petit-enfant',
      [RelationshipType.UNCLE_AUNT]: 'Oncle/Tante',
      [RelationshipType.NEPHEW_NIECE]: 'Neveu/Nièce',
      [RelationshipType.COUSIN]: 'Cousin(e)'
    };
    return labels[type] || type;
  }

  getSideLabel(side: Side): string {
    const labels: Record<Side, string> = {
      [Side.PATERNAL]: 'Paternel',
      [Side.MATERNAL]: 'Maternel',
      [Side.UNKNOWN]: 'Inconnu'
    };
    return labels[side] || side;
  }

  getRelationshipDescription(relationship: Relationship): string {
    const typeLabel = this.getRelationshipLabel(relationship.relationshipType);
    const sideLabel = relationship.side !== Side.UNKNOWN 
      ? ` (${this.getSideLabel(relationship.side)})` 
      : '';
    return `${typeLabel}${sideLabel}`;
  }
}
