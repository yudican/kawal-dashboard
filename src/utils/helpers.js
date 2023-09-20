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
