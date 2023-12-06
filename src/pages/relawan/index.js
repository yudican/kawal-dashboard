import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Button, Col, Form, Image, Input, Modal, Pagination, Row, Select, Table, Upload, message } from 'antd'
import { useEffect, useState } from 'react'
import { useCreateVisitMutation, useGetVisitMutation } from 'src/configs/Redux/Services/visitService'
import { conevertDate, getBase64, getDateTime, getItem } from 'src/utils/helpers'
import { v4 as uuidv4 } from 'uuid'
import { ProtectedRouter } from '../_app'
import kabupatenData from './Wilayah/kabupaten.json'
import kecamatanData from './Wilayah/kecamatan.json'
import kelurahanData from './Wilayah/kelurahan.json'
import provinsiData from './Wilayah/provinsi.json'

const columns = [
  {
    title: 'No.',
    dataIndex: 'no',
    key: 'no',
    render: (_, record, index) => index + 1
  },
  {
    title: 'Nama Lengkap Relawan',
    dataIndex: 'nama_relawan',
    key: 'nama_relawan'
  },
  {
    title: 'Nama Lengkap Warga',
    dataIndex: 'nama_lengkap',
    key: 'nama_lengkap'
  },
  {
    title: 'Kabupaten',
    dataIndex: 'kotakab',
    key: 'kotakab'
  },
  {
    title: 'Kecamatan',
    dataIndex: 'kecamatan',
    key: 'kecamatan'
  },
  {
    title: 'Alamat',
    dataIndex: 'alamat',
    key: 'alamat'
  },
  {
    title: 'Foto',
    dataIndex: 'image',
    key: 'image',
    render: text => {
      return <Image src={text} className='w-10 h-10' style={{ width: 40, height: 40 }} />
    }
  },
  {
    title: 'Tanggal Input',
    dataIndex: 'date',
    key: 'date'
  }
]

const VisitPage = () => {
  const [getVisit, { data, isLoading }] = useGetVisitMutation()
  useEffect(() => {
    getVisit({ body: { limit: 10 }, params: '' })
  }, [])

  console.log(data, 'data')
  return (
    <ProtectedRouter>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Data Rumah Yang Dikunjungi'
            titleTypographyProps={{ variant: 'h6' }}
            action={<ModalForm />}
          />
          <Table dataSource={data?.visits || []} columns={columns} pagination={false} loading={isLoading} />
          <Pagination
            style={{ paddingTop: 20, paddingBottom: 20 }}
            defaultCurrent={1}
            current={data?.page}
            total={data?.total}
            className='mt-4 text-center'
            onChange={(page, limit) => getVisit({ body: { limit, page }, params: '' })}
          />
        </Card>
      </Grid>
    </ProtectedRouter>
  )
}

