// https://docs.telegram-mini-apps.com/platform/init-data#:~:text=This%20section%20provides%20a%20complete%20list%20of%20parameters%20used%20in%20initialization%20data
export interface TelegramUserInitData {
  initData: string
  user: TelegramUserData
  authDate: number
  signature: string
  hash: string
}

export interface TelegramUserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface TelegramUserDataValidationResponse {
  success: boolean
  error?: string
  details?: string
}