import {routerPathList} from "./routers";

export interface MenuItemProps {
  title: string
  path: routerPathList
  children?: MenuItemProps[]
}

export const MenuList: MenuItemProps[] = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    title: 'Assets',
    path: '/assets',
    children: [
      {
        title: 'ArtistList',
        path: '/assets/artistList'
      },
      {
        title: 'SongList',
        path: '/assets/songList'
      }
    ]
  },
  {
    title: 'Operation',
    path: '/operations',
    children: [
      {
        title: 'PushManager',
        path: '/operations/pushManager',
      }
    ]
  },
]
