import React from 'react';
import './App.css';
import Home from './Home';
import AppNavbar from './AppNavbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExpenseTypeList from './ExpenseTypeList';
import ExpenseTypeEdit from "./ExpenseTypeEdit";
import PropertyList from './property/PropertyList';
import PropertyEdit from "./property/PropertyEdit";
import LeaseHome from "./tenant/LeaseHome";
import LeaseEdit from "./tenant/LeaseEdit";


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
                        <Route path='/leases/:id' element={<LeaseEdit />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;