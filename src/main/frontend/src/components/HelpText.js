import {
    UncontrolledTooltip
} from 'reactstrap';

const HelpText = (text) => {
    return (
        <>
            <span id="help-text" style={{ cursor: "pointer", paddingLeft:"5px", paddingRight:"5px", fontSize: "25px"}}>🤔</span>
            <UncontrolledTooltip target="help-text">
                { text.text }
            </UncontrolledTooltip>
        </>
    );
}
export default HelpText;