import type { Animal } from './types'

export const MOCK_ANIMALES: Animal[] = [
  { id: '1',  rfid: 'GV-001', raza: 'Angus',      fechaNacimiento: '2021-03-12', pesoUltimo: 450, corral: 'A1', lote: 'Lote Norte', estado: 'activo' },
  { id: '2',  rfid: 'GV-002', raza: 'Hereford',   fechaNacimiento: '2020-07-05', pesoUltimo: 512, corral: 'A2', lote: 'Lote Norte', estado: 'activo' },
  { id: '3',  rfid: 'GV-003', raza: 'Brahman',    fechaNacimiento: '2022-01-20', pesoUltimo: 380, corral: 'B1', lote: 'Lote Sur',   estado: 'activo' },
  { id: '4',  rfid: 'GV-004', raza: 'Angus',      fechaNacimiento: '2021-11-08', pesoUltimo: 430, corral: 'B2', lote: 'Lote Sur',   estado: 'baja'   },
  { id: '5',  rfid: 'GV-005', raza: 'Simmental',  fechaNacimiento: '2020-04-15', pesoUltimo: 560, corral: 'A1', lote: 'Lote Norte', estado: 'activo' },
  { id: '6',  rfid: 'GV-006', raza: 'Charolais',  fechaNacimiento: '2022-06-30', pesoUltimo: 310, corral: 'C1', lote: 'Lote Este',  estado: 'activo' },
  { id: '7',  rfid: 'GV-007', raza: 'Hereford',   fechaNacimiento: '2021-09-18', pesoUltimo: 490, corral: 'C2', lote: 'Lote Este',  estado: 'activo' },
  { id: '8',  rfid: 'GV-008', raza: 'Brahman',    fechaNacimiento: '2023-02-10', pesoUltimo: 280, corral: 'B1', lote: 'Lote Sur',   estado: 'activo' },
  { id: '9',  rfid: 'GV-009', raza: 'Angus',      fechaNacimiento: '2020-12-25', pesoUltimo: 505, corral: 'A2', lote: 'Lote Norte', estado: 'baja'   },
  { id: '10', rfid: 'GV-010', raza: 'Simmental',  fechaNacimiento: '2022-08-14', pesoUltimo: 420, corral: 'C1', lote: 'Lote Este',  estado: 'activo' },
  { id: '11', rfid: 'GV-011', raza: 'Charolais',  fechaNacimiento: '2021-05-03', pesoUltimo: 535, corral: 'A1', lote: 'Lote Norte', estado: 'activo' },
  { id: '12', rfid: 'GV-012', raza: 'Angus',      fechaNacimiento: '2023-04-22', pesoUltimo: 260, corral: 'B2', lote: 'Lote Sur',   estado: 'activo' },
]

export const CORRALES = [...new Set(MOCK_ANIMALES.map(a => a.corral))].sort()
export const LOTES    = [...new Set(MOCK_ANIMALES.map(a => a.lote))].sort()
