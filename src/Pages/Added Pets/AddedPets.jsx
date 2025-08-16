import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { usePagination, useSortBy, useTable } from "react-table";
import useAuth from "../../Hooks/useAuth";
import { motion } from "framer-motion"; // add this import


Modal.setAppElement("#root");

function AddedPets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchPets = async () => {
      try {
        const res = await axios.get(
          `https://pet-adoption-platform-server-side.vercel.app/pets?userId=${user.uid}`
        );
        setPets(res.data.pets || []);
      } catch {
        setErrorMsg("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  const data = useMemo(() => pets, [pets]);

  const columns = useMemo(
    () => [
      {
        Header: "S/N",
        accessor: (_row, i) => i + 1,
        id: "serialNumber",
      },
      {
        Header: "Pet",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex items-center gap-3">

            <div>
              <p className="font-semibold text-sm sm:text-xs">
                {row.original.name}
              </p>
              <p className="text-xs text-gray-500">{row.original.category}</p>
            </div>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "adopted",
        Cell: ({ value }) => (
          <span
            className={`px-1.5 py-0.5 sm:px-1 sm:ml-2 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium ${
              value
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {value ? "Adopted" : "Available"}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() =>
                navigate(`/dashboard/update-pet/${row.original._id}`)
              }
            >
              Update
            </button>
            <button
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs md:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                setPetToDelete(row.original);
                setModalIsOpen(true);
              }}
            >
              Delete
            </button>
            {!row.original.adopted && (
              <button
                className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs md:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => handleAdopt(row.original._id)}
              >
                Mark Adopted
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
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    useSortBy,
    usePagination
  );

  const handleDelete = async () => {
    if (!petToDelete) return;
    try {
      await axios.delete(
        `https://pet-adoption-platform-server-side.vercel.app/pets/${petToDelete._id}`
      );
      setPets((prev) => prev.filter((pet) => pet._id !== petToDelete._id));
      setModalIsOpen(false);
      setPetToDelete(null);
    } catch {
      setErrorMsg("Failed to delete pet");
    }
  };

  const handleAdopt = async (id) => {
    try {
      await axios.patch(
        `https://pet-adoption-platform-server-side.vercel.app/pets/${id}`,
        { adopted: true }
      );
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: true } : pet))
      );
    } catch {
      setErrorMsg("Failed to update adoption status");
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-10 text-sm sm:text-base">
        Please log in to view your added pets.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center mt-10 text-sm sm:text-base">Loading pets...</p>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-7xl mx-auto p-3 sm:p-4 w-full">
<motion.h1
  className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <motion.span
    animate={{
      color: ["#1E3A8A", "#059669", "#DC2626", "#D97706", "#7C3AED"],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    My Added Pets
  </motion.span>
</motion.h1>

        {errorMsg && (
          <p className="text-red-600 mb-2 text-sm sm:text-base">{errorMsg}</p>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
          <table
            {...getTableProps()}
            className="min-w-full text-xs sm:text-sm md:text-base"
          >
            <thead className="bg-gray-50 text-gray-700">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold cursor-pointer"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="divide-y divide-gray-200"
            >
              {page.length === 0 ? (
                <tr key="no-pets">
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500 text-sm sm:text-base"
                  >
                    No pets found.
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.original._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-3 sm:px-4 py-2 sm:py-3 align-middle"
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              {"<"}
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-2 py-1 border rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              {">>"}
            </button>
          </div>
          <span className="text-xs sm:text-sm">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-xs sm:text-sm"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white w-[90%] max-w-md mx-auto p-4 sm:p-6 rounded-xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2"
      >
        <h2 className="text-base sm:text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Are you sure you want to delete the pet{" "}
          <span className="font-semibold">{petToDelete?.name}</span>?
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AddedPets;
