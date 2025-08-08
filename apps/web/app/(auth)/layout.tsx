const Layout = ({children} : {children: React.ReactNode}) => {

  return <>
  <div className="flex flex-col items-center justify-center min-h-svh">
    {children}
  </div>
  </>
}

export default Layout
