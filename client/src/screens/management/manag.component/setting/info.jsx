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




  const [shifts, setShifts] = useState([]);

  const getAllShifts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shift`, config)
      const data = await response.data
      console.log({ data })
      if (data) {
        setShifts(data)
      } else {
        toast.error('لا يوجد بيانات للورديات ! اضف بيانات الورديات ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات الورديات! اعد تحميل الصفحة')
    }
  }

  // إضافة وردية جديدة
  const addShift = () => {
    setShifts([...shifts, { shiftType: '', startTime: '', endTime: '' }]);
    console.log({ shifts });
  };

  // حذف وردية
  const removeShift = async (index, id) => {
    const updatedShifts = shifts.filter((_, i) => i !== index);
    if (id) {
      const response = await axios.delete(`${apiUrl}/api/shift/${id}`, config);
      console.log({ response })
      if (response.status === 200) {
        toast.success('تمت حذف الوردية بنجاح');
      } else {
        toast.error('حدث خطأ أثناء حذف الوردية');
      }

    }
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



  const handleCreateShifts = async (e) => {
    e.preventDefault();
    try {
      shifts.map(async (shift) => {
        const id = shift._id ? shift._id : null;
        const shiftType = shift.shiftType
        const startTime = shift.startTime
        const endTime = shift.endTime
        if (id && shiftType && startTime && endTime) {
          const response = await axios.put(`${apiUrl}/api/shift/${id}`, { startTime, endTime, shiftType }, config);
          console.log({ response })
          if (response.status === 200) {
            toast.success('تمت تعديل بيانات الوردية بنجاح');
          } else {
            toast.error('حدث خطأ أثناء تعديل بيانات الوردية');
          }
        } else if (shiftType && startTime && endTime) {
          const response = await axios.post(`${apiUrl}/api/shift`, { startTime, endTime, shiftType }, config);
          console.log({ response })
          if (response.status === 201) {
            toast.success('تمت إضافة الوردية بنجاح');
          } else {
            toast.error('حدث خطأ أثناء إضافة الوردية');
          }

        }
      })
      getAllShifts()
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الوردية');
      console.error('Error:', error);
    }
  };



  const [areas, setAreas] = useState([]);


  const getAllDeliveryAreas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`, config)
      const data = await response.data
      console.log({ data })
      if (data) {
        setAreas(data)
      } else {
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة')
    }
  }

  const addArea = () => {
    setAreas([...areas, { name: '', delivery_fee: 0 }]);
    console.log({ areas })
  };


  const removeArea = async (index, id) => {
    const updatedAreas = areas.filter((area, i) => i !== index);
    if (id) {
      const response = await axios.delete(`${apiUrl}/api/deliveryarea/${id}`, config);
      console.log({ response })
      if (response.status === 200) {
        toast.success('تمت حذف منطقه التوصيل بنجاح');
      } else {
        toast.error('حدث خطأ أثناء حذف منطقه التوصيل');
      }

    }
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


  const handleDeliveryArea = async (e) => {
    e.preventDefault();
    try {
      areas.map(async (area, i) => {
        console.log({ area })
        const id = area._id ? area._id : null;
        const name = area.name
        const delivery_fee = area.delivery_fee
        if (id && name && delivery_fee) {
          const response = await axios.put(`${apiUrl}/api/deliveryarea/${id}`, { name, delivery_fee }, config);
          console.log({ response })
          if (response.status === 200) {
            toast.success('تمت تعديل بيانات منطقه التوصيل بنجاح');
          } else {
            toast.error('حدث خطأ أثناء تعديل بيانات منطقه التوصيل');
          }
        } else if (name && delivery_fee) {
          const response = await axios.post(`${apiUrl}/api/deliveryarea`, { name, delivery_fee }, config);
          console.log({ response })
          if (response.status === 201) {
            toast.success('تمت إضافة منطقه التوصيل بنجاح');
          } else {
            toast.error('حدث خطأ أثناء إضافة منطقه التوصيل');
          }

        }
      })
      getAllDeliveryAreas()
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة منطقه التوصيل');
      console.error('Error:', error);
    }
  }






  const [id, setid] = useState('')

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setwebsite] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');


  const listFeatures = ['WiFi', 'Parking', 'Outdoor Seating', 'Wheelchair Accessible', 'Live Music', 'Pet Friendly', 'Kids Friendly']
  const listFeaturesAr = ['WiFi', 'موقف سيارات', 'أماكن جلوس خارجية', 'مناسب للكراسي المتحركة', 'موسيقى حية', 'صديق للحيوانات الأليفة', 'ركن للاطفال'];

  const [features, setfeatures] = useState([]);
  const handleFeaturesCheckboxChange = (feature) => {
    console.log({ feature })
    if (features.includes(feature)) {
      setfeatures(features.filter((item) => item !== feature));
    } else {
      setfeatures([...features, feature]);
    }
  };

  const handleFeatures = async (e) => {
    e.preventDefault();
    try {
      console.log({ features })
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { features }, config);
      if (response.status === 200) {
        toast.success('تمت إضافة الخدمات الاضافية بنجاح');
        getRestaurant();
      } else {
        toast.error('حدث خطأ أثناء إضافة الخدمات الاضافية! حاول مرة أخرى.');
      }
    } catch (error) {
      toast.error('فشل إضافة الخدمات الاضافية! حاول مرة أخرى');
    }
  };


  const listAcceptedPayments =['Cash', 'Credit Card', 'Debit Card', 'Vodafone Cash', 'Etisalat Cash', 'Orange Cash', 'Fawry', 'Meeza', 'PayPal', 'Aman']
  const listAcceptedPaymentsAr = ['نقداً', 'بطاقة ائتمان', 'بطاقة خصم مباشر', 'فودافون كاش', 'اتصالات كاش', 'أورنج كاش', 'فوري', 'ميزة', 'باي بال', 'أمان'];

  const [acceptedPayments, setacceptedPayments] = useState([]);
  const handleacceptedPaymentsCheckboxChange = (acceptedPayment) => {
    console.log({ acceptedPayment })
    if (acceptedPayments.includes(acceptedPayment)) {
      setacceptedPayments(acceptedPayments.filter((item) => item !== acceptedPayment));
    } else {
      setacceptedPayments([...acceptedPayments, acceptedPayment]);
    }
  };

  const handleAcceptedPayments = async (e) => {
    e.preventDefault();
    try {
      console.log({ acceptedPayments })
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, {acceptedPayments}, config);
      if (response.status === 200) {
        toast.success('تمت إضافة الخدمات الاضافية بنجاح');
        getRestaurant();
      } else {
        toast.error('حدث خطأ أثناء إضافة الخدمات الاضافية! حاول مرة أخرى.');
      }
    } catch (error) {
      toast.error('فشل إضافة الخدمات الاضافية! حاول مرة أخرى');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (file && file.size <= maxSize && allowedTypes.includes(file.type)) {
      console.log({ file })
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
        country: country ? country : null,
        city: city ? city : null,
        state: state ? state : null,
        street: street ? street : null,
        website: website ? website : null,
        postal_code: postalCode ? postalCode : null
      };
      if (id) {
        const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { name, description, address, website, image: logo }, config);
        console.log({ response })
      } else {
        // إرسال البيانات إلى الخادم باستخدام axios
        const response = await axios.post(`${apiUrl}/api/restaurant/`, { name, description, address, website, image: logo }, config);
        console.log({ response })
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



  const [phone, setPhone] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  // const [social_media, setsocial_media] = useState([{platform:'', url:''}]);
  const [listSocial_media, setlistSocial_media] = useState(['facebook', 'twitter', 'instagram', 'linkedin', 'youtube']);

  const handleContactSocialmedia = async (e) => {
    e.preventDefault();
    try {
      const contact = {
        phone: [...phone],
        whatsapp: whatsapp ? whatsapp : null,
        email: email ? email : null
        
      };
      const social_media= [
        facebook?{platform:'facebook', url: facebook}:'',
        twitter?{platform:'twitter', url: twitter}:'',
        instagram?{platform:'instagram', url: instagram}:'',
        linkedin?{platform:'linkedin', url: linkedin}:'',
        youtube?{platform:'youtube', url: youtube}:'',

      ]

      console.log({ contact, social_media})

      // إرسال البيانات إلى الخادم باستخدام axios
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { contact, social_media }, config);
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


  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const daysOfWeekEn = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const initialOpeningHours = daysOfWeekEn.map(day => ({
    day,
    from: '',
    to: '',
    closed: false
  }));

  const [opening_hours, setOpening_hours] = useState([]);

  const handleSetFrom = (index, value) => {
    console.log({opening_hours})
    const updatedHours = [...opening_hours];
    updatedHours[index].from = value;
    setOpening_hours(updatedHours);
  };

  const handleSetTo = (index, value) => {
    const updatedHours = [...opening_hours];
    updatedHours[index].to = value;
    setOpening_hours(updatedHours);
  };

  const handleCheckboxChange = (index) => {
    const updatedHours = [...opening_hours];
    updatedHours[index].closed = !updatedHours[index].closed;
    setOpening_hours(updatedHours);
  };

  const handleOpeningHours = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/restaurant/${id}`, { opening_hours }, config);
      if (response.status === 200) {
        toast.success('تمت إضافة مواعيد العمل بنجاح');
        getRestaurant();
      } else {
        toast.error('حدث خطأ أثناء إضافة مواعيد العمل! حاول مرة أخرى.');
      }
    } catch (error) {
      toast.error('فشل إضافة مواعيد العمل! حاول مرة أخرى');
    }
  };



  const getRestaurant = async () => {
    const restaurant = await axios.get(`${apiUrl}/api/restaurant/`, config)
    const restaurantData = await restaurant.data[0]
    console.log({ restaurantData })
    if (restaurantData) {
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
      setFacebook(restaurantData.social_media.facebook)
      setTwitter(restaurantData.social_media.twitter)
      setInstagram(restaurantData.social_media.instagram)
      setLinkedin(restaurantData.social_media.linkedin)
      setYoutube(restaurantData.social_media.youtube)
      setOpening_hours(restaurantData.opening_hours.length>0?restaurantData.opening_hours: initialOpeningHours)
    } else {
      toast.warning('لم يتم اضافه بيانات المطعم ')
    }
  }



  useEffect(() => {
    getRestaurant()
    getAllShifts()
    getAllDeliveryAreas()
  }, [])


  return (
    <detacontext.Consumer>
      {({ }) => (
        <div className="container" dir='rtl'>
          <div className="content-wrapper" style={{ height: '20px' }}>
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">بيانات المطعم</h4>
                    <form className="form-sample" onSubmit={handleCreateRestaurant}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الاسم</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={name} required onChange={(e) => setName(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
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
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
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
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المحافظة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={state} required onChange={(e) => setState(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المدينة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={city} required onChange={(e) => setCity(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">العنوان</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={street} required onChange={(e) => setStreet(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">رابط المنيو</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={website} required onChange={(e) => setwebsite(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">كود البريد</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" defaultValue={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 grid-margin stretch-card">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="card-title">Checkbox Flat Controls</h4>
                              <p className="card-description">Checkbox and radio controls with flat design</p>
                              <form className="forms-sample">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                                      <div className="form-check form-check-flat">
                                        <label className="form-check-label">
                                          <input type="checkbox" className="form-check-input" style={{ paddingRight: "20px" }} /> Default </label>
                                      </div>
                                      <div className="form-check form-check-flat">
                                        <label className="form-check-label">
                                          <input type="checkbox" className="form-check-input" style={{ paddingRight: "20px" }} checked /> Checked </label>
                                      </div>
                                      <div className="form-check form-check-flat">
                                        <label className="form-check-label">
                                          <input type="checkbox" className="form-check-input" style={{ paddingRight: "20px" }} disabled /> Disabled </label>
                                      </div>
                                      <div className="form-check form-check-flat">
                                        <label className="form-check-label">
                                          <input type="checkbox" className="form-check-input" style={{ paddingRight: "20px" }} disabled checked /> Disabled checked </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                                      <div className="form-radio form-radio-flat">
                                        <label className="form-check-label">
                                          <input type="radio" className="form-check-input" style={{ paddingRight: "20px" }} name="flatRadios1" id="flatRadios1" value="" checked /> Option one </label>
                                      </div>
                                      <div className="form-radio form-radio-flat">
                                        <label className="form-check-label">
                                          <input type="radio" className="form-check-input" style={{ paddingRight: "20px" }} name="flatRadios2" id="flatRadios2" value="option2" /> Option two </label>
                                      </div>
                                    </div>
                                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                                      <div className="form-radio form-radio-flat disabled">
                                        <label className="form-check-label">
                                          <input type="radio" className="form-check-input" style={{ paddingRight: "20px" }} name="flatRadios3" id="flatRadios3" value="option3" disabled /> Option three is disabled </label>
                                      </div>
                                      <div className="form-radio form-radio-flat disabled">
                                        <label className="form-check-label">
                                          <input type="radio" className="form-check-input" style={{ paddingRight: "20px" }} name="flatRadios4" id="flatRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-lg-6">
                          <div className="form-group form-group-47" style={{ width: '100%', height: '100%' }}>
                            <div className="d-flex flex-column text-right">
                              <div className="form-check" style={{ marginBottom: '10px' }}>
                                <label className="form-check-label" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} style={{ marginRight: '10px' }} /> الصاله
                                </label>
                              </div>
                              <div className="form-check" style={{ marginBottom: '10px' }}>
                                <label className="form-check-label" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} style={{ marginRight: '10px' }} /> حجز الطاولات
                                </label>
                              </div>
                              <div className="form-check" style={{ marginBottom: '10px' }}>
                                <label className="form-check-label" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} style={{ marginRight: '10px' }} /> خدمة التوصيل
                                </label>
                              </div>
                              <div className="form-check">
                                <label className="form-check-label" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} style={{ marginRight: '10px' }} /> خدمة التيك اوي
                                </label>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className="col-lg-6">
                          <div className="form-group form-group-47 row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">اللوجو</label>
                            <div className="col-sm-9">
                              <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
                              <img src={`${apiUrl}/images/${logo}`} alt="logo" width={50} height={100} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-47 btn-success mr-2">تاكيد</button>
                      <button style={{ width: '47%', height: '50px' }} className="btn btn-47 btn-light">إلغاء</button>
                    </form>
                  </div>
                </div>
              </div>


              <div className="container mt-5">
                <div className="row">
                  <div className="col-lg-6 mb-4">
                  <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">وسائل الدفع المقبوله</h4>
                        <p className="card-description">اختر وسائل الدفع المقبوله لدفع فواتير المطعم</p>
                        <form className="forms-sample" onSubmit={handleAcceptedPayments}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group d-flex flex-wrap">
                                {listAcceptedPayments.map((AcceptedPayment, i) => (
                                  <div className="form-check form-check-flat mb-2 mr-4 d-flex align-items-center" key={i} style={{ minWidth: "200px" }}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      value={AcceptedPayment}
                                      checked={acceptedPayments.includes(AcceptedPayment)}
                                      onChange={() => handleacceptedPaymentsCheckboxChange(AcceptedPayment)}
                                    />
                                    <label className="form-check-label mr-4">{listAcceptedPaymentsAr[i]}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btn btn-success" style={{ width: '47%', height: '50px' }}>تاكيد</button>
                            <button type="button" className="btn btn-light" style={{ width: '47%', height: '50px' }}>إلغاء</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">خدمات اضافيه</h4>
                        <p className="card-description">اختر الخدمات المتاحة التي يقدمها المطعم</p>
                        <form className="forms-sample" onSubmit={handleFeatures}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group d-flex flex-wrap">
                                {listFeatures.map((feature, i) => (
                                  <div className="form-check form-check-flat mb-2 mr-4 d-flex align-items-center" key={i} style={{ minWidth: "200px" }}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      value={feature}
                                      checked={features.includes(feature)}
                                      onChange={() => handleFeaturesCheckboxChange(feature)}
                                    />
                                    <label className="form-check-label mr-4">{listFeaturesAr[i]}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btn btn-success" style={{ width: '47%', height: '50px' }}>تاكيد</button>
                            <button type="button" className="btn btn-light" style={{ width: '47%', height: '50px' }}>إلغاء</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* contact  */}
              <div className="col-lg-6 d-flex align-items-stretch grid-margin">
                <div className="row flex-grow">
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">بيانات التواصل</h4>
                        <p className="card-description"> ادخل بيانات التواصل المتاحة لديك </p>
                        <form className="forms-sample" onSubmit={(e) => handleContactSocialmedia(e)}>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="phone">رقم الهاتف:</label>
                            <input type="text" className="form-control" id="phone" placeholder="ادخل رقم الهاتف" required defaultValue={phone} onChange={(e) => setPhone([e.target.value])} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="whatsapp">واتساب:</label>
                            <input type="text" className="form-control" id="whatsapp" placeholder="ادخل رقم واتساب" required defaultValue={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="email">البريد الإلكتروني:</label>
                            <input type="email" className="form-control" id="email" placeholder="ادخل البريد الإلكتروني" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="facebook">فيسبوك:</label>
                            <input type="text" className="form-control" id="facebook" placeholder="ادخل رابط فيسبوك" defaultValue={facebook} required onChange={(e) => setFacebook(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="twitter">تويتر:</label>
                            <input type="text" className="form-control" id="twitter" placeholder="ادخل رابط تويتر" defaultValue={twitter} onChange={(e) => setTwitter(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="instagram">انستجرام:</label>
                            <input type="text" className="form-control" id="instagram" placeholder="ادخل رابط انستجرام" defaultValue={instagram} onChange={(e) => setInstagram(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="linkedin">لينكدإن:</label>
                            <input type="text" className="form-control" id="linkedin" placeholder="ادخل رابط لينكدإن" defaultValue={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>
                            <label htmlFor="youtube">يوتيوب:</label>
                            <input type="text" className="form-control" id="youtube" placeholder="ادخل رابط يوتيوب" defaultValue={youtube} onChange={(e) => setYoutube(e.target.value)} />
                          </div>
                          <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-47 btn-success mr-2">تاكيد</button>
                          <button style={{ width: '47%', height: '50px' }} className="btn btn-47 btn-light">إلغاء</button>
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
                            <button type="button" className="btn btn-47 btn-success btn btn-block" onClick={addArea} style={{ width: '50%', height: '50px' }}>إضافة منطقة توصيل</button>
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
                                <button type="button" className="btn btn-47 btn-danger" onClick={() => removeArea(index, area._id)} style={{ height: '50px' }}>
                                  <i className="mdi mdi-delete" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="form-row mt-3">
                            <div className="col">
                              <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-47 btn-success mr-2">تأكيد</button>
                              <button style={{ width: '47%', height: '50px' }} className="btn btn-47 btn-light">إلغاء</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                                  <td><input type="time" className="form-control" name={`openingTime${day}`} disabled={opening_hours && opening_hours[index]?.closed}
                                  value={opening_hours && opening_hours[index]?.from}
                                  onChange={(e) => handleSetFrom(index, e.target.value)} /></td>

                                  <td><input type="time" className="form-control" name={`closingTime${day}`} disabled={opening_hours && opening_hours[index]?.closed} 
                                  value={opening_hours && opening_hours[index]?.to}
                                  onChange={(e) => handleSetTo(index, e.target.value)} /></td>

                                  <td><input type="checkbox" className="form-check-input" style={{ paddingRight: "20px" }} name={`closed${day}`}
                                  checked={opening_hours[index]?.closed} onChange={(e) => handleCheckboxChange(index)} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-3">
                            <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-47 btn-success mr-2">تاكيد</button>
                            <button style={{ width: '47%', height: '50px' }} className="btn btn-47 btn-light">إلغاء</button>
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
                            <button type="button" className="btn btn-47 btn-success btn btn-block" onClick={addShift} style={{ width: '50%', height: '50px' }}>إضافة وردية</button>
                          </div>
                        </div>
                        <form className="forms-sample" onSubmit={(e) => handleCreateShifts(e)}>
                          {shifts.map((shift, index) => (
                            <div key={index} className="form-row mb-3 align-items-center">
                              <div className="col">
                                <input type="text" className="form-control" placeholder="اسم الوردية" defaultValue={shift.shiftType} onChange={(e) => handleShiftTypeChange(index, e)} />
                              </div>
                              <div className="col">
                                <input type="time" className="form-control" placeholder="ميعاد البدء" defaultValue={shift.startTime} onChange={(e) => handleStartTimeChange(index, e)} />
                              </div>
                              <div className="col">
                                <input type="time" className="form-control" placeholder="ميعاد الانتهاء" defaultValue={shift.endTime} onChange={(e) => handleEndTimeChange(index, e)} />
                              </div>
                              <div className="col-auto">
                                <button type="button" className="btn btn-47 btn-danger" onClick={() => removeShift(index, shift._id)} style={{ height: '50px' }}>
                                  <i className="mdi mdi-delete" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="form-row mt-3">
                            <div className="col">
                              <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-47 btn-success mr-2">تأكيد</button>
                              <button style={{ width: '47%', height: '50px' }} className="btn btn-47 btn-light">إلغاء</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Colored input groups</h4>
                        <p className="card-description"> Input groups with colors </p>
                        <div className="form-group form-group-47" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-info">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-shield-outline text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon1" />
                          </div>
                        </div>
                        <div className="form-group form-group-47" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon2" />
                          </div>
                        </div>
                        <div className="form-group form-group-47" style={{ width: '100%' }}>

                          <div className="input-group">
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon3" />
                            <div className="input-group-append bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group form-group-47" style={{ width: '100%' }}>

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
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                      <label>Large input</label>
                      <input type="text" className="form-control form-control-lg" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                      <label>Default input</label>
                      <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                      <label>Small input</label>
                      <input type="text" className="form-control form-control-sm" placeholder="Username" aria-label="Username" />
                    </div>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">Selectize</h4>
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect1">Large select</label>
                      <select className="form-control form-control-lg" id="exampleFormControlSelect1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect2">Default select</label>
                      <select className="form-control" id="exampleFormControlSelect2">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47" style={{ width: '100%' }}>

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
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} /> Default </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} checked /> Checked </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} disabled /> Disabled </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="optionsRadios" id="optionsRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="optionsRadios" id="optionsRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="optionsRadios2" id="optionsRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="optionsRadio2" id="optionsRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
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
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} /> Default </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} checked /> Checked </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} disabled /> Disabled </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" style={{paddingRight:"20px"}} disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="flatRadios1" id="flatRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="flatRadios2" id="flatRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group form-group-47" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="flatRadios3" id="flatRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" style={{paddingRight:"20px"}} name="flatRadios4" id="flatRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
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

