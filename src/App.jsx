import {
  RouterProvider,
  createBrowserRouter,
  Outlet
} from 'react-router-dom';

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Guest from './pages/Guest';

const Layout = () => {
  return (
    <div className="text-zinc-950 cursor-pointer bg-neutral-150">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element:<Layout/>,
    children:[
      {
        path: '/',
        element: <Guest/>
      }
    ]
  }
])

export default function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}