const ModalForm = ({ update = false, initialValue = {} }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [coordinates, setCoordinates] = useState([0, 0])

  const [imageLoading, setImageLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [fileList, setFileList] = useState(false)
  const [selectedProvinsi, setSelectedProvinsi] = useState(null)
  const [selectedKabupaten, setSelectedKabupaten] = useState(null)
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)

  const user = getItem('userData')

  const [createVisit, { isLoading }] = useCreateVisitMutation()

  const handleCreateVisit = value => {
    const formData = new FormData()
    formData.append('nama_relawan', value.nama_relawan)
    formData.append('nama_lengkap', value.nama_lengkap)
    formData.append('jenis_kelamin', value.jenis_kelamin)
    formData.append('nomor_telepon', value.nomor_telepon)
    formData.append('alamat', value.alamat)
    formData.append('rt', value.rt)
    formData.append('rw', value.rw)
    formData.append('provinsi', value.provinsi)
    formData.append('kotakab', value.kotakab)
    formData.append('kecamatan', value.kecamatan)
    formData.append('kelurahan', value.kelurahan)
    formData.append('pengikut', value.pengikut)
    formData.append('preference_1', value.preference_1)
    formData.append('preference_2', value.preference_2)
    formData.append('preference_3', value.preference_3)
    formData.append('preference_4', value.preference_4)
    formData.append('preference_5', value.preference_5)
    formData.append('image', fileList)
    formData.append('uuid', uuidv4)
    formData.append('user', user?.id)
    formData.append('date', conevertDate(getDateTime(new Date())))
    formData.append('geolocation[coordinates][0]', coordinates[0])
    formData.append('geolocation[coordinates][1]', coordinates[1])
    createVisit(formData).then(({ error, data }) => {
      if (error) {
        return message.error('Data Gagal Diinput')
      }
      setIsModalOpen(!isModalOpen)
      return message.success('Data Berhasil Diinput')
    })
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setCoordinates([latitude, longitude])
        },
        error => {
          console.error('Error getting location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleChange = ({ fileList }) => {
    const list = fileList.pop()
    setImageLoading(true)
    setTimeout(() => {
      const size = list.size / 1024
      if (size > 1024) {
        setImageLoading(false)
        return message.error('Maksimum ukuran file adalah 1 MB')
      }
      getBase64(list.originFileObj, url => {
        setImageLoading(false)
        setImageUrl(url)
      })
      setFileList(list.originFileObj)
    }, 1000)
  }

  const uploadButton = (
    <div>
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  )

  return (
    <div>
      <Button
        onClick={() => {
          handleGetLocation()
          setIsModalOpen(!isModalOpen)
        }}
      >
        {update ? 'Edit' : 'Tambah Data Rumah Dikunjungi'}
      </Button>
      <Modal
        title={update ? 'Ubah Data Rumah Dikunjungi' : 'Tambah Data Rumah Dikunjungi'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        onOk={() => form.submit()}
        confirmLoading={isLoading}
        width={800}
      >
        <div style={{ marginTop: 20 }}>
          <Form
            form={form}
            name='control-ref'
            onFinish={handleCreateVisit}
            layout={'vertical'}
            initialValues={{ ...initialValue, password: null }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='nama_relawan'
                  label='Nama Lengkap Relawan'
                  rules={[
                    {
                      required: false
                    }
                  ]}
                >
                  <Input placeholder='Input Nama Lengkap Relawan' />
                </Form.Item>
                <Form.Item
                  name='nama_lengkap'
                  label='Nama Lengkap Warga'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input Nama Lengkap Warga' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='jenis_kelamin'
                  label='Jenis Kelamin'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jenis Kelamin' allowClear>
                    <Select.Option value='Laki-Laki'>Laki-Laki</Select.Option>
                    <Select.Option value='Perempuan'>Perempuan</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name='nomor_telepon'
                  label='Nomor Telepon'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input Nomor Telepon' />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name='alamat'
                  label='Alamat'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input Alamat' />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name='rt'
                  label='RT'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input RT' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='rw'
                  label='RW'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input RW' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Lokasi'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input Lokasi' value={coordinates && coordinates.join(',')} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='provinsi'
                  label='Provinsi'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select
                    placeholder='Pilih Provinsi'
                    allowClear
                    onChange={value => {
                      const provinsi = provinsiData.find(row => row.nama === value)
                      if (provinsi) {
                        setSelectedProvinsi(provinsi.pid)
                        form.setFieldValue('kabupaten', null)
                        form.setFieldValue('kecamatan', null)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {provinsiData.map(item => (
                      <Select.Option key={item.id} value={item.nama}>
                        {item.nama}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name='kecamatan'
                  label='Kecamatan'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select
                    placeholder='Pilih Kecamatan'
                    allowClear
                    onChange={value => {
                      const kecamatan = kecamatanData.find(row => row.nama === value)
                      if (kecamatan) {
                        setSelectedKecamatan(kecamatan.pid)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {kecamatanData
                      .filter(item => item.kab_id === selectedKabupaten)
                      .map(item => (
                        <Select.Option key={item.id} value={item.nama}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='kotakab'
                  label='Kota/Kabupaten'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select
                    placeholder='Pilih Kota/Kabupaten'
                    allowClear
                    onChange={value => {
                      const kabupaten = kabupatenData.find(row => row.nama === value)
                      if (kabupaten) {
                        setSelectedKabupaten(kabupaten.pid)
                        form.setFieldValue('kecamatan', null)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {kabupatenData
                      .filter(item => item.prov_id === selectedProvinsi)
                      .map(item => (
                        <Select.Option key={item.id} value={item.nama}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name='kelurahan'
                  label='Kelurahan'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Kelurahan' allowClear>
                    {kelurahanData
                      .filter(item => item.kec_id === selectedKecamatan)
                      .map(item => (
                        <Select.Option key={item.id} value={item.nama}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name='pengikut'
                  label='Berapa Orang Teman/Rekan/Keluarga Yang Bisa Anda Ajak Untuk Mendukung Dr. H. Irwan, S.IP., MP. (Irwan Fecho)?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input placeholder='Input Pengikut' type='number' />
                </Form.Item>
                <Form.Item
                  name='preference_1'
                  label='Apa pendapat Anda tentang kinerja Dr. H. Irwan, S.IP., MP. (Irwan Fecho) sebagai Caleg DPR RI selama periode sebelumnya?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jawaban' allowClear>
                    <Select.Option value='Sangat baik'>Sangat baik</Select.Option>
                    <Select.Option value='Cukup baik'>Cukup baik</Select.Option>
                    <Select.Option value='Biasa saja'>Biasa saja</Select.Option>
                    <Select.Option value='Kurang memuaskan'>Kurang memuaskan</Select.Option>
                    <Select.Option value='Tidak tahu'>Tidak tahu</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name='preference_2'
                  label='Apa isu utama yang menurut Anda paling perlu diperhatikan di wilayah ini?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jawaban' allowClear>
                    <Select.Option value='Pendidikan'>Pendidikan</Select.Option>
                    <Select.Option value='Kesehatan'>Kesehatan</Select.Option>
                    <Select.Option value='Ekonomi'>Ekonomi</Select.Option>
                    <Select.Option value='Lingkungan'>Lingkungan</Select.Option>
                    <Select.Option value='Infrastruktur'>Infrastruktur</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name='preference_3'
                  label='Bagaimana Anda menilai visi dan misi Dr. H. Irwan, S.IP., MP. (Irwan Fecho) untuk periode kedua?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jawaban' allowClear>
                    <Select.Option value='Sangat relevan'>Sangat relevan</Select.Option>
                    <Select.Option value='Cukup relevan'>Cukup relevan</Select.Option>
                    <Select.Option value='Kurang relevan'>Kurang relevan</Select.Option>
                    <Select.Option value='Tidak tahu'>Tidak tahu</Select.Option>
                    <Select.Option value='Tidak memiliki pandangan'>Tidak memiliki pandangan</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name='preference_4'
                  label='Apa isu utama yang menurut Anda paling perlu diperhatikan di wilayah ini?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jawaban' allowClear>
                    <Select.Option value='Ya, sangat terasa'>Ya, sangat terasa</Select.Option>
                    <Select.Option value='Ya, agak terasa'>Ya, agak terasa</Select.Option>
                    <Select.Option value='Tidak terasa'>Tidak terasa</Select.Option>
                    <Select.Option value='Tidak tahu'>Tidak tahu</Select.Option>
                    <Select.Option value='Belum terlibat'>Belum terlibat</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name='preference_5'
                  label='Bagaimana Anda melihat partisipasi masyarakat dalam proses politik di daerah ini?'
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select placeholder='Pilih Jawaban' allowClear>
                    <Select.Option value='Sangat aktif dan terlibat'>Sangat aktif dan terlibat</Select.Option>
                    <Select.Option value='Cukup aktif'>Cukup aktif</Select.Option>
                    <Select.Option value='Kurang aktif'>Kurang aktif</Select.Option>
                    <Select.Option value='Tidak terlibat'>Tidak terlibat</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label='Image'
                  name='image'
                  rules={[
                    {
                      required: true,
                      message: 'Please input Image!'
                    }
                  ]}
                >
                  <Upload
                    name='image'
                    listType='picture-card'
                    className='avatar-uploader'
                    showUploadList={false}
                    multiple={false}
                    beforeUpload={() => false}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      imageLoading ? (
                        <LoadingOutlined />
                      ) : (
                        <img src={imageUrl} alt='avatar' className='max-h-[100px] h-28 w-28 aspect-square' />
                      )
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default VisitPage
