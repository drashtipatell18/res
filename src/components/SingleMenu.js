import axios from "axios";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { getMenu } from "../redux/slice/Items.slice";
import { useDispatch } from "react-redux";

export default function SingleMenu({
  image,
  price,
  name,
  code,
  showRetirar,
  onRetirar,
  menuId,
  itemId,
  setMenu,
  obj1,
  setFilteredItems
}) {
  const API = process.env.REACT_APP_IMAGE_URL; // Laravel Image URL
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token] = useState(localStorage.getItem("token"));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const admin_id = localStorage.getItem("admin_id");

  const handleDeleteMenu = () => {
    axios
      .delete(`${apiUrl}/menu/${menuId}/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        maxBodyLength: Infinity
      })
      .then((response) => {
        // Update the menu state directly
        setMenu(prevMenu => {
          const updatedMenu = prevMenu.map(menu => {
            if (menu.id === menuId) {
              // Remove the item with itemId from the menu
              return {
                ...menu,
                items: menu.items.filter(item => item.id !== itemId)
              };
            }
            return menu;
          });
          return updatedMenu;
        });
        setFilteredItems(prevFilteredItems => {
          const updatedFilteredItems = prevFilteredItems.map(menu => {
            if (menu.id === menuId) {
              // Remove the item with itemId from the filtered items
              return {
                ...menu,
                items: menu.items.filter(item => item.id !== itemId)
              };
            }
            return menu;
          });
     
          return updatedFilteredItems;
        });
      })
      .catch((error) => {
   
      });
  };

  const handleRetirarClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteMenu();
    setShowConfirmation(false);
    if (onRetirar) {
      onRetirar();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <div
        className="card text-white position-relative"
        style={{ backgroundColor: "#1F2A37" }}
      >
        {image ? (
          <img
            src={`${API}/images/${image}`}
            className="card-img-top object-fit-cover rounded"
            alt={name}
            style={{ height: "200px", objectFit: "cover" }}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center rounded" style={{ height: "200px", backgroundColor: 'rgb(55 65 81 / 34%)', color: 'white' }}>
            <p>{name}</p>
          </div>
        )}
        <div className="card-body">
          <h6 className="card-title">{name}</h6>
          <h6 className="card-title">$ {price}</h6>
          <p className="card-text opacity-50">Codigo: {code}</p>
        </div>

        {showRetirar && (
          <div
            className="position-absolute end-0"
            onClick={handleRetirarClick}
            style={{ cursor: "pointer" }}
          >
            <div className="bg-danger px-1 m12 rounded m-2 text-white d-flex align-items-center">
              <IoMdClose />  <span style={{ fontSize: "14px" }}>Retirar</span>
            </div>
          </div>
        )}
      </div>

      <Modal
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        backdrop={true}
        keyboard={false}
        className="m_modal jay-modal"
      >
        <Modal.Header closeButton className="border-0" />

        <Modal.Body>
          <div className="text-center">
            <img
              src={require("../Image/trash-outline-secondary.png")}
              alt=" "
            />
            <p className="mb-0 mt-3 h6">
              {" "}
              ¿Estás seguro de que quieres eliminar este menú?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 ">
          <Button
            className="j-tbl-btn-font-1 b_btn_close"
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Si, seguro
          </Button>
          <Button
            className="j-tbl-btn-font-1 "
            variant="secondary"
            onClick={() => handleCancelDelete}
          >
            No, cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
