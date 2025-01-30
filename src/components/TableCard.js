import React, { useState, useEffect, useRef } from 'react';

const TableCard = ({ name, id, oId, selectedTabNo, no, tableId, userId, tableColor, selectedCards, getUserName, status, setTableStatus, onShowAvailableModal, handleData, onShowOcupadoModal, isModalOpen, isOffcanvasOpen, setTabledelay, tabledelay,isSelected,role, boxclosed,boxId}) => {
  // const [isSelected, setSelected] = useState(false);
  // const tableRef = useRef(null);
// console.log("isSelected",isSelected,no);

  // useEffect(() => {
  //   const selectedTable = localStorage.getItem('selectedTable');
  //   if (selectedTable == no) {
  //     setSelected(true);
  //   }else{
  //     setSelected(false);
  //   }
  // }, [isOffcanvasOpen]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
      
  //     if (tableRef.current && event.target instanceof Node && !tableRef.current.contains(event.target) && !isOffcanvasOpen) {
  //       setSelected(false);
  //     }
  //     localStorage.removeItem('selectedTable')
  //   }

  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isModalOpen,isOffcanvasOpen]);


  const cardCss = {
    backgroundColor: (selectedCards?.includes(no) && !tabledelay?.includes(no)) ? "#147BDE" :
      (isSelected && isOffcanvasOpen ? "#147BDE" :
        (status === "available" ? "#ebf5ff" : "#374151")),
    color: (selectedCards?.includes(no) && !tabledelay?.includes(no)) ? "#ffffff" :
      (isSelected && isOffcanvasOpen ? "#ffffff" :
        (status === "available" ? "#111928" : "#ffffff")),
    cursor: "pointer",
  };

  

  // const cardCss = {
  //   backgroundColor: (selectedCards === no) ? "#147BDE" : 
  //     (isSelected && isOffcanvasOpen ? "#147BDE" : 
  //     (status === "available" ? "#ebf5ff" : "#374151")),
  //   color: (selectedCards === no) ? "#fff" :
  //     (isSelected && isOffcanvasOpen ? "#fff" : 
  //     (status === "available" ? "#111928" : "#fff")),
  //   cursor: "pointer",
  // };
  const cardBodyStyle = {
    marginTop: status === "available" ? "40px" : "20px",
  };
 

  const handleClick = () => {

    if(role == "admin" || role == "cashier"){
      if (role === "admin" && !boxId) {
        alert("Por favor abra la caja.");
        return;
      }
  
      if (role === "cashier" && boxclosed) {
        alert("Por favor abra la caja.");
        return;
      }
    }
    if (!isSelected) {
      setTableStatus(status);
      // localStorage.setItem('selectedTable', no); 
      if (!selectedCards?.includes(no) ) {
        if (status === 'available') {
          onShowAvailableModal(no);
        } else {
          onShowOcupadoModal(no);
        }
      }
    }
    if (status === "busy" || status === 'available') {
      handleData(id);
    }
  };

  return (
    <div  className="card j_bgblack position-relative" onClick={handleClick} style={cardCss}>
      <div className={`card-body jcard-color`} style={cardBodyStyle}>
        {(status === "busy") ? (
          <>
            <p className='j-tbl-no-text-7 mb-0'>{tableId || no}</p>
            <h5 className="card-text j-tbl-text-8 mb-1">Pedido : {oId}</h5>
            <p className="card-title j-tbl-text-9 mb-0">{getUserName(userId)}</p>
          </>
        ) : (
          <p className='j-tbl-no-text-7 mb-0'>{tableId}</p>
        )}
      </div>
    </div>
  );
};

export default TableCard;