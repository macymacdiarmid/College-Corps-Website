import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CohortFoodInsecurity from './pages/CohortFoodInsecurity'
import CohortClimateAction from './pages/CohortClimateAction'
import CohortHealthyFutures from './pages/CohortHealthyFutures'
import CohortK12Education from './pages/CohortK12Education'
import Contact from './pages/Contact'
import Updates from './pages/Updates'
import FAQ from './pages/FAQ'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/cohorts/food"        element={<CohortFoodInsecurity />} />
            <Route path="/cohorts/climate"     element={<CohortClimateAction />} />
            <Route path="/cohorts/health"      element={<CohortHealthyFutures />} />
            <Route path="/cohorts/k12"         element={<CohortK12Education />} />
            <Route path="/contact"             element={<Contact />} />
            <Route path="/updates"             element={<Updates />} />
            <Route path="/faq"                 element={<FAQ />} />
            <Route path="/about"               element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
