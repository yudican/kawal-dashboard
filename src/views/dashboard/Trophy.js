// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { formatNumber, getItem } from 'src/utils/helpers'
import { useRouter } from 'next/router'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

const Trophy = ({ data }) => {
  const router = useRouter()
  const userData = getItem('userData')
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Congratulations {userData?.name}! 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          Total Data
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {formatNumber(data?.total) || '0'}
        </Typography>
        <Button size='small' variant='contained' onClick={() => router.push('/relawan')}>
          Lihat Rumah Yang Dikunjungi
        </Button>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='https://i.ibb.co/bsVRb6b/ir1.png' style={{ height: 70, marginBottom: 50 }} />
      </CardContent>
    </Card>
  )
}

export default Trophy
