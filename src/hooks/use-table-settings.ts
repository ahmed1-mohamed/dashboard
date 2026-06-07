"use client";

import { useState, useEffect } from "react";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

export type Density = "compact" | "comfortable" | "spacious";

export interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

export interface TableSettingsState {
  columns: ColumnConfig[];
  density: Density;
  itemsPerPage: number;
  sort: SortConfig | null;
}

export function useTableSettings(tableId: string, defaultColumns: ColumnConfig[]) {
  const [settings, setSettings] = useState<TableSettingsState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`table-settings-${tableId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<TableSettingsState>;
          // Merge parsed columns with defaultColumns to keep new columns visible by default
          const parsedColumns = parsed.columns || [];
          const mergedColumns = defaultColumns.map((defCol) => {
            const found = parsedColumns.find((pCol) => pCol.id === defCol.id);
            return found ? { ...defCol, visible: found.visible } : defCol;
          });

          return {
            columns: mergedColumns,
            density: parsed.density || "comfortable",
            itemsPerPage: parsed.itemsPerPage || 10,
            sort: parsed.sort || null,
          };
        } catch (error) {
          console.error("Failed to parse table settings from localStorage", error);
        }
      }
    }
    return {
      columns: defaultColumns,
      density: "comfortable",
      itemsPerPage: 10,
      sort: null,
    };
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`table-settings-${tableId}`, JSON.stringify(settings));
    }
  }, [settings, tableId]);

  const toggleColumn = (columnId: string) => {
    setSettings((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      ),
    }));
  };

  const setDensity = (density: Density) => {
    setSettings((prev) => ({ ...prev, density }));
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    setSettings((prev) => ({ ...prev, itemsPerPage }));
  };

  const setSort = (sort: SortConfig | null) => {
    setSettings((prev) => ({ ...prev, sort }));
  };

  const resetToDefaults = () => {
    setSettings({
      columns: defaultColumns,
      density: "comfortable",
      itemsPerPage: 10,
      sort: null,
    });
  };

  const isColumnVisible = (columnId: string) => {
    return settings.columns.find((col) => col.id === columnId)?.visible ?? true;
  };

  return {
    settings,
    toggleColumn,
    setDensity,
    setItemsPerPage,
    setSort,
    resetToDefaults,
    isColumnVisible,
  };
}
