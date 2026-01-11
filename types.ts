
export type Kabupaten = 'Pacitan' | 'Ponorogo';
export type Status = 'Sudah' | 'Belum';
export type Skala = 'Kecil' | 'Menengah' | 'Besar';

export interface UserProfile {
  name: string;
  role: string;
  photo: string | null;
}

export interface CoachingRecord {
  id: string;
  tanggal: string;
  catatan: string;
  kendala: string;
  kondisi: string;
  images?: string[]; // Array of base64 image strings
}

export interface IndustryData {
  id: string;
  badanUsaha: string;
  namaPerusahaan: string;
  jenisIjin: string;
  userIdRPBBI: string;
  namaPemilik: string;
  kabupaten: Kabupaten;
  kecamatan: string;
  alamatPabrik: string;
  koordinat?: {
    lat: number;
    lng: number;
  };
  perijinan: {
    noPBPHH: string;
    tanggal: string;
    noNIB: string;
  };
  mesin: {
    kapasitas: number;
    skala: Skala;
    jenisMesin: string;
    jumlah: number;
    modalUsaha: number;
  };
  bahanBaku: string;
  compliance: {
    tenagaTeknis: Status;
    hakAksesRPBBI: Status;
    rkophh: Status;
    dokumenAngkut: Status;
  };
  kondisiSaatIni: string; // Latest state
  kendala: string;        // Latest issue
  pembinaan: string;      // Latest note
  tanggalPembinaan: string; // Latest date
  riwayatPembinaan: CoachingRecord[]; // Full history log
}

export type MenuType = 'dashboard' | 'monitoring' | 'input' | 'pembinaan';
