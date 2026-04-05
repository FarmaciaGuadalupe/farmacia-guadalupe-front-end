import * as React from "react";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@apollo/client/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
} from "@mui/material";

import Label from "../../../form/Label";
import Select from "../../../form/Select";
import Checkbox from "../../../form/input/Checkbox";
import Input from "../../../form/input/InputField";
import {
  GET_SUPPLIERS_LIST_QUERY,
  GET_PRESENTATION_LIST_QUERY,
  GET_BRANDS_LIST_QUERY,
  GET_MANUFACTURERS_LIST_QUERY,
  GET_CATEGORIES_LIST_QUERY,
  GET_ADMINISTRATION_ROUTES_LIST_QUERY,
  GET_ACTIVE_INGREDIENTS_LIST_QUERY,
  GET_DOSE_UNITS_LIST_QUERY,
  GET_UNIT_OF_MEASURE_LIST_QUERY,
} from "../QuerysDefinitions";
import DatePicker from "../../../form/date-picker";

// --- INTERFACES DE TYPESCRIPT ---

export interface ActiveIngredientInput {
  active_ingredient_id: number | string;
  dose_value: number | string;
  dose_unit_id: number | string;
}

export interface MedicineFormData {
  name: string;
  id_brand: string;
  manufacturer_id: string;
  category_id: string;
  administration_route_id: string;
  requires_prescription: boolean;

  supplier_id: string;
  presentation_id: string;
  unit_of_measure_id: string;
  units_per_presentation: number | string;
  currency: string;
  price_per_unit: number | string;
  price_full_presentation: number | string;
  is_fractionable: boolean;

  dosage: string;
  batch_code: string;
  expiration_date: string;
  units: number | string;
  stock_units: number | string;
  min_stock_units: number | string;
  ingredients: ActiveIngredientInput[];
}

// 2. Define las props que recibirán los sub-componentes
interface StepProps {
  formData: MedicineFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<MedicineFormData>>; // Importante para arreglos
}

const steps: string[] = [
  "Identificación del Medicamento",
  "Empaque y Precios",
  "Lote",
];

// --- COMPONENTES DE CADA PASO ---

