import { memo } from "react";
import { useIntl } from "react-intl";
import Badge from "../../badge/Badge";
import {
  BeakerIcon,
  ChatBubbleBottomCenterTextIcon,
  BoltIcon,
  ArrowDownCircleIcon,
  CloudIcon,
  FaceSmileIcon,
  HandRaisedIcon,
  EyeIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { Icon } from "@mui/material";

// Esto esta sujeto a cambio
const ADMIN_ROUTE_GROUPS: Record<string, { icon: any }> = {
  // Enterales
  Oral: { icon: BeakerIcon },
  Sublingual: { icon: ChatBubbleBottomCenterTextIcon },

  // Parenterales
  Intravenosa: { icon: BoltIcon },
  Intramuscular: { icon: ArrowDownCircleIcon },

  // Respiratorias
  Inhalación: { icon: CloudIcon },
  Nasal: { icon: FaceSmileIcon },

  // Locales
  Tópica: { icon: HandRaisedIcon },
  Oftálmica: { icon: EyeIcon },
  Ótica: { icon: SpeakerWaveIcon },
};

// NOTA: Posiblemente cambie al poner colores definidos por el usuario
// Si se agregan mas categorias se deben de agregar aqui tambien
const CATEGORY_GROUPS: Record<string, { color: string }> = {
  // 1. Manejo del Dolor e Inflamación (Rojo/Error)
  Antiinflamatorios: { color: "error" },
  Anestésicos: { color: "error" },

  // 2. Infecciones y Defensas (Azul/Info o Primary)
  Analgésicos: { color: "info" },
  Antivirales: { color: "info" },
  Antifúngicos: { color: "info" },
  Vacunas: { color: "info" },

  // 3. Enfermedades Crónicas (Verde/Success)
  Antidiabéticos: { color: "success" },
  Cardiología: { color: "success" },
  Antihipertensivos: { color: "success" },
  Gastrointestinales: { color: "success" },

  // 4. Sistema Nervioso y Salud Mental (Púrpura/Warning o Custom)
  Ansiolíticos: { color: "warning" },
  Antidepresivos: { color: "warning" },
  Anticonvulsivos: { color: "warning" },
  Antihistamínicos: { color: "warning" },

  // 5. Gastrointestinal y Otros (Gris/Default)
  Vitaminas: { color: "default" },
};

const MedicineClasification = memo(({ row }: any) => {
  const intl = useIntl();

  const { category, brand, manufacturer, administration_route } =
    row.original || {};

  const badgeConfig = CATEGORY_GROUPS[category?.name] || { color: "default" };
  const administrationRoute = ADMIN_ROUTE_GROUPS[administration_route?.name] || null;

  return (
    <div className="flex flex-col gap-1 text-sm leading-tight">
      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        {category?.name && (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            <Badge variant={"solid"} color={badgeConfig.color as any}>
              {category.name}
            </Badge>
          </span>
        )}
        {!!administrationRoute && (
           <administrationRoute.icon 
                className="size-4.5 cursor-default" 
                data-tooltip-id="global-tooltip" // <--- Debe coincidir con el ID en App.tsx
                data-tooltip-content={intl.formatMessage({id: "administration_route"}, {qoute: administration_route.name})}
            />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        {brand?.name && <span>{brand.name}</span>}

        {brand?.name && manufacturer?.name && (
          <span className="text-gray-300">|</span>
        )}

        {manufacturer?.name && <span>{manufacturer.name}</span>}
      </div>
    </div>
  );
});

export default MedicineClasification;
