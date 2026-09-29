// Storage keys
export const STORAGE_KEYS = {
  users: 'syncwave_users',
  waves: 'syncwave_waves',
  history: 'syncwave_history',
  remember: 'syncwave_remember_email',
  session: 'syncwave_session',
};

export const INITIAL_WAVES = [
  {
    id: 'wave-1',
    name: 'DSA Revision',
    subject: 'Data Structures',
    duration: 30,
    max: 6,
    description: 'Arrays and Linked List practice before Monday quiz.',
    goals: [
      { id: 'g1', text: 'Arrays', done: true },
      { id: 'g2', text: 'Searching', done: true },
      { id: 'g3', text: 'Linked List', done: false },
      { id: 'g4', text: 'Stack', done: false },
    ],
    participants: [
      { id: 'u1', name: 'Rahul Sharma' },
      { id: 'u2', name: 'Aman Gupta' },
      { id: 'u3', name: 'Priya Nair' },
    ],
    hostName: 'Rahul Sharma',
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'wave-2',
    name: 'React Practice',
    subject: 'React',
    duration: 45,
    max: 5,
    description: 'Building small components and custom hooks together.',
    goals: [
      { id: 'g1', text: 'useState basics', done: false },
      { id: 'g2', text: 'Props drilling', done: false },
    ],
    participants: [
      { id: 'u4', name: 'Simran Kaur' },
      { id: 'u5', name: 'Kabir Verma' },
    ],
    hostName: 'Simran Kaur',
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'wave-3',
    name: 'Operating Systems & Concurrency',
    subject: 'Operating Systems',
    duration: 60,
    max: 8,
    description: 'Mutex locks, semaphores, deadlock detection, and Peterson algorithm.',
    goals: [
      { id: 'g1', text: 'Process Scheduling algorithms', done: true },
      { id: 'g2', text: 'Critical section problem', done: false },
      { id: 'g3', text: 'Banker algorithm practice', done: false },
    ],
    participants: [
      { id: 'u6', name: 'Rohan Mehra' },
      { id: 'u7', name: 'Ananya Roy' },
      { id: 'u8', name: 'Dev Patel' },
    ],
    hostName: 'Rohan Mehra',
    createdAt: Date.now() - 1000 * 60 * 45,
  },
];

export const SUBJECT_SUGGESTIONS = [
  'Data Structures',
  'React',
  'Operating Systems',
  'MERN Stack',
  'Database Systems',
  'Computer Networks',
];

// Helper to safely read and parse JSON from storage
export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely write JSON to storage
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

// Name initials generator
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}
