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
  useGetRealisasiMutation,
  useGetVisitMutation,
  useGetVisitQuery,
  useGetVisitReportCityQuery,
  useGetVisitReportQuery,
  useGetVisitReportQuestionQuery
} from 'src/configs/Redux/Services/visitService'
import BarChart from 'src/layouts/components/chart'
import LineChart from 'src/views/dashboard/LineChart'
import MapPoligon from 'src/views/dashboard/MapPoligon'
import MapWithMarkers from 'src/views/dashboard/MapWithMarkers'
import PieChart from 'src/views/dashboard/PieChart'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import Trophy from 'src/views/dashboard/Trophy'
import { ProtectedRouter } from './_app'

import { ArrowLeftBoldOutline } from 'mdi-material-ui'
import { calculatePercentage } from 'src/utils/helpers'
import dataTarget from './relawan/Wilayah/data_target.json'

// provinsi
const columns = [
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    align: 'center',
    render: value => value || 0
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
    getRealisasi({ kotakab: '$kotakab' })
  }, [])
  console.log(cityData, 'cityData')
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
  console
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
                  dataSource={dataTarget[0]['kabupaten']}
                  columns={[
                    {
                      title: 'Nama Kabupaten',
                      dataIndex: 'nama',
                      key: 'nama',
                      render: (text, record) => {
                        return (
                          <span
                            onClick={() => {
                              setStage('selectedKabupaten')
                              setSelectedKabupaten(record)
                              getRealisasi({ kecamatan: '$kecamatan' })
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
                        const realisasi = realisasiData?.find(item => item._id.kotakab === record.nama)
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
                        const realisasi = realisasiData?.find(item => item._id.kotakab === record.nama)
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return <Progress type='circle' percent={percent.toFixed(2)} size={50} />
                        }

                        return <Progress type='circle' percent={0} size={50} />
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
                        getRealisasi({ kotakab: '$kotakab' })
                      }}
                    >
                      <ArrowLeftBoldOutline />
                    </span>
                    <span>{`Laporan Wilayah ${selectedKabupaten['nama']}`}</span>
                  </div>
                }
              >
                <Table
                  dataSource={selectedKabupaten.kecamatan}
                  columns={[
                    {
                      title: 'Nama Kecamatan',
                      dataIndex: 'nama',
                      key: 'nama',
                      render: (text, record) => {
                        return (
                          <span
                            // onClick={() => {
                            //   setStage('selectedKecamatan')
                            //   setSelectedKecamatan(record)
                            //   getRealisasi({ kelurahan: '$kelurahan' })
                            // }}
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
                        const realisasi = realisasiData?.find(item => item._id.kecamatan === record.nama)
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
                        const realisasi = realisasiData?.find(item => item._id.kecamatan === record.nama)
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return <Progress type='circle' percent={percent.toFixed(2)} size={50} />
                        }

                        return <Progress type='circle' percent={0} size={50} />
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
                        getRealisasi({ kecamatan: '$kecamatan' })
                      }}
                    >
                      <ArrowLeftBoldOutline />
                    </span>
                    <span>{`Laporan Wilayah ${selectedKecamatan['nama']}`}</span>
                  </div>
                }
              >
                <Table
                  dataSource={selectedKecamatan.kelurahan}
                  columns={[
                    {
                      title: 'Nama Kelurahan',
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
                        const realisasi = realisasiData?.find(item => item._id.kelurahan === record.nama)
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
                        const realisasi = realisasiData?.find(item => item._id.kelurahan === record.nama)
                        if (realisasi) {
                          const percent = calculatePercentage(realisasi.count, record.target)
                          return <Progress type='circle' percent={percent.toFixed(2)} size={50} />
                        }

                        return <Progress type='circle' percent={0} size={50} />
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
          {!isLoading && (
            <Grid item xs={12} md={12} lg={12}>
              <Card>
                <MapWithMarkers data={data?.visits || []} />
              </Card>
            </Grid>
          )}
          {/* <Grid item xs={12} md={6} lg={4}>
            <TotalEarning />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='$25.6k'
                  icon={<Poll />}
                  color='success'
                  trendNumber='+42%'
                  title='Total Profit'
                  subtitle='Weekly Profit'
                />
              </Grid>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='$78'
                  title='Refunds'
                  trend='negative'
                  color='secondary'
                  trendNumber='-15%'
                  subtitle='Past Month'
                  icon={<CurrencyUsd />}
                />
              </Grid>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='862'
                  trend='negative'
                  trendNumber='-18%'
                  title='New Project'
                  subtitle='Yearly Project'
                  icon={<BriefcaseVariantOutline />}
                />
              </Grid>
              <Grid item xs={6}>
                <CardStatisticsVerticalComponent
                  stats='15'
                  color='warning'
                  trend='negative'
                  trendNumber='-18%'
                  subtitle='Last Week'
                  title='Sales Queries'
                  icon={<HelpCircleOutline />}
                />
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <SalesByCountries />
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <DepositWithdraw />
          </Grid>
          <Grid item xs={12}>
            <Table />
          </Grid> */}
        </Grid>
      </ApexChartWrapper>
    </ProtectedRouter>
  )
}

export default Dashboard
