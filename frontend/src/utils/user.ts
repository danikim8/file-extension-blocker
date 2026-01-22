export const getUserId = (): string => {
  const STORAGE_KEY = 'file-blocker-user-id'
  
  let userId = localStorage.getItem(STORAGE_KEY)
  
  if (!userId) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 11)
    userId = `user_${timestamp}_${random}`
    localStorage.setItem(STORAGE_KEY, userId)
  }
  
  return userId
}
