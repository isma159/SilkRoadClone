import {ArrowUpRight} from "lucide-react";
import {Input} from "@/src/components/ui/input.tsx";

import {type UserDto} from "@/src/api/Api.ts";
import {api} from "@/src/api/client"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


export default function LoginView({user, setUser}: {user: UserDto | null, setUser: (user: UserDto | null) => void}) {

    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        if (user != null) {
            navigate("/");
        }
    }, []);

    const handleLogin = () => {
        if (user == null) api.user.userLogin({username, password})
            .then(u => {
                setUser(u);
                navigate("/");
                console.log(u.username + " logged in!");
            })
            .catch(err => console.log(err));
        else console.log("Already logged in, " + user.username);
    }

    return (
        <main>
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-105 w-155 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />
            <div className="flex flex-col items-center justify-center w-100 bg-[#101513] rounded-3xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A] gap-8 py-12">
                <div className="flex flex-col w-4/5">
                    <div className="flex justify-center items-center min-w-11 w-11 min-h-11 h-11 rounded-xl bg-[#34D3991A] border border-[#34D39933]">
                        <ArrowUpRight className="text-[#34D399]" size={18}/>
                    </div>
                </div>
                <div className="flex flex-col w-4/5 gap-2">
                    <h1 className="flex w-full text-[#34D399] uppercase tracking-[0.22em]">Welcome!</h1>
                    <h1 className="flex text-lg font-semibold text-[#FFFFFF] w-full text-[28px]">Sign in to your account</h1>
                    <h1 className="flex text-lg font-semibold text-[#FFFFFF80] w-full text-[12px]">Enter your details below to continue</h1>
                </div>
                <div className="flex flex-col w-4/5 gap-2">
                    <h1 className="flex text-sm font-bold text-[#FFFFFFBF] w-full text-left">Email Address</h1>
                    <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="ex. you@example.com" className="flex px-4 h-11 focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                </div>
                <div className="flex flex-col w-4/5 gap-2">
                    <h1 className="flex text-sm font-bold text-[#FFFFFFBF] w-full text-left">Password</h1>
                    <Input value={password} onChange={e => setPassword(e.target.value)} type={"password"} placeholder="ex. 123456789" className="flex px-4 h-11 focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                </div>
                <button onClick={handleLogin} className="flex justify-center items-center text-sm font-bold w-4/5 h-12 bg-[#34D399] shadow-[0_10px_30px_#34D39926] rounded-lg ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors">Sign In</button>
            </div>
        </main>
    );
}