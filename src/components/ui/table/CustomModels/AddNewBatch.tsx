import * as React from "react";
import { Fragment, useState, useMemo } from "react";
import {
    Button,
    Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import Label from "../../../form/Label";
import Input from "../../../form/input/InputField";
import DatePicker from "../../../form/date-picker";
import { useMutation } from "@apollo/client/react";
import { ADD_BATCH_MUTATION } from "../QuerysDefinitions";
import { toast } from "sonner";

export default function AddNewBatch({ productId, onClose }: { productId: number, onClose?: () => void }) {
    // Calcular la fecha por defecto (hoy + 10 meses)
    const defaultDateObj = useMemo(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 10);
        return date;
    }, []);

    const formatToISO = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00Z`;
    };

    const [formData, setFormData] = useState({
        batchCode: "",
        expirationDate: formatToISO(defaultDateObj),
        quantityUnits: 0
    });

    const [addBatch, { loading }] = useMutation(ADD_BATCH_MUTATION, {
        onCompleted: (data) => {
            if (data.addBatch.result) {
                toast.success(data.addBatch.message || "Lote agregado con éxito");
                onClose?.();
            } else {
                toast.error(data.addBatch.message || "Error al agregar lote");
            }
        },
        onError: (error) => {
            toast.error(error.message || "Error al realizar la mutación");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "quantityUnits" ? parseInt(value) || 0 : value
        }));
    };

    const handleDateChange = (selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
            const date = selectedDates[0];
            
            // Validar que tenga al menos 10 meses de vida útil
            const minDate = new Date();
            minDate.setMonth(minDate.getMonth() + 10);
            
            // Normalizar a inicio del día para la comparación
            minDate.setHours(0, 0, 0, 0);
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);

            if (compareDate < minDate) {
                toast.error("La fecha de expiración debe ser de al menos 10 meses a partir de hoy");
                // Revertir a la fecha por defecto si la seleccionada es inválida
                setFormData(prev => ({
                    ...prev,
                    expirationDate: formatToISO(defaultDateObj)
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                expirationDate: formatToISO(date)
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.batchCode || !formData.expirationDate || formData.quantityUnits <= 0) {
            toast.error("Por favor completa todos los campos correctamente");
            return;
        }

        addBatch({
            variables: {
                input: {
                    productId: Number(productId),
                    batchCode: formData.batchCode,
                    expirationDate: formData.expirationDate,
                    quantityUnits: Number(formData.quantityUnits)
                }
            }
        });
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 h-full w-full space-y-4">
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="mb-2 text-gray-700"
                >
                    Lote
                </Typography>
                <div className="flex flex-row gap-4 justify-center">
                    <div className="w-full">
                        <Label>
                            <FormattedMessage id="batch" values={{ count: 1 }} />
                        </Label>
                        <Input
                            type="text"
                            name="batchCode"
                            value={formData.batchCode}
                            onChange={handleChange}
                            placeholder="Código de lote"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <Label>
                            <FormattedMessage id="expiration_date" values={{ count: 1 }} />
                        </Label>
                        <DatePicker
                            id="expiration_date"
                            placeholder="Seleccionar fecha"
                            value={formData.expirationDate.split('T')[0]} // Pasar solo YYYY-MM-DD al flatpickr
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="w-full">
                        <Label>
                            <FormattedMessage id="units" values={{ count: 1 }} />
                        </Label>
                        <Input
                            type="number"
                            name="quantityUnits"
                            min="1"
                            value={formData.quantityUnits}
                            onChange={handleChange}
                            placeholder="Unidades"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        color="secondary"
                        disabled={loading}
                    >
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
                    </Button>
                </div>
            </form>
        </Fragment>
    );
}
