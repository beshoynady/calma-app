import React, { useState } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const Info = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: '',
        phone: '',
        whatsapp: '',
        email: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        opening_hours_from: '',
        opening_hours_to: '',
        delivery: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // إرسال البيانات إلى الخادم باستخدام axios
            const response = await axios.post('رابط-الخادم', formData);
            // عرض رسالة نجاح باستخدام react-toastify
            toast.success('تمت إضافة المطعم بنجاح');
            // مسح البيانات المدخلة بعد الإرسال
            setFormData({
                name: '',
                description: '',
                country: '',
                state: '',
                city: '',
                street: '',
                postal_code: '',
                phone: '',
                whatsapp: '',
                email: '',
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: '',
                youtube: '',
                opening_hours_from: '',
                opening_hours_to: '',
                delivery: false
            });
        } catch (error) {
            toast.error('حدث خطأ أثناء إضافة المطعم');
            console.error('Error:', error);
        }
    };

    return (
        <detacontext.Consumer>
            {({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => (
                <div className="container" dir='rtl'>
                    <h1 className="text-center">إضافة مطعم</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">الاسم:</label>
                            <input type="text" className="form-control" id="name" placeholder="ادخل اسم المطعم" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">الوصف:</label>
                            <textarea className="form-control" id="description" rows="3" placeholder="ادخل وصفا للمطعم" required></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="country">البلد:</label>
                                <input type="text" className="form-control" id="country" placeholder="ادخل اسم البلد" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="state">المحافظة:</label>
                                <input type="text" className="form-control" id="state" placeholder="ادخل اسم المحافظة" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="city">المدينة:</label>
                                <input type="text" className="form-control" id="city" placeholder="ادخل اسم المدينة" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="street">الشارع:</label>
                                <input type="text" className="form-control" id="street" placeholder="ادخل اسم الشارع" required />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="postal_code">الرمز البريدي:</label>
                                <input type="text" className="form-control" id="postal_code" placeholder="ادخل الرمز البريدي" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">رقم الهاتف:</label>
                            <input type="text" className="form-control" id="phone" placeholder="ادخل رقم الهاتف" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="whatsapp">واتساب:</label>
                            <input type="text" className="form-control" id="whatsapp" placeholder="ادخل رقم واتساب" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">البريد الإلكتروني:</label>
                            <input type="email" className="form-control" id="email" placeholder="ادخل البريد الإلكتروني" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="facebook">فيسبوك:</label>
                            <input type="text" className="form-control" id="facebook" placeholder="ادخل رابط فيسبوك" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="twitter">تويتر:</label>
                            <input type="text" className="form-control" id="twitter" placeholder="ادخل رابط تويتر" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="instagram">انستجرام:</label>
                            <input type="text" className="form-control" id="instagram" placeholder="ادخل رابط انستجرام" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="linkedin">لينكدإن:</label>
                            <input type="text" className="form-control" id="linkedin" placeholder="ادخل رابط لينكدإن" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="youtube">يوتيوب:</label>
                            <input type="text" className="form-control" id="youtube" placeholder="ادخل رابط يوتيوب" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="opening_hours">ساعات
                                العمل:</label>
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="من" id="opening_hours_from" required />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="إلى" id="opening_hours_to" required />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="delivery">التوصيل متاح؟</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="delivery" />
                                <label className="form-check-label" htmlFor="delivery">
                                    نعم
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">إضافة المطعم</button>
                    </form>
                </div>
            )}
        </detacontext.Consumer>
    )

}

export default Info

