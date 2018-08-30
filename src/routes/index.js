import React from 'react'
import Imported from 'react-imported-component'
import { renderRoutes } from 'react-router-config'

const RootRoute = (
  { route } //根路由
) => <div>{renderRoutes(route.routes)}</div>

const routes = [
  {
    component: RootRoute,
    routes: [
      {
        path: '/',
        exact: true,
        component: Imported(() => import('@/views/Home/Home'))
      },
      {
        path: '/About',
        exact: true,
        component: Imported(() => import('@/views/About/About'))
      },
      {
        path: '/Message',
        exact: true,
        component: Imported(() => import('@/views/Message/Message'))
      }
    ]
  }
]
export default routes
