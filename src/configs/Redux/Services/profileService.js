import { createApi } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/utils/constants'
import { customFetchBaseQuery, getItem } from 'src/utils/helpers'

export const profileService = createApi({
  reducerPath: 'profileService',
  baseQuery: customFetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      // headers.set('Content-Type', `multipart/form-data`)
      return headers
    }
  }),
  endpoints: builder => ({
    updateProfile: builder.mutation({
      query: body => ({
        url: '/profile/update/profile',
        method: 'POST',
        body
        // headers: {
        //   'Content-Type': 'multipart/form-data' // Set the Content-Type header to multipart/form-data
        // }
      })
    }),

    updatePassword: builder.mutation({
      query: body => ({
        url: '/profile/update/password',
        method: 'POST',
        body
      })
    }),
    getUsers: builder.query({
      query: page => `/users${page ? page : ''}`
    })

    // Add other endpoints here if needed
  })
})

export const { useUpdateProfileMutation, useUpdatePasswordMutation, useGetUsersQuery } = profileService
