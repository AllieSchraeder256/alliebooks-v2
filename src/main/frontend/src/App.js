import React from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExpenseTypeList from './admin/ExpenseTypeList';
import ExpenseTypeEdit from "./admin/ExpenseTypeEdit";
import PropertyList from './property/PropertyList';
import PropertyEdit from "./property/PropertyEdit";
import LeaseHome from "./lease/LeaseHome";
import LeaseEdit from "./lease/LeaseEdit";
import TenantList from "./tenant/TenantList";
import TenantDetails from "./tenant/TenantDetails";
import TenantEdit from "./tenant/TenantEdit";
import RentPaymentHome from "./rent-payment/RentPaymentHome";
import RentPaymentEdit from "./rent-payment/RentPaymentEdit";
import ExpenseHome from "./expense/ExpenseHome";
import ExpenseEdit from "./expense/ExpenseEdit";
import SignupForm from './components/SignupForm';
import AdminHome from "./admin/AdminHome";
import LoginForm from './components/LoginForm';
import OcrTokenList from './admin/OcrTokenList';
import OcrTokenEdit from './admin/OcrTokenEdit';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppNavbar />} >
                        {/* Public routes */}
                        <Route path='/login' element={<LoginForm />}/>
                        <Route path='/signup' element={<SignupForm />}/>

                        {/* Protected routes */}
                        {/*<Route element={<RequireAuth />}>*/}
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
                            <Route path='/expenses' exact={true} element={<ExpenseHome />}/>
                            <Route path='/expenses/:id' element={<ExpenseEdit />}/>
                            <Route path='/admin' exact={true} element={<AdminHome />}/>
                            <Route path='/ocr-tokens' exact={true} element={<OcrTokenList />}/>
                            <Route path='/ocr-tokens/:id' element={<OcrTokenEdit />}/>
                        {/*</Route>*/}
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;