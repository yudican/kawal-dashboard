// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <span>
          {`© ${new Date().getFullYear()}, Develop `}
          {` by `}
        </span>
        <img src={'https://i.ibb.co/vZTLtbp/loog-markdata.png'} style={{ height: 30, marginLeft: 10 }} />
      </Typography>
      {/* {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/LICENSE'
          >
            MIT License
          </Link>
          <Link target='_blank' href='https://themeselection.com/'>
            More Themes
          </Link>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/README.md'
          >
            Documentation
          </Link>
          <Link
            target='_blank'
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/issues'
          >
            Support
          </Link>
        </Box>
      )} */}
    </Box>
  )
}

export default FooterContent
