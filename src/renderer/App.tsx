import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './Variables.css';
import './App.css';
import { EntryPage } from './pages/EntryPage';
import { DashPage } from "./pages/DashPage";

export default function App() {
    return (
        <div className="page-base">
            <Router>
                <Routes>
                    <Route path="/" element={<EntryPage/>} />
                    <Route path="/dashboard" element={<DashPage/>} />
                </Routes>
            </Router>
        </div>
    );
}
