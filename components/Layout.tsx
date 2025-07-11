import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
  </div>
)

export default Layout