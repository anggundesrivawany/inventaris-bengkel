/**
 * Data Storage & Seed Data for Lab Inventory & Borrowing System
 */

const STORAGE_KEYS = {
  ITEMS: 'lab_inventory_items',
  BORROWINGS: 'lab_borrowing_records'
};

const INITIAL_ITEMS = [
  {
    id: 'ITM-001',
    code: 'OSC-101',
    name: 'Digital Storage Oscilloscope 100MHz',
    category: 'Elektronika & Pengukuran',
    location: 'Lemari Instrumen A-1',
    totalStock: 5,
    availableStock: 3,
    condition: 'Baik',
    description: '2 Channel, 1 GSa/s, layar TFT LCD 7 inch.'
  },
  {
    id: 'ITM-002',
    code: 'MLT-204',
    name: 'Digital Multimeter True-RMS',
    category: 'Elektronika & Pengukuran',
    location: 'Lemari Instrumen A-2',
    totalStock: 12,
    availableStock: 10,
    condition: 'Baik',
    description: 'Auto-ranging AC/DC, uji kontinuitas, resistansi, frekuensi.'
  },
  {
    id: 'ITM-003',
    code: 'MIC-301',
    name: 'Mikroskop Binokuler 1600x',
    category: 'Optik & Biologi',
    location: 'Meja Khusus Optik B-03',
    totalStock: 6,
    availableStock: 4,
    condition: 'Baik',
    description: 'Lensa objektif akromatik 4x, 10x, 40x, 100x dengan iluminasi LED.'
  },
  {
    id: 'ITM-004',
    code: 'PWR-402',
    name: 'DC Power Supply 30V 5A',
    category: 'Elektronika & Pengukuran',
    location: 'Rak Catu Daya C-1',
    totalStock: 8,
    availableStock: 7,
    condition: 'Baik',
    description: 'Tegangan dan arus variabel dengan proteksi overcurrent.'
  },
  {
    id: 'ITM-005',
    code: 'GLS-105',
    name: 'Gelas Kimia Beaker Pyrex 250ml',
    category: 'Gelas & Reagen',
    location: 'Lemari Kaca Gelas D-2',
    totalStock: 25,
    availableStock: 25,
    condition: 'Baik',
    description: 'Kaca borosilikat tahan panas hingga 450°C.'
  },
  {
    id: 'ITM-006',
    code: 'SLD-501',
    name: 'Solder Station Temperature Controlled 60W',
    category: 'Perkakas Lab',
    location: 'Meja Kerja Perakitan E-4',
    totalStock: 6,
    availableStock: 5,
    condition: 'Baik',
    description: 'Rentang suhu 200°C - 480°C dengan dudukan dan sponge.'
  },
  {
    id: 'ITM-007',
    code: 'NET-602',
    name: 'Network Cable Tester & Crimping Kit',
    category: 'Jaringan & Komputer',
    location: 'Kotak Toolkit F-1',
    totalStock: 4,
    availableStock: 4,
    condition: 'Baik',
    description: 'Tester kabel RJ45/RJ11 beserta tang crimping presisi.'
  }
];

const INITIAL_BORROWINGS = [
  {
    id: 'PINJAM-2026-001',
    itemId: 'ITM-001',
    itemName: 'Digital Storage Oscilloscope 100MHz',
    itemCode: 'OSC-101',
    borrowerName: 'Rifki Pratama',
    borrowerId: '21120120130045',
    borrowerRole: 'Mahasiswa',
    borrowerContact: '081234567812',
    quantity: 2,
    borrowDate: '2026-11-10',
    expectedReturnDate: '2026-11-14',
    actualReturnDate: null,
    purpose: 'Tugas Akhir Analisis Respons Frekuensi Filter Aktif',
    status: 'Dipinjam',
    returnNotes: ''
  },
  {
    id: 'PINJAM-2026-002',
    itemId: 'ITM-002',
    itemName: 'Digital Multimeter True-RMS',
    itemCode: 'MLT-204',
    borrowerName: 'Nadia Salsabila',
    borrowerId: '21120120140022',
    borrowerRole: 'Mahasiswa',
    borrowerContact: '085789123456',
    quantity: 2,
    borrowDate: '2026-11-11',
    expectedReturnDate: '2026-11-13',
    actualReturnDate: null,
    purpose: 'Praktikum Pengukuran Besaran Listrik Modul 3',
    status: 'Dipinjam',
    returnNotes: ''
  },
  {
    id: 'PINJAM-2026-003',
    itemId: 'ITM-003',
    itemName: 'Mikroskop Binokuler 1600x',
    itemCode: 'MIC-301',
    borrowerName: 'Dr. Hendra Gunawan',
    borrowerId: '198503152010121002',
    borrowerRole: 'Dosen / Peneliti',
    borrowerContact: '081398765432',
    quantity: 2,
    borrowDate: '2026-11-08',
    expectedReturnDate: '2026-11-15',
    actualReturnDate: null,
    purpose: 'Riset Mikrostruktur Material Semikonduktor',
    status: 'Dipinjam',
    returnNotes: ''
  },
  {
    id: 'PINJAM-2026-004',
    itemId: 'ITM-004',
    itemName: 'DC Power Supply 30V 5A',
    itemCode: 'PWR-402',
    borrowerName: 'Bima Satria',
    borrowerId: '21120120120018',
    borrowerRole: 'Mahasiswa',
    borrowerContact: '087812344321',
    quantity: 1,
    borrowDate: '2026-11-09',
    expectedReturnDate: '2026-11-16',
    actualReturnDate: null,
    purpose: 'Pengujian Driver Motor DC Robot Kontes',
    status: 'Dipinjam',
    returnNotes: ''
  },
  {
    id: 'PINJAM-2026-005',
    itemId: 'ITM-006',
    itemName: 'Solder Station Temperature Controlled 60W',
    itemCode: 'SLD-501',
    borrowerName: 'Siti Rahma',
    borrowerId: '21120120130090',
    borrowerRole: 'Asisten Lab',
    borrowerContact: '082133445566',
    quantity: 1,
    borrowDate: '2026-11-05',
    expectedReturnDate: '2026-11-07',
    actualReturnDate: '2026-11-07',
    purpose: 'Perakitan Modul Praktikum Mikrokontroler',
    status: 'Dikembalikan',
    returnNotes: 'Kondisi lengkap dan bersih.'
  }
];

const LabStorage = {
  getItems() {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      this.setItems(INITIAL_ITEMS);
      return INITIAL_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse items from localStorage', e);
      return INITIAL_ITEMS;
    }
  },

  setItems(items) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  getBorrowings() {
    const raw = localStorage.getItem(STORAGE_KEYS.BORROWINGS);
    if (!raw) {
      this.setBorrowings(INITIAL_BORROWINGS);
      return INITIAL_BORROWINGS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse borrowings from localStorage', e);
      return INITIAL_BORROWINGS;
    }
  },

  setBorrowings(borrowings) {
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(borrowings));
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(INITIAL_BORROWINGS));
  }
};

