import {useEffect, useState} from "react";
import {Ban, CircleStop, ShoppingBasket, Star, StopCircle} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../api/client.ts";
import type {ProductResponse} from "../api/Api.ts";

export function ProductPage() {

    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(1);
    const { id } = useParams();
    const [product, setProduct] = useState<ProductResponse | null>(null);

    useEffect(() => {
        api.product.productGetById({id: id}).then(p => {setProduct(p); console.log(p.vendor);}).catch(err => console.log("Failed to get product by id: " + err));
    }, []);

    const handleOnStallClick = () => {
        if (product) navigate(`/stall/${product.vendorId}`)
    }

    return (
        <div className="flex flex-col items-center w-full h-full pt-24 gap-12">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-205 w-255 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />
            <div className="flex w-250 h-100">
                <div className="flex justify-center w-1/2 h-full px-4 ">
                    <div className="flex justify-center items-center w-full h-full bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A]">
                        <div className="flex w-full h-2/3 bg-[#FFFFFF1A]"/>
                    </div>
                </div>
                <div className="flex flex-col w-1/2 h-full px-4 divide-y divide-[#FFFFFF1A]">
                    <div className="flex flex-col w-full pb-4">
                        <h1 className="flex flex-wrap w-full text-white font-bold text-2xl">{product?.title ?? "Unknown product"}</h1>
                        <p className="text-[#FFFFFF80] text-sm">Sold by {product?.vendor?.username ?? "Unknown vendor"}</p>
                    </div>
                    <div className="flex flex-col w-full mt-6 pb-4 gap-8">
                        <h1 className="text-[#34D399] text-3xl font-bold">{product?.priceDkk ?? 0}.-</h1>

                        <p className="text-[#FFFFFF80] text-sm">{product?.description ?? "Unknown description"}</p>
                        <div className="flex items-center w-full gap-4">
                            <QuantityInput value={quantity} onChange={setQuantity} max={product?.stock ?? 1}/>
                            <p className="text-[#FFFFFF80] text-sm">{product?.stock ?? 1} in stock</p>
                        </div>
                        {product && product.stock! > 0 && <button className="flex justify-center items-center text-sm font-bold w-full h-12 bg-[#34D399] shadow-[0_10px_30px_#34D39926] rounded-lg ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors"><ShoppingBasket className="mr-3"/> Purchase</button>}

                        {!product && <button className="flex justify-center items-center text-sm font-bold w-full h-12 text-[#FFFFFF80] bg-[#101513] shadow-[0_10px_30px_#101513] rounded-lg border border-[#FFFFFF1A] ring-4 ring-transparent transition-colors"><Ban className="mr-3"/>Unavailable</button>}
                        {product && product.stock! <= 0 && <button className="flex justify-center items-center text-sm font-bold w-full h-12 text-[#FFFFFF80] bg-[#101513] shadow-[0_10px_30px_#101513] rounded-lg border border-[#FFFFFF1A] ring-4 ring-transparent transition-colors"><Ban className="mr-3"/>Out of stock</button>}
                    </div>
                    <div className="flex items-center mt-4 w-full">
                        <p className="text-[#FFFFFF80] text-sm">1000 sold</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-250 px-4 gap-4">
                <h1 className="flex w-full text-white font-bold">Sold by</h1>
                <div className="flex justify-center items-center w-full h-20 bg-[#101513] rounded-2xl border border-[#FFFFFF1A]">
                    <div className="flex justify-center items-center w-20 h-full ">
                        <div className="flex w-2/3 h-2/3 bg-[#FFFFFF1A] rounded-xl"/>
                    </div>
                    <div className="flex flex-col justify-center w-full h-full">
                        <div className="flex flex-col w-full h-full justify-center">
                            <h1 className="flex items-center min-w-0 w-full truncate font-bold text-white text-sm">{product?.vendor?.username ?? "Unknown vendor"}</h1>
                            <h1 className="flex items-center min-w-0 w-full truncate font-bold text-[#FFFFFF80] text-xs">200 sales</h1>
                        </div>
                    </div>
                    {product && <button onClick={handleOnStallClick} className="flex justify-center items-center mr-5 w-40 rounded-lg px-4 py-2 text-[#FFFFFF80] text-sm border border-[#FFFFFF1A] bg-[#161b18] hover:bg-[#232a27]">Visit Stall</button>}
                </div>
            </div>
        </div>
    );
}

function QuantityInput({ value, onChange, min = 1, max }: {value: number, onChange: (v: number) => void, min?: number, max?: number}) {
    return (
        <div className="flex w-fit justify-center items-center rounded-md text-white font-bold">
            <button onClick={() => onChange(Math.max(min, value - 1))} className="px-3 h-10 bg-[#101513] rounded-l-md border border-[#FFFFFF1A]">−</button>
            <div className="flex h-10 justify-center items-center border border-[#FFFFFF1A] bg-[#00000033]">
                <h1 className="px-4 text-sm border-[#FFFFFF1A] bg-[#00000033]">{value}</h1>
            </div>
            <button onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)} className="px-3 h-10 bg-[#101513] rounded-r-md border border-[#FFFFFF1A]">+</button>
        </div>
    )
}