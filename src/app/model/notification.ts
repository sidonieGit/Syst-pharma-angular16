export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  id: string;
}
