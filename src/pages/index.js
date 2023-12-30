// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Card, Progress, Table } from 'antd'
import { useEffect, useState } from 'react'
import {
  useGetFilterCoordinatesMutation,
  useGetRealisasiMutation,
  useGetVisitMutation,
  useGetVisitReportCityQuery,
  useGetVisitReportQuery,
  useGetVisitReportQuestionQuery
} from 'src/configs/Redux/Services/visitService'
import BarChart from 'src/layouts/components/chart'
import LineChart from 'src/views/dashboard/LineChart'
import MapPoligon from 'src/views/dashboard/MapPoligon'
import MapWithMarkers from 'src/views/dashboard/MapWithMarkers'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import Trophy from 'src/views/dashboard/Trophy'
import { ProtectedRouter } from './_app'

import { ArrowLeftBoldOutline } from 'mdi-material-ui'
import ModalFormFilterWilayah from 'src/@core/components/filterWilayah'
import { calculatePercentage, createSlug, formatNumber, getColor } from 'src/utils/helpers'
import dataTarget from './relawan/Wilayah/data_target.json'

// provinsi
const columns = [
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    align: 'center',
    render: value => formatNumber(value) || 0
  }
]

const Dashboard = () => {
  const [getVisit, { data, isLoading }] = useGetVisitMutation()
  useEffect(() => {
    getVisit({ body: { limit: 1000 }, params: '' })
  }, [])
  const { data: reportData, isLoading: loadingdata } = useGetVisitReportQuery()
  const { data: reportQuestionData, isLoading: loadingQuestiondata, isSuccess } = useGetVisitReportQuestionQuery()
  const { data: reportCityData, isLoading: loadingCitydata } = useGetVisitReportCityQuery()
  const [getRealisasi, { data: realisasiData, loading: realisasiLoading }] = useGetRealisasiMutation()
  // const { data: cordinatesData, isLoading: coordinatesLoading } = useGetCoordinatesQuery()
  const [getFilterCoordinates, { data: resultCoordinates, loading: resultCoordinateLoading }] =
    useGetFilterCoordinatesMutation()

  const [stage, setStage] = useState('selectedProvinsi')
  const [selectedKabupaten, setSelectedKabupaten] = useState(null)
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)

  const cityData =
    (reportCityData &&
      reportCityData.map(item => {
        return {
          label: item._id.kotakab,
          value: item.count
        }
      })) ||
    []

  useEffect(() => {
    getRealisasi({
      filter: { kotakab: '$kotakab' },
      provinsi: dataTarget[0]['nama']
    }).then(res => console.log(res, 'res'))
    getFilterCoordinates({
      provinsi: 'Kalimantan Timur',
      kotakab: 'Kabupaten Kutai Kartanegara',
      kecamatan: 'Marang Kayu',
      kelurahan: 'Sambera Baru'
    })
  }, [])

  const questions = [
    {
      label:
        'Apa pendapat Anda tentang kinerja Dr. H. Irwan, S.IP., MP. (Irwan Fecho) sebagai Caleg DPR RI selama periode sebelumnya?',
      value: 'pertanyaan1Result'
    },
    {
      label: 'Apa isu utama yang menurut Anda paling perlu diperhatikan di wilayah ini?',
      value: 'pertanyaan2Result'
    },
    {
      label: 'Bagaimana Anda menilai visi dan misi Dr. H. Irwan, S.IP., MP. (Irwan Fecho) untuk periode kedua?',
      value: 'pertanyaan3Result'
    },
    {
      label:
        'Apakah Anda merasakan dampak positif dari program atau inisiatif yang telah dilakukan oleh Dr. H. Irwan, S.IP., MP. (Irwan Fecho) sebagai Caleg?',
      value: 'pertanyaan4Result'
    },
    {
      label: 'Bagaimana Anda melihat partisipasi masyarakat dalam proses politik di daerah ini?',
      value: 'pertanyaan5Result'
    }
  ]

  const sumOfTargets = dataTarget?.reduce((sum, student) => sum + student.target, 0) || 0
  return (
    <ProtectedRouter>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Trophy data={data} />
          </Grid>
          <Grid item xs={12} md={8}>
            <StatisticsCard visit={data} target={sumOfTargets} />
          </Grid>

          <Grid item xs={12} md={12}>
            {stage === 'selectedProvinsi' && (
              <Card title={`Laporan Wilayah ${dataTarget[0]['nama']}`}>
                <Table
                  dataSource={dataTarget[0]['kabupaten'].sort((a, b) => b.target - a.target)}
                  columns={[
                    {
                      title: 'Nama Kota/Kabupaten',
                      dataIndex: 'nama',
                      key: 'nama',
                      render: (text, record) => {
                        return (
                          <span
                            onClick={() => {
                              setStage('selectedKabupaten')
                              setSelectedKabupaten(record)
                              getRealisasi({
                                filter: { kecamatan: '$kecamatan' },
                                provinsi: dataTarget[0]['nama'],
                                kotakab: text
                              })
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {text}
                          </span>
                        )
                      }
                    },
                    ...columns,
                    {
                      title: 'Realisasi',
                      dataIndex: 'realisasi',
                      key: 'realisasi',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kotakab) === createSlug(record.nama)
                        )
                        if (realisasi) {
                          return realisasi.count
                        }
                        return 0
                      }
                    },
                    {
                      title: 'Persentase %',
                      dataIndex: 'persentase',
                      key: 'persentase',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kotakab) === createSlug(record.nama)
                        )
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return (
                            <Progress
                              type='circle'
                              percent={percent.toFixed(2)}
                              size={50}
                              strokeColor={getColor(percent)}
                            />
                          )
                        }

                        return <Progress type='circle' percent={0} size={50} strokeColor={getColor(0)} />
                      }
                    }
                  ]}
                  pagination={true}
                />
              </Card>
            )}
            {stage === 'selectedKabupaten' && (
              <Card
                title={
                  <div style={{ display: 'flex', justifyItems: 'center' }}>
                    <span
                      style={{ marginRight: 10, cursor: 'pointer' }}
                      onClick={() => {
                        setStage('selectedProvinsi')
                        setSelectedKecamatan(null)
                        getRealisasi({
                          filter: { kotakab: '$kotakab' },
                          provinsi: dataTarget[0]['nama']
                        })
                      }}
                    >
                      <ArrowLeftBoldOutline />
                    </span>
                    <span>{`Laporan Wilayah ${selectedKabupaten['nama']}`}</span>
                  </div>
                }
              >
                <Table
                  dataSource={selectedKabupaten.kecamatan.sort((a, b) => b.target - a.target)}
                  columns={[
                    {
                      title: 'Nama Kecamatan',
                      dataIndex: 'nama',
                      key: 'nama',
                      render: (text, record) => {
                        return (
                          <span
                            onClick={() => {
                              setStage('selectedKecamatan')
                              setSelectedKecamatan(record)
                              getRealisasi({
                                filter: { kelurahan: '$kelurahan' },
                                provinsi: dataTarget[0]['nama'],
                                kotakab: selectedKabupaten.nama,
                                kecamatan: text
                              })
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {text}
                          </span>
                        )
                      }
                    },
                    ...columns,
                    {
                      title: 'Realisasi',
                      dataIndex: 'realisasi',
                      key: 'realisasi',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kecamatan) === createSlug(record.nama)
                        )
                        if (realisasi) {
                          return realisasi.count
                        }
                        return 0
                      }
                    },
                    {
                      title: 'Persentase %',
                      dataIndex: 'persentase',
                      key: 'persentase',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kecamatan) === createSlug(record.nama)
                        )
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return (
                            <Progress
                              type='circle'
                              percent={percent.toFixed(2)}
                              size={50}
                              strokeColor={getColor(percent)}
                            />
                          )
                        }

                        return <Progress type='circle' percent={0} size={50} strokeColor={getColor(0)} />
                      }
                    }
                  ]}
                  pagination={true}
                />
              </Card>
            )}
            {stage === 'selectedKecamatan' && (
              <Card
                title={
                  <div style={{ display: 'flex', justifyItems: 'center' }}>
                    <span
                      style={{ marginRight: 10, cursor: 'pointer' }}
                      onClick={() => {
                        setStage('selectedKabupaten')
                        getRealisasi({
                          filter: { kecamatan: '$kecamatan' },
                          provinsi: dataTarget[0]['nama'],
                          kotakab: selectedKabupaten.nama
                        })
                      }}
                    >
                      <ArrowLeftBoldOutline />
                    </span>
                    <span>{`Laporan Wilayah ${selectedKecamatan['nama']}`}</span>
                  </div>
                }
              >
                <Table
                  dataSource={selectedKecamatan.kelurahan.sort((a, b) => b.target - a.target)}
                  columns={[
                    {
                      title: 'Nama Desa/Kelurahan',
                      dataIndex: 'nama',
                      key: 'nama'
                    },
                    ...columns,
                    {
                      title: 'Realisasi',
                      dataIndex: 'realisasi',
                      key: 'realisasi',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kelurahan) === createSlug(record.nama)
                        )
                        console.log(realisasi, realisasiData, record)
                        if (realisasi) {
                          return realisasi.count
                        }
                        return 0
                      }
                    },
                    {
                      title: 'Persentase %',
                      dataIndex: 'persentase',
                      key: 'persentase',
                      align: 'center',
                      render: (value, record) => {
                        const realisasi = realisasiData?.find(
                          item => createSlug(item._id.kelurahan) === createSlug(record.nama)
                        )
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return (
                            <Progress
                              type='circle'
                              percent={percent.toFixed(2)}
                              size={50}
                              strokeColor={getColor(percent)}
                            />
                          )
                        }

                        return <Progress type='circle' percent={0} size={50} strokeColor={getColor(0)} />
                      }
                    }
                  ]}
                  pagination={true}
                />
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <BarChart values={reportData?.counts} labels={reportData?.months} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <LineChart values={reportData?.counts} labels={reportData?.months} />
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Card>
              <PieChart values={reportData?.counts} labels={reportData?.months} />
            </Card>
          </Grid> */}
          <Grid item xs={12} md={6}>
            <Card>
              <BarChart values={cityData.map(item => item.value)} labels={cityData.map(item => item.label)} />
            </Card>
          </Grid>
          {isSuccess &&
            questions.map((item, index) => {
              return (
                <Grid item xs={12} md={6}>
                  <Card>
                    <BarChart
                      values={reportQuestionData[item.value]?.map(row => row[row._id])}
                      labels={reportQuestionData[item.value]?.map(row => row._id)}
                      title={item.label}
                      label={'Pertanyaan ' + (index + 1)}
                    />
                  </Card>
                </Grid>
              )
            })}

          {!loadingCitydata && (
            <Grid item xs={12} md={12} lg={12}>
              <Card>
                <MapPoligon data={data?.visits || []} cities={cityData || []} />
              </Card>
            </Grid>
          )}
          {!resultCoordinateLoading && (
            <Grid item xs={12} md={12} lg={12}>
              <Card extra={<ModalFormFilterWilayah onFinish={value => getFilterCoordinates(value)} />}>
                <MapWithMarkers data={resultCoordinates || []} />
              </Card>
            </Grid>
          )}
        </Grid>
      </ApexChartWrapper>
    </ProtectedRouter>
  )
}

export default Dashboard
