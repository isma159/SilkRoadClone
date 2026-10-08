import {useEffect, useState} from "react";
import type {CategoryDto, OrderDto, ProductResponse, UserDto} from "../api/Api.ts";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../api/client.ts";
import {Edit, Pencil, Plus, Trash} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../components/ui/dialog.tsx";
import {Input} from "../components/ui/input.tsx";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "../components/ui/combobox.tsx";

interface ProductFormDialogProps {
    initialProduct?: ProductResponse
    onSuccess: () => void
}

export function StallPage({currentUser}: {currentUser: UserDto | null}) {

    const [vendor, setVendor] = useState<UserDto | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [sales, setSales] = useState<OrderDto[]>([]);

    const {id} = useParams();

    useEffect(() => {
        if (id && !open && !deleteOpen) {
            api.user.userGetUserById({id: id}).then(setVendor).catch(err => console.log("Failed to fetch vendor: " + err));
            api.order.orderGetAllFromVendor({vendorId: id}).then(setSales).catch(err => console.log("Failed to fetch sales: " + err));
        }
        if (!open && !deleteOpen) setSelectedProduct(null);
    }, [open, deleteOpen]);

    return (
        <div className="flex flex-col items-center w-250 h-full pt-24 pb-4 gap-4">
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-205 w-255 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]"
                aria-hidden="true"
            />

            <div className="relative flex items-center w-full h-20">
                <div className="flex justify-center items-center w-20 h-full ">
                    <div className="flex w-2/3 h-2/3 bg-[#FFFFFF1A] rounded-xl"/>
                </div>
                <div className="flex flex-col justify-center w-full h-full">
                    <div className="flex flex-col w-full h-full justify-center">
                        <h1 className="flex items-center min-w-0 w-full truncate font-bold text-white">{vendor?.username ?? "Unknown vendor"}</h1>
                        <h1 className="flex items-center min-w-0 w-full truncate font-bold text-[#FFFFFF80] text-xs">Verified seller</h1>
                    </div>
                </div>
                {currentUser != null && currentUser.id == vendor?.id && <button onClick={() => setOpen(true)} className="absolute flex cursor-pointer items-center right-4 px-4 py-2 bg-[#34D399] shadow-[0_10px_30px_#34D39926] rounded-lg ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors"><Plus className="mr-2" size={16}/> Add listing</button>}
            </div>

            <div className="flex justify-center items-center w-250 h-40 gap-6">
                <div className="flex flex-col justify-center w-75 h-30 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] px-4">
                    <h1 className="text-2xl font-black text-[#34D399]">{sales.length}</h1>
                    <p className="text-sm text-[#FFFFFF80]">Total sales</p>
                </div>
                <div className="flex flex-col justify-center w-75 h-30 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] px-4">
                    <h1 className="text-2xl font-black text-[#34D399]">{vendor?.products?.length ?? 0}</h1>
                    <p className="text-sm text-[#FFFFFF80]">Active listings</p>
                </div>
                <div className="flex flex-col justify-center w-75 h-30 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] px-4">
                    <h1 className="text-2xl font-black text-[#34D399]">???.-</h1>
                    <p className="text-sm text-[#FFFFFF80]">Revenue</p>
                </div>
            </div>
            <div className="flex flex-1 w-full flex-wrap mt-4 px-2 gap-6 overflow-y-auto">
                {vendor?.products?.map(p => p.isActive && <ProductItem key={p.id} product={p} vendor={vendor} currentUser={currentUser} setSelectedProduct={setSelectedProduct} setOpen={setOpen} setDeleteOpen={setDeleteOpen}/>)}
            </div>
            <ProductFormDialog key={selectedProduct?.id ?? "form"} open={open} setOpen={setOpen} currentUser={currentUser} initialProduct={selectedProduct} onSuccess={() => {}}/>
            <DeleteConfirmationDialog deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} product={selectedProduct}/>
        </div>
    );
}

function ProductItem({product, currentUser, vendor, setSelectedProduct, setOpen, setDeleteOpen}: {product: ProductResponse, currentUser: UserDto | null, vendor: UserDto | null, setSelectedProduct: (selectedProduct: ProductResponse | null) => void, setOpen: (open: boolean) => void, setDeleteOpen: (deleteOpen: boolean) => void}) {

    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate(`/product/${product.id}`)
    }

    const handleOnEdit = () => {
        setSelectedProduct(product)
        setOpen(true);
    }

    const handleOnDelete = () => {
        setSelectedProduct(product)
        setDeleteOpen(true);
    }

    return (
        <div onClick={handleOnClick} className="group flex flex-col w-65 h-65 bg-[#101513] rounded-2xl border border-[#FFFFFF1A] hover:border-[#34D399] hover:border-2 transition-colors">
            <div className="flex flex-row-reverse items-start w-full h-40 bg-[#FFFFFF1A] rounded-t-2xl">
                {vendor?.id == currentUser?.id && <button onClick={e => {e.stopPropagation(); handleOnDelete()}} className="flex justify-center items-center min-w-10 min-h-10 text-red-400 hover:text-red-300 invisible group-hover:visible transition-colors"><Trash/></button>}
                {vendor?.id == currentUser?.id && <button onClick={e => {e.stopPropagation(); handleOnEdit()}} className="flex justify-center items-center min-w-10 min-h-10 text-[#6c757d] hover:text-[#a1a1aa] invisible group-hover:visible transition-colors"><Pencil/></button>}
            </div>
            <div className="flex min-w-0 w-full h-10 px-4 py-2">
                <h1 className="flex min-w-0 w-full text-white font-bold truncate">{product.title ?? "Unnamed"}</h1>
            </div>
            <div className="flex w-full h-3 px-4"/>
            <div className="flex w-full h-10 px-4 py-2">
                <h1 className="flex w-full font-bold text-[#34D399]">{product.priceDkk ?? 0}.-</h1>
            </div>
        </div>
    );
}

