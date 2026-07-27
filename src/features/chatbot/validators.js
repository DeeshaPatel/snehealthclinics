export function validateEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
    
    }
    
    
    
    export function validatePhone(phone){
    
    return /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/
    .test(phone);
    
    }
    
    
    
    export function validateName(name){
    
    return /^[A-Za-z]+$/.test(name);
    
    }