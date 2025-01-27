import React, { forwardRef } from "react";
import PDF417Barcode from "./PDF417Barcode";

const CreditRecipt = forwardRef(({ paymentData, creditData }, ref) => {
  const total = parseFloat(
    creditData?.return_items.reduce(
      (acc, v) => acc + parseFloat(v.quantity) * parseFloat(v.amount),
      0
    )
  );
  const tax = parseFloat(((total * 19) / 100).toFixed(2));
  const totalWithTax = parseFloat((total + tax).toFixed(2));

  const receiptData = {
    storeCenter: "S.I.I. - SANTIAGO CENTRO",
    rut: paymentData.rut,
    date: new Date(creditData.created_at)
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-"),
    time: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    storeInfo: {
      name: "EMPANADAS OLGUITA LIMITADA",
      add: "ELABORACION DE PRODUCTOS DE PANADERIA Y PASTELERIA",
      street: "NUBLE 328, Santiago",
    },
    infomation: {
      name: creditData.name,
      add: paymentData.address,
      firma: paymentData?.ltda || "--"
    },
    subtotal: total,
    tax: tax,
    total: totalWithTax,
  };

  const barcodeData = JSON.stringify({
    code: creditData.code,
    rut: paymentData.rut,
    date: receiptData.date,
    total: receiptData.total,
    items: creditData.return_items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: item.amount,
    })),
  });

  const ReceiptCopy = ({ isCopy }) => (
    <div
      className="j-counter-recipt"
      style={{
        backgroundColor: "transparent",
        width: "100mm",
        alignItems: "center",
        marginBottom: isCopy ? "0" : "50mm",
      }}
    >
      <div
        ref={ref}
        style={{
          fontFamily: "Courier New, monospace",
          width: "100mm",
          margin: "0 auto",
          backgroundColor: "white",
          color: "black",
          padding: "3mm",
          lineHeight: "1.2",
          fontSize: "10pt",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2mm",
            border: "1px solid #000",
            margin: "2mm auto",
            padding: "1mm",
          }}
        >
          <div>R.U.T. : {paymentData.rut}</div>
          <div style={{ fontWeight: "bold" }}>NOTA DE CRÉDITO</div>
          <div>ELECTRÓNICA</div>
          <div>Nº {creditData.code}</div>
        </div>

        {/* Store Information */}
        <div style={{ textAlign: "center", margin: "2mm 0" }}>
          {receiptData.storeCenter}
        </div>
        <div style={{ fontWeight: "bold" }}>{receiptData.storeInfo.name}</div>
        <div>{receiptData.storeInfo.add}</div>
        <div>{receiptData.storeInfo.street}</div>

        {/* Customer Information */}
        <div style={{ margin: "3mm 0" }}>
          <div>Fecha : {receiptData.date}</div>
          <div style={{ fontWeight: "bold" }}>
            {receiptData.infomation.name}
          </div>
          <div>RUT : {paymentData.rut}</div>
          <div>Dirección: {receiptData.infomation.add}</div>
        </div>

        {/* Reference Documents */}
        <div style={{ fontWeight: "bold", margin: "2mm 0" }}>
          Documentos de Referencia
        </div>
        <div style={{ borderTop: "1px solid black" }}>
          <table style={{ width: "100%", fontSize: "9pt" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }} colSpan={2}>
                  Tipo Documento
                </th>
                <td style={{ textAlign: "left" }}>Factura Electrónica</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ textAlign: "left" }}>Folio</th>
                <th style={{ textAlign: "left" }}>Fecha</th>
                <th style={{ textAlign: "left" }}>Razon</th>
              </tr>
              <tr>
                <td style={{  padding : "0px" }}>{creditData.code}</td>
                <td style={{  padding : "0px" }}>{receiptData.date}</td>
                <td style={{ padding : "0px" }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Products Section */}
        <div
          style={{
            margin: "2mm 0",
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            padding: "2mm 0",
          }}
        >
          {creditData?.return_items.map((v, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "1mm 0",
              }}
            >
              <div>
                {v.name}<span style={{ marginLeft: "10px" }}> {v.quantity} x ${v.amount}</span>
              </div>
              <div>${(v.quantity * v.amount).toFixed(2)}</div>
            </div>
          ))}

          {/* Totals */}
          <div
            style={{
              borderTop: "1px dashed black",
              marginTop: "2mm",
              paddingTop: "2mm",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Neto</div>
              <div>${receiptData.subtotal.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Dcto:</div>
              <div>0.00</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>IVA (19%)</div>
              <div>${receiptData.tax.toFixed(2)}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                borderTop: "1px dashed black",
                marginTop: "1mm",
                paddingTop: "1mm",
              }}
            >
              <div>Total</div>
              <div>${receiptData.total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Receipt Copy Section */}
        {isCopy && (
          <div
            style={{
              padding: "2mm 0",
              border: "1px solid black",
              margin: "2mm 0",
            }}
          >
            <div style={{ padding: "1mm" }}>
              <div style={{ marginBottom: "2mm" }}>
                <strong>NOMBRE: {creditData.name}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2mm",
                }}
              >
                <div>
                  <strong>RUT: {receiptData.rut}</strong>
                </div>
                <div>
                  <strong>FECHA: {receiptData.date}</strong>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2mm",
                }}
              >
                <div>
                  <strong>RECINTO:</strong>
                </div>
                <div>
                  <strong>FIRMA: {}</strong>
                </div>
              </div>
              <div
                style={{
                  fontSize: "8pt",
                  textAlign: "justify",
                  lineHeight: "1.2",
                }}
              >
                El acuse de recibo que se declara en este acto, de acuerdo a lo
                dispuesto en la letra b) del Art. 4° y la letra c) del Art. 5°
                de la Ley 19.983, acredita que la entrega de mercadería(s) o
                servicio(s) ha(n) sido recibido(s).
              </div>
            </div>
          </div>
        )}

        {/* Barcode Section */}
        <div style={{ margin: "3mm 0", textAlign: "center" }}>
          <PDF417Barcode data={barcodeData} />
        </div>

        {/* Footer Section */}
        <div
          style={{
            textAlign: "center",
            fontSize: "9pt",
            margin: "2mm 0",
          }}
        >
          <div>Timbre Electrónico SII.</div>
          <div>Res.80 del 2014- Verifique documento: www.sii.cl</div>
          <div style={{ fontWeight: "bold" }}>www.ingefactura.cl</div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="printCredit" style={{ backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <ReceiptCopy isCopy={false} />
      <ReceiptCopy isCopy={true} />
    </div>
  );
});

export default CreditRecipt;
