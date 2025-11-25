export interface Item {
  id: string;
  title: string;
  description: string;
  category: 'Laptop' | 'Monitor' | 'Peripheral' | 'Audio' | 'Tablet' | 'Other';
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  image: string;
  owner: {
    name: string;
    avatar: string;
  };
  status: 'Available' | 'Requested' | 'Borrowed';
  postedAt: string;
}

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'MacBook Pro 16" M1 Max',
    description: '32GB RAM, 1TB SSD. Used for 6 months, perfect condition. Comes with original charger and box.',
    category: 'Laptop',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Available',
    postedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Dell UltraSharp 27" 4K Monitor',
    description: 'U2720Q USB-C Monitor. Great color accuracy, perfect for designers. No dead pixels.',
    category: 'Monitor',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Available',
    postedAt: '2024-03-12T14:30:00Z',
  },
  {
    id: '3',
    title: 'Keychron K2 Mechanical Keyboard',
    description: 'Wireless mechanical keyboard with Gateron Brown switches. RGB backlight.',
    category: 'Peripheral',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Requested',
    postedAt: '2024-03-08T09:15:00Z',
  },
  {
    id: '4',
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Industry leading noise canceling headphones. Black. Battery life is still excellent.',
    category: 'Audio',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Available',
    postedAt: '2024-03-11T16:45:00Z',
  },
  {
    id: '5',
    title: 'iPad Pro 12.9" (M2)',
    description: 'Latest gen iPad Pro with Apple Pencil 2. Space Gray. Minimal scratches on back.',
    category: 'Tablet',
    condition: 'Fair',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Borrowed',
    postedAt: '2024-03-05T11:20:00Z',
  },
  {
    id: '6',
    title: 'Logitech MX Master 3S',
    description: 'Ergonomic performance mouse. Pale Gray. barely used.',
    category: 'Peripheral',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000',
    owner: {
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    status: 'Available',
    postedAt: '2024-03-13T08:00:00Z',
  }
];
