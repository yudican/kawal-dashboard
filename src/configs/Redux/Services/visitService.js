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
    getVisit: builder.mutation({
      query: ({ body, params }) => ({
        url: '/visits/lists' + params,
        method: 'POST',
        body
      }),
      providesTags: ['visitList']
    }),
    getVisitReport: builder.query({
      query: params => `/visits/report/list`,
      providesTags: ['visitReport']
    }),
    getVisitReportQuestion: builder.query({
      query: params => `/visits/report/questions`,
      providesTags: ['ReportQuestion']
    }),
    getVisitReportCity: builder.query({
      query: params => `/visits/report/city`,
      providesTags: ['ReportCity']
    }),
    createVisit: builder.mutation({
      query: body => ({
        url: '/visits',
        method: 'POST',
        body
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
    }),
    getRealisasi: builder.mutation({
      query: body => ({
        url: '/visits/report/realisasi',
        method: 'POST',
        body
      })
    }),
    getRealisasiExport: builder.mutation({
      query: body => ({
        url: '/visits/report/export/realisasi',
        method: 'POST',
        body
      })
    }),
    getCoordinates: builder.query({
      query: params => `/visits/report/coordinates`
    }),
    getFilterCoordinates: builder.mutation({
      query: body => ({
        url: '/visits/report/coordinates/v2',
        method: 'POST',
        body
      })
    })
    // Add other endpoints here if needed
  })
})

export const {
  useCreateVisitMutation,
  useGetVisitMutation,
  useGetSettingQuery,
  useUpdateSettingMutation,
  useGetVisitReportQuery,
  useGetVisitReportQuestionQuery,
  useGetVisitReportCityQuery,
  useShareVisitMutation,
  useGetRealisasiMutation,
  useGetRealisasiExportMutation,
  useGetCoordinatesQuery,
  useGetFilterCoordinatesMutation
} = visitService
