import React, {useState} from 'react';
import {
    UncontrolledAccordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem
} from 'reactstrap';
import ProfitLossReport from './ProfitLossReport';
import ExpenseReport from './ExpenseReport';

const ReportHome = () => {
    return (
        <>
        <UncontrolledAccordion stayOpen defaultOpen={['1', '2']}  style={{padding: '0px'}}>
            <AccordionItem>
                <AccordionHeader targetId="1">
                    Profit and Loss
                </AccordionHeader>
                <AccordionBody accordionId="1">
                    <ProfitLossReport />
                </AccordionBody>
                <AccordionHeader targetId="2">
                    Expense Detail
                </AccordionHeader>
                <AccordionBody accordionId="2">
                    <ExpenseReport />
                </AccordionBody>
            </AccordionItem>
        </UncontrolledAccordion>
        </>
    );
}

export default ReportHome;