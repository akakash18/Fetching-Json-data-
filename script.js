// script.js

let originalData;
let currentData;
let currentPage = 1;
const rowsPerPage = 10;

fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((objectData) => {
    originalData = objectData;
    currentData = objectData;
    updateTable(currentData);
    updatePagination();
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });

function updateTable(data) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleData = data.slice(startIndex, endIndex);

  let tableData = "";

  visibleData.forEach((values) => {
    tableData += `
      <tr>
        <th>${values.id}</th>
        <td>${values.name}</td>
        <td>${values.email}</td>
        <td>${values.role}</td>
        <td>
          <button onclick="editFunction(${values.id})" class="btn btn-warning btn-sm">Edit</button>
          <button onclick="deleteFunction(${values.id})" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("table_body").innerHTML = tableData;
}

function searchFunction() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    currentData = originalData.filter((values) => {
      return (
        values.name.toLowerCase().includes(searchInput) ||
        values.email.toLowerCase().includes(searchInput) ||
        values.role.toLowerCase().includes(searchInput)
      );
    });
  
    updateTable(currentData);
  }
  

function updatePagination() {
  const totalRecords = currentData.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById("totalPages").innerText = totalPages;
}

function goToFirstPage() {
  currentPage = 1;
  updateTable(currentData);
  updatePagination();
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    updateTable(currentData);
    updatePagination();
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable(currentData);
    updatePagination();
  }
}

function goToLastPage() {
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  currentPage = totalPages;
  updateTable(currentData);
  updatePagination();
}

function editFunction(id) {
    const recordToEdit = currentData.find((values) => values.id === id);
  
    if (recordToEdit) {
      const newName = prompt("Enter the new name:", recordToEdit.name);
  
      if (newName !== null) {
        recordToEdit.name = newName;
        updateTable(currentData);
      }
    }
  }
  
  function deleteFunction(id) {
    const indexToDelete = currentData.findIndex((values) => values.id === id);
  
    if (indexToDelete !== -1) {
      currentData.splice(indexToDelete, 1);
  
      updateTable(currentData);
    }
  
    console.log(`Delete ID: ${id}`);
  }
  