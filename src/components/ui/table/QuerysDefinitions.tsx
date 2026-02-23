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
