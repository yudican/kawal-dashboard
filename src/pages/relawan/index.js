import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Image, Table } from 'antd'
import { useGetVisitQuery } from 'src/configs/Redux/Services/visitService'
import { ProtectedRouter } from '../_app'

const columns = [
  {
    title: 'No.',
    dataIndex: 'no',
    key: 'no',
    render: (_, record, index) => index + 1
  },
  {
    title: 'Koordinator',
    dataIndex: 'nama',
    key: 'nama',
    render: (_, record) => record?.user?.name || '-'
  },
  {
    title: 'Nama Lengkap',
    dataIndex: 'nama_lengkap',
    key: 'nama_lengkap'
  },
  {
    title: 'Jenis Kelamin',
    dataIndex: 'jenis_kelamin',
    key: 'jenis_kelamin'
  },
  {
    title: 'Alamat',
    dataIndex: 'alamat',
    key: 'alamat'
  },
  {
    title: 'Pegikut',
    dataIndex: 'pengikut',
    key: 'pengikut'
  },
  {
    title: 'Foto',
    dataIndex: 'image',
    key: 'image',
    render: text => {
      return <Image src={text} className='w-10 h-10' style={{ width: 40, height: 40 }} />
    }
  }
]

const VisitPage = () => {
  const { data, isLoading, refetch } = useGetVisitQuery(`?limit=1000`)
  console.log(data)
  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Relawan' titleTypographyProps={{ variant: 'h6' }} />
          <Table dataSource={data?.visits || []} columns={columns} pagination={true} />
        </Card>
      </Grid>
    </ProtectedRouter>
  )
}

export default VisitPage
