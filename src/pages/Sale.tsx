import React, { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react"
import {
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useAuth } from "../context/AuthContext";

// --- GRAPHQL DEFINITIONS (Skeletons / Real) ---
const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      nodes {
        customerId
        firstName
        lastName
      }
    }
  }
`;

const GET_PRODUCTS_WITH_BATCHES = gql`
  query GetProductsWithBatches($search: String) {
    products(filter: { or: [{ name: { includes: $search } }, { barcode: { equalTo: $search } }] }) {
      nodes {
        productId
        name
        barcode
        isFractionable
        batchesByProductId(filter: { stockUnits: { greaterThan: 0 } }) {
          nodes {
            batchId
            batchCode
            expirationDate
            stockUnits
            pricePerUnit
            priceFullPresentation
            unitsPerPresentation
          }
        }
      }
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      nodes {
        paymentMethodId
        name
      }
    }
  }
`;

const CREATE_SALE_MUTATION = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: { sale: $input }) {
      sale {
        saleId
        receiptNumber
      }
    }
  }
`;

// --- TYPES ---
interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
}

interface Batch {
  batchId: number;
  batchCode: string;
  expirationDate: string;
  stockUnits: number;
  pricePerUnit: number;
  priceFullPresentation: number;
  unitsPerPresentation: number;
}

interface Product {
  productId: number;
  name: string;
  barcode: string;
  isFractionable: boolean;
  batches: Batch[];
}

interface PaymentMethod {
  paymentMethodId: number;
  name: string;
}

interface CartItem {
  id: string; // Unique ID for the cart row
  product: Product;
  batch: Batch | null;
  quantity: number;
  isFullPresentation: boolean;
  promotionId: number | null;
}

interface PaymentItem {
  id: string;
  paymentMethodId: number | "";
  amount: number | "";
  transactionReference: string;
}

