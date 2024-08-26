import React, { useState } from 'react';

// Define the types of filters supported
export type FilterType = 'checkbox' | 'date' | 'multi_select' | 'number' | 'rich_text' | 'select' | 'timestamp' | 'status';

export interface Filter {
  property: string;
  type: FilterType;
  condition?: string;
  value: any;
}

export enum FilterConjunction  {
  AND = 'and',
  OR = 'or'
}
export interface FilterGroup {
  conjunction: FilterConjunction;
  filters: (Filter | FilterGroup)[];
}

export interface NotionFilterProps {
  filterGroup: FilterGroup;
  maxNestingLevel: number;
}

const MomosTableFilter: React.FC<NotionFilterProps> = ({ filterGroup, maxNestingLevel }) => {
  const [filters, setFilters] = useState<FilterGroup>(filterGroup);

  const addFilter = (level: number, groupIndex: number) => {
    if (level >= maxNestingLevel) return;

    const newFilter: Filter = {
      property: '',
      type: 'checkbox',
      condition: 'is',
      value: '',
    };

    const newFilters = [...filters.filters];
    (newFilters[groupIndex] as FilterGroup).filters.push(newFilter);
    setFilters({ ...filters, filters: newFilters });
  };

  const renderFilter = (filter: Filter, index: number) => (
    <div key={index}>
      <select value={filter.property} onChange={(e) => updateFilter(index, 'property', e.target.value)}>
        <option value="done">Done</option>
        <option value="tags">Tags</option>
        {/* Add more property options here */}
      </select>

      <select value={filter.condition} onChange={(e) => updateFilter(index, 'condition', e.target.value)}>
        <option value="contains">Contains</option>
        <option value="is">Is</option>
        {/* Add more condition options here */}
      </select>

      <input type="text" value={filter.value} onChange={(e) => updateFilter(index, 'value', e.target.value)} />
    </div>
  );

  const updateFilter = (index: number, key: keyof Filter, value: any) => {
    const newFilters = [...filters.filters];
    (newFilters[index] as Filter)[key] = value;
    setFilters({ ...filters, filters: newFilters });
  };

  const renderFilterGroup = (group: FilterGroup, level: number) => (
    <div style={{ marginLeft: 20 * level }}>
      <select
        value={group.conjunction}
        onChange={(e) => updateFilterGroup(level, 'conjunction', e.target.value)}
      >
        <option value="and">And</option>
        <option value="or">Or</option>
      </select>

      {group.filters.map((filter, index) =>
        'conjunction' in filter ? (
          renderFilterGroup(filter as FilterGroup, level + 1)
        ) : (
          renderFilter(filter as Filter, index)
        )
      )}

      <button onClick={() => addFilter(level, group.filters.length)}>+ Add Filter</button>
    </div>
  );

  const updateFilterGroup = (level: number, key: keyof FilterGroup, value: any) => {
    // Update filter group logic here
  };

  return <div>{renderFilterGroup(filters, 0)}</div>;
};

export default MomosTableFilter;
