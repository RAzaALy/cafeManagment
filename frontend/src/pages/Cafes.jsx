import { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EditDelete from "../components/elements/EditDeleteAgGroup";
import SearchInput from "../components/elements/SearchInput";
import Button from "../components/elements/Button";
import AddEditCafe from "../components/AddEditCafe";
import DeleteDialogBox from "../components/elements/Dialog";
import { fetchCafes, addCafe, updateCafe, deleteCafe, fetchCafesByLocation } from "../services/cafeServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {debounce} from "lodash"

const Cafe = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cafeToDelete, setCafeToDelete] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  const queryClient = useQueryClient();

  const { data: cafes, isLoading, error } = useQuery({
    queryKey: ["cafes"],
    queryFn: fetchCafes,
  });


  // Fetch cafes by location (enabled: false for manual triggering)
  const { data: cafesByLocation, isLoading: bylocationLoading, refetch } = useQuery({
    queryKey: ["cafes", { location: searchLocation }], // Include searchLocation in the query key
    queryFn: () => fetchCafesByLocation(searchLocation), // Pass the location to the fetching function
    enabled: false, // Disable automatic fetching
  });

  const handleChange = (e) => {
    const value = e.target.value; // Get the current input value
    setSearchLocation(value); // Update local input state
    setTimeout(() => {
      refetch(); //like this one only runs that time 
    }, 500);
  };



  const addCafeMutation = useMutation({
    mutationFn: addCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(["cafes"]);
    },
    onError: (error) => {
      console.error("Error adding cafe:", error);
    },
  });

  const updateCafeMutation = useMutation({
    mutationFn: ({ id, data }) => updateCafe(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["cafes"]);
    },
    onError: (error) => {
      console.error("Error updating cafe:", error);
    },
  });

  const deleteCafeMutation = useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(["cafes"]);
      setCafeToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting cafe:", error);
    },
  });

  const handleEdit = (cafe) => {
    setSelectedCafe(cafe);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (cafe) => {
    setCafeToDelete(cafe);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    deleteCafeMutation.mutate(cafeToDelete.cafeId);
    setOpenDialog(false);
  };

  const handleSubmitSuccess = (formData, isEditMode) => {
    if (isEditMode) {
      updateCafeMutation.mutate({ id: selectedCafe.cafeId, data: formData });
    } else {
      addCafeMutation.mutate(formData);
    }

    setModalOpen(false);
    setIsEditMode(false);
    setSelectedCafe(null);
  };

  const columnDefs = [
    { field: 'logo', headerName: "", cellRenderer: CustomImageComponent, flex: 1 },
    { field: 'name', flex: 1 },
    { field: 'description', flex: 2 },
    { field: 'employeeCount', headerName: 'Employees', flex: 1 },
    { field: 'location', flex: 2 },
    {
      headerName: "Actions",
      cellRenderer: EditDelete,
      cellClass: "clickable-cell",
      cellRendererParams: {
        editAction: handleEdit,
        deleteAction: handleDelete,
      },
      flex: 1,
    },
  ];

  if (error) return <div>Error: {error.message}</div>;

  const rowData = !searchLocation || bylocationLoading ? cafes || [] : cafesByLocation || [] ;

  return (
    <div style={{ height: 400, width: "96%" }} className="ag-theme-alpine mx-auto">
      <div className="flex justify-between items-center mb-6">
        <SearchInput
          value={searchLocation}
          onChange={handleChange} // Capture the value correctly
          placeholder={"Search by Location"}
        />
        <Button
          text="Add Cafe"
          variant="secondary"
          onClick={() => {
            setIsEditMode(false);
            setSelectedCafe(null);
            setModalOpen(true);
          }}
        />
      </div>

      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        loading={isLoading }
      />

      {modalOpen && (
        <AddEditCafe
          cafeData={selectedCafe}
          isEditMode={isEditMode}
          onSubmitSuccess={handleSubmitSuccess}
          isOpen={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      )}

      {openDialog && (
        <DeleteDialogBox
          open={openDialog}
          setOpen={setOpenDialog}
          title={`Delete Cafe ${cafeToDelete?.name}`}
          message={"Do you really want to delete this cafe?"}
          handleDelete={confirmDelete}
        />
      )}
    </div>
  );
};

const CustomImageComponent = (props) => {
  return <img src={`http://localhost:3001/api/v1/cafe/image/${props.data.logo}`} alt="logo" className="object-contain h-full" />;
};

export default Cafe;
