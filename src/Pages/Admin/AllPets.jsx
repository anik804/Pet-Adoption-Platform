import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { usePagination, useSortBy, useTable } from "react-table";

Modal.setAppElement("#root");

function AllPets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`https://pet-adoption-platform-server-side.vercel.app/pets`);
        setPets(res.data.pets || res.data || []);
      } catch {
        setErrorMsg("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleAdopt = async (id) => {
    try {
      await axios.patch(`https://pet-adoption-platform-server-side.vercel.app/pets/${id}`, { adopted: true });
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: true } : pet))
      );
    } catch {
      setErrorMsg("Failed to update adoption status");
    }
  };

  const handleUnadopt = async (id) => {
    try {
      await axios.patch(`https://pet-adoption-platform-server-side.vercel.app/pets/${id}`, { adopted: false });
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: false } : pet))
      );
    } catch {
      setErrorMsg("Failed to update adoption status");
    }
  };

  const handleDelete = async () => {
    if (!petToDelete) return;
    try {
      await axios.delete(`https://pet-adoption-platform-server-side.vercel.app/pets/${petToDelete._id}`);
      setPets((prev) => prev.filter((pet) => pet._id !== petToDelete._id));
      setModalIsOpen(false);
      setPetToDelete(null);
    } catch {
      setErrorMsg("Failed to delete pet");
    }
  };

  const data = useMemo(() => pets, [pets]);

  const columns = useMemo(
    () => [
      {
        Header: "S/N",
        accessor: (_row, i) => i + 1,
        id: "serialNumber",
      },
      {
        Header: "Pet Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Image",
        accessor: "petImage",
        Cell: ({ value }) => (
          <img src={value} alt="pet" className="w-16 h-16 object-cover rounded" />
        ),
      },
      {
        Header: "Status",
        accessor: "adopted",
        Cell: ({ value }) => (value ? "Adopted" : "Not Adopted"),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 text-sm"
              onClick={() => navigate(`/dashboard/update-pet/${row.original._id}`)}
            >
              Update
            </button>
            <button
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm text-white"
              onClick={() => {
                setPetToDelete(row.original);
                setModalIsOpen(true);
              }}
            >
              Delete
            </button>
            {!row.original.adopted ? (
              <button
                className="bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-sm text-white"
                onClick={() => handleAdopt(row.original._id)}
              >
                Mark as Adopted
              </button>
            ) : (
              <button
                className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-700 text-sm text-white"
                onClick={() => handleUnadopt(row.original._id)}
              >
                Mark as Not Adopted
              </button>
            )}
          </div>
        ),
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );

  if (loading) return <p className="text-center p-4 text-lg">Loading pets...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">All Pets</h1>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-[700px] w-full border border-gray-300 text-sm sm:text-base"
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="border px-3 sm:px-4 py-2 text-left cursor-pointer select-none"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No pets found.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.original._id} className="border-t">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="border px-3 sm:px-4 py-2 break-words align-middle"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
        <span className="text-sm">
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white w-[90%] max-w-md mx-auto p-6 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete the pet "{petToDelete?.name}"?</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AllPets;
