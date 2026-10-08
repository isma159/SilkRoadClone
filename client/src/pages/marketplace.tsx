import {Pencil, Plus, Star, Trash} from "lucide-react";
import {Api, type CategoryDto, type ProductResponse, Roles, type UserDto, type VendorStatsDto} from "@/src/api/Api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/src/components/ui/dialog.tsx";
import {Input} from "@/src/components/ui/input.tsx";
import {Textarea} from "@/src/components/ui/textarea.tsx";

const api = new Api({baseUrl: "http://localhost:5285"});

export default function MarketView({currentUser, searchTerm}: { currentUser: UserDto | null, searchTerm: string }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        if (!open && !deleteOpen) {
            setSelectedCategory(null);
            handleRefresh();
        }
    }, [open, deleteOpen]);

    const handleRefresh = () => {
        setRefreshKey(refreshKey + 1);
    }

    return (
        <div className="flex w-full h-full gap-8 pt-22 px-4 pb-4">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-205 w-255 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />
            <SideBar currentUser={currentUser} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} setOpen={setOpen} refreshKey={refreshKey} setSelectedCategory={setSelectedCategory} setDeleteOpen={setDeleteOpen}/>
            <ProductView searchTerm={searchTerm} categoryId={selectedCategoryId}/>
            <ProductFormDialog open={open} setOpen={setOpen} currentUser={currentUser} initialCategory={selectedCategory}/>
            <DeleteConfirmationDialog deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} category={selectedCategory}/>
        </div>
    );
}

function SideBar({currentUser, selectedCategoryId, onSelectCategory, setOpen, refreshKey, setSelectedCategory, setDeleteOpen}: {currentUser: UserDto | null, selectedCategoryId: string | null;
onSelectCategory: (id: string | null) => void, setOpen: (open: boolean) => void, refreshKey: number, setSelectedCategory: (selectedCategory: CategoryDto | null) => void, setDeleteOpen: (deleteOpen: boolean) => void}) {

    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {api.category.categoryGetCategories().then(setCategories);}, [refreshKey]);

    const handleCategoryClick = (categoryId: string | null) => {onSelectCategory(categoryId === selectedCategoryId ? null : categoryId);};

    return (
        <div className="flex flex-col min-w-75 w-75 h-full max-h-200 bg-[#101513] rounded-2xl border dropshadow-[0px_0px_15px_#16a34a] border-[#FFFFFF1A] p-4 gap-2 overflow-y-auto">
            <div className="flex items-center justify-between w-full h-10">
                <h1 className="flex items-center font-bold text-lg w-full h-10 text-[#34D399]">Categories</h1>
                {currentUser && currentUser.role == Roles.Admin && <button onClick={() => setOpen(true)} className="flex justify-center items-center w-10 h-10 ml-auto text-[#34D399] hover:text-[#6EE7B7] transition-colors"><Plus/></button>}
            {selectedCategoryId && (<button onClick={() => onSelectCategory(null)} className={"text-xs text-[#FFFFFF80] hover:text-[#34D399] transition-colors"}></button>)}
                </div>
            {categories.map((c) => (<CategoryItem key={c.categoryId} category={c} isSelected={c.categoryId === selectedCategoryId} onClick={() => handleCategoryClick(c.categoryId ?? null)}
                                                  currentUser={currentUser} setSelectedCategory={setSelectedCategory} setOpen={setOpen} setDeleteOpen={setDeleteOpen}/>))}
        </div>
    );
}

