import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import { usePagination, useSortBy, useTable } from "react-table";
import useAuth from "../../Hooks/useAuth";

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
        const res = await axios.get(`https://pet-adoption-platform-server-side.vercel.app/pets?userId=${user.uid}`);
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
        Header: "Pet Name",
        accessor: "name",
      },
      {
        Header: "Pet Category",
        accessor: "category",
      },
      {
        Header: "Pet Image",
        accessor: "petImage",
        Cell: ({ value }) => (
          <img src={value} alt="pet" className="w-16 h-16 object-cover rounded" />
        ),
      },
      {
        Header: "Adoption Status",
        accessor: "adopted",
        Cell: ({ value }) => (value ? "Adopted" : "Not Adopted"),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
              <button
                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                onClick={() => navigate(`/dashboard/update-pet/${row.original._id}`)}
              >
                Update
              </button>
            <button
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
              onClick={() => {
                setPetToDelete(row.original);
                setModalIsOpen(true);
              }}
            >
              Delete
            </button>
            {!row.original.adopted && (
              <button
                className="bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                onClick={() => handleAdopt(row.original._id)}
              >
                Adopted
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

  if (!user) {
    return <p>Please log in to view your added pets.</p>;
  }

  if (loading) {
    return <p>Loading pets...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Added Pets</h1>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      <table {...getTableProps()} className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  className="border px-4 py-2 text-left cursor-pointer select-none"
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
            <tr key="no-pets">
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
                      className="border px-4 py-2 align-middle"
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-2 py-1 border rounded mr-2 disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-2 py-1 border rounded mr-2 disabled:opacity-50"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-2 py-1 border rounded mr-2 disabled:opacity-50"
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
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete the pet "{petToDelete?.name}"?</p>
        <div className="mt-6 flex justify-end space-x-4">
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

export default AddedPets;
