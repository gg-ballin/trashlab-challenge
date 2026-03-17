export enum TabIndex {
  Dashboard = 0,
  Categories = 1,
  Recurrings = 2,
  Goals = 3,
}

export const TAB_LABELS: Record<TabIndex, string> = {
  [TabIndex.Dashboard]: 'Dashboard',
  [TabIndex.Categories]: 'Categories',
  [TabIndex.Recurrings]: 'Recurrings',
  [TabIndex.Goals]: 'Goals',
};
