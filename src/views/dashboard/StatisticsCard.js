// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import { calculatePercentage, formatNumber } from 'src/utils/helpers'

const RenderStats = ({ visit, target }) => {
  const salesData = [
    {
      stats: formatNumber(target),
      color: 'info',
      title: 'Target',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: formatNumber(visit?.total) || 0,
      title: 'Rumah Warga Yang Dikunjungi',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: calculatePercentage(visit?.total, target).toFixed(2) + '%',
      color: 'warning',
      title: 'Realisasi',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    }
  ]
  return salesData.map((item, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = ({ visit, target = 0 }) => {
  return (
    <Card>
      <CardHeader
        title='Perolehan Statistik DDC'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total {calculatePercentage(visit?.total, target).toFixed(2)}% realisasi
            </Box>{' '}
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        <Grid container spacing={[5, 0]}>
          <RenderStats visit={visit} target={target} />
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
