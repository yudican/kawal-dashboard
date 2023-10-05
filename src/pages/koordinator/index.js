import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Table } from 'antd'
import { useGetUsersQuery } from 'src/configs/Redux/Services/profileService'
import { ProtectedRouter } from '../_app'

const columns = [
  {
    title: 'No.',
    dataIndex: 'no',
    key: 'no',
    render: (_, record, index) => index + 1
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role'
  }
]

const KoordinatorPage = () => {
  const api = useGetUsersQuery(`?limit=50`)
  const { data, isLoading, refetch } = api
  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Korrdinator' titleTypographyProps={{ variant: 'h6' }} />
          <Table dataSource={data?.results || []} columns={columns} pagination={true} />
          {/* <Pagination
            current={data?.page}
            defaultCurrent={1}
            total={data?.totalResults}
            pageSize={10}
            onChange={page => refetch({ page, limit: 10 })}
          /> */}
        </Card>
      </Grid>
    </ProtectedRouter>
  )
}

export default KoordinatorPage
