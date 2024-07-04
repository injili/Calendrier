import {
  RouterProvider,
  createBrowserRouter,
  Outlet
} from 'react-router-dom';

// import Footer from "./components/footer";
// import Navigation from "./components/navigation";
// import Home from './pages/Home';

// const Layout = () => {
//   return (
//     <div className="text-zinc-950 cursor-pointer bg-zinc-950">
//       <Navigation />
//       <Outlet />
//       <Footer />
//     </div>
//   );
// }

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element:<Layout/>,
//     children:[
//       {
//         path: '/',
//         element: <Home/>
//       }
//     ]
//   }
// ])

export default function App() {
  return (
    <div className="">
      <RouterProvider router={router}/>
    </div>
  )
}