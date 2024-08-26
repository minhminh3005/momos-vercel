export type PropertyType = 'checkbox' | 'date' | 'multi_select' | 'number' | 'rich_text' | 'select' | 'timestamp' | 'status';
export type ConditionType = 'equals' | 'contains' | 'greater_than' | 'less_than';

export interface FilterCondition {
  property: string;
  type: PropertyType;
  condition: ConditionType;
  value: any;
}

export interface FilterGroup {
  operator: 'and' | 'or';
  filters: (FilterCondition | FilterGroup)[];
}

export interface FilterBuilderProps {
  maxNestingLevel: number;
  onSave: (filters: FilterGroup) => void;
  onCancel: () => void;
}
