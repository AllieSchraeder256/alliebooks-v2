import React from 'react';
import './App.css';
import Home from './Home';
import AppNavbar from './AppNavbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExpenseTypeList from './ExpenseTypeList';
import ExpenseTypeEdit from "./ExpenseTypeEdit";
import PropertyList from './property/PropertyList';
import PropertyEdit from "./property/PropertyEdit";
import LeaseHome from "./lease/LeaseHome";
import LeaseEdit from "./lease/LeaseEdit";
import TenantList from "./tenant/TenantList";
import TenantDetails from "./tenant/TenantDetails";
import TenantEdit from "./tenant/TenantEdit";
import RentPaymentHome from "./rent-payment/RentPaymentHome";
import RentPaymentEdit from "./rent-payment/RentPaymentEdit";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppNavbar />} >
                        <Route path='/' exact={true} element={<LeaseHome />}/>
                        <Route path='/expense-types' exact={true} element={<ExpenseTypeList />}/>
                        <Route path='/expense-types/:id' element={<ExpenseTypeEdit />}/>
                        <Route path='/properties' exact={true} element={<PropertyList />}/>
                        <Route path='/properties/:id' element={<PropertyEdit />}/>
                        <Route path='/leases' exact={true} element={<LeaseHome />}/>
                        <Route path='/leases/:id' element={<LeaseEdit />}/>
                        <Route path='/tenants' exact={true} element={<TenantList />}/>
                        <Route path='/tenants/:id' element={<TenantDetails />}/>
                        <Route path='/tenants/edit/:id' element={<TenantEdit />}/>
                        <Route path='/rent-payments' exact={true} element={<RentPaymentHome />}/>
                        <Route path='/rent-payments/:id' element={<RentPaymentEdit />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;