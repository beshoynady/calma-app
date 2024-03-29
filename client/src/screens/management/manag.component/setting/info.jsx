import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const Info = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];



  const [shifts, setShifts] = useState([]);

  // إضافة وردية جديدة
  const addShift = () => {
    setShifts([...shifts, { shiftType: '', startTime: '', endTime: '' }]);
  };

  // حذف وردية
  const removeShift = (index) => {
    const updatedShifts = shifts.filter((_, i) => i !== index);
    setShifts(updatedShifts);
  };

  // تحديث حقل اسم الوردية
  const handleShiftTypeChange = (index, event) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].shiftType = event.target.value;
    setShifts(updatedShifts);
  };

  // تحديث حقل ميعاد بداية الوردية
  const handleStartTimeChange = (index, event) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].startTime = event.target.value;
    setShifts(updatedShifts);
  };

  // تحديث حقل ميعاد نهاية الوردية
  const handleEndTimeChange = (index, event) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].endTime = event.target.value;
    setShifts(updatedShifts);
  };

  const handleShifts = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { shifts }, config);
      if (response.status === 200) {
        toast.success('تم اضافه الشيفت بنجاح')
      } else {
        toast.error('حدث خطأ اثناء اضافه الشيفتات !اعد المحاوله')

      }
    } catch (error) {
      toast.error('فشل اضافه الشيفتات !اعد المحاوله')
    }
  }
  const handleDeliveryArea = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { delivery_area: areas }, config);
      if (response.status === 200) {
        toast.success('تم اضافه منطقه التوصيل بنجاح')
      } else {
        toast.error('حدث خطأ اثناء اضافه منطقه التوصيل !اعد المحاوله')

      }
    } catch (error) {
      toast.error('فشل اضافه منطقه التوصيل !اعد المحاوله')
    }
  }


  const [areas, setAreas] = useState([]);
  const [nextIndex, setNextIndex] = useState(1);

  const addArea = () => {
    setAreas([...areas, { name: '', delivery_fee: 0 }]);
    setNextIndex(nextIndex + 1);
  };

  const removeArea = (index) => {
    const updatedAreas = areas.filter((area, i) => i !== index);
    setAreas(updatedAreas);
  };

  const handleAreasNameChange = (index, event) => {
    const updatedAreas = [...areas];
    updatedAreas[index].name = event.target.value;
    setAreas(updatedAreas);
  };

  // تحديث حقل تكلفة التوصيل
  const handleDeliveryCostChange = (index, event) => {
    const updatedAreas = [...areas];
    updatedAreas[index].delivery_fee = Number(event.target.value);
    setAreas(updatedAreas);
  };

  const [id, setid] = useState('')

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [phone, setPhone] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');

  const [saturday, setSaturday] = useState({ from: '', to: '', closed: false });
  const [sunday, setSunday] = useState({ from: '', to: '', closed: false });
  const [monday, setMonday] = useState({ from: '', to: '', closed: false });
  const [tuesday, setTuesday] = useState({ from: '', to: '', closed: false });
  const [wednesday, setWednesday] = useState({ from: '', to: '', closed: false });
  const [thursday, setThursday] = useState({ from: '', to: '', closed: false });
  const [friday, setFriday] = useState({ from: '', to: '', closed: false });


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (file && file.size <= maxSize && allowedTypes.includes(file.type)) {
      console.log({file})
      setLogo(file);
      toast.success('تم رفع الصوره بنجاح');
    } else {
      let errorMessage = "Invalid file.";

      if (file && !allowedTypes.includes(file.type)) {
        errorMessage = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
      } else if (file && file.size > maxSize) {

        errorMessage = "Maximum file size exceeded (1 MB). Please select a smaller file.";
      }
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      // تجميع البيانات في كائن العنوان
      const address = {
        country: country? country: null,
        city: city? city: null,
        state: state? state: null,
        street: street? street: null,
        postal_code: postalCode? postalCode: null
      };
      if(id){
        const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { name, description, address, image:logo }, config);
        console.log({response})
      }else{
        // إرسال البيانات إلى الخادم باستخدام axios
        const response = await axios.post(`${apiUrl}/api/restaurant/`, { name, description, address, image:logo }, config);
        console.log({response})
        if (response.status === 201) {
          toast.success('تمت إضافة المطعم بنجاح');
          getRestaurant()
        } else {
          toast.error('حدث خطأ أثناء إضافة المطعم');
        }

      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة المطعم');
      console.error('Error:', error);
    }
  };


  const handleContactData = async (e) => {
    e.preventDefault();
    try {
      const contact = {
        phone: [...phone],
        whatsapp: whatsapp? whatsapp : null,
        email: email? email: null,
        social_media: {
          facebook: facebook? facebook: null,
          instagram: instagram? instagram: null,
          twitter: twitter? twitter: null,
          linkedin: linkedin? linkedin: null,
          youtube: youtube? youtube: null
        }
      };

      console.log({ contact })

      // إرسال البيانات إلى الخادم باستخدام axios
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { contact }, config);
      console.log({ response })

      if (response.status === 200) {
        toast.success('تمت إضافة بيانات التواصل بنجاح');
        getRestaurant()
        
      } else {
        toast.error('فشل إضافة بيانات التواصل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة بيانات التواصل');
      console.error('Error:', error);
    }
  };


  const handleSetFrom = (i, e) => {
    const day = daysOfWeek[i];
    const value = e.target.value;
    switch (day) {
      case 'السبت':
        setSaturday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الأحد':
        setSunday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الاثنين':
        setMonday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الثلاثاء':
        setTuesday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الأربعاء':
        setWednesday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الخميس':
        setThursday(prevState => ({ ...prevState, from: value }));
        break;
      case 'الجمعة':
        setFriday(prevState => ({ ...prevState, from: value }));
        break;
      default:
        break;
    }
  };

  const handleSetTo = (i, e) => {
    const day = daysOfWeek[i];
    const value = e.target.value;
    switch (day) {
      case 'السبت':
        setSaturday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الأحد':
        setSunday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الاثنين':
        setMonday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الثلاثاء':
        setTuesday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الأربعاء':
        setWednesday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الخميس':
        setThursday(prevState => ({ ...prevState, to: value }));
        break;
      case 'الجمعة':
        setFriday(prevState => ({ ...prevState, to: value }));
        break;
      default:
        break;
    }
  };

  const [closedDays, setClosedDays] = useState([]);

  const handleCheckboxChange = (index) => {
    const updatedClosedDays = [...closedDays];
    console.log({ updatedClosedDays })
    updatedClosedDays[index] = !updatedClosedDays[index];
    console.log({ updatedClosedDays })
    setClosedDays(updatedClosedDays);

    const day = daysOfWeek[index];

    switch (day) {
      case 'السبت':
        setSaturday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الأحد':
        setSunday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الاثنين':
        setMonday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الثلاثاء':
        setTuesday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الأربعاء':
        setWednesday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الخميس':
        setThursday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      case 'الجمعة':
        setFriday(prevState => ({ ...prevState, closed: !prevState.closed }));
        break;
      default:
        break;
    }
  };

  const handleOpeningHours = async (e) => {
    e.preventDefault();
    try {
      const opening_hours = {
        Saturday: saturday?saturday:{},
        Sunday: sunday? sunday: {},
        Monday: monday? monday: {},
        Tuesday: tuesday? tuesday: {},
        Wednesday: wednesday? wednesday:{},
        Thursday: thursday? thursday: {},
        Friday: friday? friday: {} 
      }

      console.log({ opening_hours })
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { opening_hours }, config);
      console.log({ response })

      if (response.status === 200) {
        toast.success('تمت إضافة موعيد العمل بنجاح');
        getRestaurant()
      } else {

        toast.error('حدث خطأ اثناءاضفافه موعيد العمل !حاول مره اخري');
      }

    } catch (error) {
      toast.error('فشل اضافه مواعيد العمل !حاول مره اخري')
    }

  }


  const getRestaurant = async () => {
    const restaurant = await axios.get(`${apiUrl}/api/restaurant/`, config)
    const restaurantData = await restaurant.data[0]
    console.log({ restaurantData })
    if(restaurantData){
    const id = await restaurantData._id
    setid(id)
    setName(restaurantData.name)
    setLogo(restaurantData.logo)
    setDescription(restaurantData.description)
    setCountry(restaurantData.address.country)
    setState(restaurantData.address.state)
    setCity(restaurantData.address.city)
    setStreet(restaurantData.address.street)
    setPostalCode(restaurantData.address.postal_code)

    setPhone(restaurantData.contact.phone)
    setWhatsapp(restaurantData.contact.whatsapp)
    setEmail(restaurantData.contact.email)
    setFacebook(restaurantData.contact.social_media.facebook)
    setTwitter(restaurantData.contact.social_media.twitter)
    setInstagram(restaurantData.contact.social_media.instagram)
    setLinkedin(restaurantData.contact.social_media.linkedin)
    setYoutube(restaurantData.contact.social_media.youtube)

    setSaturday(restaurantData.opening_hours.Saturday)
    setSunday(restaurantData.opening_hours.Sunday)
    setMonday(restaurantData.opening_hours.Monday)
    setTuesday(restaurantData.opening_hours.Tuesday)
    setWednesday(restaurantData.opening_hours.Wednesday)
    setThursday(restaurantData.opening_hours.Thursday)
    setFriday(restaurantData.opening_hours.Friday)

    setShifts([...restaurantData.shifts])
    setAreas([...restaurantData.delivery_area])
    }else{
      toast.warning('لم يتم اضافه بيانات المطعم ')
    }
  }


  useEffect(() => {
    getRestaurant()

  }, [])


  return (
    <detacontext.Consumer>
      {({ }) => (
        <div className="container" dir='rtl'>
          <div className="content-wrapper">
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">بيانات المطعم</h4>
                    <form className="form-sample" onSubmit={handleCreateRestaurant}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الاسم</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={name} required onChange={(e) => setName(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الوصف</label>
                            <div className="col-sm-9">
                              <textarea type="text" className="form-control" defaultValue={description} required onChange={(e) => setDescription(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="card-description"> العنوان </p>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الدولة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={country} onChange={(e) => setCountry(e.target.value)} />
                              {/* <select className="form-control">
                                  <option>America</option>
                                  <option>Italy</option>
                                  <option>Russia</option>
                                  <option>Britain</option>
                                </select> */}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المحافظة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={state} required onChange={(e) => setState(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المدينة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={city} required onChange={(e) => setCity(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">العنوان</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={street} required onChange={(e) => setStreet(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">اللوجو</label>
                            <div className="col-sm-9">
                              <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
                              <img src={`${apiUrl}/images/${logo}`} alt="logo" width={50} height={100}/>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">كود البريد</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                      <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 d-flex align-items-stretch grid-margin">
                <div className="row flex-grow">
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">بيانات التواصل</h4>
                        <p className="card-description"> ادخل بيانات التواصل المتاحة لديك </p>
                        <form className="forms-sample" onSubmit={(e) => handleContactData(e)}>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="phone">رقم الهاتف:</label>
                            <input type="text" className="form-control" id="phone" placeholder="ادخل رقم الهاتف" required defaultValue={phone} onChange={(e) => setPhone([e.target.value])} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="whatsapp">واتساب:</label>
                            <input type="text" className="form-control" id="whatsapp" placeholder="ادخل رقم واتساب" required defaultValue={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="email">البريد الإلكتروني:</label>
                            <input type="email" className="form-control" id="email" placeholder="ادخل البريد الإلكتروني" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="facebook">فيسبوك:</label>
                            <input type="text" className="form-control" id="facebook" placeholder="ادخل رابط فيسبوك" defaultValue={facebook} required onChange={(e) => setFacebook(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="twitter">تويتر:</label>
                            <input type="text" className="form-control" id="twitter" placeholder="ادخل رابط تويتر" defaultValue={twitter} onChange={(e) => setTwitter(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="instagram">انستجرام:</label>
                            <input type="text" className="form-control" id="instagram" placeholder="ادخل رابط انستجرام" defaultValue={instagram} onChange={(e) => setInstagram(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="linkedin">لينكدإن:</label>
                            <input type="text" className="form-control" id="linkedin" placeholder="ادخل رابط لينكدإن" defaultValue={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="youtube">يوتيوب:</label>
                            <input type="text" className="form-control" id="youtube" placeholder="ادخل رابط يوتيوب" defaultValue={youtube} onChange={(e) => setYoutube(e.target.value)} />
                          </div>
                          <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                          <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">إضافة بيانات مناطق التوصيل</h4>
                        <p className="card-description">أضف المناطق وتكلفة التوصيل</p>
                        <div className="form-row mb-3">
                          <div className="col">
                            <button type="button" className="btn btn-success btn-block" onClick={addArea} style={{ width: '50%', height: '50px' }}>إضافة منطقة توصيل</button>
                          </div>
                        </div>
                        <form className="forms-sample" onSubmit={(e) => handleDeliveryArea(e)}>
                          {areas.map((area, index) => (
                            <div key={index} className="form-row mb-3 align-items-center">
                              <div className="col">
                                <input type="text" className="form-control" placeholder="اسم المنطقة" defaultValue={area.name} onChange={(e) => handleAreasNameChange(index, e)} />
                              </div>
                              <div className="col">
                                <input type="number" className="form-control" placeholder="تكلفة التوصيل" defaultValue={Number(area.delivery_fee)} onChange={(e) => handleDeliveryCostChange(index, e)} />
                              </div>
                              <div className="col-auto">
                                <button type="button" className="btn btn-danger" onClick={() => removeArea(index)} style={{ height: '50px' }}>
                                  <i className="mdi mdi-delete" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="form-row mt-3">
                            <div className="col">
                              <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تأكيد</button>
                              <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-lg-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">إضافة بيانات الورديات</h4>
                    <p className="card-description">أضف الورديات و وقت الحضور و الانصراف</p>
                    <div className="form-row mb-3">
                      <div className="col">
                        <button type="button" className="btn btn-success btn-block" onClick={addShift} style={{ width: '50%', height: '50px' }}>إضافة وردية</button>
                      </div>
                    </div>
                    <form className="forms-sample">
                      {shifts.map((shift, index) => (
                        <div key={index} className="form-row mb-3 align-items-center">
                          <div className="col">
                            <input type="text" className="form-control" placeholder="اسم الوردية" value={shift.name} onChange={(e) => handleShiftTypeChange(index, e)} />
                          </div>
                          <div className="col">
                            <input type="time" className="form-control" placeholder="ميعاد البدء" value={shift.startTime} onChange={(e) => handlestartTimeChange(index, e)} />
                          </div>
                          <div className="col">
                            <input type="time" className="form-control" placeholder="ميعاد الانتهاء" value={shift.to} onChange={(e) => handleEndTimeChange(index, e)} />
                          </div>
                          <div className="col-auto">
                            <button type="button" className="btn btn-danger" onClick={() => removeShift(index)} style={{ height: '50px' }}>
                              <i className="mdi mdi-delete" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="form-row mt-3">
                        <div className="col">
                          <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تأكيد</button>
                          <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}

              <div className="col-lg-6 d-flex align-items-stretch grid-margin">
                <div className="row flex-grow">
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">مواعيد العمل </h4>
                        <p className="card-description">ادخل مواعيد العمل اليومية </p>
                        <form className="forms-sample" onSubmit={(e) => handleOpeningHours(e)}>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>اليوم</th>
                                <th>وقت الافتتاح</th>
                                <th>وقت الإغلاق</th>
                                <th>مغلق</th>
                              </tr>
                            </thead>
                            <tbody>
                              {daysOfWeek.map((day, index) => (
                                <tr key={index}>
                                  <td>{day}</td>
                                  <td><input type="time" className="form-control"  name={`openingTime${day}`} disabled={closedDays[index]} onChange={(e) => handleSetFrom(index, e)} /></td>
                                  <td><input type="time" className="form-control" name={`closingTime${day}`} disabled={closedDays[index]} onChange={(e) => handleSetTo(index, e)} /></td>
                                  <td><input type="checkbox" className="form-check-input" name={`closed${day}`} onChange={(e) => handleCheckboxChange(index, e)} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-3">
                            <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                            <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                          </div>
                        </form>
                      </div>
                    </div>

                  </div>
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">إضافة بيانات الورديات</h4>
                        <p className="card-description">أضف الورديات و وقت الحضور و الانصراف</p>
                        <div className="form-row mb-3">
                          <div className="col">
                            <button type="button" className="btn btn-success btn-block" onClick={addShift} style={{ width: '50%', height: '50px' }}>إضافة وردية</button>
                          </div>
                        </div>
                        <form className="forms-sample" onSubmit={(e) => handleShifts(e)}>
                          {shifts.map((shift, index) => (
                            <div key={index} className="form-row mb-3 align-items-center">
                              <div className="col">
                                <input type="text" className="form-control" placeholder="اسم الوردية" defaultValue={shift.shiftType} onChange={(e) => handleShiftTypeChange(index, e)} />
                              </div>
                              <div className="col">
                                <input type="time" className="form-control" placeholder="ميعاد البدء" defaultValue={shift.startTime}  onChange={(e) => handleStartTimeChange(index, e)} />
                              </div>
                              <div className="col">
                                <input type="time" className="form-control" placeholder="ميعاد الانتهاء" defaultValue={shift.endTime} onChange={(e) => handleEndTimeChange(index, e)} />
                              </div>
                              <div className="col-auto">
                                <button type="button" className="btn btn-danger" onClick={() => removeShift(index)} style={{ height: '50px' }}>
                                  <i className="mdi mdi-delete" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="form-row mt-3">
                            <div className="col">
                              <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تأكيد</button>
                              <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Colored input groups</h4>
                        <p className="card-description"> Input groups with colors </p>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-info">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-shield-outline text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon1" />
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon2" />
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon3" />
                            <div className="input-group-append bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-primary border-primary">
                              <span className="input-group-text bg-transparent text-white">$</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <div className="input-group-append bg-primary border-primary">
                              <span className="input-group-text bg-transparent text-white">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <div className="col-md-7 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Input size</h4>
                    <p className="card-description"> This is the default bootstrap form layout </p>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Large input</label>
                      <input type="text" className="form-control form-control-lg" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Default input</label>
                      <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Small input</label>
                      <input type="text" className="form-control form-control-sm" placeholder="Username" aria-label="Username" />
                    </div>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">Selectize</h4>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect1">Large select</label>
                      <select className="form-control form-control-lg" id="exampleFormControlSelect1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect2">Default select</label>
                      <select className="form-control" id="exampleFormControlSelect2">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect3">Small select</label>
                      <select className="form-control form-control-sm" id="exampleFormControlSelect3">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Checkbox Controls</h4>
                    <p className="card-description">Checkbox and radio controls</p>
                    <form className="forms-sample">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" /> Default </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" checked /> Checked </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled /> Disabled </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios2" id="optionsRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadio2" id="optionsRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Checkbox Flat Controls</h4>
                    <p className="card-description">Checkbox and radio controls with flat design</p>
                    <form className="forms-sample">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" /> Default </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" checked /> Checked </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled /> Disabled </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios1" id="flatRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios2" id="flatRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios3" id="flatRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios4" id="flatRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}

            </div>
          </div>
          {/* </div> */}
          {/* </div>
    </div> */}
        </div>
      )}
    </detacontext.Consumer>
  )

}

export default Info

