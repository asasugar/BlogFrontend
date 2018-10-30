import React from 'react'
import Loadable from 'react-loadable'
import { renderRoutes } from 'react-router-config'

import Loading from '@/components/Loading'
const RootRoute = (
  { route } //根路由
) => <div>{renderRoutes(route.routes)}</div>

const routes = [
  {
    component: RootRoute,
    routes: [
      {
        path: '/',
        component: Loadable({
          loader: () => import('@/views/XLayout/XLayout'),
          loading: Loading
        }),
        children: [
          {
            path: '/',
            exact: true,
            component: Loadable({
              loader: () => import('@/views/Home/Home'),
              loading: Loading
            })
          },
          {
            path: '/AddArticle',
            exact: true,
            component: Loadable({
              loader: () => import('@/views/Article/AddArticle/AddArticle'),
              loading: Loading
            })
          },
          {
            path: '/ArticleDetail',
            exact: true,
            component: Loadable({
              loader: () =>
                import('@/views/Article/ArticleDetail/ArticleDetail'),
              loading: Loading
            })
          },
          {
            path: '/About',
            exact: true,
            component: Loadable({
              loader: () => import('@/views/About/About'),
              loading: Loading
            })
          },
          {
            path: '/Message',
            exact: true,
            component: Loadable({
              loader: () => import('@/views/Message/Message'),
              loading: Loading
            })
          }
        ]
      }
    ]
  }
]
export default routes