export default function Sale() {
  const { user } = useAuth();
  
  // --- STATE: Header Section ---
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [receiptType, setReceiptType] = useState<string>("FACTURA");
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [showMedicalData, setShowMedicalData] = useState<boolean>(false);
  const [prescriptionNumber, setPrescriptionNumber] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");

  // --- STATE: Cart & Search ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<Product | null>(null);

  // --- STATE: Payments ---
  const [payments, setPayments] = useState<PaymentItem[]>([
    { id: Date.now().toString(), paymentMethodId: "", amount: "", transactionReference: "" },
  ]);

  // --- QUERIES & MUTATIONS ---
  const { data: customersData } = useQuery(GET_CUSTOMERS);
  // Simulating product search for demonstration. In a real scenario, this would refetch on searchQuery change or debounced input.
  const { data: productsData } = useQuery(GET_PRODUCTS_WITH_BATCHES, {
    variables: { search: searchQuery },
    skip: searchQuery.length < 3, // Only search if length >= 3
  });
  const { data: paymentMethodsData } = useQuery(GET_PAYMENT_METHODS);
  const [createSale, { loading: isSubmitting }] = useMutation(CREATE_SALE_MUTATION);

  // --- DERIVED STATE / CALCULATIONS ---
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!item.batch) return acc;
      const price = item.isFullPresentation ? item.batch.priceFullPresentation : item.batch.pricePerUnit;
      return acc + (price * item.quantity);
    }, 0);
  }, [cart]);

  const iva = subtotal * 0.15; // Example 15% IVA
  const grandTotal = subtotal + iva;

  const totalPaid = useMemo(() => {
    return payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }, [payments]);

  const changeDue = totalPaid - grandTotal;

  // --- HANDLERS: Header ---
  // Handled directly in onChange props

  // --- HANDLERS: Search & Cart ---
  const handleProductSelect = (product: Product) => {
    if (!product.batches || product.batches.length === 0) {
      toast.error("Este producto no tiene lotes disponibles con stock.");
      return;
    }
    
    if (product.batches.length === 1) {
      // Auto select if only one batch
      addBatchToCart(product, product.batches[0]);
    } else {
      // Open modal to select batch
      setSelectedProductForBatch(product);
    }
    setSearchQuery(""); // Clear search
  };

  const addBatchToCart = (product: Product, batch: Batch) => {
    setCart((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        product,
        batch,
        quantity: 1,
        isFullPresentation: true, // Default to full
        promotionId: null,
      },
    ]);
    setSelectedProductForBatch(null);
  };

  const updateCartItem = (id: string, field: keyof CartItem, value: any) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Validation on quantity change
          if (field === "quantity" && item.batch) {
            const valNum = Number(value);
            if (valNum > item.batch.stockUnits) {
              toast.error(`La cantidad no puede superar el stock (${item.batch.stockUnits})`);
              return { ...item, [field]: item.batch.stockUnits };
            }
            if (valNum < 1) return { ...item, [field]: 1 };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- HANDLERS: Payments ---
  const addPaymentRow = () => {
    setPayments((prev) => [
      ...prev,
      { id: Date.now().toString(), paymentMethodId: "", amount: "", transactionReference: "" },
    ]);
  };

  const updatePaymentRow = (id: string, field: keyof PaymentItem, value: any) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removePaymentRow = (id: string) => {
    if (payments.length > 1) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // --- HANDLERS: Submission ---
  const handleProcessSale = async () => {
    // Validations
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }
    if (cart.some((item) => !item.batch)) {
      toast.error("Todos los productos deben tener un lote asignado.");
      return;
    }
    if (totalPaid < grandTotal) {
      toast.error("El monto pagado es menor al total de la venta.");
      return;
    }
    if (!receiptNumber) {
        toast.error("Debe ingresar el número de comprobante.");
        return;
    }

    const payload = {
      employeeId: user?.employeeId || 1, // Fallback if user is null
      customerId: selectedCustomer?.customerId || null,
      receiptType,
      receiptNumber,
      prescriptionNumber: showMedicalData ? prescriptionNumber : null,
      doctorName: showMedicalData ? doctorName : null,
      currency: "NIO",
      details: cart.map((item) => ({
        productId: item.product.productId,
        batchId: item.batch!.batchId,
        quantity: Number(item.quantity),
        promotionId: item.promotionId,
        isFullPresentation: item.isFullPresentation,
      })),
      payments: payments
        .filter((p) => p.paymentMethodId !== "" && Number(p.amount) > 0)
        .map((p) => ({
          paymentMethodId: Number(p.paymentMethodId),
          amount: Number(p.amount),
          transactionReference: p.transactionReference || null,
        })),
    };

    try {
      console.log("🚀 Payload:", payload);
      // const { data } = await createSale({ variables: { input: payload } });
      // toast.success(`Venta procesada con éxito. ID: ${data.createSale.sale.saleId}`);
      toast.success("Venta validada (Mock de mutación exitoso). Revisa consola.");
      
      // Reset form on success
      setCart([]);
      setPayments([{ id: Date.now().toString(), paymentMethodId: "", amount: "", transactionReference: "" }]);
      setReceiptNumber("");
      setSelectedCustomer(null);
      setPrescriptionNumber("");
      setDoctorName("");
      setSearchQuery("");
      
    } catch (err: any) {
      console.error("Error al procesar la venta:", err);
      toast.error(err.message || "Error al procesar la venta.");
    }
  };

  // --- HELPERS FOR MOCK RENDER ---
  // In a real app, productsData?.products?.nodes would populate options
  const productSearchOptions = productsData?.products?.nodes || [
    // MOCK DATA for demonstration
    {
      productId: 1, name: "Paracetamol 500mg", barcode: "123456", isFractionable: true,
      batches: [
        { batchId: 1, batchCode: "L-001", expirationDate: "2025-12-31", stockUnits: 50, pricePerUnit: 2, priceFullPresentation: 20, unitsPerPresentation: 10 },
        { batchId: 2, batchCode: "L-002", expirationDate: "2026-06-30", stockUnits: 100, pricePerUnit: 2.5, priceFullPresentation: 25, unitsPerPresentation: 10 },
      ]
    },
    {
       productId: 2, name: "Amoxicilina 500mg", barcode: "789012", isFractionable: false,
       batches: [ { batchId: 3, batchCode: "L-003", expirationDate: "2024-11-30", stockUnits: 20, pricePerUnit: 5, priceFullPresentation: 50, unitsPerPresentation: 10 } ]
    }
  ];

  return (
    <div className="pb-20">
      <PageBreadcrumb pageTitle="Punto de Venta" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT COLUMN: Header & Cart (Takes 2/3 space) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SECTION A: CABECERA DE LA VENTA */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Datos Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Autocomplete
                options={customersData?.customers?.nodes || []}
                getOptionLabel={(opt: Customer) => `${opt.firstName} ${opt.lastName}`}
                value={selectedCustomer}
                onChange={(_, val) => setSelectedCustomer(val)}
                renderInput={(params) => <TextField {...params} label="Cliente (Dejar vacío = Consumidor Final)" variant="outlined" size="small" />}
                className="w-full"
              />
              
              <div className="flex gap-4">
                <FormControl size="small" className="w-1/3">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={receiptType}
                    label="Tipo"
                    onChange={(e) => setReceiptType(e.target.value)}
                  >
                    <MenuItem value="FACTURA">Factura</MenuItem>
                    <MenuItem value="TICKET">Ticket</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="No. Comprobante"
                  variant="outlined"
                  size="small"
                  className="w-2/3"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Medical Data Toggle */}
            <div className="mt-4">
              <FormControlLabel
                control={<Switch checked={showMedicalData} onChange={(e) => setShowMedicalData(e.target.checked)} />}
                label="Incluir Datos Médicos (Receta)"
              />
              {showMedicalData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <TextField
                    label="Número de Receta"
                    variant="outlined"
                    size="small"
                    value={prescriptionNumber}
                    onChange={(e) => setPrescriptionNumber(e.target.value)}
                  />
                  <TextField
                    label="Nombre del Médico"
                    variant="outlined"
                    size="small"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION B: BUSCADOR Y CARRITO */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Productos</h2>
            
            <Autocomplete
              options={productSearchOptions}
              getOptionLabel={(opt: Product) => `${opt.barcode} - ${opt.name}`}
              inputValue={searchQuery}
              onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
              onChange={(_, val) => {
                if (val) handleProductSelect(val);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Buscar por código de barras o nombre..." variant="outlined" autoFocus />
              )}
              className="mb-6"
              freeSolo // Allow typing even if no match is found immediately
              clearOnBlur
            />

            {/* Carrito Table (Tailwind approach for custom layout) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Lote/Venc.</th>
                    <th className="px-4 py-3">Presentación</th>
                    <th className="px-4 py-3">Cant.</th>
                    <th className="px-4 py-3 text-right">Precio U.</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center">
                        El carrito está vacío
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => {
                      const price = item.batch 
                        ? (item.isFullPresentation ? item.batch.priceFullPresentation : item.batch.pricePerUnit) 
                        : 0;
                      const lineTotal = price * item.quantity;

                      return (
                        <tr key={item.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {item.product.name}
                          </td>
                          <td className="px-4 py-3">
                            {item.batch ? (
                              <span className="text-xs">
                                {item.batch.batchCode}<br/>
                                <span className="text-gray-400">{item.batch.expirationDate}</span>
                              </span>
                            ) : "Sin Lote"}
                          </td>
                          <td className="px-4 py-3">
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={item.isFullPresentation}
                                  onChange={(e) => updateCartItem(item.id, "isFullPresentation", e.target.checked)}
                                  disabled={!item.product.isFractionable}
                                />
                              }
                              label={<span className="text-xs">{item.isFullPresentation ? "Caja" : "Unidad"}</span>}
                            />
                          </td>
                          <td className="px-4 py-3 w-24">
                            <TextField
                              type="number"
                              size="small"
                              inputProps={{ min: 1, max: item.batch?.stockUnits || 1 }}
                              value={item.quantity}
                              onChange={(e) => updateCartItem(item.id, "quantity", e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            C$ {price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">
                            C$ {lineTotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <IconButton color="error" onClick={() => removeCartItem(item.id)}>
                              <TrashIcon className="h-5 w-5" />
                            </IconButton>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Totals & Payments (Takes 1/3 space) --- */}
        <div className="space-y-6">
          {/* SECTION C: TOTALES Y PAGOS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumen</h2>
            
            <div className="space-y-3 mb-6 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal Bruto</span>
                <span className="font-mono">C$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>IVA (15%)</span>
                <span className="font-mono">C$ {iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span>TOTAL A PAGAR</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">C$ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3">Métodos de Pago</h3>
            
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={payment.id} className="relative p-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                  {payments.length > 1 && (
                    <button 
                      onClick={() => removePaymentRow(payment.id)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <FormControl size="small" fullWidth>
                      <InputLabel>Método</InputLabel>
                      <Select
                        value={payment.paymentMethodId}
                        label="Método"
                        onChange={(e) => updatePaymentRow(payment.id, "paymentMethodId", e.target.value)}
                      >
                        {/* Mock Options */}
                        <MenuItem value={1}>Efectivo</MenuItem>
                        <MenuItem value={2}>Tarjeta de Débito/Crédito</MenuItem>
                        <MenuItem value={3}>Transferencia</MenuItem>
                        {paymentMethodsData?.paymentMethods?.nodes?.map((pm: any) => (
                          <MenuItem key={pm.paymentMethodId} value={pm.paymentMethodId}>{pm.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Monto"
                      type="number"
                      size="small"
                      fullWidth
                      value={payment.amount}
                      onChange={(e) => updatePaymentRow(payment.id, "amount", e.target.value)}
                    />
                  </div>
                  {/* Show reference input only for non-cash methods (assuming id 1 is cash) */}
                  {payment.paymentMethodId !== 1 && payment.paymentMethodId !== "" && (
                     <TextField
                       label="Referencia / Voucher"
                       size="small"
                       fullWidth
                       value={payment.transactionReference}
                       onChange={(e) => updatePaymentRow(payment.id, "transactionReference", e.target.value)}
                     />
                  )}
                </div>
              ))}
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<PlusIcon className="h-4 w-4" />}
                onClick={addPaymentRow}
              >
                Añadir otro pago
              </Button>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${changeDue >= 0 ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300'}`}>
              <div className="flex justify-between font-medium">
                <span>{changeDue >= 0 ? 'Cambio a Devolver' : 'Monto Faltante'}</span>
                <span className="font-mono">C$ {Math.abs(changeDue).toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              className="mt-6 !py-3 !text-lg !font-bold"
              onClick={handleProcessSale}
              disabled={isSubmitting || cart.length === 0 || totalPaid < grandTotal}
            >
              {isSubmitting ? "Procesando..." : "Procesar Venta"}
            </Button>
          </div>
        </div>
      </div>

      {/* --- MODAL: Seleccionar Lote --- */}
      <Dialog open={!!selectedProductForBatch} onClose={() => setSelectedProductForBatch(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Seleccionar Lote - {selectedProductForBatch?.name}</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-3">
            {selectedProductForBatch?.batches.map((batch) => (
              <div 
                key={batch.batchId} 
                className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => addBatchToCart(selectedProductForBatch, batch)}
              >
                <div>
                  <div className="font-medium text-gray-900">Lote: {batch.batchCode}</div>
                  <div className="text-sm text-gray-500">Vence: {batch.expirationDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-emerald-600">Stock: {batch.stockUnits}</div>
                  <div className="text-sm text-gray-500">Precio: C$ {batch.priceFullPresentation}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProductForBatch(null)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
