import React, { useState, useEffect, useRef } from 'react';

const TableCard = ({ name, id, oId, selectedTabNo, no, tableId, userId, tableColor, selectedCards, getUserName, status, setTableStatus, onShowAvailableModal, handleData, onShowOcupadoModal, isModalOpen, isOffcanvasOpen, setTabledelay, tabledelay }) => {
  const [isSelected, setSelected] = useState(false);
  const tableRef = useRef(null);

  // Check local storage for selected table on mount
  useEffect(() => {
    const selectedTable = localStorage.getItem('selectedTable');
    if (selectedTable == no) {
      setSelected(true);
    }else{
      setSelected(false);
    }
  }, [isOffcanvasOpen]);

  // Handle click outside of the card to deselect only if modal is not open
  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log(tableRef.current && event.target instanceof Node && !tableRef.current.contains(event.target) , !isOffcanvasOpen)
      if (tableRef.current && event.target instanceof Node && !tableRef.current.contains(event.target) && !isOffcanvasOpen) {
        setSelected(false);
       
      }
      localStorage.removeItem('selectedTable')
      
      // setTabledelay((prev) => [...prev, tableId]);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen,isOffcanvasOpen]);

  // console.log(no);
  // console.log(tabledelay);


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
  console.log("aaa",isSelected,no);

  const handleClick = () => {
    console.log("aaa",isSelected,no);

    console.log(selectedCards);
    
    
    if (!isSelected) {
      setSelected(true);
      setTableStatus(status);
      localStorage.setItem('selectedTable', no); // Store selected table in local storage
      console.log("bzxcbzxcb");
      
      if (!selectedCards?.includes(no)) {
        if (status === 'available') {
          onShowAvailableModal(no);
        } else {
          onShowOcupadoModal(no);
        }
      }
    }
    if (status === "busy") {
      handleData(id);
    }
    // handleGet(oId);
  };

  // Listen for storage changes to update selection
  useEffect(() => {
    const handleStorageChange = (event) => {
      console.log("bsdbdb");
      console.log(event.key, event.newValue);
      if (event.key === 'selectedTable') {
        setSelected(event.newValue === no);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [no]);

  return (
    <div ref={tableRef} className="card j_bgblack position-relative" onClick={handleClick} style={cardCss}>
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