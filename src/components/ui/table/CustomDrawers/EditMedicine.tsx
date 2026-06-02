import * as React from "react";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "@apollo/client/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Typography, Box } from "@mui/material";
import { toast } from "sonner";

import Label from "../../../form/Label";
import Select from "../../../form/Select";
import Input from "../../../form/input/InputField";
import {
	GET_BRANDS_LIST_QUERY,
	GET_CATEGORIES_LIST_QUERY,
	GET_ADMINISTRATION_ROUTES_LIST_QUERY,
	GET_ACTIVE_INGREDIENTS_LIST_QUERY,
	GET_DOSE_UNITS_LIST_QUERY,
	GET_MEDICINE_QUERY,
	UPDATE_MEDICINE_MUTATION,
} from "../QuerysDefinitions";

interface ActiveIngredientInput {
	activeIngredientId: number | string;
	doseValue: number | string;
	doseUnitId: number | string;
}

interface EditMedicineFormData {
	medicineId: number;
	name: string;
	idBrand: string;
	categoryId: string;
	administrationRouteId: string;
	description: string;
	ingredients: ActiveIngredientInput[];
}

export default function EditMedicine({
	row,
	onClose,
}: {
	row: any;
	onClose: () => void;
}) {
	const intl = useIntl();
	const medicine = row.original;

	const [formData, setFormData] = React.useState<EditMedicineFormData>({
		medicineId: parseInt(medicine.medicine_id),
		name: medicine.name || "",
		idBrand: String(medicine.brand?.id_brand || ""),
		categoryId: String(medicine.category?.category_id || ""),
		administrationRouteId: String(
			medicine.administration_route?.administration_route_id || "",
		),
		description: medicine.description || "",
		ingredients:
			medicine.medicine_active_ingredients?.map((ing: any) => ({
				activeIngredientId: String(ing.active_ingredient_id),
				doseValue: ing.dose_value,
				doseUnitId: String(ing.dose_unit_id),
			})) || [],
	});

	const { data: brandsData } = useQuery(GET_BRANDS_LIST_QUERY);
	const { data: categoriesData } = useQuery(GET_CATEGORIES_LIST_QUERY);
	const { data: administrationRoutesData } = useQuery(
		GET_ADMINISTRATION_ROUTES_LIST_QUERY,
	);
	const { data: ingredientsData } = useQuery(
		GET_ACTIVE_INGREDIENTS_LIST_QUERY,
	);
	const { data: doseUnitsData } = useQuery(GET_DOSE_UNITS_LIST_QUERY);

	const [updateMedicine, { loading: isSubmitting }] = useMutation(
		UPDATE_MEDICINE_MUTATION,
		{
			refetchQueries: [{ query: GET_MEDICINE_QUERY() }],
		},
	);

	const brandsOptions = React.useMemo(() => {
		if (!brandsData?.brands?.nodes) return [];
		return brandsData.brands.nodes.map((node: any) => ({
			value: String(node.id_brand),
			label: node.name,
		}));
	}, [brandsData]);

	const categoriesOptions = React.useMemo(() => {
		if (!categoriesData?.categories?.nodes) return [];
		return categoriesData.categories.nodes.map((node: any) => ({
			value: String(node.category_id),
			label: node.name,
		}));
	}, [categoriesData]);

	const administrationRoutesOptions = React.useMemo(() => {
		if (!administrationRoutesData?.administrationRoutes?.nodes) return [];
		return administrationRoutesData.administrationRoutes.nodes.map(
			(node: any) => ({
				value: String(node.administration_route_id),
				label: node.name,
			}),
		);
	}, [administrationRoutesData]);

	const ingredientsOptions = React.useMemo(() => {
		if (!ingredientsData?.activeIngredients?.nodes) return [];
		return ingredientsData.activeIngredients.nodes.map((node: any) => ({
			value: String(node.active_ingredient_id),
			label: node.name,
		}));
	}, [ingredientsData]);

	const doseUnitsOptions = React.useMemo(() => {
		if (!doseUnitsData?.doseUnits?.nodes) return [];
		return doseUnitsData.doseUnits.nodes.map((node: any) => ({
			value: String(node.dose_unit_id),
			label: `${node.name} (${node.abbreviation})`,
		}));
	}, [doseUnitsData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (
		field: keyof EditMedicineFormData,
		value: any,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

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
				{ activeIngredientId: "", doseValue: "", doseUnitId: "" },
			],
		}));
	};

	const removeIngredient = (index: number) => {
		const newIngredients = formData.ingredients.filter(
			(_, i) => i !== index,
		);
		setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
	};

	const handleSubmit = async () => {
		const input = {
			medicineId: formData.medicineId,
			name: formData.name,
			idBrand: parseInt(formData.idBrand),
			categoryId: parseInt(formData.categoryId),
			administrationRouteId: parseInt(formData.administrationRouteId),
			description: formData.description,
			ingredients: formData.ingredients.map((ing) => ({
				activeIngredientId: parseInt(String(ing.activeIngredientId)),
				doseValue: parseFloat(String(ing.doseValue)),
				doseUnitId: parseInt(String(ing.doseUnitId)),
			})),
		};

		try {
			const { data } = await updateMedicine({ variables: { input } });
			if (data?.updateMedicine?.result) {
				toast.success(
					data.updateMedicine.message ||
						intl.formatMessage({ id: "medicine.success.update" }),
				);
				onClose();
			} else {
				toast.error(
					data?.updateMedicine?.message ||
						intl.formatMessage({ id: "medicine.error.update" }),
				);
			}
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<Box className="p-6">
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<div className="w-full">
						<Label>
							<FormattedMessage id="name" />
						</Label>
						<Input
							name="name"
							value={formData.name}
							onChange={handleChange}
						/>
					</div>
					<div className="w-full">
						<Label>
							<FormattedMessage id="brands" values={{ count: 1 }} />
						</Label>
						<Select
							options={brandsOptions}
							value={formData.idBrand}
							onChange={(val) => handleSelectChange("idBrand", val)}
						/>
					</div>
				</div>

				<div className="flex flex-row gap-4">
					<div className="w-full">
						<Label>
							<FormattedMessage id="categories" values={{ count: 1 }} />
						</Label>
						<Select
							options={categoriesOptions}
							value={formData.categoryId}
							onChange={(val) => handleSelectChange("categoryId", val)}
						/>
					</div>
					<div className="w-full">
						<Label>
							<FormattedMessage id="administration_routes" values={{ count: 1 }} />
						</Label>
						<Select
							options={administrationRoutesOptions}
							value={formData.administrationRouteId}
							onChange={(val) => handleSelectChange("administrationRouteId", val)}
						/>
					</div>
				</div>

				<div className="w-full">
					<Label>
						<FormattedMessage id="description" />
					</Label>
					<Input
						name="description"
						value={formData.description}
						onChange={handleChange}
					/>
				</div>

				<div className="mt-4">
					<Typography variant="subtitle1" fontWeight="bold" className="mb-2">
						<FormattedMessage id="medicine.section.formula" />
					</Typography>

					{formData.ingredients.map((ingredient, index) => (
						<div key={index} className="flex flex-row gap-3 items-end mb-4">
							<div className="w-full">
								<Label>
									<FormattedMessage id="active_ingredient" />
								</Label>
								<Select
									options={ingredientsOptions}
									value={String(ingredient.activeIngredientId)}
									onChange={(val) =>
										handleIngredientChange(index, "activeIngredientId", val)
									}
								/>
							</div>
							<div className="w-full">
								<Label>
									<FormattedMessage id="dose" />
								</Label>
								<Input
									type="number"
									value={ingredient.doseValue}
									onChange={(e) =>
										handleIngredientChange(index, "doseValue", e.target.value)
									}
								/>
							</div>
							<div className="w-full">
								<Label>
									<FormattedMessage id="unit" />
								</Label>
								<Select
									options={doseUnitsOptions}
									value={String(ingredient.doseUnitId)}
									onChange={(val) =>
										handleIngredientChange(index, "doseUnitId", val)
									}
								/>
							</div>
							<div className="pb-1">
								<button
									type="button"
									onClick={() => removeIngredient(index)}
									className="p-3 text-red-600 border border-red-300 rounded-full bg-red-50"
								>
									<TrashIcon className="size-4" />
								</button>
							</div>
						</div>
					))}

					<button
						type="button"
						onClick={addIngredient}
						className="mt-1 px-4 py-2 text-brand-500 bg-white border border-brand-500 rounded-xl hover:bg-brand-50 transition-colors"
					>
						<FormattedMessage id="medicine.action.add_ingredient" />
					</button>
				</div>

				<div className="flex justify-end gap-2 mt-6">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
					>
						<FormattedMessage id="cancel" />
					</button>
					<button
						type="button"
						disabled={isSubmitting}
						onClick={handleSubmit}
						className="px-4 py-2 text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50"
					>
						{isSubmitting ? (
							<FormattedMessage id="common.sending" />
						) : (
							<FormattedMessage id="common.send_api" />
						)}
					</button>
				</div>
			</div>
		</Box>
	);
}
