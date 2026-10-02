import "./index.css";
import {Input} from "./components/ui/input.tsx";
import {Search, LogInIcon} from "lucide-react";
import LoginView from "@/src/pages/loginview.tsx";
import {Routes, Route, Link} from "react-router-dom";
import MarketView from "./pages/marketplace.tsx";

export function App() {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#080B0A]">
            <TopBar/>
            <Routes>
                <Route path={"/"} element={<MarketView/>}/>
                <Route path={"/login"} element={<LoginView/>}/>
            </Routes>
        </div>
    );
}

function TopBar() {
    return (
        <div className="fixed top-3 left-3 right-3 flex items-center h-16 rounded-xl border border-[#FFFFFF1A] bg-[#101513]">
            <div className="flex absolute left-1/2 -translate-x-1/2 w-1/3 border border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-within:border-[#34D399] focus-within:shadow-[0px_0px_10px_#34D399] transition-colors">
                <Input placeholder="Search for products" className="flex px-4 h-11 border border-transparent focus-visible:ring-0 placeholder-[#FFFFFF40] text-[#FFFFFF]"/>
                <button className="flex justify-center items-center min-w-11 min-h-11"><Search className="text-[#FFFFFF1A] hover:text-[#34D399] transition-colors"/></button>
            </div>
            <Link to={"/login"} className="flex absolute right-4 justify-center items-center w-11 h-11 bg-[#34D399] rounded-lg shadow-[0px_0px_15px_#34D39926] ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors"><LogInIcon size={20}/></Link>
        </div>
    );
}

export default App;
