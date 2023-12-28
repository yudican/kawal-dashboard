import { Button, Col, Form, Modal, Row, Select } from 'antd'
import kabupatenData from '../../../pages/relawan/Wilayah/kabupaten.json'
import kecamatanData from '../../../pages/relawan/Wilayah/kecamatan.json'
import kelurahanData from '../../../pages/relawan/Wilayah/kelurahan.json'
import provinsiData from '../../../pages/relawan/Wilayah/provinsi.json'
import { useState } from 'react'

const ModalFormFilterWilayah = ({ onFinish, isFilter = false }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedProvinsi, setSelectedProvinsi] = useState(null)
  const [selectedKabupaten, setSelectedKabupaten] = useState(null)
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)
  const [selectedKelurahan, setSelectedKelurahan] = useState(null)
  const [selectedProvinsiPid, setSelectedProvinsiPid] = useState(null)
  const [selectedKabupatenPid, setSelectedKabupatenPid] = useState(null)
  const [selectedKecamatanPid, setSelectedKecamatanPid] = useState(null)

  return (
    <div>
      <Button
        onClick={() => {
          if (isFilter) {
            return onFinish(null)
          }
          setIsModalOpen(!isModalOpen)
        }}
        style={{ marginRight: 5 }}
      >
        {isFilter ? 'Hapus Filter' : 'Filter'}
      </Button>
      <Modal
        title={'Filter Lokasi'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        onOk={() => form.submit()}
        width={800}
      >
        <div style={{ marginTop: 20 }}>
          <Form
            form={form}
            name='control-ref'
            onFinish={value => {
              const body = {}
              if (selectedProvinsi) {
                body.provinsi = selectedProvinsi
              }
              if (selectedKabupaten) {
                body.kotakab = selectedKabupaten
              }
              if (selectedKecamatan) {
                body.kecamatan = selectedKecamatan
              }
              if (selectedKelurahan) {
                body.kelurahan = selectedKelurahan
              }
              onFinish(body)
              setIsModalOpen(!isModalOpen)
            }}
            layout={'vertical'}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='provinsi' label='Provinsi' rules={[{}]}>
                  <Select
                    placeholder='Pilih Provinsi'
                    allowClear
                    onChange={value => {
                      const provinsi = provinsiData.find(row => row.pid == value)
                      if (provinsi) {
                        setSelectedProvinsi(provinsi.nama)
                        setSelectedProvinsiPid(provinsi.pid)
                        form.setFieldValue('kabupaten', null)
                        form.setFieldValue('kecamatan', null)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {provinsiData.map(item => (
                      <Select.Option key={item.id} value={`${item.pid}`}>
                        {item.nama}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name='kecamatan' label='Kecamatan' rules={[{}]}>
                  <Select
                    placeholder='Pilih Kecamatan'
                    allowClear
                    onChange={value => {
                      const kecamatan = kecamatanData.find(row => row.pid == value)
                      if (kecamatan) {
                        setSelectedKecamatan(kecamatan.nama)
                        setSelectedKecamatanPid(kecamatan.pid)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {kecamatanData
                      .filter(item => item.kab_id === selectedKabupatenPid)
                      .map(item => (
                        <Select.Option key={item.id} value={`${item.pid}`}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='kotakab' label='Kota/Kabupaten' rules={[{}]}>
                  <Select
                    placeholder='Pilih Kota/Kabupaten'
                    allowClear
                    onChange={value => {
                      const kabupaten = kabupatenData.find(row => row.pid == value)
                      if (kabupaten) {
                        setSelectedKabupaten(kabupaten.nama)
                        setSelectedKabupatenPid(kabupaten.pid)
                        form.setFieldValue('kecamatan', null)
                        form.setFieldValue('kelurahan', null)
                      }
                    }}
                  >
                    {kabupatenData
                      .filter(item => item.prov_id === selectedProvinsiPid)
                      .map(item => (
                        <Select.Option key={item.id} value={`${item.pid}`}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                <Form.Item name='kelurahan' label='Kelurahan' rules={[{}]}>
                  <Select
                    placeholder='Pilih Kelurahan'
                    allowClear
                    onChange={value => {
                      const kelurahan = kelurahanData.find(row => row.pid == value)
                      if (kelurahan) {
                        setSelectedKelurahan(kelurahan.nama)
                      }
                    }}
                  >
                    {kelurahanData
                      .filter(item => item.kec_id === selectedKecamatanPid)
                      .map(item => (
                        <Select.Option key={item.id} value={`${item.pid}`}>
                          {item.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default ModalFormFilterWilayah
