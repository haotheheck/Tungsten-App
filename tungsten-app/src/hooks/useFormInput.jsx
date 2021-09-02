import {useState} from 'react';
// simple hook for hadnling form onchange and storing the input values. 

function useFormInput(props) {   // https://reactjs.org/docs/hooks-intro.html --> At React Conf 2018
    
    const [value, setValue] = useState(props);
    
    function handleChange({currentTarget: input}) {
        setValue(input.value);
    };
    
    return {
        value,
        onChange: handleChange
    };
}

export default useFormInput;
