import "./index.css";
import {Input} from "./components/ui/input.tsx";
import {Search, LogInIcon, Menu, User, Store, LogOut} from "lucide-react";
import LoginView from "@/src/pages/loginview.tsx";
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import MarketView from "./pages/marketplace.tsx";
import {useState} from "react";
import type {UserDto} from "./api/Api.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./components/ui/dropdown-menu.tsx";
import {ProductPage} from "./pages/product.tsx";
import {StallPage} from "./pages/stall.tsx";

export function App() {
    const [searchTerm, setSearchTerm] = useState("");

    const [user, setUser] = useState<UserDto | null>(null);

    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#080B0A]">
            <TopBar user={user} setUser={setUser} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <Routes>
                <Route path={"/"} element={<MarketView currentUser={user} searchTerm={searchTerm}/>}/>
                <Route path={"/login"} element={<LoginView user={user} setUser={setUser}/>}/>
                <Route path={"product/:id"} element={<ProductPage currentUser={user}/>}/>
                <Route path={"/stall/:id"} element={<StallPage currentUser={user}/>}/>
            </Routes>
        </div>
    );
}

function TopBar({user, setUser, searchTerm, onSearchChange}: {user: UserDto | null, setUser: (user: UserDto | null) => void; 
searchTerm: string, onSearchChange: (value: string) => void;}) {
    return (
        <div className="fixed top-3 left-3 right-3 flex items-center h-16 rounded-xl border border-[#FFFFFF1A] bg-[#101513]">
            <div className="flex absolute left-1/2 -translate-x-1/2 w-1/3 border border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-within:border-[#34D399] focus-within:shadow-[0px_0px_10px_#34D399] transition-colors">
                <Input placeholder="Search for products" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="flex px-4 h-11 border border-transparent focus-visible:ring-0 placeholder-[#FFFFFF40] text-[#FFFFFF]"/>
                <button className="flex justify-center items-center min-w-11 min-h-11"><Search className="text-[#FFFFFF1A] hover:text-[#34D399] transition-colors"/></button>
            </div>
            {user && <div className="flex absolute right-4 justify-center items-center px-2 h-11 gap-4">
                <div className="flex justify-center items-center min-w-11 h-11 bg-[#FFFFFF1A] rounded-xl"/>
                <h1 className="w-full min-w-0 truncate text-[#FFFFFF] font-bold">{user.username}</h1>
                <br/>
                <AccountMenu user={user} setUser={setUser}/>
            </div>}
            {!user && <Link to={"/login"} className="flex absolute right-4 justify-center items-center w-11 h-11 bg-[#34D399] rounded-lg shadow-[0px_0px_15px_#34D39926] ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors"><LogInIcon size={20}/></Link>}
        </div>
    );
}

function AccountMenu({user, setUser}: {user: UserDto | null, setUser: (user: UserDto | null) => void}) {

    const navigate = useNavigate();

    const handleOnStallClick = () => {
        navigate(`/stall/${user?.id}`)
    }

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex min-w-11 h-11 cursor-pointer justify-center items-center rounded-lg text-[#FFFFFF1A] border border-[#FFFFFF1A] bg-[#161b18] hover:bg-[#232a27] data-popup-open:border-[#34D399] data-popup-open:text-[#34D399] transition-colors">
                    <Menu size={24}/>
                </button>}/>
            <DropdownMenuContent className="w-50 mt-5 bg-[#101513] border border-[#FFFFFF1A] shadow-[0px_0px_15px_#161b18] ring-0">
                <DropdownMenuItem className="font-bold cursor-pointer text-white my-1 hover:bg-[#232a27] transition-colors"><User className="mr-2 size-6"/> Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleOnStallClick} className="font-bold cursor-pointer text-white my-1 hover:bg-[#232a27] transition-colors"><Store className="mr-2 size-6"/> My Stall</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#FFFFFF1A]"/>
                <DropdownMenuItem onClick={handleLogout} variant={"destructive"} className="font-bold cursor-pointer text-red-400 my-1 hover:bg-[#232a27] transition-colors"><LogOut className="mr-2 size-6"/>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default App;
