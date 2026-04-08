import { gql } from "@apollo/client";

export const GET_EMPLOYEES_QUERY = () => gql`
  query GetEmployees(
    $first: Int
    $after: String
    $order: [EmployeeSortInput!]
  ) {
    employees(first: $first, after: $after, order: $order) {
      nodes {
        employeeId
        names
        lastnames
        user
        email
        roleName: employeeRole {
          name
        }
        statusName: employeeStatus {
          name
        }
        employeeStatusId
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_BRANDS_QUERY = () => gql`
  query GetBrands($first: Int, $after: String, $order: [BrandsSortInput!]) {
    brands(first: $first, after: $after, order: $order) {
      nodes {
        id_brand
        name
        logo_url
        contact_phone
        contact_email
        created_at
        updated_at
        is_active
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CATEGORIES_QUERY = () => gql`
  query GetCategories(
    $first: Int
    $after: String
    $order: [CategorySortInput!]
  ) {
    categories(first: $first, after: $after, order: $order) {
      nodes {
        category_id
        name
        description
        is_active
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// NOTA:
// Aunque no se utilice el Id (active_ingredient_id) para mostrarlo en las columnas
// Se debe de añadir por problemas de cache en graphql
export const GET_ACTIVE_INGREDIENTES_QUERY = () => gql`
  query GetActiveIngredients(
    $first: Int
    $after: String
    $order: [ActiveIngredientSortInput!]
  ) {
    activeIngredients(first: $first, after: $after, order: $order) {
      nodes {
        active_ingredient_id
        name
        description
        is_active
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_ADMINISTRATION_ROUTES_QUERY = () => gql`
  query GetAdministrationRoutes(
    $first: Int
    $after: String
    $order: [AdministrationRouteSortInput!]
  ) {
    administrationRoutes(first: $first, after: $after, order: $order) {
      nodes {
        administration_route_id
        name
        description
        is_active
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SUPPLIER_TYPES_QUERY = () => gql`
  query GetSupplierTypes(
    $first: Int
    $after: String
    $order: [SupplierTypeSortInput!]
  ) {
    supplierTypes(first: $first, after: $after, order: $order) {
      nodes {
        supplier_type_id
        type_name
        description
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SUPPLIER_QUERY = () => gql`
  query GetSuppliers(
    $first: Int
    $after: String
    $order: [SupplierSortInput!]
  ) {
    suppliers(first: $first, after: $after, order: $order) {
      nodes {
        supplier_id
        company_name
        tax_id
        contact_name
        phone
        address
        email
        website
        is_active
        type {
          supplier_type_id
          type_name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const GET_MEDICINE_QUERY = () => gql`
query GetMedicineTherapeuticDetails($first: Int, $after: String, $order: [MedicineSortInput!]) {
  medicines(first: $first, after: $after, order: $order) {
    nodes {
      medicine_id
      name
      description
      requires_prescription
      
      # Relación con Ingredientes Activos (Todos los que tenga el ID)
      medicine_active_ingredients {
        dose_value
        dose_unit {
          abbreviation
        }
        active_ingredient {
          name
        }
      }

      # Datos de clasificación
      brand {
        name
      }

      manufacturer {
        name
      }

      category {
        name
      }

      administration_route {
        name
      }

      product {
        product_id
        stock_units
        min_stock_units
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

export const GET_SUPPLIERS_LIST_QUERY = gql`
query GetSuppliersList {
	suppliers {
		nodes {
			supplier_id
			company_name
		}
	}
}
`;

export const GET_PRESENTATION_LIST_QUERY = gql`
query GetPresentations {
	presentations {
		nodes {
			presentation_id
			name
		}
	}
}
`;

export const GET_BRANDS_LIST_QUERY = gql`
query GetBrands {
    brands {
        nodes {
            id_brand
            name
        }
    }
}
`;


export const GET_MANUFACTURERS_LIST_QUERY = gql`
query GetManufacturers  {
    manufacturers {
        nodes {
            manufacturer_id
            name
        }
    }
}
`;

export const GET_CATEGORIES_LIST_QUERY = gql`
query GetCategories  {
    categories {
        nodes {
            category_id
            name
        }
    }
}
`;

export const GET_ADMINISTRATION_ROUTES_LIST_QUERY = gql`
query GetAdministrationRoutes {
  administrationRoutes {
    nodes { 
      administration_route_id
      name
    }
  }
}
`;

export const GET_ACTIVE_INGREDIENTS_LIST_QUERY = gql`
query GetActiveIngredients {
  activeIngredients{
    nodes {
      active_ingredient_id
      name
    }
  }
}
`;

export const GET_DOSE_UNITS_LIST_QUERY = gql`
query GetDoseUnits {
  doseUnits {
    nodes {
      dose_unit_id
      name
      abbreviation
    }
  }
}
`;

export const GET_UNIT_OF_MEASURE_LIST_QUERY = gql`
query GetUnitOfMeasures {
  unitOfMeasures {
    nodes {
      unit_of_measure_id
      name
    }
  }
}
`;


export const GET_BATHCES_BY_PRODUCT_QUERY = () => gql`
query GetBatches(
  $first: Int
  $after: String
  $order: [BatchSortInput!]
  $where: BatchFilterInput
) {
  batches(first: $first, after: $after, order: $order, where: $where) {
    nodes {
      batch_id
      product_id
      batch_code
      expiration_date
      initial_quantity_units
      current_quantity_units
      is_active
      created_at
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;
