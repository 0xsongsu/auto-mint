// router/index.js
import Home from '@/page/Home'
import Layout from '@/page/Layout'
const routes = [
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        index: true,
        element: <Home />
      },
    ]
  },
  


];

export default routes