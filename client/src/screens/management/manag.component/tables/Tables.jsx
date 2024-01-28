import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';



const Tables = () => {

  const [tableid, settableid] = useState("")
  const [qrimage, setqrimage] = useState("")

  const createQR = async (e) => {
    e.preventDefault();
    const URL = `https://${window.location.hostname}/${tableid}`;
    const qr = await axios.post('https://caviar-api.vercel.app/api/table/qr', { URL });
    // console.log(qr.data);
    setqrimage(qr.data);
  }

  const [listoftable, setlistoftable] = useState([]);
  const [listoftabledescription, setlistoftabledescription] = useState([]);

  const getallTable = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/table');
      const tables = response.data;
      setlistoftable(tables);

      setlistoftabledescription(prevDescription => {
        const descriptions = tables.map(table => table.description);
        return [...prevDescription, ...descriptions];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [tablenum, settablenum] = useState(0);
  const [chairs, setchairs] = useState(0);
  const [sectionNumber, setsectionNumber] = useState();
  const [tabledesc, settabledesc] = useState("");
  const [isValid, setisValid] = useState();

  const createTable = async (e) => {
    e.preventDefault()
    // console.log(tabledesc);
    // console.log(tablenum);
    // console.log(chairs)
    try {
      const response = await axios.post('https://caviar-api.vercel.app/api/table/', { "description": tabledesc, tablenum, chairs, sectionNumber });
      console.log(response.data);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }

  const editTable = async (e) => {
    e.preventDefault()
    // console.log(tabledesc);
    // console.log(tablenum);
    // console.log(chairs)
    try {
      const response = await axios.put(`https://caviar-api.vercel.app/api/table/${tableid}`, { "description": tabledesc, tablenum, chairs, sectionNumber, isValid });
      console.log(response.data);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }



  const deleteTable = async (e) => {
    e.preventDefault()
    // console.log(tableid)
    try {
      const response = await axios.delete(`https://caviar-api.vercel.app/api/table/${tableid}`);
      console.log(response.data);
      settableid(null);
      getallTable();
    } catch (error) {
      console.log(error)
    }
  }

  const [tableFiltered, settableFiltered] = useState([])
  const searchByNum = (num) => {
    const tables = listoftable.filter((table) => table.tablenum.toString().startsWith(num) == true)
    settableFiltered(tables)
  }
  const filterBySection = (description) => {
    const filter = listoftable.filter(table => table.description == description)
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
      for (const Id of selectedIds) {
        await axios.delete(`https://caviar-api.vercel.app/api/order/${Id}`);
      }
      getallTable()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };


  useEffect(() => {
    getallTable()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {

          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الطاولات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addTableModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه طاولة جديدة</span></a>
                        <a href="#deleteListTableModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
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
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>رقم الطاولة</label>
                          <input type="text" class="form-control" onChange={(e) => searchByNum(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الموقع</label>
                          <select class="form-control" onChange={e => filterBySection(e.target.value)}>
                            <option>Any</option>
                            {listoftabledescription && listoftabledescription.map((description, i) =>
                              <option key={i} value={description}>{description}</option>
                            )}
                          </select>
                        </div>
                        <span class="filter-icon"><i class="fa fa-filter"></i></span>
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
                                    <label htmlFor={`checkbox${i}`}></label>                                </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{table.tablenum}</td>
                                <td>{table.description}</td>
                                <td>{table.chairs}</td>
                                <td>{table.sectionNumber}</td>
                                <td>{table.isValid ? 'متاح' : 'غير متاح'}</td>
                                {/* <td>{table.reservation ? "Reserved" : "Unreserved"}</td> */}
                                <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settablenum(table.tablenum) }}>
                                  <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                                </a></td>
                                <td>
                                  <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settablenum(table.tablenum); setchairs(table.chairs); settabledesc(table.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

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
                                  <td>{table.tablenum}</td>
                                  <td>{table.description}</td>
                                  <td>{table.chairs}</td>
                                  <td>{table.sectionNumber}</td>
                                  <td>{table.isValid ? 'متاح' : 'غير متاح'}</td>

                                  {/* <td>{table.reservation ? "Reserved" : "Unreserved"}</td> */}
                                  <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settablenum(table.tablenum) }}>
                                    <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                                  </a></td>
                                  <td>
                                    <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(table._id); settablenum(table.tablenum); setchairs(table.chairs); settabledesc(table.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

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
                        <div className="form-group">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>رقم الطاولة</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tablenum : ""} className="form-control" required onChange={(e) => settablenum(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>عدد المقاعد</label>
                          <input type="Number" className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="ضافه" />
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
                        <div className="form-group">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>رقم الطاولة</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable[listoftable.length - 1].tablenum : ""} className="form-control" required onChange={(e) => settablenum(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>عدد المقاعد</label>
                          <input type="Number" defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id == tableid).chairs : ''} className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea defaultValue={listoftable.length > 0 ? listoftable.find((table, i) => table._id == tableid).description : ""} className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setisValid(e.target.value)}>
                            <option >اختر</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
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
                        <div ref={printtableqr} style={{ width: "100%", maxWidth: '400px', height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="form-group">

                          <div style={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginTop: '10px' }}>

                            <p style={{ width: '100%', height: '40px', textAlign: 'center', fontSize: '26px', fontFamily: 'Noto Nastaliq Urdu , serif' }}>طاولة رقم {tablenum}</p>
                            {qrimage && <a href={qrimage} download>
                              <img src={qrimage} style={{ width: "350px", height: "350px" }} className='qrprint' download />
                            </a>}

                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        {qrimage ? <button type="button" className="btn btn-info" onClick={handlePrint}>طباعه</button>
                          : <input type="submit" className="btn btn-success" value="استخراج" />}
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
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
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
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
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
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