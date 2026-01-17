import { Injectable } from '@angular/core';
import { FamilyTree, Person, Relationship } from '../../../shared/models';
import { RelationshipType } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  getParents(familyTree: FamilyTree): Person[] {
    return familyTree.parents || [];
  }

  getGrandparents(familyTree: FamilyTree): Person[] {
    return familyTree.grandparents || [];
  }

  getSiblings(familyTree: FamilyTree): Person[] {
    return familyTree.siblings || [];
  }

  getRelationshipsByType(familyTree: FamilyTree, type: RelationshipType): Relationship[] {
    return (familyTree.relationships || []).filter(rel => rel.relationshipType === type);
  }

  getRelationshipsByPerson(familyTree: FamilyTree, personId: string): Relationship[] {
    return (familyTree.relationships || []).filter(
      rel => rel.person1Id === personId || rel.person2Id === personId
    );
  }

  findPerson(familyTree: FamilyTree, personId: string): Person | null {
    if (familyTree.person.id === personId) {
      return familyTree.person;
    }

    const allPersons = [
      ...familyTree.parents,
      ...familyTree.grandparents,
      ...familyTree.siblings
    ];

    return allPersons.find(p => p.id === personId) || null;
  }
}
