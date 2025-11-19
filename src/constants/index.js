// Storage keys
export const STORAGE_KEYS = {
  TASK_TRACKER: 'task-tracker-data',
  THEME: 'task-tracker-theme'
}

// File types
export const FILE_TYPES = {
  MARKDOWN: '.md',
  TEXT: '.txt'
}

export const MIME_TYPES = {
  MARKDOWN: 'text/markdown',
  PLAIN_TEXT: 'text/plain'
}

export const ACCEPTED_FILE_TYPES = [FILE_TYPES.MARKDOWN, FILE_TYPES.TEXT]
export const ACCEPTED_MIME_TYPES = [MIME_TYPES.MARKDOWN, MIME_TYPES.PLAIN_TEXT]

// UI Constants
export const MAX_COLLAPSIBLE_HEIGHT = '600px'

// Task parsing keywords
export const TASK_KEYWORDS = ['step', 'checklist', 'test', 'task', 'todo', 'phase', 'stage']

// Default section names
export const DEFAULT_SECTIONS = {
  GENERAL: 'General',
  MAIN_TASKS: 'Main Tasks',
  TASKS: 'Tasks'
}
