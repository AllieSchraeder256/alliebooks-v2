import React from 'react';
import './App.css';
import Home from './Home';
import AppNavbar from './AppNavbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExpenseTypeList from './ExpenseTypeList';
import ExpenseTypeEdit from "./ExpenseTypeEdit";
import PropertyList from './property/PropertyList';
import PropertyEdit from "./property/PropertyEdit";
import TenantHome from "./tenant/TenantHome";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppNavbar />} >
                        <Route path='/' exact={true} element={<Home />}/>
                        <Route path='/expense-types' exact={true} element={<ExpenseTypeList />}/>
                        <Route path='/expense-types/:id' element={<ExpenseTypeEdit />}/>
                        <Route path='/properties' exact={true} element={<PropertyList />}/>
                        <Route path='/properties/:id' element={<PropertyEdit />}/>
                        <Route path='/tenants' element={<TenantHome />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;