function ProductFormDialog({open, setOpen, currentUser, initialProduct, onSuccess }: {open: boolean, setOpen: (open: boolean) => void, currentUser: UserDto | null, initialProduct: ProductResponse | null, onSuccess: () => void}) {

    const [title, setTitle] = useState(initialProduct?.title ?? "")
    const [price, setPrice] = useState(initialProduct?.priceDkk ?? 0)
    const [description, setDescription] = useState(initialProduct?.description ?? "")
    const [stock, setStock] = useState(initialProduct?.stock ?? 0)
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [categoryId, setCategoryId] = useState<string>(initialProduct?.categoryId ?? "")

    const createFormDesc = "Add a new item to your store catalog with updated details, pricing, and stock.";
    const updateFormDesc = "Edit the details, pricing, or stock for this existing product.";

    useEffect(() => {
        api.category.categoryGetCategories().then(setCategories);
    }, [])

    function handleSubmit() {
        if (!initialProduct) {
            api.product.productCreate({title: title, priceDkk: price, description: description, categoryId: categoryId, stock: stock, vendorId: currentUser?.id})
                .then(onSuccess)
        } else {
            api.product.productUpdate({id: initialProduct.id, title, priceDkk: price, description: description, categoryId: categoryId, stock: stock})
                .then(onSuccess)
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col w-max bg-[#10151380] rounded-2xl border border-[#FFFFFF1A] ring-0 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-white">{!initialProduct ? "Create Product" : "Edit Product"}</DialogTitle>
                    <DialogDescription className="text-[#FFFFFF80] text-xs">{!initialProduct ? createFormDesc : updateFormDesc}</DialogDescription>
                </DialogHeader>
                <h1 className="text-white">Title:</h1>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                <h1 className="text-white">Description:</h1>
                <Input value={description} onChange={e => setDescription(e.target.value)} className="focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                <h1 className="text-white">Category:</h1>
                <CategoryCombobox categories={categories} categoryId={categoryId} setCategoryId={setCategoryId}/>
                <div className="flex items-center w-full">
                    <div className="flex flex-col w-1/2 justify-center gap-4">
                        <h1 className="text-white">Price (DKK):</h1>
                        <Input value={price} onChange={e => setPrice(Number(e.target.value))} type={"number"} className="w-[90%] focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                    </div>
                    <div className="flex flex-col w-1/2 justify-center gap-4">
                        <h1 className="text-white">Stock:</h1>
                        <Input value={stock} onChange={e => setStock(Number(e.target.value))} type={"number"} className="w-[90%] focus-visible:ring-0 border placeholder-[#FFFFFF40] text-[#FFFFFF] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399] focus-visible:shadow-[0px_0px_10px_#34D399]"/>
                    </div>
                </div>
                <DialogFooter className="border-[#FFFFFF1A]">
                    <button className="cursor-pointer px-4 py-1 font-bold bg-[#34D399] shadow-[0_10px_30px_#34D39926] rounded-md ring-4 ring-transparent hover:bg-[#6EE7B7] active:ring-[#34D39933] transition-colors" onClick={handleSubmit}>
                        {!initialProduct ? "Create" : "Save Changes"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteConfirmationDialog({deleteOpen, setDeleteOpen, product}: {deleteOpen: boolean, setDeleteOpen: (deleteOpen: boolean) => void, product: ProductResponse | null}) {

    const handleOnDelete = () => {
        api.product.productDelete({id: product?.id})
        setDeleteOpen(false);
    }

    return (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="flex flex-col w-max bg-[#10151380] rounded-2xl border border-[#FFFFFF1A] ring-0 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-white">{"Delete Product"}</DialogTitle>
                    <DialogDescription className="text-[#FFFFFF80] text-xs">{"Are you sure you want to delete this product? This action cannot be undone."}</DialogDescription>
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

function CategoryCombobox({categories, categoryId, setCategoryId}: {categories: CategoryDto[], categoryId: string, setCategoryId: (categoryId: string) => void}) {
    return (
        <Combobox value={categoryId} onValueChange={(value) => setCategoryId(value ?? "")}>
            <ComboboxInput className="focus-visible:ring-0 focus-visible:outline-none border placeholder-[#FFFFFF40] text-[#FFFFFF80] border-[#FFFFFF1A] bg-[#00000033] rounded-lg focus-visible:border-[#34D399]" placeholder="Select a category"/>
            <ComboboxContent className="bg-[#101513EE] rounded-2xl border border-[#FFFFFF1A] p-2">
                {categories.length <= 0 && <ComboboxEmpty>No items found.</ComboboxEmpty>}
                <ComboboxList>
                    {categories.map(c => <ComboboxItem className="text-[#FFFFFF80] hover:bg-[#232a27]" key={c.categoryId} value={c.categoryId}>{c.categoryName}</ComboboxItem>)}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}