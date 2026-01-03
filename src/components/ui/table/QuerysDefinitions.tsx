export const GET_EMPLOYEES_QUERY = () => {
  return `
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
}

export const GET_BRANDS_QUERY = () => {
  return `
  query GetBrands($first: Int, $after: String, $order: [BrandsSortInput!]) {
    brands(first: $first, after: $after, order: $order) {
    nodes {
        id_brand
        name
        is_active
      }
    pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  `;
}

