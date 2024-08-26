import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { ConditionType, FilterBuilderProps, FilterCondition, FilterGroup } from './model';

const FilterBuilder: React.FC<FilterBuilderProps> = ({ maxNestingLevel, onSave, onCancel }) => {
  const [filters, setFilters] = useState<FilterGroup>({
    operator: 'and',
    filters: [],
  });

  const addFilter = (groupIndex: number, filter?: FilterCondition) => {
    const newFilter: FilterCondition = {
      property: 'name',
      type: 'rich_text',
      condition: 'contains',
      value: '',
    };
    updateFilterGroup(filters, groupIndex, [...filters.filters, newFilter]);
  };

  const addFilterGroup = (groupIndex: number) => {
    const newGroup: FilterGroup = {
      operator: 'and',
      filters: [],
    };
    updateFilterGroup(filters, groupIndex, [...filters.filters, newGroup]);
  };

  const updateFilterGroup = (currentGroup: FilterGroup, groupIndex: number, newFilters: (FilterCondition | FilterGroup)[]) => {
    if (groupIndex === 0) {
      setFilters({ ...currentGroup, filters: newFilters });
    } else {
      const updateFilters = (group: FilterGroup, index: number): FilterGroup => {
        if (index === groupIndex - 1) {
          return { ...group, filters: newFilters };
        } else {
          return {
            ...group,
            filters: group.filters.map(filter => {
              if ('filters' in filter) {
                return updateFilters(filter as FilterGroup, index + 1);
              }
              return filter;
            }),
          };
        }
      };
      setFilters(updateFilters(filters, 0));
    }
  };

  const renderFilter = (filter: FilterCondition, index: number, groupIndex: number) => (
    <div key={index} style={{ marginLeft: groupIndex * 20, marginBottom: 10, marginTop: 10 }}>
      <FormControl variant="outlined" style={{ marginRight: 10 }}>
        <InputLabel>Property</InputLabel>
        <Select
          value={filter.property}
          onChange={(e) => {
            filter.property = e.target.value as string;
            setFilters({ ...filters });
          }}
          label="Property"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="company">Company</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" style={{ marginRight: 10 }}>
        <InputLabel>Condition</InputLabel>
        <Select
          value={filter.condition}
          onChange={(e) => {
            filter.condition = e.target.value as ConditionType;
            setFilters({ ...filters });
          }}
          label="Condition"
        >
          <MenuItem value="contains">Contains</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Value"
        variant="outlined"
        value={filter.value}
        onChange={(e) => {
          filter.value = e.target.value;
          setFilters({ ...filters });
        }}
      />
    </div>
  );

  const renderFilterGroup = (group: FilterGroup, groupIndex: number) => (
    <div key={groupIndex} style={{ marginLeft: groupIndex * 20, marginBottom: 10 }}>
      <FormControl variant="outlined" style={{ marginRight: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'cebter' }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={group.operator}
          onChange={(e) => {
            group.operator = e.target.value as 'and' | 'or';
            setFilters({ ...filters });
          }}
          label="Operator"
        >
          <MenuItem value="and">AND</MenuItem>
          <MenuItem value="or">OR</MenuItem>
        </Select>
      </FormControl>

      {group.filters.map((filter, index) =>
        'filters' in filter
          ? renderFilterGroup(filter as FilterGroup, groupIndex + 1)
          : renderFilter(filter as FilterCondition, index, groupIndex)
      )}

      <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={() => addFilter(groupIndex)}>
        Add Filter
      </Button>
      {/* Add filter group not behave as expected */}
      {/* {groupIndex < maxNestingLevel && (
        <Button variant="outlined" color="secondary" onClick={() => addFilterGroup(groupIndex)}>
          Add Filter Group
        </Button>
      )} */}


    </div>
  );

  const handleSave = () => {
    onSave(filters);
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>Build Filters</DialogTitle>
      <DialogContent style={{
        paddingTop: 10
      }}>
        {renderFilterGroup(filters, 0)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary"  variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterBuilder;
