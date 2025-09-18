# DataTable Components

A comprehensive table component built with shadcn/ui and TanStack React Table, featuring loading states, error handling, pagination, row selection, and more.

## Components

### 1. `DataTable` (Full-featured)

The complete data table with all features including dropdown menus and advanced column visibility controls.

**Requirements:**

- `@radix-ui/react-checkbox`
- `@radix-ui/react-dropdown-menu`

### 2. `SimpleDataTable` (Lightweight)

A simplified version that works without external dependencies, using native HTML checkboxes.

## Features

### ✅ Core Features

- **Loading State** - Full-screen loading with spinner
- **Error State** - Error fallback with retry functionality
- **Empty State** - Customizable empty state message
- **Pagination** - Full pagination controls with page size selection
- **Row Selection** - Single and multi-row selection
- **Global Filtering** - Search across all columns
- **Sorting** - Column-based sorting
- **Column Visibility** - Show/hide columns (DataTable only)

### ✅ State Management

- **Loading** - `isLoading` prop with custom message
- **Error** - `error` prop with retry callback
- **Empty** - Automatic empty state detection
- **Selection** - Row selection with callbacks
- **Pagination** - Configurable page size and navigation

## Usage Examples

### Basic Table

```tsx
import { SimpleDataTable } from "@/components/ui/simple-data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Client {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

const columns: ColumnDef<Client>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
];

function ClientsTable() {
  return (
    <SimpleDataTable
      columns={columns}
      data={clients}
      enableRowSelection={true}
      enablePagination={true}
      enableGlobalFilter={true}
    />
  );
}
```

### With Loading State

```tsx
<SimpleDataTable
  columns={columns}
  data={[]}
  isLoading={true}
  loadingMessage="Loading clients..."
/>
```

### With Error State

```tsx
<SimpleDataTable
  columns={columns}
  data={[]}
  error={new Error("Network error")}
  errorTitle="Failed to load clients"
  errorMessage="Unable to fetch client data. Please try again."
  onErrorRetry={() => window.location.reload()}
/>
```

### With Row Selection

```tsx
<SimpleDataTable
  columns={columns}
  data={clients}
  enableRowSelection={true}
  enableMultiRowSelection={true}
  onRowSelectionChange={(selectedRows) => {
    console.log("Selected:", selectedRows);
  }}
/>
```

### With Pagination

```tsx
<SimpleDataTable
  columns={columns}
  data={clients}
  enablePagination={true}
  pageSize={20}
  totalCount={1000}
  onPaginationChange={(pagination) => {
    console.log("Page changed:", pagination);
  }}
/>
```

## Props

### Core Props

| Prop        | Type                         | Default | Description              |
| ----------- | ---------------------------- | ------- | ------------------------ |
| `columns`   | `ColumnDef<TData, TValue>[]` | -       | Table column definitions |
| `data`      | `TData[]`                    | -       | Table data               |
| `isLoading` | `boolean`                    | `false` | Show loading state       |
| `error`     | `Error \| null`              | `null`  | Show error state         |

### Pagination Props

| Prop                 | Type                                    | Default | Description                              |
| -------------------- | --------------------------------------- | ------- | ---------------------------------------- |
| `enablePagination`   | `boolean`                               | `true`  | Enable pagination                        |
| `pageSize`           | `number`                                | `10`    | Items per page                           |
| `totalCount`         | `number`                                | -       | Total items (for server-side pagination) |
| `onPaginationChange` | `(pagination: PaginationState) => void` | -       | Pagination change callback               |

### Row Selection Props

| Prop                      | Type                              | Default | Description                  |
| ------------------------- | --------------------------------- | ------- | ---------------------------- |
| `enableRowSelection`      | `boolean`                         | `false` | Enable row selection         |
| `enableMultiRowSelection` | `boolean`                         | `true`  | Allow multiple row selection |
| `onRowSelectionChange`    | `(selectedRows: TData[]) => void` | -       | Selection change callback    |

### Filtering Props

| Prop                      | Type      | Default       | Description              |
| ------------------------- | --------- | ------------- | ------------------------ |
| `enableGlobalFilter`      | `boolean` | `true`        | Enable global search     |
| `globalFilterPlaceholder` | `string`  | `"Search..."` | Search input placeholder |

### UI Props

| Prop                     | Type      | Default                     | Description                                      |
| ------------------------ | --------- | --------------------------- | ------------------------------------------------ |
| `enableSorting`          | `boolean` | `true`                      | Enable column sorting                            |
| `enableColumnVisibility` | `boolean` | `true`                      | Enable column visibility toggle (DataTable only) |
| `loadingMessage`         | `string`  | `"Loading data..."`         | Loading state message                            |
| `errorTitle`             | `string`  | `"Failed to load data"`     | Error state title                                |
| `errorMessage`           | `string`  | `"Unable to fetch data..."` | Error state message                              |
| `emptyMessage`           | `string`  | `"No data available"`       | Empty state message                              |
| `emptyDescription`       | `string`  | `"There are no records..."` | Empty state description                          |

## Styling

The components use your existing design system:

- **Colors** - Matches your brand colors and theme
- **Spacing** - Consistent with shadcn/ui spacing
- **Typography** - Uses your font system
- **Components** - Integrates with Button, Input, etc.

## Dependencies

### SimpleDataTable

- `@tanstack/react-table` ✅ (already installed)
- `lucide-react` ✅ (already installed)
- `class-variance-authority` ✅ (already installed)

### DataTable (Full-featured)

- All SimpleDataTable dependencies +
- `@radix-ui/react-checkbox`
- `@radix-ui/react-dropdown-menu`

## Installation

For the full-featured DataTable, install the missing dependencies:

```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dropdown-menu
```

## Examples

See `data-table.example.tsx` for complete usage examples including:

- Basic table setup
- Loading states
- Error handling
- Row selection
- Pagination
- Custom styling
