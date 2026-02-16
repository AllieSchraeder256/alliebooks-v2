import React, {useState} from 'react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem
} from 'reactstrap';
import ProfitLossReport from './ProfitLossReport';

const ReportHome = () => {
    // Open the first accordion section by default
    const [accordionOpen, setAccordionOpen] = useState('1');

    const toggle = (id) => {
        if (accordionOpen === id) {
            setAccordionOpen('');
        } else {
            setAccordionOpen(id);
        }
    };

    return (
        <>
        <Accordion flush open={accordionOpen} toggle={toggle} style={{padding: '0px'}}>
            <AccordionItem>
                <AccordionHeader targetId="1">
                    Profit and Loss
                </AccordionHeader>
                <AccordionBody accordionId="1">
                    <ProfitLossReport />
                </AccordionBody>
            </AccordionItem>
        </Accordion>
        </>
    );
}

export default ReportHome;