import React, { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
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
import {
  generateSaleVoucherPDF,
  SaleSummary,
} from "../utils/generateSaleVoucher";
import { nicaDate, nowInNica } from "../utils/dateUtils";

// --- GRAPHQL DEFINITIONS ---
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

const GET_MEDICINES_WITH_BATCHES = gql`
  query GetMedicinesWithBatches {
    medicines {
      nodes {
        medicine_id
        name
        requires_prescription
        product {
          product_id
          barcode
          price_per_unit
          price_full_presentation
          stock_units
          is_fractionable
          batches {
            batch_id
            batch_code
            expiration_date
            current_quantity_units
            is_active
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
        isActive
      }
    }
  }
`;

const CREATE_SALE_MUTATION = gql`
  mutation RegistrarVenta($input: CreateSaleInput!) {
    createSale(input: $input) {
      success
      message
      saleId
      receiptNumber
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
  batch_id: number;
  batch_code: string;
  expiration_date: string;
  current_quantity_units: number;
  is_active: boolean;
}

interface ProductInfo {
  product_id: number;
  barcode: string;
  price_per_unit: number;
  price_full_presentation: number;
  stock_units: number;
  is_fractionable: boolean;
  batches: Batch[];
}

interface Medicine {
  medicine_id: number;
  name: string;
  requires_prescription: boolean;
  product: ProductInfo;
}

interface PaymentMethod {
  paymentMethodId: number;
  name: string;
  isActive: boolean;
}

interface CartItem {
  id: string; // Unique ID for the cart row
  medicine: Medicine;
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [saleType, setSaleType] = useState<string>("LIBRE"); // LIBRE or RECETA
  const [showMedicalData, setShowMedicalData] = useState<boolean>(false);
  const [prescriptionNumber, setPrescriptionNumber] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const [receiptNumber, setReceiptNumber] = useState<string>(
    crypto.randomUUID(),
  );

  // --- STATE: Cart & Search ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMedicineForBatch, setSelectedMedicineForBatch] =
    useState<Medicine | null>(null);

  // --- STATE: Payments ---
  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: Date.now().toString(),
      paymentMethodId: "",
      amount: "",
      transactionReference: "",
    },
  ]);

  // --- STATE: Voucher ---
  const [completedSaleData, setCompletedSaleData] =
    useState<SaleSummary | null>(null);

  // --- QUERIES & MUTATIONS ---
  const { data: customersData, refetch: refetchCustomers } =
    useQuery(GET_CUSTOMERS);
  const { data: medicinesData, refetch: refetchMedicines } = useQuery(
    GET_MEDICINES_WITH_BATCHES,
  );
  const { data: paymentMethodsData, refetch: refetchPaymentMethods } =
    useQuery(GET_PAYMENT_METHODS);
  const [createSale, { loading: isSubmitting }] =
    useMutation(CREATE_SALE_MUTATION);

  // --- DERIVED STATE / CALCULATIONS ---
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!item.batch || !item.medicine.product) return acc;
      const price = item.isFullPresentation
        ? item.medicine.product.price_full_presentation
        : item.medicine.product.price_per_unit;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const iva = subtotal * 0.15; // Example 15% IVA
  const grandTotal = subtotal + iva;

  const totalPaid = useMemo(() => {
    return payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }, [payments]);

  const changeDue = totalPaid - grandTotal;

  // --- HANDLERS: Search & Cart ---
  const handleProductSelect = (medicine: Medicine) => {
    if (
      !medicine.product ||
      !medicine.product.batches ||
      medicine.product.batches.length === 0
    ) {
      toast.error("Este producto no tiene lotes disponibles.");
      return;
    }

    // Filter active batches with stock
    const availableBatches = medicine.product.batches.filter(
      (b) => b.is_active && b.current_quantity_units > 0,
    );

    if (availableBatches.length === 0) {
      toast.error("Este producto no tiene lotes activos con stock disponible.");
      return;
    }

    // Auto-detect if prescription is needed
    if (medicine.requires_prescription) {
       setSaleType("RECETA");
       setShowMedicalData(true);
       toast.info(`El producto ${medicine.name} requiere receta médica.`);
    }

    if (availableBatches.length === 1) {
      // Auto select if only one batch
      addBatchToCart(medicine, availableBatches[0]);
    } else {
      // Open modal to select batch
      setSelectedMedicineForBatch(medicine);
    }
    setSearchQuery(""); // Clear search
  };

  const addBatchToCart = (medicine: Medicine, batch: Batch) => {
    setCart((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        medicine,
        batch,
        quantity: 1,
        isFullPresentation: true, // Default to full
        promotionId: null,
      },
    ]);
    setSelectedMedicineForBatch(null);
  };

  const updateCartItem = (
    id: string,
    field: keyof CartItem,
    value: number | boolean,
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Validation on quantity change
          if (field === "quantity" && item.batch) {
            const valNum = Number(value);
            if (valNum > item.batch.current_quantity_units) {
              toast.error(
                `La cantidad no puede superar el stock del lote (${item.batch.current_quantity_units})`,
              );
              return { ...item, [field]: item.batch.current_quantity_units };
            }
            if (valNum < 1) return { ...item, [field]: 1 };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- HANDLERS: Payments ---
  const addPaymentRow = () => {
    setPayments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        paymentMethodId: "",
        amount: "",
        transactionReference: "",
      },
    ]);
  };

  const updatePaymentRow = (
    id: string,
    field: keyof PaymentItem,
    value: string | number,
  ) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
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
    
    // Medical validation
    if (saleType === "RECETA" && (!prescriptionNumber.trim() || !doctorName.trim())) {
      toast.error("Los datos médicos son obligatorios para ventas con receta.");
      return;
    }

    // Prepare payments
    let remainingAmountToCover = grandTotal;
    const finalPayments = payments
      .filter((p) => p.paymentMethodId !== "" && Number(p.amount) > 0)
      .map((p) => {
        let amountToRegister = Number(p.amount);
        if (amountToRegister > remainingAmountToCover) {
          amountToRegister = remainingAmountToCover;
        }
        remainingAmountToCover -= amountToRegister;

        return {
          paymentMethodId: Number(p.paymentMethodId),
          amount: parseFloat(amountToRegister.toFixed(2)),
          transactionReference: p.transactionReference || null,
        };
      });

    const payload = {
      employeeId: user?.employeeId || 1, 
      customerId: selectedCustomer?.customerId || null,
      receiptType: "TICKET", 
      receiptNumber,
      prescriptionNumber:
        (saleType === "RECETA" || showMedicalData) && prescriptionNumber ? prescriptionNumber : null,
      doctorName: (saleType === "RECETA" || showMedicalData) && doctorName ? doctorName : null,
      currency: "NIO",
      details: cart.map((item) => ({
        productId: item.medicine.product.product_id,
        batchId: item.batch!.batch_id,
        quantity: Number(item.quantity),
        promotionId: item.promotionId,
        isFullPresentation: item.isFullPresentation,
      })),
      payments: finalPayments,
    };

    try {
      const { data } = await createSale({ variables: { input: payload } });

      if (data?.createSale?.success) {
        toast.success(data.createSale.message || "Venta procesada con éxito.");

        const saleSummary: SaleSummary = {
          receiptNumber: data.createSale.receiptNumber || receiptNumber,
          receiptType: "TICKET",
          date: nowInNica().toDate(),
          customer: selectedCustomer
            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
            : "Consumidor Final",
          items: cart.map((item) => {
            const price = item.isFullPresentation
                  ? item.medicine.product.price_full_presentation
                  : item.medicine.product.price_per_unit;
            return {
              name: item.medicine.name,
              quantity: item.quantity,
              price: price,
              total: item.quantity * price,
              presentation: item.isFullPresentation ? "Caja" : "Unidad",
            };
          }),
          subtotal,
          iva,
          grandTotal,
          totalPaid,
          changeDue,
        };

        setCompletedSaleData(saleSummary);
        generateSaleVoucherPDF(saleSummary); 

        // Reset
        setCart([]);
        setPayments([{ id: Date.now().toString(), paymentMethodId: "", amount: "", transactionReference: "" }]);
        setReceiptNumber(crypto.randomUUID());
        setSelectedCustomer(null);
        setPrescriptionNumber("");
        setDoctorName("");
        setSearchQuery("");
        setSaleType("LIBRE");
        setShowMedicalData(false);

        refetchCustomers();
        refetchMedicines();
        refetchPaymentMethods();
      } else {
        toast.error(data?.createSale?.message || "Error al registrar la venta.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la venta.");
    }
  };

  const productSearchOptions = useMemo(() => {
    if (!medicinesData?.medicines?.nodes) return [];
    const nodes = medicinesData.medicines.nodes as Medicine[];
    if (searchQuery.length < 2) return nodes;
    const lowerQuery = searchQuery.toLowerCase();
    return nodes.filter(
      (med) =>
        med.name.toLowerCase().includes(lowerQuery) ||
        (med.product?.barcode && med.product.barcode.toLowerCase().includes(lowerQuery)),
    );
  }, [medicinesData, searchQuery]);

  return (
    <div className="pb-20">
      <PageBreadcrumb pageTitle="Punto de Venta" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Datos de Venta
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="hidden">
                  <Autocomplete
                    options={customersData?.customers?.nodes || []}
                    getOptionLabel={(opt: Customer) => `${opt.firstName} ${opt.lastName}`}
                    value={selectedCustomer}
                    onChange={(_, val) => setSelectedCustomer(val)}
                    renderInput={(params) => <TextField {...params} label="Cliente" variant="outlined" size="small" />}
                  />
                </div>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Tipo de Venta</InputLabel>
                  <Select
                    value={saleType}
                    label="Tipo de Venta"
                    onChange={(e) => {
                      const val = e.target.value;
                      setSaleType(val);
                      if (val === "RECETA") setShowMedicalData(true);
                      else setShowMedicalData(false);
                    }}
                  >
                    <MenuItem value="LIBRE">Venta Libre</MenuItem>
                    <MenuItem value="RECETA">Venta con Receta</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <FormControlLabel
                control={
                  <Switch
                    checked={showMedicalData}
                    onChange={(e) => setShowMedicalData(e.target.checked)}
                    disabled={saleType === "RECETA"}
                  />
                }
                label="Incluir Datos Médicos"
              />
              {showMedicalData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <TextField
                    label="Número de Receta"
                    variant="outlined"
                    size="small"
                    required={saleType === "RECETA"}
                    value={prescriptionNumber}
                    onChange={(e) => setPrescriptionNumber(e.target.value)}
                    error={saleType === "RECETA" && !prescriptionNumber.trim()}
                  />
                  <TextField
                    label="Nombre del Médico"
                    variant="outlined"
                    size="small"
                    required={saleType === "RECETA"}
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    error={saleType === "RECETA" && !doctorName.trim()}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Productos
            </h2>

            <Autocomplete
              options={productSearchOptions}
              getOptionLabel={(opt: Medicine | string) => {
                if (typeof opt === 'string') return opt;
                return `${opt.product?.barcode || "N/A"} - ${opt.name}`;
              }}
              inputValue={searchQuery}
              onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
              onChange={(_, val) => {
                if (val && typeof val !== 'string') handleProductSelect(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar por código de barras o nombre..."
                  variant="outlined"
                  autoFocus
                />
              )}
              className="mb-6"
              freeSolo
              clearOnBlur
            />

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
                      const price = item.isFullPresentation
                            ? item.medicine.product.price_full_presentation
                            : item.medicine.product.price_per_unit;
                      const lineTotal = price * item.quantity;

                      return (
                        <tr key={item.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {item.medicine.name}
                            {item.medicine.requires_prescription && (
                              <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                Rx
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {item.batch ? (
                              <span className="text-xs">
                                {item.batch.batch_code}
                                <br />
                                <span className="text-gray-400">{item.batch.expiration_date}</span>
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
                                  disabled={!item.medicine.product?.is_fractionable}
                                />
                              }
                              label={<span className="text-xs">{item.isFullPresentation ? "Caja" : "Unidad"}</span>}
                            />
                          </td>
                          <td className="px-4 py-3 w-24">
                            <TextField
                              type="number"
                              size="small"
                              inputProps={{ min: 1, max: item.batch?.current_quantity_units || 1 }}
                              value={item.quantity}
                              onChange={(e) => updateCartItem(item.id, "quantity", Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-mono">C$ {price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-mono font-semibold text-blue-600 dark:text-blue-400">C$ {lineTotal.toFixed(2)}</td>
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

        <div className="space-y-6">
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
              {payments.map((payment) => (
                <div key={payment.id} className="relative p-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                  {payments.length > 1 && (
                    <button onClick={() => removePaymentRow(payment.id)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors">
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
                        {paymentMethodsData?.paymentMethods?.nodes
                          ?.filter((pm: PaymentMethod) => pm.isActive)
                          .map((pm: PaymentMethod) => (
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
              <Button variant="outlined" color="primary" fullWidth startIcon={<PlusIcon className="h-4 w-4" />} onClick={addPaymentRow}>Añadir otro pago</Button>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${changeDue >= 0 ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"}`}>
              <div className="flex justify-between font-medium">
                <span>{changeDue >= 0 ? "Cambio a Devolver" : "Monto Faltante"}</span>
                <span className="font-mono">C$ {Math.abs(changeDue).toFixed(2)}</span>
              </div>
            </div>

            <Button variant="contained" color="primary" size="large" fullWidth className="mt-6 !py-3 !text-lg !font-bold" onClick={handleProcessSale} disabled={isSubmitting || cart.length === 0 || totalPaid < grandTotal}>
              {isSubmitting ? "Procesando..." : "Procesar Venta"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedMedicineForBatch} onClose={() => setSelectedMedicineForBatch(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Seleccionar Lote - {selectedMedicineForBatch?.name}</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-3">
            {selectedMedicineForBatch?.product?.batches
              ?.filter((b) => b.is_active && b.current_quantity_units > 0)
              .map((batch) => (
                <div key={batch.batch_id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => addBatchToCart(selectedMedicineForBatch, batch)}>
                  <div>
                    <div className="font-medium text-gray-900">Lote: {batch.batch_code}</div>
                    <div className="text-sm text-gray-500">Vence: {batch.expiration_date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-emerald-600">Stock: {batch.current_quantity_units}</div>
                    <div className="text-sm text-gray-500">Precio: C$ {selectedMedicineForBatch.product.price_full_presentation}</div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
        <DialogActions><Button onClick={() => setSelectedMedicineForBatch(null)}>Cancelar</Button></DialogActions>
      </Dialog>

      <Dialog open={!!completedSaleData} onClose={() => setCompletedSaleData(null)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-center font-bold text-xl">Farmacia Guadalupe</DialogTitle>
        <DialogContent dividers>
          {completedSaleData && (
            <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
              <div className="text-center mb-6">
                <p className="font-semibold text-lg uppercase">{completedSaleData.receiptType}</p>
                <p>Nro: {completedSaleData.receiptNumber}</p>
                <p>Fecha: {nicaDate(completedSaleData.date).format("DD/MM/YYYY hh:mm A")}</p>
              </div>
              <div className="mb-4"><strong>Cliente:</strong> {completedSaleData.customer}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      <th className="py-2">Cant</th>
                      <th className="py-2">Descripción</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSaleData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{item.name} <span className="text-xs text-gray-500">({item.presentation})</span></td>
                        <td className="py-2 text-right font-mono">C$ {item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-1 text-right mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
                <p>Subtotal: <span className="font-mono">C$ {completedSaleData.subtotal.toFixed(2)}</span></p>
                <p>IVA (15%): <span className="font-mono">C$ {completedSaleData.iva.toFixed(2)}</span></p>
                <p className="font-bold text-lg mt-2">Total: <span className="font-mono">C$ {completedSaleData.grandTotal.toFixed(2)}</span></p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">Pagado: <span className="font-mono">C$ {completedSaleData.totalPaid.toFixed(2)}</span></p>
                  <p className="text-gray-600 dark:text-gray-400">Cambio: <span className="font-mono">C$ {Math.abs(completedSaleData.changeDue).toFixed(2)}</span></p>
                </div>
              </div>
              <div className="text-center mt-6 italic text-gray-500">¡Gracias por su compra!</div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletedSaleData(null)}>Cerrar</Button>
          <Button variant="contained" color="primary" onClick={() => completedSaleData && generateSaleVoucherPDF(completedSaleData, true)}>Imprimir / Ver PDF</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
