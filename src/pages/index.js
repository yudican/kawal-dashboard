// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Card } from 'antd'
import {
  useGetVisitQuery,
  useGetVisitReportCityQuery,
  useGetVisitReportQuery,
  useGetVisitReportQuestionQuery
} from 'src/configs/Redux/Services/visitService'
import BarChart from 'src/layouts/components/chart'
import MapPoligon from 'src/views/dashboard/MapPoligon'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import Trophy from 'src/views/dashboard/Trophy'
import { ProtectedRouter } from './_app'
import MapWithMarkers from 'src/views/dashboard/MapWithMarkers'
import LineChart from 'src/views/dashboard/LineChart'
import PieChart from 'src/views/dashboard/PieChart'

const Dashboard = () => {
  const { data, isLoading } = useGetVisitQuery('?limit=30')
  const { data: reportData, isLoading: loadingdata } = useGetVisitReportQuery()
  const { data: reportQuestionData, isLoading: loadingQuestiondata } = useGetVisitReportQuestionQuery()
  const { data: reportCityData, isLoading: loadingCitydata } = useGetVisitReportCityQuery()
  console.log(reportQuestionData, 'reportQuestionData')
  console.log(reportCityData, 'reportCityData')
  const cityData =
    (reportCityData &&
      reportCityData.map(item => {
        return {
          label: item._id.kotakab,
          value: item.count
        }
      })) ||
    []

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
  return (
    <ProtectedRouter>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Trophy data={data} />
          </Grid>
          <Grid item xs={12} md={8}>
            <StatisticsCard visit={data} />
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
          <Grid item xs={12} md={4}>
            <Card>
              <PieChart values={reportData?.counts} labels={reportData?.months} />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <BarChart values={cityData.map(item => item.value)} labels={cityData.map(item => item.label)} />
            </Card>
          </Grid>
          {questions.map(item => {
            return (
              <Grid item xs={12} md={6}>
                <Card>
                  <BarChart
                    values={reportQuestionData[item.value]?.map(row => row[row._id])}
                    labels={reportQuestionData[item.value]?.map(row => row._id)}
                    title={item.label}
                  />
                </Card>
              </Grid>
            )
          })}

          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MapPoligon data={data?.visits || []} cities={cityData || []} />
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MapWithMarkers data={data?.visits || []} />
            </Card>
          </Grid>
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
