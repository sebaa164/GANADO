export type DeviceType = 'rfid' | 'camera'
export type DeviceStatus = 'online' | 'offline' | 'testing'

export interface RfidAntenna {
  id: string
  type: 'rfid'
  name: string
  location: string
  ipAddress: string
  port: number
  frequency: string       // e.g. "902-928 MHz"
  lastPing: string | null // ISO timestamp
  status: DeviceStatus
  recentActivity: boolean
}

export interface IpCamera {
  id: string
  type: 'camera'
  name: string
  location: string
  ipAddress: string
  port: number
  resolution: string   // e.g. "1920x1080"
  streamUrl: string
  lastPing: string | null
  status: DeviceStatus
  recentActivity: boolean
}

export type HardwareDevice = RfidAntenna | IpCamera

export interface TestResult {
  id: string
  success: boolean
  latencyMs: number | null
  message: string
  testedAt: string
}
