// ** Icon imports
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import HomeOutline from 'mdi-material-ui/HomeOutline'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    // {
    //   title: 'Account Settings',
    //   icon: AccountCogOutline,
    //   path: '/account-settings'
    // },

    // {
    //   title: 'Koordinator',
    //   icon: FormatLetterCase,
    //   path: '/koordinator'
    // },
    {
      title: 'Data Warga',
      icon: FormatLetterCase,
      path: '/relawan'
    }
  ]
}

export default navigation
