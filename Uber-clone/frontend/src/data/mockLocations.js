export const POPULAR_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'International Airport (Terminal 3)',
    address: 'Departure Boulevard, Skygate Zone',
    category: 'Airport',
    icon: 'plane',
    coords: { x: 780, y: 160 }
  },
  {
    id: 'loc-2',
    name: 'Downtown Financial Center',
    address: '100 Wall Avenue, Business Core',
    category: 'Business',
    icon: 'building',
    coords: { x: 420, y: 350 }
  },
  {
    id: 'loc-3',
    name: 'Grand Central Metro & Rail Hub',
    address: '45 Station Boulevard, Transit District',
    category: 'Transit',
    icon: 'train',
    coords: { x: 510, y: 460 }
  },
  {
    id: 'loc-4',
    name: 'Silicon Cyber Technology Park',
    address: '88 Innovation Way, Tech Corridor',
    category: 'Tech',
    icon: 'laptop',
    coords: { x: 260, y: 220 }
  },
  {
    id: 'loc-5',
    name: 'The Ritz Luxury Promenade & Mall',
    address: '500 Fifth Avenue, Luxury Quarter',
    category: 'Shopping',
    icon: 'shopping-bag',
    coords: { x: 380, y: 520 }
  },
  {
    id: 'loc-6',
    name: 'Waterfront Bay & Opera Pavilion',
    address: '12 Marina Promenade, Harbour View',
    category: 'Leisure',
    icon: 'anchor',
    coords: { x: 690, y: 430 }
  },
  {
    id: 'loc-7',
    name: 'Embassy Row & Diplomats Enclave',
    address: '22 Constitution Ave, Diplomatic Zone',
    category: 'Civic',
    icon: 'landmark',
    coords: { x: 320, y: 410 }
  }
];

export const INITIAL_NEARBY_CABS = [
  {
    id: 'cab-1',
    type: 'comfort',
    driverName: 'Marcus Vance',
    rating: 4.97,
    trips: 3410,
    car: 'Toyota Camry 2024 (Silver)',
    plate: 'VX-889-NY',
    phone: '+1 (555) 392-8819',
    coords: { x: 440, y: 330 },
    heading: 45,
    speed: '42 km/h',
    status: 'Available'
  },
  {
    id: 'cab-2',
    type: 'executive',
    driverName: 'Elena Rostova',
    rating: 4.99,
    trips: 4120,
    car: 'Mercedes-Benz E300 (Obsidian Black)',
    plate: 'PR-901-EX',
    phone: '+1 (555) 744-2201',
    coords: { x: 480, y: 390 },
    heading: 120,
    speed: '38 km/h',
    status: 'Available'
  },
  {
    id: 'cab-3',
    type: 'suv',
    driverName: 'David Chen',
    rating: 4.94,
    trips: 2890,
    car: 'Audi Q7 Quattro (Dark Gray)',
    plate: 'XL-550-NY',
    phone: '+1 (555) 412-9087',
    coords: { x: 360, y: 290 },
    heading: 260,
    speed: '45 km/h',
    status: 'Available'
  },
  {
    id: 'cab-4',
    type: 'electric',
    driverName: 'Sophia Miller',
    rating: 4.98,
    trips: 3105,
    car: 'Tesla Model Y Long Range (Pearl White)',
    plate: 'EV-334-GR',
    phone: '+1 (555) 883-1142',
    coords: { x: 520, y: 250 },
    heading: 80,
    speed: '50 km/h',
    status: 'Available'
  },
  {
    id: 'cab-5',
    type: 'royale',
    driverName: 'Alexander Sterling',
    rating: 5.0,
    trips: 5200,
    car: 'Mercedes-Maybach S580 (Royal Navy)',
    plate: 'RY-001-VIP',
    phone: '+1 (555) 991-0010',
    coords: { x: 400, y: 440 },
    heading: 315,
    speed: '35 km/h',
    status: 'Available'
  },
  {
    id: 'cab-6',
    type: 'comfort',
    driverName: 'Tariq Al-Mansoor',
    rating: 4.92,
    trips: 1850,
    car: 'Honda Accord Hybrid (Modern Steel)',
    plate: 'TX-442-NY',
    phone: '+1 (555) 301-4499',
    coords: { x: 620, y: 380 },
    heading: 180,
    speed: '40 km/h',
    status: 'Available'
  }
];

export function calculateDistance(p1, p2) {
  if (!p1 || !p2) return 12.4;
  const dx = (p1.x - p2.x);
  const dy = (p1.y - p2.y);
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  // Scale pixels to realistic km (approx 25px = 1km)
  const km = Math.max(3.2, Math.round((pixelDist / 22) * 10) / 10);
  return km;
}

export function calculateDuration(km) {
  // Average city speed with traffic: ~32 km/h
  const minutes = Math.max(8, Math.round((km / 32) * 60));
  return minutes;
}
