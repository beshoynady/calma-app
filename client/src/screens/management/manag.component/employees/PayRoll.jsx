import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const PayRoll = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  // Array of months in Arabic
  const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const arryeofmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [thismonth, setthismonth] = useState(new Date().getMonth() + 1)


  // State variables
  const [expenseID, setexpenseID] = useState('658845918881bd1fa6a00407');
  const [rollId, setrollId] = useState('');
  const [cashMovementId, setcashMovementId] = useState('');
  const [dailyexpenseID, setdailyexpenseID] = useState('');
  const [expenseDescription, setexpenseDescription] = useState('');
  const [amount, setamount] = useState();
  const [balance, setbalance] = useState();
  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [paidBy, setpaidBy] = useState('');
  const [employeeId, setemployeeId] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [month, setmonth] = useState('');
  const [notes, setnotes] = useState('');
  const [allExpenses, setallExpenses] = useState([]);
  const [AllcashRegisters, setAllcashRegisters] = useState([]);

  // Fetch employees data from the API
  const [ListOfEmployee, setListOfEmployee] = useState([])
  const getEmployees = async () => {
    try {

      const response = await axios.get(apiUrl + '/api/employee', config);
      setListOfEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  const [allPayRoll, setallPayRoll] = useState([])
  const [currentPayRoll, setcurrentPayRoll] = useState([])

  const getPayRoll = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/payroll', config);
      console.log({ response })
      if (response.status === 200) {
        // Set all payroll data
        setallPayRoll(response.data);

        // Get current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Filter salaries for the current year and month
        const filteredSalaries = response.data.filter((salary) => {
          return salary.Year === currentYear && salary.Month === currentMonth;
        });

        // Set current payroll data
        setcurrentPayRoll(filteredSalaries);
      }
    } catch (error) {
      // Handle error
      console.error('Error fetching payroll:', error);
      // Display toast error message
      toast.error('حدث خطأ أثناء جلب بيانات الرواتب');
    }
  };





  // Fetch salary movement data from the API
  const [ListOfEmployeTransactions, setListOfEmployeTransactions] = useState([]);

  const getEmployeTransactions = async () => {
    try {

      const response = await axios.get(apiUrl + '/api/employeetransactions', config);

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const filterByMonth = response.data.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getMonth() + 1 === currentMonth && createdAt.getFullYear() === currentYear;
      });

      setListOfEmployeTransactions(filterByMonth);
    } catch (error) {
      console.log(error);
    }
  };

  const [allAttendanceRecords, setallAttendanceRecords] = useState([])
  const getallAttendanceRecords = async () => {
    // if (permissionsForAttendance && permissionsForAttendance.read === false) {
    //   toast.info('ليس لك صلاحية لعرض السجلات')
    //   return
    // }
    try {
      const response = await axios.get(`${apiUrl}/api/attendance`, config);
      console.log({ response })
      if (response.status === 200) {
        const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const filterByMonth = response.data.filter((record) => {
        const createdAt = new Date(record.createdAt);
        return createdAt.getMonth() + 1 === currentMonth && createdAt.getFullYear() === currentYear;
      });
        setallAttendanceRecords(response.data)
      }
    } catch (error) {
      toast.error('حدث خطاء اثناء جلب سجل الحضور و الانصراف ! اعد تحميل الصفحة')
    }
  }



  // const addPayRoll = async () => {
  //   for (let i = 0; i < ListOfEmployee.length; i++) {
  //     let Year = new Date().getFullYear()
  //     let Month = new Date().getMonth() + 1
  //     let employeeId = ListOfEmployee[i]._id;
  //     let employeeName = ListOfEmployee[i].fullname;
  //     let basicSalary = ListOfEmployee[i].basicSalary;
  //     let workingDays = ListOfEmployee[i].workingDays;
  //     let dailySalary = basicSalary / workingDays;
  //     let salary = dailySalary * attendanceDays;
  //     let Bonus = 0;
  //     let attendanceDays = 0;
  //     let OvertimeDays = 0;
  //     let OvertimeValue = 0;
  //     let totalDue = 0;
  //     let AbsenceDays = 0;
  //     let AbsenceDeduction = 0;
  //     let Deduction = 0;
  //     let Predecessor = 0;
  //     let insuranceRate = ListOfEmployee[i].insuranceRate
  //     let insurance = ListOfEmployee[i].insuranceRate * salary;
  //     let taxRate = ListOfEmployee[i].taxRate;
  //     let taxableIncome = totalDue - insurance;


  //     let Tax = taxableIncome * salary

  //     let TotalDeductible = 0;
  //     let NetSalary = 0;
  //     let isPaid = false;
  //     let paidBy = null;

  //     const EmployeTransactions = ListOfEmployeTransactions.length > 0 ? 
  //     ListOfEmployeTransactions.filter((Transaction) => Transaction.employeeId._id === employeeId) : '';
  //     const EmployeAttendanceRecords = allAttendanceRecords.length > 0 ? 
  //     allAttendanceRecords.filter((Record) => Record.employee._id === employeeId) : '';

  //     console.log({ EmployeTransactions: EmployeTransactions })

  //     if (EmployeTransactions.length > 0) {

  //       const filterPre = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'سلف')
  //       if (filterPre.length > 0) {
  //         Predecessor = filterPre[filterPre.length - 1].newAmount
  //         console.log({ Predecessor })
  //       } else {
  //         Predecessor = 0
  //       }

  //       const filterDed = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'خصم')
  //       console.log(filterDed)
  //       if (filterDed.length > 0) {
  //         Deduction = filterDed[filterDed.length - 1].newAmount
  //         console.log({ Deduction })
  //       } else {
  //         Deduction = 0
  //       }

  //       const filterBon = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'مكافأة')
  //       if (filterBon.length > 0) {
  //         Bonus = filterBon[filterBon.length - 1].newAmount
  //       } else {
  //         Bonus = 0

  //       }



  //       const filterAbsenceRecords = EmployeAttendanceRecords.filter((Record) => Record.status == 'Absence')
  //         AbsenceDeduction = 
  //         AbsenceDays = filterAbsenceRecords.length
  //       const filterAdd = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'اضافي')
  //       if (filterAdd.length > 0) {
  //         OvertimeDays = filterAdd[filterAdd.length - 1].totalDays
  //         OvertimeValue = filterAdd[filterAdd.length - 1].newAmount
  //       } else {
  //         OvertimeDays = 0
  //         OvertimeValue = 0
  //       }
  //       totalDue = salary + Bonus + OvertimeValue
  //       TotalDeductible = AbsenceDeduction + Deduction + Predecessor
  //       // insurance = totalDue * .10
  //       // Tax = totalDue * 0.15
  //       NetSalary = totalDue - TotalDeductible - insurance - Tax

  //       const isSalary = currentPayRoll.find((roll) => roll.employeeId._id === employeeId)
  //       const isSalaryPaid = currentPayRoll ? currentPayRoll.find((roll) => roll.employeeId._id == employeeId && roll.isPaid == true) : false

  //       console.log({ isSalary, isSalaryPaid })

  //       if (isSalary && !isSalaryPaid) {
  //         const result = await axios.put(`${apiUrl}/api/payroll/employee/${employeeId}`, {
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           attendanceDays,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log({ result })
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()
  //         }
  //       } else if (!isSalary && !isSalaryPaid) {
  //         const result = await axios.post(`${apiUrl}/api/payroll`, {
  //           employeeId,
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           attendanceDays,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log({ result })
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()

  //         }
  //       }
  //     } else {
  //       totalDue = salary + Bonus + OvertimeValue
  //       TotalDeductible = AbsenceDeduction + Deduction + Predecessor
  //       // insurance = totalDue * .10
  //       // Tax = totalDue * 0.15

  //       NetSalary = totalDue - TotalDeductible - insurance - Tax

  //       const isSalary = currentPayRoll.find((roll) => roll.employeeId._id == employeeId)
  //       const isSalaryPaid = currentPayRoll.find((roll) => roll.isPaid == true)

  //       if (isSalary && !isSalaryPaid) {
  //         const result = await axios.put(`${apiUrl}/api/payroll/employee/${employeeId}`, {
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           attendanceDays,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log(result)
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()

  //         }
  //       } else if (!isSalary && !isSalaryPaid) {
  //         const result = await axios.post(`${apiUrl}/api/payroll`, {
  //           employeeId,
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           attendanceDays,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log(result)
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()

  //         }
  //       }
  //     }

  //   }
  // }


  // const addPayRoll = async () => {
  //   for (let i = 0; i < ListOfEmployee.length; i++) {
  //     let Year = new Date().getFullYear()
  //     let Month = new Date().getMonth() + 1
  //     let employeeId = ListOfEmployee[i]._id;
  //     let employeeName = ListOfEmployee[i].fullname;
  //     let shiftHour = ListOfEmployee[i].shift?.hours
  //     let basicSalary = ListOfEmployee[i].basicSalary;
  //     let workingDays = ListOfEmployee[i].workingDays;
  //     let dailySalary = basicSalary / workingDays;
  //     let salary = 0;
  //     let Bonus = 0;
  //     let attendanceDays = 0;
  //     let leaveDays = 0;
  //     let OvertimeDays = 0;
  //     let OvertimeValue = 0;
  //     let totalDue = 0;
  //     let AbsenceDays = 0;
  //     let AbsenceDeduction = 0;
  //     let lateDays = 0;
  //     let lateDeduction = 0;
  //     let Deduction = 0;
  //     let Predecessor = 0;
  //     let insuranceRate = ListOfEmployee[i].insuranceRate
  //     let insurance = 0;
  //     let taxRate = ListOfEmployee[i].taxRate;

  //     let Tax = 0

  //     let TotalDeductible = 0;
  //     let NetSalary = 0;
  //     let isPaid = false;
  //     let paidBy = null;

  //     const EmployeTransactions = ListOfEmployeTransactions.length > 0 ? 
  //     ListOfEmployeTransactions.filter((Transaction) => Transaction.employeeId._id === employeeId) : '';
  //     const EmployeAttendanceRecords = allAttendanceRecords.length > 0 ? 
  //     allAttendanceRecords.filter((Record) => Record.employee._id === employeeId) : '';

  //     console.log({ EmployeTransactions: EmployeTransactions })

  //       const filterPre = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'سلف')
  //       if (filterPre.length > 0) {
  //         Predecessor = filterPre[filterPre.length - 1].newAmount
  //         console.log({ Predecessor })
  //       } else {
  //         Predecessor = 0
  //       }

  //       const filterDed = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'خصم')
  //       console.log(filterDed)
  //       if (filterDed.length > 0) {
  //         Deduction = filterDed[filterDed.length - 1].newAmount
  //         console.log({ Deduction })
  //       } else {
  //         Deduction = 0
  //       }

  //       const filterBon = EmployeTransactions.filter((Transaction) => Transaction.transactionType == 'مكافأة')
  //       if (filterBon.length > 0) {
  //         Bonus = filterBon[filterBon.length - 1].newAmount
  //       } else {
  //         Bonus = 0

  //       }



        
  //       const filterAttendanceRecords = EmployeAttendanceRecords.filter((Record) => Record.status == 'Attendance')
  //       attendanceDays = filterAttendanceRecords.length
  //       filterAttendanceRecords.map(record=>{
  //         OvertimeDays += record.overtimeMinutes / shiftHour
  //         lateDays += record.lateMinutes / shiftHour
  //       })
        
  //       const filterAbsenceRecords = EmployeAttendanceRecords.filter((Record) => Record.status == 'Absence')
  //       AbsenceDays = filterAbsenceRecords.length
  //       AbsenceDeduction = dailySalary * AbsenceDays
        
  //       const filterVacationRecords = EmployeAttendanceRecords.filter((Record) => Record.status == 'Vacation')
  //       leaveDays = filterVacationRecords.length
        



  //       OvertimeValue = OvertimeDays * dailySalary
  //       lateDeduction= lateDays * dailySalary

  //       salary = dailySalary * attendanceDays

  //       insurance = insuranceRate * salary;

  //       totalDue = salary + Bonus + OvertimeValue

  //       let taxableIncome = totalDue - insurance;
      
  //       Tax = taxableIncome * taxRate
        
  //       TotalDeductible = AbsenceDeduction + lateDeduction + Deduction + Predecessor + Tax + insurance
  //       // insurance = totalDue * .10
  //       // Tax = totalDue * 0.15
  //       NetSalary = totalDue - TotalDeductible

  //       const isSalary = currentPayRoll.find((roll) => roll.employeeId._id === employeeId)
  //       const isSalaryPaid = currentPayRoll ? currentPayRoll.find((roll) => roll.employeeId._id == employeeId && roll.isPaid == true) : false

  //       console.log({ isSalary, isSalaryPaid })

  //       if (isSalary && !isSalaryPaid) {
  //         const result = await axios.put(`${apiUrl}/api/payroll/employee/${employeeId}`, {
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           attendanceDays,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log({ result })
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()
  //         }
  //       } else if (!isSalary && !isSalaryPaid) {
  //         const result = await axios.post(`${apiUrl}/api/payroll`, {
  //           employeeId,
  //           employeeName,
  //           Year,
  //           Month,
  //           salary,
  //           Bonus,
  //           totalDue,
  //           attendanceDays,
  //           AbsenceDays,
  //           AbsenceDeduction,
  //           OvertimeDays,
  //           OvertimeValue,
  //           Deduction,
  //           Predecessor,
  //           insurance,
  //           Tax,
  //           TotalDeductible,
  //           NetSalary
  //         }, config)
  //         console.log({ result })
  //         if (result) {
  //           getPayRoll()
  //           getEmployees()

  //         }
      
  //     }

  //   }
  // }


  const addPayRoll = async () => {
    try {
      toast.warn('انتظر قليلا .. لا تقم باعادة التحميل و غلق الصفحة')
      for (let i = 0; i < ListOfEmployee.length; i++) {
        let Year = new Date().getFullYear();
        let Month = new Date().getMonth() + 1;
        let employeeId = ListOfEmployee[i]._id;
        let employeeName = ListOfEmployee[i].fullname;
        let shiftHour = ListOfEmployee[i].shift?.hours;
        let basicSalary = ListOfEmployee[i].basicSalary;
        let workingDays = ListOfEmployee[i].workingDays;
        let dailySalary = basicSalary / workingDays;
        let salary = 0;
        let attendanceDays = 0;
        let leaveDays = 0;
        let OvertimeDays = 0;
        let OvertimeValue = 0;
        let Bonus = 0;
        let TotalDue = 0;
        let AbsenceDays = 0;
        let AbsenceDeduction = 0;
        let lateDays = 0;
        let lateDeduction = 0;
        let Deduction = 0;
        let Predecessor = 0;
        let insuranceRate = ListOfEmployee[i].insuranceRate;
        let insurance = 0;
        let taxRate = ListOfEmployee[i].taxRate;
        let Tax = 0;
        let TotalDeductible = 0;
        let NetSalary = 0;
        let isPaid = false;
        let paidBy = null;
  
        const EmployeTransactions = ListOfEmployeTransactions.length > 0 ?
          ListOfEmployeTransactions.filter((Transaction) => Transaction.employeeId._id === employeeId) : [];
        const EmployeAttendanceRecords = allAttendanceRecords.length > 0 ?
          allAttendanceRecords.filter((Record) => Record.employee._id === employeeId) : [];
  
        const filterPre = EmployeTransactions.filter((Transaction) => Transaction.transactionType === 'سلف');
        Predecessor = filterPre.length > 0 ? filterPre[filterPre.length - 1].newAmount : 0;
  
        const filterDed = EmployeTransactions.filter((Transaction) => Transaction.transactionType === 'خصم');
        Deduction = filterDed.length > 0 ? filterDed[filterDed.length - 1].newAmount : 0;
  
        const filterBon = EmployeTransactions.filter((Transaction) => Transaction.transactionType === 'مكافأة');
        Bonus = filterBon.length > 0 ? filterBon[filterBon.length - 1].newAmount : 0;
  
        const filterAttendanceRecords = EmployeAttendanceRecords.filter((Record) => Record.status === 'Attendance');
        attendanceDays = filterAttendanceRecords.length;
        filterAttendanceRecords.forEach(record => {
          OvertimeDays += record.overtimeMinutes / 60 / shiftHour; // تحويل الدقائق إلى ساعات
          lateDays += record.lateMinutes / 60 / shiftHour; // تحويل الدقائق إلى ساعات
        });
  
        const filterAbsenceRecords = EmployeAttendanceRecords.filter((Record) => Record.status === 'Absence');
        AbsenceDays = filterAbsenceRecords.length;
        AbsenceDeduction = dailySalary * AbsenceDays;
  
        OvertimeValue = OvertimeDays * dailySalary;
        lateDeduction = lateDays * dailySalary;
  
        salary = dailySalary * attendanceDays;
  
        insurance = insuranceRate * salary;
  
        TotalDue = salary + Bonus + OvertimeValue;
  
        let taxableIncome = TotalDue - insurance;
  
        Tax = taxableIncome * taxRate;
  
        TotalDeductible = AbsenceDeduction + lateDeduction + Deduction + Predecessor + Tax + insurance;
  
        NetSalary = TotalDue - TotalDeductible;
  
        const isSalary = currentPayRoll.find((roll) => roll.employeeId._id === employeeId);
        const isSalaryPaid = currentPayRoll ? currentPayRoll.find((roll) => roll.employeeId._id === employeeId && roll.isPaid === true) : false;
  
        if (isSalary && !isSalaryPaid) {
          try {
            const result = await axios.put(`${apiUrl}/api/payroll/employee/${employeeId}`, {
              employeeName,
              Year,
              Month,
              employeeId,
              employeeName,
              shiftHour,
              basicSalary,
              workingDays,
              salary,
              attendanceDays,
              leaveDays,
              OvertimeDays,
              OvertimeValue,
              Bonus,
              TotalDue,
              AbsenceDays,
              AbsenceDeduction,
              lateDays,
              lateDeduction,
              Deduction,
              Predecessor,
              insurance,
              Tax,
              TotalDeductible,
              NetSalary,
              isPaid,
              paidBy
            }, config);
  
            if (result) {
              console.log('تم تحديث بيانات المرتب بنجاح');
              toast.info(`تم تحديث بيانات مرتب ${employeeName} بنجاح`);
              // يمكنك استخدام toast أو أي رسائل توضح نجاح التحديث هنا
            }
          } catch (error) {
            console.error('خطأ في تحديث بيانات المرتب:', error);
            toast.error('حدث خطأ أثناء تحديث بيانات المرتب');
          }
          toast.success('تم تحديث بيانات المرتب بنجاح');
          getPayRoll();
          getEmployees();

        } else if (!isSalary && !isSalaryPaid) {
          try {
            const result = await axios.post(`${apiUrl}/api/payroll`, {
              employeeId,
              employeeName,
              Year,
              Month,
              shiftHour,
              basicSalary,
              workingDays,
              salary,
              attendanceDays,
              leaveDays,
              OvertimeDays,
              OvertimeValue,
              Bonus,
              TotalDue,
              AbsenceDays,
              AbsenceDeduction,
              lateDays,
              lateDeduction,
              Deduction,
              Predecessor,
              insurance,
              Tax,
              TotalDeductible,
              NetSalary,
              isPaid,
              paidBy
            }, config);
  
            if (result) {
              console.log('تم إنشاء بيانات المرتب بنجاح');
              toast.info(` تم انشاء مرتب ${employeeName} بنجاح`);
            }
          } catch (error) {
            console.error('خطأ في إنشاء بيانات المرتب:', error);
            toast.error('حدث خطأ أثناء إنشاء بيانات المرتب');
          }
          toast.success('تم إنشاء بيانات المرتب بنجاح');
          getPayRoll();
          getEmployees();
        }
      }
      
    } catch (error) {
      console.error('خطأ عام في معالجة بيانات المرتب:', error);
      toast.error('حدث خطأ عام أثناء معالجة بيانات المرتب');
    }
  };
  




  const handelPaid = async (rollid, salary, manager, employee, name, paidMonth) => {
    try {
      console.log(manager)

      // Fetch all cash registers
      const response = await axios.get(apiUrl + '/api/cashRegister', config);
      const allCashRegisters = await response.data;
      console.log(response)
      console.log(allCashRegisters)
      // // Find the appropriate cash register
      const cashRegister = allCashRegisters ? allCashRegisters.filter(cash => cash.employee === manager) : [];
      console.log(cashRegister)
      // // Update selected cash register data
      setcashRegister(cashRegister[0]._id);
      console.log(cashRegister[0]._id)
      setcashRegistername(cashRegister.name);
      setbalance(cashRegister[0].balance);
      // Set values and variables
      setamount(salary);
      setpaidBy(manager);
      setrollId(rollid);
      setemployeeId(employee);
      setmonth(paidMonth);
      setemployeeName(name);
      // Update expense description
      setexpenseDescription(`دفع راتب ${name} بمبلغ ${salary} لشهر ${paidMonth}`);
      // Update notes
      setnotes(`دفع راتب ${name} لشهر ${paidMonth}`);
    } catch (error) {
      // Handle errors and display an appropriate error message to the user
      console.error(error);
      toast.error('An issue occurred while processing salaries. Please try again.');
    }
  };



  // // Fetch all cash registers from the API
  // const getAllcashRegisters = async () => {
  //   try {
  //     const response = await axios.get(apiUrl+'/api/cashRegister');
  //     setAllcashRegisters(response.data);
  //   } catch (err) {
  //     toast.error('Error fetching cash registers');
  //   }
  // };

  // const handlecashRegister = (id) => {
  //   const cashRegister = AllcashRegisters ? AllcashRegisters.find((cash) => cash.employee === id) : {};
  //   setcashRegister(cashRegister._id);
  //   setcashRegistername(cashRegister.name);
  //   setbalance(cashRegister.balance);
  //   // setpaidBy(id);
  // };

  // Create daily expense based on selected cash register
  const createDailyExpense = async () => {
    console.log({ balance })
    console.log({ amount })
    const updatedBalance = balance - amount;
    console.log({ updatedBalance })

    try {

      const cashMovement = await axios.post(apiUrl + '/api/cashMovement/', {
        registerId: cashRegister,
        createdBy: paidBy,
        amount,
        type: 'Withdraw',
        description: expenseDescription,
      }, config);

      const cashMovementId = cashMovement.data.cashMovement._id;

      const dailyExpense = await axios.post(apiUrl + '/api/dailyexpense/', {
        expenseID,
        expenseDescription,
        cashRegister,
        cashMovementId,
        paidBy,
        amount,
        notes,
      }, config);

      const updateCashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
        balance: updatedBalance,
      }, config);

      if (updateCashRegister) {
        setbalance(updatedBalance);
        console.log('Expense created successfully');
      }
    } catch (error) {
      console.log(error);
      console.log('Failed to create expense');
    }
  };

  // Function to process and pay employee salary
  const paidSalary = async (e, id) => {
    e.preventDefault();
    try {
      // Prepare payload for updating payroll status
      const payload = {
        isPaid: true,
        paidBy: paidBy,
      };
      // Update payroll status via API call
      const updatePayRoll = await axios.put(`${apiUrl}/api/payroll/${id}`, payload, config);
      if (updatePayRoll) {
        // Create daily expense
        await createDailyExpense();
        // Log the update result
        console.log(updatePayRoll);
        getEmployees()
        getPayRoll()
        // Display a success toast notification upon successful payment
        toast.success('تم تسجيل دفع المرتب بنجاح');
      }
    } catch (error) {
      // Handle errors by displaying a toast notification
      console.error(error);
      toast.error('فشل تسجيل المرتب ! حاول مره اخري');
    }
  };



  const [filterEmployees, setfilterEmployees] = useState([])

  const filterEmployeesByJob = (role) => {
    getEmployees()
    if (ListOfEmployee.length > 0) {
      const FilterEmployees = ListOfEmployee.filter(employee => employee.role == role)
      setfilterEmployees(FilterEmployees)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status)
    getEmployees()
    const filteredEmployees = ListOfEmployee.filter(employee => employee.isActive == status)
    console.log(filteredEmployees)
    setfilterEmployees(filteredEmployees)

  }

  const searchByName = (Name) => {
    const employee = ListOfEmployee.filter((employee) => employee.fullname.startsWith(Name) == true)
    setfilterEmployees(employee)
  }



  // Fetch data on component mount
  useEffect(() => {
    getEmployees();
    getPayRoll()
    getEmployeTransactions();
    getallAttendanceRecords()
    // getAllCashRegisters();
  }, []);
  return (
    <detacontext.Consumer>
      {
        ({ usertitle, setisLoadiog, EditPagination, employeeLoginInfo, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الرواتب</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a className="btn btn-47 btn-success" onClick={addPayRoll}><i className="material-icons">&#xE147;</i> <span>تحديث كشف المرتبات</span></a>
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
                          </select>
                          <span>عنصر</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>الاسم</label>
                          <input type="text" class="form-control" onChange={(e) => searchByName(e.target.value)} />
                          <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الوظيفه</label>
                          <select class="form-control" onChange={(e) => filterEmployeesByJob(e.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="cashier">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                            <option value="deliveryman">ديليفري</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filterEmpByStatus(e.target.value)}>
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div>
                        <div className="filter-group">
                          <label>الشهر</label>
                          <select className="form-control" onChange={(e) => { setthismonth(e.target.value); console.log(e.target.value) }}>
                            <option>الكل</option>
                            {months.length > 0 ? months.map((month, i) => (
                              <option value={i} key={i}>{month}</option>
                            )) : ""}
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
                        <th>الاسم</th>
                        <th>الوظيفه</th>
                         <th>الشيفت</th>
                         <th>ساعات العمل</th>
                        <th>الاساسي</th>
                        <th>عدد ايام العمل</th>
                         <th>اجر اليوم</th>
                        <th>الحضور</th>
                        <th>الاجازات المدفوعه</th>
                        <th>عدد ايام الاضافي</th>
                        <th>اضافي</th>
                        <th>مكافاة</th>
                        <th>اجمالي المستحق</th>
                        <th>خصم</th>
                        <th>عدد ايام الغياب</th>
                        <th>غياب</th>
                        <th>سلف</th>
                        <th>تامين</th>
                        <th>ضريبه</th>
                        <th>اجمالي المستقطع</th>
                        <th>المستحق عن الشهر</th>
                        <th>دفع بواسطه</th>
                        <th>الدفع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                       
                          ListOfEmployee.length > 0 ? ListOfEmployee.map((employee, i) => {
                            if (employee.isActive == true && currentPayRoll.length > 0) {
                              return (
                                currentPayRoll.map((Roll, j) => {
                                  if (Roll.employeeId._id == employee._id) {
                                    return (
                                      <tr key={i}>
                                        <td>
                                          <span className="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                            <label htmlFor="checkbox1"></label>
                                          </span>
                                        </td>
                                        <td>{i + 1}</td>
                                        <td>{Roll.employeeName}</td>
                                        <td>{Roll.employeeId.role}</td>
                                        <td>{Roll.employeeId?.shift?.shftType}</td>
                                        <td>{Roll.shiftHour}</td>
                                        <td>{Roll.basicSalary}</td>
                                        <td>{Roll.salary}</td>
                                        <td>{Roll.OvertimeDays}</td>
                                        <td>{Roll.OvertimeValue}</td>
                                        <td>{Roll.Bonus}</td>
                                        <td>{Roll.totalDue}</td>
                                        <td>{Roll.Deduction}</td>
                                        <td>{Roll.AbsenceDeduction}</td>
                                        <td>{Roll.Predecessor}</td>
                                        <td>{Roll.insurance}</td>
                                        <td>{Roll.Tax}</td>
                                        <td>{Roll.TotalDeductible}</td>
                                        <td>{Roll.NetSalary}</td>
                                        <td>{Roll.paidBy?.username}</td>
                                        {Roll.isPaid === false ? (
                                          <td>
                                            <a
                                              href="#paidModal"
                                              type='button'
                                              data-toggle="modal"
                                              className="btn btn-47 btn-success"
                                              onClick={() => handelPaid(Roll._id, Roll.NetSalary, employeeLoginInfo.employeeinfo.id, employee._id, employee.fullname, Roll.Month)}
                                            >
                                              دفع
                                            </a>
                                          </td>
                                        ) : (
                                          <td>تم الدفع</td>
                                        )}
                                      </tr>
                                    )
                                  }
                                }
                                )
                              )
                            }
                          })
                            : ""}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{ListOfEmployee.length > endpagination ? endpagination : ListOfEmployee.length}</b> out of <b>{ListOfEmployee.length}</b> entries</div>
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
              

              <div id="paidModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => paidSalary(e, rollId)}>
                      <div className="modal-header">
                        <h4 className="modal-title">دفع راتب</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p className="text-center" style={{ fontSize: '20px', marginBottom: '1' }}>هل أنت متأكد من دفع {amount} مرتب {employeeName} ؟</p>
                        <p className="text-center text-warning" style={{ fontSize: '16px', marginBottom: '0' }}>لا يمكن الرجوع في هذا الإجراء.</p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="الغاء" />
                        <input type="submit" className="btn btn-47 btn-danger" value="تاكيد الدفع" />
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

export default PayRoll