function CategoryItem({category, isSelected, onClick, currentUser, setSelectedCategory, setOpen, setDeleteOpen}: {category: CategoryDto, isSelected: boolean, onClick: () => void,
    currentUser: UserDto | null, setSelectedCategory: (selectedCategory: CategoryDto | null) => void, setOpen: (open: boolean) => void, setDeleteOpen: (deleteOpen: boolean) => void}) {

    const handleOnEditCategory = () => {
        setOpen(true);
        setSelectedCategory(category);
    }

    const handleOnDeleteCategory = () => {
        setDeleteOpen(true);
        setSelectedCategory(category);
    }

    return (
        <div className="relative group flex w-full justify-end items-center">
            <button onClick={onClick} className={`flex items-center w-9/10 h-10 rounded-lg px-2 transition-colors
             ${isSelected ? "bg-[#34D399] border border-[#34D39933]" : "hover:bg-[#232a27] text-[#FFFFFFBF] px-2"}`}>
                <h1 className="flex flex-1 truncate text-sm">{category.categoryName}</h1>
            </button>
            {currentUser?.role === Roles.Admin && <button onClick={e => {e.stopPropagation(); handleOnEditCategory()}} className="absolute right-8 flex justify-center items-center min-w-8 min-h-6 text-[#6c757d] hover:text-[#a1a1aa] invisible group-hover:visible transition-colors"><Pencil size={18}/></button>}
            {currentUser?.role === Roles.Admin && <button onClick={e => {e.stopPropagation(); handleOnDeleteCategory()}} className="absolute flex justify-center items-center min-w-8 min-h-6 text-red-400 hover:text-red-300 invisible group-hover:visible transition-colors"><Trash size={18}/></button>}
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

function ProductFormDialog({open, setOpen, currentUser, initialCategory}: {open: boolean, setOpen: (open: boolean) => void, currentUser: UserDto | null, initialCategory: CategoryDto | null}) {

    const [name, setName] = useState(initialCategory?.categoryName ?? "");
    const [description, setDescription] = useState(initialCategory?.description ?? "");

    const createFormDesc = "Add a new category to the marketplace.";
    const updateFormDesc = "Edit the details for this existing category.";

    useEffect(() => {
        if (initialCategory) {
            setName(initialCategory.categoryName ?? "");
            setDescription(initialCategory.description ?? "");
        }
        else {
            setName("");
            setDescription("");
        }
    }, [open]);

    function handleSubmit() {
        if (!initialCategory) {
            api.category.categoryCreateCategory({categoryName: name, description: description});
        } else {
            api.category.categoryUpdateCategory({categoryIdForLookup: initialCategory.categoryId, newName: name, newDescription: description});
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col w-max bg-[#10151380] rounded-2xl border border-[#FFFFFF1A] ring-0 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-white">{!initialCategory ? "Create Category" : "Edit Category"}</DialogTitle>
                    <DialogDescription className="text-[#FFFFFF80] text-xs">{!initialCategory ? createFormDesc : updateFormDesc}</DialogDescription>
                </DialogHeader>
                <h1 className="text-white">Category Name:</h1>
                <Input value={name} onChange={e => setName(e.target.value)} className="focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                <h1 className="text-white">Category Description:</h1>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                <DialogFooter className="border-[#FFFFFF1A]">
                    <button className="cursor-pointer px-4 py-1 font-bold bg-[#34D399] shadow-[0_10px_30px_#34D39926] rounded-md ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors" onClick={handleSubmit}>
                        {!initialCategory ? "Create" : "Save Changes"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteConfirmationDialog({deleteOpen, setDeleteOpen, category}: {deleteOpen: boolean, setDeleteOpen: (deleteOpen: boolean) => void, category: CategoryDto | null}) {

    const handleOnDelete = () => {
        api.category.categoryDeleteCategory({categoryId: category?.categoryId ?? ""}).catch(err => console.error(err));
        setDeleteOpen(false);
    }

    return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="flex flex-col w-max bg-[#10151380] rounded-2xl border border-[#FFFFFF1A] ring-0 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-white">{"Delete Product"}</DialogTitle>
                    <DialogDescription className="text-[#FFFFFF80] text-xs">{`Are you sure you want to delete this category ${category?.categoryName ?? "Unknown"}? This action cannot be undone.`}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="border-[#FFFFFF1A]">
                    <button className="cursor-pointer px-4 py-1 font-bold text-white bg-red-400 shadow-[0_10px_30px_#34D39926] rounded-md ring-4 ring-transparent hover:bg-red-300 active:text-black active:ring-red-200 transition-colors" onClick={handleOnDelete}>
                        {"Delete"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}