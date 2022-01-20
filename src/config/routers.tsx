import Home from './../pages/Home'
import React, {ReactElement} from "react";
import SongList from "../pages/assets/SongList";
import ArtistList from "../pages/assets/ArtistList";
import DashBoard from "../pages/DashBoard";
import PushManager from "../pages/operation/PushManager"
export interface RouterItem {
  path: string
  element: ReactElement<any, any>
}
// @ts-ignore
const routerList: RouterItem[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/dashboard',
    element: <DashBoard />
  },
  {
    path: '/assets/artistList',
    element: <ArtistList />
  },
  {
    path: '/assets/songList',
    element: <SongList />
  },
  {
    path: '/operations/pushManager',
    element: <PushManager />
  },
] as const

export type routerPathList = typeof routerList[number]['path']

export default routerList
