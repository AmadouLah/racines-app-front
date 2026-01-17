import { Person } from './person.model';
import { Relationship } from './relationship.model';

export interface FamilyTree {
  person: Person;
  parents: Person[];
  grandparents: Person[];
  siblings: Person[];
  relationships: Relationship[];
}
