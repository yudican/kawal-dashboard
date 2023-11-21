import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation
} from 'src/configs/Redux/Services/profileService'
import { ProtectedRouter } from '../_app'
import { useState } from 'react'

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
  },
  {
    title: 'Action',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => {
      return <ModalForm update initialValue={record} />
    }
  }
]

const KoordinatorPage = () => {
  const api = useGetUsersQuery(`?limit=50`)

  const { data, isLoading, refetch } = api

  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Data Koordinator'
            titleTypographyProps={{ variant: 'h6' }}
            action={<ModalForm loading={isLoading} />}
          />
          <Table dataSource={data?.results || []} columns={columns} pagination={true} loading={isLoading} />
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

const ModalForm = ({ update = false, initialValue = {} }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [createUser, { isLoading }] = useCreateUserMutation()
  const [updateUser, { isLoading: loadingUpdateUser }] = useUpdateUserMutation()

  const handleCreateUser = value => {
    if (update) {
      return updateUser(value, initialValue.id).then(({ error, data }) => {
        if (error) {
          return message.error('Data Gagal Diinput')
        }
        setIsModalOpen(!isModalOpen)
        return message.success('Data Berhasil Diinput')
      })
    }
    // create user
    createUser(value).then(({ error, data }) => {
      if (error) {
        return message.error('Data Gagal Diinput')
      }
      setIsModalOpen(!isModalOpen)
      return message.success('Data Berhasil Diinput')
    })
  }
  return (
    <div>
      <Button onClick={() => setIsModalOpen(!isModalOpen)}>{update ? 'Edit' : 'Tambah Koordinator'}</Button>
      <Modal
        title={update ? 'Ubah Data Koordinator' : 'Input Data Koordinator'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        onOk={() => form.submit()}
        confirmLoading={isLoading || loadingUpdateUser}
      >
        <div style={{ marginTop: 20 }}>
          <Form
            form={form}
            name='control-ref'
            onFinish={handleCreateUser}
            layout={'vertical'}
            initialValues={{ ...initialValue, password: null }}
          >
            <Form.Item
              name='name'
              label='Nama Lengkap'
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input placeholder='Input Nama Lengkap' />
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input placeholder='Input Email' />
            </Form.Item>
            {!update && (
              <Form.Item
                name='password'
                label='Kata Sandi'
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <Input.Password placeholder='Input Kata Sandi' />
              </Form.Item>
            )}
            <Form.Item
              name='role'
              label='Role'
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select placeholder='Pilih Role' allowClear>
                <Select.Option value='admin'>Admin</Select.Option>
                <Select.Option value='user'>Member</Select.Option>
                <Select.Option value='lead'>Lead</Select.Option>
                <Select.Option value='verifikator'>Verifikator</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default KoordinatorPage