function MedicalSpecsStep({ formData, onChange, setFormData }: StepProps) {
  const { data: brandsData } = useQuery(GET_BRANDS_LIST_QUERY);
  const brandsOptions = React.useMemo(() => {
    if (!brandsData?.brands?.nodes) return [];
    return brandsData.brands.nodes.map((node: any) => ({
      value: String(node.id_brand),
      label: node.name,
    }));
  }, [brandsData]);

  const { data: manufacturersData } = useQuery(GET_MANUFACTURERS_LIST_QUERY);
  const manufacturersOptions = React.useMemo(() => {
    if (!manufacturersData?.manufacturers?.nodes) return [];
    return manufacturersData.manufacturers.nodes.map((node: any) => ({
      value: String(node.manufacturer_id),
      label: node.name,
    }));
  }, [manufacturersData]);

  const { data: categoriesData } = useQuery(GET_CATEGORIES_LIST_QUERY);
  const categoriesOptions = React.useMemo(() => {
    if (!categoriesData?.categories?.nodes) return [];
    return categoriesData.categories.nodes.map((node: any) => ({
      value: String(node.category_id),
      label: node.name,
    }));
  }, [categoriesData]);

  const { data: administrationRoutesData } = useQuery(
    GET_ADMINISTRATION_ROUTES_LIST_QUERY,
  );
  const administrationRoutesOptions = React.useMemo(() => {
    if (!administrationRoutesData?.administrationRoutes?.nodes) return [];
    return administrationRoutesData.administrationRoutes.nodes.map(
      (node: any) => ({
        value: String(node.administration_route_id || node.category_id),
        label: node.name,
      }),
    );
  }, [administrationRoutesData]);

  const { data: ingredientsData } = useQuery(GET_ACTIVE_INGREDIENTS_LIST_QUERY);
  const ingredientsOptions = React.useMemo(() => {
    if (!ingredientsData?.activeIngredients?.nodes) return [];
    return ingredientsData.activeIngredients.nodes.map((node: any) => ({
      value: String(node.active_ingredient_id),
      label: node.name,
    }));
  }, [ingredientsData]);

  const { data: doseUnitsData } = useQuery(GET_DOSE_UNITS_LIST_QUERY);
  const doseUnitsOptions = React.useMemo(() => {
    if (!doseUnitsData?.doseUnits?.nodes) return [];
    return doseUnitsData.doseUnits.nodes.map((node: any) => ({
      value: String(node.dose_unit_id),
      label: `${node.name} (${node.abbreviation})`, // Ej: Miligramo (mg)
    }));
  }, [doseUnitsData]);

  // 2. Funciones para manejar el Arreglo Dinámico
  const handleIngredientChange = (
    index: number,
    field: keyof ActiveIngredientInput,
    value: any,
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };

    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { active_ingredient_id: "", dose_value: "", dose_unit_id: "" },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  // Función dinámica para actualizar cualquier select en el padre
  const handleSelectChange = (field: keyof MedicineFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: keyof MedicineFormData,
    value: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2 h-full w-full">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="mb-2 text-gray-700"
        >
          Datos del medicamento
        </Typography>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage id="medicines" values={{ count: 1 }} />
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="brands" values={{ count: 1 }} />
            </Label>
            <Select
              options={brandsOptions}
              placeholder="Select Option"
              value={formData.id_brand}
              onChange={(val) => handleSelectChange("id_brand", val)}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="manufacturers" values={{ count: 1 }} />
            </Label>
            <Select
              options={manufacturersOptions}
              placeholder="Select Option"
              value={formData.manufacturer_id}
              onChange={(val) => handleSelectChange("manufacturer_id", val)}
              className="dark:bg-dark-900"
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage id="categories" values={{ count: 1 }} />
            </Label>
            <Select
              options={categoriesOptions}
              placeholder="Select Option"
              value={formData.category_id}
              onChange={(val) => handleSelectChange("category_id", val)}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage
                id="administrationRoutes"
                values={{ count: 1 }}
              />
            </Label>
            <Select
              options={administrationRoutesOptions}
              placeholder="Select Option"
              value={formData.administration_route_id}
              onChange={(val) =>
                handleSelectChange("administration_route_id", val)
              }
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <div className="flex flex-row h-full w-full gap-3 items-center justify-center">
              <Checkbox
                checked={formData.requires_prescription}
                onChange={(val) =>
                  handleCheckboxChange("requires_prescription", val)
                }
              />
              <Label>
                <FormattedMessage id="requiresPrescription" />
              </Label>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <div className="flex flex-col gap-6 h-full w-full mt-4">
              {/* --- SECCIÓN DE COMPOSICIÓN DINÁMICA --- */}
              <div>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  className="mb-2 text-gray-700"
                >
                  Fórmula / Principios Activos
                </Typography>

                {formData.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3 items-end mb-4"
                  >
                    <div className="w-full">
                      <Label>Principio Activo</Label>
                      <Select
                        options={ingredientsOptions}
                        placeholder="Buscar componente..."
                        value={String(ingredient.active_ingredient_id)}
                        onChange={(val) =>
                          handleIngredientChange(
                            index,
                            "active_ingredient_id",
                            val,
                          )
                        }
                      />
                    </div>

                    <div className="w-full">
                      <Label>Dosis</Label>
                      <Input
                        type="number"
                        min="0"
                        value={ingredient.dose_value as number}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "dose_value",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="w-full">
                      <Label>Unidad</Label>
                      <Select
                        options={doseUnitsOptions}
                        placeholder="Ej. mg"
                        value={String(ingredient.dose_unit_id)}
                        onChange={(val) =>
                          handleIngredientChange(index, "dose_unit_id", val)
                        }
                      />
                    </div>

                    {/* Botón para eliminar fila (solo si hay más de 1) */}
                    <div className="w-full pb-1">
                      {formData.ingredients.length > 1 && (
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => removeIngredient(index)}
                          sx={{ minWidth: "40px", padding: "6px" }}
                        >
                          X
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Botón para agregar una nueva fila */}
                <Button
                  variant="text"
                  color="primary"
                  onClick={addIngredient}
                  sx={{ mt: 1 }}
                >
                  + Agregar otro componente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function GeneralInfoStep({ formData, onChange, setFormData }: StepProps) {
  const { data: suppliersData } = useQuery(GET_SUPPLIERS_LIST_QUERY);
  const suppliersOptions = React.useMemo(() => {
    if (!suppliersData?.suppliers?.nodes) return [];
    return suppliersData.suppliers.nodes.map((node: any) => ({
      value: String(node.supplier_id),
      label: node.company_name,
    }));
  }, [suppliersData]);

  const { data: presentationsData } = useQuery(GET_PRESENTATION_LIST_QUERY);
  const presentationsOptions = React.useMemo(() => {
    if (!presentationsData?.presentations?.nodes) return [];
    return presentationsData.presentations.nodes.map((node: any) => ({
      value: String(node.presentation_id),
      label: node.name,
    }));
  }, [presentationsData]);

  const { data: unitOfMeasureData } = useQuery(GET_UNIT_OF_MEASURE_LIST_QUERY);
  const unitOfMeasureOptions = React.useMemo(() => {
    if (!unitOfMeasureData?.unitOfMeasures?.nodes) return [];
    return unitOfMeasureData.unitOfMeasures.nodes.map((node: any) => ({
      value: String(node.unit_of_measure_id),
      label: node.name,
    }));
  }, [unitOfMeasureData]);

  // Función dinámica para actualizar cualquier select en el padre
  const handleSelectChange = (field: keyof MedicineFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: keyof MedicineFormData,
    value: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2 h-full w-full space-y-4">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="mb-2 text-gray-700"
        >
          Empaque y Precios
        </Typography>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage id="suppliers" values={{ count: 1 }} />
            </Label>
            <Select
              options={suppliersOptions}
              placeholder="Select Option"
              value={formData.supplier_id}
              onChange={(val) => handleSelectChange("supplier_id", val)}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="presentations" values={{ count: 1 }} />
            </Label>
            <Select
              options={presentationsOptions}
              placeholder="Select Option"
              value={formData.presentation_id}
              onChange={(val) => handleSelectChange("presentation_id", val)}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="unit_of_measure" values={{ count: 1 }} />
            </Label>
            <Select
              options={unitOfMeasureOptions}
              placeholder="Select Option"
              value={formData.unit_of_measure_id}
              onChange={(val) => handleSelectChange("unit_of_measure_id", val)}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage
                id="units_per_presentation"
                values={{ count: 1 }}
              />
            </Label>
            <Input
              type="number"
              min="1"
              name="units_per_presentation"
              value={formData.units_per_presentation}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage
                id="price_full_presentation"
                values={{ count: 1 }}
              />
            </Label>
            <Input
              type="number"
              min="1"
              name="price_full_presentation"
              value={formData.price_full_presentation}
              onChange={onChange}
            />
          </div>
          <div className="flex flex-row h-full w-full gap-3 items-center justify-center">
            <Checkbox
              checked={formData.is_fractionable}
              onChange={(val) => handleCheckboxChange("is_fractionable", val)}
            />
            <Label>
              <FormattedMessage id="is_fractionable" />
            </Label>
          </div>
          {!!formData.is_fractionable && (
            <div className="w-full">
              <Label>
                <FormattedMessage
                  id="price_full_presentation"
                  values={{ count: 1 }}
                />
              </Label>
              <Input
                type="number"
                min="1"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

function CompositionStep({ formData, onChange, setFormData }: StepProps) {
  return (
    <Fragment>
      <div className="flex flex-col gap-2 h-full w-full space-y-4">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="mb-2 text-gray-700"
        >
          Lote
        </Typography>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage id="batch" values={{ count: 1 }} />
            </Label>
            <Input
              type="text"
              name="batch_code"
              value={formData.batch_code}
              onChange={onChange}
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="expiration_date" values={{ count: 1 }} />
            </Label>
            <DatePicker
              id="expiration_date"
              placeholder="Select a date"
              defaultDate={formData.expiration_date}
              onChange={(dates, currentDateString) => {
                // Handle your logic
                console.log({ dates, currentDateString });
              }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center  ">
          <div className="w-full">
            <Label>
              <FormattedMessage id="units" values={{ count: 1 }} />
            </Label>
            <Input
              type="number"
              name="units"
              min="0"
              value={formData.units}
              onChange={onChange}
            />
          </div>
          <div className="w-full">
            <Label>
              <FormattedMessage id="stock_units" values={{ count: 1 }} />
            </Label>
            <Input
              type="number"
              name="stock_units"
              min="0"
			  disabled={true}
              value={(!!formData.units && !!formData.units_per_presentation) ? formData.units * formData.units_per_presentation : "0" }
              onChange={onChange}
            />
          </div>
		  <div className="w-full">
            <Label>
              <FormattedMessage id="min_stock_units" values={{ count: 1 }} />
            </Label>
            <Input
              type="number"
              name="min_stock_units"
              min="0"
              value={!!formData.stock_units ? formData.stock_units  * 0.10 : "0" }
              onChange={onChange}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center">
			
		</div>
      </div>
    </Fragment>
  );
}

// --- COMPONENTE PRINCIPAL ---

export default function AddNewMedicine() {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  // Tipamos el estado inicial con la interfaz MedicineFormData
  const [formData, setFormData] = React.useState<MedicineFormData>({
    name: "",
    id_brand: "",
    manufacturer_id: "",
    category_id: "",
    administration_route_id: "",
    requires_prescription: false,

    supplier_id: "",
    presentation_id: "",
    unit_of_measure_id: "",
    units_per_presentation: "",
    currency: "USD",
    price_per_unit: "",
    price_full_presentation: "",
    is_fractionable: false,

    dosage: "",
    batch_code: "",
    expiration_date: "",
    units: "",
    stock_units: "",
    min_stock_units: "",
    ingredients: [
      { active_ingredient_id: "", dose_value: "", dose_unit_id: "" },
    ],
  });

  // Tipamos el evento del input para que TypeScript sepa que e.target.name y e.target.value existen
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submitToAPI();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: "",
      id_brand: "",
      manufacturer_id: "",
      category_id: "",
      administration_route_id: "",
      requires_prescription: false,

      supplier_id: "",
      presentation_id: "",
      unit_of_measure_id: "",
      units_per_presentation: "",
      currency: "NIO",
      price_per_unit: "",
      price_full_presentation: "",
      is_fractionable: false,

      dosage: "",
      batch_code: "",
      expiration_date: "",
      units: "",
      stock_units: "",
      min_stock_units: "",
      ingredients: [
        { active_ingredient_id: "", dose_value: "", dose_unit_id: "" },
      ],
    });
  };

  const submitToAPI = async () => {
    console.log("Enviando payload al API:", formData);
    // Aquí formData ya es de tipo MedicineFormData y está listo para ser enviado

    // Simulación de éxito
    setActiveStep((prev) => prev + 1);
  };

  // Tipamos el parámetro step como un número y el retorno como un React.ReactNode
  const getStepContent = (step: number): React.ReactNode => {
    switch (step) {
      case 0:
        return (
          <MedicalSpecsStep
            formData={formData}
            onChange={handleChange}
            setFormData={setFormData}
          />
        );
      case 1:
        return (
          <GeneralInfoStep
            formData={formData}
            onChange={handleChange}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <CompositionStep
            formData={formData}
            onChange={handleChange}
            setFormData={setFormData}
          />
        );
      default:
        return <Typography>Paso desconocido</Typography>;
    }
  };

  return (
    <Box className="p-3">
      {/* sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}> */}
      <Stepper className="m-4 " activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 4, mb: 2, textAlign: "center" }}>
            ¡Producto guardado exitosamente!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button variant="contained" onClick={handleReset}>
              Añadir otro producto
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {getStepContent(activeStep)}

          <div className="flex flex-row gap-2 items-end justify-end mt-5   ">
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Atrás
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Enviar al API" : "Siguiente"}
            </Button>
          </div>
        </Fragment>
      )}
    </Box>
  );
}
