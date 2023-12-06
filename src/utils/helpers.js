import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'

export const customFetchBaseQuery = baseUrl => {
  const baseQuery = fetchBaseQuery({ ...baseUrl })
  return async (args, api, extraOptions) => {
    const { error, data } = await baseQuery(args, api, extraOptions)
    if (error) {
      if (error.status == 401) {
        // showAlert("Sesi Telah Berakhir Silahkan Masuk Kembali", "error")
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        // dispatch(setToggleModalLogoutVisible(false))
        // dispatch(setUser(null))
        // dispatch(setToken(null))
        // dispatch(setSysconf(null))

        // return (window.location = "/login")
      }
      return { error: { status: error.status, data: error.data } }
    }
    if (data?.message) {
      delete data.message
    }
    // console.log(data, 'helper');
    return { data }
  }
}

export const getItem = key => {
  try {
    const data = typeof window !== 'undefined' && localStorage.getItem(key)
    return JSON.parse(data)
  } catch (error) {
    const data = typeof window !== 'undefined' && localStorage.getItem(key)
    return data
  }
}

export const setItem = (key, value) => {
  typeof window !== 'undefined' && localStorage.setItem(key, value)
}

export const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const getDateTime = timestamp => {
  if (timestamp) {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    const YMDHISFormat = `${year}-${month}-${day} ${hours - 1}:${minutes}:${seconds}`
    return YMDHISFormat
  }

  return null
}
export const conevertDate = dateString => {
  const date = new Date(dateString)
  const isoString = date.toISOString()

  return isoString
}

export function calculatePercentage(part, whole) {
  return (part / whole) * 100
}

export function formatNumber(number, prefix = null, defaultValue = 0) {
  // change number format it's number greater than 0
  if (number > 0) {
    const format = parseInt(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    if (prefix) {
      return `${prefix} ${format}`
    }
    return format
  } else {
    return defaultValue
  }
}
