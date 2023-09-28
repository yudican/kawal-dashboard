import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { useGetVisitQuery } from 'src/configs/Redux/Services/visitService'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import { ProtectedRouter } from '../_app'
import { useGetUsersQuery } from 'src/configs/Redux/Services/profileService'

const KoordinatorPage = () => {
  const { data, isLoading, refetch } = useGetUsersQuery(`?limit=50`)

  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Korrdinator' titleTypographyProps={{ variant: 'h6' }} />
          <TableStickyHeader
            data={data?.results || []}
            currentPage={data?.page - 1}
            total={data?.totalResults}
            columns={[
              { id: 'name', label: 'Name', minWidth: 170 },
              { id: 'email', label: 'Email', minWidth: 170 },
              { id: 'role', label: 'Role', minWidth: 170 }
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

export default KoordinatorPage
