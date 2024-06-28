import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';


const Tables = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [tableid, settableid] = useState("")
  const [qrimage, setqrimage] = useState("")
  const [listoftable, setlistoftable] = useState([]);
  const [listoftabledescription, setlistoftabledescription] = useState([]);
  const [tableNumber, settableNumber] = useState(0);
  const [chairs, setchairs] = useState(0);
  const [sectionNumber, setsectionNumber] = useState();
  const [tabledesc, settabledesc] = useState("");
  const [isValid, setisValid] = useState();

// Function to create QR code for the table URL
const createQR = async (e) => {
  try {
    e.preventDefault();
    const token = localStorage.getItem('token_e');

    const URL = `https://${window.location.hostname}/${tableid}`;
    const qr = await axios.post(apiUrl + '/api/table/qr', { URL }, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    setqrimage(qr.data);
    toast.success('تم إنشاء رمز QR بنجاح!');
  } catch (error) {
    console.error("حدث خطأ أثناء إنشاء رمز QR:", error);
    toast.error('حدث خطأ أثناء إنشاء رمز QR!');
  }
}

// Function to create web QR code
const createwebQR = async (e) => {
  try {
    e.preventDefault();
    const token = localStorage.getItem('token_e');
    if (!token) {
      throw new Error("لا يوجد رمز مميز مخزن في localStorage.");
    }
    const URL = `https://${window.location.hostname}/`;
    const qr = await axios.post(apiUrl + '/api/table/qr', { URL }, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    setqrimage(qr.data);
    toast.success('تم إنشاء رمز QR بنجاح!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
  } catch (error) {
    console.error("حدث خطأ أثناء إنشاء رمز QR للويب:", error);
    // عرض رسالة خطأ باستخدام toast
    toast.error('حدث خطأ أثناء إنشاء رمز QR للويب!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000
    });
  }
}

// Function to get all tables
const getAllTable = async () => {
  try {
      const response = await axios.get(apiUrl + '/api/table');
      const tables = response.data;
      setlistoftable(tables);
      const descriptions = tables.map(table => table.description);
      setlistoftabledescription(prevDescription => [...prevDescription, ...descriptions]);
  } catch (error) {
      console.error("Error getting all tables:", error);
  }
};

// Function to create a new table
const createTable = async (e) => {
  try {
      e.preventDefault();
      const token = localStorage.getItem('token_e');

      // Ensure token exists
      if (!token) {
          throw new Error("must login");
      }

      // Prepare table data
      const tableData = {
          description: tabledesc,
          tableNumber,
          chairs,
          sectionNumber,
          isValid
      };

      // Send request to create table
      const response = await axios.post(`${apiUrl}/api/table/`, tableData, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });

      // Check response status
      if (response.status === 200) {
          // Log success message
          console.log("Table created successfully:", response.data);

          // Update table list
          getAllTable();

          // Show success toast
          toast.success("تم إنشاء الطاولة بنجاح.");
      } else {
          // Handle unexpected response
          throw new Error("Unexpected response while creating table.");
      }
  } catch (error) {
      // Log and show error message
      console.error("Error creating table:", error);
      toast.error("حدث خطأ أثناء إنشاء الطاولة. الرجاء المحاولة مرة أخرى.");
  }
}


// Function to edit an existing table
const editTable = async (e) => {
  try {
      e.preventDefault();
      const token = localStorage.getItem('token_e');
      if (!token) {
          throw new Error("No token found in localStorage.");
      }
      const response = await axios.put(`${apiUrl}/api/table/${tableid}`, { "description": tabledesc, tableNumber, chairs, sectionNumber, isValid }, {
          headers: {
              'authorization': `Bearer ${token}`,
          },
      });
      console.log(response.data);
      getAllTable();
  } catch (error) {
      console.error("Error editing table:", error);
  }
}

// Function to delete a table
const deleteTable = async (e) => {
  try {
      e.preventDefault();
      const token = localStorage.getItem('token_e');

      const response = await axios.delete(`${apiUrl}/api/table/${tableid}`, {
        headers: {
            'authorization': `Bearer ${token}`,
        },
    });
      console.log(response.data);
      settableid(null);
      getAllTable();
  } catch (error) {
      console.error("Error deleting table:", error);
  }
}


  const [tableFiltered, settableFiltered] = useState([])
  const searchByNum = (num) => {
    const tables = listoftable.filter((table) => table.tableNumber.toString().startsWith(num) == true)
    settableFiltered(tables)
  }
  const filterByStatus = (Status) => {
    const filter = listoftable.filter(table => table.isValid == Status)
    settableFiltered(filter)
  }

  const printtableqr = useRef()
  const handlePrint = useReactToPrint({
    content: () => printtableqr.current,
    copyStyles: true,
    removeAfterPrint: true,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = (e) => {
    const Id = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedIds([...selectedIds, Id]);
    } else {
      const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
      setSelectedIds(updatedSelectedIds);
    }
  };

  const deleteSelectedIds = async (e) => {
    e.preventDefault();
    console.log(selectedIds)
    try {
      const token = localStorage.getItem('token_e');

      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/table/${Id}`, {
          headers: {
              'authorization': `Bearer ${token}`,
          },
      });
      }
      getAllTable()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };


  useEffect(() => {
    getAllTable()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {

          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الطاولات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#qrwebModal" className="btn btn-47 btn-success" data-toggle="modal"><span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                          <span>انشاء qr للسايت</span></a>
                        <a href="#addTableModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه طاولة جديدة</span></a>
                        <a href="#deleteListTableModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter print-hide">
                    <div class="row text-dark">
                      <div class="col-sm-3">
                        <div class="show-entries">
                          <span>عرض</span>
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                            <option value={35}>35</option>
                            <option value={40}>40</option>
                            <option value={45}>45</option>
                            <option value={50}>50</option>
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>رقم الطاولة</label>
                          <input type="text" class="form-control" onChange={(e) => searchByNum(e.target.value)} />
                        </div>

                        <div className="form-group form-group-47 form-group form-group-47-47">
                          <label>الحالة</label>
                          <select name="category" id="category" form="carform" onChange={(e) => filterByStatus(e.target.value)}>
                            <option >اختر</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th>
                        <th>م</th>
                        <th>رقم الطاولة</th>
                        <th>الوصف</th>
                        <th>عدد المقاعد</th>
                        <th>السكشن</th>
                        <th>متاح</th>
                        {/* <th>الحجز</th> */}
                        <th>QR</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableFiltered.length > 0 ? tableFiltered.map((table, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      id={`checkbox${i}`}
                                      name="options[]"
                                      value={table._id}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`checkbox${i}`}></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{table.tableNumber}</td>
                                <td>{table.description}</td>
                                <td>{table.chairs}</td>
                                <td>{table.sectionNumber}</td>
                                <td>{table.isValid ? 'متاح' : 'غير متاح'}</td>
                                {/* <td>{table.reservation ? "Reserved" : "Unreserved"}</td> */}
                                <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setqrimage('') }}>
                                  <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                                </a></td>
                                <td>
                                  <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setchairs(table.chairs); settabledesc(table.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  <a href="#deleteTableModal" className="delete" data-toggle="modal" onClick={() => settableid(table._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                          : listoftable.map((table, i) => {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  <td>
                                    <span className="custom-checkbox">
                                      <input
                                        type="checkbox"
                                        id={`checkbox${i}`}
                                        name="options[]"
                                        value={table._id}
                                        onChange={handleCheckboxChange}
                                      />
                                      <label htmlFor={`checkbox${i}`}></label>
                                    </span>
                                  </td>
                                  <td>{i + 1}</td>
                                  <td>{table.tableNumber}</td>
                                  <td>{table.description}</td>
                                  <td>{table.chairs}</td>
                                  <td>{table.sectionNumber}</td>
                                  <td>{table.isValid ? 'متاح' : 'غير متاح'}</td>

                                  {/* <td>{table.reservation ? "Reserved" : "Unreserved"}</td> */}
                                  <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setqrimage('') }}>
                                    <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                                  </a></td>
                                  <td>
                                    <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settableNumber(table.tableNumber); setchairs(table.chairs); settabledesc(table.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                    <a href="#deleteTableModal" className="delete" data-toggle="modal" onClick={() => settableid(table._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                  </td>
                                </tr>
                              )
                            }
                          })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listoftable.length > endpagination ? endpagination : listoftable.length}</b> من <b>{listoftable.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              {listoftable && <div id="addTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createTable}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47 ">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>رقم الطاولة</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tableNumber : ""} className="form-control" required onChange={(e) => settableNumber(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>عدد المقاعد</label>
                          <input type="Number" className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>الوصف</label>
                          <textarea className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="ضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>}
              {tableid && <div id="editTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editTable}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47 ">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>رقم الطاولة</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tableNumber : ""} className="form-control" required onChange={(e) => settableNumber(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>عدد المقاعد</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id == tableid).chairs : ''} className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>الوصف</label>
                          <textarea defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id == tableid).description : ""} className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                        </div>
                        <div className="form-group form-group-47 ">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setisValid(e.target.value)}>
                            <option >اختر</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>}

              <div id="qrTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createQR}>
                      <div className="modal-header">
                        <h4 className="modal-title">استخراج QR</h4>
                      </div>
                      <div className="modal-body">
                        <div ref={printtableqr} style={{ width: "100%", maxWidth: '400px', height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="form-group form-group-47 ">

                          <div style={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginTop: '10px' }}>

                            <p style={{ width: '100%', height: '40px', textAlign: 'center', fontSize: '26px', fontFamily: 'Noto Nastaliq Urdu , serif' }}>طاولة رقم {tableNumber}</p>
                            {qrimage && <a href={qrimage} download>
                              <img src={qrimage} style={{ width: "350px", height: "350px" }} className='qrprint' download />
                            </a>}

                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        {qrimage ? <button type="button" className="btn btn-47 btn-info" onClick={handlePrint}>طباعه</button>
                          : <input type="submit" className="btn btn-47 btn-success" value="استخراج" />}
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="qrwebModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createwebQR}>
                      <div className="modal-header">
                        <h4 className="modal-title">استخراج QR</h4>
                      </div>
                      <div className="modal-body">
                        <div ref={printtableqr} style={{ width: "100%", maxWidth: '400px', height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="form-group form-group-47 ">

                          <div style={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginTop: '10px' }}>

                            <p style={{ width: '100%', height: '40px', textAlign: 'center', fontSize: '26px', fontFamily: 'Noto Nastaliq Urdu , serif' }}>CALMA CAFE</p>
                            {qrimage && <a href={qrimage} download>
                              <img src={qrimage} style={{ width: "350px", height: "350px" }} className='qrprint' download />
                            </a>}

                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        {qrimage ? <button type="button" className="btn btn-47 btn-info" onClick={handlePrint}>طباعه</button>
                          : <input type="submit" className="btn btn-47 btn-success" value="استخراج" />}
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteTable}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteListTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSelectedIds}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default Tables