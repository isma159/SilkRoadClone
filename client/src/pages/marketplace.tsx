import { Star } from "lucide-react";
import {Api, ProductResponse} from "@/src/api/Api.ts";
import {useEffect, useState} from "react";

const api = new Api({baseUrl: "http://localhost:5285"});

export default function MarketView({searchTerm}: { searchTerm: string }) {
    return (
        <div className="flex w-full h-full gap-8 pt-22 px-4 pb-4">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-205 w-255 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />
            <SideBar/>
            <ProductView searchTerm={searchTerm}/>
        </div>
    );
}

function SideBar() {
    const [categories, setCategories] = useState<{categoryId: string; categoryName: string}[]>([]);

    useEffect(() => {api.category.categoryGetCategories().then(setCategories);}, []);
    return (
        <div className="flex flex-col min-w-75 w-75 h-full max-h-200 bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A] p-4 gap-2 overflow-y-auto">
            <h1 className="flex items-center font-bold text-lg w-full h-10 text-[#34D399]">Categories</h1>
            {categories.map((c) => (<CategoryItem key={c.categoryId} name={c.categoryName ?? "Unnamed"}/>)) }
        </div>
    );
}

function CategoryItem({name}: {name: string}) {
    return (
        <div className="flex w-full justify-end items-center">
            <button className="flex items-center w-9/10 h-10 rounded-lg hover:bg-[#232a27] text-[#FFFFFFBF] px-2">{name}</button>
        </div>
    );
}

function ProductView({searchTerm}: { searchTerm: string }) {
    const [products, setProducts] = useState<ProductResponse[]>([]);

    useEffect(() => {
        const keyword = searchTerm.trim();

        console.log("1. Search term:", keyword);

        api.product.productSearchProducts({Keyword: keyword,}).then((result) => {
                console.log("2. API result:", result); setProducts(result);})
            .catch((error) => {console.error("3. API error:", error);});}, [searchTerm]);
    return (
        <div className="flex flex-col min-w-0 w-full h-full">
            <h1 className="flex min-w-0 w-full px-2 font-bold text-lg text-[#FFFFFF]">Featured Vendors</h1>
            <div className="flex flex-nowrap min-w-0 w-full px-2 mt-4 pb-2 gap-4 overflow-x-auto">
                {products.map((p) => (<ProductItem key={p.id} title={p.title ?? "Unnamed"} priceDkk={p.priceDkk ?? 0}/>))}
            </div>
            <br/>
            <h1 className="flex min-w-0 w-full px-2 font-bold text-lg text-[#FFFFFF]">Products</h1>
            <div className="flex flex-1 flex-wrap mt-4 px-2 gap-6 overflow-y-auto">
                {products.map((p) => (<ProductItem key={p.id} title={p.title ?? "Unnamed"} priceDkk={p.priceDkk ?? 0}/>))}
            </div>

        </div>
    );
}

function VendorItem() {
    return (
        <div className="flex flex-col min-w-65 w-65 h-30 bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A]">
            <div className="flex w-full h-2/3">
                <div className="flex justify-center items-center w-20 h-20 ">
                    <div className="flex w-2/3 h-2/3 bg-[#FFFFFF1A] rounded-xl"/>
                </div>
                <div className="flex flex-col w-45 h-20">
                    <div className="flex items-center w-full h-1/2">
                        <h1 className="flex mt-2 min-w-0 w-full truncate font-bold text-white"> - Featured Vendor</h1>
                    </div>

                    <div className="flex items-center w-full h-1/2">
                        <div className="flex items-center h-1/2 rounded-lg bg-[#34D3991A] border border-[#34D39933] px-3 gap-4 text-[#34D399]">
                            <Star className="fill-[#34D399]" size={10}/>
                            <h1 className="text-[10px] font-bold">Featured</h1>
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex items-center w-full h-1/3">
                <h1 className="flex ml-4 text-[#FFFFFF80] text-xs"> - ? listings</h1>
            </div>
        </div>
    );
}

function ProductItem({title, priceDkk}: {title: string, priceDkk: number}) {
    return (
        <div className="flex flex-col w-65 h-65 bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A] hover:border-[#34D399] hover:border-2 transition-colors">
            <div className="flex w-full h-40 bg-[#FFFFFF1A] rounded-t-2xl"/>
            <div className="flex min-w-0 w-full h-10 px-4 py-2">
                <h1 className="flex min-w-0 w-full text-white font-bold truncate">{title}</h1>
            </div>
            <div className="flex w-full h-5 px-4">
                <h1 className="flex w-full text-[#FFFFFF80] text-xs">Placeholder vendor</h1>
            </div>
            <div className="flex w-full h-10 px-4 py-2">
                <h1 className="flex w-full font-bold text-[#34D399]">{priceDkk ?? 0}</h1>
            </div>
        </div>
    );
}