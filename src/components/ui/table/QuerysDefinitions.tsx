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

