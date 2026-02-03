import { gql } from '@apollo/client';

export const GET_EMPLOYEES_QUERY = () => gql`
  query GetEmployees($first: Int, $after: String, $order: [EmployeeSortInput!]) {
    employees(first: $first, after: $after, order: $order) {
      nodes {
        employeeId
        names
        lastnames
        user
        email
        roleName: employeeRole { name } 
        statusName: employeeStatus { name }
        employeeStatusId
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`


export const GET_BRANDS_QUERY = () => gql `
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


