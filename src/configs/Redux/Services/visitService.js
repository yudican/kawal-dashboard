import { createApi } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/utils/constants'
import { customFetchBaseQuery, getItem } from 'src/utils/helpers'

export const visitService = createApi({
  reducerPath: 'visitService',
  baseQuery: customFetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getItem('token')
      headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),
  tagTypes: ['visitList', 'visitReport', 'settingList'],
  endpoints: builder => ({
    getVisit: builder.query({
      query: params => `/visits${params}`,
      providesTags: ['visitList']
    }),
    getVisitReport: builder.query({
      query: params => `/visits/report/list`,
      providesTags: ['visitReport']
    }),
    createVisit: builder.mutation({
      query: body => ({
        url: '/visits',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'multipart/form-data' // Set the Content-Type header to multipart/form-data
        }
      }),
      invalidatesTags: ['visitList', 'visitReport']
    }),
    shareVisit: builder.mutation({
      query: ({ body, _id }) => ({
        url: `/visits/share/${_id}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['visitList']
    }),

    // setting
    getSetting: builder.query({
      query: params => `/setting/${params}`,
      providesTags: ['settingList']
    }),
    updateSetting: builder.mutation({
      query: body => ({
        url: '/setting',
        method: 'POST',
        body
      }),
      invalidatesTags: ['settingList']
    })
    // Add other endpoints here if needed
  })
})

export const {
  useCreateVisitMutation,
  useGetVisitQuery,
  useGetSettingQuery,
  useUpdateSettingMutation,
  useGetVisitReportQuery,
  useShareVisitMutation
} = visitService
