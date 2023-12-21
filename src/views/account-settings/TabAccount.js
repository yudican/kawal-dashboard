// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { useUpdateProfileMutation } from 'src/configs/Redux/Services/profileService'
import { toast } from 'react-toastify'
import { setUserData } from 'src/configs/Redux/Reducers/userReducer'
import { getItem, setItem } from 'src/utils/helpers'
import { useDispatch } from 'react-redux'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  const dispatch = useDispatch()
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState(null)
  const user = getItem('userData')
  const [form, setForm] = useState({
    name: null,
    email: null,
    telepon: null,
    photo: null,
    role: null
  })

  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation()

  useEffect(() => {
    setForm({
      name: null,
      email: null,
      telepon: null,
      photo: null,
      role: null,
      ...user
    })
  }, [])

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      setForm({
        ...form,
        photo: files[0]
      })
    }
  }

  const handleSubmit = async () => {
    return toast.error('Anda tidak di ijinkan untuk melakukan kasi ini')
    try {
      // Validate form data using Yup
      // Submit the form or perform the desired action here
      const formData = new FormData()
      const newForm = {
        ...form
      }

      formData.append('name', newForm.name)
      formData.append('email', newForm.email)
      formData.append('telepon', newForm.telepon)
      if (form.photo) {
        formData.append('photo', newForm.photo)
      }
      console.log(newForm, 'newForm')
      updateProfile(formData).then(({ data, error }) => {
        if (error) {
          return toast(error?.data?.message || 'Ubah Profil Gagal')
        }

        toast.success('Ubah Profil berhasil')

        dispatch(setUserData(data))
        return setItem('userData', JSON.stringify(data))
      })
    } catch (error) {
      // Handle validation errors and set validationErrors state
      const errors = {}
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc || user?.photo || '/images/avatars/1.png'} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                {/* <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled> */}
                {/* <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography> */}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nama Lengkap'
              // placeholder='johnDoe'
              value={form?.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              value={form?.email}
              // placeholder='johnDoe@example.com'
              onChange={e =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label='Role'
                value={form?.role}
                disabled
                onChange={e =>
                  setForm({
                    ...form,
                    role: e.target.value
                  })
                }
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>Koordinator</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Telepon'
              value={form?.telepon}
              // placeholder='08123xxxxxx'
              onChange={e =>
                setForm({
                  ...form,
                  telepon: e.target.value
                })
              }
            />
          </Grid>

          {/* {openAlert ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }
              >
                <AlertTitle>Your email is not confirmed. Please check your inbox.</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  Resend Confirmation
                </Link>
              </Alert>
            </Grid>
          ) : null} */}

          <Grid item xs={12}>
            <Button disabled variant='contained' sx={{ marginRight: 3.5 }} onClick={() => handleSubmit()}>
              Save Changes
            </Button>
            <Button disabled type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
