export type CloseFunctionType = {
  onClose: () => void
}
// 입양약속 생성 타입
export type CreateAppointmentModalType = {
  shelterName: string
  dogName: string
} & CloseFunctionType
