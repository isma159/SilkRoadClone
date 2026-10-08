import {Plus, Star} from "lucide-react";
import {Api, type CategoryDto, type ProductResponse, Roles, type UserDto, type VendorStatsDto} from "@/src/api/Api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const api = new Api({baseUrl: "http://localhost:5285"});

export default function MarketView({currentUser, searchTerm}: { currentUser: UserDto | null, searchTerm: string }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    return (
        <div className="flex w-full h-full gap-8 pt-22 px-4 pb-4">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-205 w-255 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />
            <SideBar currentUser={currentUser} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
            <ProductView searchTerm={searchTerm} categoryId={selectedCategoryId}/>
        </div>
    );
}

function SideBar({currentUser, selectedCategoryId, onSelectCategory}: {currentUser: UserDto | null, selectedCategoryId: string | null;
onSelectCategory: (id: string | null) => void;}) {

    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {api.category.categoryGetCategories().then(setCategories);}, []);

    const handleCategoryClick = (categoryId: string | null) => {onSelectCategory(categoryId === selectedCategoryId ? null : categoryId);};

    const handleNewCategory = () => {

    }

    return (
        <div className="flex flex-col min-w-75 w-75 h-full max-h-200 bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A] p-4 gap-2 overflow-y-auto">
            <div className="flex items-center justify-between w-full h-10">
                <h1 className="flex items-center font-bold text-lg w-full h-10 text-[#34D399]">Categories</h1>
                {currentUser && currentUser.role == Roles.Admin && <button className="flex justify-center items-center w-10 h-10 ml-auto text-[#34D399] hover:text-[#6EE7B7] transition-colors"><Plus/></button>}
            {selectedCategoryId && (<button onClick={() => onSelectCategory(null)} className={"text-xs text-[#FFFFFF80] hover:text-[#34D399] transition-colors"}></button>)}
                </div>
            {categories.map((c) => (<CategoryItem key={c.categoryId} name={c.categoryName ?? "Unnamed"}
            isSelected={c.categoryId === selectedCategoryId} onClick={() => handleCategoryClick(c.categoryId ?? null)}/>))}
        </div>
    );
}

function CategoryItem({name, isSelected, onClick}: {name: string, isSelected: boolean, onClick: () => void}) {
    return (
        <div className="flex w-full justify-end items-center">
            <button onClick={onClick} className={`flex items-center w-9/10 h-10 rounded-lg px-2 transition-colors
             ${isSelected ? "bg-[#34D399] border border-[#34D39933]" : "hover:bg-[#232a27] text-[#FFFFFFBF] px-2"}`}>{name}</button>
        </div>
    );
}

function ProductView({searchTerm, categoryId}: { searchTerm: string, categoryId: string | null }) {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [featuredVendors, setFeaturedVendors] = useState<VendorStatsDto[]>([]);

    useEffect(() => {
        const keyword = searchTerm.trim();


        api.product.productSearchProducts({Keyword: keyword || undefined, CategoryId: categoryId || undefined}).then(setProducts)
            .catch((error) => {console.error("Search error:", error);});}, [searchTerm, categoryId]);

    useEffect(() =>{
        api.order.orderGetVendorsAboveThreshold({threshold: 100}).then(setFeaturedVendors).catch((error) =>
        {console.error("Featured vendors error:", error);});}, []);
    return (
        <div className="flex flex-col min-w-0 w-full h-full">
            <h1 className="flex min-w-0 w-full px-2 font-bold text-lg text-[#FFFFFF]">Featured Vendors</h1>
            <div className="flex flex-nowrap min-w-0 w-full px-2 mt-4 pb-2 gap-4 overflow-x-auto">
                {featuredVendors.map((v) => (<VendorItem key={v.vendorId} vendor={v}/>))}
            </div>
            <br/>
            <h1 className="flex min-w-0 w-full px-2 font-bold text-lg text-[#FFFFFF]">Products</h1>
            <div className="flex flex-1 flex-wrap mt-4 px-2 gap-6 overflow-y-auto">
                {products.map((p) => (<ProductItem key={p.id} product={p}/>))}
            </div>
        </div>
    );
}

function VendorItem({vendor}: {vendor: VendorStatsDto | null}) {

    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/stall/${vendor?.vendorId}`)
    }

    return (
        <button onClick={handleOnClick} className="flex flex-col min-w-65 w-65 h-30 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] hover:border-[#34D399] hover:border-2 transition-colors">
            <div className="flex w-full h-2/3">
                <div className="flex justify-center items-center w-20 h-20 ">
                    <div className="flex w-2/3 h-2/3 bg-[#FFFFFF1A] rounded-xl"/>
                </div>
                <div className="flex flex-col w-45 h-20">
                    <div className="flex items-center w-full h-1/2">
                        <h1 className="flex mt-2 min-w-0 w-full truncate font-bold text-white"> - {vendor?.vendorName ?? "Unknown"}</h1>
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
                <h1 className="flex ml-4 text-[#FFFFFF80] text-xs">{vendor?.completedOrderCount ?? 0} completed orders</h1>
            </div>
        </button>
    );
}

function ProductItem({product}: {product: ProductResponse}) {

    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/product/${product.id}`)
    }

    return (
        <button onClick={handleOnClick} className="flex flex-col w-65 h-65 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] hover:border-[#34D399] hover:border-2 transition-colors">
            <div className="flex w-full h-40 bg-[#FFFFFF1A] rounded-t-2xl"/>
            <div className="flex min-w-0 w-full h-10 px-4 py-2">
                <h1 className="flex min-w-0 w-full text-white font-bold truncate">{product.title ?? "Unnamed"}</h1>
            </div>
            <div className="flex w-full h-5 px-4">
                <h1 className="flex w-full text-[#FFFFFF80] text-xs">{product.vendor?.username ?? "Unknown vendor"}</h1>
            </div>
            <div className="flex w-full h-10 px-4 py-2">
                <h1 className="flex w-full font-bold text-[#34D399]">{product.priceDkk ?? 0}.-</h1>
            </div>
        </button>
    );
}