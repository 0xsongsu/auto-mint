import { useState, useEffect } from 'react'
import {
  BrowserRouter,
  useRoutes
} from "react-router-dom";
import routesList from '@/router';

function App () {



  

  return (
    <>


      <BrowserRouter>
        {/* 3. 替换之前的Routes组件 */}
        <WrapperRoutes />
      </BrowserRouter>
     
    </>
  )
}
// 使用useRoutes方法传入routesList生成Routes组件
function WrapperRoutes() {
  let element = useRoutes(routesList)
  return element
}

export default App
