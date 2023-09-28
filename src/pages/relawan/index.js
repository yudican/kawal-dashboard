import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { useGetVisitQuery } from 'src/configs/Redux/Services/visitService'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import { ProtectedRouter } from '../_app'

const VisitPage = () => {
  const { data, isLoading, refetch } = useGetVisitQuery(`?limit=50`)
  console.log(data, 'data')
  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Korrdinator' titleTypographyProps={{ variant: 'h6' }} />
          <TableStickyHeader
            data={
              data?.visits.map(item => {
                return {
                  ...item,
                  name: item?.user?.name || '-'
                }
              }) || []
            }
            currentPage={data?.page - 1}
            total={data?.totalResults}
            columns={[
              { id: 'name', label: 'Koordinator' },
              { id: 'nama_lengkap', label: 'Nama Lengkap' },
              { id: 'jenis_kelamin', label: 'Jenis Kelamin' },
              { id: 'alamat', label: 'Alamat' },
              { id: 'pengikut', label: 'Pegikut' }
            ]}

            // onChangePage={page => {
            //   console.log(page + 1, 'page')
            //   refetch(`?page=${page + 1}`)
            // }}
          />
        </Card>
      </Grid>
    </ProtectedRouter>
  )
}

export default VisitPage
