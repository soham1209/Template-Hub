import { BLOCK_TYPES } from './block-types';

/**
 * Mock user context data for email personalization
 */
export const MOCK_USER_CONTEXT = {
  name: 'Soham',
  company: 'Sony Info Tech',
  role: 'Senior Developer',
  email: 'soham@sonyinfotech.com',
  year: new Date().getFullYear(),
};

/**
 * Default email sections for new templates
 */
export const DEFAULT_SECTIONS = [
  {
    id: 's1',
    type: BLOCK_TYPES.HEADER,
    data: { title: 'Welcome Aboard!', subtitle: 'We are glad you are here.' },
    style: { backgroundColor: '#4f46e5', textColor: '#ffffff', padding: '32px' },
  },
  {
    id: 's2',
    type: BLOCK_TYPES.TEXT,
    data: {
      content:
        'Hi {{name}},<br><br>We are thrilled to have you join <strong>{{company}}</strong>. This is a default text block you can edit.',
    },
    style: { padding: '24px', textAlign: 'left', fontSize: '16px', color: '#374151' },
  },
  {
    id: 's3',
    type: BLOCK_TYPES.BUTTON,
    data: { label: 'Get Started', url: '#' },
    style: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      borderRadius: '8px',
      width: 'auto',
      align: 'center',
    },
  },
  {
    id: 's4',
    type: BLOCK_TYPES.FOOTER,
    data: { text: '© {{year}} {{company}}. All rights reserved.' },
    style: { backgroundColor: '#f3f4f6', color: '#9ca3af', padding: '16px' },
  },
];

/**
 * Initial template examples
 */
export const INITIAL_TEMPLATES = [
  {
    id: 't1',
    name: 'Welcome Email',
    category: 'Employee Related',
    subject: 'Welcome to the team!',
    lastModified: '2 mins ago',
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
  },
  {
    id: 't2',
    name: 'Product Launch',
    category: 'Marketing Mails',
    subject: 'Introducing our latest feature',
    lastModified: '1 day ago',
    sections: [
      {
        id: 'p1',
        type: BLOCK_TYPES.IMAGE,
        data: {
          url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          alt: 'Product',
        },
        style: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0px' },
      },
      {
        id: 'p2',
        type: BLOCK_TYPES.HEADER,
        data: { title: 'New Summer Collection', subtitle: '50% Off Everything' },
        style: { backgroundColor: '#ffffff', textColor: '#111827', padding: '24px' },
      },
      {
        id: 'p3',
        type: BLOCK_TYPES.BUTTON,
        data: { label: 'Shop Now', url: 'https://example.com' },
        style: {
          backgroundColor: '#f97316',
          color: '#ffffff',
          borderRadius: '9999px',
          width: 'full',
          align: 'center',
        },
      },
    ],
  },